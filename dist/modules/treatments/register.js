import * as tslib_1 from "tslib";
import { connectToDB, menu, router, user } from "@core";
import { Treatment, treatments, treatmentsNamespace } from "@modules";
import * as React from "react";
export const registerTreatments = {
    register() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            router.register({
                namespace: treatmentsNamespace,
                regex: /^labs/,
                component: () => tslib_1.__awaiter(this, void 0, void 0, function* () {
                    const Component = (yield import("./components/page.treatments"))
                        .Treatments;
                    return React.createElement(Component, null);
                }),
                condition: () => user.currentUser.canViewTreatments
            });
            menu.items.push({
                icon: "Cricket",
                name: treatmentsNamespace,
                onClick: () => {
                    router.go([treatmentsNamespace]);
                },
                order: 5,
                url: "",
                key: treatmentsNamespace,
                condition: () => user.currentUser.canViewTreatments
            });
            yield (yield connectToDB(treatmentsNamespace, treatmentsNamespace))(Treatment, treatments);
            return true;
        });
    },
    order: 8
};
//# sourceMappingURL=register.js.map