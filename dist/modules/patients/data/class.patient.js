import * as tslib_1 from "tslib";
import { stringToTagType, TagTypeToString } from "@common-components";
import { appointments, Gender, genderToString, ISOTeeth, setting, stringToGender, Tooth, Payment, } from "@modules";
import { comparableTime, formatDate, generateID } from "@utils";
import { computed, observable, observe } from "mobx";
export const ProceduresDone = {
    done: "Yes",
    notdone: "No",
};
export class Procedures {
    // @observable priority: number = 0;
    // @observable desc: string = "";
    // @observable discount: string = "";
    // @observable fdiscount: string = "";
    // @observable insurance: string = "";
    // @observable psignature: string = "";
    constructor(json) {
        this.id = "";
        this.name = "";
        this.quantity = 0;
        this.patientID = "";
        this.tooth = [];
        this.fees = 0;
        this.done = false;
        this.status = "";
        this.date = "";
        this.surface = "";
        this.endoCaseId = "";
        if (json) {
            this.fromJSON(json);
        }
    }
    fromJSON(json) {
        this.id = json.id;
        this.slectedGraphicCode = json.slectedGraphicCode;
        this.patientID = json.patientid;
        this.done = json.done;
        this.date = json.date;
        this.tooth = json.tooth;
        this.fees = json.fees;
        this.name = json.name;
        this.quantity = json.quantity;
        this.status = json.status;
        this.surface = json.surface;
        this.endoCaseId = json.endoCaseId;
        // this.priority = json.priority;
        // this.desc = json.desc;
        // this.discount = json.discount;
        // this.fdiscount = json.fdiscount;
        // this.insurance = json.insurance;
        // this.psignature = json.psignature;
    }
    toJSON() {
        return {
            id: this.id,
            slectedGraphicCode: this.slectedGraphicCode,
            patientid: this.patientID,
            name: this.name,
            quantity: this.quantity,
            done: this.done,
            date: this.date,
            tooth: this.tooth,
            fees: this.fees,
            status: this.status,
            surface: this.surface,
            endoCaseId: this.endoCaseId,
        };
    }
}
tslib_1.__decorate([
    observable
], Procedures.prototype, "id", void 0);
tslib_1.__decorate([
    observable
], Procedures.prototype, "slectedGraphicCode", void 0);
tslib_1.__decorate([
    observable
], Procedures.prototype, "name", void 0);
tslib_1.__decorate([
    observable
], Procedures.prototype, "quantity", void 0);
tslib_1.__decorate([
    observable
], Procedures.prototype, "patientID", void 0);
tslib_1.__decorate([
    observable
], Procedures.prototype, "tooth", void 0);
tslib_1.__decorate([
    observable
], Procedures.prototype, "fees", void 0);
tslib_1.__decorate([
    observable
], Procedures.prototype, "done", void 0);
tslib_1.__decorate([
    observable
], Procedures.prototype, "status", void 0);
tslib_1.__decorate([
    observable
], Procedures.prototype, "date", void 0);
tslib_1.__decorate([
    observable
], Procedures.prototype, "surface", void 0);
tslib_1.__decorate([
    observable
], Procedures.prototype, "endoCaseId", void 0);
export class Patient {
    constructor(json) {
        this._id = generateID();
        this.triggerUpdate = 0;
        this.name = "";
        this.birthYear = 0;
        this.gender = Gender.male;
        this.tags = "";
        this.address = "";
        this.email = "";
        this.phone = "";
        this.whatsapphone = "";
        this.labels = [];
        this.medicalHistory = [];
        this.gallery = [];
        this.teeth = [];
        this.procedures = [];
        this.payments = [];
        this.procedureGraphicCode = [];
        this.alerts = "";
        this.allergies = "";
        this.cheifComplaint = "";
        this.orthoCaseId = "";
        this.reports = [];
        for (let index = 0; index < ISOTeeth.permanent.length; index++) {
            const number = ISOTeeth.permanent[index];
            this.teeth[number] = new Tooth(number);
        }
        for (let index = 0; index < ISOTeeth.deciduous.length; index++) {
            const number = ISOTeeth.deciduous[index];
            this.teeth[number] = new Tooth(number);
        }
        var d = new Date();
        let date = [
            d.getFullYear(),
            ("0" + (d.getMonth() + 1)).slice(-2),
            ("0" + d.getDate()).slice(-2),
        ].join("-");
        this.procedures[0] = new Procedures();
        if (json) {
            this.fromJSON(json);
        }
        else {
            observe(this.medicalHistory, () => this.triggerUpdate++);
            observe(this.labels, () => this.triggerUpdate++);
            observe(this.gallery, () => this.triggerUpdate++);
            this.teeth.forEach((tooth, index) => {
                observe(this.teeth[index], () => this.triggerUpdate++);
            });
        }
        this.procedureGraphicCode = [];
    }
    get age() {
        const diff = new Date().getFullYear() - this.birthYear;
        return diff > this.birthYear ? this.birthYear : diff;
    }
    get appointments() {
        return appointments.list.filter((appointment) => appointment.patientID === this._id);
    }
    get lastAppointment() {
        return this.appointments
            .filter((appointment) => appointment.isDone === true)
            .sort((a, b) => b.date - a.date)[0];
    }
    get nextAppointment() {
        return this.appointments
            .filter((appointment) => {
            if (appointment.isDone) {
                return false;
            }
            const t = comparableTime(new Date());
            const a = comparableTime(new Date(appointment.date));
            return t.y <= a.y && t.m <= a.m && t.d <= a.d;
        })
            .sort((a, b) => a.date - b.date)[0];
    }
    get hasPrimaryTeeth() {
        return this.age < 18;
    }
    get hasPermanentTeeth() {
        return this.age > 5;
    }
    get totalPayments() {
        return this.appointments
            .map((x) => x.paidAmount)
            .reduce((t, c) => {
            t = t + c;
            return t;
        }, 0);
    }
    get outstandingAmount() {
        return this.appointments
            .map((x) => x.outstandingAmount)
            .reduce((t, c) => {
            t = t + c;
            return t;
        }, 0);
    }
    get paymentDetails() {
        let totalDues = 0;
        let totalProfit = 0;
        let totalPaid = 0;
        let totalRemaining = 0;
        this.appointments.forEach((appointment) => {
            totalDues = totalDues + appointment.finalPrice;
            totalProfit = totalProfit + appointment.profit;
            totalPaid = totalPaid + appointment.paidAmount;
            totalRemaining = totalRemaining + appointment.remainingAmount;
        });
        return {
            totalDiscount: totalDues - totalProfit,
            totalDues,
            totalPaid,
            totalProfit,
            totalRemaining,
        };
    }
    get overpaidAmount() {
        return this.appointments
            .map((x) => x.overpaidAmount)
            .reduce((t, c) => {
            t = t + c;
            return t;
        }, 0);
    }
    get differenceAmount() {
        return this.overpaidAmount - this.outstandingAmount;
    }
    get searchableString() {
        return `
			${this.age} ${this.birthYear}
			${this.phone} ${this.email} ${this.address} ${genderToString(this.gender)}
			${this.name} ${this.labels
            .map((x) => x.text)
            .join(" ")} ${this.medicalHistory.join(" ")}
			${this.teeth.map((x) => x.notes.join(" ")).join(" ")}
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
			${this.differenceAmount < 0 ? "outstanding " + this.outstandingAmount : ""}
			${this.differenceAmount > 0 ? "Overpaid " + this.overpaidAmount : ""}
		`.toLowerCase();
    }
    fromJSON(json) {
        this._id = json._id;
        this.name = json.name;
        this.birthYear = json.birthYear;
        this.gender = stringToGender(json.gender);
        this.tags = json.tags;
        this.address = json.address;
        this.insurance = json.insurance;
        this.email = json.email;
        this.phone = json.phone;
        this.alerts = json.alerts;
        this.allergies = json.allergies;
        this.cheifComplaint = json.cheifComplaint;
        this.orthoCaseId = json.orthoCaseId;
        this.payments = json.payments.map((paymentObj) => new Payment(paymentObj));
        this.procedureGraphicCode = json.procedureGraphicCode;
        this.medicalHistory = Array.isArray(json.medicalHistory)
            ? json.medicalHistory
            : [];
        // this.patientOrthoCase = this.patientOrthoCase;
        this.reports = json.reports;
        this.gallery = json.gallery || [];
        let i = 0;
        if (json.procedures) {
            json.procedures.map((procedureObj) => {
                if (procedureObj !== null) {
                    const proc = new Procedures(procedureObj);
                    this.procedures[i] = proc;
                }
                i++;
            });
        }
        json.teeth.map((toothObj) => {
            if (toothObj) {
                const tooth = new Tooth(toothObj);
                this.teeth[tooth.ISO] = tooth;
            }
        });
        this.labels = json.labels.map((x) => {
            return {
                text: x.text,
                type: stringToTagType(x.type),
            };
        });
        observe(this.medicalHistory, () => this.triggerUpdate++);
        observe(this.gallery, () => this.triggerUpdate++);
        observe(this.labels, () => this.triggerUpdate++);
        this.teeth.forEach((tooth, index) => {
            if (tooth) {
                observe(this.teeth[index], () => this.triggerUpdate++);
                observe(this.teeth[index].notes, () => this.triggerUpdate++);
            }
        });
    }
    toJSON() {
        return {
            _id: this._id,
            name: this.name,
            birthYear: this.birthYear,
            gender: genderToString(this.gender),
            tags: this.tags,
            address: this.address,
            email: this.email,
            phone: this.phone,
            alerts: this.alerts,
            insurance: this.insurance,
            allergies: this.allergies,
            cheifComplaint: this.cheifComplaint,
            reports: this.reports,
            orthoCaseId: this.orthoCaseId,
            procedureGraphicCode: Array.from(this.procedureGraphicCode.map((x) => x)),
            medicalHistory: Array.from(this.medicalHistory),
            gallery: Array.from(this.gallery),
            teeth: Array.from(this.teeth.map((x) => x.toJSON())),
            payments: Array.from(this.payments.map((x) => x.toJSON())),
            procedures: Array.from(this.procedures.map((x) => x.toJSON())),
            labels: Array.from(this.labels.map((x) => {
                return {
                    text: x.text,
                    type: TagTypeToString(x.type),
                };
            })),
        };
    }
}
tslib_1.__decorate([
    observable
], Patient.prototype, "triggerUpdate", void 0);
tslib_1.__decorate([
    observable
], Patient.prototype, "name", void 0);
tslib_1.__decorate([
    observable
], Patient.prototype, "birthYear", void 0);
tslib_1.__decorate([
    observable
], Patient.prototype, "gender", void 0);
tslib_1.__decorate([
    observable
], Patient.prototype, "tags", void 0);
tslib_1.__decorate([
    observable
], Patient.prototype, "address", void 0);
tslib_1.__decorate([
    observable
], Patient.prototype, "email", void 0);
tslib_1.__decorate([
    observable
], Patient.prototype, "phone", void 0);
tslib_1.__decorate([
    observable
], Patient.prototype, "whatsapphone", void 0);
tslib_1.__decorate([
    observable
], Patient.prototype, "labels", void 0);
tslib_1.__decorate([
    observable
], Patient.prototype, "medicalHistory", void 0);
tslib_1.__decorate([
    observable
], Patient.prototype, "gallery", void 0);
tslib_1.__decorate([
    observable
], Patient.prototype, "procedures", void 0);
tslib_1.__decorate([
    observable
], Patient.prototype, "payments", void 0);
tslib_1.__decorate([
    observable
], Patient.prototype, "procedureGraphicCode", void 0);
tslib_1.__decorate([
    observable
], Patient.prototype, "alerts", void 0);
tslib_1.__decorate([
    observable
], Patient.prototype, "insurance", void 0);
tslib_1.__decorate([
    observable
], Patient.prototype, "allergies", void 0);
tslib_1.__decorate([
    observable
], Patient.prototype, "cheifComplaint", void 0);
tslib_1.__decorate([
    observable
], Patient.prototype, "orthoCaseId", void 0);
tslib_1.__decorate([
    observable
], Patient.prototype, "reports", void 0);
tslib_1.__decorate([
    computed
], Patient.prototype, "age", null);
tslib_1.__decorate([
    computed
], Patient.prototype, "appointments", null);
tslib_1.__decorate([
    computed
], Patient.prototype, "lastAppointment", null);
tslib_1.__decorate([
    computed
], Patient.prototype, "nextAppointment", null);
tslib_1.__decorate([
    computed
], Patient.prototype, "hasPrimaryTeeth", null);
tslib_1.__decorate([
    computed
], Patient.prototype, "hasPermanentTeeth", null);
tslib_1.__decorate([
    computed
], Patient.prototype, "totalPayments", null);
tslib_1.__decorate([
    computed
], Patient.prototype, "outstandingAmount", null);
tslib_1.__decorate([
    computed
], Patient.prototype, "paymentDetails", null);
tslib_1.__decorate([
    computed
], Patient.prototype, "overpaidAmount", null);
tslib_1.__decorate([
    computed
], Patient.prototype, "differenceAmount", null);
tslib_1.__decorate([
    computed
], Patient.prototype, "searchableString", null);
//# sourceMappingURL=class.patient.js.map