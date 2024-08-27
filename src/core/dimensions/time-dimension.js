import { DC } from "../constants";

import { DimensionState } from "./dimension";

export function buySingleTimeDimension(tier, auto = false) {
  const dim = TimeDimension(tier);
  if (tier > 4) {
    if (!TimeStudy.timeDimension(tier).isBought) return false;
    if (RealityUpgrade(13).isLockingMechanics && Currency.eternityPoints.gte(dim.cost)) {
      if (!auto) RealityUpgrade(13).tryShowWarningModal();
      return false;
    }
  }
  if (Currency.eternityPoints.lt(dim.cost)) return false;
  if (Enslaved.isRunning && dim.bought > 0) return false;
  if (ImaginaryUpgrade(15).isLockingMechanics && EternityChallenge(7).completions > 0) {
    if (!auto) {
      ImaginaryUpgrade(15).tryShowWarningModal(`purchase a Time Dimension,
        which will produce Infinity Dimensions through EC7`);
    }
    return false;
  }

  Currency.eternityPoints.subtract(dim.cost);
  dim.amount = dim.amount.plus(1);
  dim.bought += 1;
  dim.cost = dim.nextCost(dim.bought);
  return true;
}

export function resetTimeDimensions() {
  for (const dim of TimeDimensions.all) dim.amount = new Decimal(dim.bought);
  updateTimeDimensionCosts();
}

export function fullResetTimeDimensions() {
  for (const dim of TimeDimensions.all) {
    dim.cost = new Decimal(dim.baseCost);
    dim.amount = DC.D0;
    dim.bought = 0;
  }
}

export function toggleAllTimeDims() {
  const areEnabled = Autobuyer.timeDimension(1).isActive;
  for (let i = 1; i < 9; i++) {
    Autobuyer.timeDimension(i).isActive = !areEnabled;
  }
}

export function buyMaxTimeDimension(tier, portionToSpend = 1, isMaxAll = false) {
  const canSpend = Currency.eternityPoints.value.times(portionToSpend);
  const dim = TimeDimension(tier);
  if (canSpend.lt(dim.cost)) return false;
  if (tier > 4) {
    if (!TimeStudy.timeDimension(tier).isBought) return false;
    if (RealityUpgrade(13).isLockingMechanics) {
      if (!isMaxAll) RealityUpgrade(13).tryShowWarningModal();
      return false;
    }
  }
  if (ImaginaryUpgrade(15).isLockingMechanics && EternityChallenge(7).completions > 0) {
    if (!isMaxAll) {
      ImaginaryUpgrade(15).tryShowWarningModal(`purchase a Time Dimension,
        which will produce Infinity Dimensions through EC7`);
    }
    return false;
  }
  if (Enslaved.isRunning) return buySingleTimeDimension(tier);
  const bulk = bulkBuyBinarySearch(
    canSpend,
    {
      costFunction: (bought) => dim.nextCost(bought),
      cumulative: true,
      firstCost: dim.cost,
    },
    dim.bought,
  );
  if (!bulk) return false;
  Currency.eternityPoints.subtract(bulk.purchasePrice);
  dim.amount = dim.amount.plus(bulk.quantity);
  dim.bought += bulk.quantity;
  dim.cost = dim.nextCost(dim.bought);
  return true;
}

export function maxAllTimeDimensions() {
  // Try to buy single from the highest affordable new dimensions
  for (let i = 8; i > 0 && TimeDimension(i).bought === 0; i--) {
    buySingleTimeDimension(i, true);
  }

  // Buy everything costing less than 1% of initial EP
  for (let i = 8; i > 0; i--) {
    buyMaxTimeDimension(i, 0.01, true);
  }

  // Loop buying the cheapest dimension possible; explicit infinite loops make me nervous
  const tierCheck = (tier) => (RealityUpgrade(13).isLockingMechanics ? tier < 5 : true);
  const purchasableDimensions = TimeDimensions.all.filter((d) => d.isUnlocked && tierCheck(d.tier));
  for (let stop = 0; stop < 1000; stop++) {
    const cheapestDim = purchasableDimensions.reduce((a, b) => (b.cost.gte(a.cost) ? a : b));
    if (!buySingleTimeDimension(cheapestDim.tier, true)) break;
  }
}

