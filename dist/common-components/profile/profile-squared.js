import * as tslib_1 from "tslib";
import { observer } from "mobx-react";
import { Persona } from "office-ui-fabric-react";
import * as React from "react";
let ProfileSquaredComponent = class ProfileSquaredComponent extends React.Component {
    render() {
        return (React.createElement(Persona, { className: `profile-squared size-${this.props.size}`, text: this.props.text || "", size: this.props.size || 3, onRenderInitials: this.props.onRenderInitials, secondaryText: this.props.subText, onClick: this.props.onClick, initialsColor: this.props.initialsColor }));
    }
};
ProfileSquaredComponent = tslib_1.__decorate([
    observer
], ProfileSquaredComponent);
export { ProfileSquaredComponent };
//# sourceMappingURL=profile-squared.js.map