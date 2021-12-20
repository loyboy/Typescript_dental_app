import * as tslib_1 from "tslib";
import { num } from "@utils";
import { observer } from "mobx-react";
import * as React from "react";
export var TagType;
(function (TagType) {
    TagType[TagType["warning"] = 0] = "warning";
    TagType[TagType["danger"] = 1] = "danger";
    TagType[TagType["success"] = 2] = "success";
    TagType[TagType["info"] = 3] = "info";
    TagType[TagType["primary"] = 4] = "primary";
})(TagType || (TagType = {}));
export function TagTypeToString(input) {
    if (input === TagType.danger) {
        return "danger";
    }
    else if (input === TagType.info) {
        return "info";
    }
    else if (input === TagType.primary) {
        return "primary";
    }
    else if (input === TagType.success) {
        return "success";
    }
    else if (input === TagType.warning) {
        return "warning";
    }
    else {
        return "primary";
    }
}
export function stringToTagType(input) {
    if (input === "danger") {
        return TagType.danger;
    }
    else if (input === "info") {
        return TagType.info;
    }
    else if (input === "primary") {
        return TagType.primary;
    }
    else if (input === "success") {
        return TagType.success;
    }
    else if (input === "warning") {
        return TagType.warning;
    }
    else {
        return TagType.primary;
    }
}
export function getRandomTagType(str) {
    const r = num((str.length * str.charCodeAt(0) + str.charCodeAt(str.length - 1))
        .toString()
        .charAt(0));
    if (r === 1 || r === 4) {
        return TagType.primary;
    }
    if (r === 3) {
        return TagType.warning;
    }
    if (r === 5 || r === 6) {
        return TagType.success;
    }
    if (r === 7 || r === 8 || r === 2) {
        return TagType.info;
    }
    else {
        return TagType.danger;
    }
}
let TagComponent = class TagComponent extends React.Component {
    render() {
        return (React.createElement("span", { className: `label ${TagTypeToString(this.props.type)} ` +
                (this.props.onClick ? "clickable" : ""), onClick: this.props.onClick }, this.props.text));
    }
};
TagComponent = tslib_1.__decorate([
    observer
], TagComponent);
export { TagComponent };
//# sourceMappingURL=label.js.map