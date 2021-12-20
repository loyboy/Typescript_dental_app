import * as tslib_1 from "tslib";
import { router } from "@core";
import { patients } from "@modules";
import { observer } from "mobx-react";
import { Icon } from "office-ui-fabric-react";
import * as React from "react";
let PatientFinanceComponent = class PatientFinanceComponent extends React.Component {
    render() {
        const patient = patients.list.find(pt => pt._id === this.props.id) || {
            name: "not found"
        };
        return (React.createElement("a", { className: "plk-c " + this.props.className, onClick: () => {
                if (!this.props.notClickable) {
                    router.go(["patients", this.props.id, "finance"]);
                }
            } },
            React.createElement(Icon, { iconName: "FinancialSolid", className: "icon" })));
    }
};
PatientFinanceComponent = tslib_1.__decorate([
    observer
], PatientFinanceComponent);
export { PatientFinanceComponent };
//# sourceMappingURL=patient-finance-link.js.map