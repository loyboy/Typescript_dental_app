import * as React from "react";
import {
    Col,
    getRandomTagType,
    Row,
    SectionComponent,
    TagInputComponent
} from "@common-components";
import {EditableListComponent} from 'common-components/editable-list/editable-list';
import {text} from '@core';
import {observer} from "mobx-react";
import {TextField, DefaultButton, IconButton} from 'office-ui-fabric-react';

const MedicationDiv = observer(({medication, index}) => (
    <>
        <Row className={'illness pcenter'}
            gutter={6}>
            <Col sm={6}>
                <TextField value={
                        medication[index].drug
                    }
                    onChange={
                        (ev, drug) => {

                            medication[index].drug = drug;

                        }
                    }
                    type="text"/>
            </Col>
        <Col sm={6}>
            <TextField value={
                    medication[index].dose
                }
                onChange={
                    (ev, dose) => medication[index].dose = dose
                }
                type="text"/>
        </Col>
        <Col sm={6}>
            <TextField value={
                    medication[index].duration
                }
                onChange={
                    (ev, duration) => medication[index].duration = duration
                }
                type="text"
                // disabled={!this.canEdit}
            />
        </Col>
        <Col sm={4}>
            <div className="appointment-input units-number">
                <IconButton className="delete-button"
                    iconProps={
                        {iconName: "delete"}
                    }
                    onClick={
                        () => {
                            medication.splice(index, 1);
                        }
                    }/>
            </div>
    </Col>
</Row>

</>

));

