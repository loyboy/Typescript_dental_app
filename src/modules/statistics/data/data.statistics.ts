import { appointments } from "@modules";
import { day } from "@utils";
import { computed, observable } from "mobx";
import { patients, Patient } from 'modules/patients';
import { Appointment } from 'modules/appointments';
import { expenses } from 'modules/expenses';

class Statistics {
	@observable filterByMember: string = "";

	readonly msInDay = day;

	readonly todayDateObject: Date = new Date();

	readonly todayStartsWith: number = this.getDayStartingPoint(
		this.todayDateObject.getTime()
	);

	@observable startingDate: number = this.todayStartsWith - this.msInDay * 31;

	@observable endingDate: number = this.todayStartsWith;

	numberOfDays = (year: number, month: number) => {
		var d = new Date(year, month, 0);
		return d.getDate();
	}

	@computed
	private get numberOfSelectedDays() {
		return (this.endingDate - this.startingDate) / this.msInDay;
	}

	@computed
	get selectedDays() {
		const days: Date[] = [];
		let i = 0;
		while (i <= this.numberOfSelectedDays) {
			days.push(new Date(this.startingDate + this.msInDay * i));
			i++;
		}
		return days;
	}

	@computed
	get selectedMonths() {
		const months: number[] = [];
		let i = 0;
		while (i <= 11) {
			months.push( i );
			i++;
		}
		return months;
	}

	@computed
	get selectedMonthSelected() {
		const days: Date[] = [];
		var td = new Date();
		var nd = this.numberOfDays(td.getFullYear(), td.getMonth());
		let i = 0;
		var stdate = new Date(td.getFullYear(), td.getMonth(), 1).getTime() ;
		while (i <= nd) {
			days.push(new Date(stdate + this.msInDay * i));
			i++;
		}
		return days;
	}

	@computed
	get todayDays() {
		const days: Date[] = [];
		days.push(new Date());
		return days;
	}

	@computed
	private get _selectedAppointmentsByDay() {
		return this.selectedDays.map(calDay =>
			appointments
				.appointmentsForDay(
					calDay.getFullYear(),
					calDay.getMonth() + 1,
					calDay.getDate()
				).filter(
					appointment =>
						!this.filterByMember ||
						appointment.staffID.indexOf(this.filterByMember) > -1
				)				
				
		);
	}

	//.filter(appointment => appointment.treatment)
	/**.filter(
					appointment =>
						!this.filterByMember ||
						appointment.staffID.indexOf(this.filterByMember) > -1
				) */
	@computed
	private get _selectedAppointmentsByToday() {
		return [appointments
				.appointmentsForDay(
					new Date().getFullYear(),
					new Date().getMonth() + 1,
					new Date().getDate()
				)]
	}

	

	@computed
	private get _selectedAppointmentsByDayNew() {
		return this.selectedDays.map(calDay =>
			appointments
				.appointmentsForDay(
					calDay.getFullYear(),
					calDay.getMonth() + 1,
					calDay.getDate()
				)
		);
	}

	@computed
	private get _selectedAppointmentsByMonthSelected() {
		return this.selectedMonthSelected.map(calDay =>
			appointments
				.appointmentsForDay(
					calDay.getFullYear(),
					calDay.getMonth() + 1,
					calDay.getDate()
				)
		);
	}

	@computed
	private get _selectedAppointmentsByMonthNew() {
		return this.selectedMonths.map(calDay =>
			appointments
				.appointmentsForMonth(					
					calDay				
				)
		);
	}

	@computed
	private get _selectedPatientsByDay() {
		return this.selectedDays.map(calDay =>
			patients
				.patientsForDay(
					calDay.getFullYear(),
					calDay.getMonth() + 1,
					calDay.getDate()
				)
		);
	}

	@computed
	get selectedAppointmentsByDay() {
		return this._selectedAppointmentsByDay.map((selected, index) => {
			return {
				appointments: selected.map(appointment => appointment),
				day: this.selectedDays[index]
			};
		});
	}
//

	@computed
	get selectedAppointmentsByMonthSelected() {
		return this._selectedAppointmentsByMonthSelected.map((selected, index) => {
			return {
				appointments: selected.map(appointment => appointment),
				day: this.selectedMonthSelected[index]
			};
		});
	}

	@computed
	get selectedAppointmentsByMonth() {
		return this._selectedAppointmentsByMonthNew.map((selected, index) => {
			return {
				appointments: selected.map(appointment => appointment),
				month: this.selectedMonths[index]
			};
		});
	}

	@computed
	get selectedAppointmentsByToday() {
		return this._selectedAppointmentsByToday.map((selected, index) => {
			return {
				appointments: selected.map(appointment => appointment),
				day: this.selectedDays[index]
			};
		});
	}

	@computed
	get selectedPatientsByDay() {
		return this._selectedAppointmentsByDay.map((selected, index) => {
			return {
				appointments: selected.map(appointment => appointment),
				day: this.selectedDays[index]
			};
		});
	}

	@computed
	get selectedAppointments() {
		return this._selectedAppointmentsByDay.reduce((total, els) => {
			els.forEach(el => total.push(el));
			return total;
		}, []);
	}

	@computed
	get selectedPatients() {
		return this.selectedAppointments.map(
			appointment => appointment.patient
		);
	}

	@computed
	get selectedPatientsByDayInsurance() {
		return this._selectedPatientsByDay.filter(patients => patients.length !== 0).flat() as Patient[];
	}

	@computed
	get selectedPatientsByDayNew () {
		// console.log("new patients", this._selectedPatiensByDay.filter(patients => patients.length !== 0).flat());
		return this._selectedAppointmentsByDayNew.filter(patients => patients.length !== 0).flat() as Patient[];
	}

	@computed
	get selectedAppointmentsByDayNew () {
		return this._selectedAppointmentsByDayNew.filter(appointment => appointment.length !== 0).flat() as Appointment[];
	}

	@computed
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

	@computed
	get totalProfits() {
		return this.selectedAppointments.map(x => x.profit).reduce((total, single) => (total = total + single), 0) + expenses.totalPayments - expenses.totalExpenses;
	}

	@computed
	get totalExpenses() {
		return this.selectedAppointments.map(x => x.expenses).reduce((total, single) => (total = total + single), 0) + expenses.totalExpenses;
	}

	@computed
	get totalPayments() {
		return this.selectedAppointments
			.map(x => x.paidAmount)
			.reduce((total, single) => (total = total + single), 0) + expenses.totalPayments;
	}

	getDayStartingPoint(t: number) {
		const d = new Date(t);
		return new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
	}
}

export const statistics = new Statistics();
