export const atomicParticles = [
  {
    name: "Proton",
    color: "green",
    bonus(amt) {
      const a = (((amt.add(1).log10() + 1) ** 0.5 - 1) / 10 + 1) ** Effects.product(AtomUpgrade(6))
      const b = (amt.add(1).log10() / 10 + 1) ** Effects.product(AtomUpgrade(6))
      return [a, b];
    },
    description(effects) {
      return [
        `Continuum gives |${formatPercents(effects[0] - 1, 2)}| more purchases`,
        `Dimension Boosts are |${formatPercents(effects[1] - 1, 2)}| stronger`,
      ];
    },
  },
  {
    name: "Neutron",
    color: "blue",
    bonus(amt) {
      const a = (amt.add(1).log10() + 1) ** Effects.product(AtomUpgrade(6))
      const b = (amt.add(1).log10() / 2 + 1) ** Effects.product(AtomUpgrade(6))
      return [a, b];
    },
    description(effects) {
      return [
        `Atomic Power gain is multiplied by |${formatX(effects[0], 2, 2)}|`,
        `Atom gain is multiplied by |${formatX(effects[1], 2, 2)}|`,
      ];
    },
  },
  {
    name: "Electron",
    color: "yellow",
    bonus(amt) {
      const a = amt.add(1).pow(50).powEffectOf(AtomUpgrade(6))
      const b = (amt.add(1).log10() / 20 + 1) ** Effects.product(AtomUpgrade(6))
      return [a, b];
    },
    description(effects) {
      return [`Reality Machine cap is |${formatX(effects[0], 2)}| higher`, `Game speed is |^${format(effects[1], 2, 2)}|`];
    },
  },
];