export function timeDimensionCommonMultiplier() {
  let mult =
    Math.log10(ShopPurchase.allDimPurchases.currentMult) +
    Effects.log10Sum(
      Achievement(105),
      Achievement(128),
      TimeStudy(93),
      TimeStudy(103),
      TimeStudy(151),
      TimeStudy(221),
      TimeStudy(301),
      EternityChallenge(1).reward,
      EternityChallenge(10).reward,
      EternityUpgrade.tdMultAchs,
      EternityUpgrade.tdMultTheorems,
      EternityUpgrade.tdMultRealTime,
      Replicanti.areUnlocked && Replicanti.amount.gt(1) ? DilationUpgrade.tdMultReplicanti : null,
      Pelle.isDoomed ? null : RealityUpgrade(22),
      AlchemyResource.dimensionality,
      PelleRifts.chaos,
    );

  if (EternityChallenge(9).isRunning) {
    mult += Math.max(4 * Math.log10(Math.clampMin(InfinityDimensions.ADMultiplier.pow(1 / 7).log2(), 1)), 0);
  }
  return powAndCap(mult);
}

export function updateTimeDimensionCosts() {
  for (let i = 1; i <= 8; i++) {
    const dim = TimeDimension(i);
    dim.cost = dim.nextCost(dim.bought);
  }
}

class TimeDimensionState extends DimensionState {
  constructor(tier) {
    super(() => player.dimensions.time, tier);
    const BASE_COSTS = [null, DC.D1, DC.D5, DC.E2, DC.E3, DC.E2350, DC.E2650, DC.E3000, DC.E3350];
    this._baseCost = BASE_COSTS[tier];
    const COST_MULTS = [null, 3, 9, 27, 81, 24300, 72900, 218700, 656100];
    this._costMultiplier = COST_MULTS[tier];
    const E6000_SCALING_AMOUNTS = [null, 7322, 4627, 3382, 2665, 833, 689, 562, 456];
    this._e6000ScalingAmount = E6000_SCALING_AMOUNTS[tier];
    const COST_THRESHOLDS = [Decimal.NUMBER_MAX_VALUE, DC.E1300, DC.E6000];
    this._costIncreaseThresholds = COST_THRESHOLDS;
  }

  /** @returns {Decimal} */
  get cost() {
    return this.data.cost;
  }

  /** @param {Decimal} value */
  set cost(value) {
    this.data.cost = value;
  }

  nextCost(bought) {
    if (this._tier > 4 && bought < this.e6000ScalingAmount) {
      const cost = Decimal.pow(this.costMultiplier, bought).times(this.baseCost);
      if (PelleRifts.paradox.milestones[0].canBeApplied) {
        return cost.div("1e2250").pow(0.5);
      }
      return cost;
    }

    const costMultIncreases = [1, 1.5, 2.2];
    for (let i = 0; i < this._costIncreaseThresholds.length; i++) {
      const cost = Decimal.pow(this.costMultiplier * costMultIncreases[i], bought).times(this.baseCost);
      if (cost.lt(this._costIncreaseThresholds[i])) return cost;
    }

    let base = this.costMultiplier;
    if (this._tier <= 4) base *= 2.2;
    const exponent = this.e6000ScalingAmount + (bought - this.e6000ScalingAmount) * TimeDimensions.scalingPast1e6000;
    const cost = Decimal.pow(base, exponent).times(this.baseCost);

    if (PelleRifts.paradox.milestones[0].canBeApplied && this._tier > 4) {
      return cost.div("1e2250").pow(0.5);
    }
    return cost;
  }

