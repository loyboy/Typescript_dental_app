import * as tslib_1 from "tslib";
export let singleItemUpdateQue = [];
setInterval(function () {
    if (singleItemUpdateQue.length) {
        singleItemUpdateQue.forEach((single) => tslib_1.__awaiter(this, void 0, void 0, function* () { return yield single.update(); }));
        singleItemUpdateQue = [];
    }
}, 1500);
//# sourceMappingURL=single-item-update-que.js.map