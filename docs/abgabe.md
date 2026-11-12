# Abgabe

Welche Dokumente abzugeben sind, woraus sie entstehen und woran sie bewertet werden.
`/abgabe` lässt den reporter je Dokument einen Entwurf nach `abgabe/<bereich>.md` schreiben.
Das Team liest, ergänzt, trägt Autorenanteile ein und wandelt in PDF um.

Dateinamen der Abgabe: `<hauptverantwortlich>_requirements.pdf`, `_design.pdf`, `_testing.pdf`, `_management.pdf`,
Ordner `<hauptverantwortlich>_implementation` (und bei Bedarf `_testing`), dazu die Feedback-Dokumentation.
Jedes Dokument nennt oben Autorinnen und Autoren mit Anteil in Prozent.

## requirements
Quellen: `docs/vision.md`, `docs/feedback.md`, `docs/feedback/roh/`, `docs/backlog.md`, `specs/*/spec.md`, `docs/traceability.md`.

1. Vorgehen: wie erhoben wurde (Methoden, Runden, wer befragt wurde) und wie validiert wurde
2. Stakeholder und Ziele
3. Notation: User Story, Szenario, Akzeptanzkriterien in Gegeben-Wenn-Dann, messbare Qualitätsanforderungen; warum diese Formen
4. Anforderungen je Epic und Story, vollständig aus den Specs, mit Herkunft und Begründung
5. Qualitätsanforderungen und Randbedingungen
6. Priorisierung und was bewusst nicht gebaut wurde
7. Nachvollziehbarkeit Feedback → Story (Tabelle aus `docs/traceability.md`)
8. Änderungen an Anforderungen über die Laufzeit und ihr Auslöser

Bewertet wird: Detailgrad und Klarheit für Außenstehende · passende, einheitliche Notation ·
mehrere sich ergänzende Dokumentationsformen · Belege für Erhebung und Validierung.

## design
Quellen: `docs/architecture.md`, `docs/decisions/`, Abschnitt "Entwurf" der Specs.

1. Notation: welche Modellarten und warum
2. Architekturtreiber
3. Stil, Begründung, verworfene Alternativen
4. Bausteine und Schnittstellen (Komponentensicht)
5. Verhalten (Sequenz-, Aktivitäts-, Zustandsdiagramme)
6. Detailentwurf (Klassendiagramm)
7. Datenmodell (ER-Diagramm)
8. Entwurfsprinzipien und wo sie im Code sichtbar sind
9. Entscheidungen (je Notiz eine Zusammenfassung mit Quelle)
10. Nachvollziehbarkeit Anforderung → Realisierung

Bewertet wird: High-Level-Struktur mit Struktur und Verhalten · vollständiger Detailentwurf ·
Begründung aller Entscheidungen · Entwurfsprinzipien.

## implementation
Quellen: `README.md`, `docs/coding-standards.md`, `docs/architecture.md`, Ordnerstruktur, `docs/tech-debt.md`.

1. Link zum Repository und zur gehosteten Version, Start- und Installationsanleitung
2. Aufbau des Projekts: Ordner und ihre Bausteine aus der Architektur
3. Coding-Standards mit Begründung und Durchsetzung
4. Dokumentation im Code: Regeln und zwei bis drei Beispiele
5. Übereinstimmung mit der Architektur: Ergebnis der Reviews, bekannte Abweichungen
6. Technische Schulden

Bewertet wird: Projektstruktur · Dokumentation im Code · begründete, durchgesetzte Standards ·
Übereinstimmung mit der Architektur.

## testing
Quellen: `docs/teststrategie.md`, `docs/review-leitfaden.md`, `specs/*/spec.md` (Zuordnung, manuelle Testfälle),
`specs/*/review.md`, `docs/traceability.md`, Ausgabe von `make coverage`, SE-Eval-Berichte, Bug-Tickets im Board.

1. Teststrategie: Ebenen, Werkzeuge, Regeln
2. Testfälle je Ebene: Anzahl, Beispiele mit Eingabe und erwartetem Ergebnis, Zuordnung zu Kriterien
3. Manuelle Testfälle und ihre Ergebnisse
4. Ausführung: wie man alle Tests startet, Ergebnis des letzten Laufs, Coverage
5. Leitfaden für Reviews und Inspektionen
6. Ergebnisse der Reviews: Befunde nach Schweregrad, was daraus wurde
7. Gefundene Fehler: Ticket, Beschreibung, Schweregrad, Status
8. Nutzertests mit echten Personen
9. Qualität über die Zeit (SE-Eval)

Bewertet wird: Testfälle über mehrere Ebenen · wiederholbar und ausführbar ·
Material und Leitfaden für Reviews · dokumentierte Ergebnisse mit Fehlerbeschreibungen.

## management
Quellen: `docs/management/praktiken.md`, `docs/management/retros/`, `docs/management/probleme.md`,
`docs/management/statistik.md`, `docs/management/zeiterfassung.csv`, `docs/prozess.md`, `docs/learnings.md`.

1. Lebenszyklusmodell und Praktiken, begründet, mit Nachweis im Repo
2. Rollen im Team und Werkzeuge (Board mit Einladung, Versionsverwaltung, CI)
3. Arbeit mit KI-Agenten: Rollen, Freigabepunkte, was der Mensch entscheidet
4. Verlauf: Sprints, geplant und erreicht
5. Was lief gut, was lief schlecht (aus den Retros)
6. Probleme und ihre Lösungen
7. Verbesserungsideen
8. Statistik: Aufwand je Person und Tätigkeit, Commits je Person und Woche, Codezuwachs, Hauptbeitragende je Datei
9. Literatur

Bewertet wird: beschriebene, begründete und sichtbar eingehaltene Praktiken · stetiger Fortschritt mit Statistik ·
dokumentierte Probleme mit Lösungen · Literatur zu den Entscheidungen.

## feedback
Quellen: `docs/feedback.md`, `docs/feedback/roh/`, `docs/traceability.md`, `docs/vision.md` (Hypothesen).

1. Feedback-Runden über die Laufzeit: wann, was gezeigt, wer, wie
2. Aussagen und Konsequenzen (Register)
3. Hypothesen: bestätigt, widerlegt, offen
4. Nachvollziehbarkeit: je Aussage die Story und ihr Stand im Produkt
5. Feedback ohne Konsequenz, mit Begründung

## Checkliste vor der Abgabe
- [ ] Gehostete Version erreichbar, Adresse im README, Startanleitung von einer Person außerhalb des Teams ausprobiert
- [ ] `make check` grün auf `main`, CI grün
- [ ] `make trace` ohne Lücken
- [ ] Jede fertige Story: Spec freigegeben, `review.md` vorhanden, manuelle Testfälle mit Ergebnis
- [ ] Jede Entscheidung in `docs/decisions/` hat eine geprüfte Quelle oder ist als "Quelle offen" begründet
- [ ] Zeiterfassung vollständig, `make stats` aktuell
- [ ] Jede Feedback-Zeile hat eine entschiedene Konsequenz
- [ ] Bug-Tickets im Board aktuell, Einladung zum Board verschickt
- [ ] Autorenanteile in jedem Dokument
- [ ] Dokumente von einer zweiten Person gelesen, in PDF umgewandelt, nach Vorgabe benannt
