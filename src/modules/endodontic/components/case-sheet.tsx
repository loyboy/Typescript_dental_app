import {
  SectionComponent,
  TagInputComponent,
  Col,
  Row,
} from "@common-components";
import { text, user } from "@core";
import { Access, Obturation, Cleaning, EndoCase } from "@modules";
import { num } from "@utils";
import { EditableListComponent } from "common-components/editable-list/editable-list";
import { computed } from "mobx";
import { observer } from "mobx-react";
import {
  ConstrainMode,
  DetailsList,
  Dropdown,
  MessageBar,
  MessageBarType,
  SelectionMode,
  TextField,
  Label,
  DefaultButton,
  IconButton,
} from "office-ui-fabric-react";
import * as React from "react";

const EndoDiv = observer(({ canEdit, orthoCase, index }) => (
  <>
    <div style={{ display: "flex", width: "100%" }}>
      <span style={{ width: "80%" }}>
        <TextField
          disabled={canEdit}
          min={0}
          max={180}
          value={orthoCase.workinglen[index].toString()}
          onChange={(ev, v) => {
            orthoCase.workinglen[index] = v!;
          }}
          type="text"
          prefix={text(`Working Length of Canal ${index + 1} `)}
        />
      </span>

      <span style={{ width: "20%" }}>
        <div className="">
          <IconButton
            className="delete-button"
            iconProps={{
              iconName: "delete",
            }}
            onClick={() => {
              orthoCase.workinglen.splice(index, 1);
            }}
          />
        </div>
      </span>
    </div>
  </>
));

@observer
export class EndoCaseSheetPanel extends React.Component<{
  orthoCase: EndoCase;
}> {
  @computed get canEdit() {
    return user.currentUser.canEditOrtho;
  }

  render() {
    return (
      <div>
        <SectionComponent title={text(`Features`)}>
          <Label> {text(`Access`)} </Label>
          <Dropdown
            disabled={!this.canEdit}
            placeholder={text("Access")}
            options={Object.keys(Access).map((x) => ({
              key: x,
              text: text((Access as any)[x]),
            }))}
            defaultSelectedKey={this.props.orthoCase.access}
            onChange={(ev, has: any) => {
              this.props.orthoCase.access = has.key;

              console.log( " Access has changes: " + this.props.orthoCase.access);
            }}
            prefix={text(`Access`)}
          />
          <br />
          <Label> {text(`Cleaning and Shaping`)} </Label>
          <Dropdown
            disabled={!this.canEdit}
            placeholder={text("Cleaning / Shaping")}
            options={Object.keys(Cleaning).map((x) => ({
              key: x,
              text: text((Cleaning as any)[x]),
            }))}
            defaultSelectedKey={this.props.orthoCase.cleaning}
            onChange={(ev, has: any) => {
              this.props.orthoCase.cleaning = has.key;
            }}
            prefix={text(`Cleaning and Shaping`)}
          />

          <br />
          <Label> {text(`Obturbation`)} </Label>
          <Dropdown
            disabled={!this.canEdit}
            placeholder={text("Obturbation")}
            options={Object.keys(Obturation).map((x) => ({
              key: x,
              text: text((Obturation as any)[x]),
            }))}
            defaultSelectedKey={this.props.orthoCase.obturation}
            onChange={(ev, has: any) => {
              this.props.orthoCase.obturation = has.key;
            }}
            prefix={text(`Obturbation`)}
          />
          <br />

          <TextField
            disabled={!this.canEdit}
            min={0}
            max={180}
            value={this.props.orthoCase.canals.toString()}
            onChange={(ev, v) => {
              this.props.orthoCase.canals = num(v!);
            }}
            type="number"
            prefix={text(`Number of Canals`)}
          />

          <DefaultButton
            text="Add New Working Length"
            allowDisabledFocus
            onClick={(e) => {
              this.props.orthoCase.workinglen.push("");
            }}
          />
          <br />

          {this.props.orthoCase.workinglen &&
            this.props.orthoCase.workinglen.map((item, i) => {
              return (
                <EndoDiv
                  key={i}
                  index={i}
                  orthoCase={this.props.orthoCase}
                  canEdit={!this.canEdit}
                />
              );
            })}
        </SectionComponent>

        <SectionComponent title={text(`Problems`)}>
          <EditableListComponent
            disabled={!this.canEdit}
            label={text("Patient concerns")}
            
            value={this.props.orthoCase.problemsList}
            onChange={(v) => {
              this.props.orthoCase.problemsList = v;
              console.log("Problem list changed: "+ v)
            }}
          />
          <br />
          <br />

          <h3>{text("Other Problems")}</h3>
          <TextField
            label=""
            value={this.props.orthoCase.problemsOther}
            onChange={(ev, v) => {
              this.props.orthoCase.problemsOther = v;
            }}
            multiline
            rows={5}
          />
        </SectionComponent>
      </div>
    );
  }
}
