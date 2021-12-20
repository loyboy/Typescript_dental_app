import { text } from "@core";
import {
	
	ConsentsJSON
	
	} from "@modules";
import { generateID } from "@utils";
import { computed, observable, observe } from "mobx";





export class Consent {
	_id: string = generateID();
	@observable title: string = '';
	@observable notes: string = '';	

	constructor(json?: ConsentsJSON) {
		if (json) {
			this.fromJSON(json);
		}
	}

	toJSON(): ConsentsJSON {
		return {
			_id: this._id,
			title: this.title,
			notes: this.notes,
		
		};
	}

	fromJSON(json: ConsentsJSON) {
		this._id = json._id;
		this.title = json.title || '';
		this.notes = json.notes;
	}
}
