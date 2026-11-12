# Praktiken

Welche Praktiken das Team einsetzt, warum, und woran man im Repo sieht, dass sie eingehalten werden.
Die Zeilen unten beschreiben, was diese Vorlage vorgibt. Begründung und Quelle ergänzt und prüft das Team.
Eigene Praktiken (zum Beispiel Sprints, Standups, Planning) trägt das Team nach.

| Praktik | Woher | Warum hier | Nachweis im Repo | Quelle |
| --- | --- | --- | --- | --- |
| User Stories mit Akzeptanzkriterien | XP, Scrum | Anforderungen aus Nutzersicht, klein genug für einen Tag | `docs/backlog.md`, `specs/F-XX/spec.md` | Cohn (2004): User Stories Applied |
| Test-Driven Development | XP | Anforderung wird vor der Lösung prüfbar; schützt vor Code, den niemand verlangt hat | getrennte Commits Tests → Code, `make trace` | Beck (2002): Test-Driven Development |
| Kleine Schritte, ein Branch je Story, Pull Request | Trunk-nahe Entwicklung | Prüfbare Änderungen, `main` bleibt lauffähig | Branch-Namen, Pull Requests | Quelle offen |
| Continuous Integration | XP, DevOps | Fehler fallen am Pull Request auf, nicht bei der Abgabe | `.github/workflows/ci.yml`, CI-Läufe | Quelle offen |
| Reviews in zwei Stufen | Inspektion | Zweites Augenpaar findet, was Tests nicht finden | `specs/F-XX/review.md`, Reviews im Pull Request | Fagan (1976): Design and code inspections |
| Entscheidungsnotizen | Architecture Decision Records | Begründungen bleiben auffindbar | `docs/decisions/` | Nygard (2011): Documenting Architecture Decisions |
| Kontinuierliches Kundenfeedback | Startup-Sicht des Kurses | Annahmen werden an echten Personen geprüft | `docs/feedback.md`, Quelle je Story | Quelle offen |
| Retrospektive je Sprint | Scrum | Prozess wird regelmäßig angepasst | `docs/management/retros/` | Quelle offen |
| Entwicklung mit KI-Agenten in festen Rollen und Freigabepunkten | eigene Wahl | Wiederholbarer Ablauf; der Mensch entscheidet an fünf Stellen | `.claude/`, `specs/F-XX/log.md` | Quelle offen |
| Messung mit SE-Eval | eigene Wahl | Qualität über die Zeit sichtbar, unabhängig von der eigenen Konfiguration | Berichte je Epic | – |

## Lebenszyklusmodell
Welches Modell (zum Beispiel Scrum mit XP-Praktiken), welche Sprintlänge, welche Termine, und warum.
Vergleich mit mindestens einer Alternative.

## Rollen im Team
| Verantwortung | Person | Vertretung |
| --- | --- | --- |
| Anforderungen | | |
| Architektur und Entwurf | | |
| Implementierung | | |
| Qualitätssicherung | | |
| Management | | |
