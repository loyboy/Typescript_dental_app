import * as tslib_1 from "tslib";
import { AsyncComponent, Col, ProfileComponent, Row, SectionComponent, } from "@common-components";
import { status, text, user } from "@core";
import { AppointmentThumbComponent } from "@modules";
import { computed, observable } from "mobx";
import { observer } from "mobx-react";
import { IconButton, Link, MessageBar, MessageBarType, Panel, PanelType, } from "office-ui-fabric-react";
import * as React from "react";
let UserPanelView = class UserPanelView extends React.Component {
    constructor() {
        super(...arguments);
        this.appointment = null;
    }
    get todayAppointments() {
        if (!user.currentUser) {
            return [];
        }
        else if (user.todayAppointments) {
            return user.todayAppointments;
        }
        else {
            return [];
        }
    }
    render() {
        return (React.createElement(Panel, { className: "user-component", type: PanelType.medium, isLightDismiss: true, isOpen: user.visible, onDismiss: () => (user.visible = false), onRenderNavigation: () => (React.createElement(Row, { className: "panel-heading" },
                React.createElement(Col, { span: 20 },
                    React.createElement(ProfileComponent, { name: user.currentUser.name, size: 3, secondaryElement: React.createElement("div", null,
                            React.createElement(Link, { onClick: () => {
                                    status.logout();
                                } }, text("Logout")),
                            " / ",
                            React.createElement(Link, { className: "reset-user", onClick: () => {
                                    status.resetUser();
                                } }, text("Switch user"))) })),
                React.createElement(Col, { span: 4, className: "close" },
                    React.createElement(IconButton, { iconProps: { iconName: "cancel" }, onClick: () => {
                            user.visible = false;
                        } })))) },
            React.createElement(SectionComponent, { title: text("Today's Appointments") }, this.todayAppointments.length === 0 ? (React.createElement(MessageBar, { messageBarType: MessageBarType.info }, text("No appointments today"))) : (React.createElement("div", { className: "appointments-listing" }, this.todayAppointments.map((appointment) => {
                const date = new Date(appointment.date);
                const dateLink = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
                return (React.createElement(AppointmentThumbComponent, { key: appointment._id, appointment: appointment, hideDate: true, showPatient: true, onClick: () => {
                        this.appointment = appointment;
                    } }));
            })))),
            this.appointment ? (React.createElement(AsyncComponent, { key: "ae", loader: () => tslib_1.__awaiter(this, void 0, void 0, function* () {
                    const AppointmentEditorPanel = (yield import("../modules/appointments/components/appointment-editor")).AppointmentEditorPanel;
                    return (React.createElement(AppointmentEditorPanel, { appointment: this.appointment, onDismiss: () => (this.appointment = null), onDelete: () => (this.appointment = null) }));
                }) })) : ("")));
    }
};
tslib_1.__decorate([
    observable
], UserPanelView.prototype, "appointment", void 0);
tslib_1.__decorate([
    computed
], UserPanelView.prototype, "todayAppointments", null);
UserPanelView = tslib_1.__decorate([
    observer
], UserPanelView);
export { UserPanelView };
//# sourceMappingURL=user.js.map