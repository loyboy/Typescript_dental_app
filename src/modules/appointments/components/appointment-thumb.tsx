import { ProfileSquaredComponent } from "@common-components";
import { Appointment, appointments, setting } from "@modules";
import { PatientLinkComponent } from "@modules";
import { formatDate } from "@utils";
import { computed } from "mobx";
import { observer } from "mobx-react";
import {
  DefaultButton,
  Icon,
  Panel,
  PanelType,
  PrimaryButton,
} from "office-ui-fabric-react";
import * as React from "react";
import { Patient } from "modules/patients";
import { text } from "@core";

@observer
export class AppointmentThumbComponent extends React.Component<
  {
    appointment: Appointment;

    patient: Patient;

    onClick?: () => void;

    canDelete?: boolean;

    className?: string;

    hideDate?: boolean;

    showPatient?: boolean;

    hideTreatment?: boolean;
  },
  {}
> {
  @computed
  get className() {
    let className = "atc-c";
    className = className + " labeled";
    if (this.props.appointment.dueToday) {
      className = className + " today-due";
    }
    if (this.props.appointment.dueTomorrow) {
      className = className + " tomorrow-due";
    }
    if (this.props.appointment.missed) {
      className = className + " missed";
    }
    if (this.props.appointment.isOutstanding) {
      className = className + " to-be-paid";
    }
    if (this.props.appointment.isOverpaid) {
      className = className + " over-paid";
    }
    if (this.props.appointment.future) {
      className = className + " future";
    }
    if (this.props.onClick) {
      className = className + " clickable";
    }
    return className;
  }

  state = {
    showDialog: false,
  };

  toggleDialog = () => {
    this.setState({
      showDialog: !this.state.showDialog,
    });
  };

  el: HTMLElement | undefined;
  render() {
    return (
      <div
        ref={(el) => (el ? (this.el = el) : "")}
        className={this.className}
        onClick={this.props.onClick || (() => {})}
      >
        {this.props.showPatient ? (
          <PatientLinkComponent
            className="appointment-patient-link"
            id={this.props.appointment.patientID}
          />
        ) : (
          ""
        )}
        <div className="m-b-5">
          <ProfileSquaredComponent
            text={""}
            subText={formatDate(
              this.props.appointment.date,
              setting.getSetting("date_format"),
              setting.getSetting("month_format")
            )}
            size={3}
          />
        </div>
        {this.state.showDialog && (
          <Panel
            key={"1appointment"}
            className={`confirmation-modal`}
            isBlocking
            isLightDismiss
            isOpen
            onDismiss={() => this.toggleDialog()}
            type={PanelType.smallFluid}
            hasCloseButton={false}
            onRenderHeader={() => <div />}
          >
            <p>{"Are you sure you want to delete this appointment?"}</p>
            <PrimaryButton
              onClick={() => {
                this.toggleDialog();
                appointments.deleteByID(this.props.appointment._id);
              }}
              iconProps={{ iconName: "CheckMark" }}
              text={text("Confirm")}
            />
            <DefaultButton
              onClick={() => this.toggleDialog()}
              iconProps={{ iconName: "Cancel" }}
              text={text("Cancel")}
            />
          </Panel>
        )}
        {this.props.canDelete ? (
          <Icon
            iconName="delete"
            className="delete"
            onMouseEnter={() => {
              this.el!.className = this.el!.className + " to-delete";
            }}
            onMouseLeave={() => {
              this.el!.className = this.el!.className.split(" to-delete").join(
                ""
              );
            }}
            onClick={(ev) => {
              //   appointments.deleteModal(this.props.appointment._id);
              //	    var newPayments = this.props.patient.payments.filter((obj => obj.appointmentID !== this.props.appointment._id));
              //		this.props.patient.payments = newPayments;
              ev.stopPropagation();
              this.toggleDialog();
            }}
          />
        ) : (
          ""
        )}
      </div>
    );
  }
}
