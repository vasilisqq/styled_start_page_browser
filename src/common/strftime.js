/*
+----------+
| STRFTIME |
+----------+
Author: https://github.com/b-coimbra
Description: silly strftime function implementation in js without the percentage notation.
             based off https://strftime.org

USAGE: new Date().strftime('H:M p - A') => 21:32 AM - Thursday
       new Date().strftime('m/b/Y')     => 1/Jan/2018
       new Date().strftime('do B Y')    => 18th January 2018
*/
Date.prototype.strftime = function (format = 'c') {
  const date = this;

  const isValid = (date) => date instanceof Date && !isNaN(date);

  if (!isValid(date))
    throw date;

  // helpers are loaded from utils.js (pad, ord)

  const month   = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
        days    = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        result  = [],
        formats = {
          a: days[date.getDay()].substr(0, 3),
          A: days[date.getDay()],
          w: date.getDay(),
          q: pad(date.getDay()),
          d: pad(date.getDate()),
          e: date.getDate(),
          b: month[date.getMonth()].substr(0, 3),
          B: month[date.getMonth()],
          m: date.getMonth() + 1,
          N: pad(date.getMonth() + 1),
          y: pad(date.getFullYear()),
          Y: date.getFullYear(),
          H: date.getHours(),
          h: pad(date.getHours()),
          p: date.getHours() >= 12 ? 'PM' : 'AM',
          o: ord(date.getDate()),
          M: date.getMinutes(),
          i: pad(date.getMinutes()),
          S: date.getSeconds(),
          s: pad(date.getSeconds()),
          f: date.getMilliseconds(),
          c: date.toDateString() + ' - ' + date.toTimeString(),
          x: date.toLocaleDateString(),
          X: date.toLocaleTimeString()
        };

  format.split(/(\w|.)/m).forEach((type) => {
    if (type)
      result.push(typeof formats[type] === 'undefined' ? type : formats[type]);
  });

  return result.join('');
};
