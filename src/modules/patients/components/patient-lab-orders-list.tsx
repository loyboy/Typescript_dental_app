import { Row, DataTableComponent } from "@common-components";
import { text } from "@core";
import { observer } from "mobx-react";
import * as React from "react";
import { statistics, setting } from "@modules"
import { appointments } from "modules/appointments";
import { formatDate } from '@utils';
import { DatePicker } from "office-ui-fabric-react";

@observer
export class PatientLabOrdersListPanel extends React.Component {

  displayData = () => {
    const ordersArray: any = [];
    statistics.selectedAppointmentsByDayNew.forEach((appointment, i) => {
      const labOrders = appointment.treatUnitGroup;
      if (labOrders.length !== 0) {
        return labOrders.map(lab => {
          const labDetails = lab.treatment.split("|");
          const labId = labDetails[0] || "";
          const labName = labDetails[1] || "";
          const labPrice = labDetails[2] || "";
          ordersArray.push({
            id: i + "pp",
            searchableString: appointment.searchableString,
            cells: [
              {
                dataValue: appointment.patient.name,
                component: <p>{appointment.patient.name || ""}</p>,
              },
              {
                dataValue: labId,
                component: <p>{labId}</p>,
              },
              {
                dataValue: appointment.date,
                component: <p>{formatDate(appointment.date, "date-format")}</p>,
              },
              {
                dataValue: labName,
                component: <p>{labName}</p>,
              },
              {
                dataValue: labPrice,
                component: <p>{lab.unit}</p>,
              },
              {
                dataValue: labPrice,
                component: <p>{lab.fees}</p>,
              },
              {
                dataValue: appointment.status,
                component: <p>{appointment.status}</p>,
              },
            ],
          });
        })
      }
    });
    return ordersArray
  }

  render() {
    const ordersArray = this.displayData();
    return (
      <div className="payment">
        <Row>
            <DataTableComponent
              maxItemsOnLoad={3}
              heads={[
                text("Patient Name"),
                text("Lab Order ID"),
                text("Date of Creation"),
                text("Item Title"),
                text("Unit"),
                text("Fees"),
                text("Status"),
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
              rows={ordersArray}
            />
        </Row>
      </div>
    );
  }
}
