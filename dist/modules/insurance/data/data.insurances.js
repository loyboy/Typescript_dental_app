import * as tslib_1 from "tslib";
import { modals, text } from "@core";
import { patients } from "@modules";
import { observable } from "mobx";
class InsuranceData {
    constructor() {
        this.ignoreObserver = false;
        this.list = [];
    }
    getIndexByID(id) {
        return this.list.findIndex(x => x._id === id);
    }
    deleteModal(id) {
        const i = this.getIndexByID(id);
        const insurance = this.list[i];
        modals.newModal({
            message: `${text("Insurance")} "${insurance.name}" ${text("will be deleted")}`,
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
        this.list.splice(i, 1);
        patients.list.forEach(((patient, index) => {
            if (patient.insurance && patient.insurance._id === id) {
                patients.list[index].insurance = undefined;
            }
        }));
    }
}
tslib_1.__decorate([
    observable
], InsuranceData.prototype, "list", void 0);
export const insurances = new InsuranceData();
//# sourceMappingURL=data.insurances.js.map