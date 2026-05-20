const canvas = document.querySelector("#game");
const ctx = canvas.getContext("2d");

const ui = {
  wave: document.querySelector("#wave"),
  timer: document.querySelector("#timer"),
  remaining: document.querySelector("#remaining"),
  heroName: document.querySelector("#hero-name"),
  hudAvatar: document.querySelector("#hud-avatar"),
  hp: document.querySelector("#hp"),
  xp: document.querySelector("#xp"),
  hpFill: document.querySelector("#hp-fill"),
  xpFill: document.querySelector("#xp-fill"),
  coins: document.querySelector("#coins"),
  gems: document.querySelector("#gems"),
  build: document.querySelector("#build"),
  pause: document.querySelector("#pause"),
  overlay: document.querySelector("#overlay"),
  start: document.querySelector("#start"),
  toast: document.querySelector("#toast"),
  joystick: document.querySelector("#joystick"),
  joystickKnob: document.querySelector("#joystick-knob"),
  shop: document.querySelector("#shop"),
  shopItems: document.querySelector("#shop-items"),
  shopGold: document.querySelector("#shop-gold"),
  shopMessage: document.querySelector("#shop-message"),
  refreshShop: document.querySelector("#refresh-shop"),
  continueRun: document.querySelector("#continue-run"),
  buyDialog: document.querySelector("#buy-dialog"),
  buyIcon: document.querySelector("#buy-icon"),
  buyTitle: document.querySelector("#buy-title"),
  buyText: document.querySelector("#buy-text"),
  buyPrice: document.querySelector("#buy-price"),
  buyCancel: document.querySelector("#buy-cancel"),
  buyConfirm: document.querySelector("#buy-confirm"),
  heroConfirm: document.querySelector("#hero-confirm"),
  heroConfirmAvatar: document.querySelector("#hero-confirm-avatar"),
  heroConfirmTitle: document.querySelector("#hero-confirm-title"),
  heroConfirmText: document.querySelector("#hero-confirm-text"),
  heroConfirmCancel: document.querySelector("#hero-confirm-cancel"),
  heroConfirmOk: document.querySelector("#hero-confirm-ok"),
  heroSelect: document.querySelector("#hero-select"),
  heroCards: [...document.querySelectorAll("[data-hero]")],
  tutorialDialog: document.querySelector("#tutorial-dialog"),
  tutorialKicker: document.querySelector("#tutorial-kicker"),
  tutorialPortrait: document.querySelector("#tutorial-portrait"),
  tutorialSpeaker: document.querySelector("#tutorial-speaker"),
  tutorialLine: document.querySelector("#tutorial-line"),
  tutorialNext: document.querySelector("#tutorial-next"),
  statsPanel: document.querySelector("#hero-stats"),
  statsTitle: document.querySelector("#stats-title"),
  statsBody: document.querySelector("#stats-body"),
  statsClose: document.querySelector("#stats-close"),
  settings: document.querySelector("#settings"),
  settingsTitle: document.querySelector("#settings-title"),
  settingsClose: document.querySelector("#settings-close"),
  settingsMenu: document.querySelector("#settings-menu"),
  settingsContent: document.querySelector("#settings-content"),
  openTalents: document.querySelector("#open-talents"),
  openAudio: document.querySelector("#open-audio"),
  saveProgress: document.querySelector("#save-progress"),
  returnGame: document.querySelector("#return-game"),
  levelUp: document.querySelector("#level-up"),
  upgradeTitle: document.querySelector("#level-up h2"),
  upgradeItems: document.querySelector("#upgrade-items"),
  debug: document.querySelector("#debug"),
};

const VIEW = {
  width: 360,
  height: 640,
};

const WORLD = {
  width: 980,
  height: 1320,
  minX: 48,
  maxX: 932,
  minY: 72,
  maxY: 1260,
};

const COLORS = {
  bgTop: "#111827",
  bgBottom: "#18243a",
  grid: "rgba(255,255,255,0.07)",
  text: "#eef4ff",
  hp: "#4ee2a0",
  danger: "#ff5570",
  gold: "#ffd166",
  xp: "#53d8fb",
  warrior: "#ffe66d",
  mage: "#bdb2ff",
  archer: "#7ae582",
  frost: "#9bf6ff",
  fire: "#ff9f1c",
  playerSkin: "#f5c7a9",
  playerHair: "#2a1a19",
  playerCloth: "#4ee2a0",
};

const ENEMY_TYPES = [
  { id: "goblin", name: "小哥布林", hp: 12, speed: 42, radius: 11, attack: 3, xp: 8, coins: 2, color: "#ff5570", shape: "round" },
  { id: "bat", name: "洞穴蝠", hp: 8, speed: 62, radius: 9, attack: 2, xp: 7, coins: 1, color: "#ffb86b", shape: "diamond" },
  { id: "skeleton", name: "骷髅兵", hp: 18, speed: 34, radius: 13, attack: 4, xp: 13, coins: 3, color: "#e7edf5", shape: "box" },
  { id: "cultist", name: "秘教徒", hp: 16, speed: 38, radius: 12, attack: 4, xp: 12, coins: 4, color: "#b584ff", shape: "round" },
];

const SPECIAL_FLOORS = {
  5: { label: "怪物头目", hp: 8, radius: 2.1, speed: 0.82, attack: 2.1, color: "#e9c46a" },
  10: { label: "精英怪", hp: 10, radius: 2.25, speed: 0.92, attack: 2.35, color: "#9bf6ff" },
  15: { label: "副首领", hp: 13, radius: 2.6, speed: 0.74, attack: 2.8, color: "#ff70a6" },
  20: { label: "最终Boss", hp: 20, radius: 3.05, speed: 0.66, attack: 3.5, color: "#ff3d5a" },
};

const RARITIES = {
  common: { label: "普通", color: "#4ee2a0", weight: 62 },
  elite: { label: "精英", color: "#53d8fb", weight: 25 },
  epic: { label: "史诗", color: "#bdb2ff", weight: 10 },
  legendary: { label: "传说", color: "#ffd166", weight: 3 },
};

const HEROES = {
  wendi: {
    id: "wendi",
    name: "文帝",
    title: "近战冒险者",
    profession: "warrior",
    attackStyle: "melee",
    color: COLORS.warrior,
    sound: "melee",
    intro: "文帝入场：靠近怪物后自动挥剑。",
    maxHp: 190,
    defense: 0.3,
    moveSpeed: 154,
    stats: {
      meleeDamage: 20,
      meleeRange: 48,
      meleeCooldown: 0.74,
      magnet: 72,
    },
  },
  mike: {
    id: "mike",
    name: "麦克",
    title: "魔法飞弹",
    profession: "mage",
    attackStyle: "mage",
    color: COLORS.mage,
    sound: "mage",
    intro: "麦克入场：自动发射奥术魔法飞弹。",
    maxHp: 88,
    defense: 0.04,
    moveSpeed: 166,
    stats: {
      primaryDamage: 46,
      primaryRange: 190,
      primaryCooldown: 0.82,
      primaryTargets: 1,
      magicSplash: 0,
      magnet: 72,
    },
  },
  ming: {
    id: "ming",
    name: "铭",
    title: "飞镖游侠",
    profession: "archer",
    attackStyle: "dart",
    color: COLORS.archer,
    sound: "archer",
    intro: "铭入场：远距离投掷穿透飞镖。",
    maxHp: 98,
    defense: 0.05,
    moveSpeed: 172,
    stats: {
      primaryDamage: 28,
      primaryRange: 242,
      primaryCooldown: 0.58,
      primaryPierce: 1,
      magnet: 76,
    },
  },
};

const BASIC_UPGRADES = [
  {
    title: "体魄训练",
    text: "最大生命提高，并回复一部分生命。",
    color: COLORS.hp,
    apply(game) {
      game.maxHp += 18;
      game.hp = Math.min(game.maxHp, game.hp + 30);
      game.say("体魄训练：生命上限提高。");
    },
  },
  {
    title: "轻快步伐",
    text: "移动速度提高，方便拉扯怪群。",
    color: COLORS.xp,
    apply(game) {
      game.stats.moveSpeed += 14;
      game.say("轻快步伐：移动更灵活。");
    },
  },
  {
    title: "拾荒本能",
    text: "金币掉落物吸附范围提高。",
    color: COLORS.gold,
    apply(game) {
      game.stats.magnet += 28;
      game.say("拾荒本能：掉落物更容易靠近。");
    },
  },
];

function upgrade(title, text, rarity, sound, apply) {
  return {
    title,
    text,
    rarity,
    rarityLabel: RARITIES[rarity].label,
    color: RARITIES[rarity].color,
    sound,
    apply,
  };
}

const CLASS_UPGRADES = {
  warrior: [
    upgrade("重剑训练", "近战挥砍伤害和判定范围提高。", "common", "warrior", (game) => {
      game.stats.meleeDamage += 8;
      game.stats.meleeRange += 3;
      game.say("重剑训练：斩击更扎实。");
    }),
    upgrade("疾风连斩", "挥砍间隔小幅缩短。", "common", "warrior", (game) => {
      game.stats.meleeCooldown = Math.max(0.3, game.stats.meleeCooldown - 0.04);
      game.say("疾风连斩：挥剑节奏加快。");
    }),
    upgrade("硬皮护甲", "防御提高，受到的伤害降低。", "common", "warrior", (game) => {
      game.stats.defense = Math.min(0.5, game.stats.defense + 0.03);
      game.say("硬皮护甲：更耐打。");
    }),
    upgrade("生命鼓舞", "最大生命提高并回复生命。", "common", "level", (game) => {
      game.maxHp += 18;
      game.hp = Math.min(game.maxHp, game.hp + 24);
      game.say("生命鼓舞：血量更厚。");
    }),
    upgrade("拾荒腰带", "金币拾取范围提高。", "common", "xp", (game) => {
      game.stats.magnet += 20;
      game.say("拾荒腰带：掉落物更容易吸过来。");
    }),
    upgrade("破阵剑势", "近战范围扩大并提高防御。", "elite", "warrior", (game) => {
      game.stats.meleeRange += 8;
      game.stats.defense = Math.min(0.5, game.stats.defense + 0.03);
      game.say("破阵剑势：贴身作战更稳。");
    }),
    upgrade("双重斩影", "伤害提高，挥砍间隔缩短。", "elite", "warrior", (game) => {
      game.stats.meleeDamage += 7;
      game.stats.meleeCooldown = Math.max(0.3, game.stats.meleeCooldown - 0.05);
      game.say("双重斩影：出手更凶。");
    }),
    upgrade("血怒", "最大生命和近战伤害提高。", "elite", "warrior", (game) => {
      game.maxHp += 16;
      game.hp = Math.min(game.maxHp, game.hp + 16);
      game.stats.meleeDamage += 9;
      game.say("血怒：越战越猛。");
    }),
    upgrade("回旋斩", "近战判定范围显著提高。", "elite", "warrior", (game) => {
      game.stats.meleeRange += 12;
      game.say("回旋斩：剑围更大。");
    }),
    upgrade("盾反本能", "防御大幅提高。", "elite", "hurt", (game) => {
      game.stats.defense = Math.min(0.55, game.stats.defense + 0.06);
      game.say("盾反本能：硬得多了。");
    }),
    upgrade("战意沸腾", "伤害提高，冷却明显缩短。", "epic", "warrior", (game) => {
      game.stats.meleeDamage += 10;
      game.stats.meleeCooldown = Math.max(0.28, game.stats.meleeCooldown - 0.08);
      game.say("战意沸腾：斩击像风暴一样。");
    }),
    upgrade("巨剑精通", "近战伤害和范围大幅提高。", "epic", "warrior", (game) => {
      game.stats.meleeDamage += 18;
      game.stats.meleeRange += 6;
      game.say("巨剑精通：每一剑都很重。");
    }),
    upgrade("守护誓言", "生命和防御同时提高。", "epic", "level", (game) => {
      game.maxHp += 35;
      game.hp = Math.min(game.maxHp, game.hp + 35);
      game.stats.defense = Math.min(0.55, game.stats.defense + 0.04);
      game.say("守护誓言：站得住，砍得久。");
    }),
    upgrade("引力战靴", "移动速度和金币拾取范围提高。", "epic", "xp", (game) => {
      game.stats.moveSpeed += 10;
      game.stats.magnet += 34;
      game.say("引力战靴：边打边捡更顺。");
    }),
    upgrade("剑刃风暴", "范围扩大，挥砍间隔缩短。", "epic", "warrior", (game) => {
      game.stats.meleeRange += 14;
      game.stats.meleeCooldown = Math.max(0.28, game.stats.meleeCooldown - 0.06);
      game.say("剑刃风暴：身边就是禁区。");
    }),
    upgrade("不屈传说", "生命大量提高并回复。", "legendary", "level", (game) => {
      game.maxHp += 60;
      game.hp = Math.min(game.maxHp, game.hp + 80);
      game.say("不屈传说：倒下之前还能再砍很久。");
    }),
    upgrade("王者斩", "近战伤害和范围巨幅提高。", "legendary", "warrior", (game) => {
      game.stats.meleeDamage += 32;
      game.stats.meleeRange += 12;
      game.say("王者斩：一剑开路。");
    }),
    upgrade("时间裂斩", "挥砍间隔巨幅缩短。", "legendary", "warrior", (game) => {
      game.stats.meleeCooldown = Math.max(0.22, game.stats.meleeCooldown - 0.16);
      game.say("时间裂斩：快到像残影。");
    }),
    upgrade("黄金护体", "防御和金币收益提高。", "legendary", "coin", (game) => {
      game.stats.defense = Math.min(0.62, game.stats.defense + 0.08);
      game.stats.coinBonus += 0.18;
      game.say("黄金护体：越富越硬。");
    }),
    upgrade("巨神步", "移动速度和金币拾取范围大量提高。", "legendary", "xp", (game) => {
      game.stats.moveSpeed += 20;
      game.stats.magnet += 44;
      game.say("巨神步：战场像被你拉近了。");
    }),
  ],
  mage: [
    upgrade("奥术充能", "魔法飞弹伤害提高。", "common", "mage", (game) => {
      game.stats.primaryDamage += 9;
      game.say("奥术充能：飞弹更痛。");
    }),
    upgrade("稳态法阵", "魔法飞弹射程提高。", "common", "mage", (game) => {
      game.stats.primaryRange += 18;
      game.say("稳态法阵：锁敌更远。");
    }),
    upgrade("魔力回路", "魔法飞弹冷却小幅缩短。", "common", "mage", (game) => {
      game.stats.primaryCooldown = Math.max(0.32, game.stats.primaryCooldown - 0.04);
      game.say("魔力回路：施法更顺。");
    }),
    upgrade("薄暮护盾", "防御和最大生命小幅提高。", "common", "level", (game) => {
      game.maxHp += 12;
      game.hp = Math.min(game.maxHp, game.hp + 18);
      game.stats.defense = Math.min(0.36, game.stats.defense + 0.02);
      game.say("薄暮护盾：脆皮也有底气。");
    }),
    upgrade("灵感磁场", "金币吸附范围提高。", "common", "xp", (game) => {
      game.stats.magnet += 22;
      game.say("灵感磁场：金币会自己靠近。");
    }),
    upgrade("分裂魔弹", "魔法飞弹额外锁定一个目标。", "elite", "mage", (game) => {
      game.stats.primaryTargets += 1;
      game.say("分裂魔弹：同时轰击更多敌人。");
    }),
    upgrade("冰霜回响", "飞弹附带小范围减速爆发。", "elite", "mage", (game) => {
      game.stats.magicSplash += 1;
      game.say("冰霜回响：怪群会被冻住脚步。");
    }),
    upgrade("星火增幅", "伤害和射程同时提高。", "elite", "mage", (game) => {
      game.stats.primaryDamage += 10;
      game.stats.primaryRange += 12;
      game.say("星火增幅：飞弹更亮也更狠。");
    }),
    upgrade("急速咏唱", "冷却明显缩短。", "elite", "mage", (game) => {
      game.stats.primaryCooldown = Math.max(0.3, game.stats.primaryCooldown - 0.07);
      game.say("急速咏唱：魔弹连发。");
    }),
    upgrade("秘银法袍", "最大生命和防御提高。", "elite", "level", (game) => {
      game.maxHp += 22;
      game.hp = Math.min(game.maxHp, game.hp + 22);
      game.stats.defense = Math.min(0.42, game.stats.defense + 0.04);
      game.say("秘银法袍：法师也能抗一下。");
    }),
    upgrade("连锁奥术", "飞弹目标数和伤害提高。", "epic", "mage", (game) => {
      game.stats.primaryTargets += 1;
      game.stats.primaryDamage += 8;
      game.say("连锁奥术：火力开始成片。");
    }),
    upgrade("寒星领域", "减速爆发范围和射程提高。", "epic", "mage", (game) => {
      game.stats.magicSplash += 1;
      game.stats.primaryRange += 24;
      game.say("寒星领域：远处怪群也会变慢。");
    }),
    upgrade("奥术超频", "伤害提高，冷却缩短。", "epic", "mage", (game) => {
      game.stats.primaryDamage += 14;
      game.stats.primaryCooldown = Math.max(0.28, game.stats.primaryCooldown - 0.06);
      game.say("奥术超频：输出进入高速档。");
    }),
    upgrade("符文虹吸", "金币拾取范围和金币收益提高。", "epic", "coin", (game) => {
      game.stats.magnet += 34;
      game.stats.coinBonus += 0.12;
      game.say("符文虹吸：资源向你聚拢。");
    }),
    upgrade("流星公式", "飞弹伤害大幅提高。", "epic", "mage", (game) => {
      game.stats.primaryDamage += 22;
      game.say("流星公式：每发都像小陨石。");
    }),
    upgrade("大法师回路", "目标数、伤害和射程提高。", "legendary", "mage", (game) => {
      game.stats.primaryTargets += 2;
      game.stats.primaryDamage += 16;
      game.stats.primaryRange += 20;
      game.say("大法师回路：魔弹开始铺屏。");
    }),
    upgrade("永冻星核", "减速爆发大幅提高。", "legendary", "mage", (game) => {
      game.stats.magicSplash += 2;
      game.stats.primaryDamage += 10;
      game.say("永冻星核：怪物像踩进冰湖。");
    }),
    upgrade("无尽咏唱", "冷却巨幅缩短。", "legendary", "mage", (game) => {
      game.stats.primaryCooldown = Math.max(0.2, game.stats.primaryCooldown - 0.16);
      game.say("无尽咏唱：飞弹不停。");
    }),
    upgrade("星界护身", "生命、防御和移动速度提高。", "legendary", "level", (game) => {
      game.maxHp += 45;
      game.hp = Math.min(game.maxHp, game.hp + 45);
      game.stats.defense = Math.min(0.48, game.stats.defense + 0.06);
      game.stats.moveSpeed += 12;
      game.say("星界护身：法师不再脆得离谱。");
    }),
    upgrade("奥术金雨", "金币收益和伤害提高。", "legendary", "coin", (game) => {
      game.stats.coinBonus += 0.25;
      game.stats.primaryDamage += 16;
      game.say("奥术金雨：轰怪也赚钱。");
    }),
  ],
  archer: [
    upgrade("锐化飞镖", "飞镖伤害和射程提高。", "common", "archer", (game) => {
      game.stats.primaryDamage += 8;
      game.stats.primaryRange += 12;
      game.say("锐化飞镖：投得更远更痛。");
    }),
    upgrade("快手投掷", "飞镖攻击间隔小幅缩短。", "common", "archer", (game) => {
      game.stats.primaryCooldown = Math.max(0.28, game.stats.primaryCooldown - 0.04);
      game.say("快手投掷：手感更快。");
    }),
    upgrade("轻身步", "移动速度提高。", "common", "xp", (game) => {
      game.stats.moveSpeed += 9;
      game.say("轻身步：更容易拉开距离。");
    }),
    upgrade("远望", "飞镖射程提高。", "common", "archer", (game) => {
      game.stats.primaryRange += 24;
      game.say("远望：先手距离更长。");
    }),
    upgrade("拾取短靴", "金币拾取范围提高。", "common", "xp", (game) => {
      game.stats.magnet += 20;
      game.say("拾取短靴：边跑边捡。");
    }),
    upgrade("回旋飞镖", "飞镖穿透数量提高。", "elite", "archer", (game) => {
      game.stats.primaryPierce += 1;
      game.say("回旋飞镖：一镖穿更多。");
    }),
    upgrade("双镖术", "每次额外锁定一个方向。", "elite", "archer", (game) => {
      game.stats.primaryTargets += 1;
      game.say("双镖术：两路出手。");
    }),
    upgrade("毒刃打磨", "飞镖伤害明显提高。", "elite", "archer", (game) => {
      game.stats.primaryDamage += 13;
      game.say("毒刃打磨：命中更痛。");
    }),
    upgrade("疾跑游侠", "移动速度和射程提高。", "elite", "archer", (game) => {
      game.stats.moveSpeed += 10;
      game.stats.primaryRange += 14;
      game.say("疾跑游侠：拉扯空间更大。");
    }),
    upgrade("软甲内衬", "最大生命和防御提高。", "elite", "level", (game) => {
      game.maxHp += 20;
      game.hp = Math.min(game.maxHp, game.hp + 20);
      game.stats.defense = Math.min(0.38, game.stats.defense + 0.04);
      game.say("软甲内衬：远程也不怕擦伤。");
    }),
    upgrade("飞镖雨", "额外锁定方向和冷却强化。", "epic", "archer", (game) => {
      game.stats.primaryTargets += 1;
      game.stats.primaryCooldown = Math.max(0.26, game.stats.primaryCooldown - 0.05);
      game.say("飞镖雨：弹幕开始成形。");
    }),
    upgrade("穿心回旋", "穿透和伤害提高。", "epic", "archer", (game) => {
      game.stats.primaryPierce += 2;
      game.stats.primaryDamage += 8;
      game.say("穿心回旋：怪群会被串起来。");
    }),
    upgrade("鹰眼专注", "射程和伤害大幅提高。", "epic", "archer", (game) => {
      game.stats.primaryRange += 34;
      game.stats.primaryDamage += 14;
      game.say("鹰眼专注：远处也能精准命中。");
    }),
    upgrade("影步", "移动速度和冷却强化。", "epic", "archer", (game) => {
      game.stats.moveSpeed += 14;
      game.stats.primaryCooldown = Math.max(0.26, game.stats.primaryCooldown - 0.06);
      game.say("影步：边跑边投更丝滑。");
    }),
    upgrade("赏金猎手", "金币收益和金币拾取范围提高。", "epic", "coin", (game) => {
      game.stats.coinBonus += 0.16;
      game.stats.magnet += 28;
      game.say("赏金猎手：清怪也清账。");
    }),
    upgrade("千刃同归", "飞镖目标数大幅提高。", "legendary", "archer", (game) => {
      game.stats.primaryTargets += 2;
      game.say("千刃同归：多路飞镖齐发。");
    }),
    upgrade("神速手腕", "飞镖冷却巨幅缩短。", "legendary", "archer", (game) => {
      game.stats.primaryCooldown = Math.max(0.18, game.stats.primaryCooldown - 0.16);
      game.say("神速手腕：手影几乎看不清。");
    }),
    upgrade("破甲金镖", "飞镖伤害和穿透巨幅提高。", "legendary", "archer", (game) => {
      game.stats.primaryDamage += 28;
      game.stats.primaryPierce += 2;
      game.say("破甲金镖：一线清场。");
    }),
    upgrade("风行者斗篷", "移动速度、射程和防御提高。", "legendary", "archer", (game) => {
      game.stats.moveSpeed += 20;
      game.stats.primaryRange += 28;
      game.stats.defense = Math.min(0.45, game.stats.defense + 0.05);
      game.say("风行者斗篷：距离就是安全。");
    }),
    upgrade("钻石镖袋", "金币收益、金币拾取范围和伤害提高。", "legendary", "coin", (game) => {
      game.stats.coinBonus += 0.22;
      game.stats.magnet += 36;
      game.stats.primaryDamage += 12;
      game.say("钻石镖袋：富一点，狠一点。");
    }),
  ],
};

