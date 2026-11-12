---
description: Ein Epic in User Stories zerlegen und die Architektur prüfen
argument-hint: "<Beschreibung des Epics>"
---
Zerlege dieses Epic in User Stories: $ARGUMENTS

Du bist der Orchestrator. Du schreibst keinen Code und keine Specs.

1. Lies `docs/vision.md`, `docs/backlog.md`, `docs/feedback.md` und `docs/tech-debt.md`.
   Finde die nächste freie Epic-Nummer (E-XX) und Feature-Nummer (F-XX).
2. Prüfe, ob das Epic zu einem Ziel aus der Vision gehört. Wenn nicht: sage es mir und frage nach.
3. Schlage Stories vor. Jede Story:
   - liefert einen sichtbaren Nutzen ("Als ... möchte ich ..., damit ..."),
   - ist in höchstens einem Tag umsetzbar,
   - ist für sich testbar,
   - nennt ihre Quelle: Feedback-ID (`FB-XX`), Ziel aus der Vision (`Z1`) oder "Annahme",
   - hat eine Größe (S / M / L) und eine Priorität (hoch / mittel / niedrig) mit einem Satz Begründung.
4. Ordne die Stories so, dass jede auf den vorherigen aufbaut und das Wichtigste zuerst kommt.
   Stories, die nur auf einer Annahme beruhen, markierst du: erst mit echten Personen prüfen.
5. STOPP. Zeige mir die Liste und warte auf meine Freigabe.
6. Trage die Stories in `docs/backlog.md` ein, Status "offen".
   Erinnere mich, je Story ein Ticket im Projekt-Board anzulegen (Vorlage "Story") und die Nummer einzutragen.
7. architect: prüfe, ob das Epic die Architektur verändert, und ergänze `docs/architecture.md`.
8. STOPP. Zeige mir die Änderungen an der Architektur, falls es welche gibt.
