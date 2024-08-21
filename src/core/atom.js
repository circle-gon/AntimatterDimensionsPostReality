import { DC } from "./constants";
import { BitPurchasableMechanicState, GameMechanicState, RebuyableMechanicState } from "./game-mechanics";
import save from "../../saves/am1.txt?raw"; // There's finally a use for it!

export function migrateSaves(player) {
  // Change effarig shards to decimal
  player.celestials.effarig.relicShards = new Decimal(player.celestials.effarig.relicShards);
  player.reality.imaginaryMachines = new Decimal(player.reality.imaginaryMachines);
  player.reality.iMCap = new Decimal(player.reality.iMCap);
  player.celestials.ra.peakGamespeed = new Decimal(player.celestials.ra.peakGamespeed);
  player.challenge.normal.bestTimes = player.challenge.normal.bestTimes.map((i) => new Decimal(i));
  player.challenge.infinity.bestTimes = player.challenge.infinity.bestTimes.map((i) => new Decimal(i));

  player.records.thisReality.bestRSMin = new Decimal(player.records.thisReality.bestRSMin);
  player.records.thisReality.bestRSMinVal = new Decimal(player.records.thisReality.bestRSMinVal);

  function patchTime(value) {
    return Decimal.NUMBER_MAX_VALUE.eq(value) || Decimal.MAX_VALUE.eq(value) ? Decimal.MAX_LIMIT : new Decimal(value);
  }

  function swapToDecimal(name) {
    player.records[`this${name}`].time = new Decimal(player.records[`this${name}`].time);
    player.records[`best${name}`].time = patchTime(player.records[`best${name}`].time);
  }

  function fixRecents(name) {
    player.records[`recent${name}`] = player.records[`recent${name}`].map((i) => [patchTime(i[0]), ...i.slice(1)]);
  }

  swapToDecimal("Infinity");
  swapToDecimal("Eternity");
  swapToDecimal("Reality");

  fixRecents("Infinities");
  fixRecents("Eternities");
  fixRecents("Realities");

  player.records.totalTimePlayed = new Decimal(player.records.totalTimePlayed);
  player.records.totalTimePlayedAtBHUnlock = new Decimal(player.records.totalTimePlayedAtBHUnlock);
  player.celestials.enslaved.stored = new Decimal(player.celestials.enslaved.stored);
  player.records.thisInfinity.lastBuyTime = new Decimal(player.records.thisInfinity.lastBuyTime);
  player.auto.reality.shard = new Decimal(player.auto.reality.shard);
  const l = player.celestials.laitela;
  l.darkEnergy = new Decimal(l.darkEnergy);
  l.singularities = new Decimal(l.singularities);
  l.lastCheckedMilestones = new Decimal(l.lastCheckedMilestones);
  l.darkMatterMult = new Decimal(l.darkMatterMult);
  player.auto.annihilation.multiplier = new Decimal(player.auto.annihilation.multiplier);
  player.reality.glyphs.sac = Object.fromEntries(
    Object.entries(player.reality.glyphs.sac).map((i) => [i[0], new Decimal(i[1])]),
  );
  player.records.achTimer = new Decimal(player.records.achTimer);

  // New stuff that has been added
  player.records.thisCollapse.time = player.records.totalTimePlayed;
  player.records.thisCollapse.realTime = player.records.realTimePlayed;
  player.records.thisCollapse.realTimeNoStore = player.records.realTimePlayed;

  // New dilation autobuyers
  player.auto.dilationUpgrades.all = [
    ...player.auto.dilationUpgrades.all,
    ...Array.range(0, 3).map(() => ({
      isActive: false,
      lastTick: 0,
    })),
  ];

  // More continuum settings
  player.auto.continuumDisabled.AD = player.auto.disableContinuum;
  delete player.auto.disableContinuum;

  player.reality.automator.state.forceRealityRestart = player.reality.automator.state.forceRestart;
  delete player.reality.automator.state.forceRestart;

  // Glyph level setting
  player.options.ignoreGlyphLevel = Number(player.options.ignoreGlyphLevel);
}

export function skipToNewContent() {
  NG.carryover(() => {
    GameStorage.offlineEnabled = false;
    GameStorage.import(save);
  });
}

