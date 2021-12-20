import * as tslib_1 from "tslib";
import { files, modals, text } from "@core";
import { patients } from "@modules";
import { escapeRegExp } from "@utils";
import { computed, observable } from "mobx";
class EndoCases {
    constructor() {
        this.triggerUpdate = 0;
        this.ignoreObserver = false;
        this.list = [];
        this.filter = "";
    }
    get filtered() {
        if (this.filter === "") {
            return this.list;
        }
        else {
            const filters = this.filter
                .split(" ")
                .map(filterString => new RegExp(escapeRegExp(filterString), "gim"));
            return this.list.filter(endoCase => filters.every(filter => filter.test(JSON.stringify(endoCase))));
        }
    }
    get allPatientsIDs() {
        return this.list.map(orthoCase => orthoCase.patientID);
    }
    get patientsWithNoOrtho() {
        return patients.list.filter(patient => this.allPatientsIDs.indexOf(patient._id) === -1);
    }
    toCephString(obj) {
        return new Promise((resolve, reject) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            const img = yield files.get(obj.imgPath);
            const i = new Image();
            i.onload = function () {
                const data = `{"imgSource":{"source":"${img}","height":${i.height},"width":${i.width}},"currentAnalysisName":"basic","pointCoordinates":${obj.pointCoordinates ? obj.pointCoordinates : "{}"}}`;
                resolve(data);
            };
            i.src = img;
        }));
    }
    getCephCoordinates(string) {
        return JSON.stringify(JSON.parse(string).pointCoordinates);
    }
    getIndexByID(id) {
        return this.list.findIndex(x => x._id === id);
    }
    deleteByPatientID(id) {
        const ortho = this.list.find(o => o.patientID === id);
        if (ortho) {
            this.deleteByID(ortho._id);
        }
    }
    deleteByID(id) {
        const i = this.getIndexByID(id);
        const orthoCase = this.list.splice(i, 1)[0];
    }
    deleteModal(id) {
        const i = this.getIndexByID(id);
        const orthoCase = this.list[i];
        modals.newModal({
            message: text(`Endodontic case will be deleted`),
            onConfirm: () => this.deleteByID(id),
            showCancelButton: true,
            showConfirmButton: true,
            input: false,
            id: Math.random()
        });
    }
}
tslib_1.__decorate([
    observable
], EndoCases.prototype, "triggerUpdate", void 0);
tslib_1.__decorate([
    observable
], EndoCases.prototype, "list", void 0);
tslib_1.__decorate([
    observable
], EndoCases.prototype, "filter", void 0);
tslib_1.__decorate([
    computed
], EndoCases.prototype, "filtered", null);
tslib_1.__decorate([
    computed
], EndoCases.prototype, "allPatientsIDs", null);
tslib_1.__decorate([
    computed
], EndoCases.prototype, "patientsWithNoOrtho", null);
export const endoCases = new EndoCases();
//# sourceMappingURL=data.ortho.js.map