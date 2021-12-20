import { text } from "@core";
import {
	
	ImplantsJSON
	
	} from "@modules";
import { generateID } from "@utils";
import { computed, observable, observe } from "mobx";

export class Implant {
	_id: string = generateID();
	@observable title: string[] = [];
	@observable notes: string ="";	
	@observable diagnosis_name: string ="";
	@observable diagnosis_lab_hb: string ="";
	@observable diagnosis_lab_bldtime: string ="";
	@observable diagnosis_lab_inr: string ="";
	@observable diagnosis_lab_clt: string ="";
	@observable diagnosis_lab_pt: string ="";
	@observable diagnosis_lab_prth: string ="";
	@observable diagnosis_lab_ptt: string ="";
	@observable diagnosis_lab_prth2: string ="";
	@observable diagnosis_lab_alk: string ="";
	
	@observable diagnosis_note: string ="";

	@observable drugGroup : {
        drug: string;
        dose: string;
        duration: number;
	}[] = [];
	
	@observable druginteract: string[] = [];

	@observable impl_technique: string ="";
	@observable impl_area: string ="";
	@observable impl_type: string ="";
	@observable impl_length: string ="";
	@observable impl_diameter: string ="";
	@observable impl_bonetype: string ="";
	@observable impl_bonegraft: string ="";
	@observable impl_bonegraftq: string ="";
	@observable impl_form: string ="";
	@observable impl_membrane: string ="";
	@observable impl_notes: string ="";

	@observable pros_abutment: string ="";
	@observable pros_height: string ="";
	@observable pros_weight: string ="";
	@observable pros_angulation: string ="";
	@observable pros_crown: string ="";
	@observable pros_crowntype: string ="";
	@observable pros_shade: string =""; 
	@observable pros_notes: string ="";

	@observable problems_concerns:string[] = [];
	@observable problems_others:string ="";

	constructor(json?: ImplantsJSON) {
		if (json) {
			this.fromJSON(json);
		}
	}

	@computed get searchableString() {
		return `
         ${
            this.notes
        } ${
            this.diagnosis_name
        } ${
            this.diagnosis_note
        }`;
	}

	public fromJSON(json: ImplantsJSON) {
			this._id = json._id;
			this.title = json.title;
			this.notes = json.notes;

			this.diagnosis_name = json.diagnosis_name,
			
			this.diagnosis_lab_hb=  json.diagnosis_lab_hb,
			this.diagnosis_lab_bldtime = json.diagnosis_lab_bldtime,
			this.diagnosis_lab_inr = json.diagnosis_lab_inr,
			this.diagnosis_lab_clt = json.diagnosis_lab_clt,
			this.diagnosis_lab_pt = json.diagnosis_lab_pt,
			this.diagnosis_lab_prth = json.diagnosis_lab_prth,
			this.diagnosis_lab_ptt = json.diagnosis_lab_ptt,
			this.diagnosis_lab_prth2 =  json.diagnosis_lab_prth2,
			this.diagnosis_lab_alk = json.diagnosis_lab_alk,

	 	    this.diagnosis_note = json.diagnosis_note,
			this.drugGroup = json.drugGroup,
	        this.druginteract = json.druginteract,

			this.impl_technique =    json.impl_technique,
			this.impl_area = json.impl_area,
			this.impl_type =  json.impl_type,
			this.impl_length = json.impl_length,
			this.impl_diameter = json.impl_diameter,
			this.impl_bonetype =  json.impl_bonetype,
			this.impl_bonegraft = json.impl_bonegraft,
			this.impl_bonegraftq = json.impl_bonegraftq,
			this.impl_form = json.impl_form,
			this.impl_membrane = json.impl_membrane,
			this.impl_notes = json.impl_notes,

			this.pros_abutment = json.pros_abutment,
			this.pros_height = json.pros_height,
			this.pros_weight = json.pros_weight,
			this.pros_angulation = json.pros_angulation,
			this.pros_crown = json.pros_crown,
			this.pros_crowntype = json.pros_crowntype,
			this.pros_shade = json.pros_shade,
			this.pros_notes = json.pros_notes,

			this.problems_concerns = json.problems_concerns,
			this.problems_others = json.problems_others
	}

	toJSON(): ImplantsJSON {
		return {
			_id: this._id,
			title: Array.from(this.title),
			notes: this.notes,
			
			diagnosis_name: this.diagnosis_name,
			//diagnosis_lab: Array.from(this.diagnosis_lab),

			diagnosis_lab_hb:  this.diagnosis_lab_hb,
			diagnosis_lab_bldtime: this.diagnosis_lab_bldtime,
			diagnosis_lab_inr: this.diagnosis_lab_inr,
			diagnosis_lab_clt: this.diagnosis_lab_clt,
			diagnosis_lab_pt: this.diagnosis_lab_pt,
			diagnosis_lab_prth: this.diagnosis_lab_prth,
			diagnosis_lab_ptt: this.diagnosis_lab_ptt,
			diagnosis_lab_prth2: this.diagnosis_lab_prth2,
			diagnosis_lab_alk: this.diagnosis_lab_alk,

	 	    diagnosis_note: this.diagnosis_note,
			drugGroup: Array.from(this.drugGroup),
	        druginteract: Array.from(this.druginteract),

			impl_technique:  this.impl_technique,
			impl_area: this.impl_area,
			impl_type: this.impl_type,
			impl_length: this.impl_length,
			impl_diameter: this.impl_diameter,
			impl_bonetype: this.impl_bonetype,
			impl_bonegraft: this.impl_bonegraft,
			impl_bonegraftq:  this.impl_bonegraftq,
			impl_form: this.impl_form,
			impl_membrane: this.impl_membrane,
			impl_notes: this.impl_notes,

			pros_abutment: this.pros_abutment,
			pros_height: this.pros_height,
			pros_weight: this.pros_weight,
			pros_angulation: this.pros_angulation,
			pros_crown: this.pros_crown,
			pros_crowntype: this.pros_crowntype,
			pros_shade: this.pros_shade,
			pros_notes: this.pros_notes,

			problems_concerns: Array.from(this.problems_concerns),
			problems_others: this.problems_others		
		};
	}
}
