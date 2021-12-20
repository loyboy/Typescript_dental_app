import * as tslib_1 from "tslib";
import { observable } from "mobx";
export class SettingsItem {
    constructor(json) {
        this._id = "";
        this.val = "";
        if (json) {
            this.fromJSON(json);
        }
    }
    toJSON() {
        return {
            _id: this._id,
            val: this.val
        };
    }
    fromJSON(json) {
        this._id = json._id;
        this.val = json.val;
    }
}
tslib_1.__decorate([
    observable
], SettingsItem.prototype, "_id", void 0);
tslib_1.__decorate([
    observable
], SettingsItem.prototype, "val", void 0);
//# sourceMappingURL=class.setting.js.map