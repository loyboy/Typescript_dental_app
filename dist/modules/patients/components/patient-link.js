import * as tslib_1 from "tslib";
import { router } from "@core";
import { patients } from "@modules";
import { observer } from "mobx-react";
import { Icon } from "office-ui-fabric-react";
import * as React from "react";
let PatientLinkComponent = class PatientLinkComponent extends React.Component {
    render() {
        const patient = patients.list.find(pt => pt._id === this.props.id) || {
            name: "not found"
        };
        return (React.createElement("a", { className: "plk-c " + this.props.className, onClick: () => {
                if (!this.props.notClickable) {
                    router.go(["patients", this.props.id]);
                }
            } },
            React.createElement(Icon, { iconName: "ContactCard", className: "icon" }),
            "\u00A0",
            patient.name));
    }
};
PatientLinkComponent = tslib_1.__decorate([
    observer
], PatientLinkComponent);
export { PatientLinkComponent };
//# sourceMappingURL=patient-link.js.map