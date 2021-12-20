import * as tslib_1 from "tslib";
import { SectionComponent } from "@common-components";
import { text, user } from "@core";
import { setting, treatments } from "@modules";
import { computed } from "mobx";
import { observer } from "mobx-react";
import { Dropdown, TextField } from "office-ui-fabric-react";
import * as React from "react";
let TreatmentDetailsPanel = class TreatmentDetailsPanel extends React.Component {
    get canEdit() {
        return user.currentUser.canEditPatients;
    }
    render() {
        return (React.createElement("div", { className: "treatment-editor" },
            React.createElement(SectionComponent, { title: text("Lab Order Details") },
                React.createElement("div", { className: "treatment-input" },
                    React.createElement(TextField, { label: text("Lab Order item"), value: this.props.treat.item, onChange: (ev, val) => (treatments.list[this.props.selected].item = val), disabled: !this.canEdit }),
                    React.createElement(TextField, { label: text("Lab Order Description"), type: "text", value: this.props.treat.desc, onChange: (ev, val) => (treatments.list[this.props.selected].desc = val), disabled: !this.canEdit }),
                    React.createElement(TextField, { label: text("Lab Order lab name"), type: "text", value: this.props.treat.lab_name, onChange: (ev, val) => (treatments.list[this.props.selected].lab_name = val), disabled: !this.canEdit }),
                    React.createElement(TextField, { label: text("Lab Order Patient"), type: "text", value: this.props.treat.patient_name, onChange: (ev, val) => (treatments.list[this.props.selected].patient_name = val), disabled: !this.canEdit }),
                    React.createElement(TextField, { label: text("Lab Order fees"), type: "number", value: this.props.treat.fees, onChange: (ev, val) => (treatments.list[this.props.selected].fees = val.toString()), prefix: setting.getSetting("currencySymbol"), disabled: !this.canEdit }),
                    React.createElement(Dropdown, { disabled: !this.canEdit, placeholder: text("Status"), options: [{ key: "delivered", text: "delivered" }, {
                                key: "delayed", text: "delayed"
                            }, { key: "inprocessing", text: "inprocessing" }], defaultSelectedKey: this.props.treat.status, onChange: (ev, has) => {
                            treatments.list[this.props.selected].status = has.key;
                        } })))));
    }
};
tslib_1.__decorate([
    computed
], TreatmentDetailsPanel.prototype, "canEdit", null);
TreatmentDetailsPanel = tslib_1.__decorate([
    observer
], TreatmentDetailsPanel);
export { TreatmentDetailsPanel };
//# sourceMappingURL=treatment-details.js.map