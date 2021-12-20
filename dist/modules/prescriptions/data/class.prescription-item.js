import * as tslib_1 from "tslib";
import { text } from "@core";
import { itemFormToString, PrescriptionItemForm, stringToItemForm } from "@modules";
import { generateID } from "@utils";
import { computed, observable } from "mobx";
export class PrescriptionItem {
    constructor(json) {
        this._id = generateID();
        this.name = "";
        this.unitsPerTime = 1;
        this.doseInMg = 500;
        this.timesPerDay = 3;
        this.form = PrescriptionItemForm.capsule;
        this.notes = "";
        if (json) {
            this.fromJSON(json);
        }
    }
    get searchableString() {
        return `
			${this.name} ${this.doseInMg}${text("mg")} ${this.doseInMg}
			${this.timesPerDay}X${this.unitsPerTime}
			${itemFormToString(this.form)}
		`.toLowerCase();
    }
    toJSON() {
        return {
            _id: this._id,
            name: this.name,
            doseInMg: this.doseInMg,
            timesPerDay: this.timesPerDay,
            form: itemFormToString(this.form),
            unitsPerTime: this.unitsPerTime,
            notes: this.notes
        };
    }
    fromJSON(json) {
        this.name = json.name;
        this._id = json._id;
        this.doseInMg = json.doseInMg;
        this.timesPerDay = json.timesPerDay;
        this.form = stringToItemForm(json.form);
        this.unitsPerTime = json.unitsPerTime || 1;
        this.notes = json.notes;
    }
}
tslib_1.__decorate([
    observable
], PrescriptionItem.prototype, "name", void 0);
tslib_1.__decorate([
    observable
], PrescriptionItem.prototype, "unitsPerTime", void 0);
tslib_1.__decorate([
    observable
], PrescriptionItem.prototype, "doseInMg", void 0);
tslib_1.__decorate([
    observable
], PrescriptionItem.prototype, "timesPerDay", void 0);
tslib_1.__decorate([
    observable
], PrescriptionItem.prototype, "form", void 0);
tslib_1.__decorate([
    observable
], PrescriptionItem.prototype, "notes", void 0);
tslib_1.__decorate([
    computed
], PrescriptionItem.prototype, "searchableString", null);
//# sourceMappingURL=class.prescription-item.js.map