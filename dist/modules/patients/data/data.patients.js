import * as tslib_1 from "tslib";
import { files, modals, text } from "@core";
import { appointments, orthoCases } from "@modules";
import { observable } from "mobx";
class PatientsData {
    constructor() {
        this.ignoreObserver = false;
        this.list = [];
    }
    findIndexByID(id) {
        return this.list.findIndex(x => x._id === id);
    }
    deleteByID(id) {
        const i = this.findIndexByID(id);
        // delete from list
        const patient = this.list.splice(i, 1)[0];
        // delete appointments
        patient.appointments.forEach(appointment => {
            appointments.deleteByID(appointment._id);
        });
        // delete photos
        patient.gallery.forEach((fileID) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            yield files.remove(fileID);
        }));
        // delete orthodontic case
        orthoCases.deleteByPatientID(patient._id);
    }
    deleteModal(id) {
        const i = this.findIndexByID(id);
        modals.newModal({
            message: `${text("All of the patient")} ${this.list[i].name}${text("'s data will be deleted along with")} ${this.list[i].appointments.length} ${text("of appointments")}.`,
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
], PatientsData.prototype, "list", void 0);
export const patients = new PatientsData();
//# sourceMappingURL=data.patients.js.map