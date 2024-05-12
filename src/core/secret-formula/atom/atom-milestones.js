export const atomMilestones = {
  am1: {
    time: Number.MAX_VALUE,
    reward: () => `The Companion glyph, Automator data, 
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
    reward: `Start with Teresa's Reality Machine drainer completely filled, 
    the perk shop maxed before Ra's perk shop expansion upgrade,  
    and all Dark Matter Dimension automation 
    (auto-Ascension, auto-DMD-upgrades, auto-Singularity, and auto-Annihilation). 
    Unlock Ra pets' Autobuyers.`,
  },
  am4: {
    time: TimeSpan.fromDays(1).totalMilliseconds,
    reward: `Start with Effarig and The Nameless Ones' upgrades and Reality completed
    and V's normal achievements at tier 2. Unlock an Autobuyer which produces Glyph Sacrifice 
    passively through buying and selling Music Glyphs, and more Automator commands.`,
  },
  am5: {
    time: TimeSpan.fromHours(8).totalMilliseconds,
    reward: `[TBD] Ra's pets now start at Level 5, V's normal achievements at tier 4 and hard
    achievements at tier 2, and Laitela's Reality is destabilized once.`,
  },
  am6: {
    time: TimeSpan.fromHours(3).totalMilliseconds,
    reward: `[TBD] Ra's pets now start at Level 10, Laitela's Reality is destabilized three times,
    all Glyph Alchemy resources start at 5000, start with Annihilation unlocked, and unlock an
    Autobuyer for rebuyable Pelle Upgrades. Start with two more post-Reality achievements 
    (excluding Doomed Reality achievements) for every Collapse done.`
  },
  am7: {
    time: TimeSpan.fromHours(1).totalMilliseconds,
    reward: `[TBD] Laitela's Reality is destabilized five times, all Glyph Alchemy resources start
    at 10000, unlock the Tesseract autobuyer, and passively gain Remnants while Doomed.`
  },
  am8: {
    time: TimeSpan.fromMinutes(20).totalMilliseconds,
    reward: `[TBD] Laitela's Reality is now fully destabilized, all Glyph Alchemy resources start
    at 15000, all V achievements start at tier 4 (including Hard), Ra's pets now start at Level 15,
    and unlock an autobuyer for non-rebuyable Reality and Imaginary upgrades.`
  },
  am9: {
    time: TimeSpan.fromMinutes(10).totalMilliseconds,
    reward: `[TBD] All Glyph Alchemy resources start 20000, Ra's pets start at Level 20, 
    and all V achievements start at tier 5 (including Hard).`
  },
  am10: {
    time: TimeSpan.fromMinutes(5).totalMilliseconds,
    reward: `[TBD] All Glyph Alchemy resources start at 25000, Ra's pets start at Level 25, 
    all V achievements start at tier 6 (including Hard), and [insert some atom gain multiplier here]`
  }
};
