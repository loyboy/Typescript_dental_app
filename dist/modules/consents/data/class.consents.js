import * as tslib_1 from "tslib";
import { generateID } from "@utils";
import { observable } from "mobx";
export class Consent {
    constructor(json) {
        this._id = generateID();
        this.title = '';
        this.notes = '';
        if (json) {
            this.fromJSON(json);
        }
    }
    toJSON() {
        return {
            _id: this._id,
            title: this.title,
            notes: this.notes,
        };
    }
    fromJSON(json) {
        this._id = json._id;
        this.title = json.title || '';
        this.notes = json.notes;
    }
}
tslib_1.__decorate([
    observable
], Consent.prototype, "title", void 0);
tslib_1.__decorate([
    observable
], Consent.prototype, "notes", void 0);
//# sourceMappingURL=class.consents.js.map