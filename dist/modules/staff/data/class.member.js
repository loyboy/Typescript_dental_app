import * as tslib_1 from "tslib";
import { appointments, Calendar, setting } from "@modules";
import { dateNames, formatDate, generateID } from "@utils";
import { computed, observable } from "mobx";
export class StaffMember {
    constructor(json) {
        this._id = generateID();
        this.triggerUpdate = 0;
        this.name = "";
        this.email = "";
        this.phone = "";
        this.operates = true;
        this.canEditConsents = true;
        this.canEditStaff = true;
        this.canEditPatients = true;
        this.canEditOrtho = true;
        this.canEditAppointments = true;
        this.canEditTreatments = true;
        this.canEditPrescriptions = true;
        this.canEditSettings = true;
        this.canViewStaff = true;
        this.canViewPatients = true;
        this.canViewInsurance = true;
        this.canEditInsurance = true;
        this.canViewOrtho = true;
        this.canViewAppointments = true;
        this.canViewTreatments = true;
        this.canViewPrescriptions = true;
        this.canViewSettings = true;
        this.canViewStats = true;
        this.pin = "";
        this.onDutyDays = [];
        if (json) {
            this.fromJSON(json);
        }
    }
    get onDuty() {
        return dateNames
            .days(true)
            .filter(day => this.onDutyDays.indexOf(day) !== -1)
            .map(day => dateNames.days(true).indexOf(day));
    }
    get sortedDays() {
        return this.onDutyDays
            .slice()
            .sort((dayA, dayB) => dateNames.days(true).indexOf(dayA) -
            dateNames.days(true).indexOf(dayB));
    }
    get appointments() {
        return appointments.list.filter(x => x.staffID.indexOf(this._id) !== -1);
    }
    get weeksAppointments() {
        const c = new Calendar();
        const resAppointments = {};
        c.selectedWeekDays.forEach(day => {
            const d = day.dateNum;
            const m = c.currentMonth;
            const y = c.currentYear;
            appointments
                .appointmentsForDay(y, m + 1, d)
                .filter(appointment => appointment.staffID.indexOf(this._id) !== -1)
                .forEach(appointment => {
                if (!resAppointments[day.weekDay.dayLiteral]) {
                    resAppointments[day.weekDay.dayLiteral] = [];
                }
                resAppointments[day.weekDay.dayLiteral].push(appointment);
            });
        });
        return resAppointments;
    }
    get lastAppointment() {
        return this.pastAppointments[0];
    }
    get searchableString() {
        return `
			${this.name} ${this.onDutyDays.join(" ")}
			${this.phone} ${this.email}
			${this.nextAppointment
            ? (this.nextAppointment.treatment || { type: "" }).type
            : ""}
			${this.nextAppointment
            ? formatDate(this.nextAppointment.date, setting.getSetting("date_format"))
            : ""}
			${this.lastAppointment
            ? (this.lastAppointment.treatment || { type: "" }).type
            : ""}
			${this.lastAppointment
            ? formatDate(this.lastAppointment.date, setting.getSetting("date_format"))
            : ""}
		`.toLowerCase();
    }
    get nextAppointment() {
        return this.nextAppointments[0];
    }
    get nextAppointments() {
        return this.appointments
            .filter(appointment => this.getDayStartingPoint(appointment.date) >=
            this.getDayStartingPoint(new Date().getTime()))
            .sort((a, b) => a.date - b.date);
    }
    get pastAppointments() {
        return this.appointments
            .filter(appointment => this.getDayStartingPoint(appointment.date) <
            this.getDayStartingPoint(new Date().getTime()))
            .sort((a, b) => b.date - a.date);
    }
    getDayStartingPoint(t) {
        const d = new Date(t);
        return new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
    }
    toJSON() {
        return {
            _id: this._id,
            name: this.name,
            email: this.email,
            phone: this.phone,
            operates: this.operates,
            onDutyDays: Array.from(this.onDutyDays),
            canEditStaff: this.canEditStaff,
            canEditPatients: this.canEditPatients,
            canEditOrtho: this.canEditOrtho,
            canEditAppointments: this.canEditAppointments,
            canEditTreatments: this.canEditTreatments,
            canEditInsurance: this.canEditInsurance,
            canEditPrescriptions: this.canEditPrescriptions,
            canEditSettings: this.canEditSettings,
            canViewStaff: this.canViewStaff,
            canViewPatients: this.canViewPatients,
            canViewInsurance: this.canViewInsurance,
            canViewOrtho: this.canViewOrtho,
            canViewAppointments: this.canViewAppointments,
            canViewTreatments: this.canViewTreatments,
            canViewPrescriptions: this.canViewPrescriptions,
            canViewSettings: this.canViewSettings,
            canViewStats: this.canViewStats,
            pin: this.pin
        };
    }
    fromJSON(json) {
        this._id = json._id;
        this.name = json.name || "";
        this.email = json.email || "";
        this.phone = json.phone || "";
        this.pin = json.pin;
        this.operates =
            typeof json.operates === "boolean" ? json.operates : true;
        this.onDutyDays = Array.isArray(json.onDutyDays) ? json.onDutyDays : [];
        this.canEditStaff =
            typeof json.canEditStaff === "boolean" ? json.canEditStaff : true;
        this.canEditPatients =
            typeof json.canEditPatients === "boolean"
                ? json.canEditPatients
                : true;
        this.canEditOrtho =
            typeof json.canEditOrtho === "boolean" ? json.canEditOrtho : true;
        this.canEditAppointments =
            typeof json.canEditAppointments === "boolean"
                ? json.canEditAppointments
                : true;
        this.canEditTreatments =
            typeof json.canEditTreatments === "boolean"
                ? json.canEditTreatments
                : true;
        this.canEditPrescriptions =
            typeof json.canEditPrescriptions === "boolean"
                ? json.canEditPrescriptions
                : true;
        this.canEditSettings =
            typeof json.canEditSettings === "boolean"
                ? json.canEditSettings
                : true;
        this.canViewStaff =
            typeof json.canViewStaff === "boolean" ? json.canViewStaff : true;
        this.canViewPatients =
            typeof json.canViewPatients === "boolean"
                ? json.canViewPatients
                : true;
        this.canViewOrtho =
            typeof json.canViewOrtho === "boolean" ? json.canViewOrtho : true;
        this.canViewAppointments =
            typeof json.canViewAppointments === "boolean"
                ? json.canViewAppointments
                : true;
        this.canViewTreatments =
            typeof json.canViewTreatments === "boolean"
                ? json.canViewTreatments
                : true;
        this.canViewPrescriptions =
            typeof json.canViewPrescriptions === "boolean"
                ? json.canViewPrescriptions
                : true;
        this.canViewSettings =
            typeof json.canViewSettings === "boolean"
                ? json.canViewSettings
                : true;
        this.canViewStats =
            typeof json.canViewStats === "boolean" ? json.canViewStats : true;
        this.canViewInsurance =
            typeof json.canViewInsurance === "boolean" ? json.canViewInsurance : true;
        this.canEditInsurance =
            typeof json.canEditInsurance === "boolean" ? json.canEditInsurance : true;
    }
}
tslib_1.__decorate([
    observable
], StaffMember.prototype, "triggerUpdate", void 0);
tslib_1.__decorate([
    observable
], StaffMember.prototype, "name", void 0);
tslib_1.__decorate([
    observable
], StaffMember.prototype, "email", void 0);
tslib_1.__decorate([
    observable
], StaffMember.prototype, "phone", void 0);
tslib_1.__decorate([
    observable
], StaffMember.prototype, "operates", void 0);
tslib_1.__decorate([
    observable
], StaffMember.prototype, "canEditConsents", void 0);
tslib_1.__decorate([
    observable
], StaffMember.prototype, "canEditStaff", void 0);
tslib_1.__decorate([
    observable
], StaffMember.prototype, "canEditPatients", void 0);
tslib_1.__decorate([
    observable
], StaffMember.prototype, "canEditOrtho", void 0);
tslib_1.__decorate([
    observable
], StaffMember.prototype, "canEditAppointments", void 0);
tslib_1.__decorate([
    observable
], StaffMember.prototype, "canEditTreatments", void 0);
tslib_1.__decorate([
    observable
], StaffMember.prototype, "canEditPrescriptions", void 0);
tslib_1.__decorate([
    observable
], StaffMember.prototype, "canEditSettings", void 0);
tslib_1.__decorate([
    observable
], StaffMember.prototype, "canViewStaff", void 0);
tslib_1.__decorate([
    observable
], StaffMember.prototype, "canViewPatients", void 0);
tslib_1.__decorate([
    observable
], StaffMember.prototype, "canViewInsurance", void 0);
tslib_1.__decorate([
    observable
], StaffMember.prototype, "canEditInsurance", void 0);
tslib_1.__decorate([
    observable
], StaffMember.prototype, "canViewOrtho", void 0);
tslib_1.__decorate([
    observable
], StaffMember.prototype, "canViewAppointments", void 0);
tslib_1.__decorate([
    observable
], StaffMember.prototype, "canViewTreatments", void 0);
tslib_1.__decorate([
    observable
], StaffMember.prototype, "canViewPrescriptions", void 0);
tslib_1.__decorate([
    observable
], StaffMember.prototype, "canViewSettings", void 0);
tslib_1.__decorate([
    observable
], StaffMember.prototype, "canViewStats", void 0);
tslib_1.__decorate([
    observable
], StaffMember.prototype, "pin", void 0);
tslib_1.__decorate([
    observable
], StaffMember.prototype, "onDutyDays", void 0);
tslib_1.__decorate([
    computed
], StaffMember.prototype, "onDuty", null);
tslib_1.__decorate([
    computed
], StaffMember.prototype, "sortedDays", null);
tslib_1.__decorate([
    computed
], StaffMember.prototype, "appointments", null);
tslib_1.__decorate([
    computed
], StaffMember.prototype, "weeksAppointments", null);
tslib_1.__decorate([
    computed
], StaffMember.prototype, "lastAppointment", null);
tslib_1.__decorate([
    computed
], StaffMember.prototype, "searchableString", null);
tslib_1.__decorate([
    computed
], StaffMember.prototype, "nextAppointment", null);
tslib_1.__decorate([
    computed
], StaffMember.prototype, "nextAppointments", null);
tslib_1.__decorate([
    computed
], StaffMember.prototype, "pastAppointments", null);
//# sourceMappingURL=class.member.js.map