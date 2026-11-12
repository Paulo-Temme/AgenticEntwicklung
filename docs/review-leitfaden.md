# Leitfaden für Reviews und Inspektionen

Gilt für den reviewer (Agent, vor dem Push) und für die zweite Person im Pull Request (Mensch, vor dem Merge).
Ergebnis des Agenten: `specs/F-XX/review.md`. Ergebnis des Menschen: Review im Pull Request.

## Ablauf
1. Vorbereitung: Spec, Architektur und Diff lesen. Nicht den Code zuerst.
2. Stufe 1, Spec-Konformität: Wurde das Richtige gebaut? Erst wenn ja, weiter.
3. Stufe 2, Entwurf und Codequalität: Wurde es richtig gebaut? Checkliste unten, Punkt für Punkt.
4. Prüfläufe: `make check`, `make coverage`.
5. Befunde festhalten: Datei, Zeile, Prüfpunkt, Problem, Schweregrad.
6. Nacharbeit: Blockierendes wird behoben und erneut geprüft. Fehler im Verhalten werden zu Bug-Tickets.

Höchstens etwa 400 geänderte Zeilen je Review. Ist der Diff größer, war die Story zu groß: teilen.
Der Mensch im Pull Request prüft nicht die Autorin oder den Autor, sondern den Code. Wer die Story umgesetzt hat, reviewt sie nicht selbst.

## Schweregrade
| Grad | Bedeutung | Folge |
| --- | --- | --- |
| blockierend | Kriterium nicht erfüllt, Fehler im Verhalten, Sicherheitsproblem, Architektur verletzt, Regel umgangen | kein Merge |
| sollte | verschlechtert Wartbarkeit oder Verständlichkeit spürbar | beheben oder als technische Schuld eintragen |
| Hinweis | Verbesserungsidee, Geschmack | Autorin oder Autor entscheidet |

## Checkliste Stufe 1: Spec-Konformität
- A1 Jedes Akzeptanzkriterium hat einen Test auf der festgelegten Ebene.
- A2 Jeder Test prüft ein Ergebnis (Orakel), nicht nur, dass nichts abstürzt. Er würde bei falscher Umsetzung rot.
- A3 Fehlerfälle und Randwerte der Spec sind getestet.
- A4 Nichts gebaut, was nicht in der Spec steht. Nichts aus der Spec fehlt.
- A5 Tests wurden vor dem Code committet. Alle Commits beginnen mit der Feature-ID.
- A6 Keine umgangenen Regeln: `skip`, `todo`, `any`, `@ts-ignore`, `@ts-expect-error`, `eslint-disable`.
- A7 Manuelle Testfälle der Spec sind ausführbar beschrieben (Vorbedingung, Schritte, Eingaben, erwartetes Ergebnis).

## Checkliste Stufe 2: Entwurf
- E1 Der Code liegt in den Bausteinen, die `docs/architecture.md` vorsieht.
- E2 Abhängigkeiten zeigen nur in die erlaubte Richtung: Oberfläche → Kernlogik → Datenzugriff.
- E3 Information Hiding: Ein Modul gibt nur frei, was andere brauchen. Keine Zugriffe an der Schnittstelle vorbei.
- E4 Hohe Kohäsion: Jede Datei und jede Funktion hat genau eine Aufgabe.
- E5 Lose Kopplung: Kernlogik kennt weder Oberfläche noch konkrete Datenquelle.
- E6 Keine doppelte Logik. Keine Abstraktion ohne zweiten Anwendungsfall.
- E7 Abweichungen von der Architektur haben eine Notiz in `docs/decisions/`.

## Checkliste Stufe 2: Code
- C1 Namen folgen `docs/coding-standards.md` und beschreiben den Inhalt.
- C2 Öffentliche Funktionen sind kommentiert: Zweck, Eingaben, Rückgabe, Fehlerfälle, Feature-ID.
- C3 Funktionen sind klein. Kognitive Komplexität höchstens 15, höchstens drei Ebenen Verschachtelung.
- C4 Eingaben von außen (Formulare, URL, Schnittstellen) werden geprüft, bevor sie verwendet werden.
- C5 Fehler werden behandelt oder weitergegeben, nicht verschluckt. Fehlermeldungen helfen der Nutzerin oder dem Nutzer.
- C6 Keine Secrets, keine personenbezogenen Daten in Code, Protokollen oder Testdaten.
- C7 Rechte werden auf dem Server geprüft, nicht nur in der Oberfläche.
- C8 Kein toter Code, keine auskommentierten Blöcke, keine vergessenen Ausgaben zur Fehlersuche.
- C9 Oberfläche: Zustände leer, lädt, Fehler, Erfolg sind vorhanden. Bedienung mit Tastatur möglich, Beschriftungen vorhanden.
- C10 Neue Abhängigkeiten haben eine Entscheidungsnotiz.

## Inspektion von Dokumenten
Auch Specs und Architektur werden geprüft, vom Menschen an den Freigabepunkten.

- D1 Spec: Herkunft belegt, jedes Kriterium eindeutig und prüfbar, keine mehrdeutigen Wörter, Fehlerfälle vorhanden.
- D2 Architektur: Jede Sicht vorhanden, Notation einheitlich, Entscheidung gegen eine Alternative begründet,
  jede Story des Epics in "Anforderung → Realisierung".

## Grundlage
Die Trennung in Vorbereitung, Prüfung mit Checkliste, Befundliste und Nacharbeit folgt der Inspektion nach
Fagan (1976), "Design and code inspections to reduce errors in program development", IBM Systems Journal 15(3).
Die Größenbegrenzung und das leichtgewichtige Vorgehen im Pull Request: Quelle offen, vom Team zu belegen.
