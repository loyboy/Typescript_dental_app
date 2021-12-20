import { TreatmentJSON } from "@modules";
import { generateID , formatDateInternal} from "@utils";
import { computed, observable } from "mobx";

export class Treatment {
	// Observables

	_id: string = generateID();

	@observable c_date: string = formatDateInternal(new Date());

	@observable item: string = "";

	@observable desc: string = "";

	@observable lab_name: string = "";

	@observable patient_name: string = "";

	@observable fees: string = "";

	@observable status: string = "";

//	@observable type: string = "";

//	@observable expenses: number = 0;

	@computed
	get searchableString() {
		return `
			${this.item} expenses ${this.desc}
		`.toLowerCase();
	}

	public toJSON(): TreatmentJSON {
		return {
			_id: this._id,
			c_date: this.c_date,
			item: this.item,
			desc: this.desc,
			lab_name: this.lab_name,
			patient_name: this.patient_name,
			fees: this.fees,
			status: this.status
		};
	}

	constructor(json?: TreatmentJSON) {
		if (json) {
			this.fromJSON(json);
		}
	}

	fromJSON(json: TreatmentJSON) {
		this._id = json._id;
		this.c_date = json.c_date;
		this.item = json.item;
		this.desc = json.desc;
		this.lab_name = json.lab_name;
		this.patient_name = json.patient_name;
		this.fees = json.fees;
		this.status = json.status;
	}
}
