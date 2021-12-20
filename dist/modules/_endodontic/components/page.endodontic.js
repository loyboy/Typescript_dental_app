import * as tslib_1 from "tslib";
import { AsyncComponent, Col, DataTableComponent, ProfileComponent, ProfileSquaredComponent, Row, TagInputComponent } from "@common-components";
import { text, user } from "@core";
import { genderToString, EndoCase, endoCases, Patient, PatientAppointmentsPanel, patients, setting } from "@modules";
import { formatDate } from "@utils";
import { computed, observable } from "mobx";
import { observer } from "mobx-react";
import { DefaultButton, Icon, IconButton, Panel, PanelType, PersonaInitialsColor, TextField, TooltipHost } from "office-ui-fabric-react";
import { PatientProcedures } from "../../patients/components/patient-procedures";
import { DentalHistoryPanel } from "../../patients/components/dental-history";
import * as React from "react";
let EndoPage = class EndoPage extends React.Component {
    constructor() {
        super(...arguments);
        this.showAdditionPanel = false;
        this.newPatientName = "";
        this.selectedId = "";
        this.viewWhich = 0;
    }
    get selectedCase() {
        return endoCases.list.find(endoCase => endoCase._id === this.selectedId);
    }
    get selectedPatient() {
        if (this.selectedCase) {
            if (this.selectedCase.patient) {
                return this.selectedCase.patient;
            }
        }
    }
    get canEdit() {
        return user.currentUser.canEditOrtho;
    }
    render() {
        return (React.createElement("div", { className: "orthodontic-cases-component p-15 p-l-10 p-r-10" },
            React.createElement(DataTableComponent, { maxItemsOnLoad: 10, className: "orthodontic-cases-data-table", heads: [
                    text("Endodontic Patient"),
                    text("Started/Finished Treatment"),
                    text("Last/Next Appointment"),
                    text("Total/Outstanding Payments")
                ], rows: endoCases.filtered
                    .filter(orthoCase => orthoCase.patient)
                    .map(orthoCase => {
                    const patient = orthoCase.patient || new Patient();
                    return {
                        id: orthoCase._id,
                        searchableString: orthoCase.searchableString,
                        cells: [
                            {
                                dataValue: patient.name,
                                component: (React.createElement("div", null,
                                    React.createElement(ProfileComponent, { name: patient.name, secondaryElement: React.createElement("span", null,
                                            text(genderToString(patient.gender)),
                                            " ",
                                            "- ",
                                            patient.age,
                                            " ",
                                            text("years old")), size: 3 }),
                                    React.createElement("br", null),
                                    React.createElement(TooltipHost, { content: text("Patient Details") },
                                        React.createElement(IconButton, { className: "action-button", iconProps: {
                                                iconName: "DietPlanNotebook"
                                            }, onClick: () => {
                                                this.selectedId =
                                                    orthoCase._id;
                                                this.viewWhich = 1;
                                            } })),
                                    React.createElement(TooltipHost, { content: text("Dental History") },
                                        React.createElement(IconButton, { className: "action-button", iconProps: {
                                                iconName: "Teeth"
                                            }, onClick: () => {
                                                this.selectedId =
                                                    orthoCase._id;
                                                this.viewWhich = 2;
                                            } })),
                                    React.createElement(TooltipHost, { content: text("Endodontic Case Sheet") },
                                        React.createElement(IconButton, { className: "action-button", iconProps: {
                                                iconName: "GroupedList"
                                            }, onClick: () => {
                                                this.selectedId =
                                                    orthoCase._id;
                                                this.viewWhich = 3;
                                            } })),
                                    React.createElement(TooltipHost, { content: text("Orthodontic Album") },
                                        React.createElement(IconButton, { className: "action-button", iconProps: {
                                                iconName: "TripleColumn"
                                            }, onClick: () => {
                                                this.selectedId =
                                                    orthoCase._id;
                                                this.viewWhich = 4;
                                            } })),
                                    React.createElement(TooltipHost, { content: text("Gallery and X-Rays") },
                                        React.createElement(IconButton, { className: "action-button", iconProps: {
                                                iconName: "PhotoCollection"
                                            }, onClick: () => {
                                                this.selectedId =
                                                    orthoCase._id;
                                                this.viewWhich = 5;
                                            } })),
                                    user.currentUser
                                        .canViewAppointments ? (React.createElement(TooltipHost, { content: text("Patient Appointments") },
                                        React.createElement(IconButton, { className: "action-button", iconProps: {
                                                iconName: "Calendar"
                                            }, onClick: () => {
                                                this.selectedId =
                                                    orthoCase._id;
                                                this.viewWhich = 6;
                                            } }))) : (""),
                                    React.createElement(TooltipHost, { content: text("Delete") },
                                        React.createElement(IconButton, { className: "action-button delete", iconProps: {
                                                iconName: "Trash"
                                            }, onClick: () => endoCases.deleteModal(orthoCase._id), disabled: !this.canEdit })))),
                                className: "no-label"
                            },
                            {
                                dataValue: orthoCase.isFinished
                                    ? Infinity
                                    : orthoCase.startedDate,
                                component: (React.createElement("div", null,
                                    React.createElement(ProfileSquaredComponent, { text: orthoCase.isStarted
                                            ? formatDate(orthoCase.startedDate, setting.getSetting("date_format"))
                                            : "", subText: orthoCase.isStarted
                                            ? text("Started treatment")
                                            : text("Has not started yet"), size: 3, onRenderInitials: () => (React.createElement(Icon, { iconName: "info" })), onClick: () => { }, initialsColor: orthoCase.isStarted
                                            ? PersonaInitialsColor.teal
                                            : PersonaInitialsColor.transparent }),
                                    React.createElement("br", null),
                                    React.createElement(ProfileSquaredComponent, { text: orthoCase.isFinished
                                            ? formatDate(orthoCase.finishedDate, setting.getSetting("date_format"))
                                            : "", subText: orthoCase.isFinished
                                            ? text("Finished treatment")
                                            : text("Has not finished yet"), size: 3, onRenderInitials: () => (React.createElement(Icon, { iconName: "CheckMark" })), onClick: () => { }, initialsColor: orthoCase.isFinished
                                            ? PersonaInitialsColor.blue
                                            : PersonaInitialsColor.transparent }))),
                                className: "hidden-xs"
                            },
                            {
                                dataValue: (patient.nextAppointment || {
                                    date: 0
                                }).date,
                                component: (React.createElement("div", null,
                                    React.createElement(ProfileSquaredComponent, { text: patient.lastAppointment
                                            ? patient
                                                .lastAppointment
                                                .treatment
                                                ? patient
                                                    .lastAppointment
                                                    .treatment
                                                    .type
                                                : ""
                                            : "", subText: patient.lastAppointment
                                            ? formatDate(patient
                                                .lastAppointment
                                                .date, setting.getSetting("date_format"))
                                            : text("No last appointment"), size: 3, onRenderInitials: () => (React.createElement(Icon, { iconName: "Previous" })), onClick: () => { }, initialsColor: patient.lastAppointment
                                            ? undefined
                                            : PersonaInitialsColor.transparent }),
                                    React.createElement("br", null),
                                    React.createElement(ProfileSquaredComponent, { text: patient.nextAppointment
                                            ? patient
                                                .nextAppointment
                                                .treatment
                                                ? patient
                                                    .nextAppointment
                                                    .treatment
                                                    .type
                                                : ""
                                            : "", subText: patient.nextAppointment
                                            ? formatDate(patient
                                                .nextAppointment
                                                .date, setting.getSetting("date_format"))
                                            : text("No next appointment"), size: 3, onRenderInitials: () => (React.createElement(Icon, { iconName: "Next" })), onClick: () => { }, initialsColor: patient.nextAppointment
                                            ? undefined
                                            : PersonaInitialsColor.transparent }))),
                                className: "hidden-xs"
                            },
                            {
                                dataValue: patient.totalPayments,
                                component: (React.createElement("div", null,
                                    React.createElement(ProfileSquaredComponent, { text: setting.getSetting("currencySymbol") +
                                            patient.totalPayments.toString(), subText: text("Payments made"), size: 3, onRenderInitials: () => (React.createElement(Icon, { iconName: "CheckMark" })), onClick: () => { }, initialsColor: patient.totalPayments >
                                            0
                                            ? PersonaInitialsColor.darkBlue
                                            : PersonaInitialsColor.transparent }),
                                    React.createElement("br", null),
                                    React.createElement(ProfileSquaredComponent, { text: setting.getSetting("currencySymbol") +
                                            (patient.differenceAmount <
                                                0
                                                ? patient.outstandingAmount.toString()
                                                : patient.differenceAmount >
                                                    0
                                                    ? patient.overpaidAmount.toString()
                                                    : "0"), subText: patient.differenceAmount <
                                            0
                                            ? text("Outstanding amount")
                                            : patient.differenceAmount >
                                                0
                                                ? text("Overpaid amount")
                                                : text("No outstanding amount"), size: 3, onRenderInitials: () => (React.createElement(Icon, { iconName: "Cancel" })), onClick: () => { }, initialsColor: patient.differenceAmount !==
                                            0
                                            ? PersonaInitialsColor.darkRed
                                            : PersonaInitialsColor.transparent }))),
                                className: "hidden-xs"
                            }
                        ]
                    };
                }), commands: this.canEdit
                    ? [
                        {
                            key: "addNew",
                            title: "Add new",
                            name: text("Add new"),
                            onClick: () => (this.showAdditionPanel = true),
                            iconProps: {
                                iconName: "Add"
                            }
                        }
                    ]
                    : [] }),
            React.createElement(Panel, { isOpen: this.showAdditionPanel, type: PanelType.smallFixedFar, closeButtonAriaLabel: "Close", isLightDismiss: true, onDismiss: () => {
                    this.showAdditionPanel = false;
                } },
                React.createElement("h4", null, text("Choose patient")),
                React.createElement("br", null),
                React.createElement(TagInputComponent, { strict: true, value: [], options: endoCases.patientsWithNoOrtho.map(patient => ({
                        key: patient._id,
                        text: patient.name
                    })), onAdd: val => {
                        this.showAdditionPanel = false;
                        const orthoCase = new EndoCase();
                        orthoCase.patientID = val.key;
                        endoCases.list.push(orthoCase);
                        this.selectedId = orthoCase._id;
                        this.viewWhich = 3;
                    }, placeholder: text(`Type to select patient`) }),
                React.createElement("br", null),
                React.createElement("hr", null),
                React.createElement("h4", null, "Or add new patient"),
                React.createElement("br", null),
                React.createElement(TextField, { placeholder: text(`Patient name`), value: this.newPatientName, onChange: (e, v) => (this.newPatientName = v) }),
                React.createElement(DefaultButton, { onClick: () => {
                        const newPatient = new Patient();
                        newPatient.name = this.newPatientName;
                        const orthoCase = new EndoCase();
                        orthoCase.patientID = newPatient._id;
                        patients.list.push(newPatient);
                        endoCases.list.push(orthoCase);
                        this.newPatientName = "";
                        this.selectedId = orthoCase._id;
                        this.viewWhich = 3;
                    }, iconProps: {
                        iconName: "add"
                    }, text: text("Add new") })),
            React.createElement(Panel, { isOpen: !!(this.selectedCase &&
                    this.selectedPatient &&
                    this.viewWhich), type: this.viewWhich === 2 ? PanelType.custom : PanelType.medium, customWidth: '100%', closeButtonAriaLabel: "Close", isLightDismiss: true, onDismiss: () => {
                    this.selectedId = "";
                    this.viewWhich = 0;
                }, onRenderNavigation: () => {
                    if (!this.selectedCase) {
                        return React.createElement("div", null);
                    }
                    if (!this.selectedPatient) {
                        return React.createElement("div", null);
                    }
                    return (React.createElement(Row, { className: "panel-heading" },
                        React.createElement(Col, { span: 22 },
                            React.createElement(ProfileComponent, { name: this.selectedPatient.name, secondaryElement: React.createElement("span", null,
                                    this.viewWhich === 1
                                        ? text("Patient Details")
                                        : "",
                                    this.viewWhich === 2
                                        ? text("Dental History")
                                        : "",
                                    this.viewWhich === 3
                                        ? text("Endodontic Case Sheet")
                                        : "",
                                    this.viewWhich === 4
                                        ? text("Orthodontic Album")
                                        : "",
                                    this.viewWhich === 5
                                        ? text("Gallery and X-Rays")
                                        : "",
                                    this.viewWhich === 6
                                        ? text("Patient Appointments")
                                        : ""), size: 3 })),
                        React.createElement(Col, { span: 2, className: "close" },
                            React.createElement(IconButton, { iconProps: { iconName: "cancel" }, onClick: () => {
                                    this.selectedId = "";
                                    this.viewWhich = 0;
                                } }))));
                } },
                React.createElement("div", null, this.selectedCase && this.selectedPatient ? (React.createElement("div", { className: "ortho-single-component" },
                    this.viewWhich === 1 ? (React.createElement(AsyncComponent, { key: "patient-detail", loader: () => tslib_1.__awaiter(this, void 0, void 0, function* () {
                            const PatientDetailsPanel = (yield import("../../patients/components/patient-details"))
                                .PatientDetailsPanel;
                            return (React.createElement(PatientDetailsPanel, { patient: this.selectedPatient }));
                        }) })) : (""),
                    this.viewWhich === 2 && (React.createElement("div", null,
                        React.createElement("div", { style: { width: '100%' } },
                            React.createElement("div", { style: { width: '65%', backgroundColor: '#fff', padding: '8px', marginLeft: 'auto' } },
                                React.createElement(DentalHistoryPanel, { patient: this.selectedPatient })),
                            React.createElement("div", { style: { width: '100%', borderTop: '1px solid #999' } },
                                React.createElement(PatientProcedures, { patient: this.selectedPatient }))))),
                    this.viewWhich === 3 ? (React.createElement(AsyncComponent, { key: "ortho-case-sheet", loader: () => tslib_1.__awaiter(this, void 0, void 0, function* () {
                            const Component = (yield import("./case-sheet"))
                                .EndoCaseSheetPanel;
                            return this.selectedCase ? (React.createElement(Component, { orthoCase: this.selectedCase })) : (React.createElement("div", null));
                        }) })) : (""),
                    this.viewWhich === 4 ? (React.createElement(AsyncComponent, { key: "ortho-records", loader: () => tslib_1.__awaiter(this, void 0, void 0, function* () {
                            const Component = (yield import("./records"))
                                .OrthoRecordsPanel;
                            return this.selectedCase ? (React.createElement(Component, { orthoCase: this.selectedCase })) : (React.createElement("div", null));
                        }) })) : (""),
                    this.viewWhich === 5 ? (React.createElement(AsyncComponent, { key: "ortho-gallery", loader: () => tslib_1.__awaiter(this, void 0, void 0, function* () {
                            const Component = (yield import("./ortho-gallery"))
                                .OrthoGalleryPanel;
                            return this.selectedCase ? (React.createElement(Component, { orthoCase: this.selectedCase })) : (React.createElement("div", null));
                        }) })) : (""),
                    this.viewWhich === 6 ? (React.createElement(PatientAppointmentsPanel, { patient: this.selectedPatient })) : (""))) : ("")))));
    }
};
tslib_1.__decorate([
    observable
], EndoPage.prototype, "showAdditionPanel", void 0);
tslib_1.__decorate([
    observable
], EndoPage.prototype, "newPatientName", void 0);
tslib_1.__decorate([
    observable
], EndoPage.prototype, "selectedId", void 0);
tslib_1.__decorate([
    observable
], EndoPage.prototype, "viewWhich", void 0);
tslib_1.__decorate([
    computed
], EndoPage.prototype, "selectedCase", null);
tslib_1.__decorate([
    computed
], EndoPage.prototype, "selectedPatient", null);
tslib_1.__decorate([
    computed
], EndoPage.prototype, "canEdit", null);
EndoPage = tslib_1.__decorate([
    observer
], EndoPage);
export { EndoPage };
//# sourceMappingURL=page.endodontic.js.map