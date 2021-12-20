import * as tslib_1 from "tslib";
import { observable } from "mobx";
import { observer } from "mobx-react";
import { IconButton } from "office-ui-fabric-react";
import * as React from "react";
let SectionComponent = class SectionComponent extends React.Component {
    constructor() {
        super(...arguments);
        this.show = true;
    }
    render() {
        return (React.createElement("section", { className: "cl-section", style: { zIndex: this.props.zIndex, backgroundColor: this.props.backgroundColor, position: 'relative' } },
            React.createElement("div", { style: { position: 'absolute', top: 0, left: 0, width: '100%', height: 35, backgroundColor: '#f3f3f3', borderBottom: '1px solid #e3e3e3', zIndex: 1 } }),
            React.createElement(IconButton, { style: { zIndex: 11 }, className: "chevron", iconProps: {
                    iconName: this.show ? "chevronUp" : "chevronDown"
                }, onClick: () => {
                    this.show = !this.show;
                } }),
            React.createElement("h3", { className: "cl-section-title" + (this.show ? "" : " only-title"), onClick: () => {
                    this.show = !this.show;
                }, style: { position: 'absolute', top: 0, left: 0, zIndex: 10, padding: '6px 16px', borderBottom: 'none' } }, this.props.title),
            React.createElement("div", { style: { marginTop: this.show ? 20 : 0 } }, this.show ? this.props.children : "")));
    }
};
tslib_1.__decorate([
    observable
], SectionComponent.prototype, "show", void 0);
SectionComponent = tslib_1.__decorate([
    observer
], SectionComponent);
export { SectionComponent };
//# sourceMappingURL=section.js.map