// Lazy way to hide the "in this Collapse" text until you know about it
export function atomTimeText() {
  return PlayerProgress.atomUnlocked() ? " in this Collapse" : "";
}

export function gainedAtoms() {
  let gain = DC.D1;
  gain = gain.timesEffectOf(AtomUpgrade(1));
  gain = gain.timesEffectOf(Achievement(191));
  return gain.floor();
}

export function getCollapseGain() {
  return 1;
}

function updateCollapseStats() {
  player.records.bestCollapse.time = player.records.bestCollapse.time.min(player.records.thisCollapse.time);
  player.records.bestCollapse.realTime = Math.min(
    player.records.bestCollapse.realTime,
    player.records.thisCollapse.realTime,
  );
  player.records.bestCollapse.realTimeNoStore = Math.min(
    player.records.bestCollapse.realTimeNoStore,
    player.records.thisCollapse.realTimeNoStore,
  );
}

function resetCollapseStats() {
  player.records.thisCollapse.time = DC.D0;
  player.records.thisCollapse.realTime = 0;
  player.records.thisCollapse.realTimeNoStore = 0;
  player.records.thisCollapse.maxAM = DC.D0;
  player.records.thisCollapse.maxIP = DC.D0;
  player.records.thisCollapse.maxEP = DC.D0;
  player.records.thisCollapse.maxRM = DC.D0;
  player.records.thisCollapse.maxIM = DC.D0;
}

function askCollapseConfirmation() {
  if (player.options.confirmations.collapse) {
    Modal.collapse.show();
  } else {
    collapse();
  }
}

function lockAchievementsOnCollapse() {
  for (const achievement of Achievements.preAtom) {
    achievement.lock();
  }
  player.reality.achTimer = DC.D0;
}

function unlockRealityUpgrade(num, isReality) {
  const upg = isReality ? RealityUpgrade(num) : ImaginaryUpgrade(num);
  if (isReality) player.reality.upgReqs |= 1 << upg.id;
  else player.reality.imaginaryUpgReqs |= 1 << upg.id;
  upg.hasPlayerLock = false;
}

function giveRealityUpgrade(num, isReality) {
  unlockRealityUpgrade(num, isReality);

  const upg = isReality ? RealityUpgrade(num) : ImaginaryUpgrade(num);
  upg.isBought = true;
  upg.onPurchased();
}

function giveAU8() {
  Achievements.row(18).forEach((i) => i.give());
}

