import * as tslib_1 from "tslib";
import { text } from "@core";
import { genderToString, patients, Visit, setting } from "@modules";
import { formatDate, generateID } from "@utils";
import { computed, observable, observe } from "mobx";
export const Access = {
    done: "Done",
    notdone: "Not done"
};
export const Cleaning = {
    done: "Done",
    notdone: "Not done"
};
export const Obturation = {
    done: "Done",
    notdone: "Not done"
};
export class EndoCase {
    constructor(json) {
        this._id = generateID();
        this.triggerUpdate = 0;
        this.startedDate = 0;
        this.patientID = "";
        /**
         * Extra-oral observations
         */
        this.access = "notdone";
        this.cleaning = "notdone";
        this.obturation = "notdone";
        /**
         * inputs
         */
        this.workinglength = 0; //In mm
        this.canals = 1; //whole numbers
        /**
         * conclusions
         */
        this.problemsList = [];
        this.treatmentPlan_appliance = [];
        this.orthoGallery = [];
        this.cephalometricHistory = [];
        this.isFinished = false;
        this.isStarted = false;
        this.finishedDate = 0;
        this.nextVisitNotes = [];
        this.visits = [];
        if (json) {
            this.fromJSON(json);
        }
        else {
            //observe(this.crossScissorBite, () => this.triggerUpdate++);
            observe(this.problemsList, () => this.triggerUpdate++);
            observe(this.treatmentPlan_appliance, () => this.triggerUpdate++);
            observe(this.orthoGallery, () => this.triggerUpdate++);
            observe(this.cephalometricHistory, () => this.triggerUpdate++);
            observe(this.visits, () => {
                this.triggerUpdate++;
            });
        }
    }
    get patient() {
        return patients.list.find(x => x._id === this.patientID);
    }
    get computedProblems() {
        const computedProblemsArr = [];
        if (this.access !== "done") {
            computedProblemsArr.push(text(Access[this.access]));
        }
        if (this.cleaning !== "done") {
            computedProblemsArr.push(text(Cleaning[this.cleaning]));
        }
        if (this.obturation === "done") {
            computedProblemsArr.push(text(Obturation[this.obturation]));
        }
        return computedProblemsArr;
    }
    get searchableString() {
        return !this.patient
            ? ""
            : `
			${this.patient.age} ${this.patient.birthYear}
			${this.patient.phone} ${this.patient.email} ${this.patient.address} ${genderToString(this.patient.gender)}
			${this.patient.name} ${this.patient.labels
                .map(x => x.text)
                .join(" ")} ${this.patient.medicalHistory.join(" ")}
			${this.patient.teeth.map(x => x.notes.join(" ")).join(" ")}
			${this.patient.nextAppointment
                ? (this.patient.nextAppointment.treatment || { type: "" })
                    .type
                : ""}
			${this.patient.nextAppointment
                ? formatDate(this.patient.nextAppointment.date, setting.getSetting("date_format"))
                : ""}
			${this.patient.lastAppointment
                ? (this.patient.lastAppointment.treatment || { type: "" })
                    .type
                : ""}
			${this.patient.lastAppointment
                ? formatDate(this.patient.lastAppointment.date, setting.getSetting("date_format"))
                : ""}
			${this.patient.differenceAmount < 0
                ? "outstanding " + this.patient.outstandingAmount
                : ""}
			${this.patient.differenceAmount > 0
                ? "Overpaid " + this.patient.overpaidAmount
                : ""}
		`.toLowerCase();
    }
    toJSON() {
        return {
            _id: this._id,
            patientID: this.patientID,
            startedDate: this.startedDate,
            isStarted: this.isStarted,
            access: this.access,
            cleaning: this.cleaning,
            obturation: this.obturation,
            workinglength: this.workinglength,
            canals: this.canals,
            problemsList: Array.from(this.problemsList),
            treatmentPlan_appliance: Array.from(this.treatmentPlan_appliance),
            orthoGallery: Array.from(this.orthoGallery),
            cephalometricHistory: Array.from(this.cephalometricHistory),
            isFinished: this.isFinished,
            finishedDate: this.finishedDate,
            nextVisitNotes: Array.from(this.nextVisitNotes),
            visits: Array.from(this.visits).map(x => x.toJSON())
        };
    }
    fromJSON(json) {
        this._id = json._id;
        this.startedDate = json.startedDate || 0;
        this.patientID = json.patientID;
        this.access = json.access,
            this.cleaning = json.cleaning,
            this.obturation = json.obturation,
            this.workinglength = json.workinglength,
            this.canals = json.canals,
            this.cephalometricHistory = json.cephalometricHistory || [];
        this.isFinished = !!json.isFinished;
        this.finishedDate = json.finishedDate || 0;
        this.nextVisitNotes = json.nextVisitNotes || [];
        this.visits = json.visits ? json.visits.map(x => new Visit(x)) : [];
        this.isFinished = !!json.isFinished;
        this.isStarted = !!json.isStarted;
        observe(this.problemsList, () => this.triggerUpdate++);
        observe(this.treatmentPlan_appliance, () => this.triggerUpdate++);
        observe(this.orthoGallery, () => this.triggerUpdate++);
        observe(this.cephalometricHistory, () => this.triggerUpdate++);
        observe(this.visits, () => {
            this.triggerUpdate++;
        });
    }
}
tslib_1.__decorate([
    observable
], EndoCase.prototype, "triggerUpdate", void 0);
tslib_1.__decorate([
    observable
], EndoCase.prototype, "startedDate", void 0);
tslib_1.__decorate([
    observable
], EndoCase.prototype, "patientID", void 0);
tslib_1.__decorate([
    computed
], EndoCase.prototype, "patient", null);
tslib_1.__decorate([
    observable
], EndoCase.prototype, "access", void 0);
tslib_1.__decorate([
    observable
], EndoCase.prototype, "cleaning", void 0);
tslib_1.__decorate([
    observable
], EndoCase.prototype, "obturation", void 0);
tslib_1.__decorate([
    observable
], EndoCase.prototype, "workinglength", void 0);
tslib_1.__decorate([
    observable
], EndoCase.prototype, "canals", void 0);
tslib_1.__decorate([
    observable
], EndoCase.prototype, "problemsList", void 0);
tslib_1.__decorate([
    observable
], EndoCase.prototype, "treatmentPlan_appliance", void 0);
tslib_1.__decorate([
    observable
], EndoCase.prototype, "orthoGallery", void 0);
tslib_1.__decorate([
    observable
], EndoCase.prototype, "cephalometricHistory", void 0);
tslib_1.__decorate([
    observable
], EndoCase.prototype, "isFinished", void 0);
tslib_1.__decorate([
    observable
], EndoCase.prototype, "isStarted", void 0);
tslib_1.__decorate([
    observable
], EndoCase.prototype, "finishedDate", void 0);
tslib_1.__decorate([
    observable
], EndoCase.prototype, "nextVisitNotes", void 0);
tslib_1.__decorate([
    observable
], EndoCase.prototype, "visits", void 0);
tslib_1.__decorate([
    computed
], EndoCase.prototype, "computedProblems", null);
tslib_1.__decorate([
    computed
], EndoCase.prototype, "searchableString", null);
//# sourceMappingURL=class.ortho.js.map