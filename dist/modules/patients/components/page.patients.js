import * as tslib_1 from "tslib";
import { AsyncComponent, Col, DataTableComponent, ProfileComponent, ProfileSquaredComponent, Row, TagComponent, } from "@common-components";
import { router, text, user } from "@core";
import { genderToString, Patient, PatientAppointmentsPanel, PatientAppointmentsPanelV2, PatientGalleryPanel, PatientPaymentPanel, patients, staff, appointments, setting, insurances, EndoCase, endoCases, } from "@modules";
import { formatDate } from "@utils";
import { computed, observable } from "mobx";
import { observer } from "mobx-react";
import { Icon, IconButton, Panel, PanelType, PersonaInitialsColor, TooltipHost, Dropdown, Dialog, DialogType, ChoiceGroup, DialogFooter, PrimaryButton, DefaultButton, TextField, Modal, } from "office-ui-fabric-react";
import * as React from "react";
import { EditableListComponent } from "common-components/editable-list/editable-list";
import { format } from "date-fns";
import { Table } from "react-bootstrap";
import { DentalHistoryPanel } from "./dental-history";
let PatientsPage = class PatientsPage extends React.Component {
    constructor() {
        super(...arguments);
        this.state = {
            dialog: {
                open: false,
                procedureId: "",
                status: "",
            },
            endodontic: {
                open: false,
                endoCaseId: "",
            },
            tableTabIndex: 0,
            showMoreProcedure: true,
            viewAppointment: false,
            selectedProcedureId: "",
            showMoreReports: true,
            addNewReport: false,
            newReportValue: "",
        };
        this.location = router.currentLocation.split("/");
        this.selectedId = this.location[1];
        this.viewWhich = this.location.length === 3 ? 5 : this.location[1] ? 1 : 0;
        this.getStaffByAppointment = (procedureId) => {
            const foundAppointment = appointments.list.find((appointment) => appointment.procedureId === procedureId);
            const staffName = [];
            if (foundAppointment && foundAppointment.staffID.length) {
                foundAppointment.staffID.forEach((id) => {
                    const foundStaff = staff.list.find((s) => s._id === id);
                    if (foundStaff) {
                        staffName.push(foundStaff.name);
                    }
                });
            }
            return staffName;
        };
    }
    get selectedCase() {
        return endoCases.list.find((endoCase) => endoCase._id === this.state.endodontic.endoCaseId);
    }
    get patient() {
        return patients.list.find((patient) => patient._id === this.selectedId);
    }
    get canEdit() {
        return user.currentUser.canEditPatients;
    }
    render() {
        const procedureList = this.patient &&
            this.patient.procedures &&
            this.patient.procedures.length > 1
            ? [...this.patient.procedures]
            : [];
        procedureList.reverse();
        procedureList.pop();
        if (this.state.showMoreProcedure) {
            procedureList.splice(3);
        }
        const reportsList = this.patient && this.patient.reports.length
            ? [...this.patient.reports]
            : [];
        reportsList.reverse();
        if (this.state.showMoreReports) {
            reportsList.splice(3);
        }
        return (React.createElement("div", { className: "patients-component p-15 p-l-10 p-r-10" },
            this.patient ? (React.createElement(Panel, { key: this.selectedId + this.viewWhich, isOpen: !!this.patient, type: this.viewWhich === 2 || this.viewWhich === 5
                    ? PanelType.custom
                    : PanelType.medium, customWidth: "100%", closeButtonAriaLabel: "Close", isLightDismiss: true, onDismiss: () => {
                    this.selectedId = "";
                    this.viewWhich = 0;
                }, onRenderNavigation: () => {
                    return (React.createElement(Row, { className: "panel-heading" },
                        React.createElement(Col, { span: 22 },
                            React.createElement(ProfileComponent, { name: this.patient.name, secondaryElement: React.createElement("div", null,
                                    this.viewWhich === 1 ? text("Patient Details") : "",
                                    this.viewWhich === 2 ? text("Dental History") : "",
                                    this.viewWhich === 3
                                        ? text("Gallery and X-Rays")
                                        : "",
                                    this.viewWhich === 4
                                        ? text("Patient Appointments")
                                        : "",
                                    this.viewWhich === 5 ? text("Financial") : ""), size: 3 })),
                        React.createElement(Col, { span: 2, className: "close" },
                            React.createElement(IconButton, { iconProps: { iconName: "cancel" }, onClick: () => {
                                    this.selectedId = "";
                                    this.viewWhich = 0;
                                } }))));
                } },
                this.viewWhich === 1 ? (React.createElement(AsyncComponent, { key: "", loader: () => tslib_1.__awaiter(this, void 0, void 0, function* () {
                        const PatientDetailsPanel = (yield import("./patient-details")).PatientDetailsPanel;
                        return React.createElement(PatientDetailsPanel, { patient: this.patient });
                    }) })) : (""),
                this.viewWhich === 2 ? (React.createElement("div", null,
                    React.createElement(Panel
                    //  key={this.selectedId + this.state.viewAppointment}
                    , { 
                        //  key={this.selectedId + this.state.viewAppointment}
                        isOpen: this.state.viewAppointment || this.state.endodontic.open, type: PanelType.medium, customWidth: "100%", closeButtonAriaLabel: "Close", isLightDismiss: true, onDismiss: () => {
                            this.setState({
                                viewAppointment: false,
                                endodontic: { open: false, procedureId: "" },
                            });
                        }, onRenderNavigation: () => {
                            return (React.createElement(Row, { className: "panel-heading" },
                                React.createElement(Col, { span: 22 },
                                    React.createElement(ProfileComponent, { name: this.patient.name, secondaryElement: React.createElement("div", null, (this.state.viewAppointment &&
                                            text("Patient Appointments")) ||
                                            (this.state.endodontic.open &&
                                                text("Endodontic Case Sheet"))), size: 3 })),
                                React.createElement(Col, { span: 2, className: "close" },
                                    React.createElement(IconButton, { iconProps: { iconName: "cancel" }, onClick: () => {
                                            this.setState({
                                                viewAppointment: false,
                                                endodontic: { open: false, procedureId: "" },
                                            });
                                        } }))));
                        } },
                        this.state.endodontic.open ? (React.createElement(AsyncComponent, { key: "", loader: () => tslib_1.__awaiter(this, void 0, void 0, function* () {
                                const EndoCaseSheetPanelV2 = (yield import("./case-sheetV2")).EndoCaseSheetPanelV2;
                                return (React.createElement(EndoCaseSheetPanelV2, { orthoCase: this.selectedCase }));
                            }) })) : (""),
                        this.state.viewAppointment ? (React.createElement(PatientAppointmentsPanelV2, { selectedProcedureId: this.state.selectedProcedureId, patient: this.patient })) : ("")),
                    React.createElement("div", { style: { width: "100%" } },
                        React.createElement("div", { style: { width: "100%", padding: "8px" } }, this.state.addNewReport ? (React.createElement("div", null,
                            React.createElement(Modal, { isOpen: true, containerClassName: "container" },
                                React.createElement("div", { className: "modal-header" },
                                    React.createElement(Row, { gutter: 12 },
                                        React.createElement(Col, { sm: 24 },
                                            React.createElement("h4", null, "Add New Report")))),
                                React.createElement("div", { style: { padding: "10px" } },
                                    React.createElement(Row, { gutter: 12 },
                                        React.createElement(Col, { sm: 24 },
                                            React.createElement(TextField, { value: this.state.newReportValue, multiline: true, autoAdjustHeight: true, onChange: (ev, reportValue) => this.setState({
                                                    newReportValue: reportValue,
                                                }), style: { width: "95%", height: "500px" } }))),
                                    React.createElement(Row, { gutter: 12 },
                                        React.createElement("div", { style: { float: "right" } },
                                            React.createElement(DefaultButton, { text: "Cancel", onClick: () => {
                                                    this.setState({
                                                        addNewReport: false,
                                                        newReportValue: "",
                                                    });
                                                }, style: { "margin-right": "15px" } }),
                                            React.createElement(PrimaryButton, { text: "Save", onClick: () => {
                                                    debugger;
                                                    if (this.state.newReportValue !== "") {
                                                        const reports = [
                                                            ...this.patient.reports,
                                                            this.state.newReportValue,
                                                        ];
                                                        this.patient.reports = reports;
                                                        this.setState({
                                                            addNewReport: false,
                                                            newReportValue: "",
                                                        });
                                                    }
                                                } }))))))) : (React.createElement(DentalHistoryPanel, { toggleProcedureTable: () => this.setState({ tableTabIndex: 1 }), patient: this.patient })))),
                    React.createElement("div", { style: {
                            width: "100%",
                            borderTop: "1px solid #999",
                            marginTop: "20px",
                        } },
                        React.createElement("div", { className: "d-flex mt-3" },
                            React.createElement("p", { style: this.state.tableTabIndex === 0
                                    ? {
                                        color: "#2d89ef",
                                        padding: "10px",
                                        cursor: "pointer",
                                    }
                                    : { padding: "10px", cursor: "pointer" }, onClick: () => {
                                    this.setState({ tableTabIndex: 0 });
                                } }, "Diagnosis Table"),
                            React.createElement("p", { style: this.state.tableTabIndex === 1
                                    ? {
                                        color: "#2d89ef",
                                        padding: "10px",
                                        cursor: "pointer",
                                    }
                                    : { padding: "10px", cursor: "pointer" }, onClick: () => {
                                    this.setState({ tableTabIndex: 1 });
                                } }, "Procedure Table"),
                            React.createElement("p", { style: this.state.tableTabIndex === 2
                                    ? {
                                        color: "#2d89ef",
                                        padding: "10px",
                                        cursor: "pointer",
                                    }
                                    : { padding: "10px", cursor: "pointer" }, onClick: () => {
                                    this.setState({ tableTabIndex: 2 });
                                } }, "Report")),
                        this.state.tableTabIndex === 0 && (React.createElement(DataTableComponent, { maxItemsOnLoad: 3, className: "patients-data-table", heads: [
                                text("Tooth No."),
                                text("Tooth Place"),
                                text("Diagnosis"),
                                text("Notes"),
                                text("Date"),
                                text("Delete"),
                            ], rows: this.patient.teeth
                                .filter((t) => t.diagnosis && t.diagnosis.id !== "")
                                .map((t, index) => ({
                                id: index + "tt",
                                searchableString: t.diagnosis.value,
                                cells: [
                                    {
                                        dataValue: t.ISO,
                                        component: React.createElement("p", null, t.ISO),
                                    },
                                    {
                                        dataValue: t.ISO,
                                        component: React.createElement("p", null, t.Palmer),
                                    },
                                    {
                                        dataValue: t.diagnosis.id,
                                        component: React.createElement("p", null, t.diagnosis.value),
                                    },
                                    {
                                        dataValue: "note",
                                        component: (React.createElement(EditableListComponent, { label: text("History notes"), value: this.patient
                                                ? this.patient.teeth[t.ISO].notes
                                                : [], disabled: !this.canEdit, onChange: (e) => {
                                                if (this.patient) {
                                                    this.patient.teeth[t.ISO].notes = e;
                                                    this.patient.triggerUpdate++;
                                                }
                                            }, style: { width: "calc(100vw/4)" } })),
                                    },
                                    {
                                        dataValue: t.diagnosis.date.toString(),
                                        component: (React.createElement("p", null, format(new Date(t.diagnosis.date), "dd/mm/yyyy"))),
                                    },
                                    {
                                        dataValue: "delete",
                                        component: (React.createElement(IconButton, { className: "action-button delete", iconProps: {
                                                iconName: "Trash",
                                            }, onClick: () => {
                                                this.patient
                                                    ? (this.patient.teeth[t.ISO].diagnosis = {
                                                        id: "",
                                                        value: "",
                                                        date: new Date(),
                                                    })
                                                    : null;
                                            }, disabled: !this.canEdit })),
                                    },
                                ],
                            })) })),
                        this.state.tableTabIndex === 1 && (React.createElement(React.Fragment, null,
                            this.state.dialog.open && (React.createElement(Dialog, { hidden: !this.state.dialog.open, onDismiss: () => {
                                    this.setState({
                                        dialog: {
                                            open: false,
                                            procedureId: "",
                                            status: "",
                                        },
                                    });
                                }, dialogContentProps: {
                                    type: DialogType.largeHeader,
                                    title: "Status of procedure",
                                } },
                                React.createElement(ChoiceGroup, { selectedKey: this.state.dialog.status, options: [
                                        { key: "Completed", text: "Completed" },
                                        { key: "Not Completed", text: "Not Completed" },
                                        { key: "In Processing", text: "In Processing" },
                                        { key: "Delayed", text: "Delayed" },
                                        { key: "Discontinued", text: "Discontinued" },
                                    ], onChange: (key, value) => {
                                        this.setState({
                                            dialog: Object.assign({}, this.state.dialog, { status: value.key.toString() }),
                                        });
                                    } }),
                                React.createElement(DialogFooter, null,
                                    React.createElement(PrimaryButton, { disabled: !this.state.dialog.status, onClick: () => {
                                            const { procedures } = this.patient;
                                            const newPro = procedures.map((procedure) => {
                                                if (this.state.dialog.procedureId ===
                                                    procedure.id) {
                                                    procedure.status = this.state.dialog.status;
                                                }
                                                return procedure;
                                            });
                                            const i = appointments.list.findIndex((app) => app.procedureId ===
                                                this.state.dialog.procedureId);
                                            if (i > -1) {
                                                appointments.list[i].status = this.state.dialog.status;
                                                if (this.state.dialog.status === "Completed") {
                                                    appointments.list[i].isDone = true;
                                                }
                                                else {
                                                    appointments.list[i].isDone = false;
                                                }
                                            }
                                            this.patient.procedures = newPro;
                                            this.setState({
                                                dialog: {
                                                    open: false,
                                                    procedureId: "",
                                                    status: "",
                                                },
                                            });
                                        }, text: "Save" }),
                                    React.createElement(DefaultButton, { onClick: () => {
                                            this.setState({
                                                dialog: {
                                                    open: false,
                                                    procedureId: "",
                                                },
                                            });
                                        }, text: "Cancel" })))),
                            React.createElement(Table, { hover: true },
                                React.createElement("thead", null,
                                    React.createElement("tr", null,
                                        React.createElement("th", null, "Action"),
                                        React.createElement("th", null, "Tooth No"),
                                        React.createElement("th", null, "Tooth Place"),
                                        React.createElement("th", null, "Created On"),
                                        React.createElement("th", null, "Procedure"),
                                        React.createElement("th", null, "Surface"),
                                        React.createElement("th", null, "Status"),
                                        React.createElement("th", null, "Note"),
                                        React.createElement("th", null, "Quantity"),
                                        React.createElement("th", null, "Price"),
                                        React.createElement("th", null, "Dentist"),
                                        React.createElement("th", null, "Appointment"),
                                        React.createElement("th", null, "Delete"))),
                                React.createElement("tbody", null, procedureList.map((pro, index) => (React.createElement("tr", { key: index },
                                    React.createElement("td", null,
                                        React.createElement("div", { style: { display: "flex" } },
                                            React.createElement(TooltipHost, { content: text("Change status") },
                                                React.createElement(IconButton, { className: "action-button", iconProps: {
                                                        iconName: "DietPlanNotebook",
                                                    }, onClick: () => {
                                                        this.setState({
                                                            dialog: {
                                                                open: true,
                                                                procedureId: pro.id,
                                                                status: pro.status,
                                                            },
                                                        });
                                                    } })),
                                            React.createElement(TooltipHost, { content: text("Add endo") },
                                                React.createElement(IconButton, { className: "action-button", onClick: () => {
                                                        if (pro.endoCaseId) {
                                                            this.setState({
                                                                endodontic: {
                                                                    open: true,
                                                                    endoCaseId: pro.endoCaseId,
                                                                },
                                                            });
                                                        }
                                                        else {
                                                            const orthoCase = new EndoCase();
                                                            const { procedures } = this.patient;
                                                            const newPro = procedures.map((procedure) => {
                                                                if (pro.id === procedure.id) {
                                                                    procedure.endoCaseId =
                                                                        orthoCase._id;
                                                                }
                                                                return procedure;
                                                            });
                                                            endoCases.list.push(orthoCase);
                                                            this.patient.procedures = newPro;
                                                            this.setState({
                                                                endodontic: {
                                                                    open: true,
                                                                    endoCaseId: orthoCase._id,
                                                                },
                                                            });
                                                        }
                                                    }, iconProps: {
                                                        iconName: "link",
                                                    } })))),
                                    React.createElement("td", null, pro.tooth.length > 0 &&
                                        pro.tooth.map((t) => `${t} `)),
                                    React.createElement("td", null, pro.tooth.map((t) => this.patient.teeth[t].Palmer)),
                                    React.createElement("td", null, new Date(pro.date).toLocaleString()),
                                    React.createElement("td", null, pro.name),
                                    React.createElement("td", null,
                                        React.createElement(TextField, { value: pro.surface, onChange: (e, value) => {
                                                const { procedures } = this.patient;
                                                const newPro = procedures.map((procedure) => {
                                                    if (procedure.id === pro.id) {
                                                        procedure.surface = value;
                                                    }
                                                    return procedure;
                                                });
                                                this.patient.procedures = newPro;
                                            } })),
                                    React.createElement("td", null, pro.status),
                                    React.createElement("td", null,
                                        React.createElement(EditableListComponent, { label: text("History notes"), value: this.patient
                                                ? this.patient.teeth[pro.tooth[0]].notes
                                                : [], disabled: !this.canEdit, onChange: (e) => {
                                                if (this.patient) {
                                                    this.patient.teeth[pro.tooth[0]].notes = e;
                                                    this.patient.triggerUpdate++;
                                                }
                                            }, style: {
                                                width: "calc(40vw/4)",
                                                "margin-top": "0px",
                                                "padding-right": "10px",
                                            } })),
                                    React.createElement("td", null,
                                        "x",
                                        pro.quantity),
                                    React.createElement("td", null,
                                        "$",
                                        pro.quantity * pro.fees,
                                        ".00"),
                                    React.createElement("td", null, this.getStaffByAppointment(pro.id).map((name) => (React.createElement("div", null, name)))),
                                    React.createElement("td", null,
                                        React.createElement(TooltipHost, { content: text("Add Appointment") },
                                            React.createElement(IconButton, { className: "action-button", iconProps: {
                                                    iconName: "Calendar",
                                                }, onClick: () => {
                                                    this.setState({
                                                        viewAppointment: true,
                                                        selectedProcedureId: pro.id,
                                                    });
                                                    //  this.viewWhich = 4;
                                                } }))),
                                    React.createElement("td", null,
                                        React.createElement(TooltipHost, { content: text("Delete Procedure") },
                                            React.createElement(IconButton, { className: "action-button delete", iconProps: {
                                                    iconName: "Trash",
                                                }, onClick: () => {
                                                    const procedures = this.patient.procedures.filter((patientPro) => patientPro.id !== pro.id);
                                                    this.patient.procedures = procedures;
                                                } })))))))),
                            procedureList && procedureList.length > 0 && (React.createElement("button", { className: "btn btn-secondary", onClick: () => this.setState({
                                    showMoreProcedure: !this.state.showMoreProcedure,
                                }) }, this.state.showMoreProcedure
                                ? "Load more"
                                : "Load less")))),
                        this.state.tableTabIndex === 2 && (React.createElement(React.Fragment, null,
                            React.createElement("div", { style: { float: "right" } },
                                React.createElement(DefaultButton, { onClick: () => {
                                        debugger;
                                        this.setState({ addNewReport: true });
                                    }, iconProps: { iconName: "add" }, text: text("Add new report") })),
                            React.createElement("div", null,
                                React.createElement(Table, { hover: true },
                                    React.createElement("thead", null,
                                        React.createElement("tr", null,
                                            React.createElement("th", { style: { width: "15%" } }, "Serial No."),
                                            React.createElement("th", { style: { width: "75%" } }, "Report"),
                                            React.createElement("th", { style: { width: "10%" } }, "Delete"))),
                                    React.createElement("tbody", null, reportsList.map((report, index) => (React.createElement("tr", { key: index },
                                        React.createElement("td", null, `${index + 1}`),
                                        React.createElement("td", null,
                                            " ",
                                            React.createElement(Col, { sm: 24 }, report)),
                                        React.createElement("td", null,
                                            React.createElement(IconButton, { className: "action-button delete", iconProps: {
                                                    iconName: "Trash",
                                                }, onClick: (event) => {
                                                    debugger;
                                                    const rowIndex = event.target.parentNode.parentNode
                                                        .parentNode.parentNode.rowIndex;
                                                    const reportsRows = [
                                                        ...this.patient.reports,
                                                    ];
                                                    reportsRows.reverse();
                                                    reportsRows.splice(rowIndex - 1, 1);
                                                    this.patient.reports = reportsRows;
                                                } }))))))),
                                reportsList && reportsList.length > 0 && (React.createElement("button", { className: "btn btn-secondary", onClick: () => this.setState({
                                        showMoreReports: !this.state.showMoreReports,
                                    }) }, this.state.showMoreReports
                                    ? "Load more"
                                    : "Load less")))))))) : (""),
                this.viewWhich === 3 ? (React.createElement(PatientGalleryPanel, { patient: this.patient })) : (""),
                this.viewWhich === 4 ? (React.createElement(PatientAppointmentsPanel, { patient: this.patient })) : (""),
                this.viewWhich === 5 ? (React.createElement(PatientPaymentPanel, { patient: this.patient })) : (""))) : (""),
            React.createElement(DataTableComponent, { maxItemsOnLoad: 10, className: "patients-data-table", heads: [
                    text("Patient"),
                    text("Last/Next Appointment"),
                    text("Total/Outstanding Payments"),
                    text("Insurance"),
                    text("Label"),
                ], rows: patients.list.map((patient) => ({
                    id: patient._id,
                    searchableString: patient.searchableString,
                    cells: [
                        {
                            dataValue: patient.name +
                                " " +
                                patient.age +
                                " " +
                                genderToString(patient.gender),
                            component: (React.createElement("div", null,
                                React.createElement(ProfileComponent, { name: patient.name, secondaryElement: React.createElement("span", null,
                                        text(genderToString(patient.gender)),
                                        " - ",
                                        patient.age,
                                        " ",
                                        text("years old")), size: 3 }),
                                React.createElement("br", null),
                                React.createElement(TooltipHost, { content: text("Patient Details") },
                                    React.createElement(IconButton, { className: "action-button", iconProps: {
                                            iconName: "DietPlanNotebook",
                                        }, onClick: () => {
                                            this.selectedId = patient._id;
                                            this.viewWhich = 1;
                                        } })),
                                React.createElement(TooltipHost, { content: text("Dental History") },
                                    React.createElement(IconButton, { className: "action-button", iconProps: {
                                            iconName: "Teeth",
                                        }, onClick: () => {
                                            this.selectedId = patient._id;
                                            this.viewWhich = 2;
                                        } })),
                                React.createElement(TooltipHost, { content: text("Gallery and X-Rays") },
                                    React.createElement(IconButton, { className: "action-button", iconProps: {
                                            iconName: "PhotoCollection",
                                        }, onClick: () => {
                                            this.selectedId = patient._id;
                                            this.viewWhich = 3;
                                        } })),
                                user.currentUser.canViewAppointments ? (React.createElement(TooltipHost, { content: text("Patient Appointments") },
                                    React.createElement(IconButton, { className: "action-button", iconProps: {
                                            iconName: "Calendar",
                                        }, onClick: () => {
                                            this.selectedId = patient._id;
                                            this.viewWhich = 4;
                                        } }))) : (""),
                                React.createElement(TooltipHost, { content: text("Financial") },
                                    React.createElement(IconButton, { className: "action-button", iconProps: {
                                            iconName: "FinancialSolid",
                                        }, onClick: () => {
                                            this.selectedId = patient._id;
                                            this.viewWhich = 5;
                                        } })),
                                React.createElement(TooltipHost, { content: text("Delete") },
                                    React.createElement(IconButton, { className: "action-button delete", iconProps: {
                                            iconName: "Trash",
                                        }, onClick: () => patients.deleteModal(patient._id), disabled: !this.canEdit })),
                                React.createElement("div", { style: {
                                        position: "relative",
                                        "max-width": "32px",
                                        left: "185px",
                                        bottom: "90px",
                                    } },
                                    React.createElement(TooltipHost, { id: "medical-history", content: React.createElement("div", { styles: { padding: "10px" } },
                                            React.createElement("div", null,
                                                React.createElement("h6", { style: {
                                                        "text-align": "center",
                                                        color: "#106ebe",
                                                        "font-size": "12px",
                                                        "font-weight": "600",
                                                    } }, "Alerts"),
                                                patient.alerts.trim() !== "" ? (React.createElement("li", { style: {
                                                        "font-size": "12px",
                                                        color: "rgb(102, 102, 102)",
                                                    } }, patient.alerts)) : (React.createElement("p", { style: { "text-align": "center" } }, "No Data"))),
                                            React.createElement("div", { style: { "margin-top": "10px" } },
                                                React.createElement("h6", { style: {
                                                        "text-align": "center",
                                                        color: "#106ebe",
                                                        "font-size": "12px",
                                                        "font-weight": "600",
                                                    } }, "Allergies"),
                                                patient.allergies.trim() !== "" ? (React.createElement("li", { style: {
                                                        "font-size": "12px",
                                                        color: "rgb(102, 102, 102)",
                                                    } }, patient.allergies)) : (React.createElement("p", { style: { "text-align": "center" } }, "No Data")))) },
                                        React.createElement(IconButton, { className: "action-button", iconProps: {
                                                iconName: "AddEvent",
                                            }, style: { border: "none" } }))))),
                            className: "no-label",
                        },
                        {
                            dataValue: (patient.lastAppointment ||
                                patient.nextAppointment || { date: 0 }).date,
                            component: (React.createElement("div", null,
                                React.createElement(ProfileSquaredComponent, { text: patient.lastAppointment
                                        ? patient.lastAppointment.treatment
                                            ? patient.lastAppointment.treatment.type
                                            : ""
                                        : "", subText: patient.lastAppointment
                                        ? formatDate(patient.lastAppointment.date, setting.getSetting("date_format"))
                                        : text("No last appointment"), size: 3, onRenderInitials: () => React.createElement(Icon, { iconName: "Previous" }), onClick: () => { }, initialsColor: patient.lastAppointment
                                        ? undefined
                                        : PersonaInitialsColor.transparent }),
                                React.createElement("br", null),
                                React.createElement(ProfileSquaredComponent, { text: patient.nextAppointment
                                        ? patient.nextAppointment.treatment
                                            ? patient.nextAppointment.treatment.type
                                            : ""
                                        : "", subText: patient.nextAppointment
                                        ? formatDate(patient.nextAppointment.date, setting.getSetting("date_format"))
                                        : text("No next appointment"), size: 3, onRenderInitials: () => React.createElement(Icon, { iconName: "Next" }), onClick: () => { }, initialsColor: patient.nextAppointment
                                        ? undefined
                                        : PersonaInitialsColor.transparent }))),
                            className: "hidden-xs",
                        },
                        {
                            dataValue: patient.totalPayments,
                            component: (React.createElement("div", null,
                                React.createElement(ProfileSquaredComponent, { text: setting.getSetting("currencySymbol") +
                                        patient.totalPayments.toString(), subText: text("Payments made"), size: 3, onRenderInitials: () => React.createElement(Icon, { iconName: "CheckMark" }), onClick: () => { }, initialsColor: patient.totalPayments > 0
                                        ? PersonaInitialsColor.darkBlue
                                        : PersonaInitialsColor.transparent }),
                                React.createElement("br", null),
                                React.createElement(ProfileSquaredComponent, { text: setting.getSetting("currencySymbol") +
                                        (patient.differenceAmount < 0
                                            ? patient.outstandingAmount.toString()
                                            : patient.differenceAmount > 0
                                                ? patient.overpaidAmount.toString()
                                                : "0"), subText: patient.differenceAmount < 0
                                        ? text("Outstanding amount")
                                        : patient.differenceAmount > 0
                                            ? text("Overpaid amount")
                                            : text("No outstanding amount"), size: 3, onRenderInitials: () => React.createElement(Icon, { iconName: "Cancel" }), onClick: () => { }, initialsColor: patient.differenceAmount !== 0
                                        ? PersonaInitialsColor.darkRed
                                        : PersonaInitialsColor.transparent }))),
                            className: "hidden-xs",
                        },
                        {
                            dataValue: patient.insurance ? patient.insurance.name : "",
                            component: (React.createElement("div", null,
                                React.createElement(Dropdown, { options: insurances.list.map((insurance) => ({
                                        key: insurance._id,
                                        text: insurance.name,
                                    })), selectedKey: patient.insurance ? patient.insurance._id : "", onChange: (e, value) => {
                                        const foundInsurance = insurances.list.find(({ _id }) => value.key === _id);
                                        const newPatient = patient;
                                        newPatient.insurance = foundInsurance;
                                        const i = patients.findIndexByID(patient._id);
                                        patients.list[i] = newPatient;
                                    } }))),
                            className: "hidden-xs",
                        },
                        {
                            dataValue: patient.labels.map((x) => x.text).join(","),
                            component: (React.createElement("div", null, patient.labels.map((label, index) => {
                                return (React.createElement(TagComponent, { key: index, text: label.text, type: label.type }));
                            }))),
                            className: "hidden-xs",
                        },
                    ],
                })), commands: this.canEdit
                    ? [
                        {
                            key: "addNew",
                            title: "Add new",
                            name: text("Add new"),
                            onClick: () => {
                                const patient = new Patient();
                                patients.list.push(patient);
                                this.selectedId = patient._id;
                                this.viewWhich = 1;
                            },
                            iconProps: {
                                iconName: "Add",
                            },
                        },
                        {
                            key: "addImport",
                            title: "Import Patients",
                            name: text("Import Patients"),
                            onClick: () => {
                                this.inputElement.click();
                            },
                            iconProps: {
                                iconName: "Edit",
                            },
                        },
                    ]
                    : [] })));
    }
};
tslib_1.__decorate([
    observable
], PatientsPage.prototype, "selectedId", void 0);
tslib_1.__decorate([
    observable
], PatientsPage.prototype, "viewWhich", void 0);
tslib_1.__decorate([
    computed
], PatientsPage.prototype, "selectedCase", null);
tslib_1.__decorate([
    computed
], PatientsPage.prototype, "patient", null);
tslib_1.__decorate([
    computed
], PatientsPage.prototype, "canEdit", null);
PatientsPage = tslib_1.__decorate([
    observer
], PatientsPage);
export { PatientsPage };
//# sourceMappingURL=page.patients.js.map