import * as tslib_1 from "tslib";
import { SectionComponent, } from "@common-components";
import { text, user } from "@core";
import { Access, Obturation, Cleaning } from "@modules";
import { num } from "@utils";
import { EditableListComponent } from "common-components/editable-list/editable-list";
import { computed } from "mobx";
import { observer } from "mobx-react";
import { Dropdown, TextField, Label, DefaultButton, IconButton, } from "office-ui-fabric-react";
import * as React from "react";
const EndoDiv = observer(({ canEdit, orthoCase, index }) => (React.createElement(React.Fragment, null,
    React.createElement("div", { style: { display: "flex", width: "100%" } },
        React.createElement("span", { style: { width: "80%" } },
            React.createElement(TextField, { disabled: canEdit, min: 0, max: 180, value: orthoCase.workinglen[index].toString(), onChange: (ev, v) => {
                    orthoCase.workinglen[index] = v;
                }, type: "text", prefix: text(`Working Length of Canal ${index + 1} `) })),
        React.createElement("span", { style: { width: "20%" } },
            React.createElement("div", { className: "" },
                React.createElement(IconButton, { className: "delete-button", iconProps: {
                        iconName: "delete",
                    }, onClick: () => {
                        orthoCase.workinglen.splice(index, 1);
                    } })))))));
let EndoCaseSheetPanel = class EndoCaseSheetPanel extends React.Component {
    get canEdit() {
        return user.currentUser.canEditOrtho;
    }
    render() {
        return (React.createElement("div", null,
            React.createElement(SectionComponent, { title: text(`Features`) },
                React.createElement(Label, null,
                    " ",
                    text(`Access`),
                    " "),
                React.createElement(Dropdown, { disabled: !this.canEdit, placeholder: text("Access"), options: Object.keys(Access).map((x) => ({
                        key: x,
                        text: text(Access[x]),
                    })), defaultSelectedKey: this.props.orthoCase.access, onChange: (ev, has) => {
                        this.props.orthoCase.access = has.key;
                    }, prefix: text(`Access`) }),
                React.createElement("br", null),
                React.createElement(Label, null,
                    " ",
                    text(`Cleaning and Shaping`),
                    " "),
                React.createElement(Dropdown, { disabled: !this.canEdit, placeholder: text("Cleaning / Shaping"), options: Object.keys(Cleaning).map((x) => ({
                        key: x,
                        text: text(Cleaning[x]),
                    })), defaultSelectedKey: this.props.orthoCase.cleaning, onChange: (ev, has) => {
                        this.props.orthoCase.cleaning = has.key;
                    }, prefix: text(`Cleaning and Shaping`) }),
                React.createElement("br", null),
                React.createElement(Label, null,
                    " ",
                    text(`Obturbation`),
                    " "),
                React.createElement(Dropdown, { disabled: !this.canEdit, placeholder: text("Obturbation"), options: Object.keys(Obturation).map((x) => ({
                        key: x,
                        text: text(Obturation[x]),
                    })), defaultSelectedKey: this.props.orthoCase.obturation, onChange: (ev, has) => {
                        this.props.orthoCase.obturation = has.key;
                    }, prefix: text(`Obturbation`) }),
                React.createElement("br", null),
                React.createElement(TextField, { disabled: !this.canEdit, min: 0, max: 180, value: this.props.orthoCase.canals.toString(), onChange: (ev, v) => {
                        this.props.orthoCase.canals = num(v);
                    }, type: "number", prefix: text(`Number of Canals`) }),
                React.createElement(DefaultButton, { text: "Add New Working Length", allowDisabledFocus: true, onClick: (e) => {
                        this.props.orthoCase.workinglen.push("");
                    } }),
                React.createElement("br", null),
                this.props.orthoCase.workinglen &&
                    this.props.orthoCase.workinglen.map((item, i) => {
                        return (React.createElement(EndoDiv, { key: i, index: i, orthoCase: this.props.orthoCase, canEdit: !this.canEdit }));
                    })),
            React.createElement(SectionComponent, { title: text(`Problems`) },
                React.createElement(EditableListComponent, { disabled: !this.canEdit, label: text("Patient concerns"), value: this.props.orthoCase.problemsList, onChange: (v) => {
                        this.props.orthoCase.problemsList = v;
                        this.props.orthoCase.triggerUpdate++;
                    } }),
                React.createElement("br", null),
                React.createElement("br", null),
                React.createElement("h3", null, text("Other Problems")),
                React.createElement(TextField, { label: "", value: this.props.orthoCase.problemsOther, multiline: true, rows: 5 }))));
    }
};
tslib_1.__decorate([
    computed
], EndoCaseSheetPanel.prototype, "canEdit", null);
EndoCaseSheetPanel = tslib_1.__decorate([
    observer
], EndoCaseSheetPanel);
export { EndoCaseSheetPanel };
//# sourceMappingURL=case-sheet.js.map