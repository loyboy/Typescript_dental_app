import * as tslib_1 from "tslib";
import { Col, Row } from "@common-components";
import { text } from "@core";
import { orthoCases, setting } from "@modules";
import { formatDate } from "@utils";
import { observable } from "mobx";
import { observer } from "mobx-react";
import { DatePicker, Icon, IconButton, Panel, PanelType } from "office-ui-fabric-react";
import * as React from "react";
let CephalometricEditorPanel = class CephalometricEditorPanel extends React.Component {
    constructor() {
        super(...arguments);
        this.loading = true;
    }
    componentDidMount() {
        setTimeout(() => tslib_1.__awaiter(this, void 0, void 0, function* () {
            const iFrame = document.getElementById("cephalometric");
            iFrame.onload = () => {
                orthoCases.toCephString(this.props.item).then(cephString => {
                    iFrame.contentWindow.postMessage("cephalometric-open:" + cephString, "*");
                    this.loading = false;
                });
            };
            // wait for response
            onmessage = e => {
                if (e.data && typeof e.data === "string") {
                    if (e.data.startsWith("cephalometric-save:")) {
                        this.props.item.pointCoordinates = orthoCases.getCephCoordinates(e.data.split("cephalometric-save:")[1]);
                        this.props.onDismiss();
                        orthoCases.triggerUpdate++;
                    }
                }
            };
        }), 100);
    }
    render() {
        return (React.createElement(Panel, { isOpen: !!this.props.item, type: PanelType.largeFixed, closeButtonAriaLabel: "Close", isLightDismiss: true, onDismiss: () => {
                this.props.onDismiss();
            }, className: "ex-pnl", onRenderNavigation: () => {
                return (React.createElement(Row, { className: "panel-heading" },
                    React.createElement(Col, { span: 22 },
                        React.createElement("input", { style: {
                                height: 0,
                                width: 0,
                                position: "absolute"
                            } }),
                        React.createElement(DatePicker, { placeholder: text("Select a date"), value: new Date(this.props.item.date), onSelectDate: date => {
                                if (date) {
                                    this.props.item.date = new Date(date).getTime();
                                }
                            }, formatDate: d => formatDate(d || 0, setting.getSetting("date_format")) })),
                    React.createElement(Col, { span: 2, className: "close" },
                        React.createElement(IconButton, { iconProps: { iconName: "cancel" }, onClick: () => {
                                this.props.onDismiss();
                            } }))));
            } },
            React.createElement("iframe", { style: { display: this.loading ? "none" : "block" }, id: "cephalometric", src: "https://cephalometric.apexo.app" }),
            this.loading ? (React.createElement("div", { style: {
                    fontSize: 38,
                    marginTop: 60,
                    textAlign: "center"
                } },
                React.createElement(Icon, { iconName: "sync", className: "rotate" }))) : ("")));
    }
};
tslib_1.__decorate([
    observable
], CephalometricEditorPanel.prototype, "loading", void 0);
CephalometricEditorPanel = tslib_1.__decorate([
    observer
], CephalometricEditorPanel);
export { CephalometricEditorPanel };
//# sourceMappingURL=cephalometric.js.map