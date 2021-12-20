import * as tslib_1 from "tslib";
import { modals, status, text, user } from "@core";
import { appointments } from "@modules";
import { observable } from "mobx";
class StaffData {
    constructor() {
        this.ignoreObserver = false;
        this.list = [];
    }
    getIndexByID(id) {
        return this.list.findIndex(x => x._id === id);
    }
    deleteModal(id) {
        const i = this.getIndexByID(id);
        modals.newModal({
            message: `${text("Are you sure you want to delete")} ${this.list[i].name}`,
            onConfirm: () => this.deleteByID(id),
            showCancelButton: true,
            showConfirmButton: true,
            input: false,
            id: Math.random()
        });
    }
    deleteByID(id) {
        const currentID = user.currentUser._id;
        const i = this.getIndexByID(id);
        const member = this.list.splice(i, 1)[0];
        // remove member from appointments
        appointments.list.forEach((appointment, index) => {
            const doc_id_i = appointment.staffID.indexOf(member._id);
            if (doc_id_i > -1) {
                appointments.list[index].staffID.splice(doc_id_i, 1);
            }
        });
        // logout if it's the same user
        if (currentID === id) {
            status.resetUser();
        }
    }
}
tslib_1.__decorate([
    observable
], StaffData.prototype, "list", void 0);
export const staff = new StaffData();
//# sourceMappingURL=data.staff.js.map