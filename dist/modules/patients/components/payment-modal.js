import * as tslib_1 from "tslib";
import * as React from "react";
import { getId } from "office-ui-fabric-react/lib/Utilities";
import { Modal, IconButton, DatePicker, TextField, Button, Icon, Dropdown, TooltipHost, Panel, PanelType } from "office-ui-fabric-react";
import { Col, Row, ProfileComponent } from "@common-components";
import { Payment, PatientAppointmentsPanel, appointments } from "@modules";
import { text } from "@core";
import { computed } from "mobx";
import { num } from "@utils";
export class PaymentModal extends React.Component {
    constructor() {
        super(...arguments);
        this.state = {
            openAppointment: false,
            discount: 0,
            insurance: 0,
            paidFees: 0,
            description: "",
            date: new Date(),
            receipt: 1,
            doctors: [],
            dueRemaining: "",
            selectedAppointmentId: ""
        };
        this._titleId = getId("title");
        this._subtitleId = getId("subText");
    }
    get appointment() {
        return appointments.list.find(app => app._id === this.state.selectedAppointmentId);
    }
    render() {
        const { onClick } = this.props;
        return (React.createElement("div", null,
            React.createElement(Panel, { isOpen: this.state.openAppointment, type: PanelType.medium, customWidth: "100%", closeButtonAriaLabel: "Close", isLightDismiss: true, onDismiss: () => {
                    this.setState({ openAppointment: false });
                }, onRenderNavigation: () => {
                    return (React.createElement(Row, { className: "panel-heading" },
                        React.createElement(Col, { span: 22 },
                            React.createElement(ProfileComponent, { name: this.props.patient.name, secondaryElement: React.createElement("div", null, text("Patient Appointments")), size: 3 })),
                        React.createElement(Col, { span: 2, className: "close" },
                            React.createElement(IconButton, { iconProps: { iconName: "cancel" }, onClick: () => {
                                    this.setState({ openAppointment: false });
                                } }))));
                } },
                React.createElement(PatientAppointmentsPanel, { patient: this.props.patient })),
            React.createElement(Modal, { titleAriaId: this._titleId, subtitleAriaId: this._subtitleId, isOpen: true, onDismiss: onClick, isBlocking: false, containerClassName: "container" },
                React.createElement("div", { className: "modal-header" },
                    React.createElement("span", { id: this._titleId }, "Cash"),
                    React.createElement(IconButton, { iconProps: { iconName: "Cancel" }, ariaLabel: "Close popup modal", onClick: onClick })),
                React.createElement("div", { id: this._subtitleId, style: { padding: "10px" } },
                    React.createElement(Row, { gutter: 12 },
                        React.createElement(Col, { sm: 16 },
                            React.createElement("h4", null, "Payment")),
                        React.createElement(Col, { sm: 5 },
                            React.createElement(Row, { gutter: 6 },
                                React.createElement(Col, { sm: 3 }, "On"),
                                React.createElement(Col, { sm: 20 },
                                    React.createElement(DatePicker, { disabled: true, value: this.state.date })))),
                        React.createElement(Col, { sm: 3 },
                            React.createElement(Row, { gutter: 12 },
                                React.createElement(Col, { sm: 12 }, "Receipt#"),
                                React.createElement(Col, { sm: 12 }, Payment.triggerUpdate)))),
                    React.createElement(Row, { gutter: 12 },
                        React.createElement(Col, { sm: 6 },
                            React.createElement(TextField, { disabled: true, type: "number", label: "Due Remaining", value: this.state.dueRemaining.toString() })),
                        React.createElement(Col, { sm: 8 },
                            React.createElement(TextField, { type: "number", placeholder: "Payment", label: "Payment", onChange: (e, newValue) => {
                                    this.setState({ paidFees: newValue });
                                } }))),
                    React.createElement(Row, { gutter: 12 },
                        React.createElement(Col, { sm: 24 },
                            React.createElement(TextField, { placeholder: "Description", onChange: (e, newValue) => {
                                    this.setState({ description: newValue });
                                } }))),
                    React.createElement(Row, { gutter: 12 },
                        React.createElement(Col, { sm: 12 },
                            React.createElement(Row, { gutter: 12 },
                                React.createElement(Col, { sm: 4 }, "Patient"),
                                React.createElement(Col, { sm: 12 },
                                    React.createElement(TextField, { disabled: true, placeholder: "Patient", value: this.props.patient.name })))),
                        React.createElement(Col, { sm: 12 },
                            React.createElement(Row, { gutter: 12 },
                                React.createElement(Col, { className: "abcd", sm: 4 }, "Discount"),
                                React.createElement(Col, { sm: 12 },
                                    React.createElement(TextField, { disabled: true, value: this.state.discount.toString(), placeholder: "Discount", prefix: "%" }))))),
                    React.createElement(Row, { gutter: 12 },
                        React.createElement(Col, { sm: 12 },
                            React.createElement(Row, { gutter: 12 },
                                React.createElement(Col, { sm: 4 }, "Dentist"),
                                React.createElement(Col, { sm: 12 },
                                    React.createElement(Dropdown, { disabled: true, placeholder: "Dentist", defaultSelectedKeys: this.state.doctors, multiSelect: true, options: this.state.doctors.map(v => ({
                                            key: v,
                                            text: v
                                        })) })))),
                        React.createElement(Col, { sm: 12 },
                            React.createElement(Row, { gutter: 12 },
                                React.createElement(Col, { sm: 4 }, "Insurance"),
                                React.createElement(Col, { sm: 12 },
                                    React.createElement(TextField, { disabled: true, value: this.props.patient.insurance
                                            ? this.props.patient.insurance.discount.toString()
                                            : "", placeholder: "Insurance", prefix: "%" }))))),
                    React.createElement(Row, { gutter: 12 },
                        React.createElement(Col, { sm: 12 },
                            React.createElement(Row, { gutter: 12 },
                                React.createElement(Col, { sm: 4 },
                                    React.createElement(Button, { disabled: this.state.selectedAppointmentId && this.state.paidFees
                                            ? false
                                            : true, onClick: () => {
                                            this.appointment.paidAmount =
                                                num(this.appointment.paidAmount) +
                                                    num(this.state.paidFees);
                                            this.appointment.paymentDescription = this.state.description;
                                            onClick();
                                        } },
                                        React.createElement(Icon, { iconName: "CheckMark" }),
                                        "Ok")),
                                React.createElement(Col, { sm: 4 },
                                    React.createElement(Button, { disabled: true },
                                        React.createElement(Icon, { iconName: "Print" }),
                                        "Print")),
                                React.createElement(Col, { sm: 4 },
                                    React.createElement(Button, { onClick: onClick },
                                        React.createElement(Icon, { iconName: "Cancel" }),
                                        "Cancel")))),
                        React.createElement(Col, { sm: 12 },
                            React.createElement(Row, { gutter: 12 },
                                React.createElement(Col, { sm: 4 }, "Appointment"),
                                React.createElement(Col, { sm: 12 },
                                    React.createElement(Dropdown, { placeholder: "Appointment", options: this.props.patient.appointments.map(v => ({
                                            key: v,
                                            text: new Date(v.date).toString()
                                        })), onChange: (e, value) => {
                                            this.setState({
                                                dueRemaining: value.key.remainingAmount.toString(),
                                                doctors: value.key.doctors,
                                                selectedAppointmentId: value.key._id,
                                                discount: value.key.discount
                                            });
                                        } })),
                                React.createElement(Col, { sm: 4 },
                                    React.createElement(TooltipHost, { content: text("Add appointment") },
                                        React.createElement(IconButton, { iconProps: { iconName: "Add" }, onClick: () => {
                                                this.setState({ openAppointment: true });
                                            } }))))))))));
    }
}
tslib_1.__decorate([
    computed
], PaymentModal.prototype, "appointment", null);
//# sourceMappingURL=payment-modal.js.map