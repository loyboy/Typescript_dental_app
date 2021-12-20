import { InsuranceJSON } from "@modules";
import { generateID } from "@utils";
import { computed, observable } from "mobx";

export class Insurance {
	// Observables

	_id: string = generateID();

	@observable name: string = "";

	@observable discount: number = 0;

	@observable information: string = "";

	@computed
	get searchableString() {
		return `
			${this.name} discount ${this.discount}
		`.toLowerCase();
	}

	public toJSON(): InsuranceJSON {
		return {
			_id: this._id,
			name: this.name,
			discount: this.discount,
			information: this.information
		};
	}

	constructor(json?: InsuranceJSON) {
		if (json) {
			this.fromJSON(json);
		}
	}

	fromJSON(json: InsuranceJSON) {
		this._id = json._id;
		this.name = json.name;
		this.discount = json.discount || 0;
		this.information = json.information;
	}
}
