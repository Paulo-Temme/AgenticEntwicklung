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

1. Installiere Git, Node.js ab Version 22 und VS Code.
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
3. Die Spec in `specs/F-XX/spec.md` lesen. Stimmen die Akzeptanzkriterien? Dann freigeben.
4. Warten, bis der Orchestrator die Zusammenfassung zeigt.
5. Selbst prüfen:
   ```bash
   make check
   git log --oneline main..HEAD
   git diff main --stat
   ```
   Dann die App starten und die Story von Hand ausprobieren.
6. Hochladen und Pull Request öffnen:
   ```bash
   git push -u origin feature/F-XX-kurzname
   ```
7. CI abwarten, Pull Request von einer zweiten Person lesen lassen, mergen.
8. Aufräumen:
   ```bash
   git switch main
   git pull
   git branch -d feature/F-XX-kurzname
   ```

## Die vier Befehle

| Befehl | Zweck |
| --- | --- |
| `/status` | Wo steht das Projekt, was ist als Nächstes dran? |
| `/feature F-XX` | eine Story umsetzen |
| `/epic <Beschreibung>` | ein neues Epic in Stories zerlegen |
| `/start` | nur beim Projektstart: Vision und Architektur |

## Wo steht was

| Frage | Datei |
| --- | --- |
| Was wollen wir erreichen? | `docs/vision.md` |
| Wie ist die App aufgebaut? | `docs/architecture.md` |
| Was ist zu tun, was ist fertig? | `docs/backlog.md` |
| Was genau soll Story F-XX können? | `specs/F-XX/spec.md` |
| Was haben die Agenten bei F-XX getan? | `specs/F-XX/log.md` |
| Warum wurde etwas so entschieden? | `docs/decisions/` |
| Welche Regeln gelten für Agenten? | `CLAUDE.md` |
| Wie läuft der ganze Prozess? | `docs/prozess.md` |
| Wie messen wir mit SE-Eval? | `docs/se-eval.md` |

## Wenn etwas schiefgeht

- Agent stoppt nach drei Versuchen: Ausgabe lesen, Ursache klären, Story notfalls teilen.
- `make check` ist rot: nicht pushen. Erst beheben.
- Fehler in der fertigen App: einen Test schreiben, der ihn zeigt, dann als eigene Story beheben
  und die Ursache in `docs/learnings.md` eintragen.
- Du verstehst geänderten Code nicht: den Agenten erklären lassen, bevor du pushst.
