const DAYS_IN_WEEK = 7;
const DAYS_IN_MONTH = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
const WEEK_DAYS_FROM_MONDAY = [6, 0, 1, 2, 3, 4, 5];
const WEEK_DAYS_FROM_SUNDAY = [0, 1, 2, 3, 4, 5, 6];
/**
 * неделя начинается с понедельника, 
 * в объекте Date понедельник имеет номер 6. (Т.е. dateObj.getDay() вернёт число 6 для понедельника).
 * 
 * P.S. В некоторых странах неделя начинается с воскресенья, здесь это НЕ учтено.
 */ 

const Month = {
    January: 0,
    February: 1,
    March: 2,
    April: 3,
    May: 4,
    June: 5,
    July: 6,
    August: 7,
    September: 8,
    October: 9,
    Novermber: 10,
    December: 11
};

export function areEqual(a: Date, b: Date): boolean { 
    if (!a || !b) return false;
    return (
        a.getFullYear() === b.getFullYear() &&
        a.getMonth() === b.getMonth() &&
        a.getDate() === b.getDate()
    );
}

export function isLeapYear(year: number): boolean { // Проверка года на високосность
    return !((year % 4) || (!(year % 100) && (year % 400)));
}

export function getDaysInMonth(date: Date): number {
    const month = date.getMonth();
    const year = date.getFullYear();
    const daysInMonth = DAYS_IN_MONTH[month];
    
    if (isLeapYear(year) && month === Month.February) {
        return daysInMonth + 1;
    } else {
        return daysInMonth;
    }
}

export function getDayOfWeek(date: Date, weekStartsOnSunday?: boolean): number {
    const dayOfWeek = date.getDay();
    if (weekStartsOnSunday) return WEEK_DAYS_FROM_SUNDAY[dayOfWeek];
    return WEEK_DAYS_FROM_MONDAY[dayOfWeek];
}

export function getWeeks(year: number, month: number, weekStartsOnSunday?: boolean): Array<Array<Date | undefined>> {
    const result: Array<Array<Date | undefined>> = [];
    const date = new Date(year, month);
    const daysInMonth = getDaysInMonth(date);
    const monthStartsOn = getDayOfWeek(date, weekStartsOnSunday);
    let day = 1;

    for (let i = 0; i < (daysInMonth + monthStartsOn) / DAYS_IN_WEEK; i++) {
        result[i] = [];
        
        for (let j = 0; j < DAYS_IN_WEEK; j++) {
            if ((i === 0 && j < monthStartsOn) || day > daysInMonth) {
                result[i][j] = undefined;
            } else {
                result[i][j] = new Date(year, month, day++);
            }
        }
    }

    return result;
    //     return [
    //         [undefined, undefined, new Date(), new Date(), new Date(), new Date(), new Date()],
    //         [new Date(), new Date(), new Date(), new Date(), new Date(), new Date(), new Date()],
    //         [new Date(), new Date(), new Date(), new Date(), new Date(), new Date(), new Date()],
    //         [new Date(), new Date(), new Date(), new Date(), new Date(), new Date(), new Date()],
    //         [new Date(), new Date(), new Date(), new Date(), undefined, undefined, undefined],
    //     ]
}

export function getYears(date: Date): Array<number> {
    const currentYear = new Date().getFullYear();
    const minYear = date.getFullYear() - 10;
    const years: Array<number> = [];
    for (let i=currentYear; i>=minYear; i-=1) {
        years.push(i);
    }
    return years;
}

export function dateIsValid(dateStr: string): boolean {
    const regex = /^\d{2}\/\d{2}\/\d{4}$/;
  
    if (dateStr.match(regex) === null) {
      return false;
    }
  
    const [day, month, year] = dateStr.split('/');
    const isoFormattedStr = `${year}-${month}-${day}`;
    const date = new Date(isoFormattedStr);
    const timestamp = date.getTime();
    if (typeof timestamp !== 'number' || Number.isNaN(timestamp)) {
      return false;
    }
  
    return date.toISOString().startsWith(isoFormattedStr);
}


export function getFormatDate(date: Date): string {
    const year = date.getFullYear();
    let month: number | string = date.getMonth()+1;
    let day: number | string = date.getDate();
    if (month < 10) month = `0${month}`;
    if (day < 10) day = `0${day}`;
    return `${day}/${month}/${year}`;
}
