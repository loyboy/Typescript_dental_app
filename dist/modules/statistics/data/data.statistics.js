import * as tslib_1 from "tslib";
import { appointments } from "@modules";
import { day } from "@utils";
import { computed, observable } from "mobx";
class Statistics {
    constructor() {
        this.filterByMember = "";
        this.msInDay = day;
        this.todayDateObject = new Date();
        this.todayStartsWith = this.getDayStartingPoint(this.todayDateObject.getTime());
        this.startingDate = this.todayStartsWith - this.msInDay * 31;
        this.endingDate = this.todayStartsWith;
    }
    get numberOfSelectedDays() {
        return (this.endingDate - this.startingDate) / this.msInDay;
    }
    get selectedDays() {
        const days = [];
        let i = 0;
        while (i <= this.numberOfSelectedDays) {
            days.push(new Date(this.startingDate + this.msInDay * i));
            i++;
        }
        return days;
    }
    get _selectedAppointmentsByDay() {
        return this.selectedDays.map(calDay => appointments
            .appointmentsForDay(calDay.getFullYear(), calDay.getMonth() + 1, calDay.getDate())
            .filter(appointment => !this.filterByMember ||
            appointment.staffID.indexOf(this.filterByMember) > -1)
            .filter(appointment => appointment.treatment));
    }
    get selectedAppointmentsByDay() {
        return this._selectedAppointmentsByDay.map((selected, index) => {
            return {
                appointments: selected.map(appointment => appointment),
                day: this.selectedDays[index]
            };
        });
    }
    get selectedPatientsByDay() {
        return this._selectedAppointmentsByDay.map((selected, index) => {
            return {
                appointments: selected.map(appointment => appointment),
                day: this.selectedDays[index]
            };
        });
    }
    get selectedAppointments() {
        return this._selectedAppointmentsByDay.reduce((total, els) => {
            els.forEach(el => total.push(el));
            return total;
        }, []);
    }
    get selectedPatients() {
        return this.selectedAppointments.map(appointment => appointment.patient);
    }
    get selectedFinances() {
        return this.selectedAppointmentsByDay.map(date => {
            const appointmentsList = date.appointments.map(appointment => {
                const paid = appointment.paidAmount;
                const expenses = appointment.expenses;
                const profit = appointment.profit;
                const profitPercentage = appointment.profitPercentage;
                return {
                    paid,
                    expenses,
                    profit,
                    profitPercentage,
                    isPaid: appointment.isPaid,
                    isDone: appointment.isDone
                };
            });
            return {
                day: date.day,
                appointments: appointmentsList
            };
        });
    }
    get totalProfits() {
        return this.selectedAppointments
            .map(x => x.profit)
            .reduce((total, single) => (total = total + single), 0);
    }
    get totalExpenses() {
        return this.selectedAppointments
            .map(x => x.expenses)
            .reduce((total, single) => (total = total + single), 0);
    }
    get totalPayments() {
        return this.selectedAppointments
            .map(x => x.paidAmount)
            .reduce((total, single) => (total = total + single), 0);
    }
    getDayStartingPoint(t) {
        const d = new Date(t);
        return new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
    }
}
tslib_1.__decorate([
    observable
], Statistics.prototype, "filterByMember", void 0);
tslib_1.__decorate([
    observable
], Statistics.prototype, "startingDate", void 0);
tslib_1.__decorate([
    observable
], Statistics.prototype, "endingDate", void 0);
tslib_1.__decorate([
    computed
], Statistics.prototype, "numberOfSelectedDays", null);
tslib_1.__decorate([
    computed
], Statistics.prototype, "selectedDays", null);
tslib_1.__decorate([
    computed
], Statistics.prototype, "_selectedAppointmentsByDay", null);
tslib_1.__decorate([
    computed
], Statistics.prototype, "selectedAppointmentsByDay", null);
tslib_1.__decorate([
    computed
], Statistics.prototype, "selectedPatientsByDay", null);
tslib_1.__decorate([
    computed
], Statistics.prototype, "selectedAppointments", null);
tslib_1.__decorate([
    computed
], Statistics.prototype, "selectedPatients", null);
tslib_1.__decorate([
    computed
], Statistics.prototype, "selectedFinances", null);
tslib_1.__decorate([
    computed
], Statistics.prototype, "totalProfits", null);
tslib_1.__decorate([
    computed
], Statistics.prototype, "totalExpenses", null);
tslib_1.__decorate([
    computed
], Statistics.prototype, "totalPayments", null);
export const statistics = new Statistics();
//# sourceMappingURL=data.statistics.js.map