export const atomMilestones = {
  am1: {
    time: Number.MAX_VALUE,
    reward: () => `Celestial quote unlocks, the Companion glyph, Automator data, 
    glyph presets and filters, and Normal and Infinity challenge times never reset on
    Collapse. Start with all perks, the Nameless Ones' storing
    time mechanic unlocked, Automator speed maxed, all one-time Doomed upgrades,
    passive EP generation (works while Doomed), and Reality Upgrades 'Existentially Prolong', 
    'The Telemechanical Process', and 'Effortless Existence'.
    Storing real time is now 100% efficent, unlock real time discharge, 
    and Eternity Challenges are auto-completed ${formatX(120, 0)} faster.`,
  },
  am2: {
    time: TimeSpan.fromDays(7).totalMilliseconds,
    reward: `Start with the rebuyable Reality Upgrade and
    Black Hole autobuyers, Imaginary Upgrade 'Vacuum Acceleration'
    and both black holes start unlocked and pernamently active. 
    Start every Armageddon, Reality, and Collapse with all Eternity 
    Challenges completed, and Reality Upgrade 'The Knowing Existance' no longer 
    fails if you have EC1 completions.`,
  },
  am3: {
    time: TimeSpan.fromDays(3).totalMilliseconds,
    reward: `[TBD] Start with Teresa's Reality Machine drainer completely filled, 
    the perk shop maxed, all Reality Upgrades bought, 
    and all Dark Matter Dimension automation 
    (auto-Ascension, auto-DMD-upgrades, auto-Singularity, and auto-Annihilation). 
    Unlock more Automator commands and Ra pets' Autobuyers.`,
  },
  am4: {
    time: TimeSpan.fromMinutes(25).totalMilliseconds,
    reward: `[TBD] Start with V's normal achievements at tier 4, 
    and V's hard achievements at tier 2, each of Ra's pets starts at Level 5, and
    Laitela's Reality destabilized twice, and all Dark Matter Dimensions unlocked.
    Unlock an Autobuyer which produces Glyph Sacrifice passively through automatically
    buying and selling Music Glyphs.`,
  },
  am5: {
    time: TimeSpan.fromSeconds(5).totalMilliseconds,
    reward: `[TBD] Start with Effarig and The Nameless Ones' upgrades and Reality completed.
    Ra's pets now start at Level 10, Laitela's Reality is destabilized four times,
    start with Annihilation unlocked, and unlock an Autobuyer for rebuyable Pelle Upgrades.
    Start with one more post-Reality achievement (excluding Doomed Reality achievements) for
    every Collapse done. 
    `,
  },
};
