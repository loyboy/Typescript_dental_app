import * as tslib_1 from "tslib";
import { Col, DataTableComponent, ProfileSquaredComponent, Row, AsyncComponent, } from "@common-components";
import { router, text, user } from "@core";
import { setting, Treatment, treatments } from "@modules";
import { computed, observable } from "mobx";
import { observer } from "mobx-react";
import { parse, unparse } from "papaparse";
import { IconButton, Panel, PanelType, } from "office-ui-fabric-react";
import * as React from "react";
let Treatments = class Treatments extends React.Component {
    constructor() {
        super(...arguments);
        this.selectedID = router.currentLocation.split("/")[1];
        this.inputElement = null;
    }
    get canEdit() {
        return user.currentUser.canEditTreatments;
    }
    get selectedIndex() {
        return treatments.list.findIndex((x) => x._id === this.selectedID);
    }
    get selectedTreatment() {
        return treatments.list[this.selectedIndex];
    }
    onChange(e) {
        console.log(" Files: " + e.target.files[0].name);
        parse(e.target.files[0], {
            complete: (result) => {
                let datax = result.data;
                const found = datax.some((e) => e.id !== undefined &&
                    e.name !== undefined &&
                    e.birth !== undefined &&
                    e.gender !== undefined &&
                    e.tags !== undefined &&
                    e.address !== undefined &&
                    e.email !== undefined &&
                    e.phone !== undefined &&
                    e.labels !== undefined &&
                    e.history !== undefined &&
                    e.gallery !== undefined &&
                    e.diagnosis !== undefined);
                if (found) {
                    //alert('Working!')
                    console.log("Found val: " + JSON.stringify(datax));
                    for (let val of datax) {
                        if (val.id !== "") {
                            var treat = new Treatment();
                            var foundItem = treatments.list.find((treatment) => treatment._id === val.id);
                            if (foundItem) {
                                break;
                            }
                            treat._id = val.id;
                            treat.c_date = val.cdate;
                            treat.item = val.item;
                            treat.desc = val.desc;
                            treat.lab_name = val.lab;
                            treat.patient_name = val.patient;
                            treat.fees = val.fees;
                            treat.status = val.status;
                            treatments.list.push(treat);
                            alert("Added data into Lab Order Database");
                        }
                    }
                }
                else {
                    alert("Sorry, this CSV file does not match the required Format. Please get the proper format before Uploading.");
                }
                //console.log("CSV results:"+ JSON.stringify(result.data));
            },
            header: true,
        });
    }
    render() {
        return (React.createElement("div", { className: "tc-pg p-15 p-l-10 p-r-10" },
            React.createElement("input", { type: "file", name: "import", onChange: this.onChange, ref: (input) => (this.inputElement = input), accept: ".csv", style: { opacity: 0 } }),
            React.createElement(DataTableComponent, { onDelete: this.canEdit
                    ? (id) => {
                        treatments.deleteModal(id);
                    }
                    : undefined, commands: this.canEdit
                    ? [
                        {
                            key: "addNew",
                            title: "Add Order",
                            name: text("Add Order"),
                            onClick: () => {
                                const treatment = new Treatment();
                                treatments.list.push(treatment);
                                this.selectedID = treatment._id;
                            },
                            iconProps: {
                                iconName: "Add Order",
                            },
                        },
                        {
                            key: "addImport",
                            title: "Import Lab Order",
                            name: text("Import Lab Order"),
                            onClick: () => {
                                this.inputElement.click();
                            },
                            iconProps: {
                                iconName: "Edit",
                            },
                        },
                        {
                            key: "addExport",
                            title: "Export Lab Order",
                            name: text("Export Lab Order"),
                            onClick: () => {
                                var d = confirm("Are you sure you want to export this Lab Order data?");
                                if (d) {
                                    let treat = treatments.list;
                                    let newpat = treat.map((t) => {
                                        return {
                                            Id: t._id,
                                            "Creation Date": t.c_date,
                                            "Item Title": t.item,
                                            Description: t.desc,
                                            "Lab Name": t.lab_name,
                                            "Patient Name": t.patient_name,
                                            Fees: t.fees,
                                            Status: t.status,
                                        };
                                    });
                                    var csv = unparse(newpat);
                                    var blob = new Blob([csv]);
                                    var a = window.document.createElement("a");
                                    a.href = window.URL.createObjectURL(blob);
                                    a.download = "labs.csv";
                                    document.body.appendChild(a);
                                    a.click(); // IE: "Access is denied"; see: https://connect.microsoft.com/IE/feedback/details/797361/ie-10-treats-blob-url-as-cross-origin-and-denies-access
                                    document.body.removeChild(a);
                                }
                            },
                            iconProps: {
                                iconName: "Edit",
                            },
                        },
                    ]
                    : [], heads: [
                    text("Lab Order ID"),
                    text("Date of Creation"),
                    text("Item Title"),
                    text("Description"),
                    text("Lab Name"),
                    text("Patient Name"),
                    text("Fees"),
                    text("Status"),
                    text("Edit"),
                ], rows: treatments.list.map((treatment) => {
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
                        id: treatment._id,
                        searchableString: treatment.searchableString,
                        cells: [
                            {
                                dataValue: treatment._id,
                                component: (React.createElement("span", null,
                                    React.createElement("b", null,
                                        " #",
                                        treatment._id,
                                        " "))),
                                onClick: () => {
                                    this.selectedID = treatment._id;
                                },
                                className: "no-label",
                            },
                            {
                                dataValue: treatment.c_date,
                                component: React.createElement("span", null, treatment.c_date),
                                className: "hidden-xs",
                            },
                            {
                                dataValue: treatment.item,
                                component: React.createElement("span", null, treatment.item),
                                className: "hidden-xs",
                            },
                            {
                                dataValue: treatment.desc,
                                component: React.createElement("span", null, treatment.desc),
                                className: "hidden-xs",
                            },
                            {
                                dataValue: treatment.lab_name,
                                component: React.createElement("span", null, treatment.lab_name),
                                className: "hidden-xs",
                            },
                            {
                                dataValue: treatment.patient_name,
                                component: React.createElement("span", null, treatment.patient_name),
                                className: "hidden-xs",
                            },
                            {
                                dataValue: treatment.fees,
                                component: (React.createElement("span", null,
                                    setting.getSetting("currencySymbol"),
                                    " ",
                                    treatment.fees)),
                                className: "hidden-xs",
                            },
                            {
                                dataValue: treatment.status,
                                component: React.createElement("span", null, treatment.status),
                                className: "hidden-xs",
                            },
                            {
                                dataValue: treatment._id,
                                component: React.createElement(IconButton, { iconProps: { iconName: "Edit" } }),
                                onClick: () => {
                                    this.selectedID = treatment._id;
                                },
                                className: "no-label",
                            },
                        ],
                    };
                }), maxItemsOnLoad: 20 }),
            this.selectedTreatment ? (React.createElement(Panel, { isOpen: !!this.selectedTreatment, type: PanelType.medium, closeButtonAriaLabel: "Close", isLightDismiss: true, onDismiss: () => {
                    this.selectedID = "";
                }, onRenderNavigation: () => (React.createElement(Row, { className: "panel-heading" },
                    React.createElement(Col, { span: 20 }, this.selectedTreatment ? (React.createElement(ProfileSquaredComponent, { text: this.selectedTreatment.item, subText: `${text("Expenses")}: ${setting.getSetting("currencySymbol")}${this.selectedTreatment.fees} ${text(" charge")}` })) : (React.createElement("p", null))),
                    React.createElement(Col, { span: 4, className: "close" },
                        React.createElement(IconButton, { iconProps: { iconName: "cancel" }, onClick: () => {
                                this.selectedID = "";
                            } })))) },
                React.createElement(AsyncComponent, { key: "", loader: () => tslib_1.__awaiter(this, void 0, void 0, function* () {
                        const TreatmentDetailsPanel = (yield import("./treatment-details")).TreatmentDetailsPanel;
                        return (React.createElement(TreatmentDetailsPanel, { treat: this.selectedTreatment, selected: this.selectedIndex }));
                    }) }))) : ("")));
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