Date.prototype.addDays = function (days) {
  this.setTime(this.getTime() + days * 24 * 60 * 60 * 1000);
  return this;
};

Date.prototype.subtractDays = function (days) {
  return this.addDays(-days);
};

Date.prototype.addHours = function (hours) {
  this.setTime(this.getTime() + hours * 60 * 60 * 1000);
  return this;
};

Date.prototype.subtractHours = function (hours) {
  return this.addHours(-hours);
};

Date.prototype.addMinutes = function (minutes) {
  this.setTime(this.getTime() + minutes * 60 * 1000);
  return this;
};

Date.prototype.subtractMinutes = function (minutes) {
  return this.addMinutes(-minutes);
};
