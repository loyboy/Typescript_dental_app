import * as tslib_1 from "tslib";
import { connectToDB, menu, router, user } from "@core";
import { OrthoCase, orthoCases, orthoNamespace, setting } from "@modules";
import * as React from "react";
export const registerOrthodontic = {
    register() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            router.register({
                namespace: orthoNamespace,
                regex: /^orthodontic/,
                component: () => tslib_1.__awaiter(this, void 0, void 0, function* () {
                    const Component = (yield import("./components/page.orthodontic"))
                        .OrthoPage;
                    return React.createElement(Component, null);
                }),
                condition: () => !!setting.getSetting("module_orthodontics") &&
                    user.currentUser.canViewOrtho
            });
            menu.items.push({
                icon: "MiniLink",
                name: orthoNamespace,
                key: orthoNamespace,
                onClick: () => {
                    router.go([orthoNamespace]);
                },
                order: 3,
                url: "",
                condition: () => user.currentUser.canViewOrtho &&
                    !!setting.getSetting("module_orthodontics")
            });
            yield (yield connectToDB(orthoNamespace, orthoNamespace))(OrthoCase, orthoCases);
            return true;
        });
    },
    order: 8
};
//# sourceMappingURL=register.js.map