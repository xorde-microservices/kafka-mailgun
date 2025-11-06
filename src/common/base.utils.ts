export function removeEmpty(obj) {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	return Object.fromEntries(Object.entries(obj).filter(([_, v]) => v != null));
}

export function deleteEmptyProps(obj: any): void {
	// modifies passed obj in place, removing empty properties (inc. empty arrays)
	return Object.keys(obj).forEach((k) => {
		if (obj[k] === null || obj[k] === undefined || (Array.isArray(obj[k]) && obj[k].length === 0)) {
			delete obj[k];
		}
	});
}

export function explainEnum(e: any, value: number): string {
	return value + '=' + e[value];
}

export function getEnumKeyByEnumValue(myEnum: any, enumKey: string): number {
	const keys = Object.keys(myEnum).filter((x) => enumKey == x);
	return keys.length > 0 ? myEnum[keys[0]] : null;
}

export type ValueOf<T> = T[keyof T];

export function roundDown(value: number, decimals: number) {
	return Math.floor(value * 10 ** decimals) / 10 ** decimals;
}

export function isValidRegex(s) {
	try {
		const m = s.match(/^([/~@;%#'])(.*?)\1([gimsuy]*)$/);
		return m ? !!new RegExp(m[2], m[3]) : false;
	} catch (e) {
		return false;
	}
}

export function stringToRegex(s) {
	const m = s.match(/^([/~@;%#'])(.*?)\1([gimsuy]*)$/);
	return m ? new RegExp(m[2], m[3]) : new RegExp(s);
}

export function strEndsWith(str, suffix) {
	return str.toString().match(suffix + '$') == suffix;
}

export function isJson(str) {
	try {
		JSON.parse(str);
	} catch (e) {
		return false;
	}
	return true;
}
