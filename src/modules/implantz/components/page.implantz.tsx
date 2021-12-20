import { EditableListComponent } from "../../../common-components/editable-list/editable-list";
import {
  Col,
  getRandomTagType,
  Row,
  SectionComponent,
  TagInputComponent
} from "@common-components";
import { text, user } from "@core";
import { setting, implantz } from "@modules";
import { num } from "@utils";
import { computed } from "mobx";
import { observer } from "mobx-react";
import {
	DefaultButton,
  Label,
  TextField,
  Dropdown,
  IconButton
} from "office-ui-fabric-react";
import * as React from "react";
import { Implantation } from '../data';


const MedicationDiv = observer(
  ({ canEdit, implant ,index, title }) => (
    <>
   <Row gutter={12}>
      <Col sm={6}>
        <div className="appointment-input treatment">
        <TextField
              label={text(title[0])}
              value={implant.drugGroup[index].drug}
              onChange={(ev, name) => ( implant.drugGroup[index].drug = name! )}
              disabled={canEdit}
            />
        </div>
      </Col>

      <Col sm={6}>
        <div className="appointment-input units-number">
        <TextField
              label={text(title[1])}
              value={implant.drugGroup[index].dose}
              onChange={(ev, name) => ( implant.drugGroup[index].dose = name! )}
              disabled={canEdit}
            />
        </div>
      </Col>

      <Col sm={6}>
        <div className="appointment-input units-number">
        <TextField
              label={text(title[2])}
              type="number"
              value={implant.drugGroup[index].duration}
              onChange={(ev, name) => ( implant.drugGroup[index].duration = Number(name!) )}
              disabled={canEdit}
            />
        </div>
      </Col>

      <Col sm={4}>
        
        <div style={{ marginTop: '10px' }}>
          <IconButton
            className="delete-button"
            iconProps={{
              iconName: "delete",
            }}
            onClick={() => {
              implant.drugGroup.splice(index, 1);
            }}
          />
        </div>
      </Col>
      </Row>
    </>
  )
);

