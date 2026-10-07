/* Keep every visible chart date in UTC, including weekday and ordinal day. */
window.ChartDates = {
  format(value) {
    const date = new Date(value);
    const day = date.getUTCDate();
    const suffix = day % 100 >= 11 && day % 100 <= 13 ? 'th' : ({1: 'st', 2: 'nd', 3: 'rd'}[day % 10] || 'th');
    const weekday = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][date.getUTCDay()];
    const month = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][date.getUTCMonth()];
    const time = date.toISOString().slice(11, 16);
    return `${weekday} ${day}${suffix} ${month} · ${time} UTC`;
  },
  stamp(element, value) {
    const date = new Date(value);
    element.textContent = this.format(date);
    element.dateTime = date.toISOString();
    element.title = date.toUTCString();
  },
  strip(label, value) {
    const strip = document.createElement('div');
    strip.className = 'imagery-timing';
    const row = document.createElement('div');
    row.className = 'imagery-valid';
    const caption = document.createElement('span');
    caption.className = 'timing-label';
    caption.textContent = label;
    const date = document.createElement('time');
    date.className = 'imagery-date';
    if (value !== undefined) this.stamp(date, value);
    else date.textContent = 'Loading observations…';
    row.append(caption, date);
    strip.append(row);
    return strip;
  }
};
