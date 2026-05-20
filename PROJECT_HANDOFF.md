# Gamefight Project Handoff

## Current Direction

Gamefight is now a short-session roguelite survivor demo:

- One unified protagonist.
- Three starting weapons: Knife, MagicMissile, Dart.
- Fast start from the title screen.
- Combat upgrades, intermission rooms, blessings, relics, shop items, and weapon synergies are separate systems.
- Normal run goal is floor 9; floors 10-20 are deep challenge.

The old three-character and class-transfer systems have been removed from the active codebase.

## Runtime Files

- `index.html`: DOM structure and modal containers.
- `styles.css`: layout, HUD, modal, joystick, and sprite-avatar styling.
- `src/game.js`: current game loop and all active gameplay logic.
- `assets/sprites/`: runtime sprite assets for the protagonist, weapon cards, and weapon effects.
- `assets/audio/`: audio samples and procedural fallback sound hooks.

## Current Gameplay Systems

- Start flow:
  - Single `开始冒险` entry.
  - Uses the last selected weapon when available.
  - Opens weapon selection only when there is no saved starting weapon or the player chooses to change weapon after a run.

- Player state:
  - `weapons`
  - `blessings`
  - `items` / `relics`
  - `synergies`
  - `startingWeapon`
  - `highestSynergy`
  - `runStats`
  - reserved `reviveCurrency`

- Weapons:
  - Knife: close-range cone slash.
  - MagicMissile: homing projectile.
  - Dart: piercing outbound and returning line attack.

- Blessings:
  - Wind
  - Arcane
  - Blood
  - Curse

- Synergies:
  - Knife + MagicMissile: 奥术剑阵
  - Knife + Dart: 回旋刃舞
  - MagicMissile + Dart: 符文飞镖
  - All three weapons: 三相爆发

## Rooms And Rewards

Combat level-up rewards are separate from floor-end rooms.

Floor-end rooms include:

- Shrine: blessings.
- Forge: weapon upgrades.
- Relic Chest: relics and items.
- Supply: healing, gold, XP, temporary help.
- Shop: paid non-blessing goods only.

Shop rules:

- No blessings.
- No class-transfer content.
- No direct base-stat products.
- Keep shop offers small for mobile readability.

## Mobile Notes

- Touch movement uses a dynamic virtual joystick centered on the first touch point.
- Player movement uses joystick direction, never touch-position snapping.
- Canvas DPR, enemy cap, particles, effects, and offscreen indicators are capped more aggressively on small screens.
- The current target is stable mobile-web play rather than maximum particle density.

## Sprite Assets

The active runtime sprite files are:

- `hero_avatar.png`
- `hero_spritesheet.png`
- `weapon_knife.png`
- `weapon_magicMissile.png`
- `weapon_dart.png`
- `effect_knife_slash.png`
- `effect_magic_missile.png`
- `effect_dart_trail.png`

The protagonist and weapon sprites are generated from the user-provided reference images.

## Verification Checklist

Before handoff, run:

```powershell
node --check src\game.js
```

Then load:

```text
http://127.0.0.1:5173/
```

Check:

- Title screen enters combat.
- Sprite avatar appears in the HUD.
- Player can move with keyboard and mobile joystick.
- Weapon effects appear during attacks.
- No console errors.
- Mobile viewport stays responsive.
