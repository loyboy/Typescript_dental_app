export var PrescriptionItemForm;
(function (PrescriptionItemForm) {
    PrescriptionItemForm[PrescriptionItemForm["ampoule"] = 0] = "ampoule";
    PrescriptionItemForm[PrescriptionItemForm["capsule"] = 1] = "capsule";
    PrescriptionItemForm[PrescriptionItemForm["tablet"] = 2] = "tablet";
    PrescriptionItemForm[PrescriptionItemForm["pill"] = 3] = "pill";
    PrescriptionItemForm[PrescriptionItemForm["gel"] = 4] = "gel";
    PrescriptionItemForm[PrescriptionItemForm["lotion"] = 5] = "lotion";
    PrescriptionItemForm[PrescriptionItemForm["syrup"] = 6] = "syrup";
    PrescriptionItemForm[PrescriptionItemForm["powder"] = 7] = "powder";
    PrescriptionItemForm[PrescriptionItemForm["mouthWash"] = 8] = "mouthWash";
    PrescriptionItemForm[PrescriptionItemForm["suspension"] = 9] = "suspension";
    PrescriptionItemForm[PrescriptionItemForm["toothPaste"] = 10] = "toothPaste";
})(PrescriptionItemForm || (PrescriptionItemForm = {}));
export const prescriptionItemForms = [
    'ampoule',
    'capsule',
    'tablet',
    'pill',
    'gel',
    'lotion',
    'syrup',
    'powder',
    'mouthwash',
    'suspension',
    'toothpaste'
];
// conversion functions
export function itemFormToString(itemForm) {
    return prescriptionItemForms[itemForm.valueOf()];
}
export function stringToItemForm(itemForm) {
    if (itemForm === 'ampoule') {
        return PrescriptionItemForm.ampoule;
    }
    else if (itemForm === 'capsule') {
        return PrescriptionItemForm.capsule;
    }
    else if (itemForm === 'tablet') {
        return PrescriptionItemForm.tablet;
    }
    else if (itemForm === 'pill') {
        return PrescriptionItemForm.pill;
    }
    else if (itemForm === 'gel') {
        return PrescriptionItemForm.gel;
    }
    else if (itemForm === 'lotion') {
        return PrescriptionItemForm.lotion;
    }
    else if (itemForm === 'powder') {
        return PrescriptionItemForm.powder;
    }
    else if (itemForm === 'mouthwash') {
        return PrescriptionItemForm.mouthWash;
    }
    else if (itemForm === 'suspension') {
        return PrescriptionItemForm.suspension;
    }
    else if (itemForm === 'toothpaste') {
        return PrescriptionItemForm.toothPaste;
    }
    else {
        return PrescriptionItemForm.syrup;
    }
}
//# sourceMappingURL=enum.form.js.map