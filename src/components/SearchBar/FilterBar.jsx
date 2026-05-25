const FilterBar = ({
  filterGender,
  onFilterChange,
  sortBy,
  onSortChange,
  totalCount
}) => {
  return <div className="flex flex-wrap items-center justify-between gap-3">
      
      <div className="text-sm text-slate-500">
        Showing <span className="font-semibold text-slate-700">{totalCount}</span> contacts
      </div>

      
      <div className="flex flex-wrap items-center gap-3">
        
        <div className="flex items-center gap-2">
          <label htmlFor="gender-filter" className="text-sm text-slate-600 font-medium">
            Gender:
          </label>
          <select id="gender-filter" value={filterGender} onChange={e => onFilterChange(e.target.value)} className="text-sm border border-slate-200 rounded-lg px-3 py-2 bg-white text-slate-600 focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 outline-none transition-all cursor-pointer">
            <option value="all">All Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>

        
        <div className="flex items-center gap-2">
          <label htmlFor="sort-by" className="text-sm text-slate-600 font-medium">
            Sort:
          </label>
          <select id="sort-by" value={sortBy} onChange={e => onSortChange(e.target.value)} className="text-sm border border-slate-200 rounded-lg px-3 py-2 bg-white text-slate-600 focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 outline-none transition-all cursor-pointer">
            <option value="name-asc">Name A-Z</option>
            <option value="name-desc">Name Z-A</option>
            <option value="newest">Newest First</option>
          </select>
        </div>
      </div>
    </div>;
};
export default FilterBar;