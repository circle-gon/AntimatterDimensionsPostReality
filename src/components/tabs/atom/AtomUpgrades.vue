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
      canRespec: false,
    };
  },
  computed: {
    upgrades: () => AtomUpgrades.all,
    possibleTooltip: () => `Checkered upgrades are impossible to unlock this Collapse. Striped upgrades are
      still possible.`,
    lockTooltip: () => `This will only function if you have not already failed the condition or
      unlocked the upgrade.`,
    upgradesPerRow: () => 5,
    upgradeRows() {
      return Math.ceil(this.upgrades.length / this.upgradesPerRow);
    },
  },
  methods: {
    id(row, column) {
      return (row - 1) * this.upgradesPerRow + column - 1;
    },
    update() {
      this.atoms.copyFrom(Currency.atoms);
      // The first and last don't need to be checked because they don't increase the cost
      this.canRespec = AtomUpgrades.all.filter((i) => ![2, 10].includes(i.id)).countWhere((i) => i.isBought) < 6;
    },
    respec() {
      respecAtomUpgradesRequest();
    },
  },
};
</script>

<template>
  <div class="l-atom-upgrade-grid">
    <div class="c-atom-point-desc c-atom-point-desc-enlarge">
      You have <span class="c-atom-points c-atom-amount-accent">{{ format(atoms, 2) }}</span>
      {{ pluralize("Atom", atoms) }}.
    </div>
    <br />
    <div class="c-atom-upgrade-infotext">
      The two upgrades on the left may be purchased endlessly for increasing costs, and the rest are single-purchase.<br />
      All single-purchase upgrades, when bought, will increase the cost of all other single-purchase upgrades.<br />
      The first and last single-purchase upgrades do not increase costs and are unaffected by any cost increases.<br />
      Upgrades may be respecced at any time, refunding all Atoms spent on them, but it will force an Atom reset.
      <button @click="respec" class="l-atom-upgrade-btn c-atom-upgrade-btn l-atom-upgrade-respec">
        Respec Atom Upgrades
      </button>
    </div>
    <div v-for="row in upgradeRows" :key="row" class="l-atom-upgrade-grid__row">
      <AtomUpgradeButton v-for="column in upgradesPerRow" :key="id(row, column)" :upgrade="upgrades[id(row, column)]" />
    </div>
  </div>
</template>

<style scoped>
.c-atom-upgrade-infotext {
  display: flex;
  flex-direction: column;
  align-items: center;
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
