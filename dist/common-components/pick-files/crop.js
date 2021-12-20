import * as tslib_1 from "tslib";
import { Col, GridTableComponent, Row } from "@common-components";
import { text } from "@core";
import { generateID } from "@utils";
import { observable } from "mobx";
import { observer } from "mobx-react";
import { CommandBar, Dialog, IconButton, Slider, TooltipHost } from "office-ui-fabric-react";
import * as React from "react";
import * as ImageEditor from "react-avatar-editor";
const Editor = ImageEditor.default || ImageEditor;
const MAX_ZOOM = 5;
const MIN_ZOOM = 0.3;
let CropComponent = class CropComponent extends React.Component {
    constructor() {
        super(...arguments);
        this.unique = generateID(20).replace(/[^a-z]/g, "");
        this.overlay = false;
        this.zoom = 1;
        this.baseRotation = 1;
        this.addedRotation = 1;
        this.showGrid = true;
    }
    render() {
        return (React.createElement("div", { className: "crop-modal" },
            React.createElement(Dialog, { modalProps: { className: "crop-dialog" }, hidden: false, onDismiss: () => this.props.onDismiss() },
                React.createElement("div", { className: "editor" },
                    this.showGrid ? React.createElement(GridTableComponent, null) : "",
                    this.overlay ? (React.createElement("img", { src: this.props.prevSrc, className: "prev-overlay" })) : (""),
                    React.createElement(Editor, { className: this.unique, image: this.props.src, width: 280, height: 530, color: [0, 0, 0, 0.6], scale: this.zoom, rotate: this.baseRotation + this.addedRotation, border: 0 })),
                React.createElement("div", { className: "crop-controls" },
                    React.createElement(Row, { gutter: 0 },
                        React.createElement(Col, { span: 12 },
                            React.createElement(Row, { gutter: 0 },
                                React.createElement(Col, { span: 16 },
                                    React.createElement(Slider, { min: MIN_ZOOM * 100, max: MAX_ZOOM * 100, value: this.zoom * 100, onChange: v => {
                                            this.zoom = v / 100;
                                        }, label: text(`Zoom`), showValue: false })),
                                React.createElement(Col, { span: 4 },
                                    React.createElement(TooltipHost, { content: text("Flip horizontal") },
                                        React.createElement(IconButton, { onClick: () => {
                                                const canvas = document.querySelectorAll("." + this.unique)[0];
                                                const context = canvas.getContext("2d");
                                                context.translate(context.canvas.width, 0);
                                                context.scale(-1, 1);
                                                this.forceUpdate();
                                            }, iconProps: {
                                                iconName: "More"
                                            } }))),
                                React.createElement(Col, { span: 4 },
                                    React.createElement(TooltipHost, { content: text("Flip vertical") },
                                        React.createElement(IconButton, { onClick: () => {
                                                const canvas = document.querySelectorAll("." + this.unique)[0];
                                                const context = canvas.getContext("2d");
                                                context.translate(0, context.canvas.height);
                                                context.scale(1, -1);
                                                this.forceUpdate();
                                            }, iconProps: {
                                                iconName: "MoreVertical"
                                            } }))))),
                        React.createElement(Col, { span: 12 },
                            React.createElement(Row, { gutter: 0 },
                                React.createElement(Col, { span: 16 },
                                    React.createElement(Slider, { min: -45, max: 45, value: this.addedRotation, onChange: v => {
                                            if (v !== -1) {
                                                this.addedRotation = v;
                                            }
                                        }, label: text(`Rotation`), showValue: false })),
                                React.createElement(Col, { span: 4 },
                                    React.createElement(TooltipHost, { content: text("Rotate clockwise") },
                                        React.createElement(IconButton, { onClick: () => {
                                                this.baseRotation =
                                                    this.baseRotation - 90;
                                            }, iconProps: {
                                                iconName: "Rotate90Clockwise"
                                            } }))),
                                React.createElement(Col, { span: 4 },
                                    React.createElement(TooltipHost, { content: "Rotate anti-clockwise" },
                                        React.createElement(IconButton, { onClick: () => {
                                                this.baseRotation =
                                                    this.baseRotation + 90;
                                            }, iconProps: {
                                                iconName: "Rotate90CounterClockwise"
                                            } }))))))),
                React.createElement(CommandBar, { items: [
                        {
                            key: "grid",
                            text: text("Grid"),
                            iconProps: { iconName: "GridViewSmall" },
                            className: this.showGrid
                                ? "active-button"
                                : undefined,
                            active: true,
                            onClick: () => {
                                this.showGrid = !this.showGrid;
                            }
                        },
                        {
                            key: "overlay",
                            text: text("Overlay"),
                            iconProps: { iconName: "MapLayers" },
                            className: this.overlay
                                ? "active-button"
                                : undefined,
                            onClick: () => {
                                this.overlay = !this.overlay;
                            },
                            hidden: !this.props.prevSrc
                        }
                    ], farItems: [
                        {
                            key: "save",
                            text: text("Save"),
                            iconProps: { iconName: "save" },
                            classNames: "abc",
                            onClick: () => {
                                const canvas = document.querySelectorAll("." + this.unique)[0];
                                this.props.onSave(canvas.toDataURL());
                            }
                        },
                        {
                            key: "cancel",
                            text: text("Cancel"),
                            iconProps: { iconName: "cancel" },
                            classNames: "abc",
                            onClick: () => {
                                this.props.onDismiss();
                            }
                        }
                    ] }))));
    }
};
tslib_1.__decorate([
    observable
], CropComponent.prototype, "unique", void 0);
tslib_1.__decorate([
    observable
], CropComponent.prototype, "overlay", void 0);
tslib_1.__decorate([
    observable
], CropComponent.prototype, "zoom", void 0);
tslib_1.__decorate([
    observable
], CropComponent.prototype, "baseRotation", void 0);
tslib_1.__decorate([
    observable
], CropComponent.prototype, "addedRotation", void 0);
tslib_1.__decorate([
    observable
], CropComponent.prototype, "showGrid", void 0);
CropComponent = tslib_1.__decorate([
    observer
], CropComponent);
export { CropComponent };
//# sourceMappingURL=crop.js.map