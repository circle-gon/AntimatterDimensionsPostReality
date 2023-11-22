<script>
import AtomicParticle from "./AtomicParticle";

export default {
  name: "AtomicPower",
  components: {
    AtomicParticle,
  },
  data() {
    return {
      atomicPower: new Decimal(0),
      atomicPowerGain: new Decimal(0),
    };
  },
  computed: {
    stateCount: () => GameDatabase.atom.power.length,
  },
  methods: {
    update() {
      this.atomicPower.copyFrom(player.atom.atomicPower);
      this.atomicPowerGain.copyFrom(AtomicPower.gain);
    },
  },
};
</script>

<template>
  <div>
    <div>
      You have <span class="c-atomic-tab__big-numbers">{{ format(atomicPower, 2, 2) }}</span> Atomic Power.
      <span class="c-atomic-tab__big-numbers">+{{ format(atomicPowerGain, 2, 2) }}/s</span>
    </div>
    <div>Atomic Power gain can be increased by gaining more Atoms and doing more Collapses.</div>
    <div>
      Note: Atomic Power gain depends on your total Atoms, not the Atoms you have currently, and Atomic Power gain is
      unaffected by storing real time.
    </div>
    <div>Each type of subatomic particle gives boosts to various things.</div>
    <br>
    <div class="c-atomic-tab__particle-seperator">
      <AtomicParticle
        v-for="i in stateCount"
        :key="i"
        :particle-num="i - 1"
      />
    </div>
  </div>
</template>
