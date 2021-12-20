import * as tslib_1 from "tslib";
import { text } from "@core";
import { textualFilter } from "@utils";
import { computed, observable } from "mobx";
import { observer } from "mobx-react";
import { CommandBar, DefaultButton, Icon, IconButton, MessageBar, MessageBarType, SearchBox } from "office-ui-fabric-react";
import * as React from "react";
let DataTableComponent = class DataTableComponent extends React.Component {
    constructor() {
        super(...arguments);
        this.currentColIndex = 0;
        this.sortDirection = 1;
        this.filterString = "";
        this.limit = this.props.maxItemsOnLoad;
    }
    get sortableValues() {
        return this.props.rows.map(row => {
            return isNaN(Number(row.cells[this.currentColIndex].dataValue))
                ? row.cells[this.currentColIndex].dataValue
                : Number(row.cells[this.currentColIndex].dataValue);
        });
    }
    get filteredRows() {
        return textualFilter(this.props.rows, this.filterString);
    }
    get sortedRows() {
        return this.filteredRows
            .map((row, index) => {
            return {
                row,
                index
            };
        })
            .sort((aVal, bVal) => {
            return this.sortDirection === 1
                ? this.compare(this.sortableValues[aVal.index], this.sortableValues[bVal.index])
                : this.compare(this.sortableValues[bVal.index], this.sortableValues[aVal.index]);
        })
            .map(x => x.row);
    }
    get limitedRows() {
        const limitedRows = [];
        for (let index = 0; index < this.limit; index++) {
            const item = this.sortedRows[index];
            if (item) {
                limitedRows.push(item);
            }
        }
        return limitedRows;
    }
    get farItems() {
        const items = [];
        if (!this.props.hideSearch) {
            items.push({
                key: "a",
                onRender: () => (React.createElement(SearchBox, { placeholder: text("Search"), onChange: (newVal) => (this.filterString = newVal) }))
            });
        }
        if (this.props.farItems) {
            return items.concat(this.props.farItems);
        }
        return items;
    }
    render() {
        return (React.createElement("div", { className: "data-table" },
            React.createElement(CommandBar, Object.assign({}, {
                className: "commandBar fixed m-b-15",
                isSearchBoxVisible: !this.props.hideSearch,
                elipisisAriaLabel: text("More options"),
                farItems: this.farItems,
                items: this.props.commands || []
            })),
            React.createElement("table", { className: "responsive ms-table " + this.props.className },
                React.createElement("thead", null,
                    React.createElement("tr", null, this.props.heads.map((head, index) => (React.createElement("th", { className: "table-head-sort" +
                            (this.currentColIndex === index ? " current" : "") +
                            (this.currentColIndex === index && this.sortDirection === 1
                                ? " positive"
                                : "") +
                            (this.currentColIndex === index && this.sortDirection === -1
                                ? " negative"
                                : ""), key: index, onClick: () => {
                            if (this.currentColIndex === index) {
                                this.sortDirection = this.sortDirection * -1;
                            }
                            else {
                                this.currentColIndex = index;
                                this.sortDirection = 1;
                            }
                        } },
                        head,
                        React.createElement("span", { className: "sort-indicators" },
                            React.createElement(Icon, { className: "positive", iconName: "ChevronUpSmall" }),
                            React.createElement(Icon, { className: "negative", iconName: "ChevronDownSmall" }))))))),
                React.createElement("tbody", null, this.limitedRows.map((row, index) => {
                    return (React.createElement("tr", { key: row.id },
                        row.cells.map((cell, index2) => {
                            return (React.createElement("td", { className: (cell.onClick ? "clickable " : "") +
                                    (cell.className ? cell.className : ""), key: index2, "data-head": this.props.heads[index2] || "", onClick: cell.onClick }, typeof cell.component === "string"
                                ? cell.component
                                : cell.component));
                        }),
                        React.createElement("td", { className: "delete-td" }, this.props.onPrint ? (React.createElement("div", null,
                            React.createElement(IconButton, { className: "delete-button", iconProps: {
                                    iconName: "print"
                                }, onClick: () => {
                                    this.props.onPrint(row.id);
                                } }))) : ("")),
                        React.createElement("td", { className: "delete-td" }, this.props.onDelete ? (React.createElement("div", null,
                            React.createElement(IconButton, { className: "delete-button", iconProps: {
                                    iconName: "delete"
                                }, onClick: () => {
                                    this.props.onDelete(row.id);
                                } }))) : (""))));
                }))),
            this.limitedRows.length < this.filteredRows.length ? (React.createElement(DefaultButton, { style: { marginTop: 20 }, iconProps: { iconName: "more" }, onClick: () => (this.limit = this.limit + 10), text: text("Load more") })) : (""),
            this.props.rows.length === 0 ? (React.createElement(MessageBar, { messageBarType: MessageBarType.info }, text("No data in this section yet, you can add new data by clicking the button above"))) : this.filteredRows.length === 0 ? (React.createElement(MessageBar, { messageBarType: MessageBarType.info }, text("Did not find anything that matches your search criteria"))) : ("")));
    }
    compare(a, b) {
        return typeof a === "number" && typeof b === "number"
            ? a - b
            : a.toString().localeCompare(b.toString());
    }
};
tslib_1.__decorate([
    computed
], DataTableComponent.prototype, "sortableValues", null);
tslib_1.__decorate([
    observable
], DataTableComponent.prototype, "currentColIndex", void 0);
tslib_1.__decorate([
    observable
], DataTableComponent.prototype, "sortDirection", void 0);
tslib_1.__decorate([
    observable
], DataTableComponent.prototype, "filterString", void 0);
tslib_1.__decorate([
    observable
], DataTableComponent.prototype, "limit", void 0);
tslib_1.__decorate([
    computed
], DataTableComponent.prototype, "filteredRows", null);
tslib_1.__decorate([
    computed
], DataTableComponent.prototype, "sortedRows", null);
tslib_1.__decorate([
    computed
], DataTableComponent.prototype, "limitedRows", null);
tslib_1.__decorate([
    computed
], DataTableComponent.prototype, "farItems", null);
DataTableComponent = tslib_1.__decorate([
    observer
], DataTableComponent);
export { DataTableComponent };
//# sourceMappingURL=data-table.js.map