window.TimeSpan = class TimeSpan {
  /**
   * @param {Number} value
   * @returns {TimeSpan}
   */
  static fromYears(value) {
    return new TimeSpan(value * 31536e6);
  }

  /**
   * @param {Number} value
   * @returns {TimeSpan}
   */
  static fromDays(value) {
    return new TimeSpan(value * 864e5);
  }

  /**
   * @param {Number} value
   * @returns {TimeSpan}
   */
  static fromHours(value) {
    return new TimeSpan(value * 36e5);
  }

  /**
   * @param {Number} value
   * @returns {TimeSpan}
   */
  static fromMinutes(value) {
    return new TimeSpan(value * 6e4);
  }

  /**
   * @param {Number} value
   * @returns {TimeSpan}
   */
  static fromSeconds(value) {
    return new TimeSpan(value * 1e3);
  }

  /**
   * @param {Number} value
   * @returns {TimeSpan}
   */
  static fromMilliseconds(value) {
    return new TimeSpan(value);
  }

  /**
   * @param {Number} ms
   */
  constructor(ms) {
    Guard.isNumber(ms, "Value 'ms' must be a number");
    this._ms = ms;
  }

  /**
   * @param {TimeSpan} other
   */
  copyFrom(other) {
    Guard.isTimeSpan(other);
    this._ms = other._ms;
  }

  /**
   * @param {Number} ms
   */
  setFrom(ms) {
    Guard.isNumber(ms);
    this._ms = ms;
  }

  /**
   * @returns {Number}
   */
  get years() {
    return Math.floor(this.totalYears);
  }

  /**
   * @returns {Number}
   */
  get days() {
    return Math.floor(this.totalDays % 365);
  }

  /**
   * @returns {Number}
   */
  get hours() {
    return Math.floor(this.totalHours % 24);
  }

  /**
   * @returns {Number}
   */
  get minutes() {
    return Math.floor(this.totalMinutes % 60);
  }

  /**
   * @returns {Number}
   */
  get seconds() {
    return Math.floor(this.totalSeconds % 60);
  }

  /**
   * @returns {Number}
   */
  get milliseconds() {
    return Math.floor(this.totalMilliseconds % 1e3);
  }

  /**
   * @returns {Number}
   */
  get totalYears() {
    return this._ms / 31536e6;
  }

  /**
   * @returns {Number}
   */
  get totalDays() {
    return this._ms / 864e5;
  }

  /**
   * @returns {Number}
   */
  get totalHours() {
    return this._ms / 36e5;
  }

  /**
   * @returns {Number}
   */
  get totalMinutes() {
    return this._ms / 6e4;
  }

  /**
   * @returns {Number}
   */
  get totalSeconds() {
    return this._ms / 1e3;
  }

  /**
   * @returns {Number}
   */
  get totalMilliseconds() {
    return this._ms;
  }

  /**
   * @param {TimeSpan} other
   * @returns {TimeSpan}
   */
  plus(other) {
    Guard.isTimeSpan(other);
    return new TimeSpan(this._ms + other._ms);
  }

  /**
   * @param {TimeSpan} other
   * @returns {TimeSpan}
   */
  minus(other) {
    Guard.isTimeSpan(other);
    return new TimeSpan(this._ms - other._ms);
  }

  /**
   * @param {Number} other
   * @returns {TimeSpan}
   */
  times(other) {
    Guard.isNumber(other);
    return new TimeSpan(this._ms * other);
  }

  /**
   * @param {Number} other
   * @returns {TimeSpan}
   */
  dividedBy(other) {
    Guard.isNumber(other);
    return new TimeSpan(this._ms / other);
  }

  /**
   * @returns {String}
   */
  toString() {
    if (this.years > 1e6) {
      return `${format(this.totalYears, 3, 0)} years`;
    }
    if (this.totalSeconds >= 10) {
      return this.toStringNoDecimals();
    }
    return this.toStringShort();
  }

  /**
   * @returns {String}
   */
  toStringNoDecimals() {
    const parts = [];
    function addCheckedComponent(value, name) {
      if (value === 0) {
        return;
      }
      addComponent(value, name);
    }
    function addComponent(value, name) {
      parts.push(value === 1 ? `${formatInt(value)} ${name}` : `${formatInt(value)} ${name}s`);
    }
    addCheckedComponent(this.years, "year");
    addCheckedComponent(this.days, "day");
    addCheckedComponent(this.hours, "hour");
    addCheckedComponent(this.minutes, "minute");
    addCheckedComponent(this.seconds, "second");
    // Join with commas and 'and' in the end.
    if (parts.length === 0) return `${formatInt(0)} seconds`;
    return [parts.slice(0, -1).join(", "), parts.slice(-1)[0]].join(parts.length < 2 ? "" : " and ");
  }

  /**
   * Note: For speedruns, we give 3 digits of hours on HMS formatting, a decimal point on seconds, and
   *  suppress END formatting on the speedrun record tabs
   * @param {boolean} useHMS If true, will display times as HH:MM:SS in between a minute and 100 hours.
   * @returns {String}
   */
  toStringShort(useHMS = true, isSpeedrun = false) {
    // Probably not worth the trouble of importing the isEND function from formatting since this accomplishes the same
    // thing; we do however need this to prevent strings like "02:32" from showing up though
    if (format(0) === "END" && !isSpeedrun) return "END";

    const totalSeconds = this.totalSeconds;
    if (totalSeconds > 5e-7 && totalSeconds < 1e-3) {
      // This conditional happens when when the time is less than 1 millisecond
      // but big enough not to round to 0 with 3 decimal places (so showing decimal places
      // won't just show 0 and waste space).
      return `${format(1000 * totalSeconds, 0, 3)} ms`;
    }
    if (totalSeconds < 1) {
      // This catches all the cases when totalSeconds is less than 1 but not
      // between 5e-7 and 1e-3. This includes two types of cases:
      // (1) those less than or equal to 5e-7, which most notations will format as 0
      // (the most notable case of this kind is 0 itself).
      // (2) those greater than or equal to 1e-3, which will be formatted with default settings
      // (for most notations, rounding to the nearest integer number of milliseconds)
      return `${format(1000 * totalSeconds)} ms`;
    }
    if (totalSeconds < 10) {
      return `${format(totalSeconds, 0, 3)} seconds`;
    }
    if (totalSeconds < 60) {
      return `${format(totalSeconds, 0, 2)} seconds`;
    }
    if (this.totalHours < 100 || (isSpeedrun && this.totalHours < 1000)) {
      if (useHMS && !Notations.current.isPainful) {
        const sec = seconds(this.seconds, this.milliseconds);
        if (Math.floor(this.totalHours) === 0) return `${formatHMS(this.minutes)}:${sec}`;
        return `${formatHMS(Math.floor(this.totalHours))}:${formatHMS(this.minutes)}:${sec}`;
      }
      if (this.totalMinutes < 60) {
        return `${format(this.totalMinutes, 0, 2)} minutes`;
      }
      if (this.totalHours < 24) {
        return `${format(this.totalHours, 0, 2)} hours`;
      }
    }
    if (this.totalDays < 500) {
      return `${isSpeedrun ? this.totalDays.toFixed(2) : format(this.totalDays, 0, 2)} days`;
    }
    return `${isSpeedrun ? this.totalYears.toFixed(3) : format(this.totalYears, 3, 2)} years`;

    function formatHMS(value) {
      const s = value.toString();
      return s.length === 1 ? `0${s}` : s;
    }

    function seconds(s, ms) {
      const sec = formatHMS(s);
      return isSpeedrun ? `${sec}.${Math.floor(ms / 100)}` : sec;
    }
  }

  toTimeEstimate() {
    const seconds = this.totalSeconds;
    if (seconds < 1) return `< ${formatInt(1)} second`;
    if (seconds > 86400 * 365.25) return `> ${formatInt(1)} year`;
    return this.toStringShort();
  }

  static get zero() {
    return new TimeSpan(0);
  }

  static get maxValue() {
    return new TimeSpan(Number.MAX_VALUE);
  }

  static get minValue() {
    return new TimeSpan(Number.MIN_VALUE);
  }
};

