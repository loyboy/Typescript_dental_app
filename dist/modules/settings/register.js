import * as tslib_1 from "tslib";
import { connectToDB, menu, router, user } from "@core";
import { setting, SettingsItem, settingsNamespace } from "@modules";
import * as React from "react";
export const registerSettings = {
    register() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            setting.setSetting("hourlyRate", "50");
            setting.setSetting("currencySymbol", "$");
            router.register({
                namespace: settingsNamespace,
                regex: /^settings/,
                component: () => tslib_1.__awaiter(this, void 0, void 0, function* () {
                    const Component = (yield import("./components/page.settings"))
                        .SettingsPage;
                    return React.createElement(Component, null);
                }),
                condition: () => user.currentUser.canViewSettings
            });
            menu.items.push({
                icon: "Settings",
                name: settingsNamespace,
                key: settingsNamespace,
                onClick: () => {
                    router.go([settingsNamespace]);
                },
                order: 999,
                url: "",
                condition: () => user.currentUser.canViewSettings
            });
            yield (yield connectToDB(settingsNamespace, settingsNamespace))(SettingsItem, setting);
            return true;
        });
    },
    order: 0
};
//# sourceMappingURL=register.js.map