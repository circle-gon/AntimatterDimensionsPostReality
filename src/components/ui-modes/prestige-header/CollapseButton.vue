<script>
export default {
  name: "CollapseButton",
  data() {
    return {
      isVisible: true,
    };
  },
  methods: {
    collapse() {
      collapseResetRequest();
    },
  },
};
</script>
<template>
  <div>
    <button @click="collapse">Collapse this Universe</button>
  </div>
</template>
