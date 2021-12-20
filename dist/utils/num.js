export function num(input) {
    return typeof input === "number"
        ? input
        : isNaN(parseFloat(input))
            ? 0
            : parseFloat(input);
}
//# sourceMappingURL=num.js.map