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
      props.initialCost * props.costMult
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
    inverted), ${formatX(10)} Reality Machine gain, ${formatX(5)} Perk Point gain, 
    ${formatX(10)} Relic Shard gain, ${formatX(10)} Memory gain, 
    ${formatX(10)} Dark Matter and Dark Energy gain, 
    ${formatX(5)} Singularity gain, and ${formatX(100)} Reality Shard gain.`,
  },
  {
    id: 3,
    name: "Knowledge Empowerment",
    cost: 5,
    description: "Memory gain is raised ^1.5.",
    effect: 1.5,
  },
  {
    id: 4,
    name: "Overachiever",
    cost: 5,
    description: "Each V-Achievement awards 2 Space Theorems instead of 1.",
    effect: 2,
  },
  {
    id: 5,
    name: "Death to Continuum",
    cost: 20,
    description: `Unlock Infinity and Time Dimension Continuum, which is unlocked when
    Antimatter Dimension Continuum is unlocked. Start Collapses with AD Continuum unlocked.`,
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
    name: "Doomed Transcendence",
    cost: 100,
    description: `Dilation upgrades previously only available in a Doomed Reality
    are now purchasable outside of it, but they scale faster
    and some upgrades are weakened. The DU2 and DAU Perks now adjust to account for the
    new Dilation upgrades.`,
  },
  {
    id: 8,
    name: "Keeper of Achievements",
    cost: 200,
    description:
      "Upon purchasing this upgrade or Collapsing, start with all Doom achievements (except for 188) unlocked.",
  },
  {
    id: 9,
    name: "Hoarder of Glyphs",
    cost: 500,
    description: "Unlock one more glyph slot.",
    effect: 1,
  },
  {
    id: 10,
    name: "Antimatter Limitus",
    cost: 2000,
    description: "Unlock the ability to Break the Universe.",
  },
];
