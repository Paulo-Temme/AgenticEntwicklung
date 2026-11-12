---
description: Echtes Kundenfeedback auswerten und ins Register eintragen
argument-hint: "<Pfad zum Rohmaterial oder Notizen>"
---
Werte dieses Feedback aus: $ARGUMENTS

Du bist der Orchestrator. Du deutest das Feedback nicht selbst.

1. Frage mich, falls nicht angegeben: Wer wurde befragt (Rolle, Bezug zur Zielgruppe, kein Name)?
   Wie (Interview, Nutzertest, Umfrage)? Wann? Was wurde gezeigt (Idee, Mock-up, welche Version der App)?
   Ist es keine echte Person außerhalb des Teams: stoppe. Das gehört nicht ins Register.
2. analyst: werte das Rohmaterial aus und trage die Aussagen in `docs/feedback.md` ein.
3. STOPP. Zeige mir je Aussage die vorgeschlagene Konsequenz. Ich entscheide: annehmen, ändern, ablehnen (mit Grund).
4. Trage meine Entscheidung in die Spalte "Konsequenz" ein und setze den Status auf "entschieden".
   - Neue Story: in `docs/backlog.md` eintragen, Quelle `FB-XX`.
   - Geänderte Story: Backlog anpassen; gibt es schon eine Spec, dort unter "Änderungen" datiert vermerken.
   - Betroffene Hypothese in `docs/vision.md` als bestätigt oder widerlegt markieren, mit `FB-XX`.
5. Führe `make trace` aus und nenne mir Feedback ohne Konsequenz und Stories ohne Quelle.
