<script>
import BreakUniverseButton from "./BreakUniverseButton";

export default {
  name: "BreakUniverse",
  components: {
    BreakUniverseButton,
  },
  data() {
    return {
      broken: false
    }
  },
  methods: {
    update() {
      this.broken = player.atom.broken
    }
  }
};
</script>

<template>
  <div class="l-break-universe-tab">
    <div v-if="!broken">
      Breaking the Universe requires all single-purchase Atom Upgrades to be bought, and all Atom Milestones to be completed.
    </div>
    <BreakUniverseButton class="l-break-universe-tab__break-btn" />
  </div>
</template>

<style scoped></style>
