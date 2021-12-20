import { escapeRegExp } from "@utils";
export function textualFilter(list, text) {
    return list.filter(item => {
        const filters = text
            .split(" ")
            .map(filterString => new RegExp(escapeRegExp(filterString), "gim"));
        if (!text) {
            return true;
        }
        return filters.every(filter => filter.test(item.searchableString.toString()));
    });
}
//# sourceMappingURL=textual-filter.js.map