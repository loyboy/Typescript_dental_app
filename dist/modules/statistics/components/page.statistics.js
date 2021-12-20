import * as tslib_1 from "tslib";
import { AsyncComponent, Col, DataTableComponent, ProfileComponent, ProfileSquaredComponent, Row, SectionComponent, TagComponent, TagType } from "@common-components";
import { text } from "@core";
import { ageBarChart, appointmentsByDateChart, financesByDateChart, genderPieChart, mostAppliedTreatmentsChart, mostInvolvedTeethChart, Patient, setting, staff, statistics, treatmentsByGenderChart, treatmentsNumberChart } from "@modules";
import { formatDate, round } from "@utils";
import { observable } from "mobx";
import { observer } from "mobx-react";
import { DatePicker, Dropdown } from "office-ui-fabric-react";
import * as React from "react";
let StatisticsPage = class StatisticsPage extends React.Component {
    constructor() {
        super(...arguments);
        this.appointment = null;
        this.charts = [
            appointmentsByDateChart,
            financesByDateChart,
            treatmentsNumberChart,
            mostAppliedTreatmentsChart,
            genderPieChart,
            treatmentsByGenderChart,
            mostInvolvedTeethChart,
            ageBarChart
        ];
    }
    render() {
        return (React.createElement("div", { className: "sc-pg p-15 p-l-10 p-r-10" },
            React.createElement(DataTableComponent, { maxItemsOnLoad: 20, className: "appointments-data-table", heads: [
                    text("Appointment"),
                    text("Treatment"),
                    text("Paid"),
                    text("Outstanding"),
                    text("Expenses"),
                    text("Profits")
                ], rows: statistics.selectedAppointments.map(appointment => ({
                    id: appointment._id,
                    searchableString: appointment.searchableString,
                    cells: [
                        {
                            dataValue: (appointment.patient || new Patient()).name,
                            component: (React.createElement(ProfileComponent, { secondaryElement: React.createElement("span", null,
                                    formatDate(appointment.date, setting.getSetting("date_format")),
                                    " ",
                                    "/",
                                    " ",
                                    appointment.operatingStaff.map(x => (React.createElement("i", { key: x._id },
                                        x.name,
                                        " ")))), name: (appointment.patient ||
                                    new Patient()).name, size: 3 })),
                            onClick: () => {
                                this.appointment = appointment;
                            },
                            className: "no-label"
                        },
                        {
                            dataValue: appointment.treatmentID,
                            component: (React.createElement(ProfileSquaredComponent, { text: appointment.treatment
                                    ? appointment.treatment.type
                                    : "", subText: formatDate(appointment.date, setting.getSetting("date_format")), size: 3, onClick: () => { } })),
                            className: "hidden-xs"
                        },
                        {
                            dataValue: appointment.paidAmount,
                            component: (React.createElement("span", null, setting.getSetting("currencySymbol") +
                                round(appointment.paidAmount).toString())),
                            className: "hidden-xs"
                        },
                        {
                            dataValue: appointment.outstandingAmount,
                            component: (React.createElement("span", null, setting.getSetting("currencySymbol") +
                                round(appointment.outstandingAmount).toString())),
                            className: "hidden-xs"
                        },
                        {
                            dataValue: appointment.expenses,
                            component: (React.createElement("span", null, setting.getSetting("currencySymbol") +
                                round(appointment.expenses).toString())),
                            className: "hidden-xs"
                        },
                        {
                            dataValue: appointment.profit,
                            component: (React.createElement("span", null, setting.getSetting("currencySymbol") +
                                round(appointment.profit).toString())),
                            className: "hidden-xs"
                        }
                    ]
                })), farItems: [
                    {
                        key: "1",
                        onRender: () => {
                            return (React.createElement(Dropdown, { placeholder: text("Filter by staff member"), defaultValue: "", options: [
                                    {
                                        key: "",
                                        text: text("All members")
                                    }
                                ].concat(staff.list.map(member => {
                                    return {
                                        key: member._id,
                                        text: member.name
                                    };
                                })), onChange: (ev, member) => {
                                    statistics.filterByMember = member.key.toString();
                                } }));
                        }
                    }
                ], hideSearch: true, commands: [
                    {
                        key: "2",
                        onRender: () => {
                            return (React.createElement(DatePicker, { onSelectDate: date => {
                                    if (date) {
                                        statistics.startingDate = statistics.getDayStartingPoint(date.getTime());
                                    }
                                }, value: new Date(statistics.startingDate), formatDate: d => `${text("From")}: ${formatDate(d, setting.getSetting("date_format"))}` }));
                        }
                    },
                    {
                        key: "3",
                        onRender: () => {
                            return (React.createElement(DatePicker, { onSelectDate: date => {
                                    if (date) {
                                        statistics.endingDate = statistics.getDayStartingPoint(date.getTime());
                                    }
                                }, value: new Date(statistics.endingDate), formatDate: d => `${text("Until")}: ${formatDate(d, setting.getSetting("date_format"))}` }));
                        }
                    }
                ] }),
            this.appointment ? (React.createElement(AsyncComponent, { key: "ae", loader: () => tslib_1.__awaiter(this, void 0, void 0, function* () {
                    const AppointmentEditorPanel = (yield import("../../appointments/components/appointment-editor"))
                        .AppointmentEditorPanel;
                    return (React.createElement(AppointmentEditorPanel, { appointment: this.appointment, onDismiss: () => (this.appointment = null), onDelete: () => (this.appointment = null) }));
                }) })) : (""),
            React.createElement("div", { className: "container-fluid m-t-20 quick" },
                React.createElement(SectionComponent, { title: text("Quick stats") },
                    React.createElement(Row, null,
                        React.createElement(Col, { sm: 6, xs: 12 },
                            React.createElement("label", null,
                                text("Appointments"),
                                ":",
                                " ",
                                React.createElement(TagComponent, { text: round(statistics.selectedAppointments
                                        .length).toString(), type: TagType.primary }))),
                        React.createElement(Col, { sm: 6, xs: 12 },
                            React.createElement("label", null,
                                text("Payments"),
                                ":",
                                " ",
                                React.createElement(TagComponent, { text: setting.getSetting("currencySymbol") +
                                        round(statistics.totalPayments).toString(), type: TagType.warning }))),
                        React.createElement(Col, { sm: 6, xs: 12 },
                            React.createElement("label", null,
                                text("Expenses"),
                                ":",
                                " ",
                                React.createElement(TagComponent, { text: setting.getSetting("currencySymbol") +
                                        round(statistics.totalExpenses).toString(), type: TagType.danger }))),
                        React.createElement(Col, { sm: 6, xs: 12 },
                            React.createElement("label", null,
                                text("Profits"),
                                ":",
                                " ",
                                React.createElement(TagComponent, { text: setting.getSetting("currencySymbol") +
                                        round(statistics.totalProfits).toString(), type: TagType.success })))))),
            React.createElement("div", { className: "charts container-fluid" },
                React.createElement("div", { className: "row" }, this.charts.map((chart, index) => {
                    return (React.createElement("div", { key: index + chart.name, className: "chart-wrapper " +
                            (chart.className ||
                                "col-xs-12 col-md-5 col-lg-4") },
                        React.createElement(SectionComponent, { title: text(chart.name) },
                            React.createElement(chart.Component, null))));
                })))));
    }
};
tslib_1.__decorate([
    observable
], StatisticsPage.prototype, "appointment", void 0);
tslib_1.__decorate([
    observable
], StatisticsPage.prototype, "charts", void 0);
StatisticsPage = tslib_1.__decorate([
    observer
], StatisticsPage);
export { StatisticsPage };
//# sourceMappingURL=page.statistics.js.map