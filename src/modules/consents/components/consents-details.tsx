import { EditableListComponent } from "../../../common-components/editable-list/editable-list";
import {
  Col,
  getRandomTagType,
  Row,
  SectionComponent,
  TagInputComponent,
} from "@common-components";
import { text, user } from "@core";
import { setting, Consent, treatments } from "@modules";
import { num } from "@utils";
import { computed } from "mobx";
import { observer } from "mobx-react";
import { Dropdown, TextField } from "office-ui-fabric-react";
import { Editor } from "react-draft-wysiwyg";
import { EditorState, convertToRaw, convertFromRaw } from "draft-js";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

import * as React from "react";

@observer
export class ConsentsDetailsPanel extends React.Component<
  {
    consent: Consent;
    selected: number;
  },
  { editorState: any }
> {
  @computed get canEdit() {
    return user.currentUser.canEditPatients;
  }

  constructor(props: { consent: Consent; selected: number }) {
    super(props);
    this.state = {
      editorState:
        this.props.consent.notes === ""
          ? EditorState.createEmpty()
          : EditorState.createWithContent(
              convertFromRaw(JSON.parse(this.props.consent.notes))
            ),
    };
  }

  private onEditorStateChange = (editorState: EditorState): void => {
    this.setState({
      editorState,
    });
    this.props.consent.notes = JSON.stringify(
      convertToRaw(editorState.getCurrentContent())
    );
  };

  render() {
    return (
      <div className="treatment-editor">
        <SectionComponent title={text("Consent")}>
          <div className="treatment-input">
            <TextField
              label={text("Consent Title")}
              value={this.props.consent.title}
              onChange={(ev, val) => {
                this.props.consent.title = val!;
              }}
              disabled={!this.canEdit}
            />

            <label>Consent Notes</label>

            <Editor
              editorStyle={{ height: 500 }}
              editorState={this.state.editorState}
              toolbarClassName="toolbarClassName"
              wrapperClassName="wrapperClassName"
              editorClassName="editorClassName"
              onEditorStateChange={this.onEditorStateChange}
            />
          </div>
        </SectionComponent>
      </div>
    );
  }
}
