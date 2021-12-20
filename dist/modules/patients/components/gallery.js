import * as tslib_1 from "tslib";
import { fileTypes, PickAndUploadComponent, SectionComponent } from "@common-components";
import { files, GALLERIES_DIR, status, text } from "@core";
import { diff } from "fast-array-diff";
import { computed, observable, observe } from "mobx";
import { observer } from "mobx-react";
import { Icon, IconButton, MessageBar, MessageBarType, TooltipHost } from "office-ui-fabric-react";
import { Slider } from 'office-ui-fabric-react/lib/Slider';
import * as React from "react";
// import {
// 	Magnifier,
// 	MOUSE_ACTIVATION,
// 	TOUCH_ACTIVATION,
//   } from "react-image-magnifiers";
// @ts-ignore
import PinchZoomPan from "react-responsive-pinch-zoom-pan";
let PatientGalleryPanel = class PatientGalleryPanel extends React.Component {
    constructor() {
        super(...arguments);
        this.uploading = false;
        this.selectedImagePath = "";
        this.imagesTable = {};
        this.stopObservation = function () { };
        this.state = {
            value: 0,
            zoom: 1,
            startPosX: 0,
            startPosY: 0,
            endPosX: 0,
            endPosY: 0,
        };
    }
    get canEdit() {
        // return user.currentUser.canEditPatients;
        return true;
    }
    get selectedImageURI() {
        return this.imagesTable[this.selectedImagePath];
    }
    render() {
        //console.log('status: ', status);
        // const { endPosX: x2, endPosY: y2, startPosX: x1, startPosY: y1, zoom } = this.state;
        // let bgWidth = 430;
        // let movePercentage = {
        // 	x: 100 * (x2 - x1) / bgWidth,
        // 	y: 100 * (y2 - y1) / bgWidth,
        // };
        // let actualMovePercentage = {
        // 	// x: 0.7 / (1 - zoom / 100) * movePercentage.x,
        // 	// y: 0.7 / (1 - zoom / 100) * movePercentage.y,
        // 	x: movePercentage.x,
        // 	y: movePercentage.y,
        // };
        //console.log(actualMovePercentage);
        return (React.createElement(SectionComponent, { title: text(`Patient Gallery`) },
            status.online || true ? (status.dropboxActive ? (React.createElement("div", { className: "spg-p" },
                this.props.patient.gallery.length === 0 ? (React.createElement(MessageBar, { messageBarType: MessageBarType.info }, text("This patient does not seem to have any photo record uploaded, press the plus sign button below to start uploading"))) : (""),
                React.createElement("br", null),
                React.createElement("div", { className: "thumbs" },
                    this.canEdit ? (this.uploading ? (React.createElement(Icon, { iconName: "sync", className: "rotate", style: { padding: 10 } })) : (React.createElement(PickAndUploadComponent, { allowMultiple: true, accept: fileTypes.image, onFinish: paths => {
                            //console.log(paths);
                            this.props.patient.gallery.push(...paths);
                            paths.forEach((path) => tslib_1.__awaiter(this, void 0, void 0, function* () {
                                yield this.addImage(path);
                            }));
                        }, onStartLoading: () => {
                            this.uploading = true;
                        }, onFinishLoading: () => {
                            this.uploading = false;
                        }, targetDir: `${GALLERIES_DIR}/${this.props.patient._id}` },
                        React.createElement(TooltipHost, { content: text("Add photo") },
                            React.createElement(IconButton, { className: `add-photo`, iconProps: {
                                    iconName: "Photo2Add"
                                } }))))) : (""),
                    Object.keys(this.imagesTable).map(imagePath => {
                        const URI = this.imagesTable[imagePath];
                        return URI ? (React.createElement("span", { className: `thumb ${this.selectedImagePath ===
                                imagePath
                                ? "selected"
                                : ""}`, key: imagePath, style: {
                                backgroundImage: `url('${URI ? URI : ""}')`,
                                filter: 'grayscale(95%)'
                            }, onClick: () => {
                                this.selectedImagePath = imagePath;
                            } })) : (React.createElement("div", { key: imagePath + "-placeholder", className: "placeholder" },
                            React.createElement(Icon, { iconName: "sync", className: "rotate" })));
                    })),
                React.createElement("div", { className: "viewport", 
                    //onMouseDown={e => this.setState({startPosX: e.clientX, startPosY: e.clientY})}
                    //onMouseUp={e => this.setState({endPosX: 0, endPosY: 0, startPosX: 0, startPosY: 0})}
                    //onMouseMove={e => {
                    //if(this.state.startPosX > 0 || this.state.startPosY > 0){
                    //this.setState({endPosX:  e.pageX, endPosY: e.pageY})
                    //}
                    //}}
                    style: {
                        height: 300,
                        width: 430,
                    } }, this.selectedImagePath ? (React.createElement(React.Fragment, null,
                    React.createElement(IconButton, { className: "delete-photo", iconProps: { iconName: "trash" }, onClick: () => tslib_1.__awaiter(this, void 0, void 0, function* () {
                            yield this.removeImage(this.selectedImagePath);
                            this.selectedImagePath = "";
                        }) }),
                    React.createElement(PinchZoomPan, { maxScale: 100, scale: this.state.zoom, zoomButtons: false, filterValue: this.state.value },
                        React.createElement("img", { alt: 'image', src: `${this.selectedImageURI}` })))) : ("")))) : (React.createElement(MessageBar, { messageBarType: MessageBarType.warning }, text("A valid DropBox access token is required for this section")))) : (React.createElement(MessageBar, { messageBarType: MessageBarType.warning }, text("You can not access patient gallery while offline"))),
            React.createElement("div", { style: { clear: "both" } }),
            React.createElement("div", { style: { padding: '32px 16px 8px 16px' } },
                React.createElement("div", null,
                    React.createElement(Slider, { label: "Grayscale", max: 100, ariaValueText: (value) => `${value} percent`, valueFormat: (value) => `${value}%`, showValue: true, onChange: (value) => this.setState({ value }) })),
                React.createElement("div", null,
                    React.createElement(Slider, { label: "Zoom", max: 100, ariaValueText: (value) => `${value} percent`, valueFormat: (value) => `${value}%`, showValue: true, onChange: (zoom) => {
                            this.setState({ zoom });
                            //this.viewport.current.style.transform = `scale(430 + (430 * ${this.state.zoom}/100), 300 + (300 * ${this.state.zoom}/100))`;
                        } })))));
    }
    componentDidMount() {
        this.props.patient.gallery.forEach((path) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            yield this.addImage(path);
        }));
        this.stopObservation = this.observe();
        // 		const el = this.viewport.current;
        // if(el){
        // 	el.addEventListener('mousemove', (e) => {
        // 		el.style.backgroundPositionX = -e.offsetX + "px";
        // 		el.style.backgroundPositionY = -e.offsetY + "px";
        // 	});
        // }
    }
    componentWillUnmount() {
        this.stopObservation();
    }
    addImage(path) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            this.imagesTable[path] = "";
            const uri = yield files.get(path);
            this.imagesTable[path] = uri;
            return;
        });
    }
    removeImage(path) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            yield files.remove(this.selectedImagePath);
            const selectedImageIndex = this.props.patient.gallery.indexOf(this.selectedImagePath);
            this.props.patient.gallery.splice(selectedImageIndex, 1);
            delete this.imagesTable[path];
            return;
        });
    }
    observe() {
        return observe(this.props.patient, change => {
            if (change.name === "gallery") {
                const diffResult = diff(Object.keys(this.imagesTable), this.props.patient.gallery);
                diffResult.added.forEach(path => {
                    this.addImage(path);
                });
                diffResult.removed.forEach(path => {
                    this.removeImage(path);
                });
            }
        });
    }
};
tslib_1.__decorate([
    computed
], PatientGalleryPanel.prototype, "canEdit", null);
tslib_1.__decorate([
    observable
], PatientGalleryPanel.prototype, "uploading", void 0);
tslib_1.__decorate([
    observable
], PatientGalleryPanel.prototype, "selectedImagePath", void 0);
tslib_1.__decorate([
    observable
], PatientGalleryPanel.prototype, "imagesTable", void 0);
tslib_1.__decorate([
    computed
], PatientGalleryPanel.prototype, "selectedImageURI", null);
PatientGalleryPanel = tslib_1.__decorate([
    observer
], PatientGalleryPanel);
export { PatientGalleryPanel };
//# sourceMappingURL=gallery.js.map