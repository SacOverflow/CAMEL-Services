import translations from './language.json';
const translation: any = translations;
/**
 *
 * @param key string for the word/sentence
 * @param lang string for the language chosen ENUM(english, spanish, viet)
 * @returns langauage translation of the sentence DEFUALT : ENGLISH
 */
const getLang = (key: string, lang: string) => {
	//IF word doesnt exist, return the passed word
	if (!translation[key]) {
		console.error(`Translation key "${key}" not found.`);
		return key;
	}
	// If the language doesnt exist but the word does, then return the english reference of it
	if (translation[key][lang]) {
		return translation[key][lang];
	} else {
		return translation[key].english;
	}
};

export default getLang;
