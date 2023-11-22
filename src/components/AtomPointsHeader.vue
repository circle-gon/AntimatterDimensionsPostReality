<script>
export default {
  name: "AtomPointsHeader",
  data() {
    return {
      atoms: new Decimal(),
      isVisible: false
    };
  },
  methods: {
    update() {
      this.atoms.copyFrom(Currency.atoms);
      this.isVisible = PlayerProgress.atomUnlocked();
    }
  }
};
</script>

<template>
  <div
    v-if="isVisible"
    class="c-atom-point-desc"
  >
    You have
    <span class="c-atom-points">{{ formatInt(atoms) }}</span>
    {{ pluralize("Atom", atoms) }}.
  </div>
</template>

<style scoped>
</style>