const SearchBar = ({
  value,
  onChange,
  placeholder = 'Search contacts...'
}) => {
  const handleClear = () => {
    onChange('');
  };
  return <div className="relative flex items-center">
      
      <svg className="absolute left-3 w-5 h-5 text-slate-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>

      
      <input type="text" value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 bg-white text-slate-700 placeholder:text-slate-400 text-sm outline-none transition-all" />

      
      {value && <button onClick={handleClear} className="absolute right-3 text-slate-400 hover:text-slate-600 transition-colors" aria-label="Clear search">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>}
    </div>;
};
export default SearchBar;