import * as tslib_1 from "tslib";
import { Col, ProfileSquaredComponent, Row, SectionComponent, } from "@common-components";
import { backup, compact, downloadCurrent, restore, status, text, user, } from "@core";
import { setting } from "@modules";
import { dateNames, formatDate, second } from "@utils";
import { computed, observable } from "mobx";
import { observer } from "mobx-react";
import { DefaultButton, Dropdown, IconButton, MessageBar, MessageBarType, TextField, Toggle, TooltipHost, } from "office-ui-fabric-react";
import * as React from "react";
let SettingsPage = class SettingsPage extends React.Component {
    constructor() {
        super(...arguments);
        this.triggerUpdate = 0;
        this.inputEl = null;
        this.loading = false;
    }
    get canEdit() {
        return user.currentUser.canEditSettings;
    }
    componentWillMount() {
        setTimeout(() => setting.updateDropboxBackups(), second);
    }
    render() {
        return (React.createElement("div", { className: "settings-component p-15 p-l-10 p-r-10" },
            React.createElement(SectionComponent, { title: text(`General Setting`) },
                React.createElement(SettingInputComponent, { element: React.createElement(Dropdown, { label: text("Language"), options: [
                            { key: "en", text: "English" },
                            { key: "ar", text: "العربية" },
                        ], defaultSelectedKey: setting.getSetting("lang"), onChange: (ev, v) => {
                            setting.setSetting("lang", v.key.toString());
                        }, disabled: !this.canEdit }), info: text(`Choose the main language of display menus and items`) }),
                React.createElement(SettingInputComponent, { element: React.createElement(Dropdown, { label: text("Date format"), options: [
                            { key: "dd/mm/yyyy", text: "dd/mm/yyyy" },
                            { key: "mm/dd/yyyy", text: "mm/dd/yyyy" },
                            { key: "dd MM 'YY", text: "dd MM 'YY" },
                        ], defaultSelectedKey: setting.getSetting("date_format"), onChange: (ev, v) => {
                            setting.setSetting("date_format", v.key.toString());
                        }, disabled: !this.canEdit }), info: text(`Set the date format to be used across this application`) }),
                React.createElement(SettingInputComponent, { element: React.createElement(Dropdown, { label: text("Week ends on"), options: dateNames.days(true).map((dayName, index) => ({
                            key: index.toString(),
                            text: text(dayName),
                        })), defaultSelectedKey: setting.getSetting("weekend_num"), onChange: (ev, v) => {
                            setting.setSetting("weekend_num", v.key.toString());
                        }, disabled: !this.canEdit }), info: text(`On which day the week ends`) }),
                React.createElement(SettingInputComponent, { element: React.createElement(TextField, { value: setting.getSetting("dropbox_accessToken"), label: text("Dropbox access token"), onChange: (ev, val) => {
                            setting.setSetting("dropbox_accessToken", val);
                            setTimeout(() => status.validateDropBoxToken(), second / 2);
                        }, disabled: !this.canEdit }), info: text(`This access token is used to store files across the application, like backups and images`) })),
            React.createElement(SectionComponent, { title: text(`Financial Settings`) },
                setting.getSetting("time_tracking") ? (React.createElement(SettingInputComponent, { element: React.createElement(TextField, { label: text("Time expenses (per hour)"), type: "number", value: setting.getSetting("hourlyRate"), onChange: (ev, newVal) => {
                            setting.setSetting("hourlyRate", newVal.toString());
                        }, disabled: !this.canEdit }), info: text(
                    // tslint:disable-next-line:max-line-length
                    `When time tracking enabled, this is used to calculate profits and expenses, as time is also added to the expenses So here you can put the electricity, rent, and other time dependent expenses`) })) : (""),
                React.createElement(SettingInputComponent, { element: React.createElement(TextField, { label: text("Currency symbol"), value: setting.getSetting("currencySymbol"), onChange: (ev, newVal) => {
                            setting.setSetting("currencySymbol", newVal.toString());
                        }, disabled: !this.canEdit }), info: text(`This symbol you enter here will be used across your application`) })),
            React.createElement(SectionComponent, { title: text(`Optional Modules and Features`) },
                React.createElement(Toggle, { onText: text("Prescriptions module enabled"), offText: text("Prescriptions module disabled"), defaultChecked: !!setting.getSetting("module_prescriptions"), onChange: (ev, val) => {
                        setting.setSetting("module_prescriptions", val ? "enable" : "");
                    }, disabled: !this.canEdit }),
                React.createElement(Toggle, { onText: text("Orthodontic module enabled"), offText: text("Orthodontic module disabled"), defaultChecked: !!setting.getSetting("module_orthodontics"), onChange: (ev, val) => {
                        setting.setSetting("module_orthodontics", val ? "enable" : "");
                    }, disabled: !this.canEdit }),
                React.createElement(Toggle, { onText: text("Endodontic module enabled"), offText: text("Endodontic module disabled"), defaultChecked: !!setting.getSetting("module_endodontics"), onChange: (ev, val) => {
                        setting.setSetting("module_endodontics", val ? "enable" : "");
                    }, disabled: !this.canEdit }),
                React.createElement(Toggle, { onText: text("Statistics module enabled"), offText: text("Statistics module disabled"), defaultChecked: !!setting.getSetting("module_statistics"), onChange: (ev, val) => {
                        setting.setSetting("module_statistics", val ? "enable" : "");
                    }, disabled: !this.canEdit }),
                React.createElement(Toggle, { onText: text("Time tracking enabled"), offText: text("Time tracking disabled"), defaultChecked: !!setting.getSetting("time_tracking"), onChange: (ev, val) => {
                        setting.setSetting("time_tracking", val ? "enable" : "");
                    }, disabled: !this.canEdit }),
                React.createElement(Toggle, { onText: text("Consents enabled"), offText: text("Consents tracking disabled"), defaultChecked: !!setting.getSetting("module_consents"), onChange: (ev, val) => {
                        setting.setSetting("module_consents", val ? "enable" : "");
                    }, disabled: !this.canEdit })),
            React.createElement(SectionComponent, { title: text(`Backup and Restore`) }, status.online ? (React.createElement("div", null,
                React.createElement(DefaultButton, { onClick: () => {
                        compact.compact();
                    }, iconProps: { iconName: "ZipFolder" }, className: "m-l-5 m-t-5", text: text("Run compaction") }),
                React.createElement(DefaultButton, { onClick: () => {
                        downloadCurrent();
                    }, className: "m-l-5 m-t-5", iconProps: { iconName: "Database" }, text: text("Download a backup") }),
                React.createElement(DefaultButton, { onClick: () => (this.inputEl ? this.inputEl.click() : ""), className: "m-l-5 m-t-5", iconProps: { iconName: "DatabaseSync" }, text: text("Restore from file") }),
                React.createElement("input", { ref: (el) => (this.inputEl = el), hidden: true, type: "file", multiple: false, onChange: (e) => tslib_1.__awaiter(this, void 0, void 0, function* () {
                        if (e.target.files && e.target.files.length > 0) {
                            yield restore.fromFile(e.target.files[0]);
                        }
                    }) }))) : (React.createElement(MessageBar, { messageBarType: MessageBarType.warning }, text("Backup and restore functionality are not available while you're offline")))),
            React.createElement(SectionComponent, { title: text(`Automated Backup and Restore`) }, status.online ? (status.dropboxActive ? (React.createElement("div", null,
                React.createElement(Dropdown, { label: text("Backup frequency"), options: [
                        { key: "d", text: text("Daily") },
                        { key: "w", text: text("Weekly") },
                        { key: "m", text: text("Monthly") },
                        { key: "n", text: text("Never") },
                    ], defaultSelectedKey: setting.getSetting("backup_freq"), onChange: (ev, v) => {
                        setting.setSetting("backup_freq", v.key.toString());
                    }, disabled: !this.canEdit }),
                React.createElement(TextField, { value: setting.getSetting("backup_retain"), label: text("How many backups to retain"), onChange: (ev, val) => {
                        setting.setSetting("backup_retain", val);
                    }, disabled: !this.canEdit, type: "number" }),
                setting.dropboxBackups.length ? (React.createElement("table", { className: "ms-table" },
                    React.createElement("thead", null,
                        React.createElement("tr", null,
                            React.createElement("th", null, text("Backup")),
                            React.createElement("th", null, text("Actions")))),
                    React.createElement("tbody", null, setting.dropboxBackups.map((file) => {
                        const date = new Date(file.client_modified);
                        return (React.createElement("tr", { key: file.id },
                            React.createElement("td", null,
                                React.createElement(ProfileSquaredComponent, { onRenderInitials: () => (React.createElement("div", { style: {
                                            textAlign: "center",
                                            fontSize: 10,
                                        } }, `${date.getDate()}/${date.getMonth() + 1}`)), text: formatDate(date, setting.getSetting("date_format")), subText: `${Math.round(file.size / 1000)} KB` })),
                            React.createElement("td", null,
                                React.createElement(TooltipHost, { content: text("Delete") },
                                    React.createElement(IconButton, { style: {
                                            marginRight: 6,
                                        }, iconProps: {
                                            iconName: this.loading ? "sync" : "delete",
                                        }, className: this.loading ? "rotate" : "", disabled: !this.canEdit, onClick: () => {
                                            this.loading = true;
                                            backup
                                                .deleteOld(file.path_lower)
                                                .then(() => {
                                                this.loading = false;
                                                setting.updateDropboxBackups();
                                            })
                                                .catch(() => {
                                                this.loading = false;
                                                setting.updateDropboxBackups();
                                            });
                                        } })),
                                React.createElement(TooltipHost, { content: text("Restore") },
                                    React.createElement(IconButton, { style: {
                                            marginRight: 6,
                                        }, iconProps: {
                                            iconName: this.loading
                                                ? "sync"
                                                : "DatabaseSync",
                                        }, className: this.loading ? "rotate" : "", disabled: !this.canEdit, onClick: () => {
                                            this.loading = true;
                                            restore
                                                .fromDropbox(file.path_lower)
                                                .then(() => (this.loading = false))
                                                .catch(() => (this.loading = false));
                                        } })))));
                    })))) : (""))) : (React.createElement(MessageBar, { messageBarType: MessageBarType.warning }, "A valid DropBox access token is required for this section"))) : (React.createElement(MessageBar, { messageBarType: MessageBarType.warning }, text("Backup and restore functionality are not available while you're offline"))))));
    }
};
tslib_1.__decorate([
    observable
], SettingsPage.prototype, "triggerUpdate", void 0);
tslib_1.__decorate([
    observable
], SettingsPage.prototype, "inputEl", void 0);
tslib_1.__decorate([
    computed
], SettingsPage.prototype, "canEdit", null);
tslib_1.__decorate([
    observable
], SettingsPage.prototype, "loading", void 0);
SettingsPage = tslib_1.__decorate([
    observer
], SettingsPage);
export { SettingsPage };
let SettingInputComponent = class SettingInputComponent extends React.Component {
    render() {
        return (React.createElement(Row, { gutter: 12, style: { marginBottom: 20 } },
            React.createElement(Col, { style: { marginBottom: -15 }, md: 12 }, this.props.element),
            React.createElement(Col, { md: 12 },
                React.createElement(MessageBar, { style: { marginTop: 22 }, messageBarType: MessageBarType.info }, this.props.info))));
    }
};
SettingInputComponent = tslib_1.__decorate([
    observer
], SettingInputComponent);
export { SettingInputComponent };
//# sourceMappingURL=page.settings.js.map