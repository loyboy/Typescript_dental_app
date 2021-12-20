import {
    AppointmentJSON,
    patients,
    setting,
    staff,
    Treatment,
    treatments,
} from "@modules";
import {
    comparableTime,
    generateID,
    hour,
    isToday,
    isTomorrow,
    isYesterday,
    num,
    roundval
} from "@utils";
import {computed, observable, action} from "mobx";

export class Appointment {
    _id : string = generateID();

    @observable triggerUpdate : number = 0;

    @observable timer : number | null = null;

    @observable complaint : string = "";

    @observable diagnosis : string = "";

    @observable treatmentID : string = (treatments.list[0] || {
        _id: ""
    })._id;

    @observable units : number = 1;

    @observable treatUnitGroup : {
        treatment: string;
        unit: number;
        fees: number;
    }[] = [];

    @observable patientID : string = "";

    @observable staffID : string[] = [];

    @observable date : number = new Date().getTime();

    @observable involvedTeeth : number[] = [];

    @observable time : number = 0;

    @observable finalPrice : number = 0;

    @observable paidAmount : number = 0;

    @observable isDone : boolean = false;

    @observable notes : string = "";

    @observable roomNumber : number = 0;

    @observable status : string = "";

    @observable discount : number = 0;

    @observable procedureId : string = "";

    @observable dentist : string = "";

    @observable previousId : string = ""; //Use this for parent aand child relationship in Appointment

    @observable cinsurance : boolean = true;

    @observable prescriptions : {
        prescription: string;
        id: string
    }[] = [];

    @observable instructions : {
        instruction: string;
        id: string
    }[] = [];

    @computed get isPaid() {
        return this.paidAmount >= this.finalPrice;
    }

    @computed get outstandingAmount() {
        let totalDiscount = this.discount;
        if (this.insuranceDetails) {
            if(this.cinsurance){
                totalDiscount = totalDiscount + this.insuranceDetails.discount;
            }           
        }
        return Math.max(this.finalPrice - this.paidAmount - Math.max(this.finalPrice * totalDiscount / 100), 0);
    }

    @computed get overpaidAmount() {
        return Math.max(this.paidAmount - this.finalPrice, 0);
    }

    @computed get operatingStaff() {
        return staff.list.filter((member) => this.staffID.indexOf(member._id) !== -1);
    }

    @computed get patient() {
        return patients.list.find((x) => x._id === this.patientID);
    }

    @computed get treatment(): undefined | Treatment {
        return treatments.list[treatments.getIndexByID(this.treatmentID)];
    }

    @computed get expenses() {
        return this.myprice;
    }

    @computed get totalExpenses() {
        return this.myprice + this.spentTimeValue;
    }

    @computed get profit() {
        if (this.previousId === ""){
            let totalDiscount = this.discount;

            return roundval(this.finalPrice - this.totalExpenses - Math.max(this.finalPrice * totalDiscount / 100), 2)
        }
        else { return 0; }    

        // return this.finalPrice - (this.finalPrice * totalDiscount) / 100;
        // return this.finalPrice - this.totalExpenses;
    }

    @computed get myprice() {
        let countfees = 0;
        if (this.treatUnitGroup.length > 0) {
            for (let i = 0; i < this.treatUnitGroup.length; i++) {
                countfees += this.treatUnitGroup[i].fees * this.treatUnitGroup[i].unit;
            }
            return countfees;
        }
        return countfees;
    }

    @computed get profitPercentage() {
        return isNaN(this.profit / this.finalPrice) ? 0 : this.profit / this.finalPrice;
    }

    @computed get isOutstanding() {
        return  this.outstandingAmount !== 0;
    }

    @computed get isOverpaid() {
        return this.overpaidAmount !== 0;
    }

    @computed get dueToday() {
        return isToday(this.date) && !this.isDone;
    }

    @computed get dueTomorrow() {
        return isTomorrow(this.date);
    }

    @computed get dueYesterday() {
        return isYesterday(this.date);
    }

    @computed get missed() {
        return(new Date().getTime() - new Date(this.date).getTime() > 0 && !this.isDone && !this.dueToday);
    }

    @computed get future() {
        return(!this.dueToday && !this.dueTomorrow && !this.isDone && this.date > new Date().getTime());
    }

    @action setIsDone = (condition : boolean) => {
        this.isDone = condition
    };

    @action setStatus = (mystatus : string) => {
        this.status = mystatus
    };

