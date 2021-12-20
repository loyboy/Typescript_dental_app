import * as tslib_1 from "tslib";
import { LineChartComponent } from "@common-components";
import { text } from "@core";
import { setting, statistics } from "@modules";
import { formatDate, round } from "@utils";
import { computed } from "mobx";
import { observer } from "mobx-react";
import * as React from "react";
let Component = class Component extends React.Component {
    get _unsortedValues() {
        return statistics.selectedFinances.map(date => {
            const timestamp = date.day.getTime();
            let totalExpenses = 0;
            let totalPayments = 0;
            let totalProfits = 0;
            for (let index = 0; index < date.appointments.length; index++) {
                const appointment = date.appointments[index];
                if (appointment.isDone) {
                    totalExpenses = totalExpenses + appointment.expenses;
                }
                if (appointment.isPaid) {
                    totalPayments = totalPayments + appointment.paid;
                    totalProfits = totalProfits + appointment.profit;
                }
            }
            totalExpenses = round(totalExpenses);
            totalPayments = round(totalPayments);
            totalProfits = round(totalProfits);
            return {
                label: formatDate(timestamp, setting.getSetting("date_format")),
                totalPayments,
                totalExpenses,
                totalProfits
            };
        });
    }
    render() {
        return (React.createElement(LineChartComponent, Object.assign({}, {
            height: 300,
            data: {
                xLabels: this._unsortedValues.map(x => x.label),
                lines: [
                    {
                        label: text("Payments"),
                        data: this._unsortedValues.map(x => x.totalPayments)
                    },
                    {
                        label: text("Expenses"),
                        data: this._unsortedValues.map(x => x.totalExpenses)
                    },
                    {
                        label: text("Profits"),
                        data: this._unsortedValues.map(x => x.totalProfits)
                    }
                ]
            }
        })));
    }
};
tslib_1.__decorate([
    computed
], Component.prototype, "_unsortedValues", null);
Component = tslib_1.__decorate([
    observer
], Component);
export const financesByDateChart = {
    Component,
    name: "Finances by Date",
    description: "A calculation of finances",
    tags: "net profit by per day date",
    className: "col-xs-12"
};
//# sourceMappingURL=chart.finance.js.map