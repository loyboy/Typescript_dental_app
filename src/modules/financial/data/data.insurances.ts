import { modals, text } from "@core";
import { patients, Insurance } from "@modules";
import { computed, observable } from "mobx";

class InsuranceData {
	ignoreObserver: boolean = false;

	@observable list: Insurance[] = [];

	getIndexByID(id: string) {
		return this.list.findIndex(x => x._id === id);
	}

	deleteModal(id: string) {
		const i = this.getIndexByID(id);
		const insurance = this.list[i];
		modals.newModal({
			message: `${text("Insurance")} "${insurance.name}" ${text(
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
		patients.list.forEach(((patient, index) => {
			if (patient.insurance && patient.insurance._id === id) {
				patients.list[index].insurance = undefined;
			}
		}))
	}
}

export const insurances = new InsuranceData();
