import * as tslib_1 from "tslib";
import "rc-collapse/assets/index.css";
import { AsyncComponent, SectionComponent } from "@common-components";
import { text, user } from "@core";
import { conditionToColor, Diagnosis, procedures, procedureList, orthoCases, appointments } from "@modules";
import { computed, observable } from "mobx";
import { observer } from "mobx-react";
import { Dropdown, Toggle, Button, TextField } from "office-ui-fabric-react";
import * as React from "react";
import Select from "react-dropdown-select";
import Collapse, { Panel as CustomePanel } from "rc-collapse";
import { Row as BTRow, Col as BTCol } from "react-bootstrap";
import { Procedures } from "../data";
import { TeethPermanentChart } from "./teeth-permanent";
import { OrthoCase } from "modules/orthodontic";
//function createRef<T>(): RefObject<T>
let DentalHistoryPanel = class DentalHistoryPanel extends React.Component {
    constructor(props) {
        super(props);
        this.viewChart = true;
        this.viewToothISO = 0;
        this.triggerUpdate = 0;
        this.onChange = (activeKey) => {
            this.setState({
                activeKey
            });
        };
        this.state = {
            printview: "",
            showDiagnosis: true,
            showProcedure: true,
            activeKey: [],
            accordion: false,
            currentProcedureIndex: 0,
            selectedProcedure: {},
            selectedTeeth: [],
            saveProcedureSeparate: true,
            searchProcedureText: "",
            isMissing: true,
            isImpacted: false,
            isOrthodonticTabOpen: false,
            selectedOrthoId: "",
            firstRendering: false
        };
    }
    get canEdit() {
        return user.currentUser.canEditPatients;
    }
    get selectedOrthoCase() {
        return orthoCases.list.find(ortho => ortho._id === this.state.selectedOrthoId);
    }
    componentWillMount() {
        this.viewToothISO = 0;
    }
    render() {
        console.log("this.props.patient", this.props.patient);
        console.log("this.State", this.state);
        const options = { left: "left", right: "right", both: "both" };
        const procedureShown = this.state.searchProcedureText
            ? procedureList.filter(pro => pro.value
                .toUpperCase()
                .includes(this.state.searchProcedureText.toUpperCase()))
            : procedureList.filter((pro) => pro.parentIndex === this.state.currentProcedureIndex + 1);
        return (React.createElement("div", { style: { display: "flex" } },
            React.createElement("div", { style: {
                    width: "33%",
                    float: "left",
                    border: "1px solid #a6a6a6",
                    "margin-top": "84px",
                    "margin-right": "17px"
                } },
                React.createElement("div", { style: { "border-bottom": "1px solid #a6a6a6" } },
                    React.createElement(Button, { style: { width: "50%", "border-right": "1px solid #a6a6a6" }, onClick: () => {
                            this.setState({ isOrthodonticTabOpen: false });
                        } },
                        "Information",
                        " "),
                    React.createElement(Button, { style: { width: "50%" }, onClick: () => {
                            if (this.props.patient.orthoCaseId) {
                                this.setState({
                                    isOrthodonticTabOpen: true,
                                    selectedOrthoId: this.props.patient.orthoCaseId
                                });
                            }
                            else {
                                const ortho = new OrthoCase();
                                orthoCases.list.push(ortho);
                                this.props.patient.orthoCaseId = ortho._id;
                                this.setState({
                                    isOrthodonticTabOpen: true,
                                    selectedOrthoId: ortho._id
                                });
                            }
                        } },
                        " ",
                        "Orthodontics",
                        " ")),
                !this.state.isOrthodonticTabOpen && (React.createElement("div", { style: { padding: "10px", height: "26%" } },
                    React.createElement("div", { style: {
                            width: "100%",
                            border: "1px solid #a6a6a6",
                            height: "100%",
                            "padding-top": "10px"
                        } },
                        React.createElement("span", { style: {
                                "justify-content": "center",
                                display: "flex",
                                "font-weight": "bold"
                            } }, "Patient Details"),
                        React.createElement("div", { style: {
                                width: "50%",
                                float: "left",
                                height: "80%",
                                padding: "20px 35px 10px 20px",
                                display: "block"
                            } },
                            React.createElement("div", { style: { "margin-top": "8px" } },
                                React.createElement("span", { style: { float: "right" } }, "Name:")),
                            React.createElement("br", null),
                            React.createElement("div", { style: { "margin-top": "8px" } },
                                React.createElement("span", { style: { float: "right" } }, "Gender:")),
                            React.createElement("br", null),
                            React.createElement("div", { style: { "margin-top": "8px" } },
                                React.createElement("span", { style: { float: "right" } }, "Age:")),
                            React.createElement("br", null),
                            React.createElement("div", { style: { "margin-top": "8px" } },
                                React.createElement("span", { style: { float: "right" } }, "Last Appointment:")),
                            React.createElement("br", null),
                            React.createElement("div", { style: { "margin-top": "8px" } },
                                React.createElement("span", { style: { float: "right" } }, "Next Appointment:")),
                            React.createElement("br", null)),
                        React.createElement("div", { style: {
                                width: "50%",
                                float: "right",
                                height: "80%",
                                padding: "20px 20px 10px 35px",
                                display: "block"
                            } },
                            React.createElement("div", { style: { "margin-top": "8px" } },
                                React.createElement("span", { style: { float: "left" } }, this.props.patient.name
                                    ? this.props.patient.name
                                    : "No name")),
                            React.createElement("br", null),
                            React.createElement("div", { style: { "margin-top": "8px" } },
                                React.createElement("span", { style: { float: "left" } }, this.props.patient.gender === 0 ? "Male" : "Female")),
                            React.createElement("br", null),
                            React.createElement("div", { style: { "margin-top": "8px" } },
                                React.createElement("span", { style: { float: "left" } }, this.props.patient.age)),
                            React.createElement("br", null),
                            React.createElement("div", { style: { "margin-top": "8px" } },
                                React.createElement("span", { style: { float: "left" } }, this.props.patient.lastAppointment
                                    ? new Date(this.props.patient.lastAppointment.date).toLocaleDateString()
                                    : "No last appointment")),
                            React.createElement("br", null),
                            React.createElement("div", { style: { "margin-top": "8px" } },
                                React.createElement("span", { style: { float: "left" } }, this.props.patient.nextAppointment
                                    ? new Date(this.props.patient.nextAppointment.date).toLocaleDateString()
                                    : "No next appointment")),
                            React.createElement("br", null))),
                    React.createElement("hr", { style: {
                            border: "0",
                            height: "0",
                            "border-top": "1px solid rgba(0, 0, 0, 0.1)",
                            "border-bottom": "1px solid rgba(255, 255, 255, 0.3)"
                        } }),
                    React.createElement("div", { style: {
                            width: "100%",
                            border: "1px solid #a6a6a6",
                            height: "282%",
                            padding: "10px"
                        } },
                        React.createElement("div", { style: {
                                width: "100%",
                                border: "1px solid #a6a6a6",
                                height: "59%",
                                padding: "10px"
                            } },
                            React.createElement("span", { style: {
                                    "justify-content": "center",
                                    display: "flex",
                                    "font-weight": "bold"
                                } }, "Medical History"),
                            React.createElement("div", { style: { "margin-top": "15px" } },
                                React.createElement(TextField, { label: text(`Alerts`), value: this.props.patient.alerts, multiline: true, autoAdjustHeight: true, onChange: (ev, alerts) => (this.props.patient.alerts = alerts) })),
                            React.createElement("div", { style: { "margin-top": "25px" } },
                                React.createElement(TextField, { label: text(`Allergies`), value: this.props.patient.allergies, multiline: true, autoAdjustHeight: true, onChange: (ev, allergies) => (this.props.patient.allergies = allergies) }))),
                        React.createElement("div", { style: {
                                width: "100%",
                                border: "1px solid #a6a6a6",
                                height: "38%",
                                "margin-top": "4%",
                                padding: "10px"
                            } },
                            React.createElement("span", { style: {
                                    "justify-content": "center",
                                    display: "flex",
                                    "font-weight": "bold"
                                } }, "Chief Complaint"),
                            React.createElement("div", { style: { "margin-top": "10px" } },
                                React.createElement(TextField, { label: text(`Cheif Complaint`), value: this.props.patient.cheifComplaint, multiline: true, autoAdjustHeight: true, onChange: (ev, cheifComplaint) => (this.props.patient.cheifComplaint = cheifComplaint) })))))),
                this.state.isOrthodonticTabOpen && (React.createElement(AsyncComponent, { key: "ortho-case-sheet", loader: () => tslib_1.__awaiter(this, void 0, void 0, function* () {
                        const Component = (yield import("../../orthodontic/components/case-sheet")).OrthoCaseSheetPanel;
                        return React.createElement(Component, { orthoCase: this.selectedOrthoCase });
                    }) }))),
            React.createElement("div", { className: "dental-history teeth", style: { width: "65%" } },
                React.createElement(Toggle, { defaultChecked: !this.viewChart, onText: text("View permanent teeth"), offText: text("View deciduous teeth"), onChange: () => {
                        this.viewChart = !this.viewChart;
                    } }),
                React.createElement(Dropdown, { disabled: !this.canEdit, placeholder: text("Print"), options: Object.keys(options).map(x => ({
                        key: x,
                        text: text(options[x])
                    })), defaultSelectedKey: options.both, onChange: (ev, has) => {
                        if (has.key === options.left) {
                            this.setState({
                                printview: "left"
                            }, () => {
                                window.print();
                            });
                        }
                    } }),
                React.createElement("div", { className: "m-t-20" }, this.viewChart ? (React.createElement("div", { className: "chart" },
                    React.createElement(SectionComponent, { title: text(`Permanent Teeth`), backgroundColor: "#F7F7F7" },
                        this.state.firstRendering && (React.createElement("div", { id: "action-buttons", style: {
                                border: "1px solid #a6a6a6",
                                width: "77%",
                                position: "relative",
                                right: "15px",
                                "border-top": "0px",
                                "border-left": "0px"
                            } },
                            React.createElement(Button, { onClick: () => {
                                    this.setState(Object.assign({}, this.state, { showDiagnosis: true }));
                                }, style: { "border-right": "1px solid #a6a6a6" } }, "Add Diagnosis"),
                            React.createElement(Button, { onClick: () => this.setState(Object.assign({}, this.state, { showProcedure: true })), style: { "border-right": "1px solid #a6a6a6" } }, "Add Procedure"),
                            React.createElement(Button, { onClick: () => {
                                    this.props.patient.procedureGraphicCode = [];
                                    this.props.patient.teeth[this.viewToothISO].diagnosis = {
                                        id: "",
                                        value: "",
                                        date: new Date()
                                    };
                                    const proIds = [];
                                    const procedures = this.props.patient.procedures.filter(pro => {
                                        if (!pro.tooth.includes(this.viewToothISO)) {
                                            return true;
                                        }
                                        else {
                                            proIds.push(pro.id);
                                        }
                                        return false;
                                    });
                                    appointments.list.forEach(l => {
                                        if (proIds.includes(l.procedureId)) {
                                            appointments.deleteByID(l._id);
                                        }
                                    });
                                    this.props.patient.procedures = procedures;
                                    this.viewToothISO = 0;
                                    this.setState(Object.assign({}, this.state, { showDiagnosis: false, selectedTeeth: [] }));
                                }, style: { "border-right": "1px solid #a6a6a6" } }, "Normal"),
                            React.createElement(Button, { onClick: () => {
                                    this.setState({ isMissing: !this.state.isMissing });
                                }, style: { "border-right": "1px solid #a6a6a6" } }, "Missing"),
                            React.createElement(Button, { onClick: () => {
                                    this.setState({ isImpacted: !this.state.isImpacted });
                                } }, "Impacted"))),
                        React.createElement(TeethPermanentChart, { isImpacted: this.state.isImpacted, isMissing: this.state.isMissing, teeth: this.props.patient.teeth, patient: this.props.patient, onClick: number => {
                                this.viewToothISO = number;
                                if (this.state.selectedTeeth.indexOf(number) === -1) {
                                    this.state.selectedTeeth.push(number);
                                    this.setState(Object.assign({}, this.state, { firstRendering: true }));
                                }
                                else {
                                    const selectedTeeth = this.state.selectedTeeth;
                                    selectedTeeth.splice(selectedTeeth.indexOf(number), 1);
                                    this.setState({ selectedTeeth, firstRendering: true });
                                }
                            } })))) : (React.createElement("div", { className: "chart" },
                    React.createElement(SectionComponent, { title: text(`Deciduous Teeth`), backgroundColor: "#F7F7F7" },
                        this.state.selectedTeeth.length !== 0 && (React.createElement("div", { id: "action-buttons", style: {
                                border: "1px solid #a6a6a6",
                                width: "38%",
                                position: "relative",
                                right: "15px",
                                "border-top": "0px",
                                "border-left": "0px"
                            } },
                            React.createElement(Button, { onClick: () => {
                                    this.setState(Object.assign({}, this.state, { showDiagnosis: true }));
                                }, style: { "border-right": "1px solid #a6a6a6" } }, "Add Diagnosis"),
                            React.createElement(Button, { onClick: () => this.setState(Object.assign({}, this.state, { showProcedure: true })) }, "Add Procedure"))),
                        React.createElement(AsyncComponent, { key: "teeth-primary", loader: () => tslib_1.__awaiter(this, void 0, void 0, function* () {
                                const Component = (yield import("./teeth-deciduous"))
                                    .TeethDeciduousChart;
                                return (React.createElement(Component, { teeth: this.props.patient.teeth, patient: this.props.patient, onClick: number => {
                                        this.viewToothISO = number;
                                        if (this.state.selectedTeeth.indexOf(number) === -1) {
                                            this.state.selectedTeeth.push(number);
                                            this.setState(Object.assign({}, this.state));
                                        }
                                        else {
                                            const selectedTeeth = this.state.selectedTeeth;
                                            selectedTeeth.splice(selectedTeeth.indexOf(number), 1);
                                            this.setState({ selectedTeeth });
                                        }
                                    } }));
                            }) }))))),
                this.state.showDiagnosis && (React.createElement("div", { style: {
                        zIndex: 12,
                        borderTop: "1px solid #999",
                        marginTop: "5px",
                        position: "fixed",
                        bottom: 0,
                        left: 0,
                        right: 0,
                        // padding: "10px 40px",
                        backgroundColor: "#ffffff",
                        maxHeight: "300px",
                        height: "500px",
                        overflow: "scroll",
                        padding: "10px 40px"
                    } },
                    React.createElement(BTRow, { className: "flex-row-reverse" },
                        React.createElement(BTCol, null,
                            React.createElement("p", { style: {
                                    textAlign: "right",
                                    color: "#2d89ef",
                                    cursor: "pointer",
                                    marginBottom: "0"
                                }, onClick: () => this.setState({ showDiagnosis: false }) }, "Close"))),
                    React.createElement(BTRow, null,
                        React.createElement(BTCol, { xs: 4 },
                            React.createElement("p", { style: { fontWeight: "bold", marginBottom: "5px" } }, "Status")),
                        React.createElement(BTCol, { xs: 8 },
                            React.createElement("p", { style: { fontWeight: "bold", marginBottom: "5px" } }, "Teeth"))),
                    React.createElement(BTRow, null,
                        React.createElement(BTCol, { xs: 4 },
                            React.createElement("div", { style: { display: "flex" } },
                                React.createElement("p", { style: { marginRight: "10px" } }, "Planned"),
                                React.createElement("p", null, "Completed"))),
                        React.createElement(BTCol, { xs: 3 }, this.state.selectedTeeth &&
                            this.state.selectedTeeth.length > 0 && (React.createElement("p", null, this.state.selectedTeeth.map(teethNo => {
                            return `#${teethNo} `;
                        }))))),
                    (this.state.showDiagnosis ||
                        (this.props.patient.teeth[this.viewToothISO].diagnosis &&
                            this.props.patient.teeth[this.viewToothISO].diagnosis
                                .id)) && (React.createElement(React.Fragment, null,
                        React.createElement("p", { style: { marginBottom: "5px" } }, "Filter by name"),
                        React.createElement(Select, { options: Object.keys(Diagnosis).map(c => ({
                                id: c,
                                key: c,
                                value: text(Diagnosis[c]),
                                title: Diagnosis[c].title
                            })), searchable: true, searchBy: "title", itemRenderer: ({ item, methods }) => (React.createElement(Collapse, { accordion: this.state.accordion, onChange: this.onChange, activeKey: this.state.activeKey },
                                React.createElement(CustomePanel, { style: {
                                        padding: "10px",
                                        backgroundColor: "#ffffff",
                                        borderTop: "none"
                                    }, key: item.id, header: item.value.title }, item.value.diagnosis.map((d, index) => (React.createElement("p", { style: {
                                        paddingLeft: "10px",
                                        color: "#0078d4"
                                    }, key: d.id + index, onClick: () => {
                                        this.props.patient.teeth[this.viewToothISO].diagnosis = {
                                            id: d.id,
                                            value: d.value,
                                            date: new Date()
                                        };
                                        this.props.patient.triggerUpdate++;
                                        this.forceUpdate();
                                        // methods.addItem(item)
                                    } }, `${d.id} ${d.value}`)))))) }))),
                    this.props.patient.teeth[this.viewToothISO].diagnosis &&
                        this.props.patient.teeth[this.viewToothISO].diagnosis.id && (React.createElement("p", null,
                        "Selected diagnosis:",
                        " ",
                        this.props.patient.teeth[this.viewToothISO].diagnosis
                            .value)))),
                this.state.showProcedure && (React.createElement("div", { style: {
                        zIndex: 12,
                        borderTop: "1px solid #999",
                        marginTop: "5px",
                        position: "fixed",
                        bottom: 0,
                        left: 0,
                        right: 0,
                        padding: "10px 40px",
                        backgroundColor: "#ffffff",
                        maxHeight: "300px",
                        overflow: "scroll"
                    } },
                    React.createElement(BTRow, { className: "flex-row-reverse" },
                        React.createElement(BTCol, null,
                            React.createElement("p", { style: {
                                    textAlign: "right",
                                    color: "#2d89ef",
                                    cursor: "pointer",
                                    marginBottom: "0"
                                }, onClick: () => this.setState({ showProcedure: ture }) }, "Close"))),
                    React.createElement(BTRow, null,
                        React.createElement(BTCol, { xs: 4 },
                            React.createElement("p", { style: { fontWeight: "bold", marginBottom: "5px" } }, "Status")),
                        React.createElement(BTCol, { xs: 8 },
                            React.createElement("p", { style: { fontWeight: "bold", marginBottom: "5px" } }, "Teeth"))),
                    React.createElement(BTRow, null,
                        React.createElement(BTCol, { xs: 4 },
                            React.createElement("div", { style: { display: "flex" } },
                                React.createElement("p", { style: { marginRight: "10px" } }, "Planned"),
                                React.createElement("p", null, "Completed"))),
                        React.createElement(BTCol, { xs: 3 }, this.state.selectedTeeth &&
                            this.state.selectedTeeth.length > 0 && (React.createElement("p", null, this.state.selectedTeeth.map(teethNo => {
                            return `#${teethNo} `;
                        }))))),
                    procedures[this.state.currentProcedureIndex] &&
                        procedures[this.state.currentProcedureIndex].children ? (React.createElement(BTRow, { style: { width: "400px" } }, procedures[this.state.currentProcedureIndex].children.map(child => {
                        let className = "sub-procedure";
                        if (this.props.patient.procedureGraphicCode &&
                            this.props.patient.procedureGraphicCode.length > 0) {
                            this.props.patient.procedureGraphicCode.map(code => {
                                if (code.includes(child)) {
                                    className += " sub-procedure-selected";
                                }
                            });
                        }
                        return (React.createElement(BTCol, null,
                            React.createElement("p", { className: className, onClick: () => {
                                    if (this.state.selectedTeeth &&
                                        this.state.selectedTeeth.length > 0) {
                                        this.state.selectedTeeth.map(tooth => {
                                            const procedureGraphicCode = this.props
                                                .patient.procedureGraphicCode;
                                            let graphicCode = procedures[this.state.currentProcedureIndex]
                                                .id +
                                                child +
                                                tooth;
                                            const indexOfGraphicCode = this.props.patient.procedureGraphicCode.indexOf(graphicCode);
                                            if (indexOfGraphicCode === -1) {
                                                procedureGraphicCode.push(graphicCode);
                                            }
                                            else {
                                                procedureGraphicCode.splice(indexOfGraphicCode, 1);
                                            }
                                            this.props.patient.procedureGraphicCode = procedureGraphicCode;
                                        });
                                    }
                                } }, child)));
                    }))) : null,
                    React.createElement(BTRow, { className: "m-2" },
                        React.createElement(BTCol, null,
                            React.createElement("input", { className: "w-100 p-1", type: "text", placeholder: "Search... ", value: this.state.searchProcedureText, onChange: e => {
                                    this.setState({ searchProcedureText: e.target.value });
                                } }))),
                    React.createElement(BTRow, { className: "justify-content-xs-between" }, procedures.map((pro, index) => (React.createElement(BTCol, { key: index, style: { cursor: "pointer" }, className: "d-flex flex-column align-items-xs-centre", onClick: () => {
                            if (!procedures[index].children ||
                                ["rootCanal", "prosthetics"].includes(procedures[index].id)) {
                                if (this.state.selectedTeeth &&
                                    this.state.selectedTeeth.length > 0) {
                                    this.state.selectedTeeth.map(tooth => {
                                        const procedureGraphicCode = this.props.patient
                                            .procedureGraphicCode;
                                        let graphicCode = pro.id + "" + tooth;
                                        const indexOfGraphicCode = this.props.patient.procedureGraphicCode.indexOf(graphicCode);
                                        if (indexOfGraphicCode === -1) {
                                            procedureGraphicCode.push(graphicCode);
                                        }
                                        // This is another flow that show  procedure together
                                        // else {
                                        //   procedureGraphicCode.splice(indexOfGraphicCode, 1);
                                        // }
                                        // This is another flow that show one procedure at the time
                                        if (!procedures[this.state.currentProcedureIndex]
                                            .children ||
                                            ["rootCanal", "prosthetics"].includes(procedures[this.state.currentProcedureIndex].id)) {
                                            let preGraphicCode = procedures[this.state.currentProcedureIndex]
                                                .id +
                                                "" +
                                                tooth;
                                            const indexOfPreGraphicCode = this.props.patient.procedureGraphicCode.indexOf(preGraphicCode);
                                            if (indexOfPreGraphicCode !== -1) {
                                                procedureGraphicCode.splice(indexOfPreGraphicCode, 1);
                                            }
                                        }
                                        this.props.patient.procedureGraphicCode = procedureGraphicCode;
                                    });
                                }
                            }
                            this.setState({ currentProcedureIndex: index });
                        } },
                        React.createElement("div", { style: { margin: "0 auto" } },
                            React.createElement("img", { src: `./icons/${pro.id}.png` })),
                        React.createElement("p", { style: index === this.state.currentProcedureIndex
                                ? {
                                    marginTop: "10px",
                                    textAlign: "center",
                                    color: "#2d89ef"
                                }
                                : { marginTop: "10px", textAlign: "center" } }, pro.title))))),
                    React.createElement("div", { style: {
                            height: "300px",
                            padding: "10px 20px",
                            overflow: "auto",
                            backgroundColor: "#F7F7F7"
                        } }, procedureShown.map(procedure => {
                        let procedureInSelectedList = this.state.selectedProcedure[`${procedure.parentId}-${procedure.parentIndex}${procedure.order}`];
                        return (React.createElement(BTRow, { className: "justify-content-between", style: { padding: "5px" } },
                            React.createElement(BTCol, { style: { cursor: "pointer" }, xs: 8, onClick: () => {
                                    if (procedureInSelectedList) {
                                        const selectedProcedure = this.state
                                            .selectedProcedure;
                                        delete this.state.selectedProcedure[`${procedure.parentId}-${procedure.parentIndex}${procedure.order}`];
                                        this.setState({ selectedProcedure });
                                    }
                                    else {
                                        const selectedProcedure = Object.assign({}, this.state.selectedProcedure);
                                        selectedProcedure[`${procedure.parentId}-${procedure.parentIndex}${procedure.order}`] = Object.assign({}, procedure, { quantity: 1 });
                                        this.setState({ selectedProcedure });
                                    }
                                } },
                                React.createElement("p", { style: { marginBottom: "5px" } },
                                    procedure.parentIndex,
                                    "(",
                                    procedure.order,
                                    ")"),
                                React.createElement("p", { style: { margin: 0 } }, procedure.value)),
                            React.createElement(BTCol, { xs: 1 }, procedureInSelectedList && (React.createElement("div", { className: "d-flex" },
                                React.createElement("input", { style: {
                                        borderRadius: "5px",
                                        padding: "10px",
                                        border: "none",
                                        width: "60px"
                                    }, type: "number", value: procedureInSelectedList.quantity, onChange: e => {
                                        procedureInSelectedList.quantity =
                                            e.target.value;
                                        this.setState(Object.assign({}, this.state));
                                    } })))),
                            React.createElement(BTCol, { xs: 2 },
                                React.createElement("div", { className: "d-flex" },
                                    React.createElement("input", { style: {
                                            borderRadius: "5px",
                                            padding: "10px 5px",
                                            border: "none"
                                        }, type: "number", value: procedureInSelectedList &&
                                            procedureInSelectedList.price !== undefined
                                            ? procedureInSelectedList.price
                                            : procedure.defaultPrice, onChange: e => {
                                            if (procedureInSelectedList) {
                                                procedureInSelectedList.price = e.target.value;
                                                this.setState(Object.assign({}, this.state));
                                            }
                                            else {
                                                alert("Please select the procedure before modifying its price");
                                            }
                                        } }),
                                    React.createElement("div", { style: {
                                            textAlign: "center",
                                            padding: "10px 10px",
                                            backgroundColor: "#ffffff",
                                            color: "#2d89ef"
                                        } }, "$")))));
                    })),
                    React.createElement(BTRow, { className: "justify-content-between mt-3 align-items-centre" },
                        React.createElement(BTCol, { xs: 9 }, this.state.selectedTeeth &&
                            this.state.selectedTeeth.length > 0 && (React.createElement("div", { className: "form-check" },
                            React.createElement("input", { className: "form-check-input", id: "checkForTooth", type: "checkbox", checked: this.state.saveProcedureSeparate, onChange: e => this.setState({
                                    saveProcedureSeparate: e.target.checked
                                }) }),
                            React.createElement("label", { className: "form-check-label", htmlFor: "checkForTooth" },
                                " ",
                                "Save these procedures for each tooth separately",
                                " ")))),
                        React.createElement(BTCol, { xs: 3 },
                            React.createElement("button", { className: "btn btn-primary", onClick: () => {
                                    const procedures = [];
                                    if (this.state.selectedProcedure &&
                                        Object.keys(this.state.selectedProcedure).length > 0) {
                                        for (let [key] of Object.entries(this.state.selectedProcedure)) {
                                            const selectedPro = this.state.selectedProcedure;
                                            if (this.state.selectedTeeth.length === 0) {
                                                const pro = new Procedures({
                                                    id: key + "-" + new Date().getTime(),
                                                    slectedGraphicCode: [],
                                                    name: selectedPro[key].value,
                                                    quantity: selectedPro[key].quantity,
                                                    patientid: this.props.patient._id,
                                                    tooth: [],
                                                    fees: selectedPro[key].price ||
                                                        selectedPro[key].defaultPrice,
                                                    done: false,
                                                    date: new Date().toISOString()
                                                });
                                                procedures.push(pro);
                                            }
                                            else {
                                                if (this.state.saveProcedureSeparate) {
                                                    this.state.selectedTeeth.map(item => {
                                                        const slectedGraphicCode = this.props.patient.procedureGraphicCode.filter(code => {
                                                            return code.includes(item.toString()) &&
                                                                code.includes(key.split("-")[0])
                                                                ? true
                                                                : false;
                                                        });
                                                        const pro = new Procedures({
                                                            id: key +
                                                                "-" +
                                                                item +
                                                                "-" +
                                                                new Date().getTime(),
                                                            slectedGraphicCode: slectedGraphicCode,
                                                            name: selectedPro[key].value,
                                                            quantity: selectedPro[key].quantity,
                                                            patientid: this.props.patient._id,
                                                            tooth: [item],
                                                            fees: selectedPro[key].price ||
                                                                selectedPro[key].defaultPrice,
                                                            done: false,
                                                            date: new Date().toISOString()
                                                        });
                                                        procedures.push(pro);
                                                    });
                                                }
                                                else {
                                                    const slectedGraphicCode = [];
                                                    this.state.selectedTeeth.map(item => {
                                                        this.props.patient.procedureGraphicCode.map(code => {
                                                            if (code.includes(item.toString()) &&
                                                                code.includes(key.split("-")[0])) {
                                                                slectedGraphicCode.push(code);
                                                            }
                                                        });
                                                    });
                                                    const pro = new Procedures({
                                                        id: key + "-" + new Date().getTime(),
                                                        slectedGraphicCode: slectedGraphicCode,
                                                        name: selectedPro[key].value,
                                                        quantity: selectedPro[key].quantity,
                                                        patientid: this.props.patient._id,
                                                        tooth: this.state.selectedTeeth,
                                                        fees: selectedPro[key].price ||
                                                            selectedPro[key].defaultPrice,
                                                        done: false,
                                                        date: new Date().toISOString()
                                                    });
                                                    procedures.push(pro);
                                                }
                                            }
                                        }
                                        this.props.patient.procedures = [
                                            ...this.props.patient.procedures,
                                            ...procedures
                                        ];
                                        this.setState({
                                            showProcedure: false,
                                            currentProcedureIndex: 0,
                                            selectedProcedure: {},
                                            selectedTeeth: [],
                                            saveProcedureSeparate: true
                                        }, this.props.toggleProcedureTable);
                                    }
                                } },
                                "Add procedures (",
                                Object.keys(this.state.selectedProcedure).length,
                                ")"))))))));
    }
    mapQuadrant(min, max, reverse) {
        let arr = this.props.patient.teeth;
        arr = arr.filter(tooth => tooth.ISO >= min && tooth.ISO <= max);
        arr = reverse ? arr.reverse() : arr;
        return arr.map(tooth => (React.createElement("td", { key: "tooth" + tooth.ISO, style: { background: conditionToColor(tooth.condition) }, onClick: () => (this.viewToothISO = tooth.ISO) },
            React.createElement("span", { className: "has-notes", style: tooth.notes.length ? {} : { display: "none" } }),
            tooth.ISO)));
    }
};
tslib_1.__decorate([
    observable
], DentalHistoryPanel.prototype, "viewChart", void 0);
tslib_1.__decorate([
    observable
], DentalHistoryPanel.prototype, "viewToothISO", void 0);
tslib_1.__decorate([
    observable
], DentalHistoryPanel.prototype, "triggerUpdate", void 0);
tslib_1.__decorate([
    computed
], DentalHistoryPanel.prototype, "canEdit", null);
tslib_1.__decorate([
    computed
], DentalHistoryPanel.prototype, "selectedOrthoCase", null);
DentalHistoryPanel = tslib_1.__decorate([
    observer
], DentalHistoryPanel);
export { DentalHistoryPanel };
//# sourceMappingURL=dental-history.js.map