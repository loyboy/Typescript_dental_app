import {AsyncComponent} from "@common-components";
import {text, user} from "@core";
import {
    Appointment,
    appointments,
    AppointmentThumbComponent,
    Procedures,
    Payment
} from "@modules";
import {textualFilter} from "@utils";
import {computed, observable} from "mobx";
import {observer} from "mobx-react";
import {TextField} from "office-ui-fabric-react";
import * as React from "react";
import {Patient} from 'modules/patients';

@observer
export class AppointmentsListV2 extends React.Component < {
    list : Appointment[],
    procedure : Procedures,
    patient : Patient
}, {} > {
    @observable filter: string = "";

    @observable selectedAppointmentID: string = "";

    @computed get filtered() {
        return this.filter ? textualFilter(this.props.list, this.filter) : this.props.list;
    }
    @computed get canEdit() {
        return user.currentUser.canEditOrtho;
    }

    render() {
        return (
            <div className="appointments-list">
                {
                this.props.list.length > 0 ? (
                    <div className="main">
                        <TextField label={
                                text("Filter")
                            }
                            value={
                                this.filter
                            }
                            onChange={
                                (e, v) => {
                                    this.filter = v !;
                                }
                            }/>

                        <hr/>
                        <p style={
                            {
                                textAlign: "right",
                                fontSize: "13px",
                                color: "#9E9E9E"
                            }
                        }>
                            {
                            text("Results")
                        }: {
                            this.filtered.length
                        }
                            {" "}
                            {
                            text("out of")
                        }
                            {
                            this.props.list.length
                        } </p>

                        {
                        this.filtered.length ? (this.filtered.sort((a, b) => a.date - b.date).map(appointment => {
                            return (
                                <AppointmentThumbComponent key={
                                        appointment._id
                                    }
                                    onClick={
                                        () => (this.selectedAppointmentID = appointment._id)
                                    }
                                    appointment={appointment}
                                    patient={this.props.patient}
                                    canDelete={
                                        this.canEdit
                                    }/>
                            );
                        })) : (
                            <p className="no-appointments">
                                {
                                text("Nothing found") + "..."
                            } </p>
                        )
                    } </div>
                ) : ("")
            }
                {
                appointments.list[appointments.getIndexByID(this.selectedAppointmentID)] ? (
                    <AsyncComponent key="ae"
                        loader={
                            async () => {
                                const AppointmentEditorPanel = (await import ("./appointment-editorV2")).AppointmentEditorPanelV2;
                                return (
                                    <AppointmentEditorPanel procedure={
                                            this.props.procedure
                                        }
                                        onDismiss={
                                            () => {
                                                /*	this.selectedAppointmentID = "";
										let apt = appointments.list[
											appointments.getIndexByID(
												this.selectedAppointmentID
											)
										]; */
                                                // this.props.procedure.addToPaid(apt.paidAmount);
                                           /*
                                                let appoint = appointments.list[appointments.getIndexByID(this.selectedAppointmentID)];

                                                const payments: Payment[] = [];

                                                var paycheck = appoint.payments.filter(item => {
                                                    return(item.appointmentID === appoint._id);
                                                });

                                                if (paycheck.length > 0) {
                                                    console.log("Appointment already exists in the Payment Database!!")
                                                    return;
                                                }
                                                var pay = new Payment();
                                                pay.appointmentID = appoint._id;
                                                pay.date = new Date();
                                                pay.procedure = this.props.patient.procedures.find(item => {
                                                    return(item.id === appoint.procedureId);
                                                }).name;
                                                pay.discount = appoint.discount;
                                                pay.insurance = this.props.patient && this.props.patient.insurance ? this.props.patient.insurance.discount : 0;
                                                pay.paidFees = appoint.paidAmount;
                                                pay.price = appoint.finalPrice;
                                                pay.remaining = appoint.outstandingAmount;
                                                pay.status = appoint.outstandingAmount > 0 ? 'Incomplete' : 'Complete';

                                                payments.push(pay);

                                                appoint.payments = [
                                                    ... appoint.payments,
                                                    ... payments
                                                ]
                                                */

                                                this.selectedAppointmentID = "";
                                            }
                                        }
                                        appointment={
                                            appointments.list[appointments.getIndexByID(this.selectedAppointmentID)]
                                        }
                                        onDelete={
                                            () => (this.selectedAppointmentID = "")
                                        }/>
                                );
                            }
                        }/>
                ) : ("")
            } </div>
        );
    }
}
