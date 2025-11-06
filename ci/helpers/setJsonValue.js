// eslint-disable-next-line @typescript-eslint/no-var-requires
const fs = require('fs');

/**
 * This script will parse json file and return value of the property defined by path separated by '.'
 * Usage: node ci/helpers/setJsonValue.js <filename> <path> <value> [options[,options]]
 *   filename: any JSON file, example: package.json
 *   path: path within JSON, example: parent.child.value
 *   value: any value, can be string, number or object, example:
 *     string - example: 'test'
 *     number - example: 1 or '1' or 1.2345 or '1.2345'
 *     object - example: '{"a":1,b:"2"}'
 *   options, example: tabs,number
 *     tabs - format output JSON with tabs, otherwise output will be a string JSON without formatting
 *     number - convert value to number (if fails value will be string)
 *     object - convert value to object (if fails value will be string)
 *     boolean - convert value to boolean, only 'true' or '1' converts to true
 *     delete - removes value and its key, provided value argument is ignored and can be anything
 *     null - sets null as value, provided value argument is ignored and can be anything
 */

const args = process.argv.slice(2);
const jsonFilename = args[0];
const jsonPaths = args[1].split('.');
const jsonValue = args[2];
const jsonOpts = args[3]?.split(',') || [];

/**
 * Returns value of json object property by path defined as array of strings, where parent element comes first.
 * Example: getValueByPath({parent: {value: 1}}, ['parent', 'value']) // returns value 1
 * @param {object} obj
 * @param {string[]} paths
 * @param {any} value
 */
const setValueByPath = (obj, paths, value) => {
	const path = paths[0];
	if ((!obj[path] || typeof obj[path] !== 'object') && paths.length > 1) {
		obj[path] = setValueByPath({}, paths.slice(1), value);
	} else if (paths.length > 1) {
		obj[path] = setValueByPath(obj[path], paths.slice(1), value);
	} else if (paths.length === 1) {
		if (jsonOpts.includes('number')) {
			if (Number(value)) {
				value = Number(value);
			} else {
				console.error('Conversion to number failed: %o', value);
			}
		} else if (jsonOpts.includes('object')) {
			try {
				value = JSON.parse(value);
			} catch (e) {
				console.error('Conversion to object failed: %o', value);
			}
		} else if (jsonOpts.includes('boolean')) {
			value = value === 'true' || value === '1';
		} else if (jsonOpts.includes('delete')) {
			value = undefined;
		} else if (jsonOpts.includes('null')) {
			value = null;
		}

		obj[path] = value;
	}
	return obj;
};

const jsonObj = JSON.parse(fs.readFileSync(jsonFilename).toString());
const json = setValueByPath(jsonObj, jsonPaths, jsonValue);

try {
	fs.writeFileSync(jsonFilename, JSON.stringify(json, null, jsonOpts.includes('tabs') ? '\t' : null));
	console.log('Complete');
} catch (e) {
	console.error('Error:', e);
}
