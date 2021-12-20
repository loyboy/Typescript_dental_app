import {
  Col,
  DataTableComponent,
  ProfileSquaredComponent,
  Row,
  SectionComponent,
  AsyncComponent,
} from "@common-components";
import { router, text, user } from "@core";
import { appointments, setting, Treatment, treatments } from "@modules";
import { num, formatDate } from "@utils";
import { computed, observable } from "mobx";
import { observer } from "mobx-react";
import { parse, unparse } from "papaparse";
import {
  IconButton,
  Panel,
  PanelType,
  TextField,
  Dropdown,
} from "office-ui-fabric-react";
import * as React from "react";

@observer
export class Treatments extends React.Component<{}, {}> {
  @observable selectedID: string = router.currentLocation.split("/")[1];
  inputElement: any = null;

  @computed
  get canEdit() {
    return user.currentUser.canEditTreatments;
  }

  @computed
  get selectedIndex() {
    return treatments.list.findIndex((x) => x._id === this.selectedID);
  }

  @computed
  get selectedTreatment() {
    return treatments.list[this.selectedIndex];
  }

  onChange(e: any) {
    console.log(" Files: " + e.target.files[0].name);
    parse(e.target.files[0], {
      complete: (result: any) => {
        let datax = result.data;
        const found = datax.some(
          (e: any) =>
            e.id !== undefined &&
            e.name !== undefined &&
            e.birth !== undefined &&
            e.gender !== undefined &&
            e.tags !== undefined &&
            e.address !== undefined &&
            e.email !== undefined &&
            e.phone !== undefined &&
            e.labels !== undefined &&
            e.history !== undefined &&
            e.gallery !== undefined &&
            e.diagnosis !== undefined
        );
        if (found) {
          //alert('Working!')
          console.log("Found val: " + JSON.stringify(datax));
          for (let val of datax) {
            if (val.id !== "") {
              var treat = new Treatment();
              var foundItem = treatments.list.find(
                (treatment) => treatment._id === val.id
              );
              if (foundItem) {
                break;
              }

              treat._id = val.id;
              treat.c_date = val.cdate;
              treat.item = val.item;
              treat.desc = val.desc;
              treat.lab_name = val.lab;
              treat.patient_name = val.patient;
              treat.fees = val.fees;
              treat.status = val.status;

              treatments.list.push(treat);
              alert("Added data into Lab Order Database");
            }
          }
        } else {
          alert(
            "Sorry, this CSV file does not match the required Format. Please get the proper format before Uploading."
          );
        }
        //console.log("CSV results:"+ JSON.stringify(result.data));
      },
      header: true,
    });
  }

