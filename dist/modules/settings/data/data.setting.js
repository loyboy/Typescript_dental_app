import * as tslib_1 from "tslib";
import { backup, status } from "@core";
import { SettingsItem } from "@modules";
import { day, generateID, minute, num } from "@utils";
import { observable } from "mobx";
class Settings {
    constructor() {
        this.ignoreObserver = false;
        this.list = [];
        this.dropboxBackups = [];
        this.settingChangeCallbacks = [];
        setInterval(() => {
            this.automatedBackups();
        }, 2 * minute); // check every 2 minutes
    }
    getSetting(id) {
        return (this.list.find(x => x._id.endsWith(id)) || { val: "" }).val;
    }
    setSetting(id, val) {
        const i = this.list.findIndex(x => x._id.endsWith(id));
        if (i === -1) {
            // add
            this.list.push(new SettingsItem({ _id: generateID(20, id), val }));
        }
        else {
            // update
            this.list[i].val = val;
        }
        this.settingChangeCallbacks.forEach(callback => callback());
    }
    onSettingChange(callback) {
        this.settingChangeCallbacks.push(callback);
    }
    updateDropboxBackups() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            try {
                const sortedResult = (yield backup.list())
                    .filter(x => x.client_modified && x.name.endsWith(".apx"))
                    .sort((a, b) => new Date(a.client_modified).getTime() -
                    new Date(b.client_modified).getTime());
                this.dropboxBackups = sortedResult;
            }
            catch (e) {
                console.log("Could not update dropbox backups", e);
            }
        });
    }
    automatedBackups() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const frequency = this.getSetting("backup_freq");
            const retain = num(this.getSetting("backup_retain")) || 3;
            // carry on, only if there's access token
            if (!status.dropboxActive) {
                return;
            }
            if (["m", "w", "d"].indexOf(frequency) === -1) {
                return;
            }
            yield this.updateDropboxBackups();
            const lastBackupFile = this.dropboxBackups[this.dropboxBackups.length - 1] || {
                name: "",
                path_lower: "",
                id: "",
                size: 0,
                client_modified: new Date(0).getTime()
            };
            const now = new Date().getTime();
            const then = new Date(lastBackupFile.client_modified).getTime();
            const diffInDays = Math.floor((now - then) / day);
            if (frequency === "d" && diffInDays > 1) {
                yield backup.toDropbox();
                yield this.updateDropboxBackups();
            }
            else if (frequency === "w" && diffInDays > 7) {
                yield backup.toDropbox();
                yield this.updateDropboxBackups();
            }
            else if (frequency === "m" && diffInDays > 30) {
                yield backup.toDropbox();
                yield this.updateDropboxBackups();
            }
            let backupsToDeleteNumber = this.dropboxBackups.length - retain;
            const backupsToDeleteFiles = [];
            while (backupsToDeleteNumber > 0) {
                backupsToDeleteFiles.push(this.dropboxBackups[backupsToDeleteNumber - 1]);
                backupsToDeleteNumber--;
            }
            backupsToDeleteFiles.forEach((file) => tslib_1.__awaiter(this, void 0, void 0, function* () {
                yield backup.deleteOld(file.path_lower);
                yield this.updateDropboxBackups();
            }));
        });
    }
}
tslib_1.__decorate([
    observable
], Settings.prototype, "list", void 0);
tslib_1.__decorate([
    observable
], Settings.prototype, "dropboxBackups", void 0);
export const setting = new Settings();
//# sourceMappingURL=data.setting.js.map