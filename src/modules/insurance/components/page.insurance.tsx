import {
  Col,
  DataTableComponent,
  ProfileSquaredComponent,
  Row,
  SectionComponent,
  TagComponent,
  TagType
} from "@common-components";
import { router, text, user } from "@core";
import { insurances, Insurance, statistics } from "@modules";
import { num } from "@utils";
import { computed, observable } from "mobx";
import { observer } from "mobx-react";
import {
  IconButton,
  Panel,
  PanelType,
  TextField
} from "office-ui-fabric-react";
import * as React from "react";

@observer
export class Insurances extends React.Component<{}, {}> {
  @observable selectedID: string = router.currentLocation.split("/")[1];

  @computed
  get canEdit() {
    return user.currentUser.canEditInsurance;
  }

  @computed
  get selectedIndex() {
    return insurances.list.findIndex(x => x._id === this.selectedID);
  }

  @computed
  get selectedInsurance() {
    return insurances.list[this.selectedIndex];
  }

  render() {
    return (
      <div className="tc-pg p-15 p-l-10 p-r-10">
        <DataTableComponent
          onDelete={
            this.canEdit
              ? id => {
                  insurances.deleteModal(id);
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
                      const insurance = new Insurance();
                      insurances.list.push(insurance);
                      this.selectedID = insurance._id;
                    },
                    iconProps: {
                      iconName: "Add"
                    }
                  }
                ]
              : []
          }
          heads={[text("Name"), text("Discount(%)"), text("Other Information")]}
          rows={insurances.list.map(insurance => {
            return {
              id: insurance._id,
              searchableString: insurance.searchableString,
              cells: [
                {
                  dataValue: insurance.name,
                  component: <ProfileSquaredComponent text={insurance.name} />,
                  onClick: () => {
                    this.selectedID = insurance._id;
                  },
                  className: "no-label"
                },
                {
                  dataValue: insurance.discount,
                  component: <p>{insurance.discount}</p>,
                  className: "hidden-xs"
                },
                {
                  dataValue: insurance.information,
                  component: <span>{insurance.information}</span>,
                  className: "hidden-xs"
                },
                {
                  dataValue: insurance._id,
                  component: <IconButton iconProps={{ iconName: "Edit" }} />,
                  onClick: () => {
                    this.selectedID = insurance._id;
                  },
                  className: "no-label"
                }
              ]
            };
          })}
          maxItemsOnLoad={20}
        />
       

        {this.selectedInsurance ? (
          <Panel
            isOpen={!!this.selectedInsurance}
            type={PanelType.medium}
            closeButtonAriaLabel="Close"
            isLightDismiss={true}
            onDismiss={() => {
              this.selectedID = "";
            }}
            onRenderNavigation={() => (
              <Row className="panel-heading">
                <Col span={20}>
                  {this.selectedInsurance ? (
                    <ProfileSquaredComponent
                      text={this.selectedInsurance.name}
                      subText={`${text("Discount")}: ${
                        this.selectedInsurance.discount
                      }%`}
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
            <div className="treatment-editor">
              <SectionComponent title={text("Insurance Details")}>
                <div className="treatment-input">
                  <TextField
                    label={text("Name")}
                    value={this.selectedInsurance.name}
                    onChange={(ev, val) =>
                      (insurances.list[this.selectedIndex].name = val!)
                    }
                    disabled={!this.canEdit}
                  />
                  <TextField
                    label={text("Discount")}
                    type="number"
                    value={this.selectedInsurance.discount.toString()}
                    onChange={(ev, val) =>
                      (insurances.list[this.selectedIndex].discount = num(val!))
                    }
                    prefix={"%"}
                    disabled={!this.canEdit}
                  />
                </div>
              </SectionComponent>
              <SectionComponent title={text("Other Information")}>
                <TextField
                  multiline
                  disabled={!this.canEdit}
                  label={text("Details")}
                  value={this.selectedInsurance.information}
                  onChange={(e, value) => {
                    insurances.list[this.selectedIndex].information = value;
                  }}
                />
              </SectionComponent>
            </div>
          </Panel>
        ) : (
          ""
        )}
      </div>
    );
  }
}
