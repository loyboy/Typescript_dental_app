import * as tslib_1 from "tslib";
import { generateID } from "@utils";
import { observable } from "mobx";
export class Payment {
    constructor(json) {
        this._id = generateID();
        this.status = "";
        this.discount = 0;
        this.description = "";
        this.insurance = 0;
        this.paidFees = 0;
        this.patientSignature = "";
        if (json) {
            this.fromJSON(json);
        }
    }
    fromJSON(json) {
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
    toJSON() {
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
Payment.triggerUpdate = 0;
tslib_1.__decorate([
    observable
], Payment.prototype, "date", void 0);
tslib_1.__decorate([
    observable
], Payment.prototype, "status", void 0);
tslib_1.__decorate([
    observable
], Payment.prototype, "discount", void 0);
tslib_1.__decorate([
    observable
], Payment.prototype, "description", void 0);
tslib_1.__decorate([
    observable
], Payment.prototype, "insurance", void 0);
tslib_1.__decorate([
    observable
], Payment.prototype, "paidFees", void 0);
tslib_1.__decorate([
    observable
], Payment.prototype, "receipt", void 0);
tslib_1.__decorate([
    observable
], Payment.prototype, "patientSignature", void 0);
//# sourceMappingURL=class.payment.js.map