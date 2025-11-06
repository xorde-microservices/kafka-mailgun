/**
 * Convert URL string that contains bare local IP addresses to URL with 'localhost' hostname.
 * */
export const toLocalhost = (url: string) => {
	// https://regex101.com/r/vIE8X1/1
	const re = /:\/\/(\[::1]|127\.[012]?[0-9]{0,2}\.[012]?[0-9]{0,2}\.[012]?[0-9]{0,2})/gi;
	return url.replace(re, '://localhost');
};
