import * as tslib_1 from "tslib";
import { text } from "@core";
import { genderToString, patients, setting } from "@modules";
import { formatDate, generateID } from "@utils";
import { computed, observable, observe } from "mobx";
export const Lips = {
    competent: "competent lips",
    incompetent: "incompetent lips",
    potentially_competent: "potentially competent lips"
};
export const FacialProfile = {
    brachycephalic: "brachycephalic profile",
    dolichocephalic: "dolichocephalic profile",
    mesocephalic: "mesocephalic profile"
};
export const OralHygiene = {
    good: "good oral hygiene",
    bad: "bad oral hygiene",
    moderate: "moderate oral hygiene"
};
export class Photo {
    constructor(json) {
        this.id = generateID();
        this.photoID = "";
        this.comment = "";
        if (json) {
            this.fromJSON(json);
        }
    }
    fromJSON(json) {
        this.id = json.id;
        this.photoID = json.photoID;
        this.comment = json.comment;
    }
    toJSON() {
        return {
            id: this.id,
            photoID: this.photoID,
            comment: this.comment
        };
    }
}
tslib_1.__decorate([
    observable
], Photo.prototype, "id", void 0);
tslib_1.__decorate([
    observable
], Photo.prototype, "photoID", void 0);
tslib_1.__decorate([
    observable
], Photo.prototype, "comment", void 0);
export class Visit {
    constructor(json, visitNumber) {
        this.id = generateID();
        this.visitNumber = 1;
        this.photos = [
            new Photo(),
            new Photo(),
            new Photo(),
            new Photo(),
            new Photo() // 5 Palatal
        ];
        this.date = new Date().getTime();
        this.appliance = "";
        if (json) {
            this.fromJSON(json);
        }
        if (visitNumber) {
            this.visitNumber = visitNumber;
        }
    }
    fromJSON(json) {
        this.id = json.id;
        this.visitNumber = json.visitNumber;
        this.date = json.date;
        this.appliance = json.appliance;
        this.photos = json.photos.map(x => new Photo(x));
    }
    toJSON() {
        return {
            id: this.id,
            visitNumber: this.visitNumber,
            date: this.date,
            appliance: this.appliance,
            photos: this.photos.map(x => x.toJSON())
        };
    }
}
tslib_1.__decorate([
    observable
], Visit.prototype, "id", void 0);
tslib_1.__decorate([
    observable
], Visit.prototype, "visitNumber", void 0);
tslib_1.__decorate([
    observable
], Visit.prototype, "photos", void 0);
tslib_1.__decorate([
    observable
], Visit.prototype, "date", void 0);
tslib_1.__decorate([
    observable
], Visit.prototype, "appliance", void 0);
export class OrthoCase {
    constructor(json) {
        this._id = generateID();
        this.triggerUpdate = 0;
        this.startedDate = 0;
        this.patientID = "";
        /**
         * Extra-oral observations
         */
        this.lips = "competent";
        this.facialProfile = "mesocephalic";
        this.nasioLabialAngle = 90;
        this.oralHygiene = "moderate";
        /**
         * jaw to jaw relationship
         */
        this.skeletalRelationship = 1;
        this.molarsRelationship = 1;
        this.canineRelationship = 1;
        /**
         * Anterior teeth relationship
         */
        this.overJet = 2;
        this.overBite = 3;
        this.crossScissorBite = [];
        /**
         * Space analysis: upper jaw
         */
        this.u_spaceAvailable = 0;
        this.u_spaceNeeded = 0;
        /**
         * Space analysis: lower jaw
         */
        this.l_spaceAvailable = 0;
        this.l_spaceNeeded = 0;
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
            observe(this.crossScissorBite, () => this.triggerUpdate++);
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
    get u_spacing() {
        return this.u_spaceAvailable - this.u_spaceNeeded;
    }
    get u_crowding() {
        return this.u_spaceNeeded - this.u_spaceAvailable;
    }
    get l_spacing() {
        return this.l_spaceAvailable - this.l_spaceNeeded;
    }
    get l_crowding() {
        return this.l_spaceNeeded - this.l_spaceAvailable;
    }
    get computedProblems() {
        const computedProblemsArr = [];
        if (this.lips !== "competent") {
            computedProblemsArr.push(text(Lips[this.lips]));
        }
        if (this.facialProfile !== "mesocephalic") {
            computedProblemsArr.push(text(FacialProfile[this.facialProfile]));
        }
        if (this.oralHygiene === "bad") {
            computedProblemsArr.push(text(OralHygiene[this.oralHygiene]));
        }
        if (this.nasioLabialAngle < 90 || this.nasioLabialAngle > 93) {
            computedProblemsArr.push(`${text("Nasio-labial angle")}: ${this.nasioLabialAngle} ${text("degrees")}`);
        }
        if (this.skeletalRelationship !== 1) {
            computedProblemsArr.push(`${text("Skeletal relationship: Class ")}${this.skeletalRelationship}`);
        }
        if (this.molarsRelationship !== 1) {
            computedProblemsArr.push(`${text("Molars relationship: Class ")}${this.molarsRelationship}`);
        }
        if (this.canineRelationship !== 1) {
            computedProblemsArr.push(`${text("Canine relationship: Class ")}${this.canineRelationship}`);
        }
        if (this.overJet > 3 || this.overJet < 1) {
            computedProblemsArr.push(`${text("Overjet")} :${this.overJet} ${text("mm")}`);
        }
        if (this.overBite > 4 || this.overBite < 2) {
            computedProblemsArr.push(`${text("Overbite")} :${this.overBite} ${text("mm")}`);
        }
        if (this.crossScissorBite.length) {
            computedProblemsArr.push(`${text("Cross/scissors bite")}: ${this.crossScissorBite.join(", ")}`);
        }
        if (this.u_crowding > 0) {
            computedProblemsArr.push(`${text("Upper arch crowding by")} ${this.u_crowding}${text("mm")}`);
        }
        if (this.u_spacing > 0) {
            computedProblemsArr.push(`${text("Upper arch spacing by")} ${this.u_spacing}${text("mm")}`);
        }
        if (this.l_crowding > 0) {
            computedProblemsArr.push(`${text("Lower arch crowding by")} ${this.l_crowding}${text("mm")}`);
        }
        if (this.l_spacing > 0) {
            computedProblemsArr.push(`${text("Lower arch spacing by")} ${this.l_spacing}${text("mm")}`);
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
            canineRelationship: this.canineRelationship,
            facialProfile: this.facialProfile,
            l_spaceAvailable: this.l_spaceAvailable,
            l_spaceNeeded: this.l_spaceNeeded,
            lips: this.lips,
            molarsRelationship: this.molarsRelationship,
            nasioLabialAngle: this.nasioLabialAngle,
            oralHygiene: this.oralHygiene,
            overBite: this.overBite,
            overJet: this.overJet,
            problemsList: Array.from(this.problemsList),
            skeletalRelationship: this.skeletalRelationship,
            treatmentPlan_appliance: Array.from(this.treatmentPlan_appliance),
            u_spaceAvailable: this.u_spaceAvailable,
            u_spaceNeeded: this.u_spaceNeeded,
            crossScissorBite: Array.from(this.crossScissorBite),
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
        this.canineRelationship = json.canineRelationship;
        this.facialProfile = json.facialProfile;
        this.l_spaceAvailable = json.l_spaceAvailable;
        this.l_spaceNeeded = json.l_spaceNeeded;
        this.lips = json.lips;
        this.molarsRelationship = json.molarsRelationship;
        this.nasioLabialAngle = json.nasioLabialAngle;
        this.oralHygiene = json.oralHygiene;
        this.overBite = json.overBite;
        this.overJet = json.overJet;
        this.problemsList = json.problemsList;
        this.skeletalRelationship = json.skeletalRelationship;
        this.treatmentPlan_appliance = json.treatmentPlan_appliance;
        this.u_spaceAvailable = json.u_spaceAvailable;
        this.u_spaceNeeded = json.u_spaceNeeded;
        this.crossScissorBite = json.crossScissorBite;
        this.orthoGallery = json.orthoGallery || [];
        this.cephalometricHistory = json.cephalometricHistory || [];
        this.isFinished = !!json.isFinished;
        this.finishedDate = json.finishedDate || 0;
        this.nextVisitNotes = json.nextVisitNotes || [];
        this.visits = json.visits ? json.visits.map(x => new Visit(x)) : [];
        this.isFinished = !!json.isFinished;
        this.isStarted = !!json.isStarted;
        observe(this.crossScissorBite, () => this.triggerUpdate++);
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
], OrthoCase.prototype, "triggerUpdate", void 0);
tslib_1.__decorate([
    observable
], OrthoCase.prototype, "startedDate", void 0);
tslib_1.__decorate([
    observable
], OrthoCase.prototype, "patientID", void 0);
tslib_1.__decorate([
    computed
], OrthoCase.prototype, "patient", null);
tslib_1.__decorate([
    observable
], OrthoCase.prototype, "lips", void 0);
tslib_1.__decorate([
    observable
], OrthoCase.prototype, "facialProfile", void 0);
tslib_1.__decorate([
    observable
], OrthoCase.prototype, "nasioLabialAngle", void 0);
tslib_1.__decorate([
    observable
], OrthoCase.prototype, "oralHygiene", void 0);
tslib_1.__decorate([
    observable
], OrthoCase.prototype, "skeletalRelationship", void 0);
tslib_1.__decorate([
    observable
], OrthoCase.prototype, "molarsRelationship", void 0);
tslib_1.__decorate([
    observable
], OrthoCase.prototype, "canineRelationship", void 0);
tslib_1.__decorate([
    observable
], OrthoCase.prototype, "overJet", void 0);
tslib_1.__decorate([
    observable
], OrthoCase.prototype, "overBite", void 0);
tslib_1.__decorate([
    observable
], OrthoCase.prototype, "crossScissorBite", void 0);
tslib_1.__decorate([
    observable
], OrthoCase.prototype, "u_spaceAvailable", void 0);
tslib_1.__decorate([
    observable
], OrthoCase.prototype, "u_spaceNeeded", void 0);
tslib_1.__decorate([
    computed
], OrthoCase.prototype, "u_spacing", null);
tslib_1.__decorate([
    computed
], OrthoCase.prototype, "u_crowding", null);
tslib_1.__decorate([
    observable
], OrthoCase.prototype, "l_spaceAvailable", void 0);
tslib_1.__decorate([
    observable
], OrthoCase.prototype, "l_spaceNeeded", void 0);
tslib_1.__decorate([
    computed
], OrthoCase.prototype, "l_spacing", null);
tslib_1.__decorate([
    computed
], OrthoCase.prototype, "l_crowding", null);
tslib_1.__decorate([
    observable
], OrthoCase.prototype, "problemsList", void 0);
tslib_1.__decorate([
    observable
], OrthoCase.prototype, "treatmentPlan_appliance", void 0);
tslib_1.__decorate([
    observable
], OrthoCase.prototype, "orthoGallery", void 0);
tslib_1.__decorate([
    observable
], OrthoCase.prototype, "cephalometricHistory", void 0);
tslib_1.__decorate([
    observable
], OrthoCase.prototype, "isFinished", void 0);
tslib_1.__decorate([
    observable
], OrthoCase.prototype, "isStarted", void 0);
tslib_1.__decorate([
    observable
], OrthoCase.prototype, "finishedDate", void 0);
tslib_1.__decorate([
    observable
], OrthoCase.prototype, "nextVisitNotes", void 0);
tslib_1.__decorate([
    observable
], OrthoCase.prototype, "visits", void 0);
tslib_1.__decorate([
    computed
], OrthoCase.prototype, "computedProblems", null);
tslib_1.__decorate([
    computed
], OrthoCase.prototype, "searchableString", null);
//# sourceMappingURL=class.ortho.js.map