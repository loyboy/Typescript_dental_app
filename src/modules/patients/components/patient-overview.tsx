import * as React from "react";
import { Col, Row } from "@common-components";
import { router, text, user } from "@core";
import { formatDate } from "@utils";
import { computed, observable } from "mobx";
import { observer } from "mobx-react";
import { Patient, appointments, prescriptions, treatments} from '@modules'
import { setting } from 'modules/settings';
import { Gender } from '../data';

@observer
export class PatientOverview extends React.Component<{
    patient: Patient
}, {}> {

    constructor(props: Readonly<{patient: Patient}>) {
        super(props);
        this.state = {}
    }

    @observable showMenu: boolean = true;

    @observable selectedID: string = router.currentLocation.split("/")[1];

    @computed
    get selectedIndex() {
        return prescriptions.list.findIndex(x => x._id === this.selectedID);
    }

    @computed get canEdit() {
        return user.currentUser.canEditPrescriptions;
    }

    @computed
    get patientprescriptions() {
        return appointments.list.filter(
            (p) => p.patient._id === this.props.patient._id
        ).map((appoint) => {
            return appoint.prescriptions
        });
    }

    get patienttreatments() {
        return appointments.list.filter(
            (p) => p.patient._id === this.props.patient._id
        ).map((appoint) => {
            return appoint.prescriptions
        });
    }

    @computed
    get selectedPrescription() {
        return prescriptions.list[this.selectedIndex];
    }

    addPrescriptionDetail(value: string, id: string) {
        return this.patientprescriptions.map(prescription => {
            if (prescription.length === 0) {
                return prescription.push({
                    id: id,
                    prescription: value
                })
            }
            return prescription.map(prescript => {
                if (prescript.id === id) {
                    return {
                        id: id,
                        prescription: value
                    }
                } else {
                    return {
                        id: id,
                        prescription: value
                    }
                }
            })
        })
    }

    getProceduresList = () => {
        return this.props.patient.procedures
            .filter(procedure => this.props.patient._id === procedure.patientID)
    }

    getPatientApponitmentList = () => {
        return appointments.list
        .filter(appointment => this.props.patient._id === appointment.patientID)
    }

    getPrescriptionDetail(id: string) {
        return prescriptions.list[35];
    }

    getTreatmentDetail(id: string) {
        return treatments.list.find(
            (p) => p._id === id
        )
    }

    calculateNumberPatientVisits(patient: String, status: String) {
        return appointments.list
            .filter((item, i) => item.patientID === patient && item.status === status).length
    }

    
    getPrescriptionList = () => {
        return this.props.patient.appointments
        .map(appointment => {
            return appointment.prescriptions.map(prescription => (
                <tr>
                    <td>{formatDate(appointment.date, "date-format")}</td>
                    <td>{prescription.prescription.slice(1, prescription.prescription.length)}</td>
                </tr>
            ))
        }) 
    }

    getLabOrders = () => {
        return this.props.patient.appointments
        .map(appointment => {
            return appointment.treatUnitGroup.map(treatment => {
                const treatmentArr = treatment.treatment.split("|") || ["-", "-"]
               return <tr>
                    <td>{treatmentArr[1]}</td>
                    <td>{appointment.status}</td>
                    <td>{formatDate(appointment.date, "date-format")}</td>
                </tr>
            })
        }) 
    }

    renderContactInformation = () => (
        <table className="ms-table">
            <thead>
                <tr>
                    <th colSpan={3}>
                        <h5> <b> {text("Contact Information")}  </b> </h5>
                    </th>
                </tr>
            </thead>
            <tbody>
                <tr> <td> Email </td> <td> {this.props.patient.email} </td>  </tr>
                <tr> <td> Mobile </td> <td> {this.props.patient.phone} </td> </tr>
                <tr> <td> Whatsapp </td> <td> {this.props.patient.whatsapphone} </td>  </tr>
            </tbody>
        </table>
    )

    render() {
        return <>
            <div className="payment">
                <Row gutter={24}>

                    {/* Contact Information */}
                    <Col md={8}>{this.renderContactInformation()}</Col>

                    <Col md={16}>
                        <table className="ms-table">
                            <thead>
                                <tr>
                                    <th> <h5> <b> {text("Visits")}  </b></h5></th>
                                    <th style={{textAlign:"center"}}>
                                    <h5>{Number(this.calculateNumberPatientVisits(this.props.patient._id, "Completed")|| 0)+
                                    Number(this.calculateNumberPatientVisits(this.props.patient._id, "Missed")|| 0)+
                                    Number(this.calculateNumberPatientVisits(this.props.patient._id, "Cancelled")||0)}</h5>
                                    </th>
                                    <th></th>
                                </tr>
                            </thead>

                            <tbody style={{ textAlign: "center" }}>
                                <tr>
                                    <td> <b style={{ color: 'green', textAlign: 'center' }}>  {this.calculateNumberPatientVisits(this.props.patient._id, "Completed")} </b> <br /><br />  <b> {text("Completed")}   </b>  </td>
                                    <td> <b style={{ color: 'red', textAlign: 'center' }}> {this.calculateNumberPatientVisits(this.props.patient._id, "Missed")} </b> <br /><br />  <b> {text("Missed")}  </b> </td>
                                    <td> <b style={{ color: 'orange', textAlign: 'center' }}> {this.calculateNumberPatientVisits(this.props.patient._id, "Cancelled")} </b> <br /><br />  <b> {text("Cancelled")}  </b> </td>
                                </tr>

                                <tr>
                                    <td> <b style={{ color: 'purple', textAlign: 'center' }}> {setting.getSetting('currencySymbol')} {this.props.patient.paymentDetails.totalDues} </b> <br /><br /> <b> {text("Total Dues")}  </b> </td>
                                    <td> <b style={{ color: 'purple', textAlign: 'center' }}> {setting.getSetting('currencySymbol')} {this.props.patient.paymentDetails.totalPaid} </b> <br /><br /> <b> {text("Total Paid")}  </b> </td>
                                </tr>
                            </tbody>
                        </table>
                    </Col>
                </Row>

                <Row gutter={24} style={{ marginTop: "10px" }}>

                    <Col md={8}>
                        <table className="ms-table">
                            <thead>
                                <tr>
                                    <th colSpan={3}> <h5> <b> {text("Patient Information")}  </b> </h5></th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td> <b> {text("Name")}  </b> </td>  <td> {this.props.patient.name} </td>
                                </tr>
                                <tr>
                                    <td> <b> {text("Address")}  </b> </td>  <td> {this.props.patient.address} </td>
                                </tr>
                                <tr>
                                    <td> <b> {text("Age")}  </b> </td>   <td> {this.props.patient.age} years </td>
                                </tr>
                                <tr>
                                    <td> <b> {text("Gender")}  </b> </td>   <td> {this.props.patient.gender === Gender.female ? "Male" : "Female"} </td>
                                </tr>
                                <tr>
                                    <td> <b> {text("Join date")}  </b> </td>   <td> {new Date(Number(this.props.patient.datex)).toDateString()} </td>
                                </tr>
                                <tr>
                                    <td> <b> {text("Label")}  </b> </td>   <td> {this.props.patient.labels.map(el => el.text)} </td>
                                </tr>
                                <tr>
                                    <td> <b> {text("ID")}  </b> </td>   <td> {this.props.patient._id} </td>
                                </tr>
                                <tr>
                                    <td> <b> {text("Note")}  </b> </td>   <td>  {this.props.patient.medicalNote} </td>
                                </tr>
                            </tbody>
                        </table>
                    </Col>

                    <Col md={8}>
                        <table className="ms-table">
                            <thead>
                                <tr>
                                    <th colSpan={3}> <h5> <b> {text("Patient Financial")}  </b> </h5></th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td> <b> {text("Insurance")}  </b> </td> <td> {this.props.patient.insurance ? this.props.patient.insurance.discount : "nil"} % </td>
                                </tr>
                                <tr>
                                    <td> <b> {text("Insurance discount")}  </b> </td>  <td>  {setting.getSetting('currencySymbol')} {this.props.patient.paymentDetails.totalDiscount} </td>
                                </tr>
                                <tr>
                                    <td> <b> {text("Total Paid")}  </b> </td> <td> {setting.getSetting('currencySymbol')} {this.props.patient.paymentDetails.totalPaid} </td>
                                </tr>
                                <tr>
                                    <td> <b> {text("Total Dues")}  </b> </td> <td> {setting.getSetting('currencySymbol')} {this.props.patient.paymentDetails.totalDues} </td>
                                </tr>
                                <tr>
                                    <td> <b> {text("Last Paid")}  </b> </td> <td> {this.props.patient.lastAppointment ? this.props.patient.lastAppointment.paidAmount: "-"}   </td>
                                </tr>
                                <tr>
                                    <td> <b> {text("Last discount")}  </b> </td> <td> {this.props.patient.lastAppointment ? this.props.patient.lastAppointment.discount: "-"} </td>
                                </tr>
                                <tr>
                                    <td> <b> {text("Last Paid date")}  </b> </td>   <td>  {this.props.patient.lastAppointment ? formatDate(this.props.patient.lastAppointment.date, "date-format"): "-"} </td>
                                </tr>
                            </tbody>
                        </table>
                    </Col>

                    {/* Prescriptions */}
                    <Col md={8}>
                        <div style={{ minHeight: '360px', overflowY: 'auto' }}>
                            <table className="ms-table">
                                <thead>
                                    <tr><th colSpan={3}> <h4> <b> {text("Prescriptions")}</b></h4></th></tr>
                                </thead>
                                <tbody>
                                <tr><td><b>Date</b></td><td> <b>Name</b> </td></tr>  
                                {this.getPrescriptionList()}
                                </tbody>
                            </table>
                        </div>
                    </Col>


                </Row>

                <Row gutter={24} style={{ marginTop: "10px" }}>
                {/* Labs */}
                 <Col md={8}> 
                    <div style={{ maxHeight: '300px', overflowY:'auto' }}>
                        <table className="ms-table">
                                    <thead>
                                        <tr><th colSpan={3}> <h5> <b> {text("Labs")}  </b> </h5></th></tr>
                                    </thead>                                
                                    <tbody>
                                        <tr><td> <b>Name</b> </td> <td><b>Status</b></td> <td> <b>Date</b>  </td></tr>  
                                        {this.getLabOrders()}                                    
                                    </tbody>
                        </table>
                    </div>
                </Col>

                {/* Visits */}
                <Col md={8}> 
                <div style={{ maxHeight: '300px', overflowY:'auto' }}>
                    <table className="ms-table">
                        <thead>
                            <tr><th colSpan={3}> <h5> <b> {text("Visits")}  </b> </h5></th>                                  </tr>
                        </thead>                                     
                        <tbody>
                            <tr><td> <b>Dentist</b> </td> <td><b>Status</b></td> <td> <b>Date</b>  </td></tr>  
                        { this.getPatientApponitmentList().map(appointment =>
                                <tr><td> <b>{appointment.dentist}</b> </td> <td>{appointment.status}</td> <td> {new Date(appointment.date).toDateString()}  </td></tr>)
                        }                                   
                        </tbody>
                    </table>
                </div>
                </Col>

                {/* Procedures */}
                <Col md={8}>
                    <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                        <table className="ms-table">
                            <thead>
                                <tr> <th colSpan={3}> <h5> <b> {text("Procedures")}  </b> </h5></th></tr>
                            </thead>
                            <tbody>
                                <tr> <td> <b>Name</b> </td> <td><b>Date</b></td> <td> <b>Status</b>  </td></tr>     
                                { this.getProceduresList().map(procedure =>
                                <tr> <td> <b>{procedure.name}</b> </td> <td>{procedure.date.substring(0, 10)}</td> <td> {procedure.status}  </td></tr>)
                                }
                            </tbody>
                        </table>
                    </div>
                </Col>
                </Row>
            </div>
        </>
    }
}