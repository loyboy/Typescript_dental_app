import * as tslib_1 from "tslib";
import { files, resync } from "@core";
import { registerModules, staff } from "@modules";
import { day, isOnline, minute, num, second, store } from "@utils";
import { observable } from "mobx";
import { Md5 } from "ts-md5";
const demoHosts = [
    "localhost:8000",
    "demo.apexo.app",
    "192.168.0.101:8000",
    "192.168.0.102:8000"
];
export var LoginStep;
(function (LoginStep) {
    LoginStep[LoginStep["loadingData"] = 0] = "loadingData";
    LoginStep[LoginStep["allDone"] = 1] = "allDone";
    LoginStep[LoginStep["chooseUser"] = 2] = "chooseUser";
    LoginStep[LoginStep["initial"] = 3] = "initial";
})(LoginStep || (LoginStep = {}));
class Status {
    constructor() {
        this.server = "";
        this.currentUserID = "";
        this.keepOffline = false;
        this.step = LoginStep.initial;
        this.online = false;
        this.dropboxActive = false;
        this.tryOffline = false;
        setInterval(() => this.validateOnlineStatus(), second * 2);
        setTimeout(() => this.validateDropBoxToken(), second * 5); // initial
        setInterval(() => this.validateDropBoxToken(), minute); // then every minute
    }
    initialCheck(server) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            // If we're on a demo host
            if (demoHosts.indexOf(location.host) !== -1) {
                console.log("Login: Demo mode");
                return yield this.startDemoServer();
            }
            // if we're running on no server mode
            if (store.found("no_server_mode")) {
                console.log("Login: No server mode");
                return yield this.startNoServer();
            }
            this.server = server;
            const activeSession = yield this.activeSession(this.server);
            if (navigator.onLine) {
                if (activeSession) {
                    console.log("Login: using active session");
                    yield this.start({ server });
                    store.set("LSL_TS", new Date().getTime().toString());
                }
            }
            else if (store.found("LSL_hash")) {
                const now = new Date().getTime();
                const then = new Date(num(store.get("LSL_TS"))).getTime();
                if (now - then < 7 * day) {
                    this.start({ server });
                }
            }
        });
    }
    loginWithCredentials({ username, password, server }) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (!navigator.onLine && store.found("LSL_hash")) {
                return this.loginWithCredentialsOffline({
                    username,
                    password,
                    server
                });
            }
            const onlineServer = yield isOnline(server);
            if (navigator.onLine && onlineServer) {
                return this.loginWithCredentialsOnline({
                    username,
                    password,
                    server
                });
            }
            else {
                if (store.found("LSL_hash")) {
                    this.tryOffline = true;
                }
                return `
				An error occured, please make sure that the server is online and it\'s accessible.
				Click "change" to change into another server
			`;
            }
        });
    }
    loginWithCredentialsOnline({ username, password, server }) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const PouchDB = (yield import("pouchdb-browser"))
                .default;
            const auth = (yield import("pouchdb-authentication"))
                .default;
            PouchDB.plugin(auth);
            try {
                yield new PouchDB(server, { skip_setup: true }).logIn(username, password);
                store.set("LSL_hash", Md5.hashStr(server + username + password).toString());
                store.set("LSL_TS", new Date().getTime().toString());
                this.start({ server });
                return true;
            }
            catch (e) {
                console.error(e);
                return e.reason || "Could not login";
            }
        });
    }
    loginWithCredentialsOffline({ username, password, server }) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const LSL_hash = store.get("LSL_hash");
            if (LSL_hash === Md5.hashStr(server + username + password).toString()) {
                this.start({ server });
                return true;
            }
            else {
                return "This was not the last username/password combination you used!";
            }
        });
    }
    startDemoServer() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            yield this.startNoServer();
            (yield import("core/demo")).loadDemoData();
        });
    }
    startNoServer() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            this.online = false;
            this.keepOffline = true;
            yield this.start({
                server: "http://apexo-no-server-mode"
            });
            store.set("LSL_hash", Md5.hashStr("no server mode").toString());
            store.set("no_server_mode", "true");
        });
    }
    start({ server }) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            this.server = server;
            store.set("server_location", server);
            this.step = LoginStep.loadingData;
            try {
                yield registerModules();
            }
            catch (e) {
                console.log("Registering modules failed", e);
            }
            if (!this.checkUserID()) {
                this.step = LoginStep.chooseUser;
            }
        });
    }
    logout() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const PouchDB = (yield import("pouchdb-browser"))
                .default;
            const auth = (yield import("pouchdb-authentication"))
                .default;
            PouchDB.plugin(auth);
            if (navigator.onLine && !this.keepOffline) {
                try {
                    yield new PouchDB(this.server, { skip_setup: true }).logOut();
                }
                catch (e) {
                    console.log("Failed to logout", e);
                }
            }
            store.clear();
            location.reload();
        });
    }
    checkUserID() {
        const userID = store.get("user_id");
        if (userID && staff.getIndexByID(userID) !== -1) {
            this.setUser(userID);
            return true;
        }
        else {
            return false;
        }
    }
    resetUser() {
        this.step = LoginStep.chooseUser;
        this.currentUserID = "";
        store.remove("user_id");
    }
    setUser(id) {
        this.currentUserID = id;
        this.step = LoginStep.allDone;
        store.set("user_id", id);
    }
    validateDropBoxToken() {
        files
            .status()
            .then(x => {
            this.dropboxActive = true;
        })
            .catch(e => {
            this.dropboxActive = false;
        });
    }
    activeSession(server) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const PouchDB = (yield import("pouchdb-browser"))
                .default;
            const auth = (yield import("pouchdb-authentication"))
                .default;
            PouchDB.plugin(auth);
            try {
                if (navigator.onLine && (yield isOnline(server))) {
                    return !!(yield new PouchDB(server, {
                        skip_setup: true
                    }).getSession()).userCtx.name;
                }
            }
            catch (e) { }
            return false;
        });
    }
    validateOnlineStatus() {
        if (this.keepOffline) {
            return;
        }
        isOnline(this.server).then(online => {
            if (online && !this.online) {
                console.log("getting back online");
                resync.resync();
            }
            this.online = online;
        });
    }
}
tslib_1.__decorate([
    observable
], Status.prototype, "server", void 0);
tslib_1.__decorate([
    observable
], Status.prototype, "currentUserID", void 0);
tslib_1.__decorate([
    observable
], Status.prototype, "keepOffline", void 0);
tslib_1.__decorate([
    observable
], Status.prototype, "step", void 0);
tslib_1.__decorate([
    observable
], Status.prototype, "online", void 0);
tslib_1.__decorate([
    observable
], Status.prototype, "dropboxActive", void 0);
tslib_1.__decorate([
    observable
], Status.prototype, "tryOffline", void 0);
export const status = new Status();
//# sourceMappingURL=status.js.map