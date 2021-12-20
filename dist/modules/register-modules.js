import * as tslib_1 from "tslib";
import { registerAppointments, registerOrthodontic, registerEndodontic, registerPatients, registerPrescriptions, registerSettings, registerStaff, registerStats, registerTreatments, registerInsurance, registerConsents } from "@modules";
const register = [
    registerAppointments,
    registerPatients,
    registerSettings,
    registerStats,
    registerTreatments,
    registerPrescriptions,
    registerStaff,
    registerOrthodontic,
    registerEndodontic,
    registerInsurance,
    registerConsents
];
let alreadyRegistered = false;
export function registerModules() {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        return new Promise(resolve => {
            if (alreadyRegistered) {
                resolve(true);
            }
            alreadyRegistered = true;
            let done = 0;
            register
                .sort((a, b) => a.order - b.order)
                .forEach((module) => tslib_1.__awaiter(this, void 0, void 0, function* () {
                try {
                    yield module.register();
                }
                catch (e) {
                    try {
                        console.error("Failed to register module with order:", module.order, e, "Will try again");
                        yield module.register();
                    }
                    catch (e) {
                        console.error("Failed to register module with order:", module.order, e);
                    }
                }
                done++;
            }));
            const checkRegistered = setInterval(() => {
                if (done === register.length) {
                    resolve(true);
                    clearInterval(checkRegistered);
                }
            }, 300);
        });
    });
}
//# sourceMappingURL=register-modules.js.map