import * as tslib_1 from "tslib";
import { observable } from "mobx";
import { observer } from "mobx-react";
import { Shimmer } from "office-ui-fabric-react";
import * as React from "react";
let AsyncComponent = class AsyncComponent extends React.Component {
    constructor() {
        super(...arguments);
        this.componentToRender = React.createElement(Shimmer, null);
    }
    componentDidMount() {
        this.props.loader().then(c => (this.componentToRender = c));
    }
    render() {
        return this.componentToRender;
    }
};
tslib_1.__decorate([
    observable
], AsyncComponent.prototype, "componentToRender", void 0);
AsyncComponent = tslib_1.__decorate([
    observer
], AsyncComponent);
export { AsyncComponent };
//# sourceMappingURL=async.js.map