export class PatientMedicalHistory extends React.Component < {
    patient : any
}, {drug: string,
    dose: string,
    duration: string
} > {

    constructor(props : Readonly < {
        patient: any
    } >) {
        super(props);
        this.state = {
            drug: '',
            dose: '',
            duration: ''
        }
    }

    addMoreDrug = () => { 
        this.props.patient.medicationsDetails.push({drug: '', dose: '', duration: ''});
    }

    getDisableStatus = () => {
        if (this.state.drug !== '' && this.state.dose !== '' && this.state.duration !== '') {
            return false
        }
        return true;
    }

    render() {
        return <React.Fragment>
            <div className="spd-pn">
                <SectionComponent title={'Systemic Condition'}>
                    <div className="medical-history illness">
                        <p>Illness</p>
                        <EditableListComponent label={
                                text("")
                            }
                            value={
                                this.props.patient.IllnessRecord
                            }
                            onChange={
                                (newVal) => {
                                    this.props.patient.IllnessRecord = newVal;
                                }
                            }
                            style={
                                {marginTop: "0"}
                            }/>
                        <p>Diabetic Record</p>
                        <TextField value={
                                this.props.patient.diabeticRecord
                            }
                            onChange={
                                (ev, diabeticRecord) => (this.props.patient.diabeticRecord = diabeticRecord!)
                            }
                            type="number"
                            // disabled={!this.canEdit}
                        />
                        <p>Blood Pressure Record</p>
                        <TextField value={
                                this.props.patient.bloodPressureRecord
                            }
                            onChange={
                                (ev, bloodPressureRecord) => (this.props.patient.bloodPressureRecord = bloodPressureRecord!)
                            }
                            type="number"
                            // disabled={!this.canEdit}
                        />
                        <p>INR Record</p>
                        <TextField value={
                                this.props.patient.inrRecord
                            }
                            onChange={
                                (ev, inrRecord) => (this.props.patient.inrRecord = inrRecord!)
                            }
                            type="number"
                            // disabled={!this.canEdit}
                        />
                        <p>Bleeding Time Record</p>
                        <TextField value={
                                this.props.patient.bleedingTimeRecord
                            }
                            onChange={
                                (ev, bleedingTimeRecord) => (this.props.patient.bleedingTimeRecord = bleedingTimeRecord!)
                            }
                            type="number"
                            // disabled={!this.canEdit}
                        />
                        <p>PTT Record</p>
                        <TextField value={
                                this.props.patient.pptRecord
                            }
                            onChange={
                                (ev, pptRecord) => (this.props.patient.pptRecord = pptRecord!)
                            }
                            type="number"
                            // disabled={!this.canEdit}
                        />
                        <p>PT Record</p>
                        <TextField value={
                                this.props.patient.ptRecord
                            }
                            onChange={
                                (ev, ptRecord) => (this.props.patient.ptRecord = ptRecord!)
                            }
                            type="number"
                            // disabled={!this.canEdit}
                        />
                        <p>Other Clinic OR Lab Records</p>
                        <EditableListComponent label={
                                text("")
                            }
                            value={
                                this.props.patient.otherLabRecords
                            }
                            onChange={
                                (newVal) => {
                                    this.props.patient.otherLabRecords = newVal;
                                }
                            }
                            style={
                                {marginTop: "0"}
                            }/> {/* <p>Concern</p>
                        <EditableListComponent
                            label={text("")}
                            value={this.props.patient.Concern}
                            onChange={(newVal) => {
                                this.props.patient.Concern = newVal;
                            }}
                            style={{ marginTop: "0" }}
                        />
                        <p>Notes</p>
                        <EditableListComponent
                            label={text("")}
                            value={this.props.patient.Notes}
                            onChange={(newVal) => {
                                this.props.patient.Notes = newVal;
                            }}
                            style={{ marginTop: "0" }}
                        /> */} </div>
                </SectionComponent>

                <SectionComponent title={'Medications'}>
                    <Row className={'illness pcenter'}
                        gutter={6}>
                        <Col sm={6}>
                            <p>Drug</p>
                        </Col>
                        <Col sm={6}>
                            <p>Dose</p>
                        </Col>
                        <Col sm={6}>
                            <p>Duration</p>
                        </Col>

                    </Row>
                    {
                    this.props.patient && this.props.patient.medicationsDetails.map((obj, i) => {
                        return (
                            <MedicationDiv index={i}
                                medication={
                                    this.props.patient.medicationsDetails !
                                }/>
                        );
                    })
                }
                    {/* <Row className={'illness pcenter'} gutter={6}>
                        <Col sm={8}>
                            <TextField
                                value={this.state.drug}
                                onChange={(ev, drug) => this.setState({ drug })}
                                type="text"
                            // disabled={!this.canEdit}
                            />
                        </Col>
                        <Col sm={8}>
                            <TextField
                                value={this.state.dose}
                                onChange={(ev, dose) => this.setState({ dose })}
                                type="text"
                            // disabled={!this.canEdit}
                            />
                        </Col>
                        <Col sm={8}>
                            <TextField
                                value={this.state.duration}
                                onChange={(ev, duration) => this.setState({ duration })}
                                type="text"
                            // disabled={!this.canEdit}
                            />
                        </Col>
                </Row>*/}
                    <Row gutter={6}>
                        <Col sm={8}></Col>
                        <Col sm={8}>
                            <DefaultButton text="Add More Drug"
                                disabled={false}
                                onClick={
                                    () => this.addMoreDrug()
                                }/>
                        </Col>
                        <Col sm={8}></Col>
                    </Row>
                </SectionComponent>


                <SectionComponent title={'Others'}>
                    <div className="medical-history illness">
                        <p>Concern</p>
                        <EditableListComponent label={
                                text("")
                            }
                            value={
                                this.props.patient.Concern
                            }
                            onChange={
                                (newVal) => {
                                    this.props.patient.Concern = newVal;
                                }
                            }
                            style={
                                {marginTop: "0"}
                            }/>
                        <p>Notes</p>
                        <TextField label={''}
                            value={
                                this.props.patient.medicalNote
                            }
                            multiline
                            autoAdjustHeight
                            onChange={
                                (ev, medicalNote) => (this.props.patient.medicalNote = medicalNote!)
                            }/> {/* <EditableListComponent
                            label={text("Notes")}
                            value={this.props.patient.medicalHistory}
                            onChange={(newVal) => {
                                this.props.patient.medicalHistory = newVal;
                            }}
                            style={{ marginTop: "0" }}
                        /> */} </div>
                </SectionComponent>


            </div>
        </React.Fragment>
    }

}
