import * as tslib_1 from "tslib";
import { menu, router, user } from "@core";
import { setting, statsNamespace } from "@modules";
import * as React from "react";
export const registerStats = {
    register() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            router.register({
                namespace: statsNamespace,
                regex: /^statistics/,
                component: () => tslib_1.__awaiter(this, void 0, void 0, function* () {
                    const Component = (yield import("./components/page.statistics"))
                        .StatisticsPage;
                    return React.createElement(Component, null);
                }),
                condition: () => !!setting.getSetting("module_statistics") &&
                    user.currentUser.canViewStats
            });
            menu.items.push({
                icon: "Chart",
                name: statsNamespace,
                key: statsNamespace,
                onClick: () => {
                    router.go([statsNamespace]);
                },
                order: 50,
                url: "",
                condition: () => user.currentUser.canViewStats &&
                    !!setting.getSetting("module_statistics")
            });
            return true;
        });
    },
    order: 10
};
//# sourceMappingURL=register.js.map