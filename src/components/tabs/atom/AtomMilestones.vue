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
        .sort((a, b) => b.time - a.time)
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
      {{ timeSpent.toStringShort() }} in this Collapse. Note: these stats and milestones disregard time spent storing.
    </div>
    <div>Collapse faster than the times listed to unlock milestones!</div>
    <div v-for="row in rows" :key="row" class="l-atom-milestone-grid__row">
      <AtomMilestoneButton :key="row" :get-milestone="getMilestone(row)" class="l-atom-milestone-grid__cell" />
    </div>
  </div>
</template>

<style scoped></style>
