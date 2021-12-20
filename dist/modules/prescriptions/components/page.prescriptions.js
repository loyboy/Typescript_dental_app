import * as tslib_1 from "tslib";
import { Col, DataTableComponent, ProfileSquaredComponent, Row, SectionComponent } from "@common-components";
import { router, text, user } from "@core";
import { itemFormToString, PrescriptionItem, prescriptionItemForms, prescriptions, stringToItemForm } from "@modules";
import { num } from "@utils";
import { computed, observable } from "mobx";
import { observer } from "mobx-react";
import { Dropdown, IconButton, Panel, PanelType, TextField } from "office-ui-fabric-react";
import { Dialog, DialogType } from "office-ui-fabric-react";
import * as React from "react";
let PrescriptionsPage = class PrescriptionsPage extends React.Component {
    constructor() {
        super(...arguments);
        this.showMenu = true;
        this.selectedID = router.currentLocation.split("/")[1];
    }
    get selectedIndex() {
        return prescriptions.list.findIndex(x => x._id === this.selectedID);
    }
    get selectedPrescription() {
        return prescriptions.list[this.selectedIndex];
    }
    get canEdit() {
        return user.currentUser.canEditPrescriptions;
    }
    render() {
        return (React.createElement("div", { className: "pc-pg p-15 p-l-10 p-r-10" },
            React.createElement(DataTableComponent, { onPrint: this.canEdit
                    ? id => {
                        React.createElement(Dialog, { hidden: false, 
                            //onDismiss={this.props.onDismiss}
                            dialogContentProps: {
                                type: DialogType.largeHeader,
                                title: 'Type your Name and Upload an Icon as A Dentist',
                                subText: 'Follow instructions'
                            }, modalProps: {
                                isBlocking: false,
                                styles: { main: { maxWidth: 450 } }
                            } },
                            React.createElement(TextField, { label: "Dentist's Name: ", type: "text" }),
                            React.createElement("br", null),
                            React.createElement(TextField, { label: "Print Logo: ", type: "file" }));
                    }
                    : undefined, onDelete: this.canEdit
                    ? id => {
                        prescriptions.deleteModal(id);
                    }
                    : undefined, commands: this.canEdit
                    ? [
                        {
                            key: "addNew",
                            title: "Add new",
                            name: text("Add new"),
                            onClick: () => {
                                const prescription = new PrescriptionItem();
                                prescriptions.list.push(prescription);
                                this.selectedID = prescription._id;
                            },
                            iconProps: {
                                iconName: "Add"
                            }
                        }
                    ]
                    : [], heads: [
                    text("Item name"),
                    text("Dose"),
                    text("Frequency"),
                    text("Form")
                ], rows: prescriptions.list.map(prescription => {
                    return {
                        id: prescription._id,
                        searchableString: prescription.searchableString,
                        cells: [
                            {
                                dataValue: prescription.name,
                                component: (React.createElement(ProfileSquaredComponent, { text: prescription.name, subText: `${prescription.doseInMg}${text("mg")} ${prescription.timesPerDay}X${prescription.unitsPerTime} ${text(itemFormToString(prescription.form))}` })),
                                onClick: () => {
                                    this.selectedID = prescription._id;
                                },
                                className: "no-label"
                            },
                            {
                                dataValue: prescription.doseInMg,
                                component: (React.createElement("span", null,
                                    prescription.doseInMg,
                                    " ",
                                    text("mg"))),
                                className: "hidden-xs"
                            },
                            {
                                dataValue: prescription.timesPerDay,
                                component: (React.createElement("span", null,
                                    prescription.timesPerDay,
                                    " *",
                                    " ",
                                    prescription.unitsPerTime)),
                                className: "hidden-xs"
                            },
                            {
                                dataValue: prescription.form,
                                component: (React.createElement("span", null, text(itemFormToString(prescription.form)))),
                                className: "hidden-xs"
                            }
                        ]
                    };
                }), maxItemsOnLoad: 20 }),
            this.selectedPrescription ? (React.createElement(Panel, { isOpen: !!this.selectedPrescription, type: PanelType.medium, closeButtonAriaLabel: "Close", isLightDismiss: true, onDismiss: () => {
                    this.selectedID = "";
                }, onRenderNavigation: () => (React.createElement(Row, { className: "panel-heading" },
                    React.createElement(Col, { span: 20 }, this.selectedPrescription ? (React.createElement(ProfileSquaredComponent, { text: this.selectedPrescription.name, subText: `${this.selectedPrescription
                            .doseInMg}${text("mg")} ${this.selectedPrescription
                            .timesPerDay}X${this.selectedPrescription
                            .unitsPerTime} ${text(itemFormToString(this.selectedPrescription
                            .form))}` })) : (React.createElement("p", null))),
                    React.createElement(Col, { span: 4, className: "close" },
                        React.createElement(IconButton, { iconProps: { iconName: "cancel" }, onClick: () => {
                                this.selectedID = "";
                            } })))) },
                React.createElement("div", { className: "prescription-editor" },
                    React.createElement(SectionComponent, { title: text("Prescription Details") },
                        React.createElement(TextField, { label: text("Item name"), value: this.selectedPrescription.name, onChange: (ev, val) => (prescriptions.list[this.selectedIndex].name = val), disabled: !this.canEdit }),
                        React.createElement(Row, { gutter: 6 },
                            React.createElement(Col, { md: 8 },
                                React.createElement(TextField, { label: text("Dosage in mg"), type: "number", value: this.selectedPrescription.doseInMg.toString(), onChange: (ev, val) => (prescriptions.list[this.selectedIndex].doseInMg = num(val)), disabled: !this.canEdit })),
                            React.createElement(Col, { md: 8 },
                                React.createElement(TextField, { label: text("Times per day"), type: "number", value: this.selectedPrescription.timesPerDay.toString(), onChange: (ev, val) => (prescriptions.list[this.selectedIndex].timesPerDay = num(val)), disabled: !this.canEdit })),
                            React.createElement(Col, { md: 8 },
                                React.createElement(TextField, { label: text("Units per time"), type: "number", value: this.selectedPrescription.unitsPerTime.toString(), onChange: (ev, val) => (prescriptions.list[this.selectedIndex].unitsPerTime = num(val)), disabled: !this.canEdit }))),
                        React.createElement(Dropdown, { disabled: !this.canEdit, label: text("Item form"), className: "form-picker", selectedKey: itemFormToString(this.selectedPrescription.form), options: prescriptionItemForms.map(form => {
                                return {
                                    key: form,
                                    text: text(form)
                                };
                            }), onChange: (ev, newValue) => {
                                prescriptions.list[this.selectedIndex].form = stringToItemForm(newValue.text);
                            } }),
                        React.createElement(TextField, { label: "Notes", multiline: true, rows: 4, value: this.selectedPrescription.notes.toString(), onChange: (ev, val) => (prescriptions.list[this.selectedIndex].notes = val) }))))) : ("")));
    }
};
tslib_1.__decorate([
    observable
], PrescriptionsPage.prototype, "showMenu", void 0);
tslib_1.__decorate([
    observable
], PrescriptionsPage.prototype, "selectedID", void 0);
tslib_1.__decorate([
    computed
], PrescriptionsPage.prototype, "selectedIndex", null);
tslib_1.__decorate([
    computed
], PrescriptionsPage.prototype, "selectedPrescription", null);
tslib_1.__decorate([
    computed
], PrescriptionsPage.prototype, "canEdit", null);
PrescriptionsPage = tslib_1.__decorate([
    observer
], PrescriptionsPage);
export { PrescriptionsPage };
//# sourceMappingURL=page.prescriptions.js.map