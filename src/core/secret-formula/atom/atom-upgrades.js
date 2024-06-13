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
    const val = props.id === 6 ? formatPercents(effect) : formatInt(effect);
    return props.textTemplate.replace("{value}", val);
  };
  props.formatCost = (value) => format(value, 2, 0);
  return props;
};

export const atomUpgrades = [
  rebuyable({
    id: 1,
    name: "Atomic Charge",
    initialCost: 5,
    costMult: 5,
    textTemplate: "Multiply Atomic Power gain by {value}.",
    effect: 3,
    formatEffect: (e) => formatX(e, 2, 0),
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
    cost: 5,
    description: "Memory gain is raised ^1.5 and each V-Achievement awards 1.5 Space Theorems instead of 1.",
  },
  {
    id: 4,
    name: "Death to Continuum",
    cost: Infinity,
    description:
      "Unlock Infinity and Time Dimension Continuum, which is unlocked when Antimatter Dimension Continuum is unlocked. Start Collapses with AD Continuum unlocked.",
  },
  {
    id: 5,
    name: "Doomed Transcendence",
    cost: Infinity,
    description: `Dilation upgrades previously only available in a Doomed Reality
    are now purchasable outside of it, but they scale faster
    and some upgrades are weakened. The DU2 and DAU Perks now adjust to account for the
    new Dilation upgrades.`,
  },
  rebuyable({
    id: 6,
    name: "Atomic Empowerment",
    initialCost: 10,
    costMult: 5,
    textTemplate: "Make Atomic Particles' effects {value} stronger (additively).",
    effect: 0.05,
    formatEffect: (e) => `${formatPercents(e - 1)} stronger`,
    effectAdditive: true,
  }),
  {
    id: 7,
    name: "Keeper of Achievements",
    cost: Infinity,
    description: "Upon purchasing this upgrade or Collapsing, start with all Doom achievements unlocked.",
  },
  {
    id: 8,
    name: "Celestial Automation",
    cost: Infinity,
    description: `Teresa's best AM gets set as if you reached the square root of your total antimatter in Teresa's Reality.
    Gain 100% of your gained Annihilation multiplier and Singularities (based on your Dark Energy) per real-time second.`,
  },
  {
    id: 9,
    name: "Hoarder of Glyphs",
    cost: Infinity,
    description: "Unlock one more glyph slot.",
    effect: 1,
  },
  {
    id: 10,
    name: "Antimatter Limitus",
    cost: Infinity,
    description: "Unlock the ability to Break the Universe.",
  },
];
