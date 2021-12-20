import * as tslib_1 from "tslib";
import { status } from "@core";
import { staff } from "@modules";
import { computed, observable } from "mobx";
class UserData {
    constructor() {
        this.visible = false;
    }
    get currentUser() {
        return staff.list[staff.getIndexByID(status.currentUserID)];
    }
    get todayAppointments() {
        if (!this.currentUser) {
            return [];
        }
        else if (!this.currentUser.weeksAppointments) {
            return [];
        }
        else {
            return this.currentUser.weeksAppointments[new Date().toLocaleDateString("en-us", { weekday: "long" })];
        }
    }
}
tslib_1.__decorate([
    observable
], UserData.prototype, "visible", void 0);
tslib_1.__decorate([
    computed
], UserData.prototype, "currentUser", null);
export const user = new UserData();
//# sourceMappingURL=user.js.map