// eslint-disable-next-line complexity
export function collapse() {
  // This function can get called to force a reset, so we don't want to give the rewards if the player can't
  if (Player.canCollapse) {
    // Put this before so that way ach192 updates correctly
    updateCollapseStats();
    // This might need to be placed outside of the if block but I think it's fine for now
    EventHub.dispatch(GAME_EVENT.COLLAPSE_RESET_BEFORE);

    // STUFF TO GAIN
    const atomsGained = gainedAtoms();
    const collapsesMade = getCollapseGain();
    Currency.atoms.add(atomsGained);
    player.atom.totalAtoms = player.atom.totalAtoms.add(atomsGained);
    Currency.collapses.add(collapsesMade);
    addCollapseTime(player.records.thisCollapse.time, player.records.thisCollapse.realTime, atomsGained, collapsesMade);
  }

  // RESET
  GameEnd.creditsClosed = false;
  GameEnd.creditsEverClosed = false;
  player.isGameEnd = false;

  lockAchievementsOnCollapse();

  // Celestials
  Object.assign(player.celestials.teresa, {
    pouredAmount: 0,
    unlockBits: 0,
    run: false,
    bestRunAM: DC.D1,
    bestAMSet: [],
    perkShop: Array.repeat(0, 5),
    lastRepeatedMachines: DC.D0,
  });

  Object.assign(player.celestials.effarig, {
    relicShards: DC.D0,
    unlockBits: 0,
    run: false,
    glyphWeights: {
      ep: 25,
      repl: 25,
      dt: 25,
      eternities: 25,
    },
  });

  Object.assign(player.celestials.enslaved, {
    isStoring: false,
    stored: DC.D0,
    isStoringReal: false,
    storedReal: 0,
    autoStoreReal: false,
    unlocks: [],
    run: false,
    completed: false,
    tesseracts: 0,
    hasSecretStudy: false,
    feltEternity: false,
    progressBits: 0,
    hintBits: 0,
    hintUnlockProgress: 0,
    glyphHintsGiven: 0,
    zeroHintTime: 0,
    isDischargingReal: false,
  });
  Enslaved.autoReleaseTick = 0;

  V.reset();

  Ra.reset();
  player.celestials.ra.petWithRemembrance = "";
  player.celestials.ra.momentumTime = 0;
  player.celestials.ra.alchemy = Array.repeat(0, 21).map(() => ({
    amount: 0,
    reaction: false,
  }));
  player.celestials.ra.highestRefinementValue = {
    power: 0,
    infinity: 0,
    time: 0,
    replication: 0,
    dilation: 0,
    effarig: 0,
  };

  Laitela.reset();
  Object.assign(player.celestials.laitela, {
    run: false,
    entropy: 0,
    thisCompletion: 3600,
    upgrades: {},
    darkEnergy: DC.D0,
    lastCheckedMilestones: DC.D0,
  });

  Object.assign(player.celestials.pelle, {
    doomed: false,
    upgrades: new Set(),
    remnants: 0,
    realityShards: DC.D0,
    records: {
      totalAntimatter: DC.D0,
      totalInfinityPoints: DC.D0,
      totalEternityPoints: DC.D0,
    },
    rebuyables: {
      antimatterDimensionMult: 0,
      timeSpeedMult: 0,
      glyphLevels: 0,
      infConversion: 0,
      galaxyPower: 0,
      galaxyGeneratorAdditive: 0,
      galaxyGeneratorMultiplicative: 0,
      galaxyGeneratorAntimatterMult: 0,
      galaxyGeneratorIPMult: 0,
      galaxyGeneratorEPMult: 0,
    },
    rifts: {
      vacuum: {
        fill: DC.D0,
        active: false,
        reducedTo: 1,
      },
      decay: {
        fill: DC.D0,
        active: false,
        percentageSpent: 0,
        reducedTo: 1,
      },
      chaos: {
        fill: 0,
        active: false,
        reducedTo: 1,
      },
      recursion: {
        fill: DC.D0,
        active: false,
        reducedTo: 1,
      },
      paradox: {
        fill: DC.D0,
        active: false,
        reducedTo: 1,
      },
    },
    progressBits: 0,
    galaxyGenerator: {
      unlocked: false,
      spentGalaxies: 0,
      generatedGalaxies: 0,
      phase: 0,
      sacrificeActive: false,
    },
    collapsed: {
      upgrades: false,
      rifts: false,
      galaxies: false,
    },
  });

  // Reality
  player.reality.upgReqs = 0;
  player.reality.imaginaryUpgReqs = 0;
  player.reality.upgradeBits = 0;
  player.reality.imaginaryUpgradeBits = 0;
  player.reality.realityMachines = DC.D0;
  player.reality.reqLock.reality = 0;
  player.reality.reqLock.imaginary = 0;
  player.reality.imaginaryMachines = DC.D0;
  player.reality.maxRM = DC.D0;
  player.reality.iMCap = DC.D0;
  player.reality.glyphs.sac.power = DC.D0;
  player.reality.glyphs.sac.infinity = DC.D0;
  player.reality.glyphs.sac.replication = DC.D0;
  player.reality.glyphs.sac.time = DC.D0;
  player.reality.glyphs.sac.dilation = DC.D0;
  player.reality.glyphs.sac.effarig = DC.D0;
  player.reality.glyphs.sac.reality = DC.D0;
  player.reality.glyphs.undo = [];
  player.reality.perkPoints = 0;
  player.realities = 0;
  player.reality.perks.clear();

  for (let i = 1; i <= 5; i++) {
    player.reality.rebuyables[i] = 0;
  }

  for (let i = 1; i <= 10; i++) {
    player.reality.imaginaryRebuyables[i] = 0;
  }

  player.blackHoleNegative = 1;
  player.blackHole = Array.range(0, 2).map((id) => ({
    id,
    intervalUpgrades: 0,
    powerUpgrades: 0,
    durationUpgrades: 0,
    phase: 0,
    active: AtomMilestone.am2.isReached,
    unlocked: false,
    activations: 0,
  }));

  player.records.thisReality = {
    time: DC.D0,
    realTime: 0,
    maxAM: DC.D0,
    maxIP: DC.D0,
    maxEP: DC.D0,
    bestEternitiesPerMs: DC.D0,
    maxReplicanti: DC.D0,
    maxDT: DC.D0,
    bestRSmin: DC.D0,
    bestRSminVal: DC.D0,
  };
  player.records.bestReality = {
    time: Decimal.MAX_LIMIT,
    realTime: Number.MAX_VALUE,
    glyphStrength: 0,
    RM: DC.D0,
    RMSet: [],
    RMmin: DC.D0,
    RMminSet: [],
    glyphLevel: 0,
    glyphLevelSet: [],
    bestEP: DC.D0,
    bestEPSet: [],
    speedSet: [],
    iMCapSet: [],
    laitelaSet: [],
  };

  // Remove all glyphs in inventory that aren't companion
  for (const glyph of Glyphs.inventory) {
    if (glyph !== null && glyph.type !== "companion") Glyphs.removeFromInventory(glyph, false);
  }

  // Remove all active glyphs that aren't companion
  for (const activeGlyph of player.reality.glyphs.active) {
    Glyphs.active[activeGlyph.idx] = null;
    if (activeGlyph.type === "companion") {
      // Use the first index available; this prioritizes the protected slots
      const index = Glyphs.inventory.findIndex((i) => i !== null);
      if (index < 0) continue;
      Glyphs.addToInventory(activeGlyph, index, true);
    }
  }
  player.reality.glyphs.active = [];

  recalculateAllGlyphs();
  Glyphs.updateMaxGlyphCount(true);
  Glyphs.refreshActive();
  resetRealityRuns();
  clearCelestialRuns();
  player.reality.unlockedEC = 0;
  player.reality.lastAutoEC = 0;
  player.reality.gainedAutoAchievements = false;
  player.reality.hasCheckedFilter = false;

  // Eternity
  player.records.thisEternity.time = DC.D0;
  player.records.thisEternity.realTime = 0;
  player.records.thisEternity.maxAM = DC.D0;
  player.records.thisEternity.bestEPmin = DC.D0;
  player.records.thisEternity.bestInfinitiesPerMs = DC.D0;
  player.records.thisEternity.bestIPMsWithoutMaxAll = DC.D0;
  player.records.bestEternity.time = Decimal.MAX_LIMIT;
  player.records.bestEternity.realTime = Number.MAX_VALUE;
  player.records.bestEternity.bestEPminReality = DC.D0;
  Currency.timeShards.reset();
  Currency.eternityPoints.reset();
  EternityUpgrade.epMult.reset();
  Currency.eternities.reset();
  player.eternityUpgrades.clear();
  player.totalTickGained = 0;
  player.eternityChalls = {};
  player.challenge.eternity.current = 0;
  player.challenge.eternity.unlocked = 0;
  player.challenge.eternity.requirementBits = 0;
  player.respec = false;
  player.eterc8ids = 50;
  player.eterc8repl = 40;
  Currency.timeTheorems.reset();
  player.dilation.studies = [];
  player.dilation.active = false;
  player.dilation.upgrades.clear();
  player.dilation.rebuyables = {
    1: 0,
    2: 0,
    3: 0,
    11: 0,
    12: 0,
    13: 0,
  };
  Currency.tachyonParticles.reset();
  player.dilation.nextThreshold = DC.E3;
  player.dilation.baseTachyonGalaxies = 0;
  player.dilation.totalTachyonGalaxies = 0;
  Currency.dilatedTime.reset();
  player.dilation.lastEP = DC.DM1;
  resetEternityRuns();
  fullResetTimeDimensions();
  resetTimeDimensions();

  // Infinity
  player.records.bestInfinity.time = Decimal.MAX_LIMIT;
  player.records.bestInfinity.realTime = Number.MAX_VALUE;
  player.records.bestInfinity.bestIPminEternity = DC.D0;
  player.records.thisInfinity.time = DC.D0;
  player.records.thisInfinity.lastBuyTime = DC.D0;
  player.records.thisInfinity.realTime = 0;
  player.records.thisInfinity.maxAM = DC.D0;
  player.records.thisInfinity.bestIPmin = DC.D0;
  initializeChallengeCompletions(true);
  disChargeAll();
  Currency.infinities.reset();
  Currency.infinitiesBanked.reset();
  player.partInfinityPoint = 0;
  player.partInfinitied = 0;
  player.break = false;
  player.IPMultPurchases = 0;
  Currency.infinityPower.reset();
  Replicanti.reset(true);
  playerInfinityUpgradesOnReset();
  resetInfinityRuns();
  InfinityDimensions.fullReset();
  secondSoftReset(false);
  InfinityDimensions.resetAmount();
  Currency.infinityPoints.reset();

  // Pre-Infinity
  player.sacrificed = DC.D0;
  player.dimensionBoosts = 0;
  player.galaxies = 0;
  resetChallengeStuff();
  AntimatterDimensions.reset();
  resetTickspeed();

  // Misc
  resetCollapseStats();
  if (player.options.automatorEvents.clearOnReality) AutomatorData.clearEventLog();

  // Technically a Collapse is a Reality but I'm actually not sure so
  if (
    Player.automatorUnlocked &&
    (AutomatorBackend.state.forceRealityRestart || AutomatorBackend.state.forceCollapseRestart)
  ) {
    // Make sure to restart the current script instead of using the editor script - the editor script might
    // not be a valid script to run; this at best stops it from running and at worst causes a crash
    AutomatorBackend.start(AutomatorBackend.state.topLevelScript);
  }
  AchievementTimers.marathon2.reset();
  Tab.dimensions.antimatter.show();

  Lazy.invalidateAll();
  ECTimeStudyState.invalidateCachedRequirements();
  Player.resetRequirements("atom");

  // Post-Reset

  // Why here? Some achievements like "Perks of Living" will be obtained through post-reset grants
  // This will cause notifications, which is kind of annoying, so we give them here to avoid that
  if (AtomMilestone.am6.isReached) {
    const toGive = Math.min(Currency.collapses.value * 2, Achievements.AM6.length);
    for (let i = 0; i < toGive; i++) Achievements.AM6[i].give();
  }

  if (AtomMilestone.am1.isReached) {
    // When ACHNR is obtained, it sends a lot of notifications that achievements
    // have been obtained, which isn't very useful, so we give the achievements here
    for (const achievement of Achievements.preReality) achievement.give();

    for (const perk of Perks.all) {
      perk.isBought = true;
      perk.onPurchased();
    }

    giveRealityUpgrade(10, true);
    giveRealityUpgrade(13, true);
    giveRealityUpgrade(25, true);
  }
  if (AtomMilestone.am2.isReached) {
    for (const blackHole of player.blackHole) blackHole.unlocked = true;
    giveRealityUpgrade(20, false);
    for (let i = 1; i <= 12; i++) EternityChallenge(i).completions = 5;
    Achievement(144).give();
  }
  if (AtomMilestone.am3.isReached) {
    player.celestials.teresa.pouredAmount = Teresa.pouredAmountCap;
    player.celestials.teresa.perkShop = [11, 11, 4, 2, 0, 0];
  }
  if (AtomMilestone.am4.isReached) {
    player.celestials.effarig.unlockBits = 127;
    player.celestials.enslaved.unlocks = [0, 1];
    player.celestials.enslaved.completed = true;
    player.celestials.v.runUnlocks = [2, 2, 2, 2, 2, 2, 0, 0, 0];
    player.celestials.v.unlockBits = 1 << VUnlocks.vAchievementUnlock.id;
  }
  if (AtomMilestone.am5.isReached) {
    for (const pet of Ra.pets.all) pet.level = 5;
    player.celestials.v.runUnlocks = [4, 4, 4, 4, 4, 4, 2, 2, 2];
    player.celestials.laitela.difficultyTier = 1;
    player.celestials.laitela.fastestCompletion = 300;
  }
  if (AtomMilestone.am6.isReached) {
    for (const pet of Ra.pets.all) pet.level = 10;
    player.celestials.laitela.difficultyTier = 3;
    for (const resource of AlchemyResources.all) resource.amount = 5000;
    giveRealityUpgrade(19, false);
    player.celestials.teresa.perkShop = [20, 20, 14, 6, 0, 0];
  }
  if (AtomMilestone.am7.isReached) {
    for (const resource of AlchemyResources.all) resource.amount = 10000;
    player.celestials.laitela.difficultyTier = 5;
  }
  if (AtomMilestone.am8.isReached) {
    for (const pet of Ra.pets.all) pet.level = 15;
    for (const resource of AlchemyResources.all) resource.amount = 15000;
    player.celestials.laitela.difficultyTier = 8;
    player.celestials.v.runUnlocks = Array.repeat(4, 9);

    for (let i = 6; i <= 25; i++) unlockRealityUpgrade(i, true);
    for (let i = 11; i <= 25; i++) unlockRealityUpgrade(i, false);
  }
  if (AtomMilestone.am9.isReached) {
    for (const pet of Ra.pets.all) pet.level = 20;
    for (const resource of AlchemyResources.all) resource.amount = 20000;
    player.celestials.v.runUnlocks = Array.repeat(5, 9);
  }
  if (AtomMilestone.am10.isReached) {
    const upgrades = [
      InfinityUpgrade.totalTimeMult,
      InfinityUpgrade.dim18mult,
      InfinityUpgrade.dim36mult,
      InfinityUpgrade.resetBoost,
      InfinityUpgrade.buy10Mult,
      InfinityUpgrade.dim27mult,
      InfinityUpgrade.dim45mult,
      InfinityUpgrade.galaxyBoost,
      InfinityUpgrade.thisInfinityTimeMult,
      InfinityUpgrade.unspentIPMult,
      InfinityUpgrade.dimboostMult,
      InfinityUpgrade.ipGen,
    ];
    for (const upgrade of upgrades) upgrade.charge();
    for (const pet of Ra.pets.all) pet.level = 25;
    for (const resource of AlchemyResources.all) resource.amount = 25000;
    player.celestials.v.runUnlocks = [6, 6, 6, 6, 6, 6, 5, 5, 5];
    Glyphs.addToInventory(GlyphGenerator.realityGlyph(25000));
  }
  if (AtomUpgrade(7).isBought) giveAU8();

  Teresa.checkForUnlocks();
  V.updateTotalRunUnlocks();
  V.checkForUnlocks(true);
  Ra.checkForUnlocks();

  EventHub.dispatch(GAME_EVENT.COLLAPSE_RESET_AFTER);
}

