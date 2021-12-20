import * as tslib_1 from "tslib";
import { Col, DataTableComponent, ProfileSquaredComponent, Row, SectionComponent, TagComponent, TagType } from "@common-components";
import { router, text, user } from "@core";
import { insurances, Insurance, statistics } from "@modules";
import { num } from "@utils";
import { computed, observable } from "mobx";
import { observer } from "mobx-react";
import { IconButton, Panel, PanelType, TextField } from "office-ui-fabric-react";
import * as React from "react";
let Insurances = class Insurances extends React.Component {
    constructor() {
        super(...arguments);
        this.selectedID = router.currentLocation.split("/")[1];
    }
    get canEdit() {
        return user.currentUser.canEditInsurance;
    }
    get selectedIndex() {
        return insurances.list.findIndex(x => x._id === this.selectedID);
    }
    get selectedInsurance() {
        return insurances.list[this.selectedIndex];
    }
    render() {
        return (React.createElement("div", { className: "tc-pg p-15 p-l-10 p-r-10" },
            React.createElement(DataTableComponent, { onDelete: this.canEdit
                    ? id => {
                        insurances.deleteModal(id);
                    }
                    : undefined, commands: this.canEdit
                    ? [
                        {
                            key: "addNew",
                            title: "Add new",
                            name: text("Add new"),
                            onClick: () => {
                                const insurance = new Insurance();
                                insurances.list.push(insurance);
                                this.selectedID = insurance._id;
                            },
                            iconProps: {
                                iconName: "Add"
                            }
                        }
                    ]
                    : [], heads: [text("Name"), text("Discount(%)"), text("Other Information")], rows: insurances.list.map(insurance => {
                    return {
                        id: insurance._id,
                        searchableString: insurance.searchableString,
                        cells: [
                            {
                                dataValue: insurance.name,
                                component: React.createElement(ProfileSquaredComponent, { text: insurance.name }),
                                onClick: () => {
                                    this.selectedID = insurance._id;
                                },
                                className: "no-label"
                            },
                            {
                                dataValue: insurance.discount,
                                component: React.createElement("p", null, insurance.discount),
                                className: "hidden-xs"
                            },
                            {
                                dataValue: insurance.information,
                                component: React.createElement("span", null, insurance.information),
                                className: "hidden-xs"
                            }
                        ]
                    };
                }), maxItemsOnLoad: 20 }),
            React.createElement("div", { className: "container-fluid m-t-20 quick" },
                React.createElement(SectionComponent, { title: text("Quick stats") },
                    React.createElement(Row, null,
                        React.createElement(Col, { sm: 8, xs: 12 },
                            React.createElement("label", null,
                                text("Profits"),
                                ":",
                                " ",
                                React.createElement(TagComponent, { text: statistics.totalProfits.toString(), type: TagType.primary }))),
                        React.createElement(Col, { sm: 8, xs: 12 },
                            React.createElement("label", null,
                                text("Expenses"),
                                ":",
                                " ",
                                React.createElement(TagComponent, { text: statistics.totalExpenses.toString(), type: TagType.warning }))),
                        React.createElement(Col, { sm: 8, xs: 12 },
                            React.createElement("label", null,
                                text("Net Profit"),
                                ":",
                                " ",
                                React.createElement(TagComponent, { text: "200", type: TagType.danger })))))),
            this.selectedInsurance ? (React.createElement(Panel, { isOpen: !!this.selectedInsurance, type: PanelType.medium, closeButtonAriaLabel: "Close", isLightDismiss: true, onDismiss: () => {
                    this.selectedID = "";
                }, onRenderNavigation: () => (React.createElement(Row, { className: "panel-heading" },
                    React.createElement(Col, { span: 20 }, this.selectedInsurance ? (React.createElement(ProfileSquaredComponent, { text: this.selectedInsurance.name, subText: `${text("Discount")}: ${this.selectedInsurance.discount}%` })) : (React.createElement("p", null))),
                    React.createElement(Col, { span: 4, className: "close" },
                        React.createElement(IconButton, { iconProps: { iconName: "cancel" }, onClick: () => {
                                this.selectedID = "";
                            } })))) },
                React.createElement("div", { className: "treatment-editor" },
                    React.createElement(SectionComponent, { title: text("Insurance Details") },
                        React.createElement("div", { className: "treatment-input" },
                            React.createElement(TextField, { label: text("Name"), value: this.selectedInsurance.name, onChange: (ev, val) => (insurances.list[this.selectedIndex].name = val), disabled: !this.canEdit }),
                            React.createElement(TextField, { label: text("Discount"), type: "number", value: this.selectedInsurance.discount.toString(), onChange: (ev, val) => (insurances.list[this.selectedIndex].discount = num(val)), prefix: "%", disabled: !this.canEdit }))),
                    React.createElement(SectionComponent, { title: text("Other Information") },
                        React.createElement(TextField, { multiline: true, disabled: !this.canEdit, label: text("Details"), value: this.selectedInsurance.information, onChange: (e, value) => {
                                insurances.list[this.selectedIndex].information = value;
                            } }))))) : ("")));
    }
};
tslib_1.__decorate([
    observable
], Insurances.prototype, "selectedID", void 0);
tslib_1.__decorate([
    computed
], Insurances.prototype, "canEdit", null);
tslib_1.__decorate([
    computed
], Insurances.prototype, "selectedIndex", null);
tslib_1.__decorate([
    computed
], Insurances.prototype, "selectedInsurance", null);
Insurances = tslib_1.__decorate([
    observer
], Insurances);
export { Insurances };
//# sourceMappingURL=page.insurance.js.map