import * as tslib_1 from "tslib";
import { BarChartComponent } from "@common-components";
import { text } from "@core";
import { setting, statistics } from "@modules";
import { formatDate } from "@utils";
import { computed } from "mobx";
import { observer } from "mobx-react";
import * as React from "react";
let Component = class Component extends React.Component {
    get values() {
        const initialValue = {
            days: [],
            missed: [],
            outstanding: [],
            paid: []
        };
        return statistics.selectedAppointmentsByDay.reduce((acc, val) => {
            acc.paid.push(val.appointments.filter(a => a.isPaid).length);
            acc.outstanding.push(val.appointments.filter(a => a.isOutstanding).length);
            acc.missed.push(val.appointments.filter(a => a.missed).length);
            acc.days.push(formatDate(val.day.getTime(), setting.getSetting("date_format")));
            return acc;
        }, initialValue);
    }
    render() {
        return (React.createElement(BarChartComponent, Object.assign({}, {
            height: 400,
            data: {
                xLabels: this.values.days,
                bars: [
                    {
                        label: text("Missed"),
                        data: this.values.missed
                    },
                    {
                        label: text("Paid"),
                        data: this.values.paid
                    },
                    {
                        label: text("Outstanding"),
                        data: this.values.outstanding
                    }
                ]
            }
        })));
    }
};
tslib_1.__decorate([
    computed
], Component.prototype, "values", null);
Component = tslib_1.__decorate([
    observer
], Component);
export const appointmentsByDateChart = {
    Component,
    name: "Appointments by Date",
    description: "Number of appointments",
    tags: "appointments date number how many",
    className: "col-xs-12"
};
//# sourceMappingURL=chart.appointments-date.js.map