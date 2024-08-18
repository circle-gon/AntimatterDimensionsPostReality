<script>
import AtomMilestoneButton from "./AtomMilestoneButton";

export default {
  name: "AtomMilestones",
  components: {
    AtomMilestoneButton,
  },
  data() {
    return {
      fastestCollapse: TimeSpan.zero,
      timeSpent: TimeSpan.zero,
    };
  },
  computed: {
    milestones() {
      return Object.values(GameDatabase.atom.milestones)
        .map((config) => new AtomMilestoneState(config));
    },
    rows() {
      return this.milestones.length;
    },
  },
  methods: {
    update() {
      this.fastestCollapse.setFrom(player.records.bestCollapse.realTimeNoStore);
      this.timeSpent.setFrom(player.records.thisCollapse.realTimeNoStore);
    },
    getMilestone(row) {
      return () => this.milestones[row - 1];
    },
  },
};
</script>

<template>
  <div class="l-atom-milestone-grid">
    <div>
      Your fastest Collapse is {{ fastestCollapse.toStringShort() }}, and you have currently spent
      {{ timeSpent.toStringShort() }} in this Collapse. These stats and milestones don't include time spent storing.
    </div>
    <div>Collapse more than the count listed, or collapse faster than the times listed to unlock milestones!</div>
    <div v-for="row in rows" :key="row" class="l-atom-milestone-grid__row">
      <AtomMilestoneButton :key="row" :get-milestone="getMilestone(row)" class="l-atom-milestone-grid__cell" />
    </div>
  </div>
</template>

<style scoped></style>
