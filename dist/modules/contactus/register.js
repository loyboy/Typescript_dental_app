import * as tslib_1 from "tslib";
import { menu } from "@core";
export const registerContactUs = {
    register() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            menu.items.push({
                icon: "Contact",
                name: "Contact Us",
                key: "Contact Us",
                onClick: () => {
                    window.location.href = "https://www.wedentists.com";
                },
                order: 998,
                url: ""
            });
            return true;
        });
    },
    order: 9
};
//# sourceMappingURL=register.js.map