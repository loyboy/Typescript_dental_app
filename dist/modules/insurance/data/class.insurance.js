import * as tslib_1 from "tslib";
import { generateID } from "@utils";
import { computed, observable } from "mobx";
export class Insurance {
    constructor(json) {
        // Observables
        this._id = generateID();
        this.name = "";
        this.discount = 0;
        this.information = "";
        if (json) {
            this.fromJSON(json);
        }
    }
    get searchableString() {
        return `
			${this.name} discount ${this.discount}
		`.toLowerCase();
    }
    toJSON() {
        return {
            _id: this._id,
            name: this.name,
            discount: this.discount,
            information: this.information
        };
    }
    fromJSON(json) {
        this._id = json._id;
        this.name = json.name;
        this.discount = json.discount || 0;
        this.information = json.information;
    }
}
tslib_1.__decorate([
    observable
], Insurance.prototype, "name", void 0);
tslib_1.__decorate([
    observable
], Insurance.prototype, "discount", void 0);
tslib_1.__decorate([
    observable
], Insurance.prototype, "information", void 0);
tslib_1.__decorate([
    computed
], Insurance.prototype, "searchableString", null);
//# sourceMappingURL=class.insurance.js.map