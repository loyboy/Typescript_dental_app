import * as tslib_1 from "tslib";
import classNames from "classnames";
import { observer } from "mobx-react";
import * as PropTypes from "prop-types";
import * as React from "react";
const stringOrNumber = PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
]);
const objectOrNumber = PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.number
]);
let Col = class Col extends React.Component {
    render() {
        const props = this.props;
        const { span, order, offset, push, pull, className, children, prefixCls = "ant-col" } = props, others = tslib_1.__rest(props, ["span", "order", "offset", "push", "pull", "className", "children", "prefixCls"]);
        let sizeClassObj = {};
        ["xs", "sm", "md", "lg", "xl", "xxl"].forEach(size => {
            let sizeProps = {};
            if (typeof props[size] === "number") {
                sizeProps.span = props[size];
            }
            else if (typeof props[size] === "object") {
                sizeProps = props[size] || {};
            }
            delete others[size];
            sizeClassObj = Object.assign({}, sizeClassObj, { [`${prefixCls}-${size}-${sizeProps.span}`]: sizeProps.span !== undefined, [`${prefixCls}-${size}-order-${sizeProps.order}`]: sizeProps.order || sizeProps.order === 0, [`${prefixCls}-${size}-offset-${sizeProps.offset}`]: sizeProps.offset || sizeProps.offset === 0, [`${prefixCls}-${size}-push-${sizeProps.push}`]: sizeProps.push || sizeProps.push === 0, [`${prefixCls}-${size}-pull-${sizeProps.pull}`]: sizeProps.pull || sizeProps.pull === 0 });
        });
        const classes = classNames({
            [`${prefixCls}-${span}`]: span !== undefined,
            [`${prefixCls}-order-${order}`]: order,
            [`${prefixCls}-offset-${offset}`]: offset,
            [`${prefixCls}-push-${push}`]: push,
            [`${prefixCls}-pull-${pull}`]: pull
        }, className, sizeClassObj);
        return (React.createElement("div", Object.assign({}, others, { className: classes }), children));
    }
};
Col.propTypes = {
    span: stringOrNumber,
    order: stringOrNumber,
    offset: stringOrNumber,
    push: stringOrNumber,
    pull: stringOrNumber,
    className: PropTypes.string,
    children: PropTypes.node,
    xs: objectOrNumber,
    sm: objectOrNumber,
    md: objectOrNumber,
    lg: objectOrNumber,
    xl: objectOrNumber,
    xxl: objectOrNumber
};
Col = tslib_1.__decorate([
    observer
], Col);
export default Col;
//# sourceMappingURL=col.js.map