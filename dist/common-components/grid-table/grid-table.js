import * as tslib_1 from "tslib";
import { observer } from "mobx-react";
import * as React from "react";
let GridTableComponent = class GridTableComponent extends React.Component {
    constructor() {
        super(...arguments);
        this.interval = 0;
    }
    componentWillMount() {
        this.interval = setInterval(() => {
            document.querySelectorAll(".grid-table").forEach(el => {
                const parentHeight = el.parentElement.offsetHeight;
                el.style.height = `${parentHeight}px`;
            });
        }, 300);
    }
    componentWillUnmount() {
        clearInterval(this.interval);
    }
    render() {
        return (React.createElement("table", { className: "grid-table" },
            React.createElement("tbody", null, ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"].map(rowNum => (React.createElement("tr", { key: rowNum }, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(colNum => (React.createElement("td", { key: colNum + rowNum },
                rowNum,
                colNum)))))))));
    }
};
GridTableComponent = tslib_1.__decorate([
    observer
], GridTableComponent);
export { GridTableComponent };
//# sourceMappingURL=grid-table.js.map