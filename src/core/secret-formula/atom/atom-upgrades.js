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
    initialCost: 10,
    costMult: 10,
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
    name: "Doomed Transcendence",
    cost: Infinity,
    description: `Dilation upgrades previously only available in a Doomed Reality
    are now purchasable outside of it (with rebuyable autobuyers unlocked), but they scale faster
    and some upgrades are weakened. The DU2 Perk now also unlocks the 2 one-time Pelle Dilation upgrades 
    as well.`,
  },
  {
    id: 4,
    name: "Knowledge Empowerment",
    cost: Infinity,
    description: "Memory gain is raised ^1.5.",
  },
  {
    id: 5,
    name: "Overachiever",
    cost: Infinity,
    description: "Each V-Achievement awards 2 Space Theorems instead of 1.",
  },
  rebuyable({
    id: 6,
    name: "Atomic Empowerment",
    initialCost: 10,
    costMult: 50,
    textTemplate: "Make Atomic Particles' effects {value} stronger (additively).",
    effect: 0.05,
    formatEffect: (e) => `${formatPercents(e - 1)} stronger`,
    effectAdditive: true
  }),
  {
    id: 7,
    name: "Keeper of Achievements",
    cost: Infinity,
    description: "Start Collapses with all Doom achievements (except for 188) unlocked.",
  },
  {
    id: 8,
    name: "Death to Continuum [TBD]",
    cost: Infinity,
    description: `Unlock Infinity and Time Dimension Continuum, which is unlocked when
    Antimatter Dimension Continuum is unlocked. Start Collapses with AD Continuum unlocked.`,
  },
  {
    id: 9,
    name: "Hoarder of Glyphs [TBD]",
    cost: Infinity,
    description: "Unlock two more glyph slots. You can now equip 2 Reality and Effarig glyphs.",
  },
  {
    id: 10,
    name: "Antimatter Limitus",
    cost: Infinity,
    description: "Unlock the ability to Break the Universe.",
  },
];
