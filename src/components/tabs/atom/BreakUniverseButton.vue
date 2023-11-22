<script>
// Import { PlayerProgress } from '../../../core/player-progress';

export default {
  name: "BreakUniverseButton",
  data() {
    return {
      isBroken: false,
      isUnlocked: false,
    };
  },
  computed: {
    classObject() {
      return {
        "o-atom-upgrade-btn": true,
        "o-atom-upgrade-btn--color-2": true,
        "o-atom-upgrade-btn--available": this.isUnlocked,
        "o-atom-upgrade-btn--unavailable": !this.isUnlocked,
        "o-atom-upgrade-btn--unclickable": this.isBroken,
      };
    },
    text() {
      return this.isBroken ? "UNIVERSE IS BROKEN" : "BREAK THE UNIVERSE";
    },
  },
  methods: {
    update() {
      this.isBroken = player.atom.broken;
      this.isUnlocked = true;
    },
    clicked() {
      if (!this.isBroken && this.isUnlocked) Modal.breakUniverse.show();
    },
  },
};
</script>

<template>
  <button
    :class="classObject"
    @click="clicked"
  >
    {{ text }}
  </button>
</template>

<style scoped></style>
