# Platformer-RPG Babylon.js – Meilensteine

Leitidee: 3D-Action-RPG mit Platformer-Elementen. Der Spieler ist ein
Würfel-Monster mit RPG-Werten, Kämpfe laufen in Echtzeit. Das Spiel wird mit
Vite, TypeScript und Babylon.js im Code aufgebaut (ohne Babylon Editor).

Status-Legende:
- [x] von mir getestet und verstanden
- [~] im Code vorhanden, von mir noch nicht bestätigt
- [ ] offen

## Phase A – Setup
- [x] Projekt einrichten (Vite + TypeScript + index.html vorhanden)
- [x] Babylon.js installieren und initialisieren (Engine/Scene in src/App.ts)
- [x] Szene, Kamera und Licht im Code – src/World.ts; im Browser bestätigt
- [x] Entscheidung: Code-only mit Vite + TypeScript, Babylon Editor vorerst nicht verwenden
- [x] Game-Loop mit Delta-Time (als Klasse) – src/GameLoop.ts, im Browser bestätigt
- [x] Physik-Ansatz: Havok (Plugin in src/App.ts aktiv; Bodies für Boden und Player im Code)

## Phase B – Platformer-Kern (Vertical Slice)
- [x] Raum/Boden erstellen – src/World.ts, BOX-Physik, mass 0; im Browser bestätigt
- [x] Spieler-Würfel erstellen – src/Player.ts erzeugt Box und BOX-Physik selbst; im Browser bestätigt
- [x] Tastatursteuerung – PlayerController trackt WASD, in GameLoop eingebunden; im Browser bestätigt
- [x] Horizontale Spielerbewegung – Havok-Geschwindigkeit auf X/Z, 300 cm/s; im Browser bestätigt
- [x] Kamera-relative Bewegung – WASD nutzt Kamera-Vorwärts-/Rechtsrichtung, diagonal normalisiert; im Browser bestätigt
- [x] Schwerkraft und Springen – Space und Raycast-Bodencheck; im Browser bestätigt
- [x] Kollision mit Boden – Boden-Physik im Code; im Browser bestätigt
- [ ] Platformen erstellen
- [x] Follow-Kamera – ArcRotateCamera folgt dem Player; im Browser bestätigt

## Phase C – RPG-Grundlagen
- [ ] Datenmodell für Monster-Werte (HP, Angriff, Verteidigung, Level, XP)
- [ ] Spieler-Klasse als Würfel-Monster mit Werten
- [ ] Münzen erstellen und einsammeln
- [ ] HUD: HP, Level, XP und Münzen anzeigen
- [ ] XP vergeben und Level-Up

## Phase D – Gegner und Echtzeit-Kampf
- [ ] Gegner erstellen (Mesh und Klasse)
- [ ] Gegner-Bewegung und Patrouille
- [ ] Angriff und Schaden in Echtzeit
- [ ] Spieler-HP, Tod und Respawn
- [ ] Gegner geben XP und Münzen
- [ ] Treffer-Feedback (Blinken, Zurückstoßen)

## Phase E – RPG-Ausbau
- [ ] Items und Inventar
- [ ] Monster-Entwicklung (Evolution)
- [ ] Fähigkeiten und Attacken
- [ ] NPCs, Dialoge und Quests
- [ ] Shop mit Münzen

## Phase F – Welt und Polish
- [ ] Level-Abschnitte und Weltgestaltung
- [ ] Sound und Musik
- [ ] Menü und Spielstand speichern/laden
- [ ] Optional: Electron

## Festgelegte Entscheidungen
- Kampfsystem: Echtzeit
- Spieler: Würfel-Monster mit RPG-Werten
- Reihenfolge: Platformer-Kern vor RPG-Systemen
- Physik: Havok (festgelegt in AGENTS.md)

## Regeln
- Nur den nächsten offenen Schritt bearbeiten.
- Einen Schritt erst abhaken, wenn ich ihn getestet
  und verstanden habe.
- Nach jedem Schritt kurz erklären, was und warum
  geändert wurde.