function talent(id, title, text, cost, max, apply) {
  return { id, title, text, cost, max, apply };
}

const TALENT_TREES = {
  wendi: [
    talent("wendi-vital", "铁血体魄", "生命上限提高，适合近身抗压。", 1, 3, (game) => {
      game.maxHp += 18;
      game.hp = Math.min(game.maxHp, game.hp + 18);
    }),
    talent("wendi-guard", "厚甲训练", "防御提高，受到伤害降低。", 1, 3, (game) => {
      game.stats.defense = Math.min(0.68, game.stats.defense + 0.035);
    }),
    talent("wendi-hunt", "转职荒野猎人", "每隔数秒掷出回旋刀，往返路径上的敌人都会受伤。", 2, 1, (game) => {
      game.talentFlags.wildHunter = 1;
    }),
    talent("wendi-berserker", "转职狂战士", "战锤环绕自身旋转，靠近的敌人持续受到伤害。", 2, 1, (game) => {
      game.talentFlags.berserker = 1;
    }),
    talent("wendi-shadow", "转职暗影骑士", "周期性向最近敌人短冲刺，路径敌人受到伤害。", 2, 1, (game) => {
      game.talentFlags.shadowKnight = 1;
    }),
    talent("wendi-footwork", "荒野步伐", "移动速度提高，追击和脱离都更顺。", 1, 2, (game) => {
      game.stats.moveSpeed += 10;
    }),
  ],
  mike: [
    talent("mike-power", "奥术增幅", "魔法飞弹伤害提高。", 1, 3, (game) => {
      game.stats.primaryDamage += 7;
    }),
    talent("mike-shield", "秘法护身", "生命和防御提高。", 1, 2, (game) => {
      game.maxHp += 12;
      game.hp = Math.min(game.maxHp, game.hp + 12);
      game.stats.defense = Math.min(0.42, game.stats.defense + 0.025);
    }),
    talent("mike-fire", "转职烈焰法师", "周期性召唤陨石砸向怪群。", 2, 1, (game) => {
      game.talentFlags.flameMage = 1;
    }),
    talent("mike-space", "转职空间法师", "周期性召唤黑洞聚集怪物并造成伤害。", 2, 1, (game) => {
      game.talentFlags.spaceMage = 1;
    }),
    talent("mike-frost", "转职寒冰法师", "周期性引发暴风雪，减速并有概率冰冻敌人。", 2, 1, (game) => {
      game.talentFlags.frostMage = 1;
    }),
    talent("mike-flow", "法力流动", "冷却缩短，施法节奏更快。", 1, 2, (game) => {
      game.stats.primaryCooldown = Math.max(0.22, game.stats.primaryCooldown - 0.045);
    }),
  ],
  ming: [
    talent("ming-damage", "精准手腕", "飞镖伤害和射程提高。", 1, 3, (game) => {
      game.stats.primaryDamage += 5;
      game.stats.primaryRange += 8;
    }),
    talent("ming-speed", "疾影步", "移动速度和冷却手感提高。", 1, 2, (game) => {
      game.stats.moveSpeed += 10;
      game.stats.primaryCooldown = Math.max(0.22, game.stats.primaryCooldown - 0.035);
    }),
    talent("ming-shadow", "转职暗影", "取消普通飞镖，敌人靠近时瞬移到背后造成圆形突刺。", 2, 1, (game) => {
      game.talentFlags.shadowAssassin = 1;
    }),
    talent("ming-blood", "转职血忍", "飞镖命中后连接附近敌人，共享一次伤害。", 2, 1, (game) => {
      game.talentFlags.bloodNinja = 1;
    }),
    talent("ming-oni", "转职鬼武者", "周期性召唤分身站在原地攻击敌人。", 2, 1, (game) => {
      game.talentFlags.onimusha = 1;
    }),
    talent("ming-pierce", "破风镖", "穿透数量提高，怪群更容易被串联。", 1, 2, (game) => {
      game.stats.primaryPierce += 1;
    }),
  ],
};

function shopItem(id, icon, title, text, basePrice, apply) {
  return { id, icon, title, text, basePrice, apply };
}

const SHOP_POOL = [
  shopItem("potion", "potion", "生命药剂", "回复 50 点生命。", 8, (game) => {
    game.hp = Math.min(game.maxHp, game.hp + 50);
  }),
  shopItem("bigPotion", "bigPotion", "大瓶生命药剂", "回复 90 点生命。", 24, (game) => {
    game.hp = Math.min(game.maxHp, game.hp + 90);
  }),
  shopItem("amulet", "amulet", "铁护符", "最大生命 +25。", 22, (game) => {
    game.maxHp += 25;
    game.hp = Math.min(game.maxHp, game.hp + 25);
  }),
  shopItem("armor", "armor", "鳞甲片", "防御 +4%。", 24, (game) => {
    game.stats.defense = Math.min(0.65, game.stats.defense + 0.04);
  }),
  shopItem("boots", "boot", "疾行靴", "移动速度 +12。", 18, (game) => {
    game.stats.moveSpeed += 12;
  }),
  shopItem("feather", "feather", "轻羽披风", "移动速度 +18。", 32, (game) => {
    game.stats.moveSpeed += 18;
  }),
  shopItem("magnet", "magnet", "磁石", "金币拾取范围 +36。", 12, (game) => {
    game.stats.magnet += 36;
  }),
  shopItem("bigMagnet", "crystal", "蓝晶磁核", "金币拾取范围 +64。", 36, (game) => {
    game.stats.magnet += 64;
  }),
  shopItem("coinCharm", "coin", "聚宝符", "金币收益 +20%。", 24, (game) => {
    game.stats.coinBonus += 0.2;
  }),
  shopItem("goldCrown", "crown", "小金冠", "金币收益 +35%。", 50, (game) => {
    game.stats.coinBonus += 0.35;
  }),
  shopItem("whetstone", "anvil", "磨刀石", "当前攻击伤害 +10。", 22, (game) => {
    increaseHeroDamage(game, 10);
  }),
  shopItem("silverEdge", "sword", "银刃", "当前攻击伤害 +18。", 42, (game) => {
    increaseHeroDamage(game, 18);
  }),
  shopItem("clock", "clock", "冷却齿轮", "当前攻击间隔缩短。", 34, (game) => {
    reduceHeroCooldown(game, 0.06);
  }),
  shopItem("goldClock", "hourglass", "精密沙漏", "当前攻击间隔明显缩短。", 58, (game) => {
    reduceHeroCooldown(game, 0.1);
  }),
  shopItem("scope", "scope", "侦察灯", "当前攻击距离 +24。", 20, (game) => {
    increaseHeroRange(game, 24);
  }),
  shopItem("stormLantern", "storm", "风暴提灯", "当前攻击距离 +42。", 44, (game) => {
    increaseHeroRange(game, 42);
  }),
  shopItem("glove", "glove", "力量手套", "伤害 +8，生命 +12。", 32, (game) => {
    increaseHeroDamage(game, 8);
    game.maxHp += 12;
    game.hp = Math.min(game.maxHp, game.hp + 12);
  }),
  shopItem("ring", "ring", "回春戒指", "最大生命 +18，并回满 30 生命。", 28, (game) => {
    game.maxHp += 18;
    game.hp = Math.min(game.maxHp, game.hp + 30);
  }),
  shopItem("scroll", "scroll", "经验卷轴", "立即获得半级经验。", 18, (game) => {
    game.addXp(Math.ceil(game.nextXp * 0.5));
  }),
  shopItem("diamond", "gem", "微光钻石", "获得 1 颗钻石。", 60, (game) => {
    game.gems += 1;
  }),
];

const AUDIO_FILES = {
  tap: "assets/audio/tap.wav",
  start: "assets/audio/start.wav",
  confirm: "assets/audio/confirm.wav",
  buyConfirm: "assets/audio/buyConfirm.wav",
  fail: "assets/audio/fail.wav",
  refresh: "assets/audio/refresh.wav",
  deal: "assets/audio/deal.wav",
  burn: "assets/audio/burn.wav",
  absorb: "assets/audio/absorb.wav",
  upgradePick: "assets/audio/upgradePick.wav",
  level: "assets/audio/level.wav",
  hit: "assets/audio/hit.wav",
  hurt: "assets/audio/hurt.wav",
  melee: "assets/audio/melee.wav",
  warrior: "assets/audio/warrior.wav",
  mage: "assets/audio/mage.wav",
  archer: "assets/audio/archer.wav",
  coin: "assets/audio/coin.wav",
  xp: "assets/audio/xp.wav",
  shop: "assets/audio/shop.wav",
  shopOpen: "assets/audio/shopOpen.wav",
  boss: "assets/audio/boss.wav",
  meteor: "assets/audio/meteor.wav",
  blackhole: "assets/audio/blackhole.wav",
  blizzard: "assets/audio/blizzard.wav",
  bgm: "assets/audio/bgm-loop.wav",
};

class Pool {
  constructor(create) {
    this.create = create;
    this.free = [];
  }

  get() {
    return this.free.pop() || this.create();
  }

  release(item) {
    item.active = false;
    this.free.push(item);
  }
}

class Sfx {
  constructor() {
    this.ctx = null;
    this.last = new Map();
    this.output = null;
    this.masterVolume = 0.82;
    this.musicVolume = 0.28;
    this.muted = false;
    this.musicMuted = false;
    this.bgm = null;
    this.samples = new Map();
    this.loadingSamples = false;
    this.failedSamples = new Set();
  }

