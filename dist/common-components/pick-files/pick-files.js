import * as tslib_1 from "tslib";
import { AsyncComponent } from "@common-components";
import { files } from "@core";
import { generateID, second } from "@utils";
import { observable } from "mobx";
import { observer } from "mobx-react";
import { Icon } from "office-ui-fabric-react";
import * as React from "react";
function dataURItoBlob(dataURI) {
    const byteString = atob(dataURI.split(",")[1]);
    // separate out the mime component
    const mimeString = dataURI
        .split(",")[0]
        .split(":")[1]
        .split(";")[0];
    // write the bytes of the string to an ArrayBuffer
    const ab = new ArrayBuffer(byteString.length);
    // create a view into the buffer
    const ia = new Uint8Array(ab);
    // set the bytes of the buffer to the correct values
    for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }
    // write the ArrayBuffer to a blob, and you're done
    const blob = new Blob([ab], { type: mimeString });
    return blob;
}
export const fileTypes = {
    image: ["png", "jpg", "jpeg", "gif", "image/png", "image/gif", "image/jpeg"]
};
let PickAndUploadComponent = class PickAndUploadComponent extends React.Component {
    constructor() {
        super(...arguments);
        this.resultArr = [];
        this.toCrop = {};
        this.loading = false;
        this.filesNumber = 0;
    }
    render() {
        return (React.createElement("div", { onClick: () => this.click() },
            React.createElement("input", { type: "file", multiple: this.props.allowMultiple, ref: el => (el ? (this.pickFileEl = el) : ""), className: "hidden", accept: this.props.accept.join(","), onChange: () => {
                    const fileList = this.pickFileEl.files;
                    if (!fileList || !fileList[0]) {
                        return;
                    }
                    this.loading = true;
                    if (this.props.onStartLoading) {
                        this.props.onStartLoading();
                    }
                    this.filesNumber = fileList.length;
                    for (let index = 0; index < fileList.length; index++) {
                        const file = fileList.item(index);
                        const reader = new FileReader();
                        reader.onload = (event) => tslib_1.__awaiter(this, void 0, void 0, function* () {
                            const base64DataURI = event.target
                                .result;
                            if (this.props.crop) {
                                this.toCrop[generateID()] = base64DataURI;
                            }
                            else {
                                this.saveBase64(base64DataURI);
                            }
                        });
                        reader.readAsDataURL(file);
                    }
                    const checkInterval = setInterval(() => {
                        if (this.resultArr.length !== this.filesNumber) {
                            return;
                        }
                        this.pickFileEl.value = "";
                        this.loading = false;
                        if (this.props.onFinishLoading) {
                            this.props.onFinishLoading();
                        }
                        this.props.onFinish(this.resultArr.filter(x => x));
                        clearInterval(checkInterval);
                    }, second / 2);
                } }),
            this.loading ? (React.createElement("div", null,
                React.createElement(Icon, { iconName: "sync", className: "rotate" }),
                Object.keys(this.toCrop).map(id => {
                    return (React.createElement(AsyncComponent, { key: "", loader: () => tslib_1.__awaiter(this, void 0, void 0, function* () {
                            const CropComponent = (yield import("./crop"))
                                .CropComponent;
                            return (React.createElement(CropComponent, { key: id, src: this.toCrop[id], prevSrc: this.props.prevSrc || "", onSave: result => {
                                    this.saveBase64(result);
                                    delete this.toCrop[id];
                                }, onDismiss: () => {
                                    this.filesNumber--;
                                    delete this.toCrop[id];
                                } }));
                        }) }));
                }))) : (this.props.children)));
    }
    click() {
        if (!this.props.disabled) {
            this.pickFileEl.click();
        }
    }
    saveBase64(base64DataURI) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const blob = dataURItoBlob(base64DataURI);
            const filePath = yield files.save(blob, base64DataURI.replace(/data:[a-z]*\/([a-z]*);.*/, "$1"), this.props.targetDir);
            this.resultArr.push(filePath);
        });
    }
};
tslib_1.__decorate([
    observable
], PickAndUploadComponent.prototype, "resultArr", void 0);
tslib_1.__decorate([
    observable
], PickAndUploadComponent.prototype, "toCrop", void 0);
tslib_1.__decorate([
    observable
], PickAndUploadComponent.prototype, "loading", void 0);
tslib_1.__decorate([
    observable
], PickAndUploadComponent.prototype, "filesNumber", void 0);
PickAndUploadComponent = tslib_1.__decorate([
    observer
], PickAndUploadComponent);
export { PickAndUploadComponent };
//# sourceMappingURL=pick-files.js.map