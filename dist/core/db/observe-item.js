import * as tslib_1 from "tslib";
import { singleItemUpdateQue } from "./single-item-update-que";
import { diff } from "fast-array-diff";
import { isObservableArray, observe, toJS as normalizeArray } from "mobx";
export function observeItem(item, data, methods) {
    observe(item, change => {
        if (change.type !== "update") {
            return;
        }
        if (data.ignoreObserver) {
            return;
        }
        if (isObservableArray(change.newValue)) {
            const diffs = diff(normalizeArray(change.oldValue), normalizeArray(change.newValue));
            if (!(diffs.added.length || diffs.removed.length)) {
                return;
            }
        }
        // check to see if we have already queued an update for this item
        const existingIndex = singleItemUpdateQue.findIndex(single => single.id === item._id);
        // delete if it's there
        if (existingIndex !== -1) {
            singleItemUpdateQue.splice(existingIndex, 1);
        }
        // que the new update
        singleItemUpdateQue.push({
            id: item._id,
            update: () => tslib_1.__awaiter(this, void 0, void 0, function* () { return yield methods.update(item._id, item); })
        });
    });
}
//# sourceMappingURL=observe-item.js.map