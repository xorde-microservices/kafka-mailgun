// eslint-disable-next-line @typescript-eslint/no-var-requires
const fs = require('fs');

/**
 * This script will parse json file and return value of the property defined by path separated by '.'
 */

const args = process.argv.slice(2);
const jsonFilename = args[0];
const jsonPaths = args[1].split('.');

/**
 * Returns value of json object property by path defined as array of strings, where parent element comes first.
 * Example: getValueByPath({parent: {value: 1}}, ['parent', 'value']) // returns value 1
 * @param {object} obj
 * @param {string[]} paths
 */
const getValueByPath = (obj, paths) => {
	const path = paths[0];
	if (obj && obj[path] && paths.length > 1 && path) {
		return getValueByPath(obj[path] ? obj[path] : null, paths.slice(1));
	} else {
		return obj[path];
	}
};

const json = JSON.parse(fs.readFileSync(jsonFilename).toString());
const value = getValueByPath(json, jsonPaths);

value && console.log(typeof value != 'object' ? value : JSON.stringify(value));
