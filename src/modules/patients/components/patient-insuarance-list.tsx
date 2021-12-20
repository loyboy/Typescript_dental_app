import { Row, DataTableComponent } from "@common-components";
import { text } from "@core";
import { setting, statistics } from "@modules";
import { observer } from "mobx-react";
import * as React from "react";
import { formatDate } from "@utils"
import { DatePicker } from "office-ui-fabric-react";

@observer 
export class PatientInsuranceListPanel extends React.Component {

  getInsuranceList = () => {
    return statistics.selectedAppointmentsByDayNew.filter(
      appointment => appointment.cinsurance && appointment.insuranceDetails && appointment.insuranceDetails.name
    );
  }

  render() {
    return (
      <div className="payment">
        <Row>
            <DataTableComponent
              maxItemsOnLoad={3}
              heads={[
                text("Patient Name"),
                text("Insurance Name"),
                text("Amount"),
                text("Date"),
              ]}
              hideSearch={false}
              commands={[
                {
                  key: "2",
                  onRender: () => {
                    return (
                      <DatePicker
											onSelectDate={date => {
												if (date) {
													statistics.startingDate = statistics.getDayStartingPoint(
														date.getTime()
													);
												}
											}}
											value={
												new Date(statistics.startingDate)
											}
											formatDate={d =>
												`${text("From")}: ${formatDate(
													d,
													setting.getSetting(
														"date_format"
													)
												)}`
											}
										/>
                    );
                  }
                },
                {
                  key: "3",
                  onRender: () => {
                    return ( 
                      <DatePicker
											onSelectDate={date => {
												if (date) {
													statistics.endingDate = statistics.getDayStartingPoint(
														date.getTime()
													);
												}
											}}
											value={new Date(statistics.endingDate)}
											formatDate={d =>
												`${text("Until")}: ${formatDate(
													d,
													setting.getSetting(
														"date_format"
													)
												)}`
											}
										
                      />
                    );
                  }
                }
              ]}
              rows={this.getInsuranceList().map((appointment, i) => {
                const insurance = appointment.insuranceDetails
                return ({ 
                id: i + "pp",
                searchableString: appointment.searchableString,
                cells: [
                  {
                    dataValue: appointment.patient.name || "",
                    component: <p>{appointment.patient.name}</p>,
                  },
                  {
                    dataValue: insurance.name,
                  component: <p>{insurance.name}</p>,
                  },
                  {
                    dataValue: insurance.discount,
                    component: <p>{insurance.discount}</p>,
                  },
                  {
                    dataValue: appointment.date,
                    component: <p>{formatDate(Number(appointment.date), "date-format") }</p>,
                  },
                ],
              })}
              )}
            />
        </Row>
      </div>
    );
  }
}
