import { string } from 'prop-types';

export interface ExpenseJSON {
	_id: string;
	name: string;
	price: number;
	type: string;
	description: string;
	doctor: string;
	date: number;
	repeat: boolean;
	days: number;
	count: number;
}