  unlock() {
    const AudioCtor = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtor) return;
    if (!this.ctx || this.ctx.state === "closed") this.ctx = new AudioCtor({ latencyHint: "interactive" });
    this.ensureOutput();
    this.loadSamples();
    this.startBgm();
    this.resume();
  }

  ensureOutput() {
    if (!this.ctx) return;
    if (!this.output) {
      this.output = this.ctx.createGain();
      this.output.connect(this.ctx.destination);
    }
    this.output.gain.value = this.muted ? 0 : this.masterVolume;
  }

  async loadSamples() {
    if (!this.ctx || this.loadingSamples) return;
    this.loadingSamples = true;
    await Promise.all(Object.entries(AUDIO_FILES).map(async ([name, url]) => {
      try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`${response.status} ${url}`);
        const arrayBuffer = await response.arrayBuffer();
        const buffer = await this.ctx.decodeAudioData(arrayBuffer.slice(0));
        this.samples.set(name, buffer);
      } catch (error) {
        this.failedSamples.add(name);
      }
    }));
    document.body.dataset.audioFiles = String(this.samples.size);
    document.body.dataset.audioMissing = String(this.failedSamples.size);
    this.startBgm();
  }

  playSample(name, now) {
    const buffer = this.samples.get(name);
    if (!buffer || !this.output) return false;
    const source = this.ctx.createBufferSource();
    const gain = this.ctx.createGain();
    source.buffer = buffer;
    gain.gain.value = this.sampleGain(name);
    source.connect(gain).connect(this.output);
    source.start(now);
    return true;
  }

  sampleGain(name) {
    return {
      tap: 0.72,
      start: 0.78,
      confirm: 0.74,
      buyConfirm: 0.82,
      fail: 0.72,
      refresh: 0.72,
      deal: 0.68,
      burn: 0.7,
      absorb: 0.78,
      upgradePick: 0.9,
      level: 0.8,
      hit: 0.62,
      hurt: 0.76,
      melee: 0.7,
      warrior: 0.78,
      mage: 0.78,
      archer: 0.76,
      coin: 0.64,
      xp: 0.56,
      shop: 0.68,
      shopOpen: 0.78,
      boss: 0.82,
      meteor: 0.82,
      blackhole: 0.8,
      blizzard: 0.72,
    }[name] || 0.72;
  }

  setSfxVolume(value) {
    this.masterVolume = clamp(Number(value) || 0, 0, 1);
    this.ensureOutput();
  }

  setMusicVolume(value) {
    this.musicVolume = clamp(Number(value) || 0, 0, 1);
    this.updateBgmGain();
  }

  setSfxMuted(muted) {
    this.muted = muted;
    this.ensureOutput();
  }

  setMusicMuted(muted) {
    this.musicMuted = muted;
    this.updateBgmGain();
  }

  startBgm() {
    if (!this.ctx) return;
    const bgmBuffer = this.samples.get("bgm");
    if (bgmBuffer) {
      if (this.bgm?.kind === "file") return;
      if (this.bgm?.low) {
        try {
          this.bgm.low.stop();
          this.bgm.high.stop();
        } catch (error) {
          // Oscillator fallback may already be stopped in some browsers.
        }
      }
      const gain = this.ctx.createGain();
      const source = this.ctx.createBufferSource();
      source.buffer = bgmBuffer;
      source.loop = true;
      gain.gain.value = this.musicMuted ? 0 : this.musicVolume * 0.5;
      source.connect(gain).connect(this.ctx.destination);
      source.start();
      this.bgm = { kind: "file", gain, source };
      return;
    }
    if (this.bgm) return;
    const gain = this.ctx.createGain();
    const low = this.ctx.createOscillator();
    const high = this.ctx.createOscillator();
    low.type = "sine";
    high.type = "triangle";
    low.frequency.value = 72;
    high.frequency.value = 144;
    gain.gain.value = this.musicMuted ? 0 : this.musicVolume * 0.035;
    low.connect(gain);
    high.connect(gain);
    gain.connect(this.ctx.destination);
    low.start();
    high.start();
    this.bgm = { kind: "osc", gain, low, high };
  }

  updateBgmGain() {
    if (this.bgm) {
      this.bgm.gain.gain.value = this.musicMuted ? 0 : this.musicVolume * (this.bgm.kind === "file" ? 0.5 : 0.035);
    }
  }

  resume() {
    if (!this.ctx) return;
    if (this.ctx.state === "suspended") {
      this.ctx.resume().catch(() => {});
    }
  }

  play(name) {
    if (!this.ctx) return;
    if (this.ctx.state === "suspended") this.resume();
    this.ensureOutput();
    if (this.muted || this.masterVolume <= 0) return;
    const now = this.ctx.currentTime;
    const limit = {
      hit: 0.045,
      melee: 0.16,
      warrior: 0.14,
      mage: 0.15,
      archer: 0.13,
      coin: 0.08,
      xp: 0.06,
      deal: 0.25,
      burn: 0.22,
      absorb: 0.32,
      level: 0.35,
      hurt: 0.2,
      boss: 1,
      shop: 0.16,
      tap: 0.045,
      confirm: 0.12,
      buyConfirm: 0.18,
      fail: 0.18,
      refresh: 0.24,
      shopOpen: 0.5,
      start: 0.45,
      upgradePick: 0.22,
      meteor: 0.5,
      blackhole: 0.6,
      blizzard: 0.6,
    }[name] || 0;
    if (now - (this.last.get(name) || 0) < limit) return;
    this.last.set(name, now);
    if (this.playSample(name, now)) return;
    if (name === "hit") this.hit(now);
    if (name === "melee") this.noiseSweep(now, 420, 1800, 0.1, 0.1);
    if (name === "warrior") this.warriorWave(now);
    if (name === "mage") this.mageBolt(now);
    if (name === "archer") this.arrowShot(now);
    if (name === "coin") this.chime(now, [1046, 1568], 0.055, 0.04);
    if (name === "xp") this.chime(now, [880, 1320], 0.035, 0.035);
    if (name === "deal") this.chime(now, [392, 494, 587], 0.045, 0.045);
    if (name === "burn") this.burn(now);
    if (name === "absorb") this.absorb(now);
    if (name === "level") this.chime(now, [523, 659, 784, 1046], 0.07, 0.05);
    if (name === "hurt") this.drop(now);
    if (name === "boss") this.boss(now);
    if (name === "shop") this.chime(now, [659, 988], 0.05, 0.05);
    if (name === "tap") this.tap(now);
    if (name === "confirm") this.confirm(now);
    if (name === "buyConfirm") this.buyConfirm(now);
    if (name === "fail") this.fail(now);
    if (name === "refresh") this.chime(now, [523, 784, 1046], 0.045, 0.045);
    if (name === "start") this.chime(now, [392, 587, 784, 1175], 0.06, 0.08);
    if (name === "upgradePick") this.chime(now, [1760, 2349, 3136, 4186], 0.05, 0.04);
    if (name === "meteor") {
      this.noiseSweep(now, 1800, 90, 0.14, 0.38);
      this.drop(now + 0.22);
    }
    if (name === "blackhole") this.absorb(now);
    if (name === "blizzard") this.noiseSweep(now, 2600, 760, 0.08, 0.5);
    if (name === "shopOpen") {
      this.noiseSweep(now, 240, 1800, 0.08, 0.24);
      this.chime(now + 0.04, [440, 660, 880], 0.04, 0.055);
    }
  }

  tap(now) {
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(1280, now);
    osc.frequency.exponentialRampToValueAtTime(620, now + 0.055);
    gain.gain.setValueAtTime(0.055, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.065);
    osc.connect(gain).connect(this.output);
    osc.start(now);
    osc.stop(now + 0.075);
  }

  confirm(now) {
    this.chime(now, [784, 988, 1319], 0.055, 0.045);
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = "triangle";
    osc.frequency.setValueAtTime(330, now);
    osc.frequency.exponentialRampToValueAtTime(880, now + 0.16);
    gain.gain.setValueAtTime(0.035, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
    osc.connect(gain).connect(this.output);
    osc.start(now);
    osc.stop(now + 0.2);
  }

  buyConfirm(now) {
    this.chime(now, [659, 880, 1175], 0.06, 0.045);
    this.chime(now + 0.08, [1319, 1760], 0.04, 0.035);
    this.noiseSweep(now, 620, 180, 0.035, 0.12);
  }

  fail(now) {
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = "square";
    osc.frequency.setValueAtTime(160, now);
    osc.frequency.exponentialRampToValueAtTime(90, now + 0.13);
    gain.gain.setValueAtTime(0.06, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
    osc.connect(gain).connect(this.output);
    osc.start(now);
    osc.stop(now + 0.16);
  }

  hit(now) {
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = "triangle";
    osc.frequency.setValueAtTime(220, now);
    osc.frequency.exponentialRampToValueAtTime(70, now + 0.08);
    gain.gain.setValueAtTime(0.07, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);
    osc.connect(gain).connect(this.output);
    osc.start(now);
    osc.stop(now + 0.1);
  }

  noiseSweep(now, startFreq, endFreq, volume, duration) {
    const size = Math.floor(this.ctx.sampleRate * duration);
    const buffer = this.ctx.createBuffer(1, size, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < size; i += 1) data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / size, 2.2);
    const source = this.ctx.createBufferSource();
    const filter = this.ctx.createBiquadFilter();
    const gain = this.ctx.createGain();
    source.buffer = buffer;
    filter.type = "bandpass";
    filter.Q.value = 5;
    filter.frequency.setValueAtTime(startFreq, now);
    filter.frequency.exponentialRampToValueAtTime(endFreq, now + duration * 0.75);
    gain.gain.setValueAtTime(volume, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);
    source.connect(filter).connect(gain).connect(this.output);
    source.start(now);
  }

  warriorWave(now) {
    this.noiseSweep(now, 180, 1450, 0.14, 0.16);
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(120, now);
    osc.frequency.exponentialRampToValueAtTime(54, now + 0.18);
    gain.gain.setValueAtTime(0.07, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
    osc.connect(gain).connect(this.output);
    osc.start(now);
    osc.stop(now + 0.21);
  }

  mageBolt(now) {
    this.chime(now, [988, 1319, 1976], 0.048, 0.035);
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(520, now);
    osc.frequency.exponentialRampToValueAtTime(2400, now + 0.18);
    gain.gain.setValueAtTime(0.035, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
    osc.connect(gain).connect(this.output);
    osc.start(now);
    osc.stop(now + 0.21);
  }

  arrowShot(now) {
    this.pluck(now);
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = "triangle";
    osc.frequency.setValueAtTime(920, now);
    osc.frequency.exponentialRampToValueAtTime(310, now + 0.07);
    gain.gain.setValueAtTime(0.055, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);
    osc.connect(gain).connect(this.output);
    osc.start(now + 0.018);
    osc.stop(now + 0.11);
  }

  chime(now, notes, volume, gap) {
    notes.forEach((freq, index) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const start = now + index * gap;
      osc.type = "sine";
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(volume, start);
      gain.gain.exponentialRampToValueAtTime(0.001, start + 0.14);
      osc.connect(gain).connect(this.output);
      osc.start(start);
      osc.stop(start + 0.16);
    });
  }

  pluck(now) {
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = "triangle";
    osc.frequency.setValueAtTime(620, now);
    osc.frequency.exponentialRampToValueAtTime(280, now + 0.09);
    gain.gain.setValueAtTime(0.075, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
    osc.connect(gain).connect(this.output);
    osc.start(now);
    osc.stop(now + 0.13);
  }

  burn(now) {
    const size = Math.floor(this.ctx.sampleRate * 0.22);
    const buffer = this.ctx.createBuffer(1, size, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < size; i += 1) data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / size, 1.2);
    const source = this.ctx.createBufferSource();
    const filter = this.ctx.createBiquadFilter();
    const gain = this.ctx.createGain();
    source.buffer = buffer;
    filter.type = "highpass";
    filter.frequency.value = 1200;
    gain.gain.setValueAtTime(0.09, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
    source.connect(filter).connect(gain).connect(this.output);
    source.start(now);
  }

  absorb(now) {
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(330, now);
    osc.frequency.exponentialRampToValueAtTime(1760, now + 0.28);
    gain.gain.setValueAtTime(0.065, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.32);
    osc.connect(gain).connect(this.output);
    osc.start(now);
    osc.stop(now + 0.34);
  }

  drop(now) {
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = "square";
    osc.frequency.setValueAtTime(180, now);
    osc.frequency.exponentialRampToValueAtTime(55, now + 0.15);
    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
    osc.connect(gain).connect(this.output);
    osc.start(now);
    osc.stop(now + 0.2);
  }

  boss(now) {
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(92, now);
    osc.frequency.exponentialRampToValueAtTime(32, now + 0.55);
    gain.gain.setValueAtTime(0.16, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.62);
    osc.connect(gain).connect(this.output);
    osc.start(now);
    osc.stop(now + 0.65);
  }
}

class Game {
  constructor() {
    this.sfx = new Sfx();
    this.audioSettings = this.readAudioSettings();
    this.sfx.setSfxVolume(this.audioSettings.sfxVolume);
    this.sfx.setMusicVolume(this.audioSettings.musicVolume);
    this.sfx.setSfxMuted(this.audioSettings.sfxMuted);
    this.sfx.setMusicMuted(this.audioSettings.musicMuted);
    this.keys = new Set();
    this.pointerActive = false;
    this.joystickActive = false;
    this.joystickVector = { x: 0, y: 0 };
    this.joystickOrigin = { x: 0, y: 0 };
    this.pointerId = null;
    this.cardUnlockAt = 0;
    this.shopUnlockAt = 0;
    this.heroUnlockAt = 0;
    this.last = 0;
    this.rafSeenAt = Date.now();
    this.fps = 60;
    this.debugTimer = 0;
    this.capHits = 0;
    this.enemyPool = new Pool(() => ({}));
    this.dropPool = new Pool(() => ({}));
    this.particlePool = new Pool(() => ({}));
    this.textPool = new Pool(() => ({}));
    this.effectPool = new Pool(() => ({}));
    this.resize();
    this.bindEvents();
    this.reset();
    requestAnimationFrame((time) => this.frame(time));
    setInterval(() => this.fallbackFrame(), 100);
  }

  reset() {
    if (this.active) {
      this.releaseAll(this.active.enemies, this.enemyPool);
      this.releaseAll(this.active.drops, this.dropPool);
      this.releaseAll(this.active.particles, this.particlePool);
      this.releaseAll(this.active.texts, this.textPool);
      this.releaseAll(this.active.effects, this.effectPool);
    }
    this.mode = "title";
    this.floor = 1;
    this.floorTime = 0;
    this.floorKills = 0;
    this.floorSpawned = 0;
    this.floorSpawnLimit = 12;
    this.floorGoal = 12;
    this.specialSpawned = false;
    this.specialDefeated = true;
    this.spawnTimer = 1.2;
    this.attackTimer = 0;
    this.hitStop = 0;
    this.shake = 0;
    this.sayTimer = 0;
    this.hp = 120;
    this.maxHp = 120;
    this.coins = 0;
    this.gems = 0;
    this.xp = 0;
    this.level = 1;
    this.nextXp = 52;
    this.skillPoints = 0;
    this.floorTimeLimit = 60;
    this.hero = null;
    this.pendingHero = null;
    this.attackStyle = "melee";
    this.profession = null;
    this.pendingUpgrades = 0;
    this.cardResolving = false;
    this.shopOffers = [];
    this.shopSelected = null;
    this.shopMessageTimer = 0;
    this.refreshPrice = 12;
    this.tutorialIndex = 0;
    this.tutorialSteps = [];
    this.resumeMode = "combat";
    this.talentLevels = {};
    this.talentFlags = {};
    this.talentTimers = {
      wildHunter: 1.4,
      berserker: 0.25,
      shadowKnight: 1.15,
      flameMage: 2.8,
      spaceMage: 4.6,
      frostMage: 5.4,
      onimusha: 3.8,
    };
    this.stats = {
      moveSpeed: 168,
      defense: 0,
      magnet: 70,
      coinBonus: 0,
      meleeDamage: 24,
      meleeRange: 48,
      meleeCooldown: 0.78,
      primaryDamage: 0,
      primaryRange: 0,
      primaryCooldown: 0,
      primaryTargets: 1,
      primaryPierce: 0,
      waveWidth: 28,
      magicSplash: 0,
    };
    this.camera = {
      x: 0,
      y: 0,
      scale: window.innerWidth <= 430 ? 0.78 : 0.84,
    };
    this.player = {
      x: WORLD.width / 2,
      y: WORLD.height / 2,
      tx: WORLD.width / 2,
      ty: WORLD.height / 2,
      radius: 15,
      flash: 0,
      step: 0,
      absorb: 0,
    };
    this.active = {
      enemies: [],
      drops: [],
      particles: [],
      texts: [],
      effects: [],
    };
    this.clearLayer(ui.shop);
    this.clearLayer(ui.levelUp);
    this.clearLayer(ui.heroSelect);
    this.clearLayer(ui.heroConfirm);
    this.clearLayer(ui.buyDialog);
    this.clearLayer(ui.tutorialDialog);
    this.clearLayer(ui.statsPanel);
    this.clearLayer(ui.settings);
    this.updateUi();
    this.draw();
  }

  start() {
    this.sfx.unlock();
    const saved = this.readSave();
    this.reset();
    ui.overlay.classList.add("hidden");
    if (saved?.heroId) {
      this.restoreSave(saved);
      this.say("已读取保存进度。");
      return;
    }
    this.openHeroSelect();
  }

  openHeroSelect() {
    this.mode = "hero";
    this.heroUnlockAt = performance.now() + 750;
    ui.heroSelect.classList.add("locked");
    ui.heroCards.forEach((button) => {
      button.disabled = true;
      button.classList.add("locked");
    });
    ui.heroSelect.classList.remove("hidden");
    ui.start.textContent = "重新开始";
    this.say("先选择一名冒险者，再进入第1层。");
    this.sfx.play("deal");
    setTimeout(() => {
      ui.heroCards.forEach((button) => {
        button.disabled = false;
        button.classList.remove("locked");
      });
      ui.heroSelect.classList.remove("locked");
    }, 750);
    this.updateUi();
  }

  selectHero(heroId) {
    if (performance.now() < this.heroUnlockAt) return;
    const hero = HEROES[heroId];
    if (!hero) return;
    this.pendingHero = hero;
    ui.heroConfirmAvatar.textContent = hero.name[0];
    ui.heroConfirmAvatar.className = `hero-avatar hero-${hero.profession === "warrior" ? "warrior" : hero.profession === "mage" ? "mage" : "dart"}`;
    ui.heroConfirmTitle.textContent = `选择 ${hero.name}？`;
    ui.heroConfirmText.textContent = `职业：${hero.title}\n\n${this.describeHero(hero)}。`;
    ui.heroConfirm.classList.remove("hidden");
    ui.heroConfirm.classList.add("locked");
    this.sfx.play("deal");
    setTimeout(() => ui.heroConfirm.classList.remove("locked"), 520);
  }

  cancelHeroConfirm() {
    this.sfx.play("tap");
    this.pendingHero = null;
    this.clearLayer(ui.heroConfirm);
  }

  confirmHeroSelection() {
    if (!this.pendingHero || ui.heroConfirm.classList.contains("locked")) return;
    this.sfx.play("confirm");
    const hero = this.pendingHero;
    this.pendingHero = null;
    this.hero = hero;
    this.profession = hero.profession;
    this.attackStyle = hero.attackStyle;
    this.maxHp = hero.maxHp;
    this.hp = hero.maxHp;
    this.stats.moveSpeed = hero.moveSpeed;
    this.stats.defense = hero.defense;
    Object.assign(this.stats, hero.stats);
    this.player.absorb = 0.9;
    this.addEffect("absorb", this.player.x, this.player.y, 58, hero.color);
    this.clearLayer(ui.heroSelect);
    this.clearLayer(ui.heroConfirm);
    this.openTutorial();
    this.say(hero.intro);
    this.sfx.play(hero.sound);
    this.updateUi();
  }

  describeHero(hero) {
    if (hero.id === "wendi") return "高生命、高防御、低攻击、短距离";
    if (hero.id === "mike") return "低生命、低防御、高攻击、中距离";
    return "低生命、低防御、中攻击、远距离";
  }

  openTutorial() {
    this.mode = "tutorial";
    this.tutorialIndex = 0;
    this.tutorialSteps = [
      { type: "dialogue", speaker: this.hero?.name || "冒险者", text: "我怎么到这里来了？" },
      { type: "dialogue", speaker: this.hero?.name || "冒险者", text: "nb…" },
      { type: "dialogue", speaker: this.hero?.name || "冒险者", text: "不管了，先开打吧！" },
      {
        type: "tip",
        speaker: "操作提示",
        lines: [
          "按住屏幕任意位置拖动，角色会跟随方向移动。",
          "角色会自动攻击范围内的敌人，不需要手动点怪。",
          "打死怪物会直接获得经验；只有金币会掉落并自动吸附。",
          "升级会出现三张强化卡；每五层清完后进入一次商店。",
        ],
      },
    ];
    ui.tutorialDialog.classList.remove("hidden");
    this.renderTutorial();
  }

  renderTutorial() {
    const step = this.tutorialSteps[this.tutorialIndex] || {};
    const isTip = step.type === "tip";
    ui.tutorialDialog.classList.toggle("tip-mode", isTip);
    ui.tutorialKicker.textContent = isTip ? "操作说明" : "";
    ui.tutorialKicker.classList.toggle("empty", !isTip);
    ui.tutorialPortrait.textContent = this.hero ? this.hero.name[0] : "?";
    ui.tutorialPortrait.className = `speech-avatar ${this.profession || ""}`.trim();
    ui.tutorialSpeaker.textContent = step.speaker || this.hero?.name || "冒险者";
    if (Array.isArray(step.lines)) {
      ui.tutorialLine.innerHTML = `<div class="tip-lines">${step.lines.map((line) => `<span>${line}</span>`).join("")}</div>`;
    } else {
      ui.tutorialLine.textContent = step.text || "";
    }
    ui.tutorialNext.textContent = this.tutorialIndex >= this.tutorialSteps.length - 1 ? "开始战斗" : "下一步";
  }

  nextTutorial() {
    this.sfx.unlock();
    this.sfx.play("tap");
    this.tutorialIndex += 1;
    if (this.tutorialIndex >= this.tutorialSteps.length) {
      this.clearLayer(ui.tutorialDialog);
      this.startFloor(1);
      this.say("第1层怪物较少，先适应移动。");
      return;
    }
    this.renderTutorial();
  }

  startFloor(floor) {
    this.floor = floor;
    this.floorTime = 0;
    this.floorTimeLimit = Math.max(50, 78 - floor * 0.9);
    this.floorKills = 0;
    this.floorSpawned = 0;
    this.floorSpawnLimit = this.floorLimitFor(floor);
    this.floorGoal = this.floorSpawnLimit + (SPECIAL_FLOORS[floor] ? 1 : 0);
    this.specialSpawned = false;
    this.specialDefeated = !SPECIAL_FLOORS[floor];
    this.spawnTimer = floor === 1 ? 1.45 : Math.max(0.56, 0.98 - floor * 0.02);
    this.mode = "combat";
    this.clearLayer(ui.shop);
    this.clearLayer(ui.levelUp);
    this.say(SPECIAL_FLOORS[floor] ? `第${floor}层：${SPECIAL_FLOORS[floor].label}即将出现。` : `第${floor}层：清理怪群。`);
    this.updateUi();
  }

  floorLimitFor(floor) {
    if (floor === 1) return 8;
    const curve = 8 + floor * 2.6 + Math.max(0, floor - 8) * 1.6;
    return Math.min(84, Math.round(curve));
  }

  enemyScaleFor(floor) {
    const t = clamp((floor - 1) / 19, 0, 1);
    return {
      hp: 0.62 + floor * 0.09 + t * t * 1.15,
      attack: 0.42 + floor * 0.055 + t * t * 0.95,
      defense: Math.min(0.42, t * 0.36),
      speed: 0.84 + Math.min(0.36, floor * 0.014),
      xp: 0.9 + floor * 0.055,
    };
  }

  bindEvents() {
    window.addEventListener("resize", () => this.resize());
    document.addEventListener("contextmenu", (event) => event.preventDefault());
    document.addEventListener("selectstart", (event) => event.preventDefault());
    document.addEventListener("dragstart", (event) => event.preventDefault());
    document.addEventListener("gesturestart", (event) => event.preventDefault(), { passive: false });
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        this.endVirtualJoystick();
        this.keys.clear();
      } else {
        this.recoverAudio();
      }
    });
    window.addEventListener("pageshow", () => this.recoverAudio());
    window.addEventListener("focus", () => this.recoverAudio());
    ["pointerdown", "touchstart"].forEach((type) => {
      document.addEventListener(type, () => this.sfx.unlock(), { passive: true });
    });
    document.addEventListener(
      "pointerdown",
      (event) => {
        if (event.target.closest("button")) {
          this.sfx.unlock();
          this.sfx.play("tap");
        }
      },
      { capture: true, passive: true },
    );

    ui.start.addEventListener("click", () => {
      this.sfx.unlock();
      this.start();
    });
    ui.heroCards.forEach((button) => {
      button.addEventListener("click", () => {
        this.sfx.unlock();
        this.selectHero(button.dataset.hero);
      });
    });
    ui.heroConfirmCancel.addEventListener("click", () => this.cancelHeroConfirm());
    ui.heroConfirmOk.addEventListener("click", () => this.confirmHeroSelection());
    ui.hudAvatar.addEventListener("click", () => this.openStatsPanel());
    ui.statsClose.addEventListener("click", () => this.closeStatsPanel());
    ui.pause.addEventListener("click", () => {
      if (this.mode === "settings") this.closeSettings();
      else this.openSettings();
    });
    ui.settingsClose.addEventListener("click", () => this.closeSettings());
    ui.returnGame.addEventListener("click", () => this.closeSettings());
    ui.openTalents.addEventListener("click", () => this.renderTalentTree());
    ui.openAudio.addEventListener("click", () => this.renderAudioSettings());
    ui.saveProgress.addEventListener("click", () => this.saveProgress());
    ui.continueRun.addEventListener("click", () => this.continueFromShop());
    ui.tutorialNext.addEventListener("click", () => this.nextTutorial());
    ui.refreshShop.addEventListener("click", () => this.refreshShop());
    ui.buyCancel.addEventListener("click", () => this.closeBuyDialog(true));
    ui.buyConfirm.addEventListener("click", () => this.confirmPurchase());

    canvas.addEventListener("pointerdown", (event) => {
      this.sfx.unlock();
      this.startVirtualJoystick(event);
    });
    canvas.addEventListener("pointermove", (event) => {
      if (this.pointerActive) this.updateVirtualJoystick(event);
    });
    canvas.addEventListener("pointerup", (event) => {
      this.endVirtualJoystick(event);
    });
    canvas.addEventListener("pointercancel", (event) => this.endVirtualJoystick(event));

    window.addEventListener("keydown", (event) => {
      if (event.code === "Space") {
        event.preventDefault();
        if (this.mode === "title") this.start();
        else if (this.mode === "combat" || this.mode === "settings") ui.pause.click();
      }
      if (this.isDebug()) {
        if (event.code === "KeyN") this.finishFloor();
        if (event.code === "Digit6") {
          this.floor = 5;
          this.floorKills = this.floorGoal;
          this.finishFloor();
        }
        if (event.code === "Digit8") this.spawnSpecial();
        if (event.code === "Digit9") this.spawnSpecial(20);
        if (event.code === "Digit0") this.addXp(this.nextXp);
      }
      this.keys.add(event.code);
    });
    window.addEventListener("keyup", (event) => this.keys.delete(event.code));
  }

  recoverAudio() {
    this.sfx.unlock();
  }

  startVirtualJoystick(event) {
    if (this.mode !== "combat") return;
    this.pointerActive = true;
    this.joystickActive = true;
    this.pointerId = event.pointerId;
    this.joystickOrigin.x = event.clientX;
    this.joystickOrigin.y = event.clientY;
    if (canvas.setPointerCapture) canvas.setPointerCapture(event.pointerId);
    this.updateVirtualJoystick(event);
    event.preventDefault();
  }

  updateVirtualJoystick(event) {
    const max = window.innerWidth <= 430 ? 32 : 46;
    const rawX = event.clientX - this.joystickOrigin.x;
    const rawY = event.clientY - this.joystickOrigin.y;
    const len = Math.hypot(rawX, rawY);
    const clamped = Math.min(max, len);
    const nx = len > 0 ? rawX / len : 0;
    const ny = len > 0 ? rawY / len : 0;
    const response = Math.min(1, (clamped / max) * 1.2);
    this.joystickVector.x = nx * response;
    this.joystickVector.y = ny * response;
    if (len > max) {
      this.joystickOrigin.x = event.clientX - nx * max;
      this.joystickOrigin.y = event.clientY - ny * max;
    }
    event.preventDefault();
  }

  endVirtualJoystick(event) {
    this.pointerActive = false;
    this.joystickActive = false;
    this.joystickVector.x = 0;
    this.joystickVector.y = 0;
    if (event?.pointerId !== undefined && canvas.releasePointerCapture) {
      try {
        if (canvas.hasPointerCapture?.(event.pointerId)) canvas.releasePointerCapture(event.pointerId);
      } catch {}
    }
    this.pointerId = null;
  }

  resize() {
    const rect = canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.max(1, Math.round(rect.width * dpr));
    canvas.height = Math.max(1, Math.round(rect.height * dpr));
    ctx.setTransform(canvas.width / VIEW.width, 0, 0, canvas.height / VIEW.height, 0, 0);
    if (this.camera) this.camera.scale = window.innerWidth <= 430 ? 0.78 : 0.84;
  }

  frame(time) {
    this.rafSeenAt = Date.now();
    this.tick(time);
    requestAnimationFrame((next) => this.frame(next));
  }

  fallbackFrame() {
    if (Date.now() - this.rafSeenAt < 180) return;
    this.tick(performance.now());
  }

  tick(time) {
    let dt = Math.min(0.033, (time - this.last) / 1000 || 0);
    this.last = time;
    this.fps = lerp(this.fps, dt > 0 ? 1 / dt : 60, 0.08);
    if (this.hitStop > 0) {
      this.hitStop -= dt;
      dt *= 0.25;
    }
    this.sayTimer -= dt;
    this.shopMessageTimer -= dt;
    if (this.mode === "combat") this.update(dt);
    else {
      this.updateEffects(dt);
      this.player.absorb = Math.max(0, this.player.absorb - dt);
      if (this.sayTimer <= 0) ui.toast.classList.remove("show");
      if (this.shopMessageTimer <= 0 && ui.shopMessage) ui.shopMessage.textContent = "";
    }
    this.draw();
    this.updateDebug();
  }

  update(dt) {
    this.floorTime += dt;
    this.spawnTimer -= dt;
    this.attackTimer -= dt;
    this.shake = Math.max(0, this.shake - dt * 18);
    this.player.flash = Math.max(0, this.player.flash - dt);
    this.player.absorb = Math.max(0, this.player.absorb - dt);
    this.updatePlayer(dt);
    this.updateSpawn();
    this.updateAttack();
    this.updateTalents(dt);
    this.updateEnemies(dt);
    this.updateDrops(dt);
    this.updateEffects(dt);
    this.checkFloorClear();
    this.updateUi();
    if (this.hp <= 0) this.gameOver();
  }

  updatePlayer(dt) {
    let dx = 0;
    let dy = 0;
    if (this.keys.has("KeyA") || this.keys.has("ArrowLeft")) dx -= 1;
    if (this.keys.has("KeyD") || this.keys.has("ArrowRight")) dx += 1;
    if (this.keys.has("KeyW") || this.keys.has("ArrowUp")) dy -= 1;
    if (this.keys.has("KeyS") || this.keys.has("ArrowDown")) dy += 1;
    if (this.joystickActive && Math.hypot(this.joystickVector.x, this.joystickVector.y) > 0.02) {
      dx = this.joystickVector.x;
      dy = this.joystickVector.y;
    }

    if (dx || dy) {
      const len = Math.hypot(dx, dy) || 1;
      this.player.x += (dx / len) * this.stats.moveSpeed * dt;
      this.player.y += (dy / len) * this.stats.moveSpeed * dt;
    }

    this.player.x = clamp(this.player.x, WORLD.minX, WORLD.maxX);
    this.player.y = clamp(this.player.y, WORLD.minY, WORLD.maxY);
    this.player.tx = this.player.x;
    this.player.ty = this.player.y;
    this.player.step += Math.hypot(dx, dy) * dt * 10;
    this.updateCamera();
  }

  updateCamera() {
    if (!this.camera) return;
    const viewW = VIEW.width / this.camera.scale;
    const viewH = VIEW.height / this.camera.scale;
    this.camera.x = clamp(this.player.x - viewW / 2, 0, WORLD.width - viewW);
    this.camera.y = clamp(this.player.y - viewH / 2, 0, WORLD.height - viewH);
  }

  updateSpawn() {
    if (this.floorSpawned >= this.floorSpawnLimit) {
      if (SPECIAL_FLOORS[this.floor] && !this.specialSpawned) this.spawnSpecial();
      return;
    }

    const cap = this.enemyCap();
    if (this.active.enemies.length >= cap) {
      this.capHits += 1;
      this.spawnTimer = Math.max(this.spawnTimer, 0.2);
      return;
    }

    const warmupCap = this.floor === 1 && this.floorTime < 8 ? 4 : cap;
    if (this.active.enemies.length >= warmupCap) return;

    if (this.spawnTimer <= 0) {
      const early = this.floor === 1 && this.floorTime < 8;
      const batch = early ? 1 : this.floor >= 12 ? 2 : 1;
      for (let i = 0; i < batch && this.active.enemies.length < warmupCap; i += 1) {
        if (!this.spawnEnemy()) break;
      }
      const pressure = early ? 0 : Math.min(0.46, this.floor * 0.018);
      this.spawnTimer = early ? random(1.15, 1.75) : Math.max(0.17, random(0.36, 0.78) - pressure);
    }

    if (SPECIAL_FLOORS[this.floor] && !this.specialSpawned && this.floorSpawned >= Math.floor(this.floorSpawnLimit * 0.6)) {
      this.spawnSpecial();
    }
  }

  updateAttack() {
    if (this.attackTimer > 0) return;
    if (this.talentFlags.shadowAssassin) {
      if (this.castShadowStrike()) this.attackTimer = Math.max(0.42, this.stats.primaryCooldown * 1.25);
      else this.attackTimer = 0.16;
      return;
    }
    if (this.attackStyle === "melee") {
      this.castMelee();
      this.attackTimer = this.stats.meleeCooldown;
      return;
    }
    if (this.attackStyle === "wave") this.castWarriorWave();
    if (this.attackStyle === "mage") this.castMagicBolt();
    if (this.attackStyle === "dart") this.castDart();
    this.attackTimer = this.stats.primaryCooldown;
  }

  castMelee() {
    let hits = 0;
    for (const enemy of this.active.enemies) {
      if (distance(enemy, this.player) <= this.stats.meleeRange + enemy.radius) {
        this.damageEnemy(enemy, this.stats.meleeDamage, COLORS.warrior);
        hits += 1;
      }
    }
    if (hits > 0) {
      this.addEffect("slash", this.player.x, this.player.y, this.stats.meleeRange + 16, COLORS.warrior, this.nearestDirection(this.stats.meleeRange + 40));
      this.sfx.play("melee");
    }
  }

  castWarriorWave() {
    const target = this.findNearest(this.stats.primaryRange + 50);
    if (!target) return;
    const angle = Math.atan2(target.y - this.player.y, target.x - this.player.x);
    const ux = Math.cos(angle);
    const uy = Math.sin(angle);
    let hits = 0;
    const enemies = [...this.active.enemies].sort((a, b) => distance(a, this.player) - distance(b, this.player));
    for (const enemy of enemies) {
      const vx = enemy.x - this.player.x;
      const vy = enemy.y - this.player.y;
      const along = vx * ux + vy * uy;
      const side = Math.abs(vx * uy - vy * ux);
      if (along > 0 && along < this.stats.primaryRange && side < this.stats.waveWidth + enemy.radius) {
        this.damageEnemy(enemy, this.stats.primaryDamage, COLORS.warrior);
        hits += 1;
        if (hits >= this.stats.primaryTargets) break;
      }
    }
    if (hits > 0) {
      this.addEffect("wave", this.player.x, this.player.y, this.stats.primaryRange, COLORS.warrior, angle);
      this.sfx.play("warrior");
    }
  }

  castMagicBolt() {
    const targets = [];
    for (let i = 0; i < this.stats.primaryTargets; i += 1) {
      const target = this.findNearest(this.stats.primaryRange, targets);
      if (!target) break;
      targets.push(target);
    }
    if (!targets.length) return;
    for (const target of targets) {
      this.damageEnemy(target, this.stats.primaryDamage, COLORS.mage);
      this.addEffect("missile", target.x, target.y, 0, COLORS.mage, 0, this.player.x, this.player.y - 14);
      if (this.stats.magicSplash > 0) {
        const radius = 32 + this.stats.magicSplash * 5;
        for (const enemy of this.active.enemies) {
          if (enemy !== target && distance(enemy, target) <= radius + enemy.radius) {
            enemy.slow = Math.max(enemy.slow, 1.1);
            this.damageEnemy(enemy, Math.round(this.stats.primaryDamage * 0.38), COLORS.frost);
          }
        }
        this.addEffect("ring", target.x, target.y, radius, COLORS.frost);
      }
    }
    this.sfx.play("mage");
  }

  castDart() {
    const targets = [];
    const shots = Math.max(1, this.stats.primaryTargets || 1);
    for (let i = 0; i < shots; i += 1) {
      const target = this.findNearest(this.stats.primaryRange, targets);
      if (!target) break;
      targets.push(target);
    }
    if (!targets.length) return;

    for (const target of targets) {
      const angle = Math.atan2(target.y - this.player.y, target.x - this.player.x);
      const ux = Math.cos(angle);
      const uy = Math.sin(angle);
      const hits = [];
      for (const enemy of this.active.enemies) {
        const vx = enemy.x - this.player.x;
        const vy = enemy.y - this.player.y;
        const along = vx * ux + vy * uy;
        const side = Math.abs(vx * uy - vy * ux);
        if (along > 0 && along < this.stats.primaryRange && side < 13 + enemy.radius) {
          hits.push({ enemy, along });
        }
      }
      hits.sort((a, b) => a.along - b.along);
      const maxHits = this.stats.primaryPierce + 1;
      for (let i = 0; i < Math.min(maxHits, hits.length); i += 1) {
        const hitEnemy = hits[i].enemy;
        this.damageEnemy(hitEnemy, this.stats.primaryDamage, COLORS.archer);
        if (this.talentFlags.bloodNinja) this.chainBloodNinja(hitEnemy);
      }
      this.addEffect("dart", this.player.x, this.player.y, this.stats.primaryRange, COLORS.archer, angle);
    }
    this.sfx.play("archer");
  }

  updateTalents(dt) {
    if (!this.hero) return;
    this.updateTalentTimer("wildHunter", dt, 1.45, () => this.castBoomerang());
    this.updateTalentTimer("berserker", dt, 0.28, () => this.castHammerOrbit());
    this.updateTalentTimer("shadowKnight", dt, 1.18, () => this.castShadowDash());
    this.updateTalentTimer("flameMage", dt, 3.1, () => this.castMeteor());
    this.updateTalentTimer("spaceMage", dt, 4.8, () => this.castBlackHole());
    this.updateTalentTimer("frostMage", dt, 5.6, () => this.castBlizzard());
    this.updateTalentTimer("onimusha", dt, 4.2, () => this.castCloneStrike());
  }

  updateTalentTimer(flag, dt, interval, cast) {
    if (!this.talentFlags[flag]) return;
    this.talentTimers[flag] = (this.talentTimers[flag] ?? interval) - dt;
    if (this.talentTimers[flag] > 0) return;
    this.talentTimers[flag] = interval;
    cast();
  }

  castBoomerang() {
    const target = this.findNearest(210);
    if (!target) return;
    this.lineDamage(this.player.x, this.player.y, target.x, target.y, 18, this.stats.meleeDamage * 0.95, COLORS.warrior);
    this.addEffect("boomerang", target.x, target.y, distance(this.player, target), COLORS.warrior, 0, this.player.x, this.player.y);
    this.sfx.play("warrior");
  }

  castHammerOrbit() {
    let hits = 0;
    const radius = 62;
    for (const enemy of this.active.enemies) {
      if (distance(enemy, this.player) <= radius + enemy.radius) {
        this.damageEnemy(enemy, this.stats.meleeDamage * 0.32, COLORS.fire);
        hits += 1;
      }
    }
    if (hits > 0) this.addEffect("hammerOrbit", this.player.x, this.player.y, radius, COLORS.fire);
  }

  castShadowDash() {
    const target = this.findNearest(190);
    if (!target) return;
    const angle = Math.atan2(target.y - this.player.y, target.x - this.player.x);
    const fromX = this.player.x;
    const fromY = this.player.y;
    this.player.x = clamp(this.player.x + Math.cos(angle) * 56, WORLD.minX, WORLD.maxX);
    this.player.y = clamp(this.player.y + Math.sin(angle) * 56, WORLD.minY, WORLD.maxY);
    this.lineDamage(fromX, fromY, this.player.x, this.player.y, 22, this.stats.meleeDamage * 1.35, "#9b5cff");
    this.addEffect("shadowStrike", this.player.x, this.player.y, 42, "#9b5cff", angle, fromX, fromY);
    this.sfx.play("warrior");
  }

  castMeteor() {
    const target = this.findNearest(260);
    if (!target) return;
    const radius = 58;
    for (const enemy of this.active.enemies) {
      if (distance(enemy, target) <= radius + enemy.radius) this.damageEnemy(enemy, this.stats.primaryDamage * 0.9, COLORS.fire);
    }
    this.addEffect("meteor", target.x, target.y, radius, COLORS.fire, 0, target.x - 70, target.y - 95);
    this.sfx.play("mage");
  }

  castBlackHole() {
    const target = this.findNearest(280);
    if (!target) return;
    const radius = 92;
    for (const enemy of this.active.enemies) {
      const d = distance(enemy, target);
      if (d <= radius + enemy.radius) {
        enemy.x = lerp(enemy.x, target.x, 0.22);
        enemy.y = lerp(enemy.y, target.y, 0.22);
        this.damageEnemy(enemy, this.stats.primaryDamage * 0.45, COLORS.mage);
      }
    }
    this.addEffect("blackhole", target.x, target.y, radius, COLORS.mage);
    this.sfx.play("absorb");
  }

  castBlizzard() {
    const radius = 260;
    for (const enemy of this.active.enemies) {
      enemy.slow = Math.max(enemy.slow, Math.random() < 0.28 ? 2.2 : 1.35);
      this.damageEnemy(enemy, this.stats.primaryDamage * 0.22, COLORS.frost);
    }
    this.addEffect("blizzard", this.player.x, this.player.y, radius, COLORS.frost);
    this.sfx.play("mage");
  }

  castShadowStrike() {
    const target = this.findNearest(this.stats.primaryRange);
    if (!target) return false;
    const angle = Math.atan2(target.y - this.player.y, target.x - this.player.x);
    this.player.x = clamp(target.x - Math.cos(angle) * 24, WORLD.minX, WORLD.maxX);
    this.player.y = clamp(target.y - Math.sin(angle) * 24, WORLD.minY, WORLD.maxY);
    const radius = 42;
    for (const enemy of this.active.enemies) {
      if (distance(enemy, target) <= radius + enemy.radius) this.damageEnemy(enemy, this.stats.primaryDamage * 1.28, "#9b5cff");
    }
    this.addEffect("shadowStrike", target.x, target.y, radius, "#9b5cff", angle, this.player.x, this.player.y);
    this.sfx.play("archer");
    return true;
  }

  chainBloodNinja(source) {
    let linked = null;
    let best = 72;
    for (const enemy of this.active.enemies) {
      if (enemy === source) continue;
      const d = distance(enemy, source);
      if (d < best) {
        best = d;
        linked = enemy;
      }
    }
    if (!linked) return;
    this.damageEnemy(linked, this.stats.primaryDamage * 0.78, "#ff70a6");
    this.addEffect("bolt", linked.x, linked.y, 0, "#ff70a6", 0, source.x, source.y);
  }

  castCloneStrike() {
    const origin = { x: this.player.x - 34, y: this.player.y + 18 };
    const targets = [];
    for (let i = 0; i < 2; i += 1) {
      const target = this.findNearest(this.stats.primaryRange, targets);
      if (!target) break;
      targets.push(target);
      this.damageEnemy(target, this.stats.primaryDamage * 0.75, COLORS.archer);
      this.addEffect("dart", origin.x, origin.y, distance(origin, target), COLORS.archer, Math.atan2(target.y - origin.y, target.x - origin.x));
    }
    this.addEffect("clone", origin.x, origin.y, 38, COLORS.archer);
    if (targets.length) this.sfx.play("archer");
  }

  lineDamage(x1, y1, x2, y2, width, damage, color) {
    const dx = x2 - x1;
    const dy = y2 - y1;
    const lenSq = dx * dx + dy * dy || 1;
    for (const enemy of this.active.enemies) {
      const t = clamp(((enemy.x - x1) * dx + (enemy.y - y1) * dy) / lenSq, 0, 1);
      const px = x1 + dx * t;
      const py = y1 + dy * t;
      if (Math.hypot(enemy.x - px, enemy.y - py) <= width + enemy.radius) this.damageEnemy(enemy, damage, color);
    }
  }

  updateEnemies(dt) {
    for (let i = this.active.enemies.length - 1; i >= 0; i -= 1) {
      const enemy = this.active.enemies[i];
      enemy.flash = Math.max(0, enemy.flash - dt);
      enemy.slow = Math.max(0, enemy.slow - dt);
      enemy.attackTimer -= dt;
      enemy.morph += dt * (6.5 + Math.abs(enemy.spin || 0) * 2);
      const dx = this.player.x - enemy.x;
      const dy = this.player.y - enemy.y;
      const len = Math.hypot(dx, dy) || 1;
      const speed = enemy.speed * (enemy.slow > 0 ? 0.48 : 1);
      enemy.x += (dx / len) * speed * dt;
      enemy.y += (dy / len) * speed * dt;
      enemy.pulse += dt * 4;

      if (len <= enemy.radius + this.player.radius + 4 && enemy.attackTimer <= 0) {
        enemy.attackTimer = this.floor === 1 && this.floorTime < 16 ? 1.55 : 0.9;
        this.hurtPlayer(enemy.attack);
      }

      if (enemy.hp <= 0) this.killEnemy(i);
    }
  }

  updateDrops(dt) {
    for (let i = this.active.drops.length - 1; i >= 0; i -= 1) {
      const drop = this.active.drops[i];
      drop.x += drop.vx * dt;
      drop.y += drop.vy * dt;
      drop.vx *= Math.pow(0.12, dt);
      drop.vy *= Math.pow(0.12, dt);
      const d = distance(drop, this.player);
      if (d < this.stats.magnet) {
        const pull = 1 - Math.pow(0.00005, dt);
        drop.x = lerp(drop.x, this.player.x, pull);
        drop.y = lerp(drop.y, this.player.y, pull);
      }
      if (d < this.player.radius + drop.radius) {
        this.coins += drop.value;
        this.sfx.play("coin");
        this.releaseActive(this.active.drops, i, this.dropPool);
      }
    }
  }

  updateEffects(dt) {
    for (let i = this.active.effects.length - 1; i >= 0; i -= 1) {
      const effect = this.active.effects[i];
      effect.life -= dt;
      if (effect.life <= 0) this.releaseActive(this.active.effects, i, this.effectPool);
    }
    for (let i = this.active.particles.length - 1; i >= 0; i -= 1) {
      const p = this.active.particles[i];
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.life -= dt;
      if (p.life <= 0) this.releaseActive(this.active.particles, i, this.particlePool);
    }
    for (let i = this.active.texts.length - 1; i >= 0; i -= 1) {
      const text = this.active.texts[i];
      text.y -= 22 * dt;
      text.life -= dt;
      if (text.life <= 0) this.releaseActive(this.active.texts, i, this.textPool);
    }
  }

  spawnEnemy() {
    if (this.floorSpawned >= this.floorSpawnLimit) return false;
    const scale = this.enemyScaleFor(this.floor);
    const earlySoft = this.floor === 1 && this.floorTime < 16;
    const type = ENEMY_TYPES[Math.floor(Math.random() * ENEMY_TYPES.length)];
    const enemy = this.enemyPool.get();
    this.placeOnEdge(enemy);
    enemy.active = true;
    enemy.kind = type.id;
    enemy.rank = "small";
    enemy.label = "";
    enemy.hp = type.hp * scale.hp;
    if (earlySoft) enemy.hp *= 0.55;
    enemy.maxHp = enemy.hp;
    enemy.speed = type.speed * scale.speed * (earlySoft ? 0.82 : 1);
    enemy.radius = type.radius;
    enemy.attack = type.attack * scale.attack * (earlySoft ? 0.42 : 1);
    enemy.defense = earlySoft ? 0 : scale.defense;
    enemy.xp = Math.ceil(type.xp * scale.xp);
    enemy.coins = Math.max(1, Math.round(type.coins * (0.82 + this.floor * 0.042) * (1 + this.stats.coinBonus)));
    enemy.color = type.color;
    enemy.shape = type.shape;
    enemy.attackTimer = earlySoft ? random(1.4, 2.3) : random(0.55, 1.15);
    enemy.flash = 0;
    enemy.slow = 0;
    enemy.pulse = random(0, Math.PI * 2);
    enemy.morph = random(0, Math.PI * 2);
    enemy.spin = random(-1.2, 1.2);
    this.active.enemies.push(enemy);
    this.floorSpawned += 1;
    return true;
  }

  spawnSpecial(overrideFloor = this.floor) {
    const spec = SPECIAL_FLOORS[overrideFloor] || SPECIAL_FLOORS[20];
    const scale = this.enemyScaleFor(overrideFloor);
    const base = ENEMY_TYPES[2];
    const enemy = this.enemyPool.get();
    this.placeOnEdge(enemy);
    enemy.active = true;
    enemy.kind = "special";
    enemy.rank = spec.label;
    enemy.label = spec.label;
    enemy.hp = base.hp * spec.hp * scale.hp * 1.2;
    enemy.maxHp = enemy.hp;
    enemy.speed = base.speed * spec.speed * scale.speed;
    enemy.radius = base.radius * spec.radius;
    enemy.attack = base.attack * spec.attack * scale.attack;
    enemy.defense = Math.min(0.55, scale.defense + 0.12);
    enemy.xp = Math.ceil(90 + this.floor * 12);
    enemy.coins = Math.ceil((24 + this.floor * 6) * (1 + this.stats.coinBonus));
    enemy.color = spec.color;
    enemy.shape = "box";
    enemy.attackTimer = 0.8;
    enemy.flash = 0;
    enemy.slow = 0;
    enemy.pulse = 0;
    enemy.morph = random(0, Math.PI * 2);
    enemy.spin = random(-0.8, 0.8);
    this.specialSpawned = true;
    this.specialDefeated = false;
    this.active.enemies.push(enemy);
    this.sfx.play(overrideFloor >= 20 ? "boss" : "level");
    this.say(`${spec.label}出现！`);
  }

  viewBounds(padding = 0) {
    const scale = this.camera?.scale || 1;
    const width = VIEW.width / scale;
    const height = VIEW.height / scale;
    return {
      left: clamp((this.camera?.x || 0) - padding, 0, WORLD.width),
      right: clamp((this.camera?.x || 0) + width + padding, 0, WORLD.width),
      top: clamp((this.camera?.y || 0) - padding, 0, WORLD.height),
      bottom: clamp((this.camera?.y || 0) + height + padding, 0, WORLD.height),
    };
  }

  placeOnEdge(enemy) {
    const side = Math.floor(Math.random() * 4);
    const view = this.viewBounds(72);
    if (side === 0) {
      enemy.x = random(view.left, view.right);
      enemy.y = view.top - 24;
    } else if (side === 1) {
      enemy.x = view.right + 24;
      enemy.y = random(view.top, view.bottom);
    } else if (side === 2) {
      enemy.x = random(view.left, view.right);
      enemy.y = view.bottom + 24;
    } else {
      enemy.x = view.left - 24;
      enemy.y = random(view.top, view.bottom);
    }
    enemy.x = clamp(enemy.x, WORLD.minX - 40, WORLD.maxX + 40);
    enemy.y = clamp(enemy.y, WORLD.minY - 40, WORLD.maxY + 40);
  }

  killEnemy(index) {
    const enemy = this.active.enemies[index];
    this.floorKills += 1;
    if (enemy.rank !== "small") {
      this.specialDefeated = true;
      this.gems += this.floor >= 20 ? 5 : 1;
    }
    this.addXp(enemy.xp);
    this.floatText(`+${enemy.xp}经验`, enemy.x, enemy.y - enemy.radius - 18, COLORS.xp);
    this.spawnDrop(enemy.x + random(-8, 8), enemy.y + random(-8, 8), "coin", enemy.coins, 6);
    this.burst(enemy.x, enemy.y, enemy.color, enemy.rank === "small" ? 8 : 24);
    this.releaseActive(this.active.enemies, index, this.enemyPool);
    this.sfx.play("hit");
  }

  spawnDrop(x, y, kind, value, radius) {
    const drop = this.dropPool.get();
    drop.active = true;
    drop.kind = kind;
    drop.x = x;
    drop.y = y;
    drop.vx = random(-34, 34);
    drop.vy = random(-34, 34);
    drop.value = value;
    drop.radius = radius;
    drop.color = COLORS.gold;
    this.active.drops.push(drop);
  }

  damageEnemy(enemy, damage, color) {
    const finalDamage = Math.max(1, damage * (1 - (enemy.defense || 0)));
    enemy.hp -= finalDamage;
    enemy.flash = 0.1;
    this.hitStop = Math.max(this.hitStop, 0.006);
    this.floatText(Math.round(finalDamage), enemy.x, enemy.y - enemy.radius - 5, color);
    if (this.active.particles.length < 220) this.burst(enemy.x, enemy.y, color, 3);
  }

  hurtPlayer(amount) {
    const finalDamage = Math.max(1, amount * (1 - this.stats.defense));
    this.hp -= finalDamage;
    this.player.flash = 0.18;
    this.shake = Math.max(this.shake, 5);
    this.sfx.play("hurt");
    if (navigator.vibrate) navigator.vibrate(25);
  }

  addXp(value) {
    this.xp += value;
    while (this.xp >= this.nextXp) {
      this.xp -= this.nextXp;
      this.level += 1;
      this.nextXp = Math.floor(this.nextXp * 1.22 + 18);
      this.pendingUpgrades += 1;
      this.skillPoints += 1;
      this.sfx.play("level");
    }
    this.tryOpenPendingChoice();
  }

  tryOpenPendingChoice() {
    if (this.mode !== "combat" || this.cardResolving) return;
    if (this.pendingUpgrades > 0) {
      const choices = this.profession ? CLASS_UPGRADES[this.profession] : BASIC_UPGRADES;
      this.openCards("升级了！", this.profession ? pickUpgradeChoices(choices, 3) : shuffle([...choices]).slice(0, 3), "upgrade");
    }
  }

  openCards(title, choices, kind) {
    this.mode = "upgrade";
    this.cardResolving = false;
    this.cardUnlockAt = performance.now() + 900;
    ui.upgradeTitle.textContent = title;
    ui.upgradeItems.innerHTML = "";
    ui.upgradeItems.className = "choice-grid card-fan";
    ui.levelUp.classList.remove("absorbing");
    ui.levelUp.classList.add("locked");
    choices.forEach((choice, index) => {
      const button = document.createElement("button");
      button.className = "choice-card";
      button.type = "button";
      button.disabled = true;
      button.classList.add("locked");
      if (choice.rarity) button.classList.add(`rarity-${choice.rarity}`);
      button.style.setProperty("--card-color", choice.color);
      button.style.setProperty("--delay", `${index * 90}ms`);
      button.style.setProperty("--r", `${(index - 1) * 8}deg`);
      button.innerHTML = `${choice.rarityLabel ? `<small>${choice.rarityLabel}</small>` : ""}<strong>${choice.title}</strong><span>${choice.text}</span>`;
      button.addEventListener("click", () => this.chooseCard(button, choice, kind));
      ui.upgradeItems.appendChild(button);
    });
    ui.levelUp.classList.remove("hidden");
    this.sfx.play("deal");
    setTimeout(() => {
      [...ui.upgradeItems.children].forEach((button) => {
        button.disabled = false;
        button.classList.remove("locked");
      });
      ui.levelUp.classList.remove("locked");
    }, 900);
    this.updateUi();
  }

  chooseCard(button, choice, kind) {
    if (this.cardResolving || performance.now() < this.cardUnlockAt) return;
    this.cardResolving = true;
    [...ui.upgradeItems.children].forEach((item) => {
      item.disabled = true;
      if (item === button) item.classList.add("burning");
      else item.classList.add("folding");
    });
    this.sfx.play("burn");
    setTimeout(() => {
      choice.apply(this);
      if (choice.sound) this.sfx.play(choice.sound);
      this.sfx.play("absorb");
      this.player.absorb = 0.8;
      const rarityPower = { common: 1, elite: 1.25, epic: 1.55, legendary: 2 }[choice.rarity || "common"];
      const effectColor = choice.color || COLORS.xp;
      this.addEffect(choice.rarity ? `upgrade-${choice.rarity}` : "absorb", this.player.x, this.player.y, 58 * rarityPower, effectColor);
      this.burst(this.player.x, this.player.y - 8, effectColor, Math.round(18 * rarityPower));
      if (choice.rarity === "epic" || choice.rarity === "legendary") {
        this.addEffect("ring", this.player.x, this.player.y, 42 * rarityPower, effectColor);
      }
      if (kind === "upgrade") this.pendingUpgrades = Math.max(0, this.pendingUpgrades - 1);
      ui.levelUp.classList.add("absorbing");
      setTimeout(() => {
        this.clearLayer(ui.levelUp);
        ui.levelUp.classList.remove("absorbing");
        this.cardResolving = false;
        this.mode = "combat";
        this.tryOpenPendingChoice();
        this.updateUi();
      }, 260);
    }, 560);
  }

  finishFloor() {
    this.releaseAll(this.active.enemies, this.enemyPool);
    this.clearLayer(ui.levelUp);
    this.clearLayer(ui.buyDialog);
    if (this.floor >= 20) {
      this.winRun();
      return;
    }
    if (this.floor % 5 === 0) {
      this.mode = "shop";
      this.openShop();
      return;
    }
    this.say(`第${this.floor}层已清理，继续进入第${this.floor + 1}层。`);
    this.startFloor(this.floor + 1);
    this.tryOpenPendingChoice();
  }

  checkFloorClear() {
    if (this.mode !== "combat") return;
    const allRegularSpawned = this.floorSpawned >= this.floorSpawnLimit;
    if (allRegularSpawned && this.specialDefeated && this.active.enemies.length === 0) this.finishFloor();
  }

  openShop() {
    ui.shopItems.innerHTML = "";
    this.shopUnlockAt = performance.now() + 700;
    this.shopSelected = null;
    this.refreshPrice = Math.floor(18 + this.floor * 6 + this.level * 2);
    ui.continueRun.disabled = true;
    ui.continueRun.classList.add("locked");
    ui.shop.classList.add("locked");
    this.shopOffers = this.rollShopOffers();
    this.renderShop();
    ui.shop.classList.remove("hidden");
    this.player.absorb = 0.7;
    this.addEffect("shopOpen", this.player.x, this.player.y, 86, COLORS.gold);
    this.sfx.play("shopOpen");
    this.say(`第${this.floor}层已清理，购买道具后进入下一层。`);
    setTimeout(() => {
      ui.continueRun.disabled = false;
      ui.continueRun.classList.remove("locked");
      ui.shop.classList.remove("locked");
      this.renderShop();
    }, 700);
    this.updateUi();
  }

  renderShop() {
    ui.shopItems.innerHTML = "";
    const locked = performance.now() < this.shopUnlockAt;
    ui.shopGold.textContent = `金币 ${this.coins}`;
    ui.refreshShop.textContent = `刷新 ${this.refreshPrice}金`;
    ui.refreshShop.disabled = locked;
    this.shopOffers.forEach((item) => {
      const button = document.createElement("button");
      button.className = "choice-card shop-card";
      button.type = "button";
      if (locked) button.classList.add("locked");
      if (this.shopSelected === item) button.classList.add("selected");
      button.disabled = locked || item.sold;
      button.innerHTML = `<span class="shop-icon" aria-hidden="true">${shopIconSvg(item.icon)}</span><strong>${item.title}</strong><span>${item.text}</span><em>${item.sold ? "已购买" : `${item.price} 金币`}</em>`;
      button.addEventListener("click", () => {
        if (performance.now() < this.shopUnlockAt || item.sold) return;
        this.openBuyDialog(item);
      });
      ui.shopItems.appendChild(button);
    });
  }

  rollShopOffers() {
    const guaranteed = this.floor <= 5 ? SHOP_POOL.find((item) => item.id === "potion") : null;
    const pool = SHOP_POOL.filter((item) => item !== guaranteed);
    const selected = guaranteed ? [guaranteed, ...shuffle([...pool]).slice(0, 3)] : shuffle([...pool]).slice(0, 4);
    return selected.map((item) => ({
      ...item,
      price: Math.floor(item.basePrice * (1.38 + this.floor * 0.1) + this.floor * 4 + this.level * 2),
      sold: false,
    }));
  }

  openBuyDialog(item) {
    this.sfx.play("tap");
    this.shopSelected = item;
    ui.buyIcon.innerHTML = shopIconSvg(item.icon);
    ui.buyTitle.textContent = item.title;
    ui.buyText.textContent = item.text;
    ui.buyPrice.textContent = `${item.price} 金币`;
    ui.buyConfirm.disabled = this.coins < item.price;
    ui.buyConfirm.textContent = this.coins < item.price ? "金币不足" : "确认购买";
    if (this.coins < item.price) {
      this.showShopMessage(`金币不足，还差 ${item.price - this.coins} 金。`);
      this.sfx.play("fail");
    }
    ui.buyDialog.classList.remove("hidden");
    this.renderShop();
  }

  closeBuyDialog(playSound = false) {
    if (playSound) this.sfx.play("tap");
    this.shopSelected = null;
    this.clearLayer(ui.buyDialog);
    this.renderShop();
  }

  confirmPurchase() {
    if (!this.shopSelected) return;
    const item = this.shopSelected;
    if (this.coins < item.price) {
      this.showShopMessage(`金币不足，还差 ${item.price - this.coins} 金。`);
      this.sfx.play("fail");
      return;
    }
    this.coins -= item.price;
    item.sold = true;
    item.apply(this);
    this.sfx.play("buyConfirm");
    this.addEffect("shopBuy", this.player.x, this.player.y, 64, COLORS.gold);
    this.floatText(`-${item.price}金`, this.player.x, this.player.y - 44, COLORS.gold);
    this.closeBuyDialog(false);
    this.showShopMessage(`已购买：${item.title}`);
    this.updateUi();
  }

  refreshShop() {
    if (performance.now() < this.shopUnlockAt) return;
    this.sfx.play("tap");
    if (this.coins < this.refreshPrice) {
      this.showShopMessage(`金币不足，刷新需要 ${this.refreshPrice} 金。`);
      this.sfx.play("fail");
      return;
    }
    this.coins -= this.refreshPrice;
    this.shopSelected = null;
    this.clearLayer(ui.buyDialog);
    this.refreshPrice = Math.floor(this.refreshPrice * 1.35 + 6);
    this.shopOffers = this.rollShopOffers();
    this.sfx.play("refresh");
    this.addEffect("shopOpen", this.player.x, this.player.y, 78, COLORS.xp);
    this.showShopMessage("商店已刷新。");
    this.renderShop();
    this.updateUi();
  }

  showShopMessage(message) {
    ui.shopMessage.textContent = message;
    this.shopMessageTimer = 2.4;
  }

  continueFromShop() {
    if (performance.now() < this.shopUnlockAt) return;
    this.sfx.play("tap");
    this.clearLayer(ui.buyDialog);
    if (this.floor >= 20) {
      this.winRun();
      return;
    }
    this.startFloor(this.floor + 1);
    this.tryOpenPendingChoice();
  }

  openStatsPanel() {
    if (!this.hero) {
      this.say("先选择一名冒险者。");
      return;
    }
    const attack =
      this.attackStyle === "melee"
        ? `${Math.round(this.stats.meleeDamage)} / 距离${Math.round(this.stats.meleeRange)}`
        : `${Math.round(this.stats.primaryDamage)} / 距离${Math.round(this.stats.primaryRange)}`;
    const cooldown =
      this.attackStyle === "melee"
        ? `${this.stats.meleeCooldown.toFixed(2)}秒`
        : `${this.stats.primaryCooldown.toFixed(2)}秒`;
    const rows = [
      ["职业", this.hero.title],
      ["生命", `${Math.round(this.hp)}/${this.maxHp}`],
      ["防御", `${Math.round(this.stats.defense * 100)}%`],
      ["攻击", attack],
      ["冷却", cooldown],
      ["移动", Math.round(this.stats.moveSpeed)],
      ["金币拾取", Math.round(this.stats.magnet)],
      ["金币加成", `${Math.round(this.stats.coinBonus * 100)}%`],
      ["技能点", this.skillPoints],
    ];
    ui.statsTitle.textContent = `${this.hero.name} Lv.${this.level}`;
    ui.statsBody.innerHTML = rows.map(([label, value]) => `<div class="stats-row"><span>${label}</span><strong>${value}</strong></div>`).join("");
    ui.statsPanel.classList.remove("hidden");
  }

  closeStatsPanel() {
    this.clearLayer(ui.statsPanel);
  }

  openSettings() {
    if (this.mode === "title" || this.mode === "hero" || this.mode === "tutorial" || this.mode === "upgrade") return;
    if (this.mode !== "settings") this.resumeMode = this.mode;
    this.mode = "settings";
    ui.settings.classList.remove("hidden");
    this.renderSettingsMenu();
    this.updateUi();
  }

  closeSettings() {
    this.clearLayer(ui.settings);
    ui.settingsContent.classList.add("hidden");
    ui.settingsMenu.classList.remove("hidden");
    if (this.mode === "settings") this.mode = this.resumeMode || "combat";
    this.updateUi();
  }

  renderSettingsMenu() {
    ui.settingsTitle.textContent = "设置";
    ui.settingsMenu.classList.remove("hidden");
    ui.settingsContent.classList.add("hidden");
    ui.settingsContent.innerHTML = "";
  }

  renderTalentTree() {
    ui.settingsTitle.textContent = "人物天赋";
    ui.settingsMenu.classList.add("hidden");
    ui.settingsContent.classList.remove("hidden");
    ui.settingsContent.innerHTML = "";
    const back = this.settingsBackButton();
    ui.settingsContent.appendChild(back);
    if (!this.hero) {
      const empty = document.createElement("p");
      empty.className = "modal-copy";
      empty.textContent = "先选择一名冒险者，才能查看对应天赋树。";
      ui.settingsContent.appendChild(empty);
      return;
    }
    const points = document.createElement("div");
    points.className = "talent-points";
    points.textContent = `${this.hero.name} · 可用技能点 ${this.skillPoints}`;
    ui.settingsContent.appendChild(points);
    const grid = document.createElement("div");
    grid.className = "talent-grid";
    const tree = TALENT_TREES[this.hero.id] || [];
    tree.forEach((talentItem) => {
      const level = this.talentLevels[talentItem.id] || 0;
      const card = document.createElement("button");
      card.type = "button";
      card.className = "talent-card";
      card.disabled = level >= talentItem.max || this.skillPoints < talentItem.cost;
      card.innerHTML = `<strong>${talentItem.title}</strong><span>${talentItem.text}</span><em>${level}/${talentItem.max} · ${talentItem.cost}点</em>`;
      card.addEventListener("click", () => this.buyTalent(talentItem));
      grid.appendChild(card);
    });
    ui.settingsContent.appendChild(grid);
  }

  buyTalent(talentItem) {
    const level = this.talentLevels[talentItem.id] || 0;
    if (level >= talentItem.max) return;
    if (this.skillPoints < talentItem.cost) {
      this.say("技能点不足。");
      this.sfx.play("fail");
      return;
    }
    this.skillPoints -= talentItem.cost;
    this.talentLevels[talentItem.id] = level + 1;
    talentItem.apply(this, level + 1);
    this.player.absorb = 0.7;
    this.addEffect("upgrade-elite", this.player.x, this.player.y, 68, this.hero?.color || COLORS.xp);
    this.sfx.play("confirm");
    this.say(`${talentItem.title} 已升级。`);
    this.renderTalentTree();
    this.updateUi();
  }

  renderAudioSettings() {
    ui.settingsTitle.textContent = "游戏设置";
    ui.settingsMenu.classList.add("hidden");
    ui.settingsContent.classList.remove("hidden");
    ui.settingsContent.innerHTML = "";
    ui.settingsContent.appendChild(this.settingsBackButton());
    const panel = document.createElement("div");
    panel.className = "audio-settings";
    panel.innerHTML = `
      <label><span>游戏音效</span><input id="sfx-volume" type="range" min="0" max="1" step="0.05" value="${this.audioSettings.sfxVolume}"></label>
      <label><span>背景音效</span><input id="music-volume" type="range" min="0" max="1" step="0.05" value="${this.audioSettings.musicVolume}"></label>
      <label class="check-row"><input id="sfx-muted" type="checkbox" ${this.audioSettings.sfxMuted ? "checked" : ""}> 关闭游戏音效</label>
      <label class="check-row"><input id="music-muted" type="checkbox" ${this.audioSettings.musicMuted ? "checked" : ""}> 关闭背景音效</label>
      <button id="audio-close" type="button" class="continue-button">关闭</button>
    `;
    ui.settingsContent.appendChild(panel);
    panel.querySelector("#sfx-volume").addEventListener("input", (event) => {
      this.audioSettings.sfxVolume = Number(event.target.value);
      this.sfx.setSfxVolume(this.audioSettings.sfxVolume);
      this.writeAudioSettings();
    });
    panel.querySelector("#music-volume").addEventListener("input", (event) => {
      this.audioSettings.musicVolume = Number(event.target.value);
      this.sfx.setMusicVolume(this.audioSettings.musicVolume);
      this.writeAudioSettings();
    });
    panel.querySelector("#sfx-muted").addEventListener("change", (event) => {
      this.audioSettings.sfxMuted = event.target.checked;
      this.sfx.setSfxMuted(this.audioSettings.sfxMuted);
      this.writeAudioSettings();
    });
    panel.querySelector("#music-muted").addEventListener("change", (event) => {
      this.audioSettings.musicMuted = event.target.checked;
      this.sfx.setMusicMuted(this.audioSettings.musicMuted);
      this.writeAudioSettings();
    });
    panel.querySelector("#audio-close").addEventListener("click", () => this.renderSettingsMenu());
  }

  settingsBackButton() {
    const back = document.createElement("button");
    back.type = "button";
    back.className = "ghost-button settings-back";
    back.textContent = "返回设置";
    back.addEventListener("click", () => this.renderSettingsMenu());
    return back;
  }

  saveProgress() {
    if (!this.hero) {
      this.say("没有可保存的角色。");
      this.sfx.play("fail");
      return;
    }
    const state = {
      heroId: this.hero.id,
      floor: this.floor,
      level: this.level,
      xp: this.xp,
      nextXp: this.nextXp,
      skillPoints: this.skillPoints,
      hp: this.hp,
      maxHp: this.maxHp,
      coins: this.coins,
      gems: this.gems,
      stats: this.stats,
      talentLevels: this.talentLevels,
      talentFlags: this.talentFlags,
      savedAt: Date.now(),
    };
    localStorage.setItem("sword-magic-arena-save", JSON.stringify(state));
    this.say("进度已保存。");
    this.sfx.play("confirm");
  }

  readSave() {
    try {
      return JSON.parse(localStorage.getItem("sword-magic-arena-save") || "null");
    } catch {
      return null;
    }
  }

  restoreSave(saved) {
    const hero = HEROES[saved.heroId];
    if (!hero) {
      this.openHeroSelect();
      return;
    }
    this.hero = hero;
    this.profession = hero.profession;
    this.attackStyle = hero.attackStyle;
    this.maxHp = saved.maxHp || hero.maxHp;
    this.hp = Math.min(this.maxHp, saved.hp || this.maxHp);
    this.coins = saved.coins || 0;
    this.gems = saved.gems || 0;
    this.xp = saved.xp || 0;
    this.level = saved.level || 1;
    this.nextXp = saved.nextXp || 52;
    this.skillPoints = saved.skillPoints || 0;
    this.talentLevels = saved.talentLevels || {};
    this.talentFlags = saved.talentFlags || {};
    this.stats.moveSpeed = hero.moveSpeed;
    this.stats.defense = hero.defense;
    Object.assign(this.stats, hero.stats, saved.stats || {});
    this.startFloor(saved.floor || 1);
    this.updateUi();
  }

  readAudioSettings() {
    const defaults = { sfxVolume: 0.82, musicVolume: 0.28, sfxMuted: false, musicMuted: false };
    try {
      return { ...defaults, ...(JSON.parse(localStorage.getItem("sword-magic-audio") || "{}") || {}) };
    } catch {
      return defaults;
    }
  }

  writeAudioSettings() {
    localStorage.setItem("sword-magic-audio", JSON.stringify(this.audioSettings));
  }

  winRun() {
    this.mode = "title";
    ui.shop.classList.add("hidden");
    this.clearLayer(ui.buyDialog);
    this.clearLayer(ui.tutorialDialog);
    ui.overlay.classList.remove("hidden");
    ui.overlay.querySelector("h1").textContent = "通关成功";
    ui.overlay.querySelector("p").textContent = `你清理了第20层，带着 ${this.coins} 金币离开竞技场。`;
    ui.start.textContent = "新的冒险";
  }

  gameOver() {
    this.mode = "title";
    this.clearLayer(ui.buyDialog);
    this.clearLayer(ui.tutorialDialog);
    ui.overlay.classList.remove("hidden");
    ui.overlay.querySelector("h1").textContent = "英雄倒下";
    ui.overlay.querySelector("p").textContent = `到达第${this.floor}层，等级 ${this.level}，金币 ${this.coins}。`;
    ui.start.textContent = "再试一次";
  }

  enemyCap() {
    return window.innerWidth <= 430 ? 42 : 64;
  }

  findNearest(range, exclude = []) {
    let best = null;
    let bestDistance = range;
    for (const enemy of this.active.enemies) {
      if (exclude.includes(enemy)) continue;
      const d = distance(enemy, this.player);
      if (d < bestDistance) {
        best = enemy;
        bestDistance = d;
      }
    }
    return best;
  }

  nearestDirection(range) {
    const enemy = this.findNearest(range);
    if (!enemy) return 1;
    return enemy.x >= this.player.x ? 1 : -1;
  }

  addEffect(type, x, y, radius, color, direction = 0, fromX = 0, fromY = 0) {
    const effect = this.effectPool.get();
    effect.active = true;
    effect.type = type;
    effect.x = x;
    effect.y = y;
    effect.radius = radius;
    effect.color = color;
    effect.direction = direction;
    effect.fromX = fromX;
    effect.fromY = fromY;
    effect.life = type === "absorb" || type.startsWith("upgrade-") ? 0.7 : type === "shopOpen" || type === "shopBuy" ? 0.62 : type === "meteor" || type === "blackhole" || type === "blizzard" ? 0.72 : type === "clone" ? 0.9 : type === "ring" || type === "boomerang" || type === "shadowStrike" || type === "hammerOrbit" ? 0.42 : type === "missile" || type === "dart" ? 0.3 : 0.22;
    effect.maxLife = effect.life;
    this.active.effects.push(effect);
  }

  burst(x, y, color, count) {
    const limit = 230;
    for (let i = 0; i < count && this.active.particles.length < limit; i += 1) {
      const angle = random(0, Math.PI * 2);
      const speed = random(28, 135);
      const p = this.particlePool.get();
      p.active = true;
      p.x = x;
      p.y = y;
      p.vx = Math.cos(angle) * speed;
      p.vy = Math.sin(angle) * speed;
      p.size = random(2, 5);
      p.color = color;
      p.life = random(0.22, 0.5);
      this.active.particles.push(p);
    }
  }

  floatText(text, x, y, color) {
    if (this.active.texts.length > 48) return;
    const item = this.textPool.get();
    item.active = true;
    item.text = text;
    item.x = x + random(-4, 4);
    item.y = y;
    item.color = color;
    item.life = 0.42;
    this.active.texts.push(item);
  }

  releaseActive(list, index, pool) {
    const item = list[index];
    list[index] = list[list.length - 1];
    list.pop();
    pool.release(item);
  }

  releaseAll(list, pool) {
    while (list.length) pool.release(list.pop());
  }

  clearLayer(layer) {
    layer.classList.add("hidden");
    layer.classList.remove("locked");
  }

  say(message) {
    ui.toast.textContent = message;
    ui.toast.classList.add("show");
    this.sayTimer = 2.25;
  }

  isDebug() {
    return new URLSearchParams(window.location.search).has("debug");
  }

  updateUi() {
    ui.wave.textContent = `第${this.floor}层 Lv.${this.level}`;
    ui.timer.textContent = formatTime(Math.max(0, this.floorTimeLimit - this.floorTime));
    ui.remaining.textContent = `剩余${Math.max(0, this.floorGoal - this.floorKills)}`;
    ui.heroName.textContent = this.hero ? `${this.hero.name} Lv.${this.level}` : "未选择";
    ui.hudAvatar.textContent = this.hero ? this.hero.name[0] : "?";
    ui.hudAvatar.className = `avatar-frame ${this.profession || ""}`.trim();
    ui.hp.textContent = `${Math.max(0, Math.round(this.hp))}/${this.maxHp}`;
    ui.xp.textContent = `${Math.floor(this.xp)}/${this.nextXp}`;
    ui.hpFill.style.width = `${clamp(this.hp / this.maxHp, 0, 1) * 100}%`;
    ui.xpFill.style.width = `${clamp(this.xp / this.nextXp, 0, 1) * 100}%`;
    ui.coins.textContent = this.coins;
    ui.gems.textContent = this.gems;
    const heroText = this.hero ? this.hero.name : "未选择";
    let build = this.hero ? `${heroText} · ` : "未选择 · 请选择人物";
    if (this.hero && this.attackStyle === "melee") build += `近战 ${this.stats.meleeDamage} / 防御${Math.round(this.stats.defense * 100)}%`;
    if (this.hero && this.attackStyle === "wave") build += `剑气 ${this.stats.primaryDamage} / ${this.stats.primaryTargets}目标`;
    if (this.hero && this.attackStyle === "mage") build += `魔法飞弹 ${this.stats.primaryDamage} x${this.stats.primaryTargets}`;
    if (this.hero && this.attackStyle === "dart") build += `飞镖 ${this.stats.primaryDamage} / 穿透${this.stats.primaryPierce}`;
    if (ui.build) ui.build.textContent = build;
    if (this.sayTimer <= 0) ui.toast.classList.remove("show");

    document.body.dataset.mode = this.mode;
    document.body.dataset.floor = String(this.floor);
    document.body.dataset.level = String(this.level);
    document.body.dataset.heroId = this.hero?.id || "none";
    document.body.dataset.profession = this.profession || "none";
    document.body.dataset.attackStyle = this.attackStyle || "none";
    document.body.dataset.enemies = String(this.active.enemies.length);
    document.body.dataset.remaining = String(Math.max(0, this.floorGoal - this.floorKills));
    document.body.dataset.spawned = String(this.floorSpawned);
    document.body.dataset.spawnLimit = String(this.floorSpawnLimit);
    document.body.dataset.drops = String(this.active.drops.length);
    document.body.dataset.effects = String(this.active.effects.length);
    document.body.dataset.playerX = String(Math.round(this.player.x));
    document.body.dataset.playerY = String(Math.round(this.player.y));
    document.body.dataset.fps = String(Math.round(this.fps));
    document.body.dataset.capHits = String(this.capHits);
  }

  updateDebug() {
    ui.debug.textContent = "";
    return;
    this.debugTimer -= 0.1;
    if (this.debugTimer > 0) return;
    this.debugTimer = 0.18;
    const pools = this.enemyPool.free.length + this.dropPool.free.length + this.particlePool.free.length + this.effectPool.free.length;
    ui.debug.textContent =
      `fps ${Math.round(this.fps)} | ${this.mode}\n` +
      `层 ${this.floor}/20 击杀 ${this.floorKills}/${this.floorGoal}\n` +
      `生成 ${this.floorSpawned}/${this.floorSpawnLimit} 角色 ${this.hero?.name || "未选"}\n` +
      `敌人 ${this.active.enemies.length}/${this.enemyCap()} 掉落 ${this.active.drops.length}\n` +
      `特效 ${this.active.effects.length}+${this.active.particles.length} 池 ${pools}\n` +
      `上限触发 ${this.capHits}`;
    ui.debug.classList.toggle("warn", this.fps < 35 || this.capHits > 0);
  }

  draw() {
    this.updateCamera();
    ctx.setTransform(canvas.width / VIEW.width, 0, 0, canvas.height / VIEW.height, 0, 0);
    ctx.save();
    ctx.clearRect(0, 0, VIEW.width, VIEW.height);
    if (this.shake > 0) ctx.translate(random(-this.shake, this.shake), random(-this.shake, this.shake));
    ctx.scale(this.camera.scale, this.camera.scale);
    ctx.translate(-this.camera.x, -this.camera.y);
    this.drawBackground();
    this.drawDrops();
    this.drawEffects();
    this.drawEnemies();
    this.drawPlayer();
    this.drawParticles();
    this.drawTexts();
    ctx.restore();
  }

  drawBackground() {
    const gradient = ctx.createLinearGradient(0, 0, 0, WORLD.height);
    gradient.addColorStop(0, COLORS.bgTop);
    gradient.addColorStop(1, COLORS.bgBottom);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, WORLD.width, WORLD.height);

    ctx.strokeStyle = COLORS.grid;
    ctx.lineWidth = 1;
    for (let y = WORLD.minY; y <= WORLD.maxY; y += 42) {
      ctx.beginPath();
      ctx.moveTo(WORLD.minX, y);
      ctx.lineTo(WORLD.maxX, y);
      ctx.stroke();
    }
    for (let x = WORLD.minX; x <= WORLD.maxX; x += 42) {
      ctx.beginPath();
      ctx.moveTo(x, WORLD.minY);
      ctx.lineTo(x, WORLD.maxY);
      ctx.stroke();
    }
    ctx.strokeStyle = "rgba(255,255,255,0.16)";
    ctx.strokeRect(WORLD.minX, WORLD.minY, WORLD.maxX - WORLD.minX, WORLD.maxY - WORLD.minY);
  }

  drawPlayer() {
    const p = this.player;
    const classColor = this.profession ? { warrior: "#d9a441", mage: "#8b7cf6", archer: "#52b788" }[this.profession] : COLORS.playerCloth;
    ctx.fillStyle = "rgba(0,0,0,0.3)";
    ctx.beginPath();
    ctx.ellipse(p.x, p.y + 13, 20, 8, 0, 0, Math.PI * 2);
    ctx.fill();

    if (p.absorb > 0) {
      ctx.strokeStyle = rgba(classColor, p.absorb);
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(p.x, p.y - 6, 28 + (1 - p.absorb) * 24, 0, Math.PI * 2);
      ctx.stroke();
    }

    const walk = Math.sin(p.step) * 3;
    ctx.fillStyle = "#273449";
    ctx.fillRect(p.x - 10, p.y + 6, 7, 11 + walk);
    ctx.fillRect(p.x + 3, p.y + 6, 7, 11 - walk);

    ctx.fillStyle = p.flash > 0 ? "#ffffff" : classColor;
    roundRect(ctx, p.x - 14, p.y - 13, 28, 25, 5);
    ctx.fill();
    ctx.fillStyle = COLORS.playerSkin;
    pixelCircle(ctx, p.x, p.y - 21, 9);
    ctx.fillStyle = COLORS.playerHair;
    ctx.fillRect(p.x - 9, p.y - 28, 18, 6);

    if (this.profession === "mage") {
      ctx.fillStyle = COLORS.mage;
      ctx.fillRect(p.x - 11, p.y - 35, 22, 7);
      ctx.fillRect(p.x - 4, p.y - 46, 8, 12);
      ctx.strokeStyle = COLORS.mage;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(p.x + 15, p.y - 3);
      ctx.lineTo(p.x + 27, p.y - 31);
      ctx.stroke();
    } else if (this.profession === "archer") {
      ctx.strokeStyle = COLORS.archer;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(p.x + 19, p.y - 9, 13, -1.2, 1.2);
      ctx.stroke();
      ctx.fillStyle = COLORS.archer;
      ctx.fillRect(p.x - 12, p.y - 29, 24, 5);
    } else {
      ctx.strokeStyle = COLORS.warrior;
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(p.x + 12, p.y - 4);
      ctx.lineTo(p.x + 27, p.y - 20);
      ctx.stroke();
      if (this.profession === "warrior") {
        ctx.fillStyle = "#9a3412";
        ctx.fillRect(p.x - 15, p.y - 16, 30, 5);
      }
    }

    ctx.fillStyle = "rgba(0,0,0,0.42)";
    ctx.fillRect(p.x - 20, p.y - 40, 40, 5);
    ctx.fillStyle = COLORS.hp;
    ctx.fillRect(p.x - 20, p.y - 40, 40 * clamp(this.hp / this.maxHp, 0, 1), 5);
  }

  drawEnemies() {
    for (const enemy of this.active.enemies) {
      ctx.fillStyle = "rgba(0,0,0,0.27)";
      ctx.beginPath();
      ctx.ellipse(enemy.x, enemy.y + enemy.radius, enemy.radius, enemy.radius * 0.35, 0, 0, Math.PI * 2);
      ctx.fill();

      const bodyColor = enemy.flash > 0 ? "#ffffff" : enemy.slow > 0 ? COLORS.frost : enemy.color;
      drawChaosBlob(ctx, enemy.x, enemy.y, enemy.radius, bodyColor, enemy.morph || 0, enemy.shape);

      if (enemy.rank !== "small") {
        ctx.strokeStyle = enemy.color;
        ctx.lineWidth = enemy.label === "最终Boss" ? 4 : 3;
        ctx.beginPath();
        ctx.arc(enemy.x, enemy.y, enemy.radius + 6, 0, Math.PI * 2);
        ctx.stroke();
        ctx.fillStyle = COLORS.text;
        ctx.font = "900 8px ui-sans-serif, system-ui";
        ctx.textAlign = "center";
        ctx.fillText(enemy.label, enemy.x, enemy.y - enemy.radius - 18);
      }

      ctx.fillStyle = "rgba(0,0,0,0.48)";
      ctx.fillRect(enemy.x - enemy.radius, enemy.y - enemy.radius - 9, enemy.radius * 2, 4);
      ctx.fillStyle = enemy.rank === "small" ? COLORS.hp : COLORS.danger;
      ctx.fillRect(enemy.x - enemy.radius, enemy.y - enemy.radius - 9, enemy.radius * 2 * clamp(enemy.hp / enemy.maxHp, 0, 1), 4);
    }
  }

  drawDrops() {
    for (const drop of this.active.drops) {
      ctx.fillStyle = COLORS.gold;
      ctx.beginPath();
      ctx.arc(drop.x, drop.y, drop.radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#5f4300";
      ctx.fillRect(drop.x - 1.5, drop.y - 4, 3, 8);
    }
  }

  drawEffects() {
    for (const effect of this.active.effects) {
      const t = clamp(effect.life / effect.maxLife, 0, 1);
      if (effect.type === "slash") {
        ctx.strokeStyle = rgba(effect.color, t);
        ctx.lineWidth = 9 * t + 2;
        ctx.beginPath();
        const start = effect.direction > 0 ? -0.8 : Math.PI - 0.8;
        const end = effect.direction > 0 ? 0.85 : Math.PI + 0.85;
        ctx.arc(effect.x + effect.direction * 18, effect.y - 12, effect.radius, start, end);
        ctx.stroke();
      } else if (effect.type === "wave") {
        ctx.strokeStyle = rgba(effect.color, t);
        ctx.lineWidth = 12 * t + 3;
        ctx.beginPath();
        ctx.moveTo(effect.x, effect.y);
        ctx.lineTo(effect.x + Math.cos(effect.direction) * effect.radius, effect.y + Math.sin(effect.direction) * effect.radius);
        ctx.stroke();
      } else if (effect.type === "dart") {
        const progress = 1 - t;
        const angle = effect.direction;
        const headX = effect.x + Math.cos(angle) * effect.radius * progress;
        const headY = effect.y + Math.sin(angle) * effect.radius * progress;
        const tailX = headX - Math.cos(angle) * 28;
        const tailY = headY - Math.sin(angle) * 28;
        ctx.strokeStyle = rgba(effect.color, t * 0.7);
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(tailX, tailY);
        ctx.lineTo(headX, headY);
        ctx.stroke();
        ctx.save();
        ctx.translate(headX, headY);
        ctx.rotate(angle);
        ctx.fillStyle = "#eafff0";
        ctx.beginPath();
        ctx.moveTo(12, 0);
        ctx.lineTo(-8, -5);
        ctx.lineTo(-3, 0);
        ctx.lineTo(-8, 5);
        ctx.closePath();
        ctx.fill();
        ctx.fillStyle = effect.color;
        ctx.fillRect(-5, -2, 11, 4);
        ctx.restore();
      } else if (effect.type === "missile") {
        const progress = 1 - t;
        const headX = lerp(effect.fromX, effect.x, progress);
        const headY = lerp(effect.fromY, effect.y, progress);
        const angle = Math.atan2(effect.y - effect.fromY, effect.x - effect.fromX);
        const gradient = ctx.createLinearGradient(effect.fromX, effect.fromY, headX, headY);
        gradient.addColorStop(0, rgba(COLORS.frost, 0));
        gradient.addColorStop(0.45, rgba(COLORS.mage, t * 0.36));
        gradient.addColorStop(1, rgba(COLORS.mage, t));
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 8;
        ctx.beginPath();
        ctx.moveTo(effect.fromX, effect.fromY);
        ctx.lineTo(headX, headY);
        ctx.stroke();
        ctx.save();
        ctx.translate(headX, headY);
        ctx.rotate(angle);
        ctx.fillStyle = "#f4f0ff";
        drawDiamond(ctx, 0, 0, 9);
        ctx.fill();
        ctx.fillStyle = COLORS.frost;
        drawDiamond(ctx, 2, 0, 4);
        ctx.fill();
        ctx.restore();
      } else if (effect.type === "bolt") {
        ctx.strokeStyle = rgba(effect.color, t);
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(effect.fromX, effect.fromY);
        ctx.lineTo((effect.fromX + effect.x) / 2 + random(-5, 5), (effect.fromY + effect.y) / 2 + random(-5, 5));
        ctx.lineTo(effect.x, effect.y);
        ctx.stroke();
      } else if (effect.type === "boomerang") {
        ctx.strokeStyle = rgba(effect.color, t);
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.moveTo(effect.fromX, effect.fromY);
        ctx.quadraticCurveTo((effect.fromX + effect.x) / 2, (effect.fromY + effect.y) / 2 - 42, effect.x, effect.y);
        ctx.quadraticCurveTo((effect.fromX + effect.x) / 2, (effect.fromY + effect.y) / 2 + 26, effect.fromX, effect.fromY);
        ctx.stroke();
      } else if (effect.type === "meteor") {
        ctx.strokeStyle = rgba(effect.color, t);
        ctx.lineWidth = 8;
        ctx.beginPath();
        ctx.moveTo(effect.fromX, effect.fromY);
        ctx.lineTo(effect.x, effect.y);
        ctx.stroke();
        ctx.fillStyle = rgba(effect.color, 0.22 + 0.45 * t);
        ctx.beginPath();
        ctx.arc(effect.x, effect.y, effect.radius * (1.15 - t * 0.25), 0, Math.PI * 2);
        ctx.fill();
      } else if (effect.type === "blackhole") {
        ctx.strokeStyle = rgba(effect.color, 0.22 + t * 0.55);
        ctx.lineWidth = 3;
        for (let i = 0; i < 3; i += 1) {
          ctx.beginPath();
          ctx.ellipse(effect.x, effect.y, effect.radius * (0.32 + i * 0.2), effect.radius * (0.13 + i * 0.08), (1 - t) * Math.PI * 2 + i, 0, Math.PI * 2);
          ctx.stroke();
        }
      } else if (effect.type === "blizzard") {
        ctx.strokeStyle = rgba(effect.color, 0.18 + t * 0.42);
        ctx.lineWidth = 2;
        for (let i = 0; i < 9; i += 1) {
          const a = (i / 9) * Math.PI * 2 + (1 - t) * 0.9;
          ctx.beginPath();
          ctx.moveTo(effect.x + Math.cos(a) * effect.radius * 0.25, effect.y + Math.sin(a) * effect.radius * 0.25);
          ctx.lineTo(effect.x + Math.cos(a) * effect.radius * (0.82 - t * 0.12), effect.y + Math.sin(a) * effect.radius * (0.82 - t * 0.12));
          ctx.stroke();
        }
      } else if (effect.type === "shadowStrike") {
        ctx.strokeStyle = rgba(effect.color, t);
        ctx.lineWidth = 8;
        ctx.beginPath();
        ctx.moveTo(effect.fromX, effect.fromY);
        ctx.lineTo(effect.x, effect.y);
        ctx.stroke();
        ctx.strokeStyle = rgba(effect.color, t * 0.7);
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(effect.x, effect.y, effect.radius * (1.1 - t * 0.2), 0, Math.PI * 2);
        ctx.stroke();
      } else if (effect.type === "hammerOrbit") {
        ctx.strokeStyle = rgba(effect.color, t * 0.75);
        ctx.lineWidth = 6;
        ctx.beginPath();
        ctx.arc(effect.x, effect.y, effect.radius, (1 - t) * Math.PI * 2, (1 - t) * Math.PI * 2 + Math.PI * 1.35);
        ctx.stroke();
      } else if (effect.type === "clone") {
        ctx.globalAlpha = t * 0.65;
        ctx.fillStyle = effect.color;
        roundRect(ctx, effect.x - 11, effect.y - 24, 22, 32, 5);
        ctx.fill();
        ctx.globalAlpha = 1;
      } else if (effect.type.startsWith("upgrade-")) {
        const rarity = effect.type.replace("upgrade-", "");
        ctx.save();
        ctx.translate(effect.x, effect.y);
        ctx.strokeStyle = rgba(effect.color, 0.28 + t * 0.5);
        ctx.fillStyle = rgba(effect.color, 0.16 + t * 0.22);
        if (rarity === "common") {
          ctx.lineWidth = 4;
          ctx.beginPath();
          ctx.arc(0, 0, effect.radius * (1.1 - t * 0.2), 0, Math.PI * 2);
          ctx.stroke();
        } else if (rarity === "elite") {
          ctx.lineWidth = 3;
          for (let i = 0; i < 4; i += 1) {
            ctx.rotate(Math.PI / 2);
            ctx.strokeRect(effect.radius * 0.45 * t, -10, 18, 18);
          }
        } else if (rarity === "epic") {
          ctx.lineWidth = 3;
          ctx.beginPath();
          for (let i = 0; i < 10; i += 1) {
            const r = i % 2 ? effect.radius * 0.44 : effect.radius * 0.72;
            const a = -Math.PI / 2 + (i / 10) * Math.PI * 2;
            const x = Math.cos(a) * r * (1.08 - t * 0.22);
            const y = Math.sin(a) * r * (1.08 - t * 0.22);
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }
          ctx.closePath();
          ctx.stroke();
        } else {
          ctx.lineWidth = 4;
          for (let i = 0; i < 12; i += 1) {
            const a = (i / 12) * Math.PI * 2;
            ctx.beginPath();
            ctx.moveTo(Math.cos(a) * effect.radius * 0.42, Math.sin(a) * effect.radius * 0.42);
            ctx.lineTo(Math.cos(a) * effect.radius * (1.05 - t * 0.16), Math.sin(a) * effect.radius * (1.05 - t * 0.16));
            ctx.stroke();
          }
        }
        ctx.restore();
      } else if (effect.type === "shopOpen" || effect.type === "shopBuy") {
        ctx.strokeStyle = rgba(effect.color, 0.16 + t * 0.62);
        ctx.lineWidth = effect.type === "shopBuy" ? 5 : 3;
        for (let i = 0; i < 3; i += 1) {
          ctx.beginPath();
          ctx.arc(effect.x, effect.y, effect.radius * (0.4 + i * 0.2 + (1 - t) * 0.22), 0, Math.PI * 2);
          ctx.stroke();
        }
      } else {
        ctx.strokeStyle = rgba(effect.color, 0.22 + t * 0.46);
        ctx.lineWidth = effect.type === "absorb" ? 5 * t + 1 : 3;
        ctx.beginPath();
        ctx.arc(effect.x, effect.y, effect.radius * (1.04 - t * 0.15), 0, Math.PI * 2);
        ctx.stroke();
      }
    }
  }

  drawParticles() {
    for (const p of this.active.particles) {
      ctx.globalAlpha = clamp(p.life / 0.5, 0, 1);
      ctx.fillStyle = p.color;
      ctx.fillRect(p.x - p.size / 2, p.y - p.size / 2, p.size, p.size);
      ctx.globalAlpha = 1;
    }
  }

  drawTexts() {
    ctx.textAlign = "center";
    ctx.font = "900 10px ui-sans-serif, system-ui";
    for (const text of this.active.texts) {
      ctx.globalAlpha = clamp(text.life / 0.42, 0, 1);
      ctx.fillStyle = text.color;
      ctx.fillText(text.text, text.x, text.y);
      ctx.globalAlpha = 1;
    }
  }

  drawBars() {
    const hpRatio = clamp(this.hp / this.maxHp, 0, 1);
    const xpRatio = clamp(this.xp / this.nextXp, 0, 1);
    ctx.fillStyle = "rgba(0,0,0,0.35)";
    ctx.fillRect(22, 62, WORLD.width - 44, 5);
    ctx.fillStyle = COLORS.xp;
    ctx.fillRect(22, 62, (WORLD.width - 44) * xpRatio, 5);
    ctx.fillStyle = "rgba(0,0,0,0.35)";
    ctx.fillRect(22, 70, WORLD.width - 44, 5);
    ctx.fillStyle = hpRatio < 0.35 ? COLORS.danger : COLORS.hp;
    ctx.fillRect(22, 70, (WORLD.width - 44) * hpRatio, 5);
  }

}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function lerp(from, to, amount) {
  return from + (to - from) * amount;
}

