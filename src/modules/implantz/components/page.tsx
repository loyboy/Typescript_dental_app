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
export class ImplantationPanel extends React.Component<{}, {}> {
  @observable selectedID: string = router.currentLocation.split("/")[1];

  @computed
  get canEdit() {
    return user.currentUser.canEditImplants;
  }


  render() {
    return (
      <div className="tc-pg p-15 p-l-10 p-r-10">
       </div>
    );
  }
}

/**
 * 
 *  <AsyncComponent
              key=""
              loader={async () => {
            /*    const ConsentsDetailsPanel = (
                  await import("./page.implantz")
                ).ImplantSheetPanel;
                return (
                  <ConsentsDetailsPanel
                  
                    selected={this.selectedIndex}
                  />
                );
              }}
              />
 */