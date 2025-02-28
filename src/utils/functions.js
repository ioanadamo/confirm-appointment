function getNextMonday(day) {
  const date = typeof day === 'string' ? convertDateStringToDate(day) : new Date(day);
  const dayOfWeek = date.getDay();
  const daysUntilNextMonday = (1 + 7 - dayOfWeek) % 7 || 7;

  date.setDate(date.getDate() + daysUntilNextMonday);

  const formattedDate = date.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).replace(/-/g, '').split('/').reverse().join('');

  return formattedDate;
}

function formatDateString(dateString) {
  const year = dateString.substring(0, 4);
  const month = dateString.substring(4, 6);
  const day = dateString.substring(6, 8);

  const date = new Date(`${year}-${month}-${day}`);
  return date.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
}

function transformData(data, dateValue) {
  const result = {};
  let dateParam = dateValue;

  if (typeof dateParam === 'string') {
    dateParam = parseCompactDateString(dateParam);
  }

  const today = dateParam;

  for (let i = 0; i < 7; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    const formattedDate = date.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });
    result[formattedDate] = [];
  }

  data.forEach(item => {
    const date = new Date(item.Start);
    const formattedDate = date.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });
    const time = date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });

    if (result[formattedDate]) {
      result[formattedDate].push(time);
    }
  });

  for (const date in result) {
    result[date].sort((a, b) => {
      const [aHour, aMinute] = a.split(':');
      const [bHour, bMinute] = b.split(':');
      const aTime = new Date(`1970/01/01 ${aHour}:${aMinute}`);
      const bTime = new Date(`1970/01/01 ${bHour}:${bMinute}`);
      return aTime - bTime;
    });
  }

  return result;
}

function parseDateString(dateString) {
  const [day, month, year] = dateString.split('/');
  return new Date(`${year}-${month}-${day}`);
}

function convertDateStringToDate(dateString) {
  const [day, month, year] = dateString.split('/');
  return new Date(`${year}-${month}-${day}`);
}

function parseCompactDateString(dateString) {
  const year = dateString.substring(0, 4);
  const month = dateString.substring(4, 6);
  const day = dateString.substring(6, 8);
  return new Date(`${year}-${month}-${day}`);
}

export function formatDateTime(date, time) {
  const [month, day] = date.split(' ');
  const monthMap = {
    January: '01',
    February: '02',
    March: '03',
    April: '04',
    May: '05',
    June: '06',
    July: '07',
    August: '08',
    September: '09',
    October: '10',
    November: '11',
    December: '12'
  };
  const year = new Date().getFullYear();
  const formattedDate = `${year}-${monthMap[month]}-${day.padStart(2, '0')}`;
  return `${formattedDate} ${time}`;
}

export function formatDate(dateValue) {
  const date = new Date(dateValue);
  const year = date.getFullYear();
  return date.toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
}

export function formatTime(timeValue) {
  const [hour, minute] = timeValue.split(':');
  const date = new Date();
  date.setHours(hour, minute);
  return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
}

export function formatShortDate(dateValue) {
  const date = new Date(dateValue);
  return date.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
}

export function formatDayName(date) {
  const fullDate = new Date(date);
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  if (fullDate.toDateString() === today.toDateString()) {
    return 'Today';
  } else if (fullDate.toDateString() === tomorrow.toDateString()) {
    return 'Tomorrow';
  }
  return fullDate.toLocaleDateString('en-US', { weekday: 'short' });
}

export { getNextMonday, formatDateString, transformData, parseDateString, convertDateStringToDate, parseCompactDateString };