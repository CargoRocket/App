import de from '../res/i18n/de.json';
import en from '../res/i18n/en.json';

export const LanguageProvider = (language) => {
  switch (language) {
    case 'de':
      return {...en, ...de};
    case 'en':
    default:
      return en;
  }
};
