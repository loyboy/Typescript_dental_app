import * as tslib_1 from "tslib";
import { menu } from "@core";
export const registerMailTo = {
    register() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            menu.items.push({
                icon: "Mail",
                name: "Mail To",
                key: "Mail to",
                onClick: () => {
                    var link = document.createElement('a');
                    link.href = "mailto:contact@365apex.com";
                    document.body.appendChild(link);
                    link.click();
                },
                order: 999,
                url: "",
            });
            return true;
        });
    },
    order: 9
};
//# sourceMappingURL=register.js.map