
export interface ImplantsJSON {
	_id: string;
	title: string[];
	notes: string;
	diagnosis_name: string;
	
	diagnosis_lab_hb : string;
	diagnosis_lab_bldtime : string,
	diagnosis_lab_inr : string,
	diagnosis_lab_clt : string,
	diagnosis_lab_pt : string,
	diagnosis_lab_prth : string,
	diagnosis_lab_ptt : string,
	diagnosis_lab_prth2 : string,
	diagnosis_lab_alk : string,

	diagnosis_note: string;

	drugGroup : {
        drug: string;
        dose: string;
        duration: number;
	}[];
	
	druginteract: string[];

	impl_technique: string;
	impl_area: string;
	impl_type: string;
	impl_length: string;
	impl_diameter: string;
	impl_bonetype: string;
	impl_bonegraft: string;
	impl_bonegraftq: string;
	impl_form: string;
	impl_membrane: string;
	impl_notes: string;

	pros_abutment: string;
	pros_height: string;
	pros_weight: string;
	pros_angulation: string;
	pros_crown: string;
	pros_crowntype: string;
	pros_shade: string;
	pros_notes: string;

	problems_concerns:string[];
	problems_others:string;
}