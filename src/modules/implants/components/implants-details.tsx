import { EditableListComponent } from "../../../common-components/editable-list/editable-list";
import {
  Col,
  getRandomTagType,
  Row,
  SectionComponent,
  TagInputComponent,
} from "@common-components";
import { text, user } from "@core";
import { setting, implants } from "@modules";
import { num } from "@utils";
import { computed } from "mobx";
import { observer } from "mobx-react";
import {
	DefaultButton,
  Label,
  TextField	,
  Dropdown,
  IconButton
  } from "office-ui-fabric-react";
  
import * as React from "react";
import { Implant } from '../data';
import { Insurance } from "modules/insurance";


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
  implant: Insurance;
}, {}> {
  state = {
    diagnosis_lab_bldtime: "",
    diagnosis_lab_inr: "",
    diagnosis_lab_clt: "",
    diagnosis_lab_pt: "",
    diagnosis_lab_prth: "",
    diagnosis_lab_ptt: "",
    diagnosis_lab_prth2:"",
    diagnosis_lab_alk:"",
    notes:""
  }

  /*constructor(props: any) {
    super(props);
    this.state = {
      selectedTeeth: [],
      statusDoneTeeth: [],
      checkprocedure:false,
      selectAllchecked:false
    };
  }*/

  @computed get canEdit() {
    return user.currentUser.canEditImplants;
  }

  onChange = (e: any) => {
    this.setState({
      [e.target.name]: e.target.value
    });
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
                          value={this.props.implant!.}
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

                <br />

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

          </SectionComponent>

      </div>
               
    );
  }
}

