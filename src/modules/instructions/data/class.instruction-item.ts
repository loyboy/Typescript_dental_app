import { text } from "@core";
import { InstructionItemJSON } from "@modules";
import { generateID } from "@utils";
import { computed, observable } from "mobx";

export class InstructionItem {

	_id: string = generateID();

	@observable name: string = "";

	@observable notes: string = "";


	@computed
	get searchableString() {
		return `
			${this.name} ${this.notes}
		`.toLowerCase();
	}

	toJSON(): InstructionItemJSON {
		return {
			_id: this._id,
			name: this.name,			
			notes: this.notes
		};
	}

	constructor(json?: InstructionItemJSON) {
		if (json) {
			this.fromJSON(json);
		}
	}

	fromJSON(json: InstructionItemJSON) {	
		this._id = json._id;
		this.name = json.name;
		this.notes = json.notes;
	}
}
