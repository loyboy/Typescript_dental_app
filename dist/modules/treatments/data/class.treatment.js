import * as tslib_1 from "tslib";
import { generateID, formatDateInternal } from "@utils";
import { computed, observable } from "mobx";
export class Treatment {
    constructor(json) {
        // Observables
        this._id = generateID();
        this.c_date = formatDateInternal(new Date());
        this.item = "";
        this.desc = "";
        this.lab_name = "";
        this.patient_name = "";
        this.fees = "";
        this.status = "";
        if (json) {
            this.fromJSON(json);
        }
    }
    //	@observable type: string = "";
    //	@observable expenses: number = 0;
    get searchableString() {
        return `
			${this.item} expenses ${this.desc}
		`.toLowerCase();
    }
    toJSON() {
        return {
            _id: this._id,
            c_date: this.c_date,
            item: this.item,
            desc: this.desc,
            lab_name: this.lab_name,
            patient_name: this.patient_name,
            fees: this.fees,
            status: this.status
        };
    }
    fromJSON(json) {
        this._id = json._id;
        this.c_date = json.c_date;
        this.item = json.item;
        this.desc = json.desc;
        this.lab_name = json.lab_name;
        this.patient_name = json.patient_name;
        this.fees = json.fees;
        this.status = json.status;
    }
}
tslib_1.__decorate([
    observable
], Treatment.prototype, "c_date", void 0);
tslib_1.__decorate([
    observable
], Treatment.prototype, "item", void 0);
tslib_1.__decorate([
    observable
], Treatment.prototype, "desc", void 0);
tslib_1.__decorate([
    observable
], Treatment.prototype, "lab_name", void 0);
tslib_1.__decorate([
    observable
], Treatment.prototype, "patient_name", void 0);
tslib_1.__decorate([
    observable
], Treatment.prototype, "fees", void 0);
tslib_1.__decorate([
    observable
], Treatment.prototype, "status", void 0);
tslib_1.__decorate([
    computed
], Treatment.prototype, "searchableString", null);
//# sourceMappingURL=class.treatment.js.map