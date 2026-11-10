# AgenticEntwicklung

Vorlage für Projekte, die mit KI-Agenten entwickelt und mit SE-Eval gemessen werden.
Stack: Next.js, TypeScript, Vitest.

## Idee
- Der Mensch gibt Vision und Epics vor, gibt Architektur und Specs frei, probiert die App aus, pusht und mergt.
- Ein Orchestrator steuert fünf Rollen: architect, planner, tester, coder, reviewer.
- Die CI prüft jeden Pull Request. SE-Eval misst pro Epic.

Neu im Team? Lies zuerst `docs/einstieg.md`. Der ganze Ablauf mit Diagramm steht in `docs/prozess.md`.

## Inhalt
| Datei / Ordner | Zweck |
| --- | --- |
| `CLAUDE.md` | Regeln für alle Agenten, Aufgaben des Orchestrators |
| `Makefile` | Befehlsvertrag: setup, lint, typecheck, test, coverage, check |
| `.claude/agents/` | Rollen: architect, planner, tester, coder, reviewer |
| `.claude/commands/` | `/start`, `/epic`, `/feature`, `/status` |
| `.claude/settings.json` | sperrt push, pull, merge und `.env` für Agenten |
| `docs/vision.md` | Ziele, Stakeholder, Qualitätsziele, Randbedingungen |
| `docs/architecture.md` | Architekturtreiber, Stil, Bausteine, Datenmodell |
| `docs/backlog.md` | Epics und Stories mit Priorität und Status |
| `docs/decisions/`, `docs/learnings.md`, `docs/tech-debt.md` | Entscheidungen, Erkenntnisse, Aufgeschobenes |
| `docs/prozess.md` | Ablauf, Rollen, Freigabepunkte |
| `docs/se-eval.md` | Anleitung zur Messung mit SE-Eval |
| `specs/_vorlage/` | Vorlagen für Spec und Protokoll |
| `.github/` | CI und Vorlage für Pull Requests |

## Neues Projekt starten
1. Auf GitHub bei diesem Repo "Use this template" wählen und ein neues privates Repo anlegen. Klonen.
   (Besteht das Projekt-Repo schon, stattdessen die Dateien dieser Vorlage hineinkopieren, siehe Schritt 3.)
2. Die Next.js-App in einem Hilfsordner neben dem Projekt anlegen und hineinkopieren.
   Der Hilfsordner ist nötig, weil `create-next-app` nicht in einen Ordner mit vorhandenen Dateien schreibt.
   ```bash
   npx create-next-app@latest app-neu --typescript --eslint --src-dir --app --use-npm
   rsync -a --exclude .git app-neu/ <Projekt>/
   rm -rf app-neu
   ```
3. Nur bei einem schon bestehenden Projekt-Repo: die Vorlage darüberkopieren. Die Regeln der Vorlage gewinnen.
   ```bash
   rsync -a --exclude .git --exclude README.md AgenticEntwicklung/ <Projekt>/
   ```
4. Im Projekt: `git switch -c setup/grundgeruest`, dann
   ```bash
   npm i -D @types/node@^22 vitest @vitest/coverage-v8
   make check
   ```
5. Committen, selbst pushen, Pull Request, mergen.
6. In den Repo-Einstellungen `main` schützen: Merge nur per Pull Request und mit grüner CI.
7. In VS Code öffnen, neuen Branch `setup/vision` anlegen und in Claude Code `/start` eingeben.
   Vision beantworten und freigeben, Architektur freigeben, pushen und mergen.

## Tägliche Arbeit
1. `git switch main && git pull`
2. Neues Epic: `/epic <Beschreibung>`, Story-Liste prüfen und freigeben.
3. `git switch -c feature/F-XX-kurzname`
4. `/feature F-XX`. Spec lesen und freigeben. Agenten arbeiten lassen.
5. Selbst prüfen: `make check`, `git log --oneline main..HEAD`, `git diff main --stat`, App ausprobieren.
6. `git push -u origin feature/F-XX-kurzname`, Pull Request öffnen, CI abwarten, mergen.
7. `git switch main && git pull && git branch -d feature/F-XX-kurzname`
8. Nach einem fertigen Epic: mit SE-Eval messen (`docs/se-eval.md`).

`/status` zeigt jederzeit, wo das Projekt steht.

## Grenzen
- Agenten pushen und mergen nie.
- Code zu Login, Rechten, Zahlungen und Datenbankschema liest der Mensch selbst.
- Nach drei gescheiterten Versuchen stoppt der Agent und fragt nach.
