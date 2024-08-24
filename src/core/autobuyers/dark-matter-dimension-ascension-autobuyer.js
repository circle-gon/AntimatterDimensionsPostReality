import { IntervaledAutobuyerState } from "./autobuyer";

export class DarkMatterDimensionAscensionAutobuyerState extends IntervaledAutobuyerState {
  get data() {
    return player.auto.ascension;
  }

  get name() {
    return `Dark Matter Dimension Ascension`;
  }

  get isUnlocked() {
    return SingularityMilestone.ascensionAutobuyers.canBeApplied || AtomMilestone.am3.isReached;
  }

  get interval() {
    return 1000 * SingularityMilestone.darkAutobuyerSpeed.effectValue;
  }

  get hasUnlimitedBulk() {
    return true;
  }

  tick() {
    super.tick();
    for (let i = 1; i <= SingularityMilestone.ascensionAutobuyers.effectValue; i++) {
      DarkMatterDimension(i).bulkAscend();
    }
  }
}
