interface Date {
  addHours(hours: number): Date;
  addMinutes(minutes: number): Date;
}

Date.prototype.addHours = function(hours: number) {
  this.setTime(this.getTime() + hours * 60 * 60 * 1000);
  return this;
};

Date.prototype.addMinutes = function(minutes: number) {
  this.setTime(this.getTime() + minutes * 60 * 1000);
  return this;
};
