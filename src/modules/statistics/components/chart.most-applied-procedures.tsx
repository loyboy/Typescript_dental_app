import { PieChartComponent } from "@common-components";
import { text } from "@core";
import { Chart, colors, statistics, treatments, appointments , Patient} from "@modules";
import { computed } from "mobx";
import { observer } from "mobx-react";
import * as React from "react";

@observer
class Component extends React.Component<{}, {}> {
	getprocedure = (patient: Patient, procedureid: string) => {
		return patient.procedures.find(pro => pro.id === procedureid );
	}

	@computed
	get data() {
		return statistics.selectedAppointments
		    .filter(x => x.procedureId !== '')
			.map(x => x.procedureId)
			.reduce((result: { label: string; value: number }[], id) => {
				const apt =  appointments.list.find((appointment) => appointment.procedureId === id );
				if (!apt) {
					return result;
				}
				const label = this.getprocedure( apt.patient, id ).name;
				const i = result.findIndex(t => t.label === label);
				if (i === -1) {
					result.push({
						label,
						value: 1
					});
				} else {
					result[i].value++;
				}
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

export const mostAppliedProceduresChart: Chart = {
	Component,
	name: "Most Applied Procedures",
	description: "Top 5 most applied procedures",
	tags: "most applied used administered pro",
	className: "col-xs-12 col-lg-6"
};
