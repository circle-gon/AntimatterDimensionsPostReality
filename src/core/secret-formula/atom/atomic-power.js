export const atomicParticles = [
  {
    name: "Proton",
    color: "green",
    bonus(amt) {
      return [((amt.add(1).log10() + 1) ** 0.5 - 1) / 10 + 1, amt.add(1).log10() / 10 + 1];
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
      return [amt.add(1).log10() + 1, amt.add(1).log10() / 2 + 1];
    },
    description(effects) {
      return [
        `Atomic Power gain is multiplied by |×${formatFloat(effects[0], 2)}|`,
        `Atom gain is multiplied by |×${formatFloat(effects[1], 2)}|`,
      ];
    },
  },
  {
    name: "Electron",
    color: "yellow",
    bonus(amt) {
      return [amt.add(1).pow(50), amt.add(1).log10() / 20 + 1];
    },
    description(effects) {
      return [`Reality Machine cap is |${formatX(effects[0], 2)}| higher`, `Game speed is |^${formatFloat(effects[1], 2)}|`];
    },
  },
];
