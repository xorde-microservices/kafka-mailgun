export const j = (o: any) => JSON.stringify(o);

/**
 * Recursively dumps `obj` Object as comma-separated string of key=value pairs
 * Example: v({a:2,b:{c:3}}) = 'a=2, b=(c=3)
 * @param obj {any} Object to dump
 * @param ignoreProps {string[]=} (Optional) Properties to ignore, array of strings
 * @param max {number=} (Optional) Maximum amount of keys to show; _...more[N]_ will be added to replace exceeding key element
 * @param levels {number=} (Optional) Maximum levels of recursion
 */
export const v = <T>(
	obj: T,
	ignoreProps?: (keyof T)[] & string[],
	max: number = null,
	levels: number | undefined = 10,
) =>
	levels > 0
		? Object.keys(obj ? obj : {})
		.filter((f) => !(ignoreProps || []).includes(f))
		.map((m, i) => {
			if ((max && i < max) || !max)
				return typeof obj[m] == 'object' ? m + `=(${v(obj[m], ignoreProps, max, levels - 1)})` : m + '=' + obj[m];
			else if (max && i == max + 1) return `...more[${Object.keys(obj).length - max}]`;
		})
		.filter((f) => f != null)
		.join(', ') || ''
		: 'MAX_RECURSIVE_LEVELS_REACHED';

export const DEBUG_INSPECT = (obj, suppress = false): typeof obj => {
	if (!suppress) {
		console.debug(v(obj));
	}
	return obj;
};

export function getMethodName(suffix?: string) {
	const err = new Error();
	return /at \w+\.(\w+)/.exec(err.stack.split('\n')[2])[1] + suffix; // we want the 2nd method in the call stack
}
