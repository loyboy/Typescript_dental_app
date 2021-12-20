import * as tslib_1 from "tslib";
import { PieChartComponent } from "@common-components";
import { text } from "@core";
import { appointments, Gender, Patient, statistics } from "@modules";
import { computed } from "mobx";
import { observer } from "mobx-react";
import * as React from "react";
let Component = class Component extends React.Component {
    get malePercentile() {
        return this.calculateGenderPercentile(Gender.male);
    }
    get femalePercentile() {
        return this.calculateGenderPercentile(Gender.female);
    }
    render() {
        return (React.createElement(PieChartComponent, Object.assign({ height: 400 }, {
            data: [
                { label: text("Male"), value: this.malePercentile },
                { label: text("Female"), value: this.femalePercentile }
            ]
        })));
    }
    calculateGenderPercentile(gender) {
        return statistics.selectedDays
            .map(day => appointments
            .appointmentsForDay(day.getFullYear(), day.getMonth() + 1, day.getDate())
            .filter(appointment => (appointment.patient || new Patient())
            .gender === gender).length)
            .reduce((total, males) => (total = total + males), 0);
    }
};
tslib_1.__decorate([
    computed
], Component.prototype, "malePercentile", null);
tslib_1.__decorate([
    computed
], Component.prototype, "femalePercentile", null);
Component = tslib_1.__decorate([
    observer
], Component);
export const genderPieChart = {
    Component,
    name: "Patients' Gender",
    description: "treated patients gender",
    tags: "gender patients pie chart",
    className: "col-xs-12 col-lg-6"
};
//# sourceMappingURL=chart.gender.js.map