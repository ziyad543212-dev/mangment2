import { useEffect } from 'react';
import { X } from 'lucide-react';
import { useLocale } from '../state/locale.jsx';

export default function Modal({ title, children, onClose, wide = false }) {
  const { t } = useLocale();
  useEffect(() => {
    function onKeyDown(event) {
      if (event.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [onClose]);

  return (
    <div className="modal-backdrop" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section className={`modal ${wide ? 'modal-wide' : ''}`} role="dialog" aria-modal="true" aria-labelledby="modal-title">
        <div className="modal-heading"><div><span className="eyebrow">{t('workspaceLabel')}</span><h2 id="modal-title">{title}</h2></div><button className="icon-button" aria-label={t('close')} onClick={onClose}><X size={19} /></button></div>
        {children}
      </section>
    </div>
  );
}
