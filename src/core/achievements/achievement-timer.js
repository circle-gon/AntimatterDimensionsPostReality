import { DC } from "../constants"

class AchievementTimer {
  constructor(isRealTime) {
    this.time = isRealTime ? 0 : DC.D0;
    this.realTime = isRealTime;
  }

  reset() {
    this.time = this.realTime ? 0 : DC.D0;
  }

  advance() {
    const addedTime = this.realTime
      ? Time.unscaledDeltaTime.totalSeconds
      : Time.deltaTime;
    if (this.realTime) {
      this.time += addedTime
    } else {
      this.time = this.time.add(addedTime)
    };
  }

  check(condition, duration) {
    if (!condition) {
      this.reset();
      return false;
    }
    this.advance();
    if (this.realTime) {
      return this.time >= duration;
    } else {
      return this.time.gte(duration);
    }
  }
}

export const AchievementTimers = {
  marathon1: new AchievementTimer(false),
  marathon2: new AchievementTimer(false),
  pain: new AchievementTimer(true),
  stats: new AchievementTimer(true)
};
