<script>
export default {
  name: "GameSpeedDisplay",
  props: {},
  data() {
    return {
      baseSpeed: 0,
      pulsedSpeed: new Decimal(0),
      hasSeenAlteredSpeed: false,
      isStopped: false,
      isEC12: false,
      isPulsing: false,
      hasSeenRealAlteredSpeed: false,
      enslavedDischargeMode: 0,
      enslavedDischargeActive: false,
      enslavedSettingValue: 1,
      realTimeStored: 0,
    };
  },
  computed: {
    baseSpeedText() {
      if (this.isStopped) {
        return "Stopped (storing real time)";
      }
      const speed = this.formatNumber(this.baseSpeed);
      if (this.isEC12) {
        return `${speed} (fixed)`;
      }
      return `${speed}`;
    },
    pulseSpeedText() {
      return `${this.formatNumber(this.pulsedSpeed)}`;
    },
    baseText() {
      if (!this.hasSeenAlteredSpeed) return null;
      return this.baseSpeed.eq(1) && !this.isStopped
        ? "The game is running at normal speed."
        : `Game speed is altered: ${this.baseSpeedText}`;
    },
    realSpeedAlteration() {
      if (!this.enslavedDischargeActive) return 1;
      return (
        1 +
        (this.enslavedDischargeMode
          ? (this.realTimeStored * this.enslavedSettingValue) / 100
          : this.enslavedSettingValue * 1000) /
          1000
      );
    },
    baseRealText() {
      if (!this.hasSeenRealAlteredSpeed) return null;
      if (this.isStopped) {
        return "Real-time speed is halted (storing real time).";
      }
      if (this.enslavedDischargeActive && this.realSpeedAlteration !== 1) {
        return `Real-time speed is altered: ${this.formatNumber(new Decimal(this.realSpeedAlteration))}`;
      }
      return "Real-time speed is unaffected.";
    },
  },
  methods: {
    update() {
      this.baseSpeed = getGameSpeedupFactor();
      this.pulsedSpeed = getGameSpeedupForDisplay();
      this.hasSeenAlteredSpeed = PlayerProgress.seenAlteredSpeed();
      this.hasSeenRealAlteredSpeed = PlayerProgress.seenRealAlteredSpeed();
      this.isStopped = Enslaved.isStoringRealTime;
      this.isEC12 = EternityChallenge(12).isRunning;
      this.isPulsing = this.baseSpeed.neq(this.pulsedSpeed) && Enslaved.canRelease(true);
      this.enslavedDischargeMode = Enslaved.realTimeDischargeMode;
      this.enslavedDischargeActive = Enslaved.realDischargeActive;
      this.enslavedSettingValue = this.enslavedDischargeMode
        ? player.celestials.enslaved.realDischargePercent
        : player.celestials.enslaved.realDischargeConstant;
      this.realTimeStored = player.celestials.enslaved.storedReal;
    },
    formatNumber(num) {
      if (num.gte(0.001) && num.lt(10000) && num.neq(1)) {
        return format(num, 3, 3);
      }
      if (num.lt(0.001)) {
        return `${formatInt(1)} / ${format(num.recip(), 2)}`;
      }
      return `${format(num, 2)}`;
    },
  },
};
</script>

<template>
  <span class="c-gamespeed">
    <span>
      {{ baseText }}
    </span>
    <span v-if="isPulsing">(<i class="fas fa-expand-arrows-alt u-fa-padding" /> {{ pulseSpeedText }})</span>
    <span v-if="hasSeenRealAlteredSpeed">
      <br />
      {{ baseRealText }}
    </span>
  </span>
</template>

<style scoped>
.c-gamespeed {
  font-weight: bold;
  color: var(--color-text);
}
</style>
