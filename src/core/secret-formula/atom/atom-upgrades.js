import { DC } from "../../constants";

const rebuyable = (props) => {
  props.cost = () =>
    getHybridCostScaling(
      player.atom.rebuyables[props.id],
      1e30,
      props.initialCost,
      props.costMult,
      props.costMult / 10,
      DC.E309,
      1e3,
      props.initialCost * props.costMult,
    );
  const { effect, effectAdditive = false } = props;
  props.effect = () => {
    if (effectAdditive) {
      return 1 + effect * player.atom.rebuyables[props.id];
    }
    return Math.pow(effect, player.atom.rebuyables[props.id]);
  };
  props.description = () => {
    const val = props.id === 6 ? format(effect, 2, 3) : formatInt(effect);
    return props.textTemplate.replace("{value}", val);
  };
  props.formatCost = (value) => format(value, 2, 0);
  return props;
};

function scale(base) {
  const costFunc = () => {
    const count = AtomUpgrades.all.filter(i => ![2, 10].includes(i.id)).countWhere(i => i.isBought)
    const costScale = 5 + 2 * count
    return Math.ceil(base * costScale ** count)
  }
  costFunc.base = base
  return costFunc
}

export const atomUpgrades = [
  /*rebuyable({
    id: 1,
    name: "Atomic Charge",
    initialCost: 5,
    costMult: 5,
    textTemplate: "Multiply Atomic Power gain by {value}.",
    effect: 3,
    formatEffect: (e) => formatX(e, 2, 0),
  }),*/
  rebuyable({
    id: 1,
    name: "Atom Power",
    initialCost: 2,
    costMult: 4,
    textTemplate: "Multiply Atom gain by {value}.",
    effect: 2,
    formatEffect: e => formatX(e, 2, 0)
  }),
  {
    id: 2,
    name: "Starter Pack",
    cost: 1,
    description: () => `${formatX(1000)} gamespeed (doesn't apply when black holes are 
    paused), ${formatX(10)} Reality Machine gain, ${formatX(5)} Perk Point gain, 
    ${formatX(10)} Relic Shard gain, ${formatX(10)} Memory gain, 
    ${formatX(10)} Dark Matter and Dark Energy gain, 
    ${formatX(5)} Singularity gain, and ${formatX(100)} Reality Shard gain.`,
  },
  {
    id: 3,
    name: "Celestial Power",
    cost: scale(5),
    description: "Memory gain is raised ^1.5 and each V-Achievement gives 1.5 Space Theorems instead of 1.",
  },
  {
    id: 4,
    name: "Total Continuum",
    cost: scale(30),
    description:
      "Unlock ID and TD Continuum, which are unlocked when AD Continuum is unlocked, and all Continuum types get 5% more purchases. Start Collapses with Continuum unlocked.",
    effect: 1.05
  },
  {
    id: 5,
    name: "Doomed Transcendence",
    cost: scale(200),
    description: `Dilation upgrades previously only available in a Doomed Reality
    are now purchasable outside of it, but they scale faster
    and are weakened. The DU2 Perk now also gives the new Dilation upgrades.`,
  },
  /*rebuyable({
    id: 6,
    name: "Atomic Empowerment",
    initialCost: 10,
    costMult: 5,
    textTemplate: "Make Atomic Particles' effects {value} stronger (additively).",
    effect: 0.05,
    formatEffect: (e) => `${formatPercents(e - 1)} stronger`,
    effectAdditive: true,
  }),*/
  rebuyable({
    id: 6,
    name: "Atom Exponent",
    initialCost: 4,
    costMult: 3,
    textTemplate: "^+{value} to AM, IP, and EP (additive)",
    effect: 0.005,
    formatEffect: (e) => `${format(e, 2, 3)}`,
    effectAdditive: true,
  }),
  {
    id: 7,
    name: "Keeper of Achievements",
    cost: scale(5e3),
    description: "Upon purchasing this upgrade or Collapsing, start with all Doom achievements unlocked.",
  },
  {
    id: 8,
    name: "Celestial Automation",
    cost: scale(2.5e4),
    description: `Teresa's best AM is set to the square root of your total antimatter.
    Gain 100% of your gained Annihilation multiplier and Singularities per real-time second.`,
  },
  {
    id: 9,
    name: "Hoarder of Glyphs",
    cost: scale(1e5),
    description: "Unlock one more glyph slot.",
    effect: 1,
  },
  {
    id: 10,
    name: "Antimatter Limitus",
    cost: 2e6,
    description: "Unlock the ability to Break the Universe.",
  },
];
