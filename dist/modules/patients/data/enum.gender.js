// possible genders
export var Gender;
(function (Gender) {
    Gender[Gender["male"] = 0] = "male";
    Gender[Gender["female"] = 1] = "female";
})(Gender || (Gender = {}));
;
// conversion functions
export function genderToString(gender) {
    if (gender === Gender.male) {
        return "male";
    }
    else {
        return "female";
    }
}
export function stringToGender(string) {
    if (string === "male") {
        return Gender.male;
    }
    else {
        return Gender.female;
    }
}
//# sourceMappingURL=enum.gender.js.map