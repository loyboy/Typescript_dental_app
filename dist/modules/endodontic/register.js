import * as tslib_1 from "tslib";
import { connectToDB, menu, router, user } from "@core";
import { EndoCase, endoCases, endoNamespace, setting } from "@modules";
import * as React from "react";
export const registerEndodontic = {
    register() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            router.register({
                namespace: endoNamespace,
                regex: /^endodontic/,
                component: () => tslib_1.__awaiter(this, void 0, void 0, function* () {
                    const Component = (yield import("./components/page.endodontic"))
                        .EndoPage;
                    return React.createElement(Component, null);
                }),
                condition: () => !!setting.getSetting("module_endodontics") &&
                    user.currentUser.canViewOrtho
            });
            menu.items.push({
                icon: "../images/endo.png",
                name: endoNamespace,
                key: endoNamespace,
                onClick: () => {
                    router.go([endoNamespace]);
                },
                order: 6,
                url: "",
                condition: () => user.currentUser.canViewOrtho &&
                    !!setting.getSetting("module_endodontics")
            });
            yield (yield connectToDB(endoNamespace, endoNamespace))(EndoCase, endoCases);
            return true;
        });
    },
    order: 5
};
//# sourceMappingURL=register.js.map