import * as tslib_1 from "tslib";
import { Col, ProfileComponent, ProfileSquaredComponent, Row, SectionComponent, TagComponent, TagInputComponent, TagType } from "@common-components";
import { text, user } from "@core";
import { appointments, ISOTeethArr, itemFormToString, Patient, prescriptions, setting, staff, Treatment, treatments, patients } from "@modules";
import { convert, formatDate, num, round } from "@utils";
import { computed, observable } from "mobx";
import { observer } from "mobx-react";
import { Checkbox, DatePicker, DefaultButton, Dropdown, Icon, IconButton, Label, Panel, PanelType, PrimaryButton, TextField } from "office-ui-fabric-react";
import * as React from "react";
let AppointmentEditorPanel = class AppointmentEditorPanel extends React.Component {
    constructor() {
        super(...arguments);
        this.timerInputs = [];
        this.timeComb = {
            hours: this.calcTime.hours,
            minutes: this.calcTime.minutes,
            am: this.calcTime.am
        };
    }
    get patient() {
        return patients.list.find(p => (p._id === this.props.appointment.patientID));
    }
    get patientInsurance() {
        const { appointment } = this.props;
        const patient = patients.list.find((patientDetails) => appointment && patientDetails._id === appointment.patientID);
        if (patient) {
            return patient.insurance;
        }
        return null;
    }
    get calcTime() {
        if (!this.props.appointment) {
            return {
                hours: 12,
                minutes: "00",
                am: false
            };
        }
        const timeString = new Date(this.props.appointment.date).toLocaleTimeString("en-US");
        const obj = {
            hours: Number(timeString.split(":")[0]),
            minutes: Number(timeString.split(":")[1]) < 30 ? "00" : "30",
            am: timeString.replace(/[^A-Z]/gi, "").toLowerCase() === "am"
        };
        return obj;
    }
    get otherAppointmentsNumber() {
        const appointment = this.props.appointment;
        if (!appointment) {
            return [].length - 1;
        }
        return appointments
            .appointmentsForDay(appointment.date, 0, 0)
            .filter(a => a._id !== appointment._id).length;
    }
    get treatmentOptions() {
        const list = JSON.parse(JSON.stringify(treatments.list));
        if (this.props.appointment &&
            this.props.appointment.treatmentID.indexOf("|") > -1) {
            const arr = this.props.appointment.treatmentID.split("|");
            const _id = this.props.appointment.treatmentID;
            const type = arr[0];
            const expenses = num(arr[1]);
            list.push(new Treatment({ _id, expenses, type }));
        }
        return list;
    }
    get canEdit() {
        return user.currentUser.canEditAppointments;
    }
    setTimeFromCombination() {
        if (!this.props.appointment) {
            return;
        }
        if (this.timeComb.hours === 12) {
            this.timeComb.am = true;
        }
        const d = new Date(this.props.appointment.date);
        d.setHours(this.timeComb.am ? this.timeComb.hours : this.timeComb.hours + 12, Number(this.timeComb.minutes), 0, 0);
        this.props.appointment.date = d.getTime();
        this.forceUpdate();
    }
    render() {
        const insurance = this.patientInsurance;
        return this.props.appointment ? (React.createElement(Panel, { isOpen: !!this.props.appointment, type: PanelType.medium, closeButtonAriaLabel: "Close", isLightDismiss: true, onDismiss: this.props.onDismiss, onRenderNavigation: () => (React.createElement(Row, { className: "panel-heading" },
                React.createElement(Col, { span: 22 },
                    React.createElement(ProfileComponent, { secondaryElement: React.createElement("span", null,
                            formatDate(this.props.appointment.date, setting.getSetting("date_format")),
                            " ",
                            "/",
                            " ",
                            this.props.appointment
                                ? this.props.appointment.treatment
                                    ? this.props.appointment
                                        .treatment.type
                                    : ""
                                : ""), name: (this.props.appointment.patient || {
                            name: ""
                        }).name, size: 3 })),
                React.createElement(Col, { span: 2, className: "close" },
                    React.createElement(IconButton, { iconProps: { iconName: "cancel" }, onClick: () => {
                            this.props.onDismiss();
                        } })))) },
            React.createElement("div", { className: "appointment-editor" },
                React.createElement(SectionComponent, { title: text("Appointment") },
                    React.createElement(Row, { gutter: 12 },
                        React.createElement(Col, { sm: 12 },
                            React.createElement("div", { className: "appointment-input date" },
                                React.createElement(DatePicker, { label: text("Date"), disabled: !this.canEdit, className: "appointment-date", placeholder: text("Select a date"), value: new Date(this.props.appointment.date), onSelectDate: date => {
                                        if (date) {
                                            this.props.appointment.setDate(date.getTime());
                                        }
                                    }, formatDate: d => formatDate(d || 0, setting.getSetting("date_format")) }),
                                React.createElement("p", { className: "insight" },
                                    text("With"),
                                    " ",
                                    React.createElement("span", { className: "num-" +
                                            this.otherAppointmentsNumber }, this.otherAppointmentsNumber),
                                    " ",
                                    text("other appointment")))),
                        React.createElement(Col, { sm: 12 },
                            React.createElement("div", { className: "appointment-input time" },
                                React.createElement(Row, { gutter: 12 },
                                    React.createElement(Label, null, text("Time")),
                                    React.createElement(Row, { gutter: 0 },
                                        React.createElement(Col, { span: 8 },
                                            React.createElement(Dropdown, { options: [
                                                    12,
                                                    1,
                                                    2,
                                                    3,
                                                    4,
                                                    5,
                                                    6,
                                                    7,
                                                    8,
                                                    9,
                                                    10,
                                                    11
                                                ].map(x => ({
                                                    key: x.toString(),
                                                    text: x < 10
                                                        ? `0${x.toString()}`
                                                        : x.toString()
                                                })), selectedKey: this.calcTime.hours.toString(), onChange: (ev, val) => {
                                                    if (val) {
                                                        this.timeComb.hours = Number(val.key.toString());
                                                        this.setTimeFromCombination();
                                                    }
                                                } })),
                                        React.createElement(Col, { span: 8 },
                                            React.createElement(Dropdown, { options: ["00", "30"].map(x => ({
                                                    key: x,
                                                    text: x
                                                })), selectedKey: this.calcTime.minutes, onChange: (ev, val) => {
                                                    if (val) {
                                                        this.timeComb.minutes = val.key.toString();
                                                        this.setTimeFromCombination();
                                                    }
                                                } })),
                                        React.createElement(Col, { span: 8 },
                                            React.createElement(Dropdown, { options: [
                                                    {
                                                        text: "am",
                                                        key: "am"
                                                    },
                                                    {
                                                        text: "pm",
                                                        key: "pm"
                                                    }
                                                ], selectedKey: this.calcTime.am
                                                    ? "am"
                                                    : "pm", onChange: (ev, val) => {
                                                    if (val) {
                                                        this.timeComb.am =
                                                            val.key.toString() ===
                                                                "am";
                                                        this.setTimeFromCombination();
                                                    }
                                                } }))))))),
                    React.createElement("div", { className: "appointment-input date" },
                        React.createElement("label", null,
                            text("Operating staff"),
                            " "),
                        staff.list
                            .filter(member => member.operates)
                            .map(member => {
                            const checked = this.props.appointment.staffID.indexOf(member._id) > -1;
                            return (React.createElement(Checkbox, { key: member._id, label: member.name, disabled: !this.canEdit ||
                                    (!checked &&
                                        member.onDutyDays.indexOf(new Date(this.props.appointment.date).toLocaleDateString("en-us", {
                                            weekday: "long"
                                        })) === -1), checked: checked, onChange: (ev, isChecked) => {
                                    if (isChecked) {
                                        this.props.appointment.staffID.push(member._id);
                                    }
                                    else {
                                        this.props.appointment.staffID.splice(this.props.appointment.staffID.indexOf(member._id), 1);
                                    }
                                    this.props.appointment
                                        .triggerUpdate++;
                                } }));
                        }))),
                React.createElement(SectionComponent, { title: text("Case Details") },
                    React.createElement(TextField, { multiline: true, disabled: !this.canEdit, label: text("Details"), value: this.props.appointment.notes, onChange: (e, value) => {
                            this.props.appointment.notes = value;
                        } }),
                    React.createElement("br", null),
                    React.createElement(Row, { gutter: 12 },
                        React.createElement(Col, { sm: 12 },
                            React.createElement("div", { className: "appointment-input treatment" },
                                React.createElement(Dropdown, { label: text("Treatment"), disabled: !this.canEdit, className: "treatment-type", selectedKey: this.props.appointment.treatmentID, options: this.treatmentOptions
                                        .sort((a, b) => a.type.localeCompare(b.type))
                                        .map(tr => {
                                        return {
                                            key: tr._id,
                                            text: tr.type
                                        };
                                    }), onChange: (e, newValue) => {
                                        this.props.appointment.treatmentID = newValue.key.toString();
                                    } }))),
                        React.createElement(Col, { sm: 12 },
                            React.createElement("div", { className: "appointment-input units-number" },
                                React.createElement(TextField, { label: text("Units number"), disabled: !this.canEdit, type: "number", value: this.props.appointment.units.toString(), onChange: (e, newValue) => {
                                        this.props.appointment.units = num(newValue);
                                    } }))),
                        React.createElement(Col, { span: 24 },
                            " ",
                            React.createElement("div", { className: "appointment-input involved-teeth" },
                                React.createElement(TagInputComponent, { disabled: !this.canEdit, placeholder: text("Involved teeth"), value: this.props.appointment.involvedTeeth.map(x => ({
                                        key: x.toString(),
                                        text: x.toString()
                                    })), strict: true, options: ISOTeethArr.map(x => {
                                        return {
                                            key: x.toString(),
                                            text: x.toString()
                                        };
                                    }), formatText: x => `${x.toString()} - ${convert(num(x)).Palmer}`, onChange: newValue => {
                                        this.props.appointment.involvedTeeth = newValue.map(x => num(x.key));
                                    } })))),
                    setting.getSetting("module_prescriptions") ? (React.createElement("div", null,
                        React.createElement("hr", { className: "appointment-hr" }),
                        React.createElement("div", { className: "appointment-input prescription" },
                            React.createElement(TagInputComponent, { disabled: !this.canEdit, className: "prescription", value: this.props.appointment.prescriptions.map(x => ({
                                    key: x.id,
                                    text: x.prescription
                                })), options: prescriptions.list.map(this.prescriptionToTagInput), onChange: newValue => {
                                    this.props.appointment.prescriptions = newValue.map(x => ({
                                        id: x.key,
                                        prescription: x.text
                                    }));
                                }, strict: true, placeholder: text("Prescription") })),
                        React.createElement("div", { id: "prescription-items" },
                            React.createElement("div", { className: "print-heading" },
                                React.createElement("h2", null, user.currentUser.name),
                                React.createElement("hr", null),
                                React.createElement("h3", null,
                                    "Patient:",
                                    " ",
                                    (this.props.appointment
                                        .patient ||
                                        new Patient()).name),
                                React.createElement(Row, null,
                                    React.createElement(Col, { span: 12 },
                                        React.createElement("h4", null,
                                            "Age:",
                                            " ",
                                            (this.props
                                                .appointment
                                                .patient ||
                                                new Patient()).age)),
                                    React.createElement(Col, { span: 12 },
                                        React.createElement("h4", null,
                                            "Gender:",
                                            " ",
                                            (this.props.appointment
                                                .patient ||
                                                new Patient()).gender
                                                ? "Female"
                                                : "Male"))),
                                React.createElement("hr", null)),
                            this.props.appointment.prescriptions.map(item => {
                                return (React.createElement(Row, { key: item.id },
                                    React.createElement(Col, { span: 20, className: "m-b-5" },
                                        React.createElement(ProfileSquaredComponent, { text: item.prescription.split(":")[0], onRenderInitials: () => (React.createElement(Icon, { iconName: "pill" })), subText: item.prescription.split(":")[1] })),
                                    React.createElement(Col, { span: 4, style: {
                                            textAlign: "right"
                                        } }, this.canEdit ? (React.createElement(IconButton, { iconProps: {
                                            iconName: "delete"
                                        }, onClick: () => {
                                            this.props.appointment.prescriptions = this.props.appointment.prescriptions.filter(x => x.id !==
                                                item.id);
                                        } })) : (""))));
                            })),
                        this.props.appointment.prescriptions
                            .length ? (React.createElement(DefaultButton, { onClick: print, iconProps: { iconName: "print" }, text: text("Print prescription") })) : (""))) : ("")),
                React.createElement(SectionComponent, { title: text("Expenses & Price") },
                    React.createElement(Row, { gutter: 12 },
                        React.createElement(Col, { sm: 16 }, setting.getSetting("time_tracking") ? (React.createElement("div", { className: "appointment-input time" },
                            React.createElement("label", null, text("Time (hours, minutes, seconds)")),
                            React.createElement(TextField, { className: "time-input hours", type: "number", disabled: !this.canEdit, value: this.formatMillisecondsToTime(this.props.appointment.time).hours, onChange: (e, v) => {
                                    this.timerInputs[0] = num(v);
                                    this.manuallyUpdateTime();
                                } }),
                            React.createElement(TextField, { className: "time-input minutes", type: "number", disabled: !this.canEdit, value: this.formatMillisecondsToTime(this.props.appointment.time).minutes, onChange: (e, v) => {
                                    this.timerInputs[1] = num(v);
                                    this.manuallyUpdateTime();
                                } }),
                            React.createElement(TextField, { className: "time-input seconds", type: "number", disabled: !this.canEdit, value: this.formatMillisecondsToTime(this.props.appointment.time).seconds, onChange: (e, v) => {
                                    this.timerInputs[2] = num(v);
                                    this.manuallyUpdateTime();
                                } }),
                            this.props.appointment.timer ? (React.createElement(PrimaryButton, { iconProps: {
                                    iconName: "Timer"
                                }, disabled: !this.canEdit, className: "appendage stop", text: text("Stop"), onClick: () => {
                                    const timer = this.props
                                        .appointment.timer;
                                    if (timer) {
                                        clearInterval(timer);
                                    }
                                    this.props.appointment.timer = null;
                                } })) : (React.createElement(PrimaryButton, { iconProps: {
                                    iconName: "Timer"
                                }, disabled: !this.canEdit, className: "appendage", text: text("Start"), onClick: () => {
                                    const i = appointments.getIndexByID(this.props.appointment
                                        ._id);
                                    const appointment = appointments.list[i];
                                    this.props.appointment.timer = window.setInterval(() => {
                                        appointment.time =
                                            appointment.time +
                                                1000;
                                    }, 1000);
                                } })),
                            React.createElement("p", { className: "payment-insight" },
                                React.createElement(TagComponent, { text: text("Time value") +
                                        ": " +
                                        setting.getSetting("currencySymbol") +
                                        round(this.props.appointment
                                            .spentTimeValue).toString(), type: TagType.info }),
                                React.createElement("br", null),
                                React.createElement(TagComponent, { text: text("Expenses") +
                                        ": " +
                                        setting.getSetting("currencySymbol") +
                                        round(this.props.appointment
                                            .expenses).toString(), type: TagType.info })))) : ("")),
                        React.createElement(Col, { sm: 24 },
                            React.createElement("div", { className: "appointment-input paid" },
                                React.createElement(Row, { gutter: 12 },
                                    React.createElement(Col, { sm: 8 },
                                        React.createElement(TextField, { type: "number", disabled: !this.canEdit, label: text("Price"), value: this.props.appointment.finalPrice.toString(), onChange: (e, newVal) => {
                                                this.props.appointment.finalPrice = num(newVal);
                                            }, prefix: setting.getSetting("currencySymbol") })),
                                    React.createElement(Col, { sm: 8 },
                                        React.createElement(TextField, { type: "number", disabled: !this.canEdit, label: text("Paid"), value: this.props.appointment.paidAmount.toString(), onChange: (e, newVal) => {
                                                this.props.appointment.paidAmount = num(newVal);
                                            }, prefix: setting.getSetting("currencySymbol") })),
                                    React.createElement(Col, { sm: 8 },
                                        React.createElement(TextField, { type: "number", disabled: true, label: this.props.appointment
                                                .outstandingAmount
                                                ? text("Outstanding")
                                                : this.props
                                                    .appointment
                                                    .overpaidAmount
                                                    ? text("Overpaid")
                                                    : text("Outstanding"), value: this.props.appointment
                                                .outstandingAmount
                                                ? this.props.appointment.outstandingAmount.toString()
                                                : this.props
                                                    .appointment
                                                    .overpaidAmount
                                                    ? this.props.appointment.overpaidAmount.toString()
                                                    : this.props.appointment.outstandingAmount.toString(), prefix: setting.getSetting("currencySymbol") }))),
                                React.createElement(Row, { gutter: 12 },
                                    React.createElement(Col, { sm: 8 },
                                        React.createElement(TextField, { type: "number", disabled: !this.canEdit, label: text('Discount'), value: this.props.appointment.discount.toString(), onChange: (e, newVal) => {
                                                this.props.appointment.discount = num(newVal);
                                            }, prefix: "%" })),
                                    insurance && React.createElement(Col, { sm: 8 },
                                        React.createElement(TextField, { type: "number", disabled: true, label: text(`Insurance : ${insurance.name}`), value: insurance.discount.toString(), onChange: (e, newVal) => {
                                                this.props.appointment.paidAmount = num(newVal);
                                            }, prefix: "%" }))),
                                React.createElement("p", { className: "payment-insight" },
                                    React.createElement(TagComponent, { text: text("Profit") +
                                            ": " +
                                            setting.getSetting("currencySymbol") +
                                            round(this.props.appointment
                                                .profit).toString(), type: TagType.success }),
                                    React.createElement("br", null),
                                    React.createElement(TagComponent, { text: text("Profit percentage") +
                                            ": " +
                                            round(this.props.appointment
                                                .profitPercentage * 100).toString() +
                                            "%", type: TagType.success }))))),
                    React.createElement(Row, { gutter: 12 },
                        React.createElement(Col, { sm: 24 },
                            React.createElement(Dropdown, { label: text("Status"), options: [
                                    "Completed",
                                    "Not Completed",
                                    "In Processing",
                                    "Delayed",
                                    "Discontinued"
                                ].map(x => ({
                                    key: x.toString(),
                                    text: x.toString()
                                })), selectedKey: this.props.appointment.status, onChange: (ev, val) => {
                                    if (val.key.toString() === 'Completed') {
                                        this.props.appointment.isDone = true;
                                    }
                                    else {
                                        this.props.appointment.isDone = false;
                                    }
                                    if (this.patient && this.patient.procedures) {
                                        const newPro = this.patient.procedures.map(pro => {
                                            if (pro.id === this.props.appointment.procedureId) {
                                                pro.status = val.key.toString();
                                            }
                                            return pro;
                                        });
                                        this.patient.procedures = newPro;
                                    }
                                    this.props.appointment.status = val.key.toString();
                                } })))),
                React.createElement("br", null),
                this.canEdit ? (React.createElement(PrimaryButton, { className: "delete", iconProps: {
                        iconName: "delete"
                    }, text: text("Delete"), onClick: () => {
                        const appointment = this.props.appointment;
                        appointments.deleteModal(appointment._id);
                        this.props.onDelete();
                    } })) : (""),
                React.createElement("br", null),
                React.createElement("br", null),
                React.createElement("br", null)))) : (React.createElement("div", null));
    }
    formatMillisecondsToTime(ms) {
        const msInSecond = 1000;
        const msInMinute = msInSecond * 60;
        const msInHour = msInMinute * 60;
        const hours = Math.floor(ms / msInHour);
        const minutes = Math.floor((ms % msInHour) / msInMinute);
        const seconds = Math.floor(((ms % msInHour) % msInMinute) / msInSecond);
        return {
            hours: padWithZero(hours),
            minutes: padWithZero(minutes),
            seconds: padWithZero(seconds)
        };
        function padWithZero(n) {
            return n > 9 ? n.toString() : "0" + n.toString();
        }
    }
    manuallyUpdateTime() {
        const msInSecond = 1000;
        const msInMinute = msInSecond * 60;
        const msInHour = msInMinute * 60;
        const hours = this.timerInputs[0];
        const minutes = this.timerInputs[1];
        const seconds = this.timerInputs[2];
        if (isNaN(hours) || isNaN(minutes) || isNaN(seconds)) {
            return;
        }
        this.props.appointment.time =
            hours * msInHour + minutes * msInMinute + seconds * msInSecond;
    }
    prescriptionToTagInput(p) {
        return {
            key: p._id,
            text: `${p.name}: ${p.doseInMg}${text("mg")} ${p.timesPerDay}X${p.unitsPerTime} ${text(itemFormToString(p.form))}`
        };
    }
};
tslib_1.__decorate([
    computed
], AppointmentEditorPanel.prototype, "patient", null);
tslib_1.__decorate([
    computed
], AppointmentEditorPanel.prototype, "patientInsurance", null);
tslib_1.__decorate([
    observable
], AppointmentEditorPanel.prototype, "timerInputs", void 0);
tslib_1.__decorate([
    observable
], AppointmentEditorPanel.prototype, "timeComb", void 0);
tslib_1.__decorate([
    computed
], AppointmentEditorPanel.prototype, "calcTime", null);
tslib_1.__decorate([
    computed
], AppointmentEditorPanel.prototype, "otherAppointmentsNumber", null);
tslib_1.__decorate([
    computed
], AppointmentEditorPanel.prototype, "treatmentOptions", null);
tslib_1.__decorate([
    computed
], AppointmentEditorPanel.prototype, "canEdit", null);
AppointmentEditorPanel = tslib_1.__decorate([
    observer
], AppointmentEditorPanel);
export { AppointmentEditorPanel };
//# sourceMappingURL=appointment-editor.js.map