@observer
export class ImplantSheetPanel extends React.Component<{
  implant: Implantation;
}, {}> {

  @computed get canEdit() {
    return user.currentUser.canEditImplants;
  }

  componentDidMount(){
    if (this.props.implant){
      console.log("Implant is set")
    }
    else{
      console.log("Implants is undefined")
    }    
  }

  render() {
    return (
    
      <div>
      <SectionComponent title={text(`General Diagnosis`)}>

        <Label> {text(`Diagnosis`)} </Label>
        <br />               
        <Row gutter={12}>

                  <Col sm={6}>
                    <div className="appointment-input units-number">
                    <TextField
                          label={text('Bld Time ')}
                          name="diagnosis_lab_bldtime"
                          value={this.props.implant!.diagnosis_lab_bldtime}
                          onChange={(ev, val) =>
                            ( this.props.implant!.diagnosis_lab_bldtime = val! )
                          } 
                        
                          disabled={!this.canEdit}
                        />
                    </div>
                  </Col>

                  <Col sm={6}>
                    <div className="appointment-input units-number">
                    <TextField
                          label={text('I.N.R ')}
                          name="diagnosis_lab_inr"
                          value={ this.props.implant!.diagnosis_lab_inr }
                          onChange={(ev, val) =>
                            ( this.props.implant!.diagnosis_lab_inr = val! )
                          } 
                          disabled={!this.canEdit}
                        />
                    </div>
                  </Col>

                  <Col sm={6}>
                    <div className="appointment-input units-number">
                    <TextField
                          label={text('C.L.T Time ')}
                          name="diagnosis_lab_clt"
                          value={ this.props.implant!.diagnosis_lab_clt }
                          onChange={(ev, val) =>
                            ( this.props.implant!.diagnosis_lab_clt = val! )
                          } 
                          disabled={!this.canEdit}
                        />
                    </div>
                  </Col>

                  <Col sm={6}>
                    <div className="appointment-input units-number">
                    <TextField
                          label={text('PT ')}
                          name="diagnosis_lab_pt"
                          value={ this.props.implant!.diagnosis_lab_pt }
                          onChange={(ev, val) =>
                            ( this.props.implant!.diagnosis_lab_pt = val! )
                          } 
                          disabled={!this.canEdit}
                        />
                    </div>
                  </Col>

                  <Col sm={6}>
                    <div className="appointment-input units-number">
                    <TextField
                          label={text('PRTH Conc. ')}
                          name="diagnosis_lab_prth"
                          value={ this.props.implant!.diagnosis_lab_prth }
                          onChange={(ev, val) =>
                            ( this.props.implant!.diagnosis_lab_prth = val! )
                          }
                          disabled={!this.canEdit}
                        />
                    </div>
                  </Col>

                  <Col sm={6}>
                    <div className="appointment-input units-number">
                    <TextField
                          label={text('PTT sec ')}
                          name="diagnosis_lab_ptt"
                          value={ this.props.implant!.diagnosis_lab_ptt }
                          onChange={(ev, val) =>
                            ( this.props.implant!.diagnosis_lab_ptt = val! )
                          }
                          disabled={!this.canEdit}
                        />
                    </div>
                  </Col>

                  <Col sm={6}>
                    <div className="appointment-input units-number">
                    <TextField
                          label={text('PRTH Time sec ')}
                          name="diagnosis_lab_prth2"
                          value={ this.props.implant!.diagnosis_lab_prth2 }
                          onChange={(ev, val) =>
                            ( this.props.implant!.diagnosis_lab_prth2 = val! )
                          }
                          disabled={!this.canEdit}
                        />
                    </div>
                  </Col>

                  <Col sm={6}>
                    <div className="appointment-input units-number">
                    <TextField
                          label={text('ALK Php ')}
                          name="diagnosis_lab_alk"
                          value={ this.props.implant!.diagnosis_lab_alk }
                          onChange={(ev, val) =>
                            ( this.props.implant!.diagnosis_lab_alk = val! )
                          }
                          disabled={!this.canEdit}
                        />
                    </div>
                  </Col>   

        </Row>
        
 
                  <Row gutter={6}>
                    <Col sm={24}>
                      <div className="birth">
                        <TextField
                          style={{ width: '100px' }}
                          name="notes"
                          label={text("Notes ")} 
                          multiline={true}
                          value={ this.props.implant!.notes }
                          onChange={(ev, val) =>
                            ( this.props.implant!.notes = val! )
                          }                
                          rows={5}                 
                          disabled={!this.canEdit}
                        />
                      </div>
                    </Col>
                </Row> 

        <br />
        </SectionComponent>

        <SectionComponent title={text(`Medications`)}>

<Row gutter={6}>
    <Col sm={24} >

        {this.props.implant!.drugGroup &&
          this.props.implant!.drugGroup.map((item, i) => {
            if (i <= 0) {
              var title = ["Drug", "Dose", "Duration"];
              return (
                <MedicationDiv
                  key={i}
                  index={i}
                  implant={this.props.implant!}
                  canEdit={!this.canEdit}
                  title={title}
                />
              );
            } else {
              var title = ["", "", ""];
              return (
                <MedicationDiv
                key={i}
                index={i}
                implant={this.props.implant!}
                canEdit={!this.canEdit}
                title={title}
              />
              );
            }
          })}
    </Col>
  </Row>

  <Row gutter={6}> 
  <Col sm={24}>
    
  <DefaultButton
          text="Add More Medication"
          allowDisabledFocus
          onClick={(e) => {
            var ddoi = { drug: "", dose: "", duration: 0 };
            this.props.implant!.drugGroup.push(ddoi);
          }}
        />
    </Col>
  </Row>

</SectionComponent>


      <SectionComponent title={text(`Implanting`)}>

         <Row gutter={6}>
            <Col sm={12} style={{ display: 'inline' }}>
              <div className="birth">
              <Label> {text(`Technique`)} </Label>
         
              <TextField
                disabled={!this.canEdit}
               
                value={this.props.implant!.impl_technique}
                onChange={(ev, v) => {
                  this.props.implant!.impl_technique = v!;
                }}
                type="text"
              />
              </div>
            </Col>

            <Col sm={12} style={{ display: 'inline' }}>
              <div className="birth">
              <Label> {text(`Area`)} </Label>
         
              <TextField
                disabled={!this.canEdit}
               
                value={this.props.implant!.impl_area}
                onChange={(ev, v) => {
                  this.props.implant!.impl_area = v!;
                }}
                type="text"
              />
              </div>
            </Col>
          </Row>

          <br/>

          <Row gutter={6}>
            <Col sm={12} style={{ display: 'inline' }}>
              <div className="birth">
              <Label> {text(`Type`)} </Label>
         
              <Dropdown
                                options={["v1", "v2",  "v3",  "v4",  "v5"].map((x) => ({
                                  key: x,
                                  text: x,
                                }))}
                                selectedKey={this.props.implant!.impl_type}
                                onChange={(ev, val) => {
                                  if (val) {
                                    this.props.implant!.impl_type = val.text!;
                                  }
                                }} 
                  />
              </div>
            </Col>

            <Col sm={12} style={{ display: 'inline' }}>
              <div className="birth">
              <Label> {text(`Length (mm)`)} </Label>
         
              <TextField
                disabled={!this.canEdit}               
                value={this.props.implant!.impl_length}
                onChange={(ev, v) => {
                  this.props.implant!.impl_length = v!;
                }}
                type="number"
              />
              </div>
            </Col>
          </Row>

          <Row gutter={6}>
            <Col sm={12} style={{ display: 'inline' }}>
              <div className="birth">
              <Label> {text(`Diameter (mm)`)} </Label>
         
              <TextField
                disabled={!this.canEdit}
               
                value={this.props.implant!.impl_diameter}
                onChange={(ev, v) => {
                  this.props.implant!.impl_diameter = v!;
                }}
                type="text"
              />
              </div>
            </Col>

            <Col sm={12} style={{ display: 'inline' }}>
              <div className="birth">
              <Label> {text(`Bone graft`)} </Label>
         
                  <Dropdown
                                options={["None", "Allograft", "Xenograft", "Autograft"].map((x) => ({
                                  key: x,
                                  text: x,
                                }))}
                                selectedKey={this.props.implant!.impl_bonegraft}
                                onChange={(ev, val) => {
                                  if (val) {
                                    this.props.implant!.impl_bonegraft = val.text!;
                                  }
                                }} 
                  />
              </div>
            </Col>
          </Row>

          <Row gutter={6}>

            <Col sm={12} style={{ display: 'inline' }}>
              <div className="birth">
              <Label> {text(`Bone graft Quantity`)} </Label>
         
              <TextField
                disabled={!this.canEdit}
               
                value={this.props.implant!.impl_bonegraftq}
                onChange={(ev, v) => {
                  this.props.implant!.impl_bonegraftq = v!;
                }}
                type="number"
              />

              </div>
            </Col>
          </Row>

          <Row gutter={6}>
            <Col sm={24} style={{ display: 'inline' }}>
              <div className="birth">
              <Label> {text(`BOne Graft Form`)} </Label>
         
              <Dropdown
                                options={["Powder", "Block"].map((x) => ({
                                  key: x,
                                  text: x,
                                }))}
                                selectedKey={this.props.implant!.impl_form}
                                onChange={(ev, val) => {
                                  if (val) {
                                    this.props.implant!.impl_form = val.text!;
                                  }
                                }} 
              />
              </div>
            </Col>

          </Row>

          <Row gutter={6}>
            <Col sm={12} style={{ display: 'inline' }}>
              <div className="birth">
              <Label> {text(`Membrane Type`)} </Label>
         
              <TextField
                disabled={!this.canEdit}               
                value={this.props.implant!.impl_membrane}
                onChange={(ev, v) => {
                  this.props.implant!.impl_membrane = v!;
                }}
                type="text"
              />

              </div>
            </Col>         
          </Row>

          <Row gutter={6}>
            <Col sm={24} style={{ display: 'inline' }}>
              <div className="birth">
              <Label> {text(`Notes`)} </Label>
         
              <TextField
                disabled={!this.canEdit}               
                value={this.props.implant!.impl_notes}
                style={{ width: '300px' }}
                onChange={(ev, v) => {
                  this.props.implant!.impl_notes = v!;
                }}
                type="text"
                multiline={true}
                rows={5}
              />

              </div>
            </Col>         
          </Row>
      
      </SectionComponent>

      <SectionComponent title={text(`Prosthetics`)}>

         <Row gutter={6}>
            <Col sm={12} style={{ display: 'inline' }}>
              <div className="birth">
                <Label> {text(`Abutment Type`)} </Label>
          
                <TextField
                  disabled={!this.canEdit}               
                  value={this.props.implant!.pros_abutment}
                  onChange={(ev, v) => {
                    this.props.implant!.pros_abutment = v!;
                  }}
                  type="text"
                />
              </div>
            </Col>         
          </Row>

          <Row gutter={6}>
            <Col sm={12} style={{ display: 'inline' }}>
              <div className="birth">
                <Label> {text(`Height (mm)`)} </Label>
          
                <TextField
                  disabled={!this.canEdit}               
                  value={this.props.implant!.pros_height}
                  onChange={(ev, v) => {
                    this.props.implant!.pros_height = v!;
                  }}
                  type="number"
                />
              </div>
            </Col> 

             <Col sm={12} style={{ display: 'inline' }}>
              <div className="birth">
                <Label> {text(`Diameter (mm)`)} </Label>
          
                <TextField
                  disabled={!this.canEdit}               
                  value={this.props.implant!.pros_weight}
                  onChange={(ev, v) => {
                    this.props.implant!.pros_weight = v!;
                  }}
                  type="number"
                />
              </div>
            </Col> 

          </Row>

          <Row gutter={6}>
            <Col sm={12} style={{ display: 'inline' }}>
              <div className="birth">
                <Label> {text(`Angulation`)} </Label>
          
                <Dropdown
                                options={["straight", "angled"].map((x) => ({
                                  key: x,
                                  text: x,
                                }))}
                                selectedKey={this.props.implant!.pros_angulation}
                                onChange={(ev, val) => {
                                  if (val) {
                                    this.props.implant!.pros_angulation = val.text!;
                                  }
                                }} 
                  />

              </div>
            </Col> 

             <Col sm={12} style={{ display: 'inline' }}>
              <div className="birth">
                <Label> {text(`Crown`)} </Label>
          
                <Dropdown
                                options={["scraw retained", "cement retained"].map((x) => ({
                                  key: x,
                                  text: x,
                                }))}
                                selectedKey={this.props.implant!.pros_crown}
                                onChange={(ev, val) => {
                                  if (val) {
                                    this.props.implant!.pros_crown = val.text!;
                                  }
                                }} 
                  />

              </div>
            </Col> 

          </Row>

          <Row gutter={6}>
            <Col sm={12} style={{ display: 'inline' }}>
              <div className="birth">
                <Label> {text(`Crown Type`)} </Label>
          
                <Dropdown
                                options={["PFM", "ZIrcon", "E-Max", "All Ceramic"].map((x) => ({
                                  key: x,
                                  text: x,
                                }))}
                                selectedKey={this.props.implant!.pros_crowntype}
                                onChange={(ev, val) => {
                                  if (val) {
                                    this.props.implant!.pros_crowntype = val.text!;
                                  }
                                }} 
                  />

              </div>
            </Col> 

             <Col sm={12} style={{ display: 'inline' }}>
              <div className="birth">
                <Label> {text(`Shade`)} </Label>
          
                <TextField
                  disabled={!this.canEdit}               
                  value={this.props.implant!.pros_shade}
                  onChange={(ev, v) => {
                    this.props.implant!.pros_shade = v!;
                  }}
                  type="text"
                />

              </div>
            </Col> 

          </Row>

          <Row gutter={6}>
            <Col sm={24}>
              <div className="birth">
             
                <TextField
                  label={text("Notes")}
                  multiline={true}
                  value={this.props.implant!.pros_notes}
                  onChange={(ev, val) =>
                    ( this.props.implant!.pros_notes = val! )
                  }                  
                  rows={5}                 
                  disabled={!this.canEdit}
                />
              </div>
            </Col>
          </Row>

        </SectionComponent>

      <SectionComponent title={text(`Problems`)}>

          <Row gutter={6}>       

            <Col sm={24}>
              <div className="birth">             
              <TextField
                  label={text("Notes")}
                  multiline={true}
                 
                  value={this.props.implant!.problems_others}
                  onChange={(ev, val) =>
                    ( this.props.implant!.problems_others = val! )
                  }                  
                  rows={5}                 
                  disabled={!this.canEdit}
                />
              </div>
            </Col>

          </Row>

        </SectionComponent>
      


     
      </div>
               
    );
  }
}


/***
 * 
 * 
 * 
 */

