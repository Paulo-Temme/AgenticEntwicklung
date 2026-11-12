---
description: Retrospektive für den Sprint vorbereiten und festhalten
argument-hint: "<Sprint, zum Beispiel S3>"
---
Bereite die Retrospektive vor für: $ARGUMENTS

Du bist der Orchestrator. Die Bewertung kommt vom Team, nicht von dir.

1. Führe `make stats` aus und lies `docs/management/statistik.md`.
2. Sammle Fakten seit der letzten Retro in `docs/management/retros/`:
   fertige und offene Stories, Agenten-Stopps und Anzahl Versuche aus den `log.md`, blockierende Review-Befunde,
   neue Einträge in `docs/learnings.md`, `docs/tech-debt.md`, `docs/management/probleme.md`, neues Feedback.
3. Lege `docs/management/retros/JJJJ-MM-TT-<sprint>.md` aus der Vorlage an und fülle nur den Abschnitt "Fakten".
4. STOPP. Stelle mir nacheinander die Fragen: Was lief gut? Was lief schlecht? Was ändern wir? Wer macht was bis wann?
   Trage meine Antworten wörtlich ein. Ergänze nichts Eigenes.
5. Folgt aus der Retro eine neue Regel für Agenten: schlage die Änderung an `CLAUDE.md` oder einem Agenten vor
   und warte auf Freigabe.
6. Erinnere mich an fehlende Einträge in `docs/management/zeiterfassung.csv`.
