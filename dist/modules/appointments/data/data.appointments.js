import * as tslib_1 from "tslib";
import { modals, text } from "@core";
import { textualFilter } from "@utils";
import { observable } from "mobx";
class AppointmentsData {
    constructor() {
        this.ignoreObserver = false;
        this.list = [];
    }
    appointmentsForDay(year, month, day, filter, operatorID) {
        if (year > 3000) {
            // it's a timestamp
            const date = new Date(year);
            year = date.getFullYear();
            month = date.getMonth() + 1;
            day = date.getDate();
        }
        let list = this.list.filter(appointment => {
            const date = new Date(appointment.date);
            return (date.getFullYear() === year &&
                date.getMonth() + 1 === month &&
                date.getDate() === day);
        });
        if (filter) {
            list = textualFilter(list, filter);
        }
        if (operatorID) {
            list = list.filter(appointment => appointment.staffID.indexOf(operatorID) !== -1);
        }
        return list;
    }
    getIndexByID(id) {
        return this.list.findIndex(x => x._id === id);
    }
    deleteModal(id) {
        modals.newModal({
            message: text("Are you sure you want to delete this appointment?"),
            onConfirm: () => this.deleteByID(id),
            showCancelButton: true,
            showConfirmButton: true,
            input: false,
            id: Math.random()
        });
    }
    deleteByID(id) {
        const i = this.getIndexByID(id);
        this.list.splice(i, 1);
    }
}
tslib_1.__decorate([
    observable
], AppointmentsData.prototype, "list", void 0);
export const appointments = new AppointmentsData();
//# sourceMappingURL=data.appointments.js.map