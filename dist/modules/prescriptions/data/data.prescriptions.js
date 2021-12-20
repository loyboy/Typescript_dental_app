import * as tslib_1 from "tslib";
import { modals, text } from "@core";
import { observable } from "mobx";
class Prescriptions {
    constructor() {
        this.ignoreObserver = false;
        this.list = [];
    }
    findIndexByID(id) {
        return this.list.findIndex(item => item._id === id);
    }
    deleteByID(id) {
        const i = this.findIndexByID(id);
        this.list.splice(i, 1);
    }
    deleteModal(id) {
        const i = this.findIndexByID(id);
        modals.newModal({
            message: text(`Are you sure you want to delete the prescription?`),
            onConfirm: () => this.deleteByID(id),
            showCancelButton: true,
            showConfirmButton: true,
            input: false,
            id: Math.random()
        });
    }
}
tslib_1.__decorate([
    observable
], Prescriptions.prototype, "list", void 0);
export const prescriptions = new Prescriptions();
//# sourceMappingURL=data.prescriptions.js.map