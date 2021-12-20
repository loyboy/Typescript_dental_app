import * as tslib_1 from "tslib";
import { observeItem } from "@core";
import { diff } from "fast-array-diff";
export function generateMethods(db, data, Class) {
    const methods = {
        /**
         * Put the MobX store list into the database by diffing the new store with the cache
         *
         */
        syncListToDatabase(newList) {
            return tslib_1.__awaiter(this, void 0, void 0, function* () {
                const current = yield db.allDocs({});
                const currentIDs = current.rows.map(x => x.id);
                // diff
                const result = diff(currentIDs.sort(), newList.map(x => x._id).sort());
                // remove the removed
                result.removed.forEach(_id => {
                    methods.remove(_id);
                });
                // add the added
                result.added.forEach(_id => {
                    const document = newList.find(doc => doc._id === _id);
                    if (!document) {
                        return;
                    }
                    observeItem(document, data, methods);
                    methods.add(document);
                });
            });
        },
        add(item) {
            return tslib_1.__awaiter(this, void 0, void 0, function* () {
                const response = yield db.put(item.toJSON());
                return response;
            });
        },
        remove(_id) {
            return tslib_1.__awaiter(this, void 0, void 0, function* () {
                const doc = yield db.get(_id);
                doc._deleted = true;
                const response = yield db.put(doc);
                return response;
            });
        },
        update(_id, item) {
            return tslib_1.__awaiter(this, void 0, void 0, function* () {
                const document = item.toJSON();
                const doc = yield db.get(_id);
                document._rev = doc._rev;
                const response = yield db.put(document);
                return response;
            });
        }
    };
    return methods;
}
//# sourceMappingURL=generate-methods.js.map