    @computed get dateFloor() {
        const d = comparableTime(new Date(this.date));
        return new Date(`${
            d.y
        }/${
            d.m + 1
        }/${
            d.d
        }`);
    }

    @computed get formattedTime() {
        return new Date(this.date).toLocaleTimeString().replace(/:[0-9]{2} /, " ");
    }

    @computed get spentTimeValue() {
        return num(setting.getSetting("hourlyRate")) * (this.time / hour);
    }

    @computed get insuranceDetails() {
        const {insurance} = this.patient;
        if (insurance) {
            return insurance;
        }
        return {name: "", discount: 0};
    }

    @computed get searchableString() {
        return `
        ${
            this.dentist
        }
				${
            this.complaint
        }
                ${
            this.diagnosis
        }
                ${
            new Date(this.date).toDateString()
        }
                ${
            this.treatment ? this.treatment.item : ""
        }
                ${
            this.isPaid ? "paid" : ""
        }
				${
            this.isOutstanding ? "outstanding" : ""
        }
				${
            this.isOverpaid ? "overpaid" : ""
        }
                ${
            this.missed ? "missed" : ""
        }
                ${
            this.dueToday ? "today" : ""
        }
				${
            this.dueTomorrow ? "tomorrow" : ""
        }
				${
            this.future ? "future" : ""
        }
				${
            (this.patient || {
                name: ""
            }).name
        }
				${
            this.operatingStaff.map((x) => x.name).join(" ")
        }
        ${
            this.notes
        }
        ${
            this.roomNumber
        }

        ${
            this._id
        }
        ${
            this.finalPrice
        }
        ${
            this.profit
        }
        ${
            this.paidAmount
        }
        ${
            this.outstandingAmount
        }
        ${
            this.discount
        }
        ${
            this.procedureId
        }
        ${
            this.involvedTeeth
        }

      
		`.toLowerCase();
    }

    constructor(json? : AppointmentJSON) {
        if (json) {
            this.fromJSON(json);
        }
    }

    fromJSON(json : AppointmentJSON) {
        this._id = json._id;
        this.dentist = json.dentist;
        this.cinsurance = json.cinsurance;
        this.treatmentID = json.treatmentID;
        this.patientID = json.patientID;
        this.previousId = json.previousId;
        this.date = json.date;
        this.involvedTeeth = json.involvedTeeth;
        this.paidAmount = json.paidAmount;
        this.discount = json.discount;
        this.finalPrice = json.finalPrice || 0;
        this.isDone = typeof json.isDone === "undefined" ? (json as any).done : json.isDone;
        this.prescriptions = json.prescriptions;
        this.instructions = json.instructions;
        this.treatUnitGroup = json.treatUnitGroup;
        this.time = json.time;
        this.procedureId = json.procedureId;
        this.diagnosis = json.diagnosis;
        this.complaint = json.complaint;
        this.staffID = json.staffID || json.doctorsID || [];
        this.units = json.units || 1;
        this.status = json.status || "Unconfirmed";
        this.roomNumber = json.roomNumber || 0;
        this.notes = json.notes ? json.notes : json.complaint && json.diagnosis ? `Complaint: ${
            json.complaint
        }.
Diagnosis: ${
            json.diagnosis
        }` : "";
    }

    toJSON(): AppointmentJSON {
        return {
            _id: this._id,
            treatmentID: this.treatmentID,
            patientID: this.patientID,
            previousId : this.previousId,
            date: this.date,
            dentist: this.dentist,
            cinsurance: this.cinsurance,
            status: this.status,
            involvedTeeth: Array.from(this.involvedTeeth),
            paidAmount: this.paidAmount,
            finalPrice: this.finalPrice || 0,
            isDone: this.isDone,
            prescriptions: Array.from(this.prescriptions),
            instructions: Array.from(this.instructions),
            treatUnitGroup: Array.from(this.treatUnitGroup),
            time: this.time,
            procedureId: this.procedureId,
            diagnosis: this.diagnosis,
            complaint: this.complaint,
            staffID: Array.from(this.staffID),
            units: this.units,
            notes: this.notes,
            discount: this.discount,
            roomNumber: this.roomNumber
        };
    }

    setDate(value : number) {
        this.date = value;
        this.staffID = [];
    }
}

/**  ${
            this._id
        }
        ${
            this.finalPrice
        }
        ${
            this.profit
        }
        ${
            this.paidAmount
        }
        ${
            this.outstandingAmount
        }
        ${
            this.discount
        }
        ${
            this.procedureId
        }
        ${
            this.involvedTeeth
        }
        */