// I'm too lazy to actually write good code
window.DecimalTimeSpan = class DecimalTimeSpan {
  /**
   * @param {Number} value
   * @returns {TimeSpan}
   */
  static fromYears(value) {
    return new DecimalTimeSpan(Decimal.mul(value, 31536e6));
  }

  /**
   * @param {Number} value
   * @returns {TimeSpan}
   */
  static fromDays(value) {
    return new DecimalTimeSpan(Decimal.mul(value, 864e5));
  }

  /**
   * @param {Number} value
   * @returns {TimeSpan}
   */
  static fromHours(value) {
    return new DecimalTimeSpan(Decimal.mul(value, 36e5));
  }

  /**
   * @param {Number} value
   * @returns {TimeSpan}
   */
  static fromMinutes(value) {
    return new DecimalTimeSpan(Decimal.mul(value, 6e4));
  }

  /**
   * @param {Number} value
   * @returns {TimeSpan}
   */
  static fromSeconds(value) {
    return new DecimalTimeSpan(Decimal.mul(value, 1e3));
  }

  /**
   * @param {Number} value
   * @returns {TimeSpan}
   */
  static fromMilliseconds(value) {
    return new DecimalTimeSpan(new Decimal(value));
  }

  /**
   * @param {Number} ms
   */
  constructor(ms) {
    Guard.isNumberOrDecimal(ms, "Value 'ms' must be a Decimal or number");
    this._ms = new Decimal(ms);
  }

  /**
   * @param {TimeSpan} other
   */
  copyFrom(other) {
    Guard.isDecimalTimeSpan(other);
    this._ms = other._ms;
  }

  /**
   * @param {Number} ms
   */
  setFrom(ms) {
    Guard.isDecimal(ms);
    // Clone it so reactivity shenanigans don't happen
    this._ms = Decimal.fromDecimal(ms);
  }

  /**
   * @returns {Number}
   */
  get years() {
    return this.totalYears.floor();
  }

  /**
   * @returns {Number}
   */
  get days() {
    return this.totalDays.mod(365).floor();
  }

  /**
   * @returns {Number}
   */
  get hours() {
    return this.totalHours.mod(24).floor();
  }

  /**
   * @returns {Number}
   */
  get minutes() {
    return this.totalMinutes.mod(60).floor();
  }

  /**
   * @returns {Number}
   */
  get seconds() {
    return this.totalSeconds.mod(60).floor();
  }

  /**
   * @returns {Number}
   */
  get milliseconds() {
    return this.totalMilliseconds.mod(1e3).floor();
  }

  /**
   * @returns {Number}
   */
  get totalYears() {
    return this._ms.div(31536e6);
  }

  /**
   * @returns {Number}
   */
  get totalDays() {
    return this._ms.div(864e5);
  }

  /**
   * @returns {Number}
   */
  get totalHours() {
    return this._ms.div(36e5);
  }

  /**
   * @returns {Number}
   */
  get totalMinutes() {
    return this._ms.div(6e4);
  }

  /**
   * @returns {Number}
   */
  get totalSeconds() {
    return this._ms.div(1e3);
  }

  /**
   * @returns {Number}
   */
  get totalMilliseconds() {
    return this._ms;
  }

  /**
   * @param {TimeSpan} other
   * @returns {TimeSpan}
   */
  plus(other) {
    Guard.isDecimalTimeSpan(other);
    return new DecimalTimeSpan(this._ms.add(other._ms));
  }

  /**
   * @param {TimeSpan} other
   * @returns {TimeSpan}
   */
  minus(other) {
    Guard.isDecimalTimeSpan(other);
    return new DecimalTimeSpan(this._ms.sub(other._ms));
  }

  /**
   * @param {Number} other
   * @returns {TimeSpan}
   */
  times(other) {
    Guard.isNumberOrDecimal(other);
    return new DecimalTimeSpan(this._ms.mul(other));
  }

  /**
   * @param {Number} other
   * @returns {TimeSpan}
   */
  dividedBy(other) {
    Guard.isNumberOrDecimal(other);
    return new DecimalTimeSpan(this._ms.div(other));
  }

  /**
   * @returns {String}
   */
  toString() {
    if (this.years.gt(1e6)) {
      return `${format(this.totalYears, 3, 0)} years`;
    }
    if (this.totalSeconds.gte(10)) {
      return this.toStringWithDecimals();
    }
    return this.toStringShort();
  }

  /**
   * @returns {String}
   */
  toStringWithDecimals() {
    const parts = [];
    function addCheckedComponent(value, name) {
      if (value.eq(0)) {
        return;
      }
      addComponent(value, name);
    }
    function addComponent(value, name) {
      parts.push(value.eq(1) ? `${formatInt(value)} ${name}` : `${formatInt(value)} ${name}s`);
    }
    addCheckedComponent(this.years, "year");
    addCheckedComponent(this.days, "day");
    addCheckedComponent(this.hours, "hour");
    addCheckedComponent(this.minutes, "minute");
    addCheckedComponent(this.seconds, "second");
    // Join with commas and 'and' in the end.
    if (parts.length === 0) return `${formatInt(0)} seconds`;
    return [parts.slice(0, -1).join(", "), parts.slice(-1)[0]].join(parts.length < 2 ? "" : " and ");
  }

  /**
   * Note: For speedruns, we give 3 digits of hours on HMS formatting, a decimal point on seconds, and
   *  suppress END formatting on the speedrun record tabs
   * @param {boolean} useHMS If true, will display times as HH:MM:SS in between a minute and 100 hours.
   * @returns {String}
   */
  toStringShort(useHMS = true, isSpeedrun = false) {
    // Probably not worth the trouble of importing the isEND function from formatting since this accomplishes the same
    // thing; we do however need this to prevent strings like "02:32" from showing up though
    if (format(0) === "END" && !isSpeedrun) return "END";

    const totalSeconds = this.totalSeconds;
    if (totalSeconds.gt(5e-7) && totalSeconds.lt(1e-3)) {
      // This conditional happens when when the time is less than 1 millisecond
      // but big enough not to round to 0 with 3 decimal places (so showing decimal places
      // won't just show 0 and waste space).
      return `${format(totalSeconds.mul(1000), 0, 3)} ms`;
    }
    if (totalSeconds.lt(1)) {
      // This catches all the cases when totalSeconds is less than 1 but not
      // between 5e-7 and 1e-3. This includes two types of cases:
      // (1) those less than or equal to 5e-7, which most notations will format as 0
      // (the most notable case of this kind is 0 itself).
      // (2) those greater than or equal to 1e-3, which will be formatted with default settings
      // (for most notations, rounding to the nearest integer number of milliseconds)
      return `${format(totalSeconds.mul(1000))} ms`;
    }
    if (totalSeconds.lt(10)) {
      return `${format(totalSeconds, 0, 3)} seconds`;
    }
    if (totalSeconds.lt(60)) {
      return `${format(totalSeconds, 0, 2)} seconds`;
    }
    if (this.totalHours.lt(100) || (isSpeedrun && this.totalHours.lt(1000))) {
      if (useHMS && !Notations.current.isPainful) {
        const sec = seconds(this.seconds, this.milliseconds);
        if (this.totalHours.floor().eq(0)) return `${formatHMS(this.minutes)}:${sec}`;
        return `${formatHMS(this.totalHours.floor())}:${formatHMS(this.minutes)}:${sec}`;
      }
      if (this.totalMinutes.lt(60)) {
        return `${format(this.totalMinutes, 0, 2)} minutes`;
      }
      if (this.totalHours.lt(24)) {
        return `${format(this.totalHours, 0, 2)} hours`;
      }
    }
    if (this.totalDays.lt(500)) {
      return `${isSpeedrun ? this.totalDays.toFixed(2) : format(this.totalDays, 0, 2)} days`;
    }
    return `${isSpeedrun ? this.totalYears.toFixed(3) : format(this.totalYears, 3, 2)} years`;

    function formatHMS(value) {
      const s = value.toString();
      return s.length === 1 ? `0${s}` : s;
    }

    function seconds(s, ms) {
      const sec = formatHMS(s);
      return isSpeedrun ? `${sec}.${ms.div(100).floor().toString()}` : sec;
    }
  }

  toTimeEstimate() {
    const seconds = this.totalSeconds;
    if (seconds.lt(1)) return `< ${formatInt(1)} second`;
    if (seconds.gt(6400 * 365.25)) return `> ${formatInt(1)} year`;
    return this.toStringShort();
  }

  static get zero() {
    return new DecimalTimeSpan(0);
  }

  static get maxValue() {
    return new DecimalTimeSpan(Number.MAX_VALUE);
  }

  static get minValue() {
    return new DecimalTimeSpan(Number.MIN_VALUE);
  }
};

const Guard = {
  isDefined(value, message) {
    if (value !== undefined) return;
    if (message) throw message;
    throw "Value is defined";
  },
  isNumber(value, message) {
    if (typeof value === "number") return;
    if (message) throw message;
    throw "Value is not a number";
  },
  isDecimal(value, message) {
    if (value instanceof Decimal) return;
    if (message) throw message;
    throw "Value is not a Decimal";
  },
  isNumberOrDecimal(value, message) {
    if (typeof value === "number" || value instanceof Decimal) return;
    if (message) throw message;
    throw "Value is not a number nor Decimal";
  },
  isTimeSpan(value, message) {
    if (value instanceof TimeSpan) return;
    if (message) throw message;
    throw "Value is not a TimeSpan";
  },
  isDecimalTimeSpan(value, message) {
    if (value instanceof DecimalTimeSpan) return;
    if (message) throw message;
    throw "Value is not a DecimalTimeSpan";
  },
  isDecimalOrNotTimeSpan(value, message) {
    if (value instanceof DecimalTimeSpan || value instanceof TimeSpan) return;
    if (message) throw message;
    throw "Value is not a DecimalTimeSpan nor a TimeSpan";
  },
};
