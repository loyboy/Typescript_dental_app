import * as tslib_1 from "tslib";
import { checkServer } from './check-server';
export function isOnline(server) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        if (!navigator.onLine) {
            return false;
        }
        return yield checkServer(server);
    });
}
//# sourceMappingURL=is-online.js.map