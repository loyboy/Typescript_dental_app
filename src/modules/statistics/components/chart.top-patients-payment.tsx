import { BarChartComponent } from "@common-components";
import { text } from "@core";
import { Chart, statistics } from "@modules";
import { computed } from "mobx";
import { observer } from "mobx-react";
import { Patient } from 'modules/patients';
import * as React from "react";
    
@observer
class Component extends React.Component<{}, {}> {
	@computed
	get selectedPatients() {
		
		const selectedPatient: {
			patient: Patient;
			profit: number;
			times: number;
        }[] = [];
		
		statistics.selectedAppointments.forEach((appointment) => {
			if (appointment.paidAmount <= 0) {
				return;
			}
			
			if (selectedPatient.length !== 0) {

				const i = selectedPatient.findIndex(
				  (pat) => pat.patient._id === appointment.patientID
				);
  
				if (i === -1) {  
					selectedPatient.push({
						patient: appointment.patient,
						profit: appointment.paidAmount,
						times: 1,
					});
  
				} else {
					selectedPatient[i].times++;
					selectedPatient[i].profit = selectedPatient[i].profit + appointment.paidAmount;
				}
			  } 
			  
			  else {  
				selectedPatient.push({
					patient: appointment.patient,
					profit: appointment.paidAmount,
				    times: 1,
				});  
			  }
		})

		return selectedPatient
	}


	@computed
	get values() {
		return this.selectedPatients.map((patient, i) => {		
			return {
				x: i,
				y: patient.profit,
				times: patient.times,
				title: patient.patient.name
		   } 
		}).sort((a, b) => b.y - a.y)
		.filter((x, i) => i <= 5);
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
									label: text("Paid Amount"),
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

export const topPatientByPaymentChart: Chart = {
	Component,
	name: "Top 5 Patient by Payment",
	description: "Top 5 patient by payment",
	tags: "top 5 paitent by payment",
	className: "col-xs-12 col-lg-6"
};
