import { PaymentJSON } from "@modules";
import { generateID } from "@utils";
import { observable } from "mobx";

export class Payment {

  static triggerUpdate = 0;

  _id: string = generateID();

  @observable date: Date;

  @observable status: string = "";

  @observable discount: number = 0;

  @observable description: string = "";

  @observable insurance: number = 0;

  @observable paidFees: number = 0;

  @observable receipt: number;

  @observable patientSignature: string = "";

  constructor(json?: PaymentJSON) {
    if (json) {
      this.fromJSON(json)
    }
  }

  fromJSON(json: PaymentJSON) {
    this._id = json._id;
    this.date = json.date;
    this.description = json.description;
    this.status = json.status;
    this.discount = json.discount;
    this.insurance = json.insurance;
    this.paidFees = json.paidFees;
    this.receipt = json.receipt;
    this.patientSignature = json.patientSignature;
  }

  toJSON(): PaymentJSON {
    return {
      _id: this._id,
      date: this.date,
      description: this.description,
      status: this.status,
      discount: this.discount,
      insurance: this.insurance,
      paidFees: this.paidFees,
      receipt: this.receipt,
      patientSignature: this.patientSignature
    };
  }
}
