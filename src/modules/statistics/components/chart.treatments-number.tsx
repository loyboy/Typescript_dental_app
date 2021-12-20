import { BarChartComponent } from "@common-components";
import { text } from "@core";
import { Chart, statistics, Treatment, treatments } from "@modules";
import { computed } from "mobx";
import { observer } from "mobx-react";
import { Appointment } from 'modules/appointments';
import * as React from "react";

@observer
class Component extends React.Component<{}, {}> {
	@computed
	get selectedTreatments() {
		
		const selectedTreatments: {
			treatment:string;
			profit: number;
			times: number;
		}[] = [];
		
		statistics.selectedAppointments.forEach(appointment => {
			if (appointment.treatUnitGroup.length <= 0) {
				return;
			}
			appointment.treatUnitGroup.forEach((tr) => {
				const i = selectedTreatments.findIndex(
					t => t.treatment === tr.treatment.split('|')[0]
				);
	
				if (i === -1) {
					selectedTreatments.push({
						treatment:  tr.treatment.split('|')[0],
						profit: appointment.profit,
						times: 1
					});
				} else {
					selectedTreatments[i].times++;
					selectedTreatments[i].profit =
						selectedTreatments[i].profit + appointment.profit;
				}
			})
			
		});
		return selectedTreatments;
	}

	@computed
	get values() {
		return this.selectedTreatments.map((treatment, i) => ({
			x: i,
			y: treatment.profit,
			times: treatment.times,
			title:
				treatments.list[
					treatments.getIndexByID(treatment.treatment)
				].lab_name
		}));
	}
	render() {
		return (
			<div>
				<BarChartComponent
					{...{
						height: 400,
						notStacked: false,
						data: {
							xLabels: this.values.map(x => x.title),
							bars: [
								{
									label: text("Profits"),
									data: this.values.map(x => x.y)
								},
								{
									label: text("Applied times"),
									data: this.values.map(x => x.times)
								}
							]
						}
					}}
				/>
			</div>
		);
	}
}

export const treatmentsNumberChart: Chart = {
	Component,
	name: "Labs by profits",
	description: "Treatments by profit",
	tags: "treatments number profit",
	className: "col-xs-12 col-lg-6"
};