export function collapseResetRequest() {
  if (!Player.canCollapse) return;
  askCollapseConfirmation();
}

export function breakUniverse() {
  player.atom.broken = true;
  EventHub.dispatch(GAME_EVENT.BREAK_UNIVERSE);
}

export function respecAtomUpgradesRequest() {
  if (player.options.confirmations.respecAtomUpgrades) {
    Modal.respecAtomUpgrades.show();
  } else {
    respecAtomUpgrades();
  }
}

export function respecAtomUpgrades() {
  player.atom.atoms = player.atom.atoms.add(player.atom.upgradeSpent);
  player.atom.upgradeSpent = DC.D0;

  // Respec upgrades
  for (const upg of AtomUpgrades.all) {
    if ([2, 10].includes(upg.id)) continue;
    // This isn't technically correct but no one cares so
    upg.isBought = false;
  }

  collapse();
}

export class AtomMilestoneState {
  constructor(config) {
    this.config = config;
  }

  get isReached() {
    const req = this.time;
    if (req < 1000) return player.atom.resetCount >= req;
    return player.records.bestCollapse.realTimeNoStore < req;
  }

  get time() {
    return this.config.time;
  }

  get reward() {
    return this.config.reward;
  }
}

export const AtomMilestone = mapGameDataToObject(
  GameDatabase.atom.milestones,
  (config) => new AtomMilestoneState(config),
);

