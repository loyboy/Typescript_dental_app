import { BarChartComponent } from "@common-components";
import { text } from "@core";
import { Chart, statistics } from "@modules";
import { computed } from "mobx";
import { observer } from "mobx-react";
import * as React from "react";
import { appointments } from 'modules/appointments';
import { Patient } from 'modules/patients';

@observer
class Component extends React.Component<{}, {}> {
  
  getprocedure = (patient: Patient, procedureid: string) => {
    return patient.procedures.find(pro => pro.id === procedureid );
  }

  @computed
  get selectedProcedures() {
    const selectedProcedures: {
      procedure: any;
      profit: number;
      times: number;
    }[] = [];

    statistics.selectedAppointments.forEach((appointment) => {
      if 
        (
        appointment.procedureId === ""
      ) {
      //  console.log(" Nothin dey for procedures - appoint");
        return;
      }
      
      if (!appointment.patient){
      //  console.log(" Nothin dey for procedures - patient ");
        return;
      }
      
      if (appointment.patient.procedures.length <= 0) {
       // console.log(" Nothin dey for procedures ");
        return;
      }
         
            if (selectedProcedures.length !== 0) {

              const i = selectedProcedures.findIndex(
                (proc) => proc.procedure.name === this.getprocedure(  appointment.patient, appointment.procedureId ).name
              );

              if (i === -1) {

                selectedProcedures.push({
                  procedure: this.getprocedure(  appointment.patient, appointment.procedureId ),
                  profit: appointment.profit,
                  times: 1,
                });

              } else {
                selectedProcedures[i].times++;
                selectedProcedures[i].profit =   selectedProcedures[i].profit + appointment.profit;
              }
            } 
            
            else {

              selectedProcedures.push({
                procedure: this.getprocedure(  appointment.patient, appointment.procedureId ),
                profit: appointment.profit,
                times: 1,
              });

            }
        
  // });
  });
  
    return selectedProcedures;
  }

  @computed
  get values() {
    return this.selectedProcedures.map((procedure, i) => ({
      x: i,
      y: procedure.profit,
      times: procedure.times,
      title: procedure.procedure.name,
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
              xLabels: this.values.map((x) => x.title),
              bars: [
                {
                  label: text("Profits"),
                  data: this.values.map((x) => x.y),
                },
                {
                  label: text("Applied Procedures"),
                  data: this.values.map((x) => x.times),
                },
              ],
            },
          }}
        />
      </div>
    );
  }
}

export const proceduresNumberChart: Chart = {
  Component,
  name: "Procedures by profits",
  description: "Procedures by profit",
  tags: "procedures number profit",
  className: "col-xs-12 col-lg-6",
};
