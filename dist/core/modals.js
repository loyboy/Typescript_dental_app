import * as tslib_1 from "tslib";
import { observable } from "mobx";
class ModalData {
    constructor() {
        this.activeModals = [];
    }
    newModal({ message, onConfirm, input, showCancelButton, showConfirmButton }) {
        this.activeModals.push({
            message,
            onConfirm,
            input,
            id: Math.random(),
            showCancelButton,
            showConfirmButton
        });
    }
}
tslib_1.__decorate([
    observable
], ModalData.prototype, "activeModals", void 0);
export const modals = new ModalData();
//# sourceMappingURL=modals.js.map