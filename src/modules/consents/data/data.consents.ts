import { files, modals, text } from "@core";
import { Consent } from "@modules";
import { escapeRegExp } from "@utils";
import { computed, observable } from "mobx";

class Consents {
	@observable triggerUpdate: number = 0;

	ignoreObserver: boolean = false;

	@observable list: Consent[] = [];

	@observable filter: string = "";

	@computed
	get filtered(): Consent[] {
		if (this.filter === "") {
			return this.list;
		} else {
			const filters = this.filter
				.split(" ")
				.map(
					filterString =>
						new RegExp(escapeRegExp(filterString), "gim")
				);
			return this.list.filter(endoCase =>
				filters.every(filter => filter.test(JSON.stringify(endoCase)))
			);
		}
	}

	getIndexByID(id: string) {
		return this.list.findIndex(x => x._id === id);
	}

	deleteModal(id: string) {
		const i = this.getIndexByID(id);
		const consent = this.list[i];
		modals.newModal({
			message: `${text("Consent with ID: ")} "${consent._id}" ${text(
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
		const consents = this.list.splice(i, 1)[0];	
	}
}

export const consents = new Consents();
