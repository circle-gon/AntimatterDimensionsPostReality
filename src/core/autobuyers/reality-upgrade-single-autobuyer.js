import { AutobuyerState } from "./autobuyer";

export class NonRepeatableRealityUpgradeAutobuyerState extends AutobuyerState {
  get data() {
    return player.auto.realityUpgradesSingles;
  }

  get name() {
    return `Non-repeatable Reality Upgrade Autobuyer`;
  }

  get isUnlocked() {
    return AtomMilestone.am8.isReached;
  }

  get bulk() {
    return 0;
  }

  tick() {
    for (let i = 6; i <= 25; i++) {
      RealityUpgrade(i).purchase()
    }
  }
}