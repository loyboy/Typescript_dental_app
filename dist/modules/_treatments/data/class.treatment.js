import * as tslib_1 from "tslib";
import { generateID } from "@utils";
import { computed, observable } from "mobx";
export class Treatment {
    constructor(json) {
        // Observables
        this._id = generateID();
        this.type = "";
        this.expenses = 0;
        if (json) {
            this.fromJSON(json);
        }
    }
    get searchableString() {
        return `
			${this.type} expenses ${this.expenses}
		`.toLowerCase();
    }
    toJSON() {
        return {
            _id: this._id,
            type: this.type,
            expenses: this.expenses
        };
    }
    fromJSON(json) {
        this._id = json._id;
        this.type = json.type;
        this.expenses = json.expenses || 0;
    }
}
tslib_1.__decorate([
    observable
], Treatment.prototype, "type", void 0);
tslib_1.__decorate([
    observable
], Treatment.prototype, "expenses", void 0);
tslib_1.__decorate([
    computed
], Treatment.prototype, "searchableString", null);
//# sourceMappingURL=class.treatment.js.map