# Coding-Standards

Die Regeln aus `CLAUDE.md`, mit Begründung und der Stelle, an der sie durchgesetzt werden.
`CLAUDE.md` bleibt die Kurzfassung für Agenten. Ändert sich eine Regel, werden beide Dateien geändert.

Welche Lint-Regeln aktiv sind, steht in `eslint.config.mjs` des Projekts. Was dort nicht geprüft wird, prüft das Review.

Durchsetzung: Lint und Typprüfung (`make check`, CI) · Schutz-Hook (`.claude/hooks/guard.mjs`) ·
Review (`docs/review-leitfaden.md`, Prüfpunkt in Klammern) · SE-Eval (Messung je Epic).

## Entwurf
| Regel | Begründung | Durchgesetzt durch |
| --- | --- | --- |
| Eine Datei, eine Aufgabe | Hohe Kohäsion: Änderungen bleiben an einer Stelle | Review (E4) |
| Kernlogik in `src/lib/`, kennt die Oberfläche nicht | Lose Kopplung: Kernlogik ist ohne Browser testbar und austauschbar | Review (E2, E5), Mutation Testing in SE-Eval |
| Abhängigkeiten nur Oberfläche → Kernlogik → Datenzugriff | Keine Zyklen, Änderungen wirken nur nach oben | Review (E2) |
| Module geben nur frei, was andere brauchen | Information Hiding: Interna können sich ändern, ohne andere zu brechen (Parnas 1972) | Review (E3) |
| Nichts doppelt | Ein Fehler wird an einer Stelle behoben | Review (E6), Duplikate in SE-Eval |
| Einfachste Lösung, Muster nur bei vorhandenem Problem | Unnötige Abstraktion kostet Verständnis | Review (E6) |

## Namen
| Regel | Begründung | Durchgesetzt durch |
| --- | --- | --- |
| Variablen und Funktionen `camelCase`, Funktionen beginnen mit Verb | Üblich in TypeScript; Verb zeigt, dass etwas getan wird | Review (C1) |
| Typen und Komponenten `PascalCase`, Substantiv | Üblich in TypeScript und React; unterscheidet Typ von Wert | Review (C1) |
| Dateien `kebab-case` | Keine Probleme zwischen Dateisystemen mit und ohne Groß-/Kleinschreibung | Review (C1) |
| Keine Abkürzungen, keine Namen wie `data`, `utils2`, `tmp` | Namen sind die häufigste Dokumentation (Martin 2008, Kap. 2) | Review (C1) |

## Dokumentation im Code
| Regel | Begründung | Durchgesetzt durch |
| --- | --- | --- |
| Jede Datei beginnt mit einem Satz zu ihrer Aufgabe | Rolle der Datei ist ohne Lesen des Codes erkennbar | Review (C2) |
| Jede öffentliche Funktion: Zweck, Eingaben, Rückgabe, Fehlerfälle, Feature-ID | Schnittstelle ist ohne Lesen des Rumpfs nutzbar; Feature-ID führt zur Spec | Review (C2) |
| Kommentare erklären das Warum, nicht das Was | Das Was steht im Code und veraltet im Kommentar | Review (C2) |

## Komplexität und Typen
| Regel | Begründung | Durchgesetzt durch |
| --- | --- | --- |
| Kognitive Komplexität je Funktion höchstens 15 | Misst, wie schwer Code zu verstehen ist (Campbell 2018); 15 ist der Standardwert von SonarSource | Review (C3), SE-Eval (sonarjs) |
| Kein `any`, `@ts-ignore`, `@ts-expect-error`, `eslint-disable` | Schaltet genau die Prüfung ab, die Fehler vor der Laufzeit findet | Lint, Review (A6), SE-Eval zählt Umgehungen |
| `strict` in `tsconfig.json` | Findet fehlende Werte und falsche Typen beim Übersetzen | Typprüfung |

## Tests und Ablauf
| Regel | Begründung | Durchgesetzt durch |
| --- | --- | --- |
| Tests zuerst, getrennter Commit | Test beschreibt die Anforderung, bevor die Lösung sie verbiegt (Beck 2002) | Rollen tester und coder, Schutz-Hook, Review (A5) |
| Wer umsetzt, ändert keine Tests | Sonst wird der Test der Umsetzung angepasst statt umgekehrt | Schutz-Hook |
| Testname nennt `F-XX AKn` | Nachvollziehbarkeit von Anforderung zu Test | `make trace`, Review (A1) |
| Commit beginnt mit Feature-ID, eine Story = ein Branch = ein Pull Request | Jede Änderung führt zu ihrer Anforderung; kleine Pull Requests sind prüfbar | Review (A5), geschützter `main` |
| Kein Commit auf `main`, kein Push oder Merge durch Agenten | Der Mensch verantwortet, was ins Projekt kommt | Schutz-Hook, Rechte in `.claude/settings.json` |
| Keine Secrets im Code, `.env` für Agenten gesperrt | Zugangsdaten gehören nicht ins Repo und nicht in Sitzungen | Schutz-Hook, Rechte |

## Quellen
- Beck, K. (2002): Test-Driven Development: By Example. Addison-Wesley.
- Campbell, G. A. (2018): Cognitive Complexity. A new way of measuring understandability. SonarSource.
- Martin, R. C. (2008): Clean Code. A Handbook of Agile Software Craftsmanship. Prentice Hall.
- Parnas, D. L. (1972): On the criteria to be used in decomposing systems into modules. Communications of the ACM 15(12).

Das Team prüft diese Angaben vor der Abgabe und ergänzt eigene Quellen.
