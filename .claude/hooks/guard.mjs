// Schutz-Hook (PreToolUse). Setzt die Regeln aus CLAUDE.md technisch durch, statt nur darum zu bitten.
// Eingabe: JSON auf stdin (tool_name, tool_input, cwd, agent_type). Ablehnen: Exit-Code 2, Grund auf stderr.
// Prüft: git push/pull/merge, Commit auf main, --no-verify, .env-Dateien, Schreibbereich je Rolle.
import { readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import path from 'node:path';

/** Erlaubte Schreibbereiche je Rolle. Pfade relativ zum Projektordner, mit "/". */
const ROLE_RULES = {
  architect: { allow: [/^docs\/architecture\.md$/, /^docs\/decisions\//] },
  planner: { allow: [/^specs\//] },
  tester: { allow: [isTestFile, /^specs\//] },
  coder: { deny: [isTestFile, /^specs\/[^/]+\/(spec|review)\.md$/] },
  reviewer: { allow: [/^specs\/[^/]+\/(review|log)\.md$/] },
  analyst: { allow: [/^docs\/feedback\.md$/, /^docs\/feedback\//] },
  reporter: { allow: [/^abgabe\//] },
};

const GIT_OPTIONS_WITH_VALUE = new Set(['-C', '-c', '--git-dir', '--work-tree', '--namespace']);
const FORBIDDEN_GIT = new Set(['push', 'pull', 'merge']);
const PROTECTED_BRANCHES = new Set(['main', 'master']);

/** Erkennt Testdateien nach den Namensregeln aus CLAUDE.md. */
function isTestFile(relativePath) {
  return (
    /\.(test|spec)\.[cm]?[jt]sx?$/.test(relativePath) ||
    /^(e2e|tests)\//.test(relativePath) ||
    /(^|\/)__tests__\//.test(relativePath)
  );
}

/** Prüft, ob ein Muster (RegExp oder Funktion) auf den Pfad passt. */
function matches(pattern, relativePath) {
  return typeof pattern === 'function' ? pattern(relativePath) : pattern.test(relativePath);
}

/** Beendet den Hook mit einer Ablehnung. Der Text geht an den Agenten. */
function deny(reason) {
  process.stderr.write(`Schutz-Hook: ${reason}\n`);
  process.exit(2);
}

/** Liefert die git-Unterbefehle einer Shell-Zeile, zum Beispiel ["commit", "status"]. */
function findGitSubcommands(command) {
  const subcommands = [];
  for (const segment of command.split(/&&|\|\||[;|\n]|\$\(|`/)) {
    const tokens = segment.trim().split(/\s+/).filter(Boolean);
    while (tokens.length > 0 && /^[A-Za-z_][A-Za-z0-9_]*=/.test(tokens[0])) tokens.shift();
    if (tokens[0] !== 'git' && tokens[0] !== 'git.exe') continue;
    let index = 1;
    while (index < tokens.length && tokens[index].startsWith('-')) {
      index += GIT_OPTIONS_WITH_VALUE.has(tokens[index]) ? 2 : 1;
    }
    if (tokens[index]) subcommands.push(tokens[index]);
  }
  return subcommands;
}

/** Liest den aktuellen Branch. Leerer Text, wenn kein Git-Repo oder losgelöster HEAD. */
function readCurrentBranch(cwd) {
  try {
    return execFileSync('git', ['symbolic-ref', '--short', 'HEAD'], { cwd, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
  } catch {
    return '';
  }
}

function checkBash(command, cwd) {
  const subcommands = findGitSubcommands(command);
  const forbidden = subcommands.find((subcommand) => FORBIDDEN_GIT.has(subcommand));
  if (forbidden) deny(`"git ${forbidden}" führt nur der Mensch aus. Nenne dem Menschen den Befehl.`);
  if (subcommands.includes('commit')) {
    if (command.includes('--no-verify')) deny('Commits ohne Prüfungen (--no-verify) sind nicht erlaubt.');
    const branch = readCurrentBranch(cwd);
    if (PROTECTED_BRANCHES.has(branch)) {
      deny(`Kein Commit direkt auf "${branch}". Der Mensch legt zuerst einen Branch an: git switch -c feature/F-XX-kurzname`);
    }
  }
  if (/(^|[\s"'/=<>])\.env(\.(?!example)[\w.-]+)?(?=$|[\s"';|&)>])/.test(command)) deny('.env-Dateien werden von Agenten weder gelesen noch geschrieben.');
}

function checkWrite(filePath, projectDir, role) {
  const relativePath = path.relative(projectDir, path.resolve(projectDir, filePath)).split(path.sep).join('/');
  const baseName = path.basename(relativePath);
  if (baseName === '.env' || (baseName.startsWith('.env.') && baseName !== '.env.example')) {
    deny('.env-Dateien werden von Agenten weder gelesen noch geschrieben.');
  }
  const rule = ROLE_RULES[role];
  if (!rule) return;
  if (rule.deny?.some((pattern) => matches(pattern, relativePath))) {
    deny(`Die Rolle "${role}" darf "${relativePath}" nicht ändern. Stoppe und melde, warum eine Änderung nötig wäre.`);
  }
  if (rule.allow && !rule.allow.some((pattern) => matches(pattern, relativePath))) {
    deny(`Die Rolle "${role}" darf nur in ihrem Bereich schreiben, nicht in "${relativePath}". Siehe docs/prozess.md, Tabelle "Rollen".`);
  }
}

function main() {
  let input;
  try {
    input = JSON.parse(readFileSync(0, 'utf8'));
  } catch {
    return; // Unlesbare Eingabe: nichts entscheiden, normale Rechteprüfung gilt.
  }
  const toolInput = input.tool_input ?? {};
  const cwd = input.cwd ?? process.cwd();
  const projectDir = process.env.CLAUDE_PROJECT_DIR || cwd;
  if (input.tool_name === 'Bash' && typeof toolInput.command === 'string') checkBash(toolInput.command, cwd);
  const filePath = toolInput.file_path ?? toolInput.notebook_path;
  if (typeof filePath === 'string') checkWrite(filePath, projectDir, input.agent_type);
}

main();
