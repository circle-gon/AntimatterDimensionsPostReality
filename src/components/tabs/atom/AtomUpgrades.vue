<script>
import AtomUpgradeButton from "./AtomUpgradeButton";

export default {
  name: "AtomUpgrades",
  components: {
    AtomUpgradeButton,
  },
  data() {
    return {
      atoms: new Decimal(0),
    };
  },
  computed: {
    upgrades: () => AtomUpgrades.all,
    possibleTooltip: () => `Checkered upgrades are impossible to unlock this Collapse. Striped upgrades are
      still possible.`,
    lockTooltip: () => `This will only function if you have not already failed the condition or
      unlocked the upgrade.`,
  },
  methods: {
    id(row, column) {
      return (row - 1) * 5 + column - 1;
    },
    update() {
      this.atoms.copyFrom(Currency.atoms);
    },
  },
};
</script>

<template>
  <div class="l-atom-upgrade-grid">
    <div class="c-atom-point-desc c-atom-point-desc-enlarge">
      You have <span class="c-atom-points c-atom-amount-accent">{{ format(atoms, 2) }}</span> {{ pluralize("Atom", atoms) }}.
    </div><br />
    <div class="c-atom-upgrade-infotext">This section works similarly to Reality Upgrades.</div>
    <div v-for="row in 1" :key="row" class="l-atom-upgrade-grid__row">
      <AtomUpgradeButton v-for="column in 1" :key="id(row, column)" :upgrade="upgrades[id(row, column)]" />
    </div>
  </div>
</template>

<style scoped>
.c-atom-upgrade-infotext {
  color: var(--color-text);
  margin: -1rem 0 1.5rem;
}
.c-atom-amount-accent {
  font-size: 2rem;
}
.c-atom-point-desc-enlarge {
  font-size: 1.5rem;
}
</style>
