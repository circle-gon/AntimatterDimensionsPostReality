import { DC } from "./constants";

export function migrateSaves(player) {
  // change effarig shards to decimal
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
    player.records["this" + name].time = new Decimal(player.records["this" + name].time);
    player.records["best" + name].time = patchTime(player.records["best" + name].time);
  }

  function fixRecents(name) {
    player.records["recent" + name] = player.records["recent" + name].map((i) => {
      return [patchTime(i[0]), ...i.slice(1)];
    });
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
    Object.entries(player.reality.glyphs.sac).map((i) => [i[0], new Decimal(i[1])])
  );
  player.records.achTimer = new Decimal(player.records.achTimer);

  // New stuff that has been added
  player.records.thisCollapse.time = player.records.totalTimePlayed;
  player.records.thisCollapse.realTime = player.records.realTimePlayed;
}

// lazy way to hide the "in this Collapse" text until you know about it
export function atomTimeText() {
  return PlayerProgress.atomUnlocked() ? " in this Collapse" : "";
}

function gainedAtoms() {
  return DC.D1;
}

function getCollapseGain() {
  return 1;
}

function updateCollapseStats() {
  player.records.bestCollapse.time = player.records.bestCollapse.time.min(player.records.thisCollapse.time);
  player.records.bestCollapse.realTime = Math.min(
    player.records.bestCollapse.realTime,
    player.records.thisCollapse.realTime
  );
}

function resetCollapseStats() {
  player.records.thisCollapse.time = DC.D0;
  player.records.thisCollapse.realTime = 0;
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

export function collapse() {
  EventHub.dispatch(GAME_EVENT.COLLAPSE_BEFORE);

  const atomsGained = gainedAtoms();
  const collapsesMade = getCollapseGain();
  Currency.atoms.add(atomsGained);
  Currency.collapses.add(collapsesMade);
  updateCollapseStats();
  addCollapseTime(player.records.thisCollapse.time, player.records.thisCollapse.realTime, atomsGained, collapsesMade);

  lockAchievementsOnCollapse();
  player.isGameEnd = false;

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
    autoAdjustGlyphWeights: false,
  });

  Object.assign(player.celestials.enslaved, {
    isStoring: false,
    stored: DC.D0,
    isStoringReal: false,
    storedReal: 0,
    autoStoreReal: false,
    isAutoReleasing: false,
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
  player.reality.perks.clear();

  for (let i = 1; i <= 5; i++) {
    player.reality.rebuyables[i] = 0;
  }

  for (let i = 1; i <= 10; i++) {
    player.reality.imaginaryRebuyables[i] = 0;
  }

  player.blackHole = Array.range(0, 2).map((id) => ({
    id,
    intervalUpgrades: 0,
    powerUpgrades: 0,
    durationUpgrades: 0,
    phase: 0,
    active: false,
    unlocked: false,
    activations: 0,
  }));

  player.reality.gainedAutoAchievements = false;
  player.reality.hasCheckedFilter = false;
  clearCelestialRuns();
  resetRealityRuns();
  Glyphs.updateMaxGlyphCount(true);
  player.reality.unlockedEC = 0;
  player.reality.lastAutoEC = 0;
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
  player.realities = 0;

  // remove all glyphs in inventory that aren't companion
  for (const glyph of Glyphs.inventory) {
    if (glyph !== null && glyph.type !== "companion") Glyphs.removeFromInventory(glyph, false);
  }

  // remove all active glyphs that aren't companion
  for (const activeGlyph of player.reality.glyphs.active) {
    Glyphs.active[activeGlyph.idx] = null;
    if (activeGlyph.type === "companion") {
      let index = Glyphs.findFreeIndex(player.options.respecIntoProtected);
      // In case there is nowhere to put it
      // (all slots are protected and respecIntoProtected is false, or vice-versa)
      // just use the first slot, and it is guaranteed to work
      // because we wiped all the glyphs in the inventory
      if (index < 0) index = 0;
      Glyphs.addToInventory(activeGlyph, index, true);
    }
  }
  player.reality.glyphs.active = [];

  // Eternity
  resetEternityRuns();
  Currency.timeShards.reset();
  Currency.eternityPoints.reset();
  EternityUpgrade.epMult.reset();
  Currency.eternities.reset();
  player.records.thisEternity.time = DC.D0;
  player.records.thisEternity.realTime = 0;
  player.records.thisEternity.maxAM = DC.D0;
  player.records.thisEternity.bestEPmin = DC.D0;
  player.records.thisEternity.bestInfinitiesPerMs = DC.D0;
  player.records.thisEternity.bestIPMsWithoutMaxAll = DC.D0;
  player.records.bestEternity.time = Decimal.MAX_LIMIT;
  player.records.bestEternity.realTime = Number.MAX_VALUE;
  player.records.bestEternity.bestEPminReality = DC.D0;
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
  player.celestials.v.STSpent = 0;
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
  fullResetTimeDimensions();
  resetTimeDimensions();

  // Infinity
  secondSoftReset(false);
  resetInfinityRuns();
  disChargeAll();
  initializeChallengeCompletions(true);
  Currency.infinities.reset();
  Currency.infinitiesBanked.reset();
  player.records.bestInfinity.time = Decimal.MAX_LIMIT;
  player.records.bestInfinity.realTime = Number.MAX_VALUE;
  player.records.bestInfinity.bestIPminEternity = DC.D0;
  player.records.thisInfinity.time = DC.D0;
  player.records.thisInfinity.lastBuyTime = DC.D0;
  player.records.thisInfinity.realTime = 0;
  player.records.thisInfinity.maxAM = DC.D0;
  player.records.thisInfinity.bestIPmin = DC.D0;
  player.partInfinityPoint = 0;
  player.partInfinitied = 0;
  player.break = false;
  player.IPMultPurchases = 0;
  Currency.infinityPower.reset();
  Replicanti.reset(true);
  playerInfinityUpgradesOnReset();
  InfinityDimensions.fullReset();
  InfinityDimensions.resetAmount();
  Currency.infinityPoints.reset();

  // Pre-Infinity
  player.sacrificed = DC.D0;
  resetTickspeed();
  Currency.antimatter.reset();
  resetChallengeStuff();
  AntimatterDimensions.reset();

  // Misc
  resetCollapseStats();
  if (player.options.automatorEvents.clearOnReality) AutomatorData.clearEventLog();
  if (Player.automatorUnlocked && AutomatorBackend.state.forceRestart) {
    // Make sure to restart the current script instead of using the editor script - the editor script might
    // not be a valid script to run; this at best stops it from running and at worst causes a crash
    AutomatorBackend.start(AutomatorBackend.state.topLevelScript);
  }
  AchievementTimers.marathon2.reset();
  Glyphs.refresh();
  Lazy.invalidateAll();
  ECTimeStudyState.invalidateCachedRequirements();

  EventHub.dispatch(GAME_EVENT.COLLAPSE_AFTER);
}

export function collapseResetRequest() {
  if (!Player.canCollapse) return;
  askCollapseConfirmation();
}

export function breakUniverse() {
  // TODOM: expand this
  player.atom.broken = true;
}