  get isUnlocked() {
    return this._tier < 5 || TimeStudy.timeDimension(this._tier).isBought;
  }

  get isAvailableForPurchase() {
    return this.isAffordable;
  }

  get isContinuumAvailable() {
    return this.isUnlocked;
  }

  get isAffordable() {
    return Currency.eternityPoints.gte(this.cost);
  }

  get continuumBaseValue() {
    if (!this.isContinuumAvailable) return 0;
    // To be consistent with the standard handling of TDs being disabled, we still
    // retain the amount, even if TDs are disabled
    const paradox = PelleRifts.paradox.milestones[0].canBeApplied;
    const eterPoints = Currency.eternityPoints.value;
    const paradoxed = eterPoints.pow(paradox ? 2 : 1).mul(paradox ? "1e2250" : 1);

    const baseTDs = paradoxed.div(this.baseCost).log(this.costMultiplier);
    // If you're less than it, the scaling doesn't kick in, so you can buy to it
    // before it kicks in
    if (baseTDs <= this.e6000ScalingAmount && this._tier > 4) return baseTDs;

    const costMultIncreases = [1, 1.5, 2.2];
    const idx = this._costIncreaseThresholds.findIndex((i) => eterPoints.lt(i));
    if (idx !== -1) return eterPoints.div(this.baseCost).log(this.costMultiplier * costMultIncreases[idx]) + 1;

    const base = this.costMultiplier * (this._tier <= 4 ? 2.2 : 1);
    const TDScale = TimeDimensions.scalingPast1e6000;
    return (paradoxed.div(this.baseCost).log(base) + this.e6000ScalingAmount * (TDScale - 1)) / TDScale + 1;
  }

  // We handle exceptions here just because it's easier to do so
  get continuumValue() {
    if (RealityUpgrade(13).isLockingMechanics && this._tier > 4) return 0;
    // TODO: better handling of IM upgrade 15?
    if (ImaginaryUpgrade(15).isLockingMechanics && EternityChallenge(7).completions > 0) return 0;
    let val = this.continuumBaseValue * TimeDimensions.extraPurchases;
    if (Enslaved.isRunning && val > 1) val = 1;
    return val;
  }

  get continuumAmount() {
    if (!TimeDimensions.continuumActive) return 0;
    return Math.floor(this.continuumValue);
  }

  get totalAmount() {
    return this.amount.max(this.continuumAmount);
  }

  get multiplier() {
    const tier = this._tier;

    if (EternityChallenge(11).isRunning) return DC.D1;
    let mult =
      GameCache.timeDimensionCommonMultiplier.value.log10() +
      Effects.log10Sum(
        tier === 1 ? TimeStudy(11) : null,
        tier === 3 ? TimeStudy(73) : null,
        tier === 4 ? TimeStudy(227) : null,
      );

    const dim = TimeDimension(tier);
    const realBought = TimeDimensions.continuumActive ? dim.continuumValue : dim.bought;
    const bought = tier === 8 ? Math.clampMax(realBought, 1e8) : realBought;
    mult += bought * dim.powerMultiplier.log10();

    mult *= getAdjustedGlyphEffect("timepow");
    mult *= getAdjustedGlyphEffect("effarigdimensions");
    mult *= getAdjustedGlyphEffect("curseddimensions");
    mult *= Effects.product(AlchemyResource.time);
    mult *= Ra.momentumValue;
    mult *= ImaginaryUpgrade(11).effectOrDefault(1);
    mult *= PelleRifts.paradox.effectValue.toNumber();

    if (player.dilation.active || PelleStrikes.dilation.hasStrike) {
      mult = dilatedValueOf(powAndCap(mult)).log10();
    }

    if (Effarig.isRunning) {
      mult = Effarig.multiplier(powAndCap(mult)).log10();
    } else if (V.isRunning) {
      mult *= 0.5;
    }

    return powAndCap(mult);
  }