  render() {
    return (
      <div className="tc-pg p-15 p-l-10 p-r-10">
        <input
          type="file"
          name="import"
          onChange={this.onChange}
          ref={(input) => (this.inputElement = input)}
          accept=".csv"
          style={{ opacity: 0 }}
        />

        <DataTableComponent
          onDelete={
            this.canEdit
              ? (id) => {
                  treatments.deleteModal(id);
                }
              : undefined
          }
          commands={
            this.canEdit
              ? [
                  {
                    key: "addNew",
                    title: "Add Order",
                    name: text("Add Order"),
                    onClick: () => {
                      const treatment = new Treatment();
                      treatments.list.push(treatment);
                      this.selectedID = treatment._id;
                    },
                    iconProps: {
                      iconName: "Add Order",
                    },
                  }
                ]
              : []
          }
          heads={[
            text("Lab Order ID"),
            text("Date of Creation"),
            text("Item Title"),
            text("Description"),
            text("Lab Name"),
            text("Patient Name"),
            text("Fees"),
            text("Status"),
            text("Edit"),
          ]}
          rows={treatments.list.map((treatment) => {
            /*	const now = new Date().getTime();
						let done = 0;
						let upcoming = 0;

						const appointmentsArr = appointments.list;

						for (
							let index = 0;
							index < appointmentsArr.length;
							index++
						) {
							const appointment = appointmentsArr[index];
							if (appointment.treatmentID !== treatment._id) {
								continue;
							}
							if (appointment.date > now) {
								upcoming++;
							}
							if (appointment.isDone) {
								done++;
							}
						}*/

            return {
              id: treatment._id,
              searchableString: treatment.searchableString,
              cells: [
                {
                  dataValue: treatment._id,
                  component: (
                    <span>
                      <b> #{treatment._id} </b>
                    </span>
                  ),
                  onClick: () => {
                    this.selectedID = treatment._id;
                  },
                  className: "no-label",
                },
                {
                  dataValue: treatment.c_date,
                  component: <span>{treatment.c_date}</span>,
                  className: "hidden-xs",
                },
                {
                  dataValue: treatment.item,
                  component: <span>{treatment.item}</span>,
                  className: "hidden-xs",
                },
                {
                  dataValue: treatment.desc,
                  component: <span>{treatment.desc}</span>,
                  className: "hidden-xs",
                },
                {
                  dataValue: treatment.lab_name,
                  component: <span>{treatment.lab_name}</span>,
                  className: "hidden-xs",
                },
                {
                  dataValue: treatment.patient_name,
                  component: <span>{treatment.patient_name}</span>,
                  className: "hidden-xs",
                },
                {
                  dataValue: treatment.fees,
                  component: (
                    <span>
                      {setting.getSetting("currencySymbol")} {treatment.fees}
                    </span>
                  ),
                  className: "hidden-xs",
                },
                {
                  dataValue: treatment.status,
                  component: <span>{treatment.status}</span>,
                  className: "hidden-xs",
                },
                {
                  dataValue: treatment._id,
                  component: <IconButton iconProps={{ iconName: "Edit" }} />,
                  onClick: () => {
                    this.selectedID = treatment._id;
                  },
                  className: "no-label",
                },
              ],
            };
          })}
          maxItemsOnLoad={20}
        />

        {this.selectedTreatment ? (
          <Panel
            isOpen={!!this.selectedTreatment}
            type={PanelType.medium}
            closeButtonAriaLabel="Close"
            isLightDismiss={true}
            onDismiss={() => {
              this.selectedID = "";
            }}
            onRenderNavigation={() => (
              <Row className="panel-heading">
                <Col span={20}>
                  {this.selectedTreatment ? (
                    <ProfileSquaredComponent
                      text={this.selectedTreatment.item}
                      subText={`${text("Expenses")}: ${setting.getSetting(
                        "currencySymbol"
                      )}${this.selectedTreatment.fees} ${text(" charge")}`}
                    />
                  ) : (
                    <p />
                  )}
                </Col>
                <Col span={4} className="close">
                  <IconButton
                    iconProps={{ iconName: "cancel" }}
                    onClick={() => {
                      this.selectedID = "";
                    }}
                  />
                </Col>
              </Row>
            )}
          >
            <AsyncComponent
              key=""
              loader={async () => {
                const TreatmentDetailsPanel = (
                  await import("./treatment-details")
                ).TreatmentDetailsPanel;
                return (
                  <TreatmentDetailsPanel
                    treat={this.selectedTreatment!}
                    selected={this.selectedIndex}
                  />
                );
              }}
            />
          </Panel>
        ) : (
          ""
        )}
      </div>
    );
  }
}


/** 
 * ,
                  {
                    key: "addImport",
                    title: "Import Lab Order",
                    name: text("Import Lab Order"),
                    onClick: () => {
                      this.inputElement.click();
                    },
                    iconProps: {
                      iconName: "Edit",
                    },
                  },
                  {
                    key: "addExport",
                    title: "Export Lab Order",
                    name: text("Export Lab Order"),
                    onClick: () => {
                      var d = confirm(
                        "Are you sure you want to export this Lab Order data?"
                      );
                      if (d) {
                        let treat: Treatment[] = treatments.list;

                        let newpat = treat.map((t) => {
                          return {
                            Id: t._id,
                            "Creation Date": t.c_date,
                            "Item Title": t.item,
                            Description: t.desc,
                            "Lab Name": t.lab_name,
                            "Patient Name": t.patient_name,
                            Fees: t.fees,
                            Status: t.status,
                          };
                        });

                        var csv = unparse(newpat);

                        var blob = new Blob([csv]);
                        var a = window.document.createElement("a");
                        a.href = window.URL.createObjectURL(blob);
                        a.download = "labs.csv";
                        document.body.appendChild(a);
                        a.click(); // IE: "Access is denied"; see: https://connect.microsoft.com/IE/feedback/details/797361/ie-10-treats-blob-url-as-cross-origin-and-denies-access
                        document.body.removeChild(a);
                      }
                    },
                    iconProps: {
                      iconName: "Edit",
                    },
                  },
 * 
 * **/
