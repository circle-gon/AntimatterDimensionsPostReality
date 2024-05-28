import { AutobuyerState } from "./autobuyer";

export class TimeTheoremAutobuyerState extends AutobuyerState {
  get data() {
    return player.auto.timeTheorems;
  }

  get name() {
    return `Time Theorem`;
  }

  get isUnlocked() {
    return (Pelle.isDoomed && AtomMilestone.am7.isReached) || (Perk.ttBuySingle.isBought && !Pelle.isDisabled("timeTheoremAutobuyer"));
  }

  get hasUnlimitedBulk() {
    return (Pelle.isDoomed && AtomMilestone.am7.isReached) || Perk.ttBuyMax.canBeApplied;
  }

  tick() {
    if (this.hasUnlimitedBulk) TimeTheorems.buyMax(true);
    else TimeTheorems.buyOneOfEach();
  }
}
