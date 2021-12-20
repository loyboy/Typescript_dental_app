import * as tslib_1 from "tslib";
import { BACKUPS_DIR, compact, DBsList, destroyLocal, files, Message, messages, modals, resync, status, text } from "./";
import { decode, encode, second } from "@utils";
import { saveAs } from "file-saver";
const ext = "apx";
export const backup = {
    toJSON: function () {
        return new Promise((resolve, reject) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            const PouchDB = (yield import("pouchdb-browser"))
                .default;
            yield compact.compact();
            const dumps = [];
            let done = 0;
            DBsList.forEach((dbName) => tslib_1.__awaiter(this, void 0, void 0, function* () {
                const remoteDatabase = new PouchDB(`${status.server}/${dbName}`, {
                    fetch: (url, opts) => PouchDB.fetch(url, Object.assign({}, opts, { credentials: "include" }))
                });
                const data = (yield remoteDatabase.allDocs({
                    include_docs: true,
                    attachments: true
                })).rows.map(entry => {
                    if (entry.doc) {
                        delete entry.doc._rev;
                    }
                    return entry.doc;
                });
                dumps.push({ dbName, data });
                done++;
                return;
            }));
            const checkInterval = setInterval(() => {
                if (done === DBsList.length) {
                    clearInterval(checkInterval);
                    resolve(dumps);
                }
            }, second / 2);
        }));
    },
    toBase64: function () {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const JSONDump = yield backup.toJSON();
            return encode(JSON.stringify(JSONDump));
        });
    },
    toBlob: function () {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const base64 = yield backup.toBase64();
            return new Blob(["apexo-backup:" + base64], {
                type: "text/plain;charset=utf-8"
            });
        });
    },
    toDropbox: function () {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const blob = yield backup.toBlob();
            const path = yield files.save(blob, ext, BACKUPS_DIR);
            return path;
        });
    },
    list: function () {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return yield files.list(BACKUPS_DIR);
        });
    },
    deleteOld: function (path) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return yield files.remove(path);
        });
    }
};
export const restore = {
    fromJSON: function (json) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => tslib_1.__awaiter(this, void 0, void 0, function* () {
                const PouchDB = (yield import("pouchdb-browser"))
                    .default;
                status.resetUser();
                let done = 0;
                json.forEach((dump) => tslib_1.__awaiter(this, void 0, void 0, function* () {
                    const dbName = dump.dbName;
                    const remoteDatabase1 = new PouchDB(`${status.server}/${dbName}`, {
                        fetch: (url, opts) => PouchDB.fetch(url, Object.assign({}, opts, { credentials: "include" }))
                    });
                    yield remoteDatabase1.destroy();
                    const remoteDatabase2 = new PouchDB(`${status.server}/${dbName}`, {
                        fetch: (url, opts) => PouchDB.fetch(url, Object.assign({}, opts, { credentials: "include" }))
                    });
                    const a = yield remoteDatabase2.bulkDocs(dump.data);
                    done++;
                    return;
                }));
                const checkInterval = setInterval(() => tslib_1.__awaiter(this, void 0, void 0, function* () {
                    if (done === json.length) {
                        clearInterval(checkInterval);
                        yield destroyLocal.destroy();
                        yield resync.resync();
                        location.reload();
                    }
                }), second / 100);
            }));
        });
    },
    fromBase64: function (base64Data, ignoreConfirm) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => tslib_1.__awaiter(this, void 0, void 0, function* () {
                if (ignoreConfirm) {
                    const json = JSON.parse(decode(base64Data));
                    yield restore.fromJSON(json);
                    resolve();
                }
                else {
                    modals.newModal({
                        message: text(`All unsaved data will be lost. All data will be removed and replaced by the backup file. Type "yes" to confirm`),
                        onConfirm: (input) => tslib_1.__awaiter(this, void 0, void 0, function* () {
                            if (input.toLowerCase() === "yes") {
                                const json = JSON.parse(decode(base64Data));
                                yield restore.fromJSON(json);
                                resolve();
                            }
                            else {
                                const msg = new Message(text("Restoration cancelled"));
                                messages.addMessage(msg);
                                return reject();
                            }
                        }),
                        input: true,
                        showCancelButton: false,
                        showConfirmButton: true,
                        id: Math.random()
                    });
                }
            }));
        });
    },
    fromFile: function (file) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                function terminate() {
                    const msg = new Message(text("Invalid file"));
                    messages.addMessage(msg);
                    return reject();
                }
                const reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onloadend = function () {
                    return tslib_1.__awaiter(this, void 0, void 0, function* () {
                        const base64data = reader.result;
                        if (typeof base64data === "string") {
                            const fileData = atob(base64data.split("base64,")[1]).split("apexo-backup:")[1];
                            if (fileData) {
                                yield restore.fromBase64(fileData);
                                resolve();
                            }
                            else {
                                terminate();
                            }
                        }
                        else {
                            terminate();
                        }
                    });
                };
            });
        });
    },
    fromDropbox: function (filePath) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const base64File = (yield files.get(filePath)).split(";base64,")[1];
            const base64Data = decode(base64File).split("apexo-backup:")[1];
            this.fromBase64(base64Data);
        });
    }
};
export function downloadCurrent() {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const blob = yield backup.toBlob();
        return new Promise(resolve => {
            modals.newModal({
                id: Math.random(),
                message: text("Please enter file name"),
                onConfirm: fileName => {
                    saveAs(blob, `${fileName || "apexo-backup"}.${ext}`);
                    resolve();
                },
                input: true,
                showCancelButton: true,
                showConfirmButton: true
            });
        });
    });
}
//# sourceMappingURL=backup.js.map