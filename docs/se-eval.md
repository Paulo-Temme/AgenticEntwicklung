# SE-Eval nutzen

SE-Eval misst ein Projekt von außen: statische Analyse, Tests, Coverage, Mutation Testing, Git und Pull Requests.
Es verbraucht keine KI-Tokens. Die CI entscheidet, ob ein Pull Request hinein darf. SE-Eval zeigt, wie sich die Qualität entwickelt.

## Wann messen
- einmal nach der ersten fertigen Story (Ausgangswert)
- nach jedem fertigen Epic
- vor einer Abgabe

## Voraussetzungen im Projekt
SE-Eval verlangt (siehe "Messvertrag" in seiner README):
- Next.js mit TypeScript, `package-lock.json` im Repo, `npm ci` läuft ohne `.env`
- Vitest als Test-Runner
- Tests nach den Namensregeln in `CLAUDE.md`
- Hauptbranch `main`, Feature-IDs `F-XX` in Branch oder Commit

Diese Vorlage hält alle Punkte ein.

## Ablauf
Ordner nebeneinander:

```
<Arbeitsordner>/
├─ Programm-zum-Testen-von-Code/   SE-Eval
├─ evaluation/                     Konfiguration und Ergebnisse
└─ <Projekt>/                      die App
```

Einmalig:

```bash
cd Programm-zum-Testen-von-Code
npm ci && npm run build
mkdir ../evaluation && cd ../evaluation
node ../Programm-zum-Testen-von-Code/dist/cli.js init
```

Danach `evaluation/eval.config.json` anpassen: Repo-Adresse des Projekts, Sprints mit Stichtag, Pfade unter `scope`.

Bei jeder Messung:

```bash
cd evaluation
export GITHUB_TOKEN=<nur lesender Token für private Repos>
node ../Programm-zum-Testen-von-Code/dist/cli.js check
node ../Programm-zum-Testen-von-Code/dist/cli.js measure -t all -s <sprint-id>
node ../Programm-zum-Testen-von-Code/dist/cli.js report
```

Der Bericht liegt danach in `evaluation/results/bericht.md`.

## Offen
- SE-Eval ist für den Vergleich zweier Teams gebaut. Ob eine Konfiguration mit nur einem Projekt durchläuft, zeigt `check`.
- Mutation Testing dauert lange. Für eine schnelle Zwischenmessung: `measure ... --skip mutation`.
