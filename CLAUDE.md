# Projektregeln für alle Agenten

Diese Datei wird in jeder Sitzung gelesen. Kurz halten. Details stehen in `docs/prozess.md`.

## Stack
Next.js mit TypeScript, Tests mit Vitest, E2E mit Playwright (Ordner `e2e/`).
Der Stack ist so gewählt, dass SE-Eval das Projekt ohne Umbau messen kann.

## Befehle (Befehlsvertrag)
`make setup | lint | typecheck | test | coverage | check`
Agenten, CI und Menschen nutzen nur diese Befehle.

## Orchestrator
Die Hauptsitzung ist der Orchestrator. Sie schreibt selbst keinen Anwendungscode.
- Sie arbeitet nur über die Befehle `/start`, `/epic`, `/feature`, `/status`.
- Sie ruft die Rollen in fester Reihenfolge auf: architect, planner, tester, coder, reviewer.
- Sie prüft nach jedem Schritt das Ergebnis (Datei vorhanden, `make check`, Protokolleintrag), bevor sie weitergeht.
- Sie hält an den Freigabepunkten an und wartet auf den Menschen.
- Sie stoppt nach drei gescheiterten Versuchen und berichtet.
- Der Stand steht in `docs/backlog.md` (Status je Story) und `specs/F-XX/log.md` (Schritte je Story).

## Ordner
- `docs/vision.md` Ziele, Stakeholder, Randbedingungen. Quelle aller Epics.
- `docs/architecture.md` Architektur. Vor Codeänderungen lesen.
- `docs/backlog.md` Epics und Stories · `docs/decisions/` Entscheidungen
- `docs/learnings.md` Erkenntnisse · `docs/tech-debt.md` bewusst Aufgeschobenes
- `specs/F-XX/` Spec und Protokoll je Story
- `src/lib/` Kernlogik ohne UI (wird von SE-Eval mit Mutation Testing geprüft)
- `src/app/`, `src/components/` Oberfläche
- Unit-Tests `*.test.ts(x)` neben der Datei, Integrationstests `*.int.test.ts(x)` oder `tests/integration/`, E2E in `e2e/`

## Arbeitsweise
- Immer nur eine Story gleichzeitig. Eine Story = ein Branch `feature/F-XX-kurzname` = ein Pull Request.
- Tests zuerst. Kein Anwendungscode ohne vorher fehlschlagenden Test.
- Tests und Umsetzung werden getrennt committet: erst Tests, dann Code.
- Jede Commit-Nachricht beginnt mit der Feature-ID: `F-12: ...`.
- Vor jedem Commit muss `make check` grün sein.

## Entwurfsregeln
- Eine Datei, eine Aufgabe. Kernlogik kennt die Oberfläche nicht.
- Abhängigkeiten zeigen nur in eine Richtung: Oberfläche → Kernlogik → Datenzugriff.
- Details verbergen: Module geben nur frei, was andere brauchen.
- Nichts doppelt. Gleiche Logik wird einmal geschrieben und wiederverwendet.
- Einfachste Lösung, die die Spec erfüllt. Muster nur, wenn sie ein vorhandenes Problem lösen.
- Abweichungen von `docs/architecture.md` brauchen eine Notiz in `docs/decisions/`.

## Namen
- Variablen und Funktionen `camelCase`, Funktionen beginnen mit einem Verb (`findPartners`).
- Typen und Komponenten `PascalCase`, Substantiv (`TrainingSession`).
- Dateien `kebab-case`. Keine Abkürzungen, keine Namen wie `data`, `utils2`, `tmp`.
- Namen beschreiben den Inhalt, nicht den Typ.

## Nachvollziehbarkeit
- Jede öffentliche Funktion hat einen Kommentar: Zweck, Eingaben, Rückgabe, Fehlerfälle, Feature-ID.
- Funktionen bleiben klein. Kognitive Komplexität höchstens 15.
- Jeder Testname nennt das Akzeptanzkriterium: `F-12 AK2: lehnt leere Eingabe ab`.
- Jeder Agent trägt seinen Schritt in `specs/F-XX/log.md` ein.

## Verboten
- `git push`, `git pull`, `git merge`. Das macht nur der Mensch.
- Direkt auf `main` committen.
- Tests deaktivieren oder löschen, um sie grün zu bekommen.
- Lint-Regeln abschalten, `any`, `@ts-ignore`, `@ts-expect-error`, `eslint-disable`.
- `.env`-Dateien lesen oder schreiben. Keine Secrets im Code.

## Besondere Vorsicht
Bei Login, Rechten, Zahlungen und Änderungen am Datenbankschema: im Protokoll ausdrücklich markieren,
damit der Mensch diesen Code selbst liest.
