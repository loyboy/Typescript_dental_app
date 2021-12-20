import { PieChartComponent } from "@common-components";
import { text } from "@core";
import {
	Chart,
	Gender,
	Patient,
	statistics,
	Treatment,
	treatments,
	colors
	} from "@modules";
import { computed } from "mobx";
import { observer } from "mobx-react";
import { appointments } from 'modules/appointments';
import * as React from "react";

@observer
class Component extends React.Component<{}, {}> {
	@computed
	get data() {
		return statistics.selectedAppointments
			.filter(x => x.treatment !== undefined )
			.map(x => x.treatment)
			.reduce((result: { label: string; value: number }[], treatmentobj) => {

			//	treatUnitGroup.forEach(treatmentID => {					
					const treatment = treatments.list.find(t => t.lab_name === treatmentobj.lab_name)
					//const apt =  appointments.list.find((appointment) => appointment.procedureId === id );
					if (!treatment) {
						return result;
					}
					const label = treatment.lab_name;
					const i = result.findIndex(t => t.label === label);
					if (i === -1) {
						result.push({
							label,
							value: 1
						});
					} else {
						result[i].value++;
					}
			//	})
				return result;
			}, [])
			.sort((a, b) => b.value - a.value)
			.filter((x, i) => i <= 4)
			.map((d, i) => {
				if (i === 0) {
					return {
						label: d.label,
						value: d.value,
						color: colors.blue[1]
					};
				} else if (i === 1) {
					return {
						label: d.label,
						value: d.value,
						color: colors.green[1]
					};
				} else if (i === 2) {
					return {
						label: d.label,
						value: d.value,
						color: colors.greenish[1]
					};
				} else if (i === 3) {
					return {
						label: d.label,
						value: d.value,
						color: colors.purple[1]
					};
				} else {
					return {
						label: d.label,
						value: d.value,
						color: colors.orange[1]
					};
				}
			});
	}
	render() {
		return <PieChartComponent height={400} data={this.data} />;
	}
}

export const treatmentsByGenderChart: Chart = {
	Component,
	name: "Labs by gender",
	description: "applied treatments by patients gender",
	tags:
		"A breakdown of applied treatments by patients gender throughout the selected date",
	className: "col-xs-12 col-lg-6"
};


/**
 * @computed
	get selectedTreatments() {
		const selectedTreatments: {
			treatment: Treatment;
			male: number;
			female: number;
		}[] = [];
		statistics.selectedAppointments.forEach(appointment => {
			if ( appointment.treatUnitGroup.length > 0 ) {
					appointment.treatUnitGroup.forEach(treatmentID => {						
				
						
						const i = treatments.list.findIndex(t => t._id === treatmentID.treatment)
						const treatmentobj = treatments.list.find(t => t._id === treatmentID.treatment)

						let male = 3;
						let female = 2;
						if (
							(appointment.patient || new Patient()).gender ===
							Gender.female
						) {
							female++;
						} else {
							male++;
						}

						if (i === -1) {
							// add new
							if (treatmentobj){
								selectedTreatments.push({
									treatment: treatmentobj,
									male,
									female
								});
							}
							else{
								selectedTreatments.push({
									treatment: appointment.treatment,
									male,
									female
								});
							}							
						} else {
							// just increment
							selectedTreatments[i].male =
								selectedTreatments[i].male + male;
							selectedTreatments[i].female =
								selectedTreatments[i].female + female;
						}

				})
			}
		});
		return selectedTreatments;
	}

	render() {
		return (
			<div>
				<BarChartComponent
					{...{
						horizontal: true,
						height: 400,
						notStacked: true,
						data: {
							xLabels: this.selectedTreatments.map(
								x => x.treatment.lab_name
							),
							bars: [
								{
									label: text("Male"),
									data: this.selectedTreatments.map(
										x => x.male
									)
								},
								{
									label: text("Female"),
									data: this.selectedTreatments.map(
										x => x.female * -1
									)
								}
							]
						}
					}}
				/>
			</div>
		);
	}
 */