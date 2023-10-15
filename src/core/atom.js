export function migrateSaves(player) {
  // change effarig shards to decimal
  player.celestials.effarig.relicShards = new Decimal(player.celestials.effarig.relicShards);
  player.reality.imaginaryMachines = new Decimal(player.reality.imaginaryMachines);
  player.reality.iMCap = new Decimal(player.reality.iMCap);
  player.records.totalTimePlayed = new Decimal(player.records.totalTimePlayed);
  player.celestials.ra.peakGamespeed = new Decimal(player.celestials.ra.peakGamespeed);
  player.challenge.normal.bestTimes = player.challenge.normal.bestTimes.map((i) => new Decimal(i));
  player.challenge.infinity.bestTimes = player.challenge.infinity.bestTimes.map((i) => new Decimal(i));

  player.records.thisReality.bestRSMin = new Decimal(player.records.thisReality.bestRSMin);
  player.records.thisReality.bestRSMinVal = new Decimal(player.records.thisReality.bestRSMinVal);

  function patchTime(value) {
    return value === Number.MAX_VALUE ? Decimal.MAX_LIMIT : new Decimal(value);
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
}

function askCollapseConfirmation() {
  if (player.options.confirmations.collapse) {
    Modal.collapse.show();
  } else {
    collapse();
  }
}

export function collapse() {
  EventHub.dispatch(GAME_EVENT.COLLAPSE_BEFORE);
  // TODOM: reset stuff
  EventHub.dispatch(GAME_EVENT.COLLAPSE_AFTER);
}

export function collapseResetRequest() {
  if (!Player.canCollapse) return;
  askCollapseConfirmation();
}

export function breakUniverse() {
  // TODOM: expand this
  player.atom.broken = true
}
