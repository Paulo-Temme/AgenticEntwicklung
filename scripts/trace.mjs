// Nachvollziehbarkeit: Feedback → Story → Akzeptanzkriterium → Test → Datei.
// Liest docs/feedback.md, docs/backlog.md, specs/F-XX/spec.md und die Testdateien,
// schreibt docs/traceability.md und nennt Lücken. Mit --strict endet das Skript bei Lücken mit Fehler.
// Aufruf: make trace
import { existsSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const TEST_DIRECTORIES = ['src', 'tests', 'e2e'];
const TEST_FILE_PATTERN = /(\.(test|spec)\.[cm]?[jt]sx?$)|(^|\/)(e2e|tests|__tests__)\//;

/** Liest eine Datei relativ zum Projektordner. Leerer Text, wenn sie fehlt. */
function readText(relativePath) {
  const fullPath = path.join(ROOT, relativePath);
  return existsSync(fullPath) ? readFileSync(fullPath, 'utf8') : '';
}

/** Zerlegt Markdown-Tabellenzeilen in Zellen. Vorlagenzeilen mit <Platzhalter> und Trennzeilen entfallen. */
function parseTableRows(markdown, rowPattern) {
  return markdown
    .split(/\r?\n/)
    .filter((line) => rowPattern.test(line) && !line.includes('<'))
    .map((line) => line.split('|').slice(1, -1).map((cell) => cell.trim()));
}

/** Sammelt alle Dateien unter einem Ordner, ohne node_modules und versteckte Ordner. */
function listFiles(relativeDirectory) {
  const fullPath = path.join(ROOT, relativeDirectory);
  if (!existsSync(fullPath)) return [];
  return readdirSync(fullPath, { withFileTypes: true }).flatMap((entry) => {
    const relativePath = `${relativeDirectory}/${entry.name}`;
    if (entry.name === 'node_modules' || entry.name.startsWith('.')) return [];
    return entry.isDirectory() ? listFiles(relativePath) : [relativePath];
  });
}

/** Findet in den Testdateien alle Verweise der Form "F-12 AK2" und liefert Schlüssel → Dateien. */
function collectTestReferences() {
  const references = new Map();
  const testFiles = TEST_DIRECTORIES.flatMap(listFiles).filter((file) => TEST_FILE_PATTERN.test(file));
  for (const file of testFiles) {
    for (const match of readText(file).matchAll(/\b(F-\d+)\s+(AK\d+)\b/g)) {
      const key = `${match[1]} ${match[2]}`;
      references.set(key, new Set([...(references.get(key) ?? []), file]));
    }
  }
  return references;
}

/** Liest aus einer Spec Status, Quelle und Kriterien mit Testebene. */
function parseSpec(featureId) {
  const text = readText(`specs/${featureId}/spec.md`);
  const criteria = [...text.matchAll(/^- (AK\d+)\s*(?:\(([^)]*)\))?\s*:/gm)].map((match) => ({
    id: match[1],
    level: (match[2] ?? '').trim(),
  }));
  return {
    exists: text !== '',
    approved: /^Status:.*freigegeben am \d/m.test(text),
    hasReview: existsSync(path.join(ROOT, `specs/${featureId}/review.md`)),
    criteria,
  };
}

const feedbackRows = parseTableRows(readText('docs/feedback.md'), /^\|\s*FB-\d+/).map((cells) => ({
  id: cells[0],
  statement: cells[4] ?? '',
  consequence: cells[6] ?? '',
  stories: cells[7] ?? '',
  status: cells[8] ?? '',
}));
const stories = parseTableRows(readText('docs/backlog.md'), /^\|[^|]*\|\s*F-\d+/).map((cells) => ({
  epic: cells[0],
  id: cells[1],
  title: cells[2],
  source: cells[3] ?? '',
  status: cells[6] ?? '',
}));
const testReferences = collectTestReferences();
const gaps = [];
const lines = [
  '# Nachvollziehbarkeit',
  '',
  'Erzeugt von `make trace`. Nicht von Hand ändern.',
  '',
  '## Feedback → Story',
  '',
  '| Feedback | Aussage | Konsequenz | Stories | Status |',
  '| --- | --- | --- | --- | --- |',
];

for (const feedback of feedbackRows) {
  const linked = stories.filter((story) => story.source.includes(feedback.id)).map((story) => story.id);
  const named = feedback.stories.match(/F-\d+/g) ?? [];
  const all = [...new Set([...linked, ...named])];
  lines.push(`| ${feedback.id} | ${feedback.statement} | ${feedback.consequence} | ${all.join(', ') || '–'} | ${feedback.status} |`);
  if (!/entschieden/i.test(feedback.status)) gaps.push(`${feedback.id}: Konsequenz noch nicht entschieden.`);
  else if (all.length === 0 && !/keine Änderung/i.test(feedback.consequence)) gaps.push(`${feedback.id}: entschieden, aber keine Story verweist darauf.`);
}

lines.push('', '## Story → Kriterium → Test', '', '| Story | Quelle | Status | Kriterium | Ebene | Testdateien |', '| --- | --- | --- | --- | --- | --- |');
const knownCriteria = new Set();
for (const story of stories) {
  const spec = parseSpec(story.id);
  const started = /in Arbeit|fertig/i.test(story.status);
  if (!story.source || story.source === '–') gaps.push(`${story.id}: keine Quelle (Feedback-ID, Ziel oder "Annahme") im Backlog.`);
  if (started && !spec.exists) gaps.push(`${story.id}: Status "${story.status}", aber keine Spec.`);
  if (started && spec.exists && !spec.approved) gaps.push(`${story.id}: Spec ohne Freigabe.`);
  if (/fertig/i.test(story.status) && !spec.hasReview) gaps.push(`${story.id}: fertig, aber kein review.md.`);
  if (spec.criteria.length === 0) lines.push(`| ${story.id} | ${story.source} | ${story.status} | – | – | – |`);
  for (const criterion of spec.criteria) {
    const key = `${story.id} ${criterion.id}`;
    knownCriteria.add(key);
    const files = [...(testReferences.get(key) ?? [])];
    const manual = /manuell/i.test(criterion.level);
    lines.push(`| ${story.id} | ${story.source} | ${story.status} | ${criterion.id} | ${criterion.level || '?'} | ${files.join('<br>') || (manual ? 'manueller Testfall in der Spec' : '–')} |`);
    if (started && files.length === 0 && !manual) gaps.push(`${key}: kein Test mit diesem Namen gefunden.`);
  }
}
for (const key of testReferences.keys()) {
  if (!knownCriteria.has(key)) gaps.push(`${key}: Test verweist auf ein Kriterium, das in keiner Spec steht.`);
}

lines.push('', '## Lücken', '', ...(gaps.length > 0 ? gaps.map((gap) => `- ${gap}`) : ['Keine.']), '');
writeFileSync(path.join(ROOT, 'docs/traceability.md'), lines.join('\n'));
console.log(`docs/traceability.md geschrieben: ${feedbackRows.length} Feedback, ${stories.length} Stories, ${gaps.length} Lücken.`);
for (const gap of gaps) console.log(`  Lücke: ${gap}`);
if (gaps.length > 0 && process.argv.includes('--strict')) process.exit(1);
