import * as tslib_1 from "tslib";
import { patients, setting, staff, treatments } from "@modules";
import { comparableTime, generateID, hour, isToday, isTomorrow, isYesterday, num } from "@utils";
import { computed, observable } from "mobx";
export class Appointment {
    constructor(json) {
        this._id = generateID();
        this.triggerUpdate = 0;
        this.timer = null;
        this.complaint = "";
        this.diagnosis = "";
        this.treatmentID = (treatments.list[0] || { _id: "" })._id;
        this.units = 1;
        this.patientID = "";
        this.staffID = [];
        this.date = new Date().getTime();
        this.involvedTeeth = [];
        this.time = 0;
        this.finalPrice = 0;
        this.paidAmount = 0;
        this.procedureId = "";
        this.isDone = false;
        this.status = "";
        this.notes = "";
        this.discount = 0;
        this.paymentDescription = "";
        this.prescriptions = [];
        if (json) {
            this.fromJSON(json);
        }
    }
    get isPaid() {
        return this.paidAmount >= this.finalPrice;
    }
    get outstandingAmount() {
        return Math.max(this.profit - this.paidAmount, 0);
        // return Math.max(this.finalPrice - this.paidAmount, 0);
    }
    get overpaidAmount() {
        return Math.max(this.paidAmount - this.profit, 0);
        // return Math.max(this.paidAmount - this.finalPrice, 0);
    }
    get operatingStaff() {
        return staff.list.filter(member => this.staffID.indexOf(member._id) !== -1);
    }
    get patient() {
        return patients.list.find(x => x._id === this.patientID);
    }
    get treatment() {
        return treatments.list[treatments.getIndexByID(this.treatmentID)];
    }
    get expenses() {
        if (!this.treatment) {
            if (this.treatmentID.indexOf("|") > -1) {
                return num(this.treatmentID.split("|")[1]);
            }
            else {
                return 0;
            }
        }
        return this.treatment.expenses * this.units;
    }
    get totalExpenses() {
        return this.expenses + this.spentTimeValue;
    }
    get procedureName() {
        const foundProcedure = this.patient.procedures.find(pro => this.procedureId === pro.id);
        if (foundProcedure) {
            return foundProcedure.name;
        }
        return "";
    }
    get remainingAmount() {
        return this.profit - this.paidAmount;
    }
    get profit() {
        let totalDiscount = this.discount;
        if (this.insuranceDetails) {
            totalDiscount = totalDiscount + this.insuranceDetails.discount;
        }
        return this.finalPrice - (this.finalPrice * totalDiscount) / 100;
        // return this.finalPrice - this.totalExpenses;
    }
    get profitPercentage() {
        return isNaN(this.profit / this.finalPrice)
            ? 0
            : this.profit / this.finalPrice;
    }
    get isOutstanding() {
        return this.isDone && this.outstandingAmount !== 0;
    }
    get isOverpaid() {
        return this.isDone && this.overpaidAmount !== 0;
    }
    get dueToday() {
        return isToday(this.date) && !this.isDone;
    }
    get dueTomorrow() {
        return isTomorrow(this.date);
    }
    get dueYesterday() {
        return isYesterday(this.date);
    }
    get missed() {
        return (new Date().getTime() - new Date(this.date).getTime() > 0 &&
            !this.isDone &&
            !this.dueToday);
    }
    get future() {
        return (!this.dueToday &&
            !this.dueTomorrow &&
            !this.isDone &&
            this.date > new Date().getTime());
    }
    get dateFloor() {
        const d = comparableTime(new Date(this.date));
        return new Date(`${d.y}/${d.m + 1}/${d.d}`);
    }
    get formattedTime() {
        return new Date(this.date)
            .toLocaleTimeString()
            .replace(/:[0-9]{2} /, " ");
    }
    get spentTimeValue() {
        return num(setting.getSetting("hourlyRate")) * (this.time / hour);
    }
    get doctors() {
        const d = [];
        this.staffID.forEach((staffId) => {
            const found = staff.list.find(({ _id }) => staffId === _id);
            if (found) {
                d.push(found.name);
            }
        });
        return d;
    }
    get insuranceDetails() {
        const { insurance } = this.patient;
        if (insurance) {
            return insurance;
        }
        return { name: "", discount: 0 };
    }
    get searchableString() {
        return `
				${this.complaint}
                ${this.diagnosis}
                ${new Date(this.date).toDateString()}
                ${this.treatment ? this.treatment.type : ""}
                ${this.isPaid ? "paid" : ""}
				${this.isOutstanding ? "outstanding" : ""}
				${this.isOverpaid ? "overpaid" : ""}
                ${this.missed ? "missed" : ""}
                ${this.dueToday ? "today" : ""}
				${this.dueTomorrow ? "tomorrow" : ""}
				${this.future ? "future" : ""}
				${(this.patient || { name: "" }).name}
				${this.operatingStaff.map(x => x.name).join(" ")}
				${this.notes}
		`.toLowerCase();
    }
    fromJSON(json) {
        this._id = json._id;
        this.treatmentID = json.treatmentID;
        this.patientID = json.patientID;
        this.procedureId = json.procedureId;
        this.date = json.date;
        this.involvedTeeth = json.involvedTeeth;
        this.paidAmount = json.paidAmount;
        this.finalPrice = json.finalPrice || 0;
        this.status = json.status;
        this.discount = json.discount;
        this.paymentDescription = json.paymentDescription;
        this.isDone =
            typeof json.isDone === "undefined"
                ? json.done
                : json.isDone;
        this.prescriptions = json.prescriptions;
        this.time = json.time;
        this.diagnosis = json.diagnosis;
        this.complaint = json.complaint;
        this.staffID = json.staffID || json.doctorsID || [];
        this.units = json.units || 1;
        this.notes = json.notes
            ? json.notes
            : json.complaint && json.diagnosis
                ? `Complaint: ${json.complaint}.
Diagnosis: ${json.diagnosis}`
                : "";
    }
    toJSON() {
        return {
            _id: this._id,
            treatmentID: this.treatmentID,
            patientID: this.patientID,
            date: this.date,
            involvedTeeth: Array.from(this.involvedTeeth),
            paidAmount: this.paidAmount,
            finalPrice: this.finalPrice || 0,
            isDone: this.isDone,
            prescriptions: Array.from(this.prescriptions),
            time: this.time,
            diagnosis: this.diagnosis,
            complaint: this.complaint,
            staffID: Array.from(this.staffID),
            units: this.units,
            notes: this.notes,
            status: this.status,
            procedureId: this.procedureId,
            discount: this.discount,
            paymentDescription: this.paymentDescription
        };
    }
    setStatus(value) {
        this.status = value;
    }
    setIsDone(value) {
        this.isDone = value;
    }
    setDate(value) {
        this.date = value;
        this.staffID = [];
    }
}
tslib_1.__decorate([
    observable
], Appointment.prototype, "triggerUpdate", void 0);
tslib_1.__decorate([
    observable
], Appointment.prototype, "timer", void 0);
tslib_1.__decorate([
    observable
], Appointment.prototype, "complaint", void 0);
tslib_1.__decorate([
    observable
], Appointment.prototype, "diagnosis", void 0);
tslib_1.__decorate([
    observable
], Appointment.prototype, "treatmentID", void 0);
tslib_1.__decorate([
    observable
], Appointment.prototype, "units", void 0);
tslib_1.__decorate([
    observable
], Appointment.prototype, "patientID", void 0);
tslib_1.__decorate([
    observable
], Appointment.prototype, "staffID", void 0);
tslib_1.__decorate([
    observable
], Appointment.prototype, "date", void 0);
tslib_1.__decorate([
    observable
], Appointment.prototype, "involvedTeeth", void 0);
tslib_1.__decorate([
    observable
], Appointment.prototype, "time", void 0);
tslib_1.__decorate([
    observable
], Appointment.prototype, "finalPrice", void 0);
tslib_1.__decorate([
    observable
], Appointment.prototype, "paidAmount", void 0);
tslib_1.__decorate([
    observable
], Appointment.prototype, "procedureId", void 0);
tslib_1.__decorate([
    observable
], Appointment.prototype, "isDone", void 0);
tslib_1.__decorate([
    observable
], Appointment.prototype, "status", void 0);
tslib_1.__decorate([
    observable
], Appointment.prototype, "notes", void 0);
tslib_1.__decorate([
    observable
], Appointment.prototype, "discount", void 0);
tslib_1.__decorate([
    observable
], Appointment.prototype, "paymentDescription", void 0);
tslib_1.__decorate([
    observable
], Appointment.prototype, "prescriptions", void 0);
tslib_1.__decorate([
    computed
], Appointment.prototype, "isPaid", null);
tslib_1.__decorate([
    computed
], Appointment.prototype, "outstandingAmount", null);
tslib_1.__decorate([
    computed
], Appointment.prototype, "overpaidAmount", null);
tslib_1.__decorate([
    computed
], Appointment.prototype, "operatingStaff", null);
tslib_1.__decorate([
    computed
], Appointment.prototype, "patient", null);
tslib_1.__decorate([
    computed
], Appointment.prototype, "treatment", null);
tslib_1.__decorate([
    computed
], Appointment.prototype, "expenses", null);
tslib_1.__decorate([
    computed
], Appointment.prototype, "totalExpenses", null);
tslib_1.__decorate([
    computed
], Appointment.prototype, "procedureName", null);
tslib_1.__decorate([
    computed
], Appointment.prototype, "remainingAmount", null);
tslib_1.__decorate([
    computed
], Appointment.prototype, "profit", null);
tslib_1.__decorate([
    computed
], Appointment.prototype, "profitPercentage", null);
tslib_1.__decorate([
    computed
], Appointment.prototype, "isOutstanding", null);
tslib_1.__decorate([
    computed
], Appointment.prototype, "isOverpaid", null);
tslib_1.__decorate([
    computed
], Appointment.prototype, "dueToday", null);
tslib_1.__decorate([
    computed
], Appointment.prototype, "dueTomorrow", null);
tslib_1.__decorate([
    computed
], Appointment.prototype, "dueYesterday", null);
tslib_1.__decorate([
    computed
], Appointment.prototype, "missed", null);
tslib_1.__decorate([
    computed
], Appointment.prototype, "future", null);
tslib_1.__decorate([
    computed
], Appointment.prototype, "dateFloor", null);
tslib_1.__decorate([
    computed
], Appointment.prototype, "formattedTime", null);
tslib_1.__decorate([
    computed
], Appointment.prototype, "spentTimeValue", null);
tslib_1.__decorate([
    computed
], Appointment.prototype, "doctors", null);
tslib_1.__decorate([
    computed
], Appointment.prototype, "insuranceDetails", null);
tslib_1.__decorate([
    computed
], Appointment.prototype, "searchableString", null);
//# sourceMappingURL=class.appointment.js.map