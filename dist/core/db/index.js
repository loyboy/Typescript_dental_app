import * as tslib_1 from "tslib";
import { configs, generateMethods, log, observeItem, singleItemUpdateQue } from "@core";
import { status } from "@core";
import { store } from "@utils";
import { observe } from "mobx";
import { Md5 } from "ts-md5";
export const resync = {
    modules: [],
    resync: function () {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return new Promise(resolve => {
                let done = 0;
                this.modules.forEach(module => {
                    module
                        .resync()
                        .then(() => done++)
                        .catch(() => done++);
                });
                const checkInterval = setInterval(() => {
                    if (done === this.modules.length) {
                        resolve(true);
                        clearInterval(checkInterval);
                    }
                }, 300);
            });
        });
    }
};
export const compact = {
    compactMethods: [],
    compact: function () {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return new Promise(resolve => {
                let done = 0;
                this.compactMethods.forEach(compactMethod => {
                    compactMethod()
                        .then(() => done++)
                        .catch(() => done++);
                });
                const checkInterval = setInterval(() => {
                    if (done === this.compactMethods.length) {
                        resolve(true);
                        clearInterval(checkInterval);
                    }
                }, 300);
            });
        });
    }
};
export const destroyLocal = {
    destroyMethods: [],
    destroy: function () {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return new Promise(resolve => {
                let done = 0;
                this.destroyMethods.forEach(destroyMethod => {
                    destroyMethod()
                        .then(() => done++)
                        .catch(() => done++);
                });
                const checkInterval = setInterval(() => {
                    if (done === this.destroyMethods.length) {
                        resolve(true);
                        clearInterval(checkInterval);
                    }
                }, 300);
            });
        });
    }
};
export function connectToDB(dbName, moduleNamespace, shouldLog = false) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const PouchDB = (yield import("pouchdb-browser"))
            .default;
        const cryptoPouch = (yield import("crypto-pouch"))
            .default;
        PouchDB.plugin(cryptoPouch);
        const unique = Md5.hashStr(store.get("LSL_hash")).toString();
        // prefixing local DB name
        const localName = dbName + "_" + unique;
        /**
         * Connection object
         */
        const localDatabase = new PouchDB(localName);
        localDatabase.crypto(unique);
        const remoteDatabase = new PouchDB(`${status.server}/${dbName}`, {
            fetch: (url, opts) => PouchDB.fetch(url, Object.assign({}, opts, { credentials: "include" }))
        });
        configs[dbName] = {
            shouldLog: shouldLog
        };
        return function (Class, data) {
            return tslib_1.__awaiter(this, void 0, void 0, function* () {
                // start with the basics
                const methods = generateMethods(localDatabase, data, Class);
                /**
                 * First of all we have three places to store data
                 * 1. remote DB
                 * 2. local DB
                 * 3. MobX Store
                 * We need to pass the data like this:
                 * [Remote DB] ====> [Local DB] =====> [MobX Store]
                 * **/
                try {
                    yield localDatabase.sync(remoteDatabase);
                }
                catch (e) {
                    try {
                        yield localDatabase.sync(remoteDatabase);
                    }
                    catch (e) {
                        console.log("Sync", dbName, "Failed", e);
                    }
                }
                const response = (yield localDatabase.allDocs({ include_docs: true })).rows.map(x => x.doc) || [];
                data.ignoreObserver = true;
                const newData = response.map(x => new Class(x));
                data.list = newData;
                /**
                 * Watching the data on the other hand should be in reverse
                 * [MobX Store] ====> [Local DB] ====> [Remote DB]
                 * However we need to watch the list as a whole
                 * and to watch document by document
                 * **/
                // Watch the list as a whole
                observe(data.list, change => {
                    // only if we're not ignoring it (i.e. we're not syncing from database, thus preventing cycles)
                    if (!data.ignoreObserver) {
                        methods.syncListToDatabase(data.list);
                    }
                });
                // Watch document by document
                data.list.forEach((item, index) => observeItem(item, data, methods));
                data.ignoreObserver = false;
                // watch the local database for changes
                localDatabase
                    .changes({
                    since: "now",
                    live: true,
                    include_docs: true,
                    limit: 1
                })
                    .on("change", function (change) {
                    return tslib_1.__awaiter(this, void 0, void 0, function* () {
                        // this function can be called either by a change in the remote DB
                        // that has just synced to the local DB
                        // and thus needs to be reflected on the MobX stores
                        // Remote DB ====> Local DB ===(this function)===> Mobx
                        // or by a change in the MobX store
                        // that has been done also in the local database
                        // and thus needs to be synced to the remote DB
                        // Remote DB <====(this function)=== Local DB <==== MobX
                        // first we'll try to detect if it's a remote change
                        const newDoc = change.doc;
                        const id = change.id;
                        const mobxIndex = data.list.findIndex(x => x._id === id);
                        const mobxDocHash = mobxIndex !== -1
                            ? Md5.hashStr(JSON.stringify(data.list[mobxIndex].toJSON())).toString()
                            : "";
                        const newDoHash = change.deleted
                            ? ""
                            : Md5.hashStr(JSON.stringify(new Class(change.doc).toJSON())).toString();
                        // it's found in mobX but it's deleted
                        const remoteDeletion = mobxIndex !== -1 && change.deleted === true;
                        // it's found in mobX, and it's not deleted, and the new document isn't equal to the old document
                        const remoteUpdate = mobxIndex !== -1 &&
                            change.deleted !== true &&
                            mobxDocHash !== newDoHash;
                        // it's not found in mobx and it's not deleted
                        const remoteAddition = mobxIndex === -1 && change.deleted !== true;
                        if (remoteAddition || remoteDeletion || remoteUpdate) {
                            data.ignoreObserver = true;
                            // if it's a deletion
                            if (remoteDeletion) {
                                data.list.splice(mobxIndex, 1);
                            }
                            else if (remoteAddition) {
                                // if it's an addition
                                data.list.push(new Class(newDoc));
                            }
                            else if (remoteUpdate) {
                                // if it's an update
                                // if there's another update that will carry on the same document
                                // don't update the MobX store just now
                                if (singleItemUpdateQue.find(x => x.id === id)) {
                                }
                                else {
                                    data.list[mobxIndex].fromJSON(newDoc);
                                    observeItem(data.list[mobxIndex], data, methods);
                                }
                            }
                            data.ignoreObserver = false;
                        }
                        else {
                            localDatabase.replicate.to(remoteDatabase);
                        }
                    });
                })
                    .on("error", err => log(dbName, "Error occurred", err));
                resync.modules.push({
                    namespace: moduleNamespace,
                    resync: () => tslib_1.__awaiter(this, void 0, void 0, function* () {
                        console.log(`Syncing ${moduleNamespace}`);
                        yield localDatabase.sync(remoteDatabase);
                    })
                });
                compact.compactMethods.push(() => tslib_1.__awaiter(this, void 0, void 0, function* () {
                    console.log("local compaction on", dbName, yield localDatabase.compact());
                    console.log("remote compaction on", dbName, yield remoteDatabase.compact());
                }));
                destroyLocal.destroyMethods.push(() => tslib_1.__awaiter(this, void 0, void 0, function* () {
                    yield localDatabase.destroy();
                    return;
                }));
                return methods;
            });
        };
    });
}
export * from "./list";
export * from "./config";
export * from "./generate-methods";
export * from "./log";
export * from "./observe-item";
export * from "./single-item-update-que";
//# sourceMappingURL=index.js.map