<script>
export default {
  name: "AtomicParticle",
  props: {
    particleNum: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      amount: new Decimal(0),
      descriptions: [],
      atomicPower: new Decimal(0),
    };
  },
  computed: {
    particleData() {
      return AtomicParticle(this.particleNum);
    },
    style() {
      return {
        color: this.particleData.color,
      };
    },
    conversionStyle() {
      return {
        "background-color": this.atomicPower.gt(0) ? "var(--color-good)" : "var(--color-disabled)",
      };
    },
    emphText() {
      const descs = [];
      for (const desc of this.descriptions) {
        descs.push(desc.split("|"));
      }
      return descs;
    },
  },
  methods: {
    update() {
      this.amount.copyFrom(this.particleData.amount);
      this.descriptions = this.particleData.effectDescriptions;
      this.atomicPower.copyFrom(player.atom.atomicPower);
    },
    convert() {
      AtomicPower.use(this.particleNum);
    },
  },
};
</script>
<template>
  <div class="c-atomic-tab__particle">
    <div class="c-atomic-tab__big-numbers" :style="style">
      {{ format(amount, 2) }} {{ pluralize(particleData.name, amount) }}
    </div>
    <div>
      <button class="c-atomic-convert" :style="conversionStyle" @click="convert">
        Convert all Atomic Power into {{ particleData.name + "s" }}
      </button>
    </div>
    <div v-for="description in emphText" class="c-atomic-tab__effect-enlarger">
      {{ description[0] }}<span class="c-atomic-tab__big-numbers" :style="style">{{ description[1] }}</span
      >{{ description[2] }}
    </div>
  </div>
</template>
