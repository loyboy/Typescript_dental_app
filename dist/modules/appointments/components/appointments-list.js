import * as tslib_1 from "tslib";
import { AsyncComponent } from "@common-components";
import { text, user } from "@core";
import { appointments, AppointmentThumbComponent } from "@modules";
import { textualFilter } from "@utils";
import { computed, observable } from "mobx";
import { observer } from "mobx-react";
import { TextField } from "office-ui-fabric-react";
import * as React from "react";
let AppointmentsList = class AppointmentsList extends React.Component {
    constructor() {
        super(...arguments);
        this.filter = "";
        this.selectedAppointmentID = "";
    }
    get filtered() {
        return this.filter
            ? textualFilter(this.props.list, this.filter)
            : this.props.list;
    }
    get canEdit() {
        return user.currentUser.canEditOrtho;
    }
    render() {
        return (React.createElement("div", { className: "appointments-list" },
            this.props.list.length > 0 ? (React.createElement("div", { className: "main" },
                React.createElement(TextField, { label: text("Filter"), value: this.filter, onChange: (e, v) => {
                        this.filter = v;
                    } }),
                React.createElement("hr", null),
                React.createElement("p", { style: {
                        textAlign: "right",
                        fontSize: "13px",
                        color: "#9E9E9E"
                    } },
                    text("Results"),
                    ": ",
                    this.filtered.length,
                    " ",
                    text("out of"),
                    " ",
                    this.props.list.length),
                this.filtered.length ? (this.filtered
                    .sort((a, b) => a.date - b.date)
                    .map(appointment => {
                    return (React.createElement(AppointmentThumbComponent, { key: appointment._id, onClick: () => (this.selectedAppointmentID = appointment._id), appointment: appointment, canDelete: this.canEdit }));
                })) : (React.createElement("p", { className: "no-appointments" }, text("Nothing found") + "...")))) : (""),
            appointments.list[appointments.getIndexByID(this.selectedAppointmentID)] ? (React.createElement(AsyncComponent, { key: "ae", loader: () => tslib_1.__awaiter(this, void 0, void 0, function* () {
                    const AppointmentEditorPanel = (yield import("./appointment-editor")).AppointmentEditorPanel;
                    return (React.createElement(AppointmentEditorPanel, { onDismiss: () => (this.selectedAppointmentID = ""), appointment: appointments.list[appointments.getIndexByID(this.selectedAppointmentID)], onDelete: () => (this.selectedAppointmentID = "") }));
                }) })) : ("")));
    }
};
tslib_1.__decorate([
    observable
], AppointmentsList.prototype, "filter", void 0);
tslib_1.__decorate([
    observable
], AppointmentsList.prototype, "selectedAppointmentID", void 0);
tslib_1.__decorate([
    computed
], AppointmentsList.prototype, "filtered", null);
tslib_1.__decorate([
    computed
], AppointmentsList.prototype, "canEdit", null);
AppointmentsList = tslib_1.__decorate([
    observer
], AppointmentsList);
export { AppointmentsList };
//# sourceMappingURL=appointments-list.js.map