export const atomUpgrades = [
  {
    id: 1,
    name: "Starter Pack",
    cost: 1,
    description: () => `${formatX(1000, 0)} gamespeed (doesn't apply when black holes are 
    inverted), ${formatX(10, 0)} Reality Machine gain, ${formatX(5, 0)} Perk Point gain, 
    ${formatX(10, 0)} Relic Shard gain, ${formatX(10, 0)} Memory gain, 
    ${formatX(10, 0)} Dark Matter and Dark Energy gain, 
    ${formatX(5, 0)} Singularity gain, and ${formatX(100, 0)} Reality Shard gain.`,
  },
  {
    id: 2,
    name: "Doomed Transcendence",
    cost: Infinity,
    description: `Rebuyable Dilation upgrades previously only available in a Doomed Reality
    are now purchasable outside of it, but they scale faster and have hardcaps. The 
    autobuyers for them are also available outside of a Doomed Reality.`
  },
  {
    id: 3,
    name: "Knowledge Empowerment",
    cost: Infinity,
    description: "Memory gain of Ra's pets is raised by 1.25."
  },
  {
    id: 4,
    name: "Continuum Destruction",
    cost: Infinity,
    description: `Continuum gives 25% more purchases. Every Collapse, start 
    with Continuum unlocked.`
  }, 
  {
    id: 5,
    name: "Hoarder of Glyphs",
    cost: Infinity,
    description: "Unlock one more glyph slot."
  },
  {
    id: 6,
    name: "Glyph Enlarger",
    cost: Infinity,
    description: "You can now equip 2 Reality and Effarig glyphs."
  },
  {
    id: 7,
    name: "Super Achievement",
    cost: Infinity,
    description: "Regular V-Achievements gives"
  }
];
