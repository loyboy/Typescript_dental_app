import * as tslib_1 from "tslib";
import { observer } from "mobx-react";
import { PrimaryButton, IconButton } from "office-ui-fabric-react";
import * as React from "react";
import { Procedures } from '../data';
import { generateID } from "@utils";
class ProductTable extends React.Component {
    render() {
        var onProductTableUpdate = this.props.onProductTableUpdate;
        var rowDel = this.props.onRowDel;
        //var filterText = this.props.filterText;
        var product = this.props.procedures.map(function (productval) {
            return (React.createElement(ProductRow, { onProductTableUpdate: onProductTableUpdate, procedure: productval, onDelEvent: rowDel, key: productval.id }));
        });
        return (React.createElement("div", { style: { margin: '24px 8px', display: 'flex', flexDirection: 'column' } },
            React.createElement("div", { style: { margin: 'auto' } },
                React.createElement(PrimaryButton, { text: "Add row", onClick: this.props.onRowAdd, className: "btn btn-success pull-right" })),
            React.createElement("div", { style: { height: '100%', minHeight: 100, marginTop: 16 } },
                React.createElement("table", { className: "table table-bordered" },
                    React.createElement("thead", null,
                        React.createElement("tr", null,
                            React.createElement("th", null, "Done"),
                            React.createElement("th", null, "Date"),
                            React.createElement("th", null, "Priority"),
                            React.createElement("th", null, "Tooth"),
                            React.createElement("th", null, "Description"),
                            React.createElement("th", null, "Fees"),
                            React.createElement("th", null, "Discount"),
                            React.createElement("th", null, "Fees Discount"),
                            React.createElement("th", null, "Insurance"),
                            React.createElement("th", null, "Patient Signature"))),
                    React.createElement("tbody", null, product)))));
    }
}
class ProductRow extends React.Component {
    constructor() {
        super(...arguments);
        this.trashIcon = { iconName: 'Trash' };
    }
    onDelEvent() {
        this.props.onDelEvent(this.props.procedure);
    }
    render() {
        return (React.createElement("tr", { className: "eachRow" },
            React.createElement(EditableCell, { onProductTableUpdate: this.props.onProductTableUpdate, cellData: {
                    "type": "done",
                    value: this.props.procedure.done,
                    id: this.props.procedure.id
                } }),
            React.createElement(EditableCell, { onProductTableUpdate: this.props.onProductTableUpdate, cellData: {
                    "type": "date",
                    value: this.props.procedure.date,
                    id: this.props.procedure.id
                } }),
            React.createElement(EditableCell, { onProductTableUpdate: this.props.onProductTableUpdate, cellData: {
                    "type": "priority",
                    value: this.props.procedure.priority,
                    id: this.props.procedure.id
                } }),
            React.createElement(EditableCell, { onProductTableUpdate: this.props.onProductTableUpdate, cellData: {
                    "type": "tooth",
                    value: this.props.procedure.tooth,
                    id: this.props.procedure.id
                } }),
            React.createElement(EditableCell, { onProductTableUpdate: this.props.onProductTableUpdate, cellData: {
                    "type": "desc",
                    value: this.props.procedure.desc,
                    id: this.props.procedure.id
                } }),
            React.createElement(EditableCell, { onProductTableUpdate: this.props.onProductTableUpdate, cellData: {
                    "type": "fees",
                    value: this.props.procedure.fees,
                    id: this.props.procedure.id
                } }),
            React.createElement(EditableCell, { onProductTableUpdate: this.props.onProductTableUpdate, cellData: {
                    "type": "discount",
                    value: this.props.procedure.discount,
                    id: this.props.procedure.id
                } }),
            React.createElement(EditableCell, { onProductTableUpdate: this.props.onProductTableUpdate, cellData: {
                    "type": "fdiscount",
                    value: this.props.procedure.fdiscount,
                    id: this.props.procedure.id
                } }),
            React.createElement(EditableCell, { onProductTableUpdate: this.props.onProductTableUpdate, cellData: {
                    "type": "insurance",
                    value: this.props.procedure.insurance,
                    id: this.props.procedure.id
                } }),
            React.createElement(EditableCell, { onProductTableUpdate: this.props.onProductTableUpdate, cellData: {
                    "type": "psignature",
                    value: this.props.procedure.psignature,
                    id: this.props.procedure.id
                } }),
            React.createElement("td", { className: "del-cell" },
                React.createElement(IconButton, { className: "delete-btn", iconProps: this.trashIcon, title: "Delete row", onClick: this.onDelEvent.bind(this), style: { border: '1px solid red', height: 22 } }))));
    }
}
class EditableCell extends React.Component {
    render() {
        return (React.createElement("td", { style: { width: '10%' } },
            React.createElement("input", { style: { width: '100%' }, type: 'text', name: this.props.cellData.type, id: this.props.cellData.id, value: this.props.cellData.value, onChange: this.props.onProductTableUpdate })));
    }
}
let PatientProcedures = class PatientProcedures extends React.Component {
    constructor(props) {
        super(props);
        this.handleRowDel = (prod) => {
            var index = this.state.procedures.indexOf(prod);
            this.state.procedures.splice(index, 1);
            //	this.setState( { procedures: this.state.procedures } );
            this.setState({
                procedures: this.state.procedures
            }, () => {
                this.props.patient.procedures = this.state.procedures;
            });
        };
        this.handleAddEvent = () => {
            var d = new Date();
            let date = [
                d.getFullYear(),
                ('0' + (d.getMonth() + 1)).slice(-2),
                ('0' + d.getDate()).slice(-2)
            ].join('-');
            let idx = generateID();
            var product = {
                id: "",
                name: "",
                quantity: 0,
                patientID: "",
                tooth: [],
                fees: 0,
                done: false,
                date: new Date().toISOString()
            };
            var pp = new Procedures(product);
            //product.SetPatientID(this.props.patient._id);
            this.state.procedures.push(pp);
            //this.setState({ procedures: this.state.procedures });	
            this.setState({
                procedures: this.state.procedures
            }, () => {
                this.props.patient.procedures = this.state.procedures;
            });
        };
        this.handleProductTable = (evt) => {
            var item = {
                id: evt.target.id,
                name: evt.target.name,
                value: evt.target.value
            };
            var products = this.state.procedures.slice();
            var newProducts = products.map(function (product) {
                for (var key in product) {
                    if (key == item.name && product.id == item.id) {
                        product[key] = item.value;
                    }
                }
                return product;
            });
            this.setState({
                procedures: newProducts
            }, () => {
                this.props.patient.procedures = this.state.procedures;
            });
            //  console.log(this.state.products);
        };
        this.state = {
            procedures: this.props.patient.procedures
        };
    }
    render() {
        return (React.createElement("div", null,
            React.createElement(ProductTable, { onProductTableUpdate: this.handleProductTable.bind(this), onRowAdd: this.handleAddEvent.bind(this), onRowDel: this.handleRowDel.bind(this), procedures: this.state.procedures })));
    }
};
PatientProcedures = tslib_1.__decorate([
    observer
], PatientProcedures);
export { PatientProcedures };
//# sourceMappingURL=patient-procedures.js.map