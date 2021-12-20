import * as tslib_1 from "tslib";
import * as React from "react";
import { computed, observable } from "mobx";
import { observer } from "mobx-react";
import { router, text, user } from "@core";
import { Col, DataTableComponent, Row, AsyncComponent, } from "@common-components";
import { Consent, consents } from "@modules";
import { IconButton, Panel, PanelType, } from "office-ui-fabric-react";
let Consents = class Consents extends React.Component {
    constructor() {
        super(...arguments);
        this.selectedID = router.currentLocation.split("/")[1];
    }
    get canEdit() {
        return user.currentUser.canEditTreatments;
    }
    get selectedIndex() {
        return consents.list.findIndex((x) => x._id === this.selectedID);
    }
    get selectedConsent() {
        return consents.list[this.selectedIndex];
    }
    render() {
        return (React.createElement("div", { className: "tc-pg p-15 p-l-10 p-r-10" },
            React.createElement(DataTableComponent, { onDelete: this.canEdit
                    ? (id) => {
                        consents.deleteModal(id);
                    }
                    : undefined, commands: this.canEdit
                    ? [
                        {
                            key: "addNew",
                            title: "Add new",
                            name: text("Add new"),
                            onClick: () => {
                                const c = new Consent();
                                consents.list.push(c);
                                this.selectedID = c._id;
                            },
                            iconProps: {
                                iconName: "Add",
                            },
                        },
                    ]
                    : [], heads: [text("Consent ID"), text("Title")], rows: consents.list.map((consent) => {
                    /*	const now = new Date().getTime();
                            let done = 0;
                            let upcoming = 0;
        
                            const appointmentsArr = appointments.list;
        
                            for (
                                let index = 0;
                                index < appointmentsArr.length;
                                index++
                            ) {
                                const appointment = appointmentsArr[index];
                                if (appointment.treatmentID !== treatment._id) {
                                    continue;
                                }
                                if (appointment.date > now) {
                                    upcoming++;
                                }
                                if (appointment.isDone) {
                                    done++;
                                }
                            }*/
                    return {
                        id: consent._id,
                        searchableString: consent.title,
                        cells: [
                            {
                                dataValue: consent._id,
                                component: (React.createElement("span", null,
                                    React.createElement("b", null,
                                        " #",
                                        consent._id,
                                        " "))),
                                onClick: () => {
                                    this.selectedID = consent._id;
                                },
                                className: "no-label",
                            },
                            {
                                dataValue: consent._id,
                                component: (React.createElement("span", null, consent.title ? consent.title : "")),
                                className: "hidden-xs",
                            },
                            {
                                dataValue: consent._id,
                                component: React.createElement(IconButton, { iconProps: { iconName: "Edit" } }),
                                onClick: () => {
                                    this.selectedID = consent._id;
                                },
                                className: "no-label",
                            },
                        ],
                    };
                }), maxItemsOnLoad: 20 }),
            this.selectedConsent ? (React.createElement(Panel, { isOpen: !!this.selectedConsent, type: PanelType.medium, closeButtonAriaLabel: "Close", isLightDismiss: true, onDismiss: () => {
                    this.selectedID = "";
                }, onRenderNavigation: () => (React.createElement(Row, { className: "panel-heading" },
                    React.createElement(Col, { span: 20 }),
                    React.createElement(Col, { span: 4, className: "close" },
                        React.createElement(IconButton, { iconProps: { iconName: "cancel" }, onClick: () => {
                                this.selectedID = "";
                            } })))) },
                React.createElement(AsyncComponent, { key: "", loader: () => tslib_1.__awaiter(this, void 0, void 0, function* () {
                        const ConsentsDetailsPanel = (yield import("./consents-details")).ConsentsDetailsPanel;
                        return (React.createElement(ConsentsDetailsPanel, { consent: this.selectedConsent, selected: this.selectedIndex }));
                    }) }))) : ("")));
    }
};
tslib_1.__decorate([
    observable
], Consents.prototype, "selectedID", void 0);
tslib_1.__decorate([
    computed
], Consents.prototype, "canEdit", null);
tslib_1.__decorate([
    computed
], Consents.prototype, "selectedIndex", null);
tslib_1.__decorate([
    computed
], Consents.prototype, "selectedConsent", null);
Consents = tslib_1.__decorate([
    observer
], Consents);
export { Consents };
//# sourceMappingURL=page.js.map