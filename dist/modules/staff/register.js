import * as tslib_1 from "tslib";
import { connectToDB, menu, router, user } from "@core";
import { staff, StaffMember, staffNamespace } from "@modules";
import * as React from "react";
export const registerStaff = {
    register() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            router.register({
                namespace: staffNamespace,
                regex: /^staff/,
                component: () => tslib_1.__awaiter(this, void 0, void 0, function* () {
                    const Component = (yield import("./components/page.staff"))
                        .StaffPage;
                    return React.createElement(Component, null);
                }),
                condition: () => user.currentUser.canViewStaff
            });
            menu.items.push({
                icon: "Contact",
                name: staffNamespace,
                key: staffNamespace,
                onClick: () => {
                    router.go([staffNamespace]);
                },
                order: 0,
                url: "",
                condition: () => user.currentUser.canViewStaff
            });
            yield (yield connectToDB("doctors", staffNamespace))(StaffMember, staff);
            return true;
        });
    },
    order: 7
};
//# sourceMappingURL=register.js.map