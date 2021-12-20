import * as tslib_1 from "tslib";
import { messages } from "@core";
import { observer } from "mobx-react";
import { Icon } from "office-ui-fabric-react";
import * as React from "react";
let MessagesView = class MessagesView extends React.Component {
    render() {
        return (React.createElement("div", { className: "messages-component" }, messages.messages.map(msg => {
            return (React.createElement("div", { key: msg.id, className: "message bottom-bounce" },
                React.createElement(Icon, { iconName: "Important" }),
                React.createElement("span", { className: "message-inner" }, msg.string)));
        })));
    }
};
MessagesView = tslib_1.__decorate([
    observer
], MessagesView);
export { MessagesView };
//# sourceMappingURL=messages.js.map