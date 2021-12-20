import { configs } from "./config";
export function log(name, ...args) {
    if ((typeof name === "string" && !configs[name].shouldLog) ||
        name === true) {
        return;
    }
    console.log(name, "=>", ...args);
}
//# sourceMappingURL=log.js.map