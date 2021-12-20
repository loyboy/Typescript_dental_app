import * as tslib_1 from "tslib";
import { router } from "@core";
import { computed, observable } from "mobx";
class MenuData {
    constructor() {
        this.items = [
            {
                icon: "Home",
                name: "Home",
                order: -99,
                key: "Home",
                url: "",
                onClick: () => {
                    router.go([""]);
                },
            },
        ];
        this.visible = false;
    }
    get sortedItems() {
        const items = this.items
            .slice()
            .reduce((arr, item) => {
            if (arr.findIndex((x) => x.key === item.key) === -1) {
                arr.push(item);
            }
            return arr;
        }, [])
            // .sort((a, b) => a.order - b.order)
            .filter((item) => !item.condition || item.condition());
        items.push({
            icon: "message",
            name: "Contact us",
            order: -99,
            key: "contacts",
            url: "",
            onClick: () => {
                var link = document.createElement("a");
                link.href = "mailto:contact@365apex.com";
                document.body.appendChild(link);
                link.click();
            },
        }, {
            icon: "consents",
            name: "Consents",
            order: -99,
            key: "consents",
            url: "",
            onClick: () => {
                var link = document.createElement("a");
                link.href = "mailto:contact@365apex.com";
                document.body.appendChild(link);
                link.click();
            },
        }, {
            icon: "help",
            name: "Support",
            order: -99,
            key: "support",
            url: "",
            onClick: () => {
                window.location.href = "https://www.365apex.com/support";
            },
        });
        return items;
    }
    get currentIndex() {
        return this.sortedItems.findIndex((x) => x.name === router.currentNamespace);
    }
    hide() {
        this.visible = false;
    }
    show() {
        this.visible = true;
    }
}
tslib_1.__decorate([
    observable
], MenuData.prototype, "items", void 0);
tslib_1.__decorate([
    observable
], MenuData.prototype, "visible", void 0);
tslib_1.__decorate([
    computed
], MenuData.prototype, "sortedItems", null);
tslib_1.__decorate([
    computed
], MenuData.prototype, "currentIndex", null);
export const menu = new MenuData();
//# sourceMappingURL=menu.js.map