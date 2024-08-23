<script>
export default {
  name: "AtomMilestoneButton",
  props: {
    getMilestone: {
      type: Function,
      required: true,
    },
  },
  data() {
    return {
      isReached: false,
    };
  },
  computed: {
    milestone() {
      return this.getMilestone();
    },
    config() {
      return this.milestone.config;
    },
    time() {
      return this.config.time;
    },
    requirement() {
      const time = this.time;
      if (time < 1000) return `${format(time)} ${pluralize("Collapse", time)}`;
      return timeDisplay(time);
    },
    canBeReached() {
      return player.records.thisCollapse.realTimeNoStore < this.time;
    },
    reward() {
      const reward = this.config.reward;
      return typeof reward === "function" ? reward() : reward;
    },
    rewardClassObject() {
      return {
        "o-atom-milestone__reward": true,
        "o-atom-milestone__reward--impossible": !this.isReached && !this.canBeReached,
        "o-atom-milestone__reward--possible": !this.isReached && this.canBeReached,
        "o-atom-milestone__reward--reached": this.isReached,
        "o-atom-milestone__reward--small-font": this.reward.length > 80,
      };
    },
    tooltip() {
      return this.config.tooltip ? this.config.tooltip() : null;
    },
  },
  methods: {
    update() {
      this.isReached = this.milestone.isReached;
    },
  },
};
</script>

<template>
  <div class="l-atom-milestone">
    <span class="o-atom-milestone__goal"> {{ requirement }}: </span>
    <button v-tooltip="tooltip" :class="rewardClassObject">
      <span>
        {{ reward }}
      </span>
    </button>
  </div>
</template>

<style scoped></style>
