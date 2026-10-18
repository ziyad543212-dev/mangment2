import { Languages } from 'lucide-react';
import { useLocale } from '../state/locale.jsx';

export default function LanguageToggle({ className = '' }) {
  const { locale, t, toggleLocale } = useLocale();
  return (
    <button
      className={`language-toggle ${className}`}
      type="button"
      onClick={toggleLocale}
      aria-label={locale === 'en' ? 'Switch language to Arabic' : 'تغيير اللغة إلى الإنجليزية'}
      title={locale === 'en' ? 'Switch language to Arabic' : 'تغيير اللغة إلى الإنجليزية'}
    >
      <Languages size={15} />
      <span>{t('language')}</span>
    </button>
  );
}
