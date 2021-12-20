import * as tslib_1 from "tslib";
import { connectToDB, menu, router, user } from "@core";
import { Insurance, insurances, insuranceNamespace } from "@modules";
import * as React from "react";
export const registerInsurance = {
    register: () => tslib_1.__awaiter(this, void 0, void 0, function* () {
        router.register({
            namespace: insuranceNamespace,
            regex: /^insurances/,
            component: () => tslib_1.__awaiter(this, void 0, void 0, function* () {
                const Component = (yield import("./components/page.insurance"))
                    .Insurances;
                return React.createElement(Component, null);
            }),
            condition: () => user.currentUser.canViewInsurance
        });
        menu.items.push({
            icon: "PaymentCard",
            name: insuranceNamespace,
            onClick: () => {
                router.go([insuranceNamespace]);
            },
            order: 5,
            url: "",
            key: insuranceNamespace,
            condition: () => user.currentUser.canViewInsurance
        });
        yield (yield connectToDB(insuranceNamespace, insuranceNamespace))(Insurance, insurances);
        return true;
    }),
    order: 3
};
//# sourceMappingURL=register.js.map