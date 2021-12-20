import { text } from "@core";

export function comparableTime(date: Date) {
	return {
		y: date.getFullYear(),
		m: date.getMonth(),
		d: date.getDate()
	};
}

export function isToday(timestamp: number) {
	return (
		JSON.stringify(comparableTime(new Date(timestamp))) ===
		JSON.stringify(comparableTime(new Date()))
	);
}

export function isYesterday(timestamp: number) {
	return (
		JSON.stringify(comparableTime(new Date(timestamp))) ===
		JSON.stringify(
			comparableTime(new Date(new Date().getTime() - 86400000))
		)
	);
}

export function isTomorrow(timestamp: number) {
	return (
		JSON.stringify(comparableTime(new Date(timestamp))) ===
		JSON.stringify(
			comparableTime(new Date(new Date().getTime() + 86400000))
		)
	);
}

// export function formatDate(d: Date | number | undefined, dateFormat: string) {
// 	if (typeof d === "number") {
// 		d = new Date(d);
// 	}

// 	if (typeof d === "undefined") {
// 		d = new Date(0);
// 	}

// 	if (dateFormat === "dd/mm/yyyy") {
// 		return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
// 	} else if (dateFormat === "mm/dd/yyyy") {
// 		return `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`;
// 	} else {
// 		return `${d!.getDate()} ${
// 			dateNames.monthsShort()[d!.getMonth()]
// 		}'${d!.getFullYear() - 2000}`;
// 	}
// }

export function formatDate(d: Date | number | undefined, dateFormat: string, monthFormat?: string) {
	function writeHijri(date: Date | number) {
		return new Intl.DateTimeFormat('en-TN-u-ca-islamic', {day: 'numeric', month: 'numeric' ,year : 'numeric'}).format(date);
		//month - 0, day - 1, year - 2
	}

	if (typeof d === "number") {
		d = new Date(d);
	}

	if (typeof d === "undefined") {
		d = new Date(0);
	}

	let asdates = [ "كانون الثاني", "شباط", "آذار", "نيسان", "أيار", "حزيران", 
	"تموز", "آب", "أيلول", "تشرين الأول", "تشرين الثاني", "كانون الأول" ]

	let isdates = [ "شهر كانون الثاني", "شباط شهر", "آذار", "نيسان", "أيار", "حزيران", 
	"تموز", "آب", "أيلول", "تشرين الأول", "تشرين الثاني", "كانون الأول" ]

	if (dateFormat === "dd/mm/yyyy" && monthFormat === 'ge') {
		return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
	}
	else if (dateFormat === "dd/mm/yyyy" && monthFormat === 'as') {
		return `${d.getDate()}/${d.getFullYear()}/${asdates[d.getMonth()]}`;
	}
	else if (dateFormat === "dd/mm/yyyy" && monthFormat === 'is') {		
		var ddate = writeHijri(d).split('/');
		var month = ddate[0]; var day = ddate[1]; var year = ddate[2];
		return `${day}/${isdates[d.getMonth()]}/${year}`;
	} 
	else if (dateFormat === "dd/mm/yyyy") {
		return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
	} 

	else if (dateFormat === "mm/dd/yyyy" && monthFormat === 'ge') {
		return `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`;
	}
	else if (dateFormat === "mm/dd/yyyy" && monthFormat === 'as') {		
		return `${asdates[d.getMonth()]}/${d.getDate()}/${d.getFullYear()}`;
	}
	else if (dateFormat === "mm/dd/yyyy" && monthFormat === 'is') {		
		var ddate = writeHijri(d).split('/');
		var month = ddate[0]; var day = ddate[1]; var year = ddate[2];
		return `${isdates[d.getMonth()]}/${day}/${year}`;
	} 
	else if (dateFormat === "mm/dd/yyyy") {
		return `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`;
	} else {
		return `${d!.getDate()} ${
			dateNames.monthsShort()[d!.getMonth()]
		}'${d!.getFullYear() - 2000}`;
	}
}

export const dateNames = {
	daysShort: () =>
		dateNames.days(true).map(x => text(x.substr(0, 2).toUpperCase())),

	days: (skip?: boolean) => [
		text("Monday" + (skip ? "_" : "")).replace("_", ""),
		text("Tuesday" + (skip ? "_" : "")).replace("_", ""),
		text("Wednesday" + (skip ? "_" : "")).replace("_", ""),
		text("Thursday" + (skip ? "_" : "")).replace("_", ""),
		text("Friday" + (skip ? "_" : "")).replace("_", ""),
		text("Saturday" + (skip ? "_" : "")).replace("_", ""),
		text("Sunday" + (skip ? "_" : "")).replace("_", "")
	],
	monthsShort: () => [
		text("Jan"),
		text("Feb"),
		text("Mar"),
		text("Apr"),
		text("May"),
		text("Jun"),
		text("Jul"),
		text("Aug"),
		text("Sep"),
		text("Oct"),
		text("Nov"),
		text("Dec")
	],
	months: () => [
		text("January"),
		text("February"),
		text("March"),
		text("April"),
		text("May"),
		text("June"),
		text("July"),
		text("August"),
		text("September"),
		text("October"),
		text("November"),
		text("December")
	]
};

export function formatDateInternal(date: Date){
	var year = date.getFullYear();

  var month = (1 + date.getMonth()).toString();
  month = month.length > 1 ? month : '0' + month;

  var day = date.getDate().toString();
  day = day.length > 1 ? day : '0' + day;
  
  return day + '/' + month + '/' + year;
}


export const second = 1000;
export const minute = second * 60;
export const hour = minute * 60;
export const day = hour * 24;
export const week = day * 7;
export const month = day * 30;
