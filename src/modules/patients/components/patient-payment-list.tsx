import { Col, Row, DataTableComponent } from "@common-components";
import { text } from "@core";
import { Patient, patients, appointments, statistics, setting} from "@modules";
import { formatDate } from "@utils";
import { observer } from "mobx-react";
import * as React from "react";
import { Procedures } from "../data";
import { DatePicker, Dropdown } from "office-ui-fabric-react";
import { staff } from 'modules/staff';

@observer
export class PatientPaymentListPanel extends React.Component {
  getProcedure = (patientID: string, id: string) => {
    let procedureDetails;
    statistics.selectedPatientsByDayNew.forEach((patient) => {
      if (patient._id == patientID) {
        procedureDetails = patient.procedures.find(
          (procedure) => procedure.id == id
        );
      }
    });
    return procedureDetails || ({} as Procedures);
  };

  getTotalAmount = () => {
    let totalPayment = {
      totalDues: 0,
      totalDiscount: 0,
      totalPaid: 0,
      totalProfit: 0,
      totalRemaining: 0,
      totalInsurance: 0,
    };
    statistics.selectedAppointmentsByDayNew.forEach((appointment) => {
      totalPayment = {
        totalDues:
          Math.floor(
          totalPayment.totalDues +
          Number(appointment.outstandingAmount)),
        totalDiscount:
          Math.floor(
          totalPayment.totalDiscount +
          Number(appointment.discount)),
        totalPaid:
          Math.floor(
          totalPayment.totalPaid +
          Number(appointment.paidAmount)
          ),
        totalProfit:
          Math.floor(
          totalPayment.totalProfit +
          Number(appointment.profit)),
        totalRemaining:
          Math.floor(
          totalPayment.totalRemaining +
          Number(appointment.outstandingAmount)),
        totalInsurance:
          Math.floor(
          totalPayment.totalInsurance +
          Number(appointment.insuranceDetails.discount)
          ),
      };
    });
    return totalPayment;
  };

  render() {
    const {
      totalDiscount,
      totalPaid,
      totalProfit,
      totalRemaining,
      totalInsurance,
    } = this.getTotalAmount();
    return (
      <div className="payment">
        <Row gutter={6}>
          <Col sm={4}>
            Total Dues : {Number(totalRemaining) < 0 ? 0 : totalRemaining}
          </Col>
          <Col sm={4}>Discount : {totalDiscount}</Col>
          <Col sm={4}>Paid : {totalPaid}</Col>
          <Col sm={4}>Net Profit : {totalProfit}</Col>
          <Col sm={4}>Insurance : {totalInsurance}</Col>
        </Row>

        <Row className="break-line"></Row>
        <Row>
          {" "}
          {patients.list.length !== 0 && (
            <DataTableComponent
              maxItemsOnLoad={3}
              heads={[
                text("Name"),
                text("Status"),
                text("Price"),
                text("Profit"),
                text("Paid"),
                text("Remaining"),
                text("Insurance") + "(%)",
                text("Discount") + "(%)",
                text("Description"),
                text("Tooth"),
                text("Dentist"),
                text("Procedure"),
                text("Date"),
              ]}
              hideSearch={false}
              hideCommands={true}
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
              farItems={[
                {
                  key: "1",
                  onRender: () => {
                    return (
                      <Dropdown
											placeholder={text(
												"Filter by staff member"
											)}
											defaultValue=""
											options={[
												{
													key: "",
													text: text("All members")
												}
											].concat(
												staff.list.map(member => {
													return {
														key: member._id,
														text: member.name
													};
												})
											)}
											onChange={(ev, member) => {
                        console.log("stafff is filter",member.key);
												statistics.filterByMember = member!.key.toString();//
											}}
										/>
                    );
                  }
                }
              ]}
              rows={statistics.selectedAppointmentsByDayNew.map((appointment, i) => ({
                id: i + "pp",
                searchableString: appointment.searchableString,
                cells: [
                  {
                    dataValue: appointment.patient.name || "",
                    component: <p>{appointment.patient.name}</p>
                  },
                  {
                    dataValue: appointment.staffID,
                    component: <p>{appointment.staffID}</p>,
                  },
                  {
                    dataValue: appointment.finalPrice,
                    component: <p>{appointment.finalPrice}</p>,
                  },
                  {
                    dataValue: appointment.profit,
                    component: <p>{appointment.profit}</p>,
                  },
                  {
                    dataValue: appointment.paidAmount,
                    component: <p>{appointment.paidAmount}</p>,
                  },
                  {
                    dataValue: appointment.outstandingAmount,
                    component: (
                      <p>
                        {appointment.outstandingAmount}
                      </p>
                    ),
                  },
                  {
                    dataValue: appointment.insuranceDetails.discount,
                    component: <p>{appointment.insuranceDetails.discount}</p>,
                  },
                  {
                    dataValue: appointment.discount,
                    component: <p>{appointment.discount}</p>,
                  },
                  {
                    dataValue: appointment.notes,
                    component: <p>{appointment.notes}</p>,
                  },
                  {
                    dataValue: appointment.involvedTeeth,
                    component: <p>{appointment.involvedTeeth.join(", ")}</p>,
                  },
                  {
                    dataValue: appointment.dentist,
                    component: <p> {appointment.dentist}</p>,
                  },
                  {
                    dataValue: appointment.patientID,
                    component: (
                      <p>
                        {this.getProcedure(
                          appointment.patientID,
                          appointment.procedureId
                        ) && appointment.procedureId !== ""
                          ? this.getProcedure(
                              appointment.patientID,
                              appointment.procedureId
                            ).name
                          : appointment.procedureId}
                      </p>
                    ),
                  },
                  {
                    dataValue: appointment.date,
                    component: (
                      <p>
                        {" "}
                        {formatDate(
                          new Date(appointment.date),
                          "date-format"
                        )}{" "}
                      </p>
                    ),
                  },
                ]
              }))}
              as
              any
            />
          )}{" "}
        </Row>
      </div>
    );
  }
}
