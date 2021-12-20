import * as tslib_1 from "tslib";
import { setting } from "@modules";
import { dateNames } from "@utils";
import { computed, observable } from "mobx";
export class Calendar {
    constructor() {
        // currents
        this.currentYear = new Date().getFullYear();
        this.currentMonth = new Date().getMonth();
        this.currentDay = new Date().getDate();
        // selected
        this.selectedYear = this.currentYear;
        this.selectedMonth = this.currentMonth;
        this.selectedDay = this.currentDay;
    }
    get weekendsOn() {
        return isNaN(Number(setting.getSetting("weekend_num")))
            ? 6
            : Number(setting.getSetting("weekend_num"));
    }
    get selectedMonthCalendar() {
        const month = [[]];
        const numberOfDays = this.numberOfDays(this.selectedMonth, this.selectedYear);
        for (let date = 0; date < numberOfDays; date++) {
            const obj = new Date(this.selectedYear, this.selectedMonth, date + 1);
            const dayLiteral = obj.toLocaleDateString("en-us", {
                weekday: "long"
            });
            const dayLiteralShort = obj.toLocaleDateString("en-us", {
                weekday: "short"
            });
            const isWeekend = dateNames.days(true).indexOf(dayLiteral) === this.weekendsOn;
            month[month.length - 1].push({
                dateNum: date + 1,
                weekDay: {
                    dayLiteral,
                    dayLiteralShort,
                    isWeekend
                }
            });
            if (isWeekend) {
                month.push([]);
            }
        }
        return month;
    }
    get selectedMonthDays() {
        return this.selectedMonthCalendar.reduce((month, week) => {
            week.forEach(day => month.push(day));
            return month;
        }, []);
    }
    get selectedWeekDays() {
        let week = [];
        for (let wi = 0; wi < this.selectedMonthCalendar.length; wi++) {
            const w = this.selectedMonthCalendar[wi];
            for (let di = 0; di < w.length; di++) {
                const d = w[di];
                if (d.dateNum === this.selectedDay) {
                    week = w;
                    return week;
                }
            }
        }
        return week;
    }
    numberOfDays(month, year) {
        let numberOfDays = 28;
        for (; numberOfDays < 32; numberOfDays++) {
            if (new Date(year, month, numberOfDays + 1).getMonth() !== month) {
                return numberOfDays;
            }
        }
        return numberOfDays;
    }
}
tslib_1.__decorate([
    observable
], Calendar.prototype, "selectedYear", void 0);
tslib_1.__decorate([
    observable
], Calendar.prototype, "selectedMonth", void 0);
tslib_1.__decorate([
    observable
], Calendar.prototype, "selectedDay", void 0);
tslib_1.__decorate([
    computed
], Calendar.prototype, "weekendsOn", null);
tslib_1.__decorate([
    computed
], Calendar.prototype, "selectedMonthCalendar", null);
tslib_1.__decorate([
    computed
], Calendar.prototype, "selectedMonthDays", null);
tslib_1.__decorate([
    computed
], Calendar.prototype, "selectedWeekDays", null);
export const calendar = new Calendar();
//# sourceMappingURL=calendar.js.map