function random(min, max) {
  return min + Math.random() * (max - min);
}

function distance(a, b) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

function shuffle(items) {
  for (let i = items.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [items[i], items[j]] = [items[j], items[i]];
  }
  return items;
}

function formatTime(seconds) {
  const value = Math.max(0, Math.ceil(seconds));
  const m = Math.floor(value / 60);
  const s = value % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

function weightedRarity() {
  const total = Object.values(RARITIES).reduce((sum, rarity) => sum + rarity.weight, 0);
  let roll = Math.random() * total;
  for (const [id, rarity] of Object.entries(RARITIES)) {
    roll -= rarity.weight;
    if (roll <= 0) return id;
  }
  return "common";
}

function pickUpgradeChoices(pool, count) {
  const selected = [];
  let guard = 0;
  while (selected.length < count && selected.length < pool.length && guard < 60) {
    guard += 1;
    const rarity = weightedRarity();
    let candidates = pool.filter((item) => item.rarity === rarity && !selected.includes(item));
    if (!candidates.length) candidates = pool.filter((item) => !selected.includes(item));
    selected.push(candidates[Math.floor(Math.random() * candidates.length)]);
  }
  return selected;
}

function increaseHeroDamage(game, amount) {
  if (game.attackStyle === "melee") game.stats.meleeDamage += amount;
  else game.stats.primaryDamage += amount;
}

function reduceHeroCooldown(game, amount) {
  if (game.attackStyle === "melee") game.stats.meleeCooldown = Math.max(0.22, game.stats.meleeCooldown - amount);
  else game.stats.primaryCooldown = Math.max(0.18, game.stats.primaryCooldown - amount);
}

function increaseHeroRange(game, amount) {
  if (game.attackStyle === "melee") game.stats.meleeRange += Math.ceil(amount * 0.45);
  else game.stats.primaryRange += amount;
}

function drawChaosBlob(context, x, y, radius, color, phase, shape) {
  const points = shape === "box" ? 8 : shape === "diamond" ? 6 : 9;
  context.save();
  context.translate(x, y);
  context.rotate(Math.sin(phase * 0.7) * 0.18);
  context.fillStyle = color;
  context.strokeStyle = rgba(color, 0.55);
  context.lineWidth = 2;
  context.beginPath();
  for (let i = 0; i < points; i += 1) {
    const a = (i / points) * Math.PI * 2;
    const jag = 1 + Math.sin(phase + i * 1.7) * 0.18 + Math.cos(phase * 1.4 + i) * 0.08;
    const boxBias = shape === "box" ? 1 + (i % 2 ? 0.08 : -0.04) : 1;
    const px = Math.cos(a) * radius * jag * boxBias;
    const py = Math.sin(a) * radius * (1 + Math.cos(phase + i * 1.2) * 0.16);
    if (i === 0) context.moveTo(px, py);
    else context.lineTo(px, py);
  }
  context.closePath();
  context.fill();
  context.stroke();
  context.fillStyle = "rgba(255,255,255,0.42)";
  context.fillRect(-radius * 0.32, -radius * 0.26 + Math.sin(phase) * 2, radius * 0.18, radius * 0.18);
  context.fillRect(radius * 0.18, -radius * 0.22 + Math.cos(phase) * 2, radius * 0.18, radius * 0.18);
  context.restore();
}

function shopIconSvg(icon) {
  const icons = {
    potion: ["#ff5570", "M9 2h6v3l-1.5 1.5V9l4.5 7.8A3 3 0 0 1 15.4 21H8.6A3 3 0 0 1 6 16.8L10.5 9V6.5L9 5V2Zm.2 13h5.6L12 10.2 9.2 15Z"],
    bigPotion: ["#ff8fab", "M8 2h8v3l-2 2v2.4l4.8 7.1A3 3 0 0 1 16.3 21H7.7a3 3 0 0 1-2.5-4.5L10 9.4V7L8 5V2Zm1.4 13.2h5.2L12 11l-2.6 4.2Z"],
    amulet: ["#ffd166", "M12 3 6 8v5c0 4 2.4 6.8 6 8 3.6-1.2 6-4 6-8V8l-6-5Zm0 4 3 2.4V13c0 2.1-1.1 3.7-3 4.7-1.9-1-3-2.6-3-4.7V9.4L12 7Z"],
    shield: ["#9bf6ff", "M12 2 4 5v6c0 5.1 3.1 8.9 8 11 4.9-2.1 8-5.9 8-11V5l-8-3Zm0 4 4 1.5V11c0 2.8-1.5 5-4 6.4V6Z"],
    armor: ["#cbd6e8", "M8 3h8l3 4-2 4v10H7V11L5 7l3-4Zm2 3v12h4V6h-4Z"],
    boot: ["#7ae582", "M8 3h6v8l5 3v4H5v-4l3-2V3Zm2 11-2 1v1h8v-.8L12 13l-2 1Z"],
    feather: ["#e8fbff", "M20 3c-7 1-11 5-13 11l-3 3 2 2 3-3c6-2 10-6 11-13Zm-7 7 4-3-3 4-4 3 3-4Z"],
    magnet: ["#ff70a6", "M5 4h5v8a2 2 0 0 0 4 0V4h5v8a7 7 0 0 1-14 0V4Zm2 0v4h3V4H7Zm7 0v4h3V4h-3Z"],
    crystal: ["#53d8fb", "M12 2 4 8l8 14 8-14-8-6Zm0 4 3 3-3 8-3-8 3-3Z"],
    coin: ["#ffd166", "M12 3c5 0 9 2 9 4.5S17 12 12 12 3 10 3 7.5 7 3 12 3Zm-9 8c1.7 1.8 5 3 9 3s7.3-1.2 9-3v3c0 2.5-4 4.5-9 4.5S3 16.5 3 14v-3Z"],
    crown: ["#ffd166", "M4 18h16v3H4v-3Zm0-11 4 4 4-7 4 7 4-4-2 9H6L4 7Z"],
    anvil: ["#b8c0cc", "M5 6h14v4h-4l-2 3h5v3H6v-3h4L8 10H5V6Zm5 11h4v4h-4v-4Z"],
    sword: ["#ffe66d", "M17.8 2 22 6.2 10.5 17.7 7.8 15 19.3 3.5 17.8 2ZM6.8 15.8 8.2 17.2 5 20.4 3.6 19l3.2-3.2Z"],
    clock: ["#9bf6ff", "M12 3a9 9 0 1 1 0 18 9 9 0 0 1 0-18Zm1 4h-2v6l5 3 1-1.7-4-2.3V7Z"],
    hourglass: ["#ffd166", "M7 2h10v5l-3 5 3 5v5H7v-5l3-5-3-5V2Zm2 3 3 5 3-5H9Zm3 9-3 5h6l-3-5Z"],
    scope: ["#53d8fb", "M12 4a8 8 0 1 1 0 16 8 8 0 0 1 0-16Zm-1 2v4H7v4h4v4h2v-4h4v-4h-4V6h-2Z"],
    storm: ["#bdb2ff", "M13 2 5 13h6l-1 9 9-13h-6l0-7Z"],
    glove: ["#f5c7a9", "M8 3h2v7h1V2h2v8h1V3h2v8h1V6h2v9a6 6 0 0 1-12 0V8H5V6h3V3Z"],
    ring: ["#ffd166", "M12 7a7 7 0 1 1 0 14 7 7 0 0 1 0-14Zm0 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8Zm-3-8h6l2 3-5 3-5-3 2-3Z"],
    scroll: ["#e7edf5", "M6 4h11a3 3 0 0 1 0 6h-1v10H6a3 3 0 0 1-3-3V7a3 3 0 0 1 3-3Zm0 12a1 1 0 0 0 0 2h8V6H6v10Zm10-10v2h1a1 1 0 0 0 0-2h-1Z"],
    gem: ["#9bf6ff", "M7 3h10l5 6-10 12L2 9l5-6Zm1.2 2L5.6 8h4.2L11 5H8.2Zm4.8 0 1.2 3h4.2l-2.6-3H13Zm-3 5 2 6 2-6h-4Z"],
  };
  const [color, path] = icons[icon] || icons.crystal;
  return `<svg viewBox="0 0 24 24"><path fill="${color}" d="${path}"/></svg>`;
}

function roundRect(context, x, y, width, height, radius) {
  const r = Math.min(radius, width / 2, height / 2);
  context.beginPath();
  context.moveTo(x + r, y);
  context.arcTo(x + width, y, x + width, y + height, r);
  context.arcTo(x + width, y + height, x, y + height, r);
  context.arcTo(x, y + height, x, y, r);
  context.arcTo(x, y, x + width, y, r);
  context.closePath();
}

function pixelCircle(context, x, y, radius) {
  const step = Math.max(3, Math.round(radius / 2.7));
  for (let py = -radius; py <= radius; py += step) {
    for (let px = -radius; px <= radius; px += step) {
      if (px * px + py * py <= radius * radius) {
        context.fillRect(Math.round(x + px), Math.round(y + py), step, step);
      }
    }
  }
}

function drawDiamond(context, x, y, radius) {
  context.beginPath();
  context.moveTo(x, y - radius);
  context.lineTo(x + radius, y);
  context.lineTo(x, y + radius);
  context.lineTo(x - radius, y);
  context.closePath();
}

function rgba(hex, alpha) {
  const value = parseInt(hex.replace("#", ""), 16);
  return `rgba(${(value >> 16) & 255},${(value >> 8) & 255},${value & 255},${alpha})`;
}

window.__swipeDefenseGame = new Game();
