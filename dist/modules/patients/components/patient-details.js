import * as tslib_1 from "tslib";
import { EditableListComponent } from "../../../common-components/editable-list/editable-list";
import { Col, getRandomTagType, Row, SectionComponent, TagInputComponent, } from "@common-components";
import { text, user } from "@core";
import { Gender, patients } from "@modules";
import { num } from "@utils";
import { computed } from "mobx";
import { observer } from "mobx-react";
import { Dropdown, TextField } from "office-ui-fabric-react";
import * as React from "react";
let PatientDetailsPanel = class PatientDetailsPanel extends React.Component {
    get canEdit() {
        return user.currentUser.canEditPatients;
    }
    render() {
        return (React.createElement("div", { className: "spd-pn" },
            React.createElement(SectionComponent, { title: text(`Basic Info`) },
                React.createElement("div", { className: "name" },
                    React.createElement(TextField, { label: text(`Name`), value: this.props.patient.name, onChange: (ev, name) => (this.props.patient.name = name), disabled: !this.canEdit })),
                React.createElement(Row, { gutter: 6 },
                    React.createElement(Col, { sm: 12 },
                        React.createElement("div", { className: "birth" },
                            React.createElement(TextField, { label: text("Birth year / age"), value: this.props.patient.birthYear.toString(), onChange: (ev, year) => (this.props.patient.birthYear = num(year)), type: "number", disabled: !this.canEdit }))),
                    React.createElement(Col, { sm: 12 },
                        React.createElement("div", { className: "gender" },
                            React.createElement(Dropdown, { label: text("Gender"), selectedKey: this.props.patient.gender === Gender.male
                                    ? "male"
                                    : "female", options: [
                                    { key: "male", text: text("Male") },
                                    { key: "female", text: text("Female") },
                                ], onChange: (ev, val) => {
                                    if (val.key === "male") {
                                        this.props.patient.gender = Gender.male;
                                    }
                                    else {
                                        this.props.patient.gender = Gender.female;
                                    }
                                }, disabled: !this.canEdit }))))),
            React.createElement(SectionComponent, { title: text(`Contact Info`) },
                React.createElement(TextField, { label: text("Phone"), value: this.props.patient.phone, onChange: (ev, phone) => (this.props.patient.phone = phone), type: "number", disabled: !this.canEdit }),
                React.createElement(TextField, { label: text("WhatsApp Phone"), value: this.props.patient.whatsapphone, onChange: (ev, phone) => (this.props.patient.whatsapphone = phone), type: "telephone", disabled: !this.canEdit }),
                React.createElement(TextField, { label: text("Email"), value: this.props.patient.email, onChange: (ev, email) => (this.props.patient.email = email), disabled: !this.canEdit }),
                React.createElement(TextField, { label: text("Address"), value: this.props.patient.address, onChange: (ev, address) => (this.props.patient.address = address), disabled: !this.canEdit })),
            React.createElement(SectionComponent, { title: text(`Other Notes`) },
                React.createElement(Row, { gutter: 6 },
                    React.createElement(Col, { md: 12 },
                        " ",
                        React.createElement(TagInputComponent, { disabled: !this.canEdit, className: "patient-tags", placeholder: text("Labels"), options: [""]
                                .concat(...patients.list.map((patient) => patient.labels.map((label) => label.text)))
                                .map((x) => ({
                                key: x,
                                text: x,
                            }))
                                .reduce((arr, item) => {
                                if (arr.findIndex((x) => x.key === item.key) === -1) {
                                    arr.push(item);
                                }
                                return arr;
                            }, []), onChange: (newVal) => {
                                this.props.patient.labels = newVal.map((item) => {
                                    return {
                                        text: item.text,
                                        type: getRandomTagType(item.text),
                                    };
                                });
                            }, value: this.props.patient.labels.map((label) => ({
                                key: label.text,
                                text: label.text,
                            })) })),
                    React.createElement(Col, { md: 12 },
                        React.createElement("div", { className: "medical-history" },
                            React.createElement(EditableListComponent, { label: text("Notes"), value: this.props.patient.medicalHistory, onChange: (newVal) => {
                                    this.props.patient.medicalHistory = newVal;
                                }, style: { marginTop: "0" }, disabled: !this.canEdit })))))));
    }
};
tslib_1.__decorate([
    computed
], PatientDetailsPanel.prototype, "canEdit", null);
PatientDetailsPanel = tslib_1.__decorate([
    observer
], PatientDetailsPanel);
export { PatientDetailsPanel };
//# sourceMappingURL=patient-details.js.map