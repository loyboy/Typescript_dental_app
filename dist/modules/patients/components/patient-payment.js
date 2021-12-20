import * as tslib_1 from "tslib";
import { Col, Row, DataTableComponent } from "@common-components";
import { user, text } from "@core";
import { appointments } from "@modules";
import { computed } from "mobx";
import { formatDate } from "@utils";
import { observer } from "mobx-react";
import { CommandBar, Checkbox, Dropdown } from "office-ui-fabric-react";
import * as React from "react";
import { PaymentModal } from "./payment-modal";
import { parse } from "json2csv";
let PatientPaymentPanel = class PatientPaymentPanel extends React.Component {
    constructor() {
        super(...arguments);
        this.state = {
            viewWhich: 0,
            selectedPaymentId: "",
            checkedAppointmentIds: [""]
        };
        this.handleChange = (id, key) => (e, value) => {
            const payments = this.props.patient.payments.map((payment) => {
                if (payment._id === id) {
                    payment[key] = value;
                }
                return payment;
            });
            this.props.patient.payments = payments;
        };
    }
    get canEdit() {
        return user.currentUser.canEditPatients;
    }
    get formateToCsvData() {
        return this.props.patient.appointments.map(appointment => ({
            Id: appointment._id,
            Status: appointment.status,
            Price: appointment.finalPrice,
            Profit: appointment.profit,
            Paid: appointment.paidAmount,
            Remaining: appointment.remainingAmount,
            Insurance: appointment.insuranceDetails.discount,
            Discount: appointment.discount,
            Description: appointment.paymentDescription,
            Tooth: appointment.involvedTeeth.join(", "),
            Procedure: appointment.procedureName,
            Date: new Date(appointment.date).toString(),
            Signature: ""
        }));
    }
    render() {
        const { viewWhich } = this.state;
        const { patient } = this.props;
        const { totalDues, totalDiscount, totalPaid, totalRemaining } = patient.paymentDetails;
        return (React.createElement("div", { className: "payment" },
            viewWhich === 1 ? (React.createElement(PaymentModal, { patient: this.props.patient, onClick: () => {
                    this.setState({ viewWhich: 0 });
                } })) : (""),
            React.createElement(Row, { gutter: 6 },
                React.createElement(Col, { sm: 4 },
                    "Total Dues : ",
                    totalDues),
                React.createElement(Col, { sm: 4 },
                    "Discount : ",
                    totalDiscount),
                React.createElement(Col, { sm: 4 },
                    "Net : ",
                    totalPaid),
                React.createElement(Col, { sm: 4 },
                    "Remaining : ",
                    totalRemaining)),
            React.createElement(Row, { className: "break-line" }),
            React.createElement(Row, { className: "payment-header" },
                React.createElement(CommandBar, { items: [
                        {
                            key: "newPayment",
                            text: "New Payment",
                            iconProps: { iconName: "Add" },
                            onClick: () => {
                                this.setState({
                                    viewWhich: 1
                                });
                            }
                        },
                        {
                            key: "delete",
                            text: "Delete",
                            iconProps: { iconName: "Trash" },
                            onClick: () => {
                                const { checkedAppointmentIds } = this.state;
                                checkedAppointmentIds.forEach(id => {
                                    appointments.deleteByID(id);
                                });
                                this.setState({ checkedPaymentIds: [] });
                            }
                        },
                        {
                            key: "procedure",
                            text: "Procedure",
                            iconProps: { iconName: "Share" },
                            onClick: () => console.log("Share")
                        },
                        {
                            key: "exportTable",
                            text: "Export Table",
                            iconProps: { iconName: "Download" },
                            onClick: () => {
                                if (this.formateToCsvData.length) {
                                    const csv = parse(this.formateToCsvData);
                                    console.log(csv);
                                    const blob = new Blob([csv], {
                                        type: "application/octet-stream"
                                    });
                                    saveAs(blob, this.props.patient.name + " Payment.csv");
                                }
                            }
                        }
                    ] })),
            React.createElement(Row, null, this.props.patient.appointments.length !== 0 && (React.createElement(DataTableComponent, { maxItemsOnLoad: 3, heads: [
                    "",
                    text("Id"),
                    text("Status"),
                    text("Price"),
                    text("Profit"),
                    text("Paid"),
                    text("Remaining"),
                    text("Insurance") + "(%)",
                    text("Discount") + "(%)",
                    text("Description"),
                    text("Tooth"),
                    text("Procedure"),
                    text("Date"),
                    text("Signature")
                ], hideSearch: true, rows: this.props.patient.appointments.map((appointment, i) => ({
                    id: i + "pp",
                    cells: [
                        {
                            dataValue: "",
                            component: (React.createElement(Checkbox, { checked: this.state.checkedAppointmentIds.includes(appointment._id), onChange: (event, value) => {
                                    const { checkedAppointmentIds } = this.state;
                                    if (value) {
                                        checkedAppointmentIds.push(appointment._id);
                                        this.setState({
                                            checkedAppointmentIds
                                        });
                                    }
                                    else {
                                        const index = checkedAppointmentIds.indexOf(appointment._id);
                                        if (index > -1) {
                                            checkedAppointmentIds.splice(index, 1);
                                            this.setState({ checkedAppointmentIds });
                                        }
                                    }
                                } }))
                        },
                        {
                            dataValue: appointment._id,
                            component: React.createElement("p", null, appointment._id)
                        },
                        {
                            dataValue: appointment.status,
                            component: (React.createElement("p", { style: { width: "150px" } },
                                React.createElement(Dropdown, { options: [
                                        "Completed",
                                        "Not Completed",
                                        "In Processing",
                                        "Delayed",
                                        "Discontinued"
                                    ].map(x => ({
                                        key: x.toString(),
                                        text: x.toString()
                                    })), selectedKey: appointment.status, onChange: (ev, val) => {
                                        if (val.key.toString() === "Completed") {
                                            appointment.setIsDone(true);
                                            // this.props.appointment!.isDone = true;
                                        }
                                        else {
                                            appointment.setIsDone(true);
                                            // this.props.appointment!.isDone = false;
                                        }
                                        if (patient && patient.procedures) {
                                            const newPro = patient.procedures.map(pro => {
                                                if (pro.id === appointment.procedureId) {
                                                    pro.status = val.key.toString();
                                                }
                                                return pro;
                                            });
                                            patient.procedures = newPro;
                                        }
                                        appointment.setStatus(val.key.toString());
                                    } })))
                        },
                        {
                            dataValue: appointment.finalPrice,
                            component: React.createElement("p", null, appointment.finalPrice)
                        },
                        {
                            dataValue: appointment.profit,
                            component: React.createElement("p", null, appointment.profit)
                        },
                        {
                            dataValue: appointment.paidAmount,
                            component: React.createElement("p", null, appointment.paidAmount)
                        },
                        {
                            dataValue: appointment.remainingAmount,
                            component: React.createElement("p", null, appointment.remainingAmount)
                        },
                        {
                            dataValue: appointment.insuranceDetails.discount,
                            component: React.createElement("p", null, appointment.insuranceDetails.discount)
                        },
                        {
                            dataValue: appointment.discount,
                            component: React.createElement("p", null, appointment.discount)
                        },
                        {
                            dataValue: appointment.paymentDescription,
                            component: React.createElement("p", null, appointment.paymentDescription)
                        },
                        {
                            dataValue: appointment.involvedTeeth,
                            component: React.createElement("p", null, appointment.involvedTeeth.join(", "))
                        },
                        {
                            dataValue: appointment.procedureName,
                            component: React.createElement("p", null, appointment.procedureName)
                        },
                        {
                            dataValue: appointment.date,
                            component: (React.createElement("p", null, formatDate(new Date(appointment.date), "dd/mm/yyyy")))
                        },
                        {
                            dataValue: "",
                            component: React.createElement("p", null, "")
                        }
                    ]
                })) })))));
    }
};
tslib_1.__decorate([
    computed
], PatientPaymentPanel.prototype, "canEdit", null);
tslib_1.__decorate([
    computed
], PatientPaymentPanel.prototype, "formateToCsvData", null);
PatientPaymentPanel = tslib_1.__decorate([
    observer
], PatientPaymentPanel);
export { PatientPaymentPanel };
//# sourceMappingURL=patient-payment.js.map