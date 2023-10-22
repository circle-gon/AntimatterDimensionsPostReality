<script>
export default {
  name: "CollapseButton",
  data() {
    return {
      isVisible: true,
      canCollapse: false,
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
    },
    collapse() {
      collapseResetRequest();
    },
  },
};
</script>
<template>
  <div>
    <button 
      :class="buttonClassObject"
      @click="collapse" 
      class="c-collapse-button"
    >Collapse this Universe</button>
  </div>
</template>
