import * as tslib_1 from "tslib";
import { AsyncComponent, Col, ProfileSquaredComponent, Row } from "@common-components";
import { router, text, user } from "@core";
import { appointments, calendar, Patient, PatientLinkComponent, PatientFinanceComponent } from "@modules";
import { dateNames, num } from "@utils";
import { observable } from "mobx";
import { observer } from "mobx-react";
import { Icon, TextField, Toggle } from "office-ui-fabric-react";
import * as React from "react";
let CalendarPage = class CalendarPage extends React.Component {
    constructor() {
        super(...arguments);
        this.filter = "";
        this.appointment = null;
        this.showAll = true;
    }
    componentDidMount() {
        this.unifyHeight();
        const dateString = router.currentLocation.split("/")[1];
        if (!dateString) {
            return;
        }
        const dateArray = dateString.split(/\W/);
        calendar.selectedYear = num(dateArray[0]);
        calendar.selectedMonth = num(dateArray[1]) - 1;
        calendar.selectedDay = num(dateArray[2]);
    }
    componentDidUpdate() {
        this.unifyHeight();
    }
    unifyHeight() {
        const parent = document.getElementById("full-day-cols");
        if (!parent) {
            return;
        }
        const els = document.getElementsByClassName("full-day-col");
        let largest = 0;
        for (let index = 0; index < els.length; index++) {
            const height = els[index].clientHeight;
            if (height > largest) {
                largest = height;
            }
        }
        for (let index = 0; index < els.length; index++) {
            els[index].style.minHeight = largest ? largest + "px" : "auto";
        }
    }
    render() {
        return (React.createElement("div", { className: "calendar-component container-fluid" },
            React.createElement("div", { className: "selector year-selector" },
                React.createElement(Row, null, [
                    calendar.currentYear - 2,
                    calendar.currentYear - 1,
                    calendar.currentYear,
                    calendar.currentYear + 1
                ].map(year => {
                    return (React.createElement(Col, { key: year, span: 6, className: "centered" },
                        React.createElement("a", { onClick: () => {
                                calendar.selectedYear = year;
                                calendar.selectedMonth = 0;
                                calendar.selectedDay = 1;
                            }, className: (calendar.selectedYear === year ? "selected" : "") +
                                (calendar.currentYear === year ? " current" : "") }, year)));
                }))),
            React.createElement("div", { className: "selector month-selector" },
                React.createElement(Row, null, dateNames.monthsShort().map((monthShort, index) => {
                    return (React.createElement(Col, { key: monthShort, sm: 2, xs: 4, className: "centered" },
                        React.createElement("a", { onClick: () => {
                                calendar.selectedMonth = index;
                                calendar.selectedDay = 1;
                            }, className: (calendar.selectedMonth === index ? "selected" : "") +
                                (calendar.currentMonth === index &&
                                    calendar.currentYear === calendar.selectedYear
                                    ? " current"
                                    : "") }, monthShort)));
                }))),
            React.createElement("div", { className: "selector day-selector" },
                React.createElement("div", { className: "day-selector-wrapper" },
                    React.createElement("div", null, calendar.selectedMonthDays.map(day => {
                        return (React.createElement("div", { key: day.dateNum, onClick: () => {
                                calendar.selectedDay = day.dateNum;
                                setTimeout(() => {
                                    scroll(0, this.findPos(document.getElementById("day_" + day.dateNum)));
                                }, 0);
                            }, className: "day-col" +
                                (calendar.selectedDay === day.dateNum
                                    ? " selected"
                                    : "") +
                                (user.currentUser.onDutyDays.indexOf(day.weekDay.dayLiteral) === -1
                                    ? " holiday"
                                    : "") +
                                (day.weekDay.isWeekend ? " weekend" : "") },
                            React.createElement("div", { className: "day-name" }, text(day.weekDay.dayLiteralShort.substr(0, 2).toUpperCase())),
                            React.createElement("a", { className: "day-number info-row" +
                                    (day.dateNum === calendar.currentDay &&
                                        calendar.currentMonth === calendar.selectedMonth &&
                                        calendar.selectedYear === calendar.currentYear
                                        ? " current"
                                        : "") }, day.dateNum)));
                    })),
                    React.createElement("div", null, calendar.selectedMonthDays.map(day => {
                        const number = appointments.appointmentsForDay(calendar.selectedYear, calendar.selectedMonth + 1, day.dateNum, undefined, this.showAll ? undefined : user.currentUser._id).length;
                        return (React.createElement("div", { key: day.dateNum, onClick: () => {
                                calendar.selectedDay = day.dateNum;
                            }, className: "day-col" +
                                (calendar.selectedDay === day.dateNum
                                    ? " selected"
                                    : "") +
                                (user.currentUser.onDutyDays.indexOf(day.weekDay.dayLiteral) === -1
                                    ? " holiday"
                                    : "") +
                                (day.weekDay.isWeekend ? " weekend" : "") },
                            React.createElement("div", { className: "info-row appointments-num num-" + number }, number)));
                    })))),
            React.createElement("div", { className: "week-view" },
                React.createElement("div", { className: "filters" },
                    React.createElement(Row, null,
                        React.createElement(Col, { sm: 12, md: 6, xs: 24 },
                            React.createElement(Toggle, { defaultChecked: this.showAll, onText: text("All appointments"), offText: text("My appointments only"), onChange: (ev, newValue) => {
                                    this.showAll = newValue;
                                } })),
                        React.createElement(Col, { sm: 12, md: 18, xs: 0, className: "filter" },
                            React.createElement(TextField, { placeholder: text("Type to filter"), onChange: (ev, newVal) => (this.filter = newVal) })))),
                React.createElement("div", { id: "full-day-cols" }, calendar.selectedWeekDays.map(day => {
                    return (React.createElement("div", { key: day.dateNum, id: "day" + "_" + day.dateNum, className: "full-day-col" +
                            (user.currentUser.onDutyDays.indexOf(day.weekDay.dayLiteral) === -1
                                ? " holiday"
                                : "") +
                            (calendar.selectedDay === day.dateNum ? " selected" : ""), onClick: () => {
                            calendar.selectedDay = day.dateNum;
                        }, style: {
                            width: (100 / calendar.selectedWeekDays.length).toString() + "%"
                        } },
                        React.createElement("h4", null,
                            React.createElement("b", null, day.dateNum),
                            "\u00A0\u00A0\u00A0",
                            React.createElement("span", { className: "day-name" }, text(day.weekDay.dayLiteral))),
                        appointments
                            .appointmentsForDay(calendar.selectedYear, calendar.selectedMonth + 1, day.dateNum, this.filter, this.showAll ? undefined : user.currentUser._id)
                            .sort((a, b) => a.date - b.date)
                            .map(appointment => {
                            return (React.createElement("div", { key: appointment._id, className: "appointment", onClick: () => {
                                    this.appointment =
                                        appointments.list[appointments.getIndexByID(appointment._id)];
                                } },
                                React.createElement("div", { className: "time" }, appointment.formattedTime),
                                React.createElement("div", { className: "m-b-5" },
                                    React.createElement(ProfileSquaredComponent, { text: appointment.treatment
                                            ? appointment.treatment.type
                                            : "", size: 1 })),
                                React.createElement(PatientLinkComponent, { id: (appointment.patient || new Patient())._id }),
                                React.createElement(PatientFinanceComponent, { id: (appointment.patient || new Patient())._id }),
                                appointment.operatingStaff.map(operator => {
                                    return (React.createElement("div", { key: operator._id, className: "m-t-5 fs-11" },
                                        React.createElement(Icon, { iconName: "Contact" }),
                                        " ",
                                        operator.name));
                                })));
                        })));
                }))),
            this.appointment ? (React.createElement(AsyncComponent, { key: "ae", loader: () => tslib_1.__awaiter(this, void 0, void 0, function* () {
                    const AppointmentEditorPanel = (yield import("./appointment-editor")).AppointmentEditorPanel;
                    return (React.createElement(AppointmentEditorPanel, { appointment: this.appointment, onDismiss: () => (this.appointment = null), onDelete: () => (this.appointment = null) }));
                }) })) : ("")));
    }
    findPos(obj) {
        let curtop = 0;
        if (obj && obj.offsetParent) {
            do {
                curtop += obj.offsetTop;
            } while ((obj = obj.offsetParent));
            return curtop - 70;
        }
        return 0;
    }
};
tslib_1.__decorate([
    observable
], CalendarPage.prototype, "filter", void 0);
tslib_1.__decorate([
    observable
], CalendarPage.prototype, "appointment", void 0);
tslib_1.__decorate([
    observable
], CalendarPage.prototype, "showAll", void 0);
CalendarPage = tslib_1.__decorate([
    observer
], CalendarPage);
export { CalendarPage };
//# sourceMappingURL=page.calendar.js.map