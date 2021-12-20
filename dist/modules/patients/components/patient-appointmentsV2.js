import * as tslib_1 from "tslib";
import { SectionComponent } from "@common-components";
import { text, user } from "@core";
import { Appointment, appointments, AppointmentsListV2 } from "@modules";
import { computed } from "mobx";
import { observer } from "mobx-react";
import { DefaultButton, MessageBar, MessageBarType } from "office-ui-fabric-react";
import * as React from "react";
let PatientAppointmentsPanelV2 = class PatientAppointmentsPanelV2 extends React.Component {
    constructor() {
        super(...arguments);
        this.l = null;
    }
    get appointments() {
        return appointments.list.filter(item => {
            return (item.patientID === this.props.patient._id &&
                item.procedureId === this.props.selectedProcedureId);
        });
    }
    get canEdit() {
        return user.currentUser.canEditPatients;
    }
    get procedure() {
        return this.props.patient.procedures.find(pro => pro.id === this.props.selectedProcedureId);
    }
    render() {
        return (React.createElement("div", { className: "spa-panel appointments" },
            React.createElement(SectionComponent, { title: text(`Patient Appointments`) },
                React.createElement(AppointmentsListV2, { ref: l => (this.l = l), list: this.appointments, procedure: this.procedure }),
                this.appointments.length ? ("") : (React.createElement(MessageBar, { messageBarType: MessageBarType.info }, text("This patient does not have any appointment"))),
                React.createElement("br", null),
                this.canEdit ? (React.createElement(DefaultButton, { onClick: () => {
                        const apt = new Appointment();
                        apt.patientID = this.props.patient._id;
                        apt.finalPrice = this.procedure.fees;
                        apt.involvedTeeth = this.procedure.tooth;
                        apt.procedureId = this.props.selectedProcedureId;
                        apt.date = new Date().getTime();
                        appointments.list.push(apt);
                        if (this.l) {
                            this.l.selectedAppointmentID = apt._id;
                        }
                    }, iconProps: { iconName: "add" }, text: text("Book new appointment") })) : (""))));
    }
};
tslib_1.__decorate([
    computed
], PatientAppointmentsPanelV2.prototype, "appointments", null);
tslib_1.__decorate([
    computed
], PatientAppointmentsPanelV2.prototype, "canEdit", null);
tslib_1.__decorate([
    computed
], PatientAppointmentsPanelV2.prototype, "procedure", null);
PatientAppointmentsPanelV2 = tslib_1.__decorate([
    observer
], PatientAppointmentsPanelV2);
export { PatientAppointmentsPanelV2 };
//# sourceMappingURL=patient-appointmentsV2.js.map