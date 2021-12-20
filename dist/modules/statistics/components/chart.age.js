import * as tslib_1 from "tslib";
import { BarChartComponent } from "@common-components";
import { text } from "@core";
import { statistics } from "@modules";
import { computed } from "mobx";
import { observer } from "mobx-react";
import * as React from "react";
let Component = class Component extends React.Component {
    get values() {
        return statistics.selectedPatients
            .filter(x => x && x.birthYear)
            .map(x => {
            if (!x || x.birthYear === 0) {
                return 0;
            }
            return Math.min(new Date().getFullYear() - x.birthYear, x.birthYear);
        })
            .reduce((result, occ) => {
            const i = result.findIndex(rOCC => rOCC.x === occ);
            if (i === -1) {
                result.push({
                    x: occ,
                    y: 1
                });
            }
            else {
                result[i].y++;
            }
            return result;
        }, [])
            .sort((a, b) => a.x - b.x);
    }
    render() {
        return (React.createElement("div", null,
            React.createElement(BarChartComponent, Object.assign({}, {
                height: 400,
                data: {
                    xLabels: this.values.map(x => x.x.toString()),
                    bars: [
                        {
                            data: this.values.map(x => x.y),
                            label: text("Age")
                        }
                    ]
                }
            }))));
    }
};
tslib_1.__decorate([
    computed
], Component.prototype, "values", null);
Component = tslib_1.__decorate([
    observer
], Component);
export const ageBarChart = {
    Component,
    name: "Patients' Age",
    description: "Comparing patients age",
    tags: "patient age patients",
    className: "col-xs-12 col-lg-6"
};
//# sourceMappingURL=chart.age.js.map