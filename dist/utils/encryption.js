import { num } from "@utils";
const salt = location.host
    .split("")
    .map(x => x.charCodeAt(0))
    .reduce((a, b) => a + b, 0);
export function encrypt(str) {
    return str
        .split("")
        .map(x => x.charCodeAt(0) + salt)
        .join(",");
}
export function decrypt(str) {
    return str
        .split(",")
        .map(x => String.fromCharCode(num(x) - salt))
        .join("");
}
//# sourceMappingURL=encryption.js.map