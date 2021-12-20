import { BarChartComponent } from "@common-components";
import { text } from "@core";
import { Chart, statistics, appointments, Gender, Patient } from "@modules";
import { computed } from "mobx";
import { observer } from "mobx-react";
import * as React from "react";
    
@observer
class Component extends React.Component<{}, {}> {
	@computed
	get selectedProcedures() {
	  
	  const selectedProcedures: {
		procedure: any;
		times: number;
	  }[] = [];
  
	  statistics.selectedPatientsByDayInsurance.forEach((patient) => {
		if 
		  (
		  patient.procedures.length <= 0
		) {
		//  console.log(" Nothin dey for procedures - appoint");
		  return;
		}     
		
		patient.procedures.forEach((procedure) => {  
		  //  console.log("Group procedures: "+ procedure.name);
			if (procedure.id !== "") {
			  if (selectedProcedures.length !== 0) {
  
				const i = selectedProcedures.findIndex(
				  (proc) => proc.procedure.name === procedure.name
				);
  
				if (i === -1) {  
				  selectedProcedures.push({
					procedure: procedure,					
					times: 1
				  });
  
				} else {
				  selectedProcedures[i].times++;
				 
				}
			  } 
			  
			  else {
  
				selectedProcedures.push({
				  procedure: procedure,
				  times: 1,
				});
  
			  }
		  }  
	 });
	  });
	  return selectedProcedures;
	}
  

	@computed
	get values() {
		return this.selectedProcedures.map((pro, i) => {		
			return {
				x: i,				
				times: pro.times,
				title: pro.procedure.name
		   } 
		}).sort((a, b) => b.times - a.times)
		.filter((x, i) => i <= 5);
	}


	render() {
		
		return (
			<div>
				<BarChartComponent
					{...{
						height: 400,
						notStacked: true,
						data: {
							xLabels: this.values.map(x => x.title) ,
							bars: [
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

export const topProceduresAppliedPatientChart: Chart = {
	Component,
	name: "Top 5 Procedures Applied on Patient",
	description: "Top 5 Proceduress Applied on Patient",
	tags: "Top 5 Procedures Applied on Patient",
	className: "col-xs-12 col-lg-6"
};
