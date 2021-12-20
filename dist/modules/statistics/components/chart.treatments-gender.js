import * as tslib_1 from "tslib";
import { BarChartComponent } from "@common-components";
import { text } from "@core";
import { Gender, Patient, statistics } from "@modules";
import { computed } from "mobx";
import { observer } from "mobx-react";
import * as React from "react";
let Component = class Component extends React.Component {
    get selectedTreatments() {
        const selectedTreatments = [];
        statistics.selectedAppointments.forEach(appointment => {
            if (appointment.treatment) {
                const i = selectedTreatments.findIndex(t => t.treatment._id === appointment.treatment._id);
                let male = 0;
                let female = 0;
                if ((appointment.patient || new Patient()).gender ===
                    Gender.female) {
                    female++;
                }
                else {
                    male++;
                }
                if (i === -1) {
                    // add new
                    selectedTreatments.push({
                        treatment: appointment.treatment,
                        male,
                        female
                    });
                }
                else {
                    // just increment
                    selectedTreatments[i].male =
                        selectedTreatments[i].male + male;
                    selectedTreatments[i].female =
                        selectedTreatments[i].female + female;
                }
            }
        });
        return selectedTreatments;
    }
    render() {
        return (React.createElement("div", null,
            React.createElement(BarChartComponent, Object.assign({}, {
                horizontal: true,
                height: 400,
                notStacked: true,
                data: {
                    xLabels: this.selectedTreatments.map(x => x.treatment.type),
                    bars: [
                        {
                            label: text("Male"),
                            data: this.selectedTreatments.map(x => x.male)
                        },
                        {
                            label: text("Female"),
                            data: this.selectedTreatments.map(x => x.female * -1)
                        }
                    ]
                }
            }))));
    }
};
tslib_1.__decorate([
    computed
], Component.prototype, "selectedTreatments", null);
Component = tslib_1.__decorate([
    observer
], Component);
export const treatmentsByGenderChart = {
    Component,
    name: "Treatments by gender",
    description: "applied treatments by patients gender",
    tags: "A breakdown of applied treatments by patients gender throughout the selected date",
    className: "col-xs-12 col-lg-6"
};
//# sourceMappingURL=chart.treatments-gender.js.map