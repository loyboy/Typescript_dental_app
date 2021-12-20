import * as tslib_1 from "tslib";
import { connectToDB, menu, router, user } from "@core";
import { consents, Consent, consentsNamespace, setting } from "@modules";
import * as React from "react";
export const registerConsents = {
    register() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            router.register({
                namespace: consentsNamespace,
                regex: /^consents/,
                component: () => tslib_1.__awaiter(this, void 0, void 0, function* () {
                    const Component = (yield import("./components/page"))
                        .Consents;
                    return React.createElement(Component, null);
                }),
                condition: () => !!setting.getSetting("module_consents") &&
                    user.currentUser.canEditConsents
            });
            menu.items.push({
                icon: "PreviewLink",
                name: consentsNamespace,
                key: consentsNamespace,
                onClick: () => {
                    router.go([consentsNamespace]);
                },
                order: 8,
                url: "",
                condition: () => user.currentUser.canEditConsents &&
                    !!setting.getSetting("module_consents")
            });
            yield (yield connectToDB(consentsNamespace, consentsNamespace))(Consent, consents);
            return true;
        });
    },
    order: 12
};
//# sourceMappingURL=register.js.map