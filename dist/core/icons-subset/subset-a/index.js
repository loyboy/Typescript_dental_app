import { initializeIcons as i } from "./fabric-icons";
import { registerIconAliases } from "./iconAliases";
const DEFAULT_BASE_URL = "https://spoprod-a.akamaihd.net/files/fabric/assets/icons/";
export function initializeIcons(baseUrl = DEFAULT_BASE_URL, options) {
    [i].forEach((initialize) => initialize(baseUrl, options));
    registerIconAliases();
}
//# sourceMappingURL=index.js.map