  get productionPerSecond() {
    if (
      EternityChallenge(1).isRunning ||
      EternityChallenge(10).isRunning ||
      (Laitela.isRunning && this.tier > Laitela.maxAllowedDimension)
    ) {
      return DC.D0;
    }
    if (EternityChallenge(11).isRunning) {
      return this.totalAmount;
    }
    let production = this.totalAmount.log10() + this.multiplier.log10();
    if (EternityChallenge(7).isRunning) {
      production += Tickspeed.perSecond.log10();
    }
    if (this._tier === 1 && !EternityChallenge(7).isRunning) {
      production *= getAdjustedGlyphEffect("timeshardpow");
    }
    return powAndCap(production);
  }

  get rateOfChange() {
    const tier = this._tier;
    if (tier === 8) {
      return DC.D0;
    }
    const toGain = TimeDimension(tier + 1).productionPerSecond;
    const current = Decimal.max(this.amount, 1);
    return toGain.times(10).dividedBy(current).times(getGameSpeedupForDisplay());
  }

  get isProducing() {
    const tier = this.tier;
    if (
      EternityChallenge(1).isRunning ||
      EternityChallenge(10).isRunning ||
      (Laitela.isRunning && tier > Laitela.maxAllowedDimension)
    ) {
      return false;
    }
    return this.totalAmount.gt(0);
  }

  get baseCost() {
    return this._baseCost;
  }

  get costMultiplier() {
    return this._costMultiplier;
  }

  get powerMultiplier() {
    return DC.D4.timesEffectsOf(this._tier === 8 ? GlyphSacrifice.time : null).pow(
      ImaginaryUpgrade(14).effectOrDefault(1),
    );
  }

  get e6000ScalingAmount() {
    return this._e6000ScalingAmount;
  }

  get costIncreaseThresholds() {
    return this._costIncreaseThresholds;
  }

  get requirementReached() {
    return (
      this._tier < 5 ||
      (TimeStudy.timeDimension(this._tier).isAffordable && TimeStudy.timeDimension(this._tier - 1).isBought)
    );
  }

  tryUnlock() {
    if (this.isUnlocked) return;
    TimeStudy.timeDimension(this._tier).purchase();
  }
}

/**
 * @function
 * @param {number} tier
 * @return {TimeDimensionState}
 */
export const TimeDimension = TimeDimensionState.createAccessor();

export const TimeDimensions = {
  /**
   * @type {TimeDimensionState[]}
   */
  all: TimeDimension.index.compact(),

  get scalingPast1e6000() {
    return 4;
  },

  tick(diff) {
    for (let tier = 8; tier > 1; tier--) {
      TimeDimension(tier).produceDimensions(TimeDimension(tier - 1), diff.div(10));
    }

    if (EternityChallenge(7).isRunning) {
      TimeDimension(1).produceDimensions(InfinityDimension(8), diff);
    } else {
      TimeDimension(1).produceCurrency(Currency.timeShards, diff);
    }

    EternityChallenge(7).reward.applyEffect((production) => {
      InfinityDimension(8).amount = InfinityDimension(8).totalAmount.plus(production.times(diff.div(1000)));
    });
  },

  get continuumUnlocked() {
    return AtomUpgrade(4).isBought && Laitela.continuumUnlocked;
  },

  get continuumActive() {
    return this.continuumUnlocked && !player.auto.continuumDisabled.TD;
  },

  setContinuum(value) {
    player.auto.continuumDisabled.TD = !value;
  },

  get extraPurchases() {
    return AtomicParticle(0).effects[0] * Effects.product(AtomUpgrade(4));
  },
};

export function tryUnlockTimeDimensions() {
  if (TimeDimension(8).isUnlocked) return;
  for (let tier = 5; tier <= 8; ++tier) {
    if (TimeDimension(tier).isUnlocked) continue;
    TimeDimension(tier).tryUnlock();
  }
}
