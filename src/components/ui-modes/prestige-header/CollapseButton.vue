<script>
export default {
  name: "CollapseButton",
  data() {
    return {
      isVisible: true,
      canCollapse: false,
      shouldShow: false,
    };
  },
  computed: {
    buttonClassObject() {
      return {
        "o-collapse-button": true,
        "o-collapse-button--unavailable": !this.canCollapse,
      };
    },
  },
  methods: {
    update() {
      this.canCollapse = Player.canCollapse;
      this.shouldShow = PlayerProgress.atomUnlocked() || player.isGameEnd;
    },
    collapse() {
      collapseResetRequest();
    },
  },
};
</script>

<template>
  <div v-if="shouldShow">
    <button :class="buttonClassObject" class="c-collapse-button" @click="collapse">Collapse this Universe</button>
  </div>
</template>
