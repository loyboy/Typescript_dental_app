import { modals, text } from "@core";
import { Expense, statistics } from "@modules"
import { computed, observable } from "mobx";

class ExpenseData {
	ignoreObserver: boolean = false;
	@observable filterByMember: string = "";
	@observable startingDate: number = new Date().getTime();
	@observable list: Expense[] = [];

	@computed
	get selectedDays() {
		return new Date(this.startingDate);
	}

	getIndexByID(id: string) {
		return this.list.findIndex(x => x._id === id);
	}

	//not used
	expensesForDay(
		year: number,
		month: number,
		day: number
	) {
		if (year > 3000) {
			// it's a timestamp
			const date = new Date(year);
			year = date.getFullYear();
			month = date.getMonth() + 1;
			day = date.getDate();
		}   

		let list = this.list.filter(expense => {
			
			const date = new Date(expense.date); 
			
			console.log("Expenses date " +  (date.getFullYear() === year) + " / " + (date.getMonth() + 1 === month) + " / " + (date.getDate() === day) );
		
			return (
				date.getFullYear() === year &&
				date.getMonth() + 1 === month &&
				date.getDate() === day
			);
		});

		console.log("Expenses list " + list.length );

		return list;
	}

	setAutoRepeatDetails() {
		// console.log("Called");
		let tempList: Expense[] = [];
		// console.log("Called 1");
		this.list.forEach(expense => {
			// Checks if want to repeat or not!
			// console.log("Called 2");
			if (expense.repeat && expense.days > 0) {
				// console.log("Called 3");
				// ! Checks if already present today or not
				if (
					this.selectedDays.getFullYear() === new Date(expense.date).getFullYear() &&
					this.selectedDays.getMonth() + 1 === new Date(expense.date).getMonth() + 1 &&
					this.selectedDays.getDate() === new Date(expense.date).getDate()
				) {
					// console.log("Called ");
					return
				} 
				else {
					// console.log("entered");
					//Expense days 
					const differenceInTime = new Date().getTime() - new Date(expense.date).getTime();
					var differenceInDays = differenceInTime / (1000 * 3600 * 24); 
					// console.log("time", tempList, Math.floor(differenceInDays));
					if (expense.days === Math.floor(differenceInDays)) {
						const newExpense = new Expense();
						newExpense.name = expense.name;
						newExpense.description = expense.description;
						newExpense.price = expense.price;
						newExpense.repeat = expense.repeat;
						newExpense.type = expense.type;
						newExpense.days = expense.days;
						newExpense.count = 0;
						tempList.push(newExpense);
						// console.log("time", tempList, differenceInDays);
					}

				} 
			}
		})

		console.log("tempList", tempList);
		const temp: Expense[] = [];
		this.list.forEach(el => {
			if (
				new Date().getFullYear() === new Date(el.date).getFullYear() &&
				new Date().getMonth() + 1 === new Date(el.date).getMonth() + 1 &&
				new Date().getDate() === new Date(el.date).getDate() 
			) {
				tempList.forEach(tempEl => {
					console.log("called inside", tempEl.count , 0, tempEl.name ,el.name );
					if (tempEl.count == 1 && tempEl.name === el.name ) {
					} else {
						tempEl.count = 1;
						temp.push(tempEl);
					}
				})	
			}
		})
		console.log("temp", temp);
		temp.forEach(el => {
			this.list.push(el)
		})
	}

	getExpenseList(type: string) {

		return this.list.filter(expense => {
			if (type === "expense" || type === "payment") {
				return expense.type === type;
			}
			else {
				return true;
			}
		}).filter(expense => {
						
			return statistics.selectedDays.find((days) => { return  days.getFullYear() === new Date(expense.date).getFullYear() && days.getMonth() + 1 === new Date(expense.date).getMonth() + 1 && days.getDate() === new Date(expense.date).getDate() }) !== undefined
			
		}).filter(expense =>  !this.filterByMember || expense.doctor === this.filterByMember )		
	
	}

	deleteModal(id: string) {
		const i = this.getIndexByID(id);
		const expense = this.list[i];
		modals.newModal({
			message: `${text("Expense")} "${expense.name}" ${text(
				"will be deleted"
			)}`,
			onConfirm: () => {
				this.deleteByID(id);
			},
			showCancelButton: true,
			showConfirmButton: true,
			input: false,
			id: Math.random()
		});
	}

	deleteByID(id: string) {
		const i = this.getIndexByID(id);
		this.list.splice(i, 1);
	}

	getDayStartingPoint(t: number) {
		const d = new Date(t);
		return new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
	}

	@computed
	get totalExpenses() {
		return this.getExpenseList("expense")
			.map(x => x.price)
			.reduce((total, single) => (total = total + single), 0);
	}

	@computed
	get totalPayments() {
		return this.getExpenseList("payment")
		.map(x => x.price)
		.reduce((total, single) => (total = total + single), 0);
	}

	@computed
	private get _selectedExpensesyDay() {
		return statistics.selectedDays.map(calDay =>
			this
				.expensesForDay(
					calDay.getFullYear(),
					calDay.getMonth() + 1,
					calDay.getDate()
				)				
				
		);
	}

    /*	@computed
	get selectedExpenses() {
		return this._selectedExpensesyDay.reduce((total, els) => {
			els.forEach(el => total.push(el));
			return total;
		}, []);
	}*/
	/* return this._selectedExpensesyDay.reduce((total, els) => {
			console.log("Expense total: " +  els.filter((expense) => expense.type === type).length );
			els.filter((expense) => expense.type === type).forEach(el => { total.push(el);  });
			console.log("Expense object: " + JSON.stringify(total) )
			return total;
		}, []);*/

				
	/*	this.selectedDays.getFullYear() === new Date(expense.date).getFullYear() &&
				this.selectedDays.getMonth() + 1 === new Date(expense.date).getMonth() + 1 &&
				this.selectedDays.getDate() === new Date(expense.date).getDate() */

}

export const expenses = new ExpenseData();
