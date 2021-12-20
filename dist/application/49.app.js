(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[49],{

/***/ "./src/modules/treatments/components/treatment-details.tsx":
/*!*****************************************************************!*\
  !*** ./src/modules/treatments/components/treatment-details.tsx ***!
  \*****************************************************************/
/*! exports provided: TreatmentDetailsPanel */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"TreatmentDetailsPanel\", function() { return TreatmentDetailsPanel; });\n/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ \"./node_modules/tslib/tslib.es6.js\");\n/* harmony import */ var _common_components__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @common-components */ \"./src/common-components/index.ts\");\n/* harmony import */ var _core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @core */ \"./src/core/index.ts\");\n/* harmony import */ var _modules__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @modules */ \"./src/modules/index.ts\");\n/* harmony import */ var mobx__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! mobx */ \"./node_modules/mobx/lib/mobx.module.js\");\n/* harmony import */ var mobx_react__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! mobx-react */ \"./node_modules/mobx-react/index.module.js\");\n/* harmony import */ var office_ui_fabric_react__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! office-ui-fabric-react */ \"./node_modules/office-ui-fabric-react/lib/index.js\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! react */ \"./node_modules/react/index.js\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_7__);\n\n\n\n\n\n\n\n\nlet TreatmentDetailsPanel = class TreatmentDetailsPanel extends react__WEBPACK_IMPORTED_MODULE_7__[\"Component\"] {\n    get canEdit() {\n        return _core__WEBPACK_IMPORTED_MODULE_2__[\"user\"].currentUser.canEditPatients;\n    }\n    render() {\n        return (react__WEBPACK_IMPORTED_MODULE_7__[\"createElement\"](\"div\", { className: \"treatment-editor\" },\n            react__WEBPACK_IMPORTED_MODULE_7__[\"createElement\"](_common_components__WEBPACK_IMPORTED_MODULE_1__[\"SectionComponent\"], { title: Object(_core__WEBPACK_IMPORTED_MODULE_2__[\"text\"])(\"Lab Order Details\") },\n                react__WEBPACK_IMPORTED_MODULE_7__[\"createElement\"](\"div\", { className: \"treatment-input\" },\n                    react__WEBPACK_IMPORTED_MODULE_7__[\"createElement\"](office_ui_fabric_react__WEBPACK_IMPORTED_MODULE_6__[\"TextField\"], { label: Object(_core__WEBPACK_IMPORTED_MODULE_2__[\"text\"])(\"Lab Order item\"), value: this.props.treat.item, onChange: (ev, val) => (_modules__WEBPACK_IMPORTED_MODULE_3__[\"treatments\"].list[this.props.selected].item = val), disabled: !this.canEdit }),\n                    react__WEBPACK_IMPORTED_MODULE_7__[\"createElement\"](office_ui_fabric_react__WEBPACK_IMPORTED_MODULE_6__[\"TextField\"], { label: Object(_core__WEBPACK_IMPORTED_MODULE_2__[\"text\"])(\"Lab Order Description\"), type: \"text\", value: this.props.treat.desc, onChange: (ev, val) => (_modules__WEBPACK_IMPORTED_MODULE_3__[\"treatments\"].list[this.props.selected].desc = val), disabled: !this.canEdit }),\n                    react__WEBPACK_IMPORTED_MODULE_7__[\"createElement\"](office_ui_fabric_react__WEBPACK_IMPORTED_MODULE_6__[\"TextField\"], { label: Object(_core__WEBPACK_IMPORTED_MODULE_2__[\"text\"])(\"Lab Order lab name\"), type: \"text\", value: this.props.treat.lab_name, onChange: (ev, val) => (_modules__WEBPACK_IMPORTED_MODULE_3__[\"treatments\"].list[this.props.selected].lab_name = val), disabled: !this.canEdit }),\n                    react__WEBPACK_IMPORTED_MODULE_7__[\"createElement\"](office_ui_fabric_react__WEBPACK_IMPORTED_MODULE_6__[\"TextField\"], { label: Object(_core__WEBPACK_IMPORTED_MODULE_2__[\"text\"])(\"Lab Order Patient\"), type: \"text\", value: this.props.treat.patient_name, onChange: (ev, val) => (_modules__WEBPACK_IMPORTED_MODULE_3__[\"treatments\"].list[this.props.selected].patient_name = val), disabled: !this.canEdit }),\n                    react__WEBPACK_IMPORTED_MODULE_7__[\"createElement\"](office_ui_fabric_react__WEBPACK_IMPORTED_MODULE_6__[\"TextField\"], { label: Object(_core__WEBPACK_IMPORTED_MODULE_2__[\"text\"])(\"Lab Order fees\"), type: \"number\", value: this.props.treat.fees, onChange: (ev, val) => (_modules__WEBPACK_IMPORTED_MODULE_3__[\"treatments\"].list[this.props.selected].fees = val.toString()), prefix: _modules__WEBPACK_IMPORTED_MODULE_3__[\"setting\"].getSetting(\"currencySymbol\"), disabled: !this.canEdit }),\n                    react__WEBPACK_IMPORTED_MODULE_7__[\"createElement\"](office_ui_fabric_react__WEBPACK_IMPORTED_MODULE_6__[\"Dropdown\"], { disabled: !this.canEdit, placeholder: Object(_core__WEBPACK_IMPORTED_MODULE_2__[\"text\"])(\"Status\"), options: [{ key: \"delivered\", text: \"delivered\" }, {\n                                key: \"delayed\", text: \"delayed\"\n                            }, { key: \"inprocessing\", text: \"inprocessing\" }], defaultSelectedKey: this.props.treat.status, onChange: (ev, has) => {\n                            _modules__WEBPACK_IMPORTED_MODULE_3__[\"treatments\"].list[this.props.selected].status = has.key;\n                        } })))));\n    }\n};\nObject(tslib__WEBPACK_IMPORTED_MODULE_0__[\"__decorate\"])([\n    mobx__WEBPACK_IMPORTED_MODULE_4__[\"computed\"]\n], TreatmentDetailsPanel.prototype, \"canEdit\", null);\nTreatmentDetailsPanel = Object(tslib__WEBPACK_IMPORTED_MODULE_0__[\"__decorate\"])([\n    mobx_react__WEBPACK_IMPORTED_MODULE_5__[\"observer\"]\n], TreatmentDetailsPanel);\n\n\n\n//# sourceURL=webpack:///./src/modules/treatments/components/treatment-details.tsx?");

/***/ })

}]);