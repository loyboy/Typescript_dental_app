import { PieChartComponent } from "@common-components";
import { text } from "@core";
import {
	Chart,
	Gender,
	Patient,
	statistics,
} from "@modules";
import { computed } from "mobx";
import { observer } from "mobx-react";
import * as React from "react";
import { appointments } from 'modules/appointments';

@observer
class Component extends React.Component<{}, {}> {

	@computed
	get malePercentile() {
		return this.calculateGenderPercentile(Gender.male);
	}
	@computed
	get femalePercentile() {
		return this.calculateGenderPercentile(Gender.female);
	}

	render() {
		return (
			<div>
					<PieChartComponent
				height={400}
				{...{
					data: [
						{ label: text("Male"), value: this.malePercentile },
						{ label: text("Female"), value: this.femalePercentile }
					]
				}}
			/>
			</div>
		);
	}

	calculateGenderPercentile(gender: Gender) {
		return statistics.selectedDays
			.map(
				day =>
					appointments
						.appointmentsForDay(
							day.getFullYear(),
							day.getMonth() + 1,
							day.getDate()
						)
						.filter(
							(appointment,i) => {
								//console.log("Appointment procedure: "+ appointment.patient.procedures.length + " : " + i);nn
								return appointment.procedureId !== '' && (appointment.patient || new Patient()).gender === gender
							}
						).length
			)
			.reduce((total, males) => (total = total + males), 0);
	}
}


export const proceduresByGenderChart: Chart = {
	Component,
	name: "Procedures by gender",
	description: "applied procedures by patients gender",
	tags: "A breakdown of applied procedures by patients gender throughout the selected date",
	className: "col-xs-12 col-lg-6"
};
