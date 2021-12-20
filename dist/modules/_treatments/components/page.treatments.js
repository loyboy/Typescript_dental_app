import * as tslib_1 from "tslib";
import { Col, DataTableComponent, ProfileSquaredComponent, Row, SectionComponent } from "@common-components";
import { router, text, user } from "@core";
import { appointments, setting, Treatment, treatments } from "@modules";
import { num } from "@utils";
import { computed, observable } from "mobx";
import { observer } from "mobx-react";
import { IconButton, Panel, PanelType, TextField } from "office-ui-fabric-react";
import * as React from "react";
let Treatments = class Treatments extends React.Component {
    constructor() {
        super(...arguments);
        this.selectedID = router.currentLocation.split("/")[1];
    }
    get canEdit() {
        return user.currentUser.canEditTreatments;
    }
    get selectedIndex() {
        return treatments.list.findIndex(x => x._id === this.selectedID);
    }
    get selectedTreatment() {
        return treatments.list[this.selectedIndex];
    }
    render() {
        return (React.createElement("div", { className: "tc-pg p-15 p-l-10 p-r-10" },
            React.createElement(DataTableComponent, { onDelete: this.canEdit
                    ? id => {
                        treatments.deleteModal(id);
                    }
                    : undefined, commands: this.canEdit
                    ? [
                        {
                            key: "addNew",
                            title: "Add new",
                            name: text("Add new"),
                            onClick: () => {
                                const treatment = new Treatment();
                                treatments.list.push(treatment);
                                this.selectedID = treatment._id;
                            },
                            iconProps: {
                                iconName: "Add"
                            }
                        }
                    ]
                    : [], heads: [
                    text("Treatment"),
                    text("Expenses/unit"),
                    text("Done appointments"),
                    text("Upcoming appointments")
                ], rows: treatments.list.map(treatment => {
                    const now = new Date().getTime();
                    let done = 0;
                    let upcoming = 0;
                    const appointmentsArr = appointments.list;
                    for (let index = 0; index < appointmentsArr.length; index++) {
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
                    }
                    return {
                        id: treatment._id,
                        searchableString: treatment.searchableString,
                        cells: [
                            {
                                dataValue: treatment.type,
                                component: (React.createElement(ProfileSquaredComponent, { text: treatment.type, subText: `${text("Expenses")}: ${setting.getSetting("currencySymbol")}${treatment.expenses} ${text("per unit")}` })),
                                onClick: () => {
                                    this.selectedID = treatment._id;
                                },
                                className: "no-label"
                            },
                            {
                                dataValue: treatment.expenses,
                                component: (React.createElement("span", null,
                                    setting.getSetting("currencySymbol"),
                                    treatment.expenses)),
                                className: "hidden-xs"
                            },
                            {
                                dataValue: done,
                                component: (React.createElement("span", null,
                                    done,
                                    " ",
                                    text("done"))),
                                className: "hidden-xs"
                            },
                            {
                                dataValue: upcoming,
                                component: (React.createElement("span", null,
                                    upcoming,
                                    " ",
                                    text("upcoming"))),
                                className: "hidden-xs"
                            }
                        ]
                    };
                }), maxItemsOnLoad: 20 }),
            this.selectedTreatment ? (React.createElement(Panel, { isOpen: !!this.selectedTreatment, type: PanelType.medium, closeButtonAriaLabel: "Close", isLightDismiss: true, onDismiss: () => {
                    this.selectedID = "";
                }, onRenderNavigation: () => (React.createElement(Row, { className: "panel-heading" },
                    React.createElement(Col, { span: 20 }, this.selectedTreatment ? (React.createElement(ProfileSquaredComponent, { text: this.selectedTreatment.type, subText: `${text("Expenses")}: ${setting.getSetting("currencySymbol")}${this.selectedTreatment.expenses} ${text("per unit")}` })) : (React.createElement("p", null))),
                    React.createElement(Col, { span: 4, className: "close" },
                        React.createElement(IconButton, { iconProps: { iconName: "cancel" }, onClick: () => {
                                this.selectedID = "";
                            } })))) },
                React.createElement("div", { className: "treatment-editor" },
                    React.createElement(SectionComponent, { title: text("Treatment Details") },
                        React.createElement("div", { className: "treatment-input" },
                            React.createElement(TextField, { label: text("Treatment title"), value: this.selectedTreatment.type, onChange: (ev, val) => (treatments.list[this.selectedIndex].type = val), disabled: !this.canEdit }),
                            React.createElement(TextField, { label: text("Treatment expenses (per unit)"), type: "number", value: this.selectedTreatment.expenses.toString(), onChange: (ev, val) => (treatments.list[this.selectedIndex].expenses = num(val)), prefix: setting.getSetting("currencySymbol"), disabled: !this.canEdit })))))) : ("")));
    }
};
tslib_1.__decorate([
    observable
], Treatments.prototype, "selectedID", void 0);
tslib_1.__decorate([
    computed
], Treatments.prototype, "canEdit", null);
tslib_1.__decorate([
    computed
], Treatments.prototype, "selectedIndex", null);
tslib_1.__decorate([
    computed
], Treatments.prototype, "selectedTreatment", null);
Treatments = tslib_1.__decorate([
    observer
], Treatments);
export { Treatments };
//# sourceMappingURL=page.treatments.js.map