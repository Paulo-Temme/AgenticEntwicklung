# Teststrategie

Was auf welcher Ebene getestet wird, wie Tests heißen, wo Ergebnisse stehen und wie Fehler verfolgt werden.

## Ebenen
| Ebene | Was wird geprüft | Wo | Werkzeug | Wer schreibt | Wann läuft es |
| --- | --- | --- | --- | --- | --- |
| Unit | eine Funktion der Kernlogik, ohne Oberfläche und Netz | `*.test.ts(x)` neben der Datei | Vitest | tester | `make check`, CI |
| Integration (Komponente) | Zusammenspiel von Bausteinen, zum Beispiel Komponente mit Kernlogik, Kernlogik mit Datenzugriff | `*.int.test.ts(x)` oder `tests/integration/` | Vitest | tester | `make check`, CI |
| System (E2E) | ein Nutzerweg durch die laufende App | `e2e/` | Playwright | tester | `make e2e`, vor jedem Merge von Hand |
| Abnahme | Akzeptanzkriterien aus Sicht der Nutzerin oder des Nutzers | "Manuelle Testfälle" in der Spec | von Hand | tester schreibt, Mensch führt aus | vor jedem Push |
| Nutzertest | echte Personen lösen Aufgaben mit der App | `docs/feedback/roh/`, Register `docs/feedback.md` | Aufgabenliste, SUS-Fragebogen | Team | je Feedback-Runde |

## Regeln für Testfälle
- Jeder Test gehört zu einem Akzeptanzkriterium und heißt `F-XX AKn: <was geprüft wird>`.
- Eingaben und erwartetes Ergebnis (Orakel) stehen sichtbar im Test.
- Je Kriterium mindestens ein Gutfall. Fehlerfälle und Randwerte (leer, Minimum, Maximum, eins darüber) sind eigene Tests.
- Tests sind wiederholbar: keine Abhängigkeit von Reihenfolge, Uhrzeit, Zufall oder Netz.
- Ein Fehler in der fertigen App bekommt zuerst einen Test, der ihn zeigt, dann die Behebung.

## Ergebnisse
| Was | Wo |
| --- | --- |
| Automatische Tests je Pull Request | CI-Lauf am Pull Request (bestanden / fehlgeschlagen je Test) |
| Coverage | Ausgabe von `make coverage`, im Review je Story genannt |
| Manuelle Testfälle | Spalte "Ergebnis" in der Spec: Datum, wer, bestanden oder nicht |
| Reviews | `specs/F-XX/review.md` und Review im Pull Request |
| Zuordnung Kriterium → Test | `docs/traceability.md` (`make trace`) |
| Qualität über die Zeit | SE-Eval-Bericht je Epic, siehe `docs/se-eval.md` |
| Nutzertests | `docs/feedback.md` |

## Fehler (Defekte)
Jeder Fehler im Verhalten wird ein Ticket im Projekt-Board, Vorlage "Fehler", Label `bug`.
Das gilt für Befunde aus Reviews, fehlgeschlagene manuelle Testfälle, Nutzertests und Fehler im Betrieb.

1. Ticket anlegen: Schritte, erwartet, tatsächlich, Schweregrad, gefunden durch.
2. Als Story ins Backlog (Quelle: Ticketnummer oder `FB-XX`), umsetzen mit `/feature`: zuerst der Test, der den Fehler zeigt.
3. Ursache und Regel für die Zukunft in `docs/learnings.md`.
4. Ticket schließt mit dem Merge des Pull Requests.

Schweregrad: kritisch (Datenverlust, Sicherheit, Kernablauf nicht nutzbar) · hoch (Funktion falsch, kein Umweg) ·
mittel (Funktion falsch, Umweg möglich) · niedrig (Darstellung, Text).
