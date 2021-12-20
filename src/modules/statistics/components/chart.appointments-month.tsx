import { LineChartComponent } from "@common-components";
import { text } from "@core";
import { Chart, setting, statistics } from "@modules";
import { formatDate } from "@utils";
import { computed } from "mobx";
import { observer } from "mobx-react";
import * as React from "react";

@observer
class Component extends React.Component<{}, {}> {
	@computed
	get values() {
		const initialValue: {
			missed: number[];
			outstanding: number[];
			paid: number[];
			months: string[];
		} = {
			months: [],
			missed: [],
			outstanding: [],
			paid: []
		};

		return statistics.selectedAppointmentsByMonthSelected.reduce((acc, val) => {
			//console.log("Apoints by date: " + val.day.toDateString());
			acc.paid.push(val.appointments.filter(a => a.isPaid).length);
			acc.outstanding.push(
				val.appointments.filter(a => a.isOutstanding).length
			);
			acc.missed.push(val.appointments.filter(a => a.missed).length);
			acc.months.push(
				formatDate(val.day.getTime(), setting.getSetting("date_format"))
			);
			return acc;
		}, initialValue);
    }
    
    getMonths = (month : number) => {
        let monval = [
            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December",
          ];
          return monval[month];
    } 
	render() {
		return (
			

			<LineChartComponent
				{...{
					height: 300,
					data: {
						xLabels:  this.values.months,
						lines: [
							{
								label: text("Missed"),
								data: this.values.missed
							},
							{
								label: text("Paid"),
								data: this.values.paid
							},
							{
								label: text("Outstanding"),
								data: this.values.outstanding
							}							
						]
					}
				}}
			/>
		);
	}
}

export const appointmentsByMonthChart: Chart = {
	Component,
	name: "Appointments by Month",
	description: "Number of appointments",
	tags: "appointments date number how many",
	className: "col-xs-12"
};
