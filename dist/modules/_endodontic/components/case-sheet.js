import * as tslib_1 from "tslib";
import { SectionComponent } from "@common-components";
import { text, user } from "@core";
import { Access, Obturation, Cleaning } from "@modules";
import { num } from "@utils";
import { EditableListComponent } from "common-components/editable-list/editable-list";
import { computed } from "mobx";
import { observer } from "mobx-react";
import { ConstrainMode, DetailsList, Dropdown, MessageBar, MessageBarType, SelectionMode, TextField } from "office-ui-fabric-react";
import * as React from "react";
let EndoCaseSheetPanel = class EndoCaseSheetPanel extends React.Component {
    get canEdit() {
        return user.currentUser.canEditOrtho;
    }
    render() {
        return (React.createElement("div", null,
            React.createElement(SectionComponent, { title: text(`Features`) },
                React.createElement(Dropdown, { disabled: !this.canEdit, placeholder: text("Access"), options: Object.keys(Access).map(x => ({
                        key: x,
                        text: text(Access[x])
                    })), defaultSelectedKey: this.props.orthoCase.access, onChange: (ev, has) => {
                        this.props.orthoCase.access = has.key;
                    } }),
                React.createElement(Dropdown, { disabled: !this.canEdit, placeholder: text("Obturbation"), options: Object.keys(Obturation).map(x => ({
                        key: x,
                        text: text(Obturation[x])
                    })), defaultSelectedKey: this.props.orthoCase.obturation, onChange: (ev, has) => {
                        this.props.orthoCase.obturation = has.key;
                    } }),
                React.createElement(Dropdown, { disabled: !this.canEdit, placeholder: text("Cleaning / Shaping"), options: Object.keys(Cleaning).map(x => ({
                        key: x,
                        text: text(Cleaning[x])
                    })), defaultSelectedKey: this.props.orthoCase.cleaning, onChange: (ev, has) => {
                        this.props.orthoCase.cleaning = has.key;
                    } }),
                React.createElement(TextField, { disabled: !this.canEdit, min: 0, max: 180, value: this.props.orthoCase.workinglength.toString(), onChange: (ev, v) => {
                        this.props.orthoCase.workinglength = num(v);
                    }, type: "number", prefix: text(`Working Length of Canals`) }),
                React.createElement(TextField, { disabled: !this.canEdit, min: 0, max: 180, value: this.props.orthoCase.canals.toString(), onChange: (ev, v) => {
                        this.props.orthoCase.canals = num(v);
                    }, type: "number", prefix: text(`Number of Canals`) })),
            React.createElement(SectionComponent, { title: text(`Problems`) },
                React.createElement(EditableListComponent, { disabled: !this.canEdit, label: text("Patient concerns"), value: this.props.orthoCase.problemsList, onChange: v => {
                        this.props.orthoCase.problemsList = v;
                        this.props.orthoCase.triggerUpdate++;
                    } }),
                React.createElement("br", null),
                React.createElement("br", null),
                React.createElement("h3", null, text("Other Problems")),
                this.props.orthoCase.computedProblems.length === 0 ? (React.createElement(MessageBar, { messageBarType: MessageBarType.info }, text("The case sheet of this patient does not show any problems that needs orthodontic treatment"))) : (React.createElement(DetailsList, { constrainMode: ConstrainMode.horizontalConstrained, compact: true, items: [
                        ...this.props.orthoCase.computedProblems.map((x, i) => [`${i + 1}. ${x}`])
                    ], isHeaderVisible: false, selectionMode: SelectionMode.none })))));
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