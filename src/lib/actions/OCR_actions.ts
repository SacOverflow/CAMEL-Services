import Tesseract from 'tesseract.js';

export const tessearctImageOCR = async (
	imageURL: string,
): Promise<{
	total: string | number;
	confidence: number;
	store: string;
}> => {
	const totalRegex =
		/(?:total|sum|amount|balance|t[0o]tal|t0tal|subtotal|s[uv]m|am[ou0]nt|bal[.]?|charge[s]?|due|payable|grand[ ]?total|t[ao]tal[s]?|[^a-zA-Z]tot)[^a-zA-Z]?\s*[:=]?[-\s\$]*\d{1,}[.,]?\d{0,2}/gi;
	const storeRegex =
		/(?:wal-?mart|the?\s*home\s*depot|home\s*depot|lowe'?s|costco|sam'?s\s*club|ace\s+hardware|target|contractor'?s?\s*warehouse|harbor\s+freight(\s+tools)?)/i;

	const resp = {
		total: 0,
		confidence: 0,
		store: '',
	};
	try {
		// tesseract OCR
		const tesseractResp = await Tesseract.recognize(imageURL, 'eng', {});

		// confidence score
		const confidence = tesseractResp.data.confidence;
		const { text } = tesseractResp.data;

		// total match
		const totalMatch = text.match(totalRegex);

		console.log('totalMatch: ', totalMatch);
		// store match
		const storeMatch = text.match(storeRegex);
		console.log('storeMatch: ', storeMatch);
		resp.store = storeMatch ? storeMatch[0] : '';

		if (totalMatch) {
			// const total: any = totalMatch[0].match(/\d{1,}[.,]?\d{0,2}/);
			const num_float_regex = /\d{1,}[.,]?\d{0,2}/;
			const total = totalMatch[0].match(num_float_regex);

			// assure that the total is a number
			if (total) {
				resp.total = parseFloat(total[0]) || 0;
			}
			resp.confidence = confidence;
		}
	} catch (error) {
		console.error('error with tesseract: ', error);

		return {
			total: 0,
			confidence: 0,
			store: '',
		};
	}

	return resp;
};
