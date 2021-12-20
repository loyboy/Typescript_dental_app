import * as tslib_1 from "tslib";
import { menu, router, text } from "@core";
import { observer } from "mobx-react";
import { Icon, Nav, Panel, PanelType } from "office-ui-fabric-react";
import * as React from "react";
let MenuView = class MenuView extends React.Component {
    render() {
        return (React.createElement("div", null,
            React.createElement("div", { className: "visible-lg visible-md icon-list" }, menu.sortedItems.map((item, index) => {
                console.log(item.name, item.key);
                return (React.createElement("div", { key: index, className: "item " + (menu.currentIndex === index ? "selected" : ""), onClick: item.onClick },
                    React.createElement(Icon, { iconName: item.icon }),
                    React.createElement("span", { className: "text" }, text(item.name))));
            })),
            React.createElement(Panel, { className: "menu", isLightDismiss: true, isOpen: menu.visible, type: PanelType.smallFixedNear, onDismiss: () => (menu.visible = false), hasCloseButton: false },
                React.createElement(Nav, { groups: [
                        {
                            links: menu.sortedItems.map((x) => {
                                console.log(x.key, x.icon, x.name, x.url);
                                return {
                                    icon: x.icon,
                                    name: text(x.name),
                                    key: x.key,
                                    url: x.url,
                                    onClick: x.onClick,
                                };
                            }),
                        },
                    ], selectedKey: router.currentNamespace }))));
    }
};
MenuView = tslib_1.__decorate([
    observer
], MenuView);
export { MenuView };
//# sourceMappingURL=menu.js.map