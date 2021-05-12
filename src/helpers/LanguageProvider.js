import de from '../res/i18n/de.json';
import en from '../res/i18n/en.json';
import {Platform, NativeModules} from 'react-native';

export const deviceLanguage =
  Platform.OS === 'ios'
    ? NativeModules.SettingsManager.settings.AppleLocale ||
      NativeModules.SettingsManager.settings.AppleLanguages[0] //iOS 13
    : NativeModules.I18nManager.localeIdentifier;

export const LanguageProvider = () => {
  switch (deviceLanguage.slice(0, 2)) {
    case 'de':
      return {...en, ...de};
    case 'en':
    default:
      return en;
  }
};
