import { EditableListComponent } from "../../../common-components/editable-list/editable-list";
import { Col, getRandomTagType, Row, SectionComponent, TagInputComponent } from "@common-components";
import { text, user } from "@core";
import { setting, Treatment, treatments } from "@modules";
import { num } from "@utils";
import { computed } from "mobx";
import { observer } from "mobx-react";
import { Dropdown, TextField } from "office-ui-fabric-react";
import * as React from "react";

@observer
export class TreatmentDetailsPanel extends React.Component<{
	treat: Treatment; selected: number;
}> {
	@computed get canEdit() {
		return user.currentUser.canEditPatients;
	}

	render() {
		return (
            <div className="treatment-editor">
            <SectionComponent title={text("Lab Order Details")}>
                <div className="treatment-input">

                    <TextField
                        label={text("Lab Order item")}
                        value={this.props.treat.item}
                        onChange={(ev, val) =>
                            (treatments.list[
                                this.props.selected
                            ].item = val!)
                        }
                        disabled={!this.canEdit}
                    />

                    <TextField
                        label={text(
                            "Lab Order Description"
                        )}
                        type="text"
                        value={this.props.treat.desc}
                        onChange={(ev, val) =>
                            (treatments.list[
                                this.props.selected
                            ].desc = val!)
                        }
                        disabled={!this.canEdit}
                    />

                    <TextField
                        label={text(
                            "Lab Order lab name"
                        )}
                        type="text"
                        value={this.props.treat.lab_name}
                        onChange={(ev, val) =>
                            (treatments.list[
                                this.props.selected
                            ].lab_name = val!)
                        }
                        disabled={!this.canEdit}
                    />

                    

                    <TextField
                        label={text(
                            "Lab Order Patient"
                        )}
                        type="text"
                        value={this.props.treat.patient_name}
                        onChange={(ev, val) =>
                            (treatments.list[
                               this.props.selected
                            ].patient_name = val!)
                        }
                        disabled={!this.canEdit}
                    />

                    <TextField
                        label={text(
                            "Lab Order fees"
                        )}
                        type="number"
                        value={this.props.treat.fees}
                        onChange={(ev, val) =>
                            (treatments.list[
                               this.props.selected
                            ].fees = val!.toString())
                        }
                        prefix={setting.getSetting(
                            "currencySymbol"
                        )}
                        disabled={!this.canEdit}
                    />
                        <Dropdown
                            disabled={!this.canEdit}
                            placeholder={text("Status")}
                            options={[{ key: "delivered", text: "delivered" },{
                        key: "delayed", text: "delayed"}, {key: "inprocessing", text: "inprocessing"}]}
                            defaultSelectedKey={this.props.treat.status}
                            onChange={(ev, has: any) => {
                                treatments.list[
                                   this.props.selected
                                ].status = has.key!
                            }}
                        />
                </div>
            </SectionComponent>
        </div>
		);
	}
}
