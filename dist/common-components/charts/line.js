import * as tslib_1 from "tslib";
import { colors } from "@common-components";
import { observer } from "mobx-react";
import * as React from "react";
let LineChartComponent = class LineChartComponent extends React.Component {
    constructor() {
        super(...arguments);
        this.id = "id" +
            Math.random()
                .toString(32)
                .substr(4);
    }
    graph() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const ChartJS = yield import("chart.js");
            const Chart = ChartJS.default;
            const ctx = document.getElementById(this.id).getContext("2d");
            const chart = new Chart(ctx, {
                type: "line",
                data: {
                    labels: this.props.data.xLabels,
                    datasets: this.props.data.lines.map((x, i) => ({
                        label: x.label,
                        data: x.data,
                        borderColor: colors[i],
                        backgroundColor: colors[i],
                        fill: false
                    }))
                },
                options: {
                    hover: {
                        mode: "nearest",
                        intersect: true
                    },
                    legend: { fullWidth: true }
                }
            });
        });
    }
    render() {
        return (React.createElement("div", { id: this.id + "_container", style: { height: this.props.height } },
            React.createElement("canvas", { id: this.id, style: { height: "100%", width: "100%" } })));
    }
    componentWillUpdate() {
        document.getElementById(this.id + "_container").innerHTML = `<canvas id="${this.id}" style="height: 100%; width: 100%" />`;
    }
    componentDidUpdate() {
        this.graph();
    }
    componentDidMount() {
        this.graph();
    }
};
LineChartComponent = tslib_1.__decorate([
    observer
], LineChartComponent);
export { LineChartComponent };
//# sourceMappingURL=line.js.map