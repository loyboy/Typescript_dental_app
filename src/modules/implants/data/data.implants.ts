import { files, modals, text } from "@core";
import { Implant } from "@modules";
import { escapeRegExp } from "@utils";
import { computed, observable } from "mobx";

class Implants {
	@observable triggerUpdate: number = 0;

	ignoreObserver: boolean = false;

	@observable list: Implant[] = [];

	@observable filter: string = "";


	getIndexByID(id: string) {
		return this.list.findIndex(x => x._id === id);
	}

	deleteModal(id: string) {
		const i = this.getIndexByID(id);
		const consent = this.list[i];
		modals.newModal({
			message: `${text("Implant with ID: ")} "${consent._id}" ${text(
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
		const implants = this.list.splice(i, 1)[0];	
	}
}

export const implants = new Implants();
