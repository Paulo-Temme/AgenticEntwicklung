---
description: Genau eine Story umsetzen – Spec, Tests, Code, Review
argument-hint: "F-XX"
---
Setze genau diese eine Story um: $ARGUMENTS

Du bist der Orchestrator. Du rufst die Rollen nacheinander auf und prüfst nach jedem Schritt das Ergebnis.
Du schreibst selbst keinen Anwendungscode.

1. Prüfe mit `git status`, dass der Arbeitsstand sauber ist und ich auf einem Branch `feature/F-XX-...` bin.
   Wenn nicht: stoppe und sage mir, welchen Befehl ich ausführen soll.
2. Prüfe in `docs/backlog.md`, dass diese Story nicht schon von jemand anderem bearbeitet wird.
   Setze sie auf "in Arbeit" und trage in "Wer" den Namen aus `git config user.name` ein.
3. planner: schreibe `specs/F-XX/spec.md`.
   Prüfung: Datei vorhanden, Herkunft ausgefüllt, jedes Kriterium nummeriert und mit Testebene, keine offenen Fragen.
   Sonst stoppen.
4. STOPP. Zeige mir Herkunft, Akzeptanzkriterien und Qualitätsanforderungen und warte auf meine Freigabe.
   Trage Freigabe, Datum und Namen in die Spec ein.
5. tester: schreibe die Tests.
   Prüfung: `make test` zeigt die neuen Tests als fehlgeschlagen, die alten grün. Ein Commit nur mit Tests.
6. coder: mache die Tests grün. Höchstens drei Versuche.
   Prüfung: `make check` grün, Testdateien seit dem Test-Commit unverändert, Commit vorhanden.
7. Führe `make coverage` und `make trace` aus.
8. reviewer: prüfe den Branch. Prüfung: `specs/F-XX/review.md` vorhanden.
   Bei blockierenden Befunden einmal zurück zu Schritt 6, danach prüft der reviewer erneut.
   Bleibt danach etwas Blockierendes: stoppe und berichte.
9. Trage ein: technische Schulden aus dem Review in `docs/tech-debt.md`, neue Erkenntnisse in `docs/learnings.md`,
   aufgetretene Probleme und ihre Lösung in `docs/management/probleme.md`.
10. Prüfe, dass `specs/F-XX/log.md` einen Eintrag von jeder Rolle enthält.
    Committe die Dokumente: `F-XX: Review und Protokoll`.
11. STOPP. Fasse zusammen:
    - was gebaut wurde und welche Dateien betroffen sind,
    - Ergebnis von Tests und Coverage,
    - wie ich es von Hand in der App prüfe (manuelle Testfälle aus der Spec),
    - Bug-Tickets, die ich laut Review anlegen soll,
    - ob ich Code selbst lesen muss (Login, Rechte, Zahlungen, Datenbankschema),
    - die Befehle, die ich jetzt selbst ausführe (`git push ...`),
    - Erinnerung: Zeit in `docs/management/zeiterfassung.csv` eintragen.

Du führst niemals `git push`, `git pull` oder `git merge` aus und beginnst keine zweite Story.
Die Story wird erst auf "fertig" gesetzt, wenn ich den Merge bestätige.
