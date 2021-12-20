import * as tslib_1 from "tslib";
import { AsyncComponent, Col, fileTypes, PickAndUploadComponent, ProfileComponent, Row, SectionComponent } from "@common-components";
import { CEPHALOMETRIC_DIR, status, text, user } from "@core";
import { PatientGalleryPanel, setting } from "@modules";
import { formatDate } from "@utils";
import { computed, observable } from "mobx";
import { observer } from "mobx-react";
import { DefaultButton, IconButton, MessageBar, MessageBarType } from "office-ui-fabric-react";
import * as React from "react";
let OrthoGalleryPanel = class OrthoGalleryPanel extends React.Component {
    constructor() {
        super(...arguments);
        this.openCephalometricItem = undefined;
        this.cephalometricToViewIndex = -1;
    }
    get canEdit() {
        return user.currentUser.canEditOrtho;
    }
    get cephalometricToView() {
        return this.props.orthoCase.cephalometricHistory[this.cephalometricToViewIndex];
    }
    render() {
        return (React.createElement("div", null,
            this.props.orthoCase.patient ? (React.createElement(PatientGalleryPanel, { patient: this.props.orthoCase.patient })) : (""),
            this.openCephalometricItem ? (React.createElement(AsyncComponent, { key: "ortho-records", loader: () => tslib_1.__awaiter(this, void 0, void 0, function* () {
                    const Component = (yield import("./cephalometric"))
                        .CephalometricEditorPanel;
                    return this.openCephalometricItem ? (React.createElement(Component, { onDismiss: () => {
                            this.openCephalometricItem = undefined;
                            this.props.orthoCase.triggerUpdate++;
                        }, item: this.openCephalometricItem })) : (React.createElement("div", null));
                }) })) : (""),
            React.createElement(SectionComponent, { title: text(`Cephalometric Analysis`) }, status.online ? (status.dropboxActive ? (React.createElement("div", null,
                this.props.orthoCase.cephalometricHistory.map((c, i) => (React.createElement(Row, { key: c.imgPath, style: {
                        borderBottom: "1px solid #e3e3e3",
                        marginBottom: "25px"
                    } },
                    React.createElement(Col, { xs: 20 },
                        React.createElement("div", { style: {
                                marginBottom: 10,
                                cursor: "pointer"
                            }, onClick: () => {
                                this.cephalometricToViewIndex = i;
                            }, key: i },
                            React.createElement(ProfileComponent, { name: `${i + 1}: ${text("Analysis")} #${i + 1}`, secondaryElement: React.createElement("span", null, formatDate(c.date, setting.getSetting("date_format"))), size: 3, onClick: () => {
                                    this.openCephalometricItem = this.props.orthoCase.cephalometricHistory[i];
                                } }))),
                    React.createElement(Col, { xs: 4, style: {
                            textAlign: "right"
                        } },
                        React.createElement(IconButton, { iconProps: {
                                iconName: "trash"
                            }, onClick: () => this.props.orthoCase.cephalometricHistory.splice(i, 1) }))))),
                React.createElement(PickAndUploadComponent, { allowMultiple: false, accept: fileTypes.image, onFinish: (res) => tslib_1.__awaiter(this, void 0, void 0, function* () {
                        this.props.orthoCase.cephalometricHistory.push({
                            date: new Date().getTime(),
                            imgPath: res[0],
                            pointCoordinates: "{}"
                        });
                        this.openCephalometricItem = this.props.orthoCase.cephalometricHistory[this.props.orthoCase
                            .cephalometricHistory.length - 1];
                    }), targetDir: `${CEPHALOMETRIC_DIR}/${this.props.orthoCase._id}` },
                    React.createElement(DefaultButton, { iconProps: { iconName: "Add" }, text: text("New analysis") })))) : (React.createElement(MessageBar, { messageBarType: MessageBarType.warning }, text("A valid DropBox access token is required for this section")))) : (React.createElement(MessageBar, { messageBarType: MessageBarType.warning }, text("You can not access cephalometric data while offline"))))));
    }
};
tslib_1.__decorate([
    observable
], OrthoGalleryPanel.prototype, "openCephalometricItem", void 0);
tslib_1.__decorate([
    observable
], OrthoGalleryPanel.prototype, "cephalometricToViewIndex", void 0);
tslib_1.__decorate([
    computed
], OrthoGalleryPanel.prototype, "canEdit", null);
tslib_1.__decorate([
    computed
], OrthoGalleryPanel.prototype, "cephalometricToView", null);
OrthoGalleryPanel = tslib_1.__decorate([
    observer
], OrthoGalleryPanel);
export { OrthoGalleryPanel };
//# sourceMappingURL=ortho-gallery.js.map