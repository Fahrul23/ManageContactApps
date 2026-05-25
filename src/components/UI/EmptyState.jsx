const EmptyState = ({
  title = 'Tidak Ada Data',
  description = 'Belum ada data untuk ditampilkan.',
  actionLabel,
  onAction
}) => {
  return <div className="flex flex-col items-center justify-center" style={{
    padding: '4rem 1rem',
    color: '#464554'
  }}>
      
      <div className="rounded-full flex items-center justify-center" style={{
      width: '96px',
      height: '96px',
      background: '#e5eeff',
      marginBottom: '1.5rem'
    }}>
        <span className="material-symbols-outlined" style={{
        color: '#4648d4',
        fontSize: '48px'
      }}>
          group
        </span>
      </div>

      
      <h3 className="text-headline-md" style={{
      color: '#0b1c30',
      marginBottom: '8px'
    }}>
        {title}
      </h3>

      
      <p className="text-body-base" style={{
      color: '#464554',
      textAlign: 'center',
      maxWidth: '400px',
      marginBottom: '1.5rem'
    }}>
        {description}
      </p>

      
      {actionLabel && onAction && <button onClick={onAction} style={{
      padding: '10px 24px',
      background: '#4648d4',
      color: '#fff',
      fontWeight: 600,
      fontSize: '14px',
      borderRadius: '12px',
      border: 'none',
      cursor: 'pointer',
      fontFamily: 'inherit',
      boxShadow: '0 4px 12px rgba(70,72,212,0.3)',
      transition: 'opacity 0.2s'
    }} onMouseEnter={e => e.currentTarget.style.opacity = '0.9'} onMouseLeave={e => e.currentTarget.style.opacity = '1'}>
          {actionLabel}
        </button>}
    </div>;
};
export default EmptyState;