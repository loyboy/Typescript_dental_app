import * as tslib_1 from "tslib";
import { modals, text } from "@core";
import { appointments } from "@modules";
import { observable } from "mobx";
class TreatmentData {
    constructor() {
        this.ignoreObserver = false;
        this.list = [];
    }
    getIndexByID(id) {
        return this.list.findIndex(x => x._id === id);
    }
    deleteModal(id) {
        const i = this.getIndexByID(id);
        const treatment = this.list[i];
        modals.newModal({
            message: `${text("Lab order ")} "${treatment.item}" ${text("will be deleted")}`,
            onConfirm: () => {
                this.deleteByID(id);
            },
            showCancelButton: true,
            showConfirmButton: true,
            input: false,
            id: Math.random()
        });
    }
    deleteByID(id) {
        const i = this.getIndexByID(id);
        const treatment = this.list.splice(i, 1)[0];
        appointments.list.forEach((appointment, index) => {
            if (appointment.treatmentID === treatment._id) {
                appointments.list[index].treatmentID = `${treatment.item}|${treatment.fees}`;
            }
        });
    }
}
tslib_1.__decorate([
    observable
], TreatmentData.prototype, "list", void 0);
export const treatments = new TreatmentData();
//# sourceMappingURL=data.treatments.js.map