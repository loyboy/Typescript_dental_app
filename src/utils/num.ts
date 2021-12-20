export function num(input: string | number) {
	return typeof input === "number"
		? input
		: isNaN(parseFloat(input))
		? 0
		: parseFloat(input);
}
export function roundval(decimal : number, decimalPoints : number): number {
    let roundedValue = Math.round(decimal * Math.pow(10, decimalPoints)) / Math.pow(10, decimalPoints);
    // console.log(`Rounded ${decimal} to ${roundedValue}`);
    return roundedValue;
}