import * as tslib_1 from "tslib";
import { modals, text } from "@core";
import { escapeRegExp } from "@utils";
import { computed, observable } from "mobx";
class Consents {
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
    getIndexByID(id) {
        return this.list.findIndex(x => x._id === id);
    }
    deleteModal(id) {
        const i = this.getIndexByID(id);
        const consent = this.list[i];
        modals.newModal({
            message: `${text("Consent with ID: ")} "${consent._id}" ${text("will be deleted")}`,
            onConfirm: () => {
                this.deleteByID(id);
            },
            showCancelButton: true,
            showConfirmButton: true,
            input: false,
            id: Math.random()
        });
    }
    deleteByID(id) {
        const i = this.getIndexByID(id);
        const consents = this.list.splice(i, 1)[0];
    }
}
tslib_1.__decorate([
    observable
], Consents.prototype, "triggerUpdate", void 0);
tslib_1.__decorate([
    observable
], Consents.prototype, "list", void 0);
tslib_1.__decorate([
    observable
], Consents.prototype, "filter", void 0);
tslib_1.__decorate([
    computed
], Consents.prototype, "filtered", null);
export const consents = new Consents();
//# sourceMappingURL=data.consents.js.map