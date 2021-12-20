import * as tslib_1 from "tslib";
import { Col, Row } from "@common-components";
import { observable } from "mobx";
import { observer } from "mobx-react";
import { DetailsList, Icon, IconButton, SelectionMode, TextField } from "office-ui-fabric-react";
import * as React from "react";
let EditableListComponent = class EditableListComponent extends React.Component {
    constructor() {
        super(...arguments);
        this.valueToAdd = "";
        this.expandIndex = -1;
    }
    addItem() {
        if (this.valueToAdd.replace(/\W/, "").length) {
            this.props.value.push(this.valueToAdd);
            this.valueToAdd = "";
            (this.props.onChange || (() => { }))(this.props.value);
        }
    }
    render() {
        return (React.createElement("div", { className: "elc-c", style: this.props.style },
            React.createElement("div", { className: "editable-list" },
                React.createElement("div", { className: "input", style: this.props.value.length
                        ? {}
                        : { borderBottom: "none" } },
                    React.createElement(Row, null,
                        React.createElement(Col, { xs: this.props.disabled ? 24 : 20, sm: this.props.disabled ? 24 : 21 },
                            React.createElement("input", { className: "new-item-input", style: this.props.value.length > 0
                                    ? undefined
                                    : { borderBottom: "none" }, placeholder: this.props.label || undefined, onKeyDown: keydown => {
                                    if (keydown.keyCode === 13) {
                                        this.addItem();
                                        keydown.preventDefault();
                                    }
                                }, onKeyUp: keyUp => {
                                    if (keyUp.keyCode === 13) {
                                        this.addItem();
                                        keyUp.preventDefault();
                                    }
                                }, value: this.valueToAdd, onChange: e => (this.valueToAdd = e.target.value), disabled: this.props.disabled })),
                        React.createElement(Col, { xs: 4, sm: 3, style: { textAlign: "right" } }, this.props.disabled ? ("") : (React.createElement(Icon, { className: "input-icon", iconName: "Add", onClick: () => {
                                this.addItem();
                            } }))))),
                this.props.value.length ? (React.createElement("div", { className: "items" },
                    React.createElement(DetailsList, { compact: true, items: [
                            ...this.props.value.map((x, i) => [
                                React.createElement("div", { id: i.toString() },
                                    this.expandIndex === i ? (React.createElement("div", { className: "list-item" },
                                        React.createElement(TextField, { multiline: true, value: x, onBlur: () => (this.expandIndex = -1), disabled: this.props.disabled, autoFocus: true, onChange: (e, val) => {
                                                this.props.value[i] = val;
                                                (this.props
                                                    .onChange ||
                                                    (() => { }))(this.props.value);
                                            } }))) : (React.createElement("div", { className: "el-expander", onClick: () => {
                                            this.expandIndex = i;
                                        } }, x.length > 30
                                        ? x.substr(0, 25) +
                                            "..."
                                        : x)),
                                    React.createElement(IconButton, { className: "delete", iconProps: {
                                            iconName: "trash"
                                        }, onClick: e => {
                                            this.expandIndex = -1;
                                            this.props.value.splice(i, 1);
                                            (this.props.onChange ||
                                                (() => { }))(this.props.value);
                                        }, disabled: this.props.disabled }))
                            ])
                        ], isHeaderVisible: false, selectionMode: SelectionMode.none }))) : (""))));
    }
};
tslib_1.__decorate([
    observable
], EditableListComponent.prototype, "valueToAdd", void 0);
tslib_1.__decorate([
    observable
], EditableListComponent.prototype, "expandIndex", void 0);
EditableListComponent = tslib_1.__decorate([
    observer
], EditableListComponent);
export { EditableListComponent };
//# sourceMappingURL=editable-list.js.map