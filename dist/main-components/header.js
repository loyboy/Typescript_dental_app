import * as tslib_1 from "tslib";
import { Col, Row } from "@common-components";
import { menu, resync, router, status, text, user } from "@core";
import { observer } from "mobx-react";
import { Icon, IconButton, TooltipHost } from "office-ui-fabric-react";
import * as React from "react";
let HeaderView = class HeaderView extends React.Component {
    render() {
        return (React.createElement("div", { className: "header-component" },
            React.createElement(Row, null,
                React.createElement(Col, { span: 8 },
                    React.createElement("section", { className: "menu-button" },
                        React.createElement(IconButton, { onClick: () => {
                                menu.show();
                            }, disabled: false, iconProps: { iconName: "GlobalNavButton" }, title: "GlobalNavButton", ariaLabel: "GlobalNavButton" }))),
                React.createElement(Col, { span: 8 },
                    React.createElement("section", { className: "title" }, text(router.currentNamespace || "Home"))),
                React.createElement(Col, { span: 8 },
                    React.createElement("section", { className: "right-buttons" },
                        status.online ? (React.createElement(TooltipHost, { content: text("Sync with server") },
                            React.createElement(IconButton, { onClick: () => tslib_1.__awaiter(this, void 0, void 0, function* () {
                                    router.reSyncing = true;
                                    yield resync.resync();
                                    router.reSyncing = false;
                                }), iconProps: { iconName: "Sync" }, className: router.reSyncing ? "rotate" : "", title: "Re-Sync" }))) : (React.createElement("span", { className: "offline" },
                            React.createElement(Icon, { iconName: "WifiWarning4" }))),
                        React.createElement(TooltipHost, { content: text("User panel") },
                            React.createElement(IconButton, { onClick: () => (user.visible = true), disabled: false, iconProps: { iconName: "Contact" } })))))));
    }
};
HeaderView = tslib_1.__decorate([
    observer
], HeaderView);
export { HeaderView };
//# sourceMappingURL=header.js.map