import * as tslib_1 from "tslib";
import { convert } from "@utils";
import { computed, observable } from "mobx";
export class Tooth {
    constructor(input) {
        this.ISO = 11;
        this.condition = "sound";
        this.notes = [];
        this.diagnosis = { id: "", value: "", date: new Date() };
        if (typeof input === "number") {
            this.ISO = input;
        }
        else if (!!input) {
            this.fromJSON(input);
        }
    }
    get Universal() {
        return convert(this.ISO).Universal;
    }
    get Palmer() {
        return convert(this.ISO).Palmer;
    }
    get Name() {
        return convert(this.ISO).Name;
    }
    fromJSON(input) {
        this.ISO = input.ISO;
        this.condition = input.condition;
        this.notes = input.notes;
        this.diagnosis = input.diagnosis;
    }
    toJSON() {
        return {
            ISO: this.ISO,
            condition: this.condition,
            notes: Array.from(this.notes),
            diagnosis: this.diagnosis
        };
    }
}
tslib_1.__decorate([
    computed
], Tooth.prototype, "Universal", null);
tslib_1.__decorate([
    computed
], Tooth.prototype, "Palmer", null);
tslib_1.__decorate([
    computed
], Tooth.prototype, "Name", null);
tslib_1.__decorate([
    observable
], Tooth.prototype, "condition", void 0);
tslib_1.__decorate([
    observable
], Tooth.prototype, "notes", void 0);
tslib_1.__decorate([
    observable
], Tooth.prototype, "diagnosis", void 0);
//# sourceMappingURL=class.tooth.js.map