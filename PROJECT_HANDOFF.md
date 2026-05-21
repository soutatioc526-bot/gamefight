# Gamefight Project Handoff

## Current Direction

Gamefight is now a short-session roguelite survivor demo:

- One unified protagonist.
- Three starting weapons: 裂隙短刃, 秘银飞弹, 回旋飞镖.
- Fast start from the title screen.
- Growth sources are now split by source:
  - XP pickups grant player attribute upgrades.
  - Blacksmith events grant current-weapon enchantments.
  - Boss relic pickups grant divine blessings.
  - Shrines are risk trades with explicit costs.
- Normal run goal is floor 9; floors 10-20 are deep challenge.

The old three-character and class-transfer systems have been removed from the active codebase.

## Runtime Files

- `index.html`: DOM structure and modal containers.
- `styles.css`: layout, HUD, modal, joystick, and sprite-avatar styling.
- `src/game.js`: current game loop and all active gameplay logic.
- `src/data/gameData.js`: player upgrades, weapon enchantments, divine blessings, shrine events, floor plan, and economy config.
- `assets/sprites/`: runtime sprite assets for the protagonist, weapon cards, and weapon effects.
- `assets/maps/`: four combat map textures, covering floors 1-5, 6-10, 11-15, and 16-20.
- `assets/audio/`: audio samples and procedural fallback sound hooks.

## Current Gameplay Systems

- Start flow:
  - Single `开始冒险` entry.
  - Uses the last selected weapon when available.
  - Opens weapon selection only when there is no saved starting weapon or the player chooses to change weapon after a run.

- Player state:
  - `weapons`
  - `playerUpgrades`
  - `divineBlessings` / `blessings`
  - `weapon.enchantments`
  - `items` / `relics`
  - `synergies`
  - `startingWeapon`
  - `highestSynergy`
  - `runStats`
  - `pickupRange` derived from player upgrades
  - reserved `reviveCurrency`

- Weapons:
  - 裂隙短刃: close-range cone slash.
  - 秘银飞弹: homing projectile.
  - 回旋飞镖: piercing outbound and returning line attack.

- Player upgrades:
  - Survival, Movement, Pickup, Combat.
  - These are the only cards shown by XP level-up.

- Weapon enchantments:
  - Granted by blacksmith events.
  - Include generic enchantments and weapon-specific behavior changes.

- Divine blessings:
  - Granted only after picking up a Boss relic.
  - Current pools include War, Wealth, Fate, and Rift blessings.

- Synergies:
  - Knife + MagicMissile: 奥术剑阵
  - Knife + Dart: 回旋刃舞
  - MagicMissile + Dart: 符文飞镖
  - All three weapons: 三相爆发

## Rooms And Rewards

Combat level-up rewards are now only player-attribute upgrades.

Event pacing:

- Every transition into the next floor opens a confirmation modal before `startFloor(...)`.
- Floor 5 clears into a safe shrine map.
- Floor 9 Boss drops a relic; picking it opens divine blessing choices, then normal-mode settlement.
- Continuing after floor 9 enters floor 10 as a safe blacksmith map.
- Floor 15 is prepared as a random safe event map.
- The HUD floor label intentionally omits player level; player level remains on the hero panel.

Economy rules:

- Base rewards are free: level-up choice, first blacksmith enchantment, first Boss blessing.
- Gold is used for rerolls, blacksmith refresh/enhance, shrine trades, and safety purchases.
- Normal monsters drop coins probabilistically; elites and bosses have guaranteed coin drops.

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

## Map Assets

The active combat backgrounds are loaded through `ROGUE_MAPS` in `src/game.js`:

- `map_01_05.png`: floors 1-5.
- `map_06_10.png`: floors 6-10.
- `map_11_15.png`: floors 11-15.
- `map_16_20.png`: floors 16-20.

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
- Enemies drop blue XP crystals; XP only increases after pickup.
- Level-up cards show player categories: 生存 / 移动 / 拾取 / 战斗.
- Floor 5 clears into a safe shrine map.
- Floor 9 Boss drops a visible relic and then opens divine blessing choices.
- Continuing from floor 9 enters floor 10 blacksmith safe map.
- Weapon effects appear during attacks.
- No console errors.
- Mobile viewport stays responsive.
