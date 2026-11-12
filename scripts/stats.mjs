// Projektstatistik für das Management-Dokument: Commits je Person und Woche, Codezuwachs über die Zeit,
// Hauptbeitragende je Datei, Aufwand je Person und Tätigkeit aus docs/management/zeiterfassung.csv.
// Schreibt docs/management/statistik.md. Zählt nur, bewertet nicht. Aufruf: make stats
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';

const EXCLUDED_FILES = /(^|\/)(package-lock\.json|.*\.lock|docs\/management\/statistik\.md|docs\/traceability\.md)$/;
const TIME_SHEET = 'docs/management/zeiterfassung.csv';

/** Führt git aus und liefert die Ausgabe als Text. */
function runGit(args) {
  return execFileSync('git', args, { encoding: 'utf8', maxBuffer: 256 * 1024 * 1024 });
}

/** Liefert den Montag der Woche eines Datums als JJJJ-MM-TT. */
function toWeekStart(isoDate) {
  const date = new Date(`${isoDate}T00:00:00Z`);
  date.setUTCDate(date.getUTCDate() - ((date.getUTCDay() + 6) % 7));
  return date.toISOString().slice(0, 10);
}

/** Erhöht einen Zähler in einer verschachtelten Map. */
function add(map, outerKey, innerKey, amount) {
  if (!map.has(outerKey)) map.set(outerKey, new Map());
  const inner = map.get(outerKey);
  inner.set(innerKey, (inner.get(innerKey) ?? 0) + amount);
}

/** Baut eine Markdown-Tabelle. */
function toTable(header, rows) {
  return [`| ${header.join(' | ')} |`, `| ${header.map(() => '---').join(' | ')} |`, ...rows.map((row) => `| ${row.join(' | ')} |`)].join('\n');
}

/** Liest das Git-Protokoll: je Commit Person, Datum und geänderte Zeilen je Datei (Mailmap wird beachtet). */
function readCommits() {
  const output = runGit(['log', '--no-merges', '--numstat', '--date=short', '--pretty=format:@@%aN|%ad|%b@@END']);
  const commits = [];
  for (const block of output.split(/^@@/m).filter(Boolean)) {
    const [head, rest = ''] = block.split('@@END');
    const [author, date, ...body] = head.split('|');
    const files = rest.split(/\r?\n/).filter(Boolean).map((line) => line.split('\t'))
      .filter(([added, , file]) => added !== '-' && file && !EXCLUDED_FILES.test(file))
      .map(([added, removed, file]) => ({ file, added: Number(added), removed: Number(removed) }));
    commits.push({ author, date, withAi: /co-authored-by:.*(claude|copilot|gpt|codex|gemini)/i.test(body.join('|')), files });
  }
  return commits.reverse();
}

/** Summiert Stunden aus der Zeiterfassung je Person und Tätigkeit. Dezimalkomma erlaubt. */
function readEffort() {
  const effort = new Map();
  if (!existsSync(TIME_SHEET)) return effort;
  for (const line of readFileSync(TIME_SHEET, 'utf8').split(/\r?\n/).slice(1)) {
    if (!line.trim() || line.startsWith('#')) continue;
    const [, person, hours, , activity] = line.split(';').map((cell) => cell.trim());
    const value = Number((hours ?? '').replace(',', '.'));
    if (person && Number.isFinite(value)) add(effort, person, activity || 'ohne Angabe', value);
  }
  return effort;
}

const commits = readCommits();
const perAuthor = new Map();
const perWeek = new Map();
const growth = new Map();
const perFile = new Map();
for (const commit of commits) {
  const week = toWeekStart(commit.date);
  const added = commit.files.reduce((sum, file) => sum + file.added, 0);
  const removed = commit.files.reduce((sum, file) => sum + file.removed, 0);
  add(perAuthor, commit.author, 'commits', 1);
  add(perAuthor, commit.author, 'added', added);
  add(perAuthor, commit.author, 'removed', removed);
  add(perAuthor, commit.author, `day:${commit.date}`, 1);
  add(perAuthor, commit.author, 'withAi', commit.withAi ? 1 : 0);
  add(perWeek, week, commit.author, 1);
  add(growth, week, 'added', added);
  add(growth, week, 'removed', removed);
  for (const file of commit.files) add(perFile, file.file, commit.author, file.added);
}

const authors = [...perAuthor.keys()].sort();
const trackedFiles = new Set(runGit(['ls-files']).split(/\r?\n/).filter(Boolean));
const sections = ['# Projektstatistik', '', `Erzeugt von \`make stats\` am ${new Date().toISOString().slice(0, 10)}. Nicht von Hand ändern.`,
  'Commits und Zeilen zeigen Aktivität, keine Leistung. Lockfiles und erzeugte Dateien sind ausgenommen.', ''];

sections.push('## Commits je Person', '', toTable(
  ['Person', 'Commits', 'Aktive Tage', 'Zeilen +', 'Zeilen −', 'Commits mit KI-Co-Autor'],
  authors.map((author) => {
    const data = perAuthor.get(author);
    const activeDays = [...data.keys()].filter((key) => key.startsWith('day:')).length;
    return [author, data.get('commits'), activeDays, data.get('added'), data.get('removed'), data.get('withAi')];
  }),
), '');

sections.push('## Commits je Woche', '', toTable(
  ['Woche ab', ...authors, 'Summe'],
  [...perWeek.keys()].sort().map((week) => {
    const counts = authors.map((author) => perWeek.get(week).get(author) ?? 0);
    return [week, ...counts, counts.reduce((sum, count) => sum + count, 0)];
  }),
), '');

let total = 0;
sections.push('## Codezuwachs über die Zeit', '', toTable(
  ['Woche ab', 'Zeilen +', 'Zeilen −', 'Netto', 'Stand'],
  [...growth.keys()].sort().map((week) => {
    const added = growth.get(week).get('added') ?? 0;
    const removed = growth.get(week).get('removed') ?? 0;
    total += added - removed;
    return [week, added, removed, added - removed, total];
  }),
), '');

sections.push('## Hauptbeitragende je Datei', '', 'Nach hinzugefügten Zeilen, nur Dateien, die es noch gibt.', '', toTable(
  ['Datei', 'Hauptbeitrag', 'Anteil', 'Weitere'],
  [...perFile.keys()].filter((file) => trackedFiles.has(file)).sort().map((file) => {
    const ranked = [...perFile.get(file).entries()].sort((first, second) => second[1] - first[1]);
    const sum = ranked.reduce((accumulator, [, lines]) => accumulator + lines, 0) || 1;
    return [`\`${file}\``, ranked[0][0], `${Math.round((ranked[0][1] / sum) * 100)} %`, ranked.slice(1).map(([name]) => name).join(', ') || '–'];
  }),
), '');

const effort = readEffort();
const activities = [...new Set([...effort.values()].flatMap((inner) => [...inner.keys()]))].sort();
sections.push('## Aufwand je Person und Tätigkeit (Stunden)', '', effort.size === 0
  ? `Noch keine Einträge in \`${TIME_SHEET}\`.`
  : toTable(['Person', ...activities, 'Summe'], [...effort.keys()].sort().map((person) => {
    const hours = activities.map((activity) => effort.get(person).get(activity) ?? 0);
    return [person, ...hours, hours.reduce((sum, value) => sum + value, 0)];
  })), '');

writeFileSync('docs/management/statistik.md', sections.join('\n'));
console.log(`docs/management/statistik.md geschrieben: ${commits.length} Commits, ${authors.length} Personen.`);
