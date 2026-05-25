const LoadingSkeleton = ({
  count = 8
}) => {
  return <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" style={{
    gap: '1.5rem'
  }}>
      {Array.from({
      length: count
    }).map((_, index) => <div key={index} className="bg-white rounded-xl animate-pulse" style={{
      padding: '1.5rem',
      border: '1px solid rgba(199,196,215,0.3)',
      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.05)'
    }}>
          
          <div className="flex justify-center" style={{
        marginBottom: '1rem'
      }}>
            <div className="rounded-full" style={{
          width: '96px',
          height: '96px',
          background: '#e5eeff'
        }} />
          </div>

          
          <div className="flex justify-center" style={{
        marginBottom: '8px'
      }}>
            <div className="rounded-full" style={{
          width: '64px',
          height: '20px',
          background: '#e5eeff'
        }} />
          </div>

          
          <div className="rounded mx-auto" style={{
        height: '20px',
        background: '#e5eeff',
        width: '75%',
        marginBottom: '16px'
      }} />

          
          {[100, 80, 70].map((w, i) => <div key={i} className="rounded mx-auto" style={{
        height: '14px',
        background: '#e5eeff',
        width: `${w}%`,
        marginBottom: '8px'
      }} />)}

          
          <div className="flex gap-2" style={{
        marginTop: '1.5rem'
      }}>
            <div className="flex-1 rounded-lg" style={{
          height: '32px',
          background: '#e5eeff'
        }} />
            <div className="flex-1 rounded-lg" style={{
          height: '32px',
          background: '#ffd9e4',
          opacity: 0.4
        }} />
          </div>
        </div>)}
    </div>;
};
export default LoadingSkeleton;