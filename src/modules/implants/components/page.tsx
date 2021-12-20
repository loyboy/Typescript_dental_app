import * as React from "react";
import { computed, observable } from "mobx";
import { observer } from "mobx-react";
import { router, text, user } from "@core";
import {
  Col,
  DataTableComponent,
  ProfileSquaredComponent,
  Row,
  SectionComponent,
  AsyncComponent,
} from "@common-components";
import { appointments, setting, Consent, consents } from "@modules";
import {
  IconButton,
  Panel,
  PanelType,
  TextField,
  Dropdown,
} from "office-ui-fabric-react";

@observer
export class Consents extends React.Component<{}, {}> {
  @observable selectedID: string = router.currentLocation.split("/")[1];

  @computed
  get canEdit() {
    return user.currentUser.canEditTreatments;
  }

  @computed
  get selectedIndex() {
    return consents.list.findIndex((x) => x._id === this.selectedID);
  }

  @computed
  get selectedConsent() {
    return consents.list[this.selectedIndex];
  }

  render() {
    return (
      <div className="tc-pg p-15 p-l-10 p-r-10">
        <DataTableComponent
          onDelete={
            this.canEdit
              ? (id) => {
                  consents.deleteModal(id);
                }
              : undefined
          }
          commands={
            this.canEdit
              ? [
                  {
                    key: "addNew",
                    title: "Add new",
                    name: text("Add new"),
                    onClick: () => {
                      const c = new Consent();
                      consents.list.push(c);
                      this.selectedID = c._id;
                    },
                    iconProps: {
                      iconName: "Add",
                    },
                  },
                ]
              : []
          }
          heads={[text("Consent ID"), text("Title")]}
          rows={consents.list.map((consent) => {
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
              id: consent._id,
              searchableString: consent.title,
              cells: [
                {
                  dataValue: consent._id,
                  component: (
                    <span>
                      <b> #{consent._id} </b>
                    </span>
                  ),
                  onClick: () => {
                    this.selectedID = consent._id;
                  },
                  className: "no-label",
                },
                {
                  dataValue: consent._id,
                  component: (
                    <span>
                      {consent.title ? consent.title : ""}
                      {/* {  consent.title  ? JSON.parse( consent.title ).blocks[0].text : "" } */}
                    </span>
                  ),
                  className: "hidden-xs",
                },
                {
                  dataValue: consent._id,
                  component: <IconButton iconProps={{ iconName: "Edit" }} />,
                  onClick: () => {
                    this.selectedID = consent._id;
                  },
                  className: "no-label",
                },
              ],
            };
          })}
          maxItemsOnLoad={20}
        />

        {this.selectedConsent ? (
          <Panel
            isOpen={!!this.selectedConsent}
            type={PanelType.medium}
            closeButtonAriaLabel="Close"
            isLightDismiss={true}
            onDismiss={() => {
              this.selectedID = "";
            }}
            onRenderNavigation={() => (
              <Row className="panel-heading">
                <Col span={20}></Col>
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
                const ConsentsDetailsPanel = (
                  await import("./implants-details")
                ).ConsentsDetailsPanel;
                return (
                  <ConsentsDetailsPanel
                    consent={this.selectedConsent!}
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
