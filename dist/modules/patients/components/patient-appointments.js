import * as tslib_1 from "tslib";
import { SectionComponent } from "@common-components";
import { text, user } from "@core";
import { Appointment, appointments, AppointmentsList } from "@modules";
import { computed } from "mobx";
import { observer } from "mobx-react";
import { DefaultButton, MessageBar, MessageBarType } from "office-ui-fabric-react";
import * as React from "react";
let PatientAppointmentsPanel = class PatientAppointmentsPanel extends React.Component {
    constructor() {
        super(...arguments);
        this.l = null;
    }
    get appointments() {
        return appointments.list.filter(item => {
            return item.patientID === this.props.patient._id;
        });
    }
    get canEdit() {
        return user.currentUser.canEditPatients;
    }
    render() {
        return (React.createElement("div", { className: "spa-panel appointments" },
            React.createElement(SectionComponent, { title: text(`Patient Appointments`) },
                React.createElement(AppointmentsList, { ref: l => (this.l = l), list: this.appointments }),
                this.appointments.length ? ("") : (React.createElement(MessageBar, { messageBarType: MessageBarType.info }, text("This patient does not have any appointment"))),
                React.createElement("br", null),
                this.canEdit ? (React.createElement(DefaultButton, { onClick: () => {
                        const apt = new Appointment();
                        apt.patientID = this.props.patient._id;
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
], PatientAppointmentsPanel.prototype, "appointments", null);
tslib_1.__decorate([
    computed
], PatientAppointmentsPanel.prototype, "canEdit", null);
PatientAppointmentsPanel = tslib_1.__decorate([
    observer
], PatientAppointmentsPanel);
export { PatientAppointmentsPanel };
//# sourceMappingURL=patient-appointments.js.map