class AtomUpgradeState extends BitPurchasableMechanicState {
  constructor(config) {
    super(config);
    this.registerEvents(config.checkEvent, () => this.tryUnlock());
  }

  get name() {
    return this.config.name;
  }

  get cost() {
    return typeof this.config.cost === "function" ? this.config.cost() : this.config.cost;
  }

  get shortDescription() {
    return this.config.shortDescription ? this.config.shortDescription() : "";
  }

  get requirement() {
    return typeof this.config.requirement === "function" ? this.config.requirement() : this.config.requirement;
  }

  get lockEvent() {
    return typeof this.config.lockEvent === "function" ? this.config.lockEvent() : this.config.lockEvent;
  }

  get currency() {
    return Currency.atoms;
  }

  get bitIndex() {
    return this.id;
  }

  get bits() {
    return player.atom.upgradeBits;
  }

  set bits(value) {
    player.atom.upgradeBits = value;
  }

  get hasPlayerLock() {
    return false;
  }

  get isLockingMechanics() {
    const shouldBypass = this.config.bypassLock?.() ?? false;
    return this.hasPlayerLock && this.isPossible && !shouldBypass && !this.isAvailableForPurchase;
  }

  get isAvailableForPurchase() {
    return true;
  }

  get isPossible() {
    return this.config.hasFailed ? !this.config.hasFailed() : true;
  }

