import * as tslib_1 from "tslib";
import { observer } from "mobx-react";
import { Persona, PersonaPresence, PersonaSize } from "office-ui-fabric-react";
import * as React from "react";
let ProfileComponent = class ProfileComponent extends React.Component {
    render() {
        const style = Object.assign({
            cursor: this.props.onClick ? "pointer" : ""
        }, this.props.style || {});
        return (React.createElement(Persona, { onRenderSecondaryText: () => this.props.secondaryElement || null, className: this.props.className, onClick: () => (this.props.onClick || (() => { }))(), style: style, imageInitials: this.props.name.charAt(0), size: this.props.size || PersonaSize.large, presence: PersonaPresence.none, text: this.props.name, tertiaryText: this.props.tertiaryText, onRenderInitials: this.props.onRenderInitials }));
    }
};
ProfileComponent = tslib_1.__decorate([
    observer
], ProfileComponent);
export { ProfileComponent };
//# sourceMappingURL=profile.js.map