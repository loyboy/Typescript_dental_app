import * as tslib_1 from "tslib";
import { connectToDB, menu, router, user } from "@core";
import { Patient, patients, patientsNamespace } from "@modules";
import * as React from "react";
export const registerPatients = {
    register() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            router.register({
                namespace: patientsNamespace,
                regex: /^patients/,
                component: () => tslib_1.__awaiter(this, void 0, void 0, function* () {
                    const Component = (yield import("./components/page.patients"))
                        .PatientsPage;
                    return React.createElement(Component, null);
                }),
                condition: () => user.currentUser.canViewPatients
            });
            menu.items.push({
                icon: "ContactCard",
                name: patientsNamespace,
                key: patientsNamespace,
                onClick: () => {
                    router.go([patientsNamespace]);
                },
                order: 1.5,
                url: "",
                condition: () => user.currentUser.canViewPatients
            });
            yield (yield connectToDB(patientsNamespace, patientsNamespace))(Patient, patients);
            return true;
        });
    },
    order: 4
};
//# sourceMappingURL=register.js.map