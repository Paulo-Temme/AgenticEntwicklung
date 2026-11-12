# Einstieg für neue Teammitglieder

Zehn Minuten lesen, dann kannst du mitarbeiten.

## Die drei Ordner

| Ordner | Was es ist | Wer braucht ihn |
| --- | --- | --- |
| Projekt (zum Beispiel SportMate) | die App mit allen Regeln und Agenten | jeder im Team |
| SE-Eval (`Programm-zum-Testen-von-Code`) | Messwerkzeug für die Qualität | nur wer misst |
| AgenticEntwicklung | die Vorlage, aus der neue Projekte entstehen | nur wer ein neues Projekt startet oder die Vorlage verbessert |

Zum Mitarbeiten reicht das Projekt-Repo. Alles, was die Agenten brauchen, liegt darin.

## Einrichten (einmalig)

1. Installiere Git, Node.js ab Version 22, VS Code und `make`
   (Windows: `winget install ezwinports.make`, danach das Terminal neu öffnen).
2. Installiere in VS Code die Erweiterung Claude Code und melde dich an.
3. Klone das Projekt und öffne es:
   ```bash
   git clone <URL des Projekts>
   cd <Projekt>
   make setup
   make check
   ```
   `make check` muss grün sein. Wenn nicht, zuerst im Team klären.

## So arbeiten wir

- Der Mensch entscheidet, die Agenten setzen um. Du gibst frei: Spec, Push und Merge.
- Immer nur eine Story pro Person, eine Story = ein Branch = ein Pull Request.
- Feedback zählt nur von echten Personen außerhalb des Teams. Nach jedem Gespräch: `/feedback`.
- Zeit täglich in `docs/management/zeiterfassung.csv` eintragen.
- Nur Menschen führen `git pull`, `git push` und den Merge aus.
- Niemand committet direkt auf `main`.

## Eine Story umsetzen

1. Aktuellen Stand holen und Branch anlegen:
   ```bash
   git switch main
   git pull
   git switch -c feature/F-XX-kurzname
   ```
2. In Claude Code eingeben: `/feature F-XX`
3. Die Spec in `specs/F-XX/spec.md` lesen. Stimmen Herkunft und Akzeptanzkriterien? Dann freigeben.
4. Warten, bis der Orchestrator die Zusammenfassung zeigt.
5. Selbst prüfen:
   ```bash
   make check
   git log --oneline main..HEAD
   git diff main --stat
   ```
   Dann die App starten, die manuellen Testfälle der Spec ausführen und das Ergebnis dort eintragen.
   Bug-Tickets anlegen, die das Review vorschlägt (`specs/F-XX/review.md`).
6. Hochladen und Pull Request öffnen:
   ```bash
   git push -u origin feature/F-XX-kurzname
   ```
7. CI abwarten, Pull Request von einer zweiten Person nach `docs/review-leitfaden.md` prüfen lassen, mergen.
8. Aufräumen:
   ```bash
   git switch main
   git pull
   git branch -d feature/F-XX-kurzname
   ```

## Die Befehle

| Befehl | Zweck |
| --- | --- |
| `/status` | Wo steht das Projekt, was ist als Nächstes dran? |
| `/feature F-XX` | eine Story umsetzen |
| `/epic <Beschreibung>` | ein neues Epic in Stories zerlegen |
| `/start` | nur beim Projektstart: Vision und Architektur |
| `/feedback <Notizen>` | echtes Feedback auswerten und Konsequenzen entscheiden |
| `/retro <Sprint>` | Retrospektive vorbereiten und festhalten |
| `/abgabe` | Entwürfe der Abgabedokumente und Liste der Lücken |

## Wo steht was

| Frage | Datei |
| --- | --- |
| Was wollen wir erreichen? | `docs/vision.md` |
| Was haben echte Personen gesagt, und was folgte daraus? | `docs/feedback.md` |
| Wie ist die App aufgebaut? | `docs/architecture.md` |
| Was ist zu tun, was ist fertig? | `docs/backlog.md` |
| Was genau soll Story F-XX können? | `specs/F-XX/spec.md` |
| Was haben die Agenten bei F-XX getan? | `specs/F-XX/log.md` |
| Was hat das Review gefunden? | `specs/F-XX/review.md` |
| Ist jede Anforderung getestet? | `docs/traceability.md` (`make trace`) |
| Wie testen und reviewen wir? | `docs/teststrategie.md`, `docs/review-leitfaden.md` |
| Was muss in die Abgabe? | `docs/abgabe.md` |
| Warum wurde etwas so entschieden? | `docs/decisions/` |
| Welche Regeln gelten für Agenten? | `CLAUDE.md` |
| Wie läuft der ganze Prozess? | `docs/prozess.md` |
| Wie messen wir mit SE-Eval? | `docs/se-eval.md` |

## Wenn etwas schiefgeht

- Agent stoppt nach drei Versuchen: Ausgabe lesen, Ursache klären, Story notfalls teilen.
- "Schutz-Hook: ..." in der Ausgabe: Ein Agent wollte etwas tun, das seiner Rolle nicht erlaubt ist.
  Das ist gewollt. Lies den Grund; meist ist die Spec oder ein Test falsch und muss vom Menschen geklärt werden.
- `make check` ist rot: nicht pushen. Erst beheben.
- Fehler in der fertigen App: einen Test schreiben, der ihn zeigt, dann als eigene Story beheben
  und die Ursache in `docs/learnings.md` eintragen.
- Du verstehst geänderten Code nicht: den Agenten erklären lassen, bevor du pushst.
