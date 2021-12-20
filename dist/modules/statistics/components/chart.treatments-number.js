import * as tslib_1 from "tslib";
import { BarChartComponent } from "@common-components";
import { text } from "@core";
import { statistics, treatments } from "@modules";
import { computed } from "mobx";
import { observer } from "mobx-react";
import * as React from "react";
let Component = class Component extends React.Component {
    get selectedTreatments() {
        const selectedTreatments = [];
        statistics.selectedAppointments.forEach(appointment => {
            if (!appointment.isPaid || appointment.treatment === undefined) {
                return;
            }
            const i = selectedTreatments.findIndex(t => t.treatment._id === appointment.treatment._id);
            if (i === -1) {
                selectedTreatments.push({
                    treatment: appointment.treatment,
                    profit: appointment.profit,
                    times: 1
                });
            }
            else {
                selectedTreatments[i].times++;
                selectedTreatments[i].profit =
                    selectedTreatments[i].profit + appointment.profit;
            }
        });
        return selectedTreatments;
    }
    get values() {
        return this.selectedTreatments.map((treatment, i) => ({
            x: i,
            y: treatment.profit,
            times: treatment.times,
            title: treatments.list[treatments.getIndexByID(treatment.treatment._id)].type
        }));
    }
    render() {
        return (React.createElement("div", null,
            React.createElement(BarChartComponent, Object.assign({}, {
                height: 400,
                notStacked: true,
                data: {
                    xLabels: this.values.map(x => x.title),
                    bars: [
                        {
                            label: text("Profits"),
                            data: this.values.map(x => x.y)
                        },
                        {
                            label: text("Applied times"),
                            data: this.values.map(x => x.times)
                        }
                    ]
                }
            }))));
    }
};
tslib_1.__decorate([
    computed
], Component.prototype, "selectedTreatments", null);
tslib_1.__decorate([
    computed
], Component.prototype, "values", null);
Component = tslib_1.__decorate([
    observer
], Component);
export const treatmentsNumberChart = {
    Component,
    name: "Treatments by profits",
    description: "Treatments by profit",
    tags: "treatments number profit",
    className: "col-xs-12 col-lg-6"
};
//# sourceMappingURL=chart.treatments-number.js.map