import * as tslib_1 from "tslib";
import { connectToDB, menu, router, user } from "@core";
import { Appointment, appointments, appointmentsNamespace } from "@modules";
import * as React from "react";
export const registerAppointments = {
    register() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            router.register({
                namespace: appointmentsNamespace,
                regex: /^appointments/,
                component: () => tslib_1.__awaiter(this, void 0, void 0, function* () {
                    const Component = (yield import("./components/page.calendar"))
                        .CalendarPage;
                    return React.createElement(Component, null);
                }),
                condition: () => user.currentUser.canViewAppointments
            });
            menu.items.push({
                icon: "Calendar",
                name: appointmentsNamespace,
                key: appointmentsNamespace,
                onClick: () => {
                    router.go([appointmentsNamespace]);
                },
                order: 3,
                url: "",
                condition: () => user.currentUser.canViewAppointments
            });
            yield (yield connectToDB(appointmentsNamespace, appointmentsNamespace, true))(Appointment, appointments);
            return true;
        });
    },
    order: 9
};
//# sourceMappingURL=register.js.map