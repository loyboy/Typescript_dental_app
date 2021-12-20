import * as tslib_1 from "tslib";
import { Col, ProfileComponent, ProfileSquaredComponent, Row } from "@common-components";
import { router, text, user } from "@core";
import { appointments, appointmentsByDateChart, setting } from "@modules";
import { computed, observable } from "mobx";
import { observer } from "mobx-react";
import * as React from "react";
let HomeView = class HomeView extends React.Component {
    constructor() {
        super(...arguments);
        this.time = {
            year: new Date().getFullYear(),
            month: new Date().getMonth(),
            day: new Date().getDate(),
            monthName: new Date().toLocaleDateString("en-EN", { month: "long" }),
            dayName: new Date().toLocaleDateString("en-EN", { weekday: "long" }),
            time: new Date().toLocaleTimeString("en-EN", {})
        };
    }
    get todayAppointments() {
        return appointments.appointmentsForDay(this.time.year, this.time.month + 1, this.time.day);
    }
    get tomorrowAppointments() {
        return appointments.appointmentsForDay(new Date().getTime() + 86400000, 0, 0);
    }
    render() {
        return (React.createElement("div", { className: "home p-l-10 p-r-10" },
            React.createElement("div", { className: "container" },
                React.createElement("h2", { className: "m-b-20" },
                    text("Welcome"),
                    ", ",
                    user.currentUser.name),
                React.createElement("hr", null),
                React.createElement("div", null, setting.getSetting("module_statistics") ? (React.createElement(appointmentsByDateChart.Component, null)) : ("")),
                React.createElement(Row, { gutter: 12 },
                    React.createElement(Col, { md: 12 },
                        React.createElement("h3", { className: "appointments-table-heading" }, text("Today's Appointments")),
                        React.createElement("br", null),
                        React.createElement("table", { className: "ms-table" },
                            React.createElement("thead", null,
                                React.createElement("tr", null,
                                    React.createElement("th", null, text("Appointment")),
                                    React.createElement("th", null, text("Operators")))),
                            React.createElement("tbody", null, this.todayAppointments.map(appointment => (React.createElement("tr", { key: appointment._id, className: "home-td" },
                                React.createElement("td", null,
                                    React.createElement(ProfileSquaredComponent, { text: appointment.treatment
                                            ? appointment
                                                .treatment
                                                .type
                                            : "", subText: (appointment.patient || {
                                            name: ""
                                        }).name })),
                                React.createElement("td", null, appointment.operatingStaff.map(operator => (React.createElement("div", { key: operator._id },
                                    React.createElement(Col, { xxl: 0, xl: 0, lg: 0, md: 0, sm: 0, xs: 24 },
                                        React.createElement("div", { key: operator._id, className: "m-t-5 fs-11" }, operator.name)),
                                    React.createElement(Col, { xxl: 24, xl: 24, lg: 24, md: 24, sm: 24, xs: 0 },
                                        React.createElement(ProfileComponent, { key: operator._id, name: operator.name, onRenderInitials: () => (React.createElement("span", null, operator
                                                .name[0])), size: 3, onClick: () => {
                                                router.go([
                                                    "staff",
                                                    operator._id
                                                ]);
                                            }, className: "pointer" }))))))))))),
                        this.todayAppointments.length === 0 ? (React.createElement("p", { className: "no-appointments" }, text("There are no appointments for today"))) : ("")),
                    React.createElement(Col, { md: 12 },
                        React.createElement("h3", { className: "appointments-table-heading" }, text("Tomorrow's Appointments")),
                        React.createElement("br", null),
                        React.createElement("table", { className: "ms-table" },
                            React.createElement("thead", null,
                                React.createElement("tr", null,
                                    React.createElement("th", null, text("Appointment")),
                                    React.createElement("th", null, text("Operators")))),
                            React.createElement("tbody", null, this.tomorrowAppointments.map(appointment => (React.createElement("tr", { key: appointment._id, className: "home-td" },
                                React.createElement("td", null,
                                    React.createElement(ProfileSquaredComponent, { text: appointment.treatment
                                            ? appointment
                                                .treatment
                                                .type
                                            : "", subText: (appointment.patient || {
                                            name: ""
                                        }).name })),
                                React.createElement("td", null, appointment.operatingStaff.map(operator => (React.createElement("div", { key: operator._id },
                                    React.createElement(Col, { xxl: 0, xl: 0, lg: 0, md: 0, sm: 0, xs: 24 },
                                        React.createElement("div", { key: operator._id, className: "m-t-5 fs-11" }, operator.name)),
                                    React.createElement(Col, { xxl: 24, xl: 24, lg: 24, md: 24, sm: 24, xs: 0 },
                                        React.createElement(ProfileComponent, { key: operator._id, name: operator.name, size: 3, onRenderInitials: () => (React.createElement("span", null, operator
                                                .name[0])), onClick: () => {
                                                router.go([
                                                    "staff",
                                                    operator._id
                                                ]);
                                            } }))))))))))),
                        this.tomorrowAppointments.length === 0 ? (React.createElement("p", { className: "no-appointments" }, text("There are no appointments for tomorrow"))) : (""))))));
    }
};
tslib_1.__decorate([
    observable
], HomeView.prototype, "time", void 0);
tslib_1.__decorate([
    computed
], HomeView.prototype, "todayAppointments", null);
tslib_1.__decorate([
    computed
], HomeView.prototype, "tomorrowAppointments", null);
HomeView = tslib_1.__decorate([
    observer
], HomeView);
export { HomeView };
//# sourceMappingURL=home.js.map