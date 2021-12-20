import { modals, text } from "@core";
import { patients, Implantation } from "@modules";
import { computed, observable } from "mobx";

class ImplantzData {
	ignoreObserver: boolean = false;

	@observable list: Implantation[] = [];

	getIndexByID(id: string) {
		return this.list.findIndex(x => x._id === id);
	}

	deleteModal(id: string) {
		
	}

	deleteByID(id: string) {
		const i = this.getIndexByID(id);
		this.list.splice(i, 1);
		
	}
}

export const implantz = new ImplantzData();
