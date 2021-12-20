import * as tslib_1 from "tslib";
import { router } from "@core";
import { setting } from "@modules";
import { formatDate } from "@utils";
import { observer } from "mobx-react";
import { Icon } from "office-ui-fabric-react";
import * as React from "react";
let DateLinkComponent = class DateLinkComponent extends React.Component {
    render() {
        const dateObj = new Date(this.props.time);
        const y = dateObj.getFullYear();
        const m = dateObj.getMonth() + 1;
        const d = dateObj.getDate();
        return (React.createElement("div", { className: "date-link " + this.props.className || "" },
            React.createElement("a", { onClick: () => {
                    if (this.props.notClickable) {
                        return;
                    }
                    router.go(["appointments", `${y}-${m}-${d}`]);
                } },
                React.createElement("span", { className: "icon" },
                    React.createElement(Icon, { iconName: "Calendar" })),
                formatDate(this.props.time, setting.getSetting("date_format")))));
    }
};
DateLinkComponent = tslib_1.__decorate([
    observer
], DateLinkComponent);
export { DateLinkComponent };
//# sourceMappingURL=date-link.js.map