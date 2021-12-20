import * as tslib_1 from "tslib";
import { connectToDB, menu, router, user } from "@core";
import { PrescriptionItem, prescriptions, prescriptionsNamespace, setting } from "@modules";
import * as React from "react";
export const registerPrescriptions = {
    register() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            router.register({
                namespace: prescriptionsNamespace,
                regex: /^prescriptions/,
                component: () => tslib_1.__awaiter(this, void 0, void 0, function* () {
                    const Component = (yield import("./components/page.prescriptions"))
                        .PrescriptionsPage;
                    return React.createElement(Component, null);
                }),
                condition: () => !!setting.getSetting("module_prescriptions") &&
                    user.currentUser.canViewPrescriptions
            });
            menu.items.push({
                icon: "Pill",
                name: prescriptionsNamespace,
                key: prescriptionsNamespace,
                onClick: () => {
                    router.go([prescriptionsNamespace]);
                },
                order: 9,
                url: "",
                condition: () => user.currentUser.canViewPrescriptions &&
                    !!setting.getSetting("module_prescriptions")
            });
            yield (yield connectToDB(prescriptionsNamespace, prescriptionsNamespace))(PrescriptionItem, prescriptions);
            return true;
        });
    },
    order: 5
};
//# sourceMappingURL=register.js.map