  tryUnlock() {
    const atomReached = PlayerProgress.atomUnlocked();
    if (!atomReached || this.isAvailableForPurchase || !this.config.checkRequirement()) return;
    player.atom.upgReqs |= 1 << this.id;
    GameUI.notify.reality(`You've unlocked an Atom Upgrade: ${this.config.name}`);
    this.hasPlayerLock = false;
  }

  // `onPurchased` runs after the upgrade has been bought, which means the cost will be increased
  purchase() {
    if (this.canBeBought && ![2, 10].includes(this.id)) {
      player.atom.upgradeSpent = player.atom.upgradeSpent.add(this.cost);
    }
    return super.purchase();
  }

  onPurchased() {
    switch (this.id) {
      case 3:
        V.updateTotalRunUnlocks();
        break;
      case 7:
        giveAU8();
        break;
      case 9:
        Glyphs.refreshActive();
        break;
    }
  }
}

class RebuyableAtomUpgradeState extends RebuyableMechanicState {
  get currency() {
    return Currency.atoms;
  }

  get boughtAmount() {
    return player.atom.rebuyables[this.id];
  }

  set boughtAmount(value) {
    player.atom.rebuyables[this.id] = value;
  }
}

const AUIndex = mapGameData(GameDatabase.atom.upgrades, (config) =>
  config.id % 5 === 1 ? new RebuyableAtomUpgradeState(config) : new AtomUpgradeState(config),
);

