import { AutobuyerState } from "./autobuyer";

export class SingularityAutobuyerState extends AutobuyerState {
  get data() {
    return player.auto.singularity;
  }

  get name() {
    return `Singularity`;
  }

  get isUnlocked() {
    return SingularityMilestone.autoCondense.canBeApplied || AtomMilestone.am3.isReached;
  }

  get bulk() {
    return Singularity.singularitiesGained;
  }

  tick() {
    if (
      !AtomUpgrade(8).isBought &&
      Currency.darkEnergy.value.gte(Singularity.cap.mul(SingularityMilestone.autoCondense.effectValue))
    ) {
      Singularity.perform();
    }
  }
}