export const AtomUpgrade = (id) => AUIndex[id];

export const AtomUpgrades = {
  all: AUIndex.compact(),
  // Used for the pelle rebuyable dilation upgrades
  dilExpo(id) {
    if (Pelle.isDoomed) return 1;
    if (id === 11) return 2;
    if (id === 12) return 4;
    return 3;
  },
};

class AtomicParticleState extends GameMechanicState {
  get name() {
    return this.config.name;
  }

  get color() {
    return this.config.color;
  }

  get amount() {
    return player.atom.particles[this.config.id];
  }

  get effects() {
    return this.config.bonus(this.amount);
  }

  get effectDescriptions() {
    return this.config.description(this.effects);
  }

  // A utility
  static createAccessor(gameData) {
    return super.createAccessor(
      gameData.map((i, id) => ({
        ...i,
        id,
      })),
    );
  }
}

export const AtomicParticle = AtomicParticleState.createAccessor(GameDatabase.atom.power);

export const AtomicPower = {
  get gain() {
    if (!PlayerProgress.atomUnlocked()) return DC.D0;
    let base = player.atom.totalAtoms.mul(Currency.collapses.value);
    base = base.mul(AtomicParticle(1).effects[0]);
    return base;
  },
  tick(realDiff) {
    player.atom.atomicPower = player.atom.atomicPower.add(this.gain.mul(realDiff / 1000));
  },
  use(slot) {
    player.atom.particles[slot] = player.atom.particles[slot].add(player.atom.atomicPower);
    player.atom.atomicPower = DC.D0;
    EventHub.dispatch(GAME_EVENT.ATOMIC_PARTICLE_CONVERSION);
  },
};
