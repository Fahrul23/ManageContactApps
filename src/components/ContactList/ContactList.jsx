import { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import useContacts from '@/hooks/useContacts';
import ContactCard from '@/components/ContactCard/ContactCard';
import ContactDetail from '@/components/ContactDetail/ContactDetail';
import LoadingSkeleton from '@/components/UI/LoadingSkeleton';
import EmptyState from '@/components/UI/EmptyState';
import ConfirmDialog from '@/components/UI/ConfirmDialog';
const ContactList = ({
  onEditRequest,
  onAddContact,
  favoritesOnly = false
}) => {
  const {
    contacts,
    status,
    error,
    searchQuery,
    filterGender,
    sortBy,
    handleSearch,
    handleFilter,
    handleSort,
    handleDelete,
    handleToggleFavorite,
    refetch
  } = useContacts();
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [contactToDelete, setContactToDelete] = useState(null);
  const itemsPerPage = 8;
  const [currentPage, setCurrentPage] = useState(1);
  const displayContacts = favoritesOnly ? contacts.filter(c => c.isFavorite) : contacts;
  const combinedItems = favoritesOnly ? displayContacts : [...displayContacts, {
    isPlaceholder: true
  }];
  const totalItems = combinedItems.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const activePage = currentPage > totalPages ? 1 : currentPage;
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filterGender]);
  const startIndex = (activePage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = combinedItems.slice(startIndex, endIndex);
  const handleCardClick = contact => {
    setSelectedContact(contact);
    setShowDetailModal(true);
  };
  const handleEdit = contact => {
    setShowDetailModal(false);
    onEditRequest(contact);
  };
  const handleDeleteClick = contact => {
    setContactToDelete(contact);
    setShowDeleteConfirm(true);
  };
  const handleConfirmDelete = async () => {
    if (contactToDelete) {
      handleDelete(contactToDelete.id);
      toast.success(`${contactToDelete.fullName} dihapus!`);
      setContactToDelete(null);
      setShowDeleteConfirm(false);
      setShowDetailModal(false);
    }
  };
  const handleClearSearch = () => {
    handleSearch('');
  };
  const handleCloseDetail = () => {
    setShowDetailModal(false);
    setSelectedContact(null);
  };
  if (status === 'loading') {
    return <div>
        <ToolbarSection contacts={contacts} searchQuery={searchQuery} filterGender={filterGender} sortBy={sortBy} onSearch={handleSearch} onFilter={handleFilter} onSort={handleSort} />
        <LoadingSkeleton count={8} />
      </div>;
  }
  if (status === 'failed') {
    return <div className="flex flex-col items-center justify-center" style={{
      padding: '4rem 0',
      color: '#464554'
    }}>
        <div className="rounded-full flex items-center justify-center" style={{
        width: '80px',
        height: '80px',
        background: '#ffdad6',
        marginBottom: '1rem'
      }}>
          <span className="material-symbols-outlined" style={{
          color: '#ba1a1a',
          fontSize: '40px'
        }}>
            error
          </span>
        </div>
        <h3 className="text-headline-md" style={{
        color: '#0b1c30',
        marginBottom: '8px'
      }}>
          Gagal Memuat Kontak
        </h3>
        <p className="text-body-base" style={{
        color: '#464554',
        marginBottom: '24px'
      }}>
          {error}
        </p>
        <button onClick={refetch} style={{
        padding: '10px 24px',
        background: '#4648d4',
        color: '#fff',
        fontWeight: 600,
        borderRadius: '12px',
        border: 'none',
        cursor: 'pointer',
        fontFamily: 'inherit',
        fontSize: '14px'
      }}>
          Coba Lagi
        </button>
      </div>;
  }
  if (!favoritesOnly && status === 'succeeded' && contacts.length === 0 && !searchQuery && filterGender === 'all') {
    return <EmptyState title="Belum Ada Kontak" description="Mulai dengan memuat kontak dari API atau tambahkan kontak baru." actionLabel="Muat Kontak" onAction={refetch} />;
  }
  if (favoritesOnly && displayContacts.length === 0 && !searchQuery && filterGender === 'all') {
    return <div>
        <ToolbarSection title="Kontak Favorit" contacts={displayContacts} searchQuery={searchQuery} filterGender={filterGender} sortBy={sortBy} onSearch={handleSearch} onFilter={handleFilter} onSort={handleSort} />
        <div className="flex flex-col items-center justify-center p-12 text-on-surface-variant text-center">
          <div className="w-16 h-16 rounded-full bg-secondary/10 flex items-center justify-center mb-4">
            <span className="material-symbols-outlined" style={{
            fontSize: '32px',
            color: '#b4136d'
          }}>
              star
            </span>
          </div>
          <h3 className="text-headline-md text-on-surface">Belum Ada Favorit</h3>
          <p className="text-body-base text-on-surface-variant mt-2 max-w-sm">Kontak yang Anda tandai sebagai favorit akan muncul di sini.</p>
        </div>
      </div>;
  }
  if (displayContacts.length === 0) {
    return <div>
        <ToolbarSection title={favoritesOnly ? "Kontak Favorit" : "Daftar Kontak"} contacts={displayContacts} searchQuery={searchQuery} filterGender={filterGender} sortBy={sortBy} onSearch={handleSearch} onFilter={handleFilter} onSort={handleSort} />
        <div className="flex flex-col items-center justify-center" style={{
        padding: '4rem 0',
        color: '#464554'
      }}>
          <span className="material-symbols-outlined" style={{
          color: '#c7c4d7',
          fontSize: '48px',
          marginBottom: '16px'
        }}>
            search_off
          </span>
          <p className="text-headline-md" style={{
          color: '#0b1c30'
        }}>Kontak tidak ditemukan</p>
          <p className="text-body-base" style={{
          color: '#464554',
          marginTop: '8px'
        }}>
            Coba kata kunci atau filter lain
          </p>
          <button onClick={handleClearSearch} style={{
          marginTop: '16px',
          padding: '8px 20px',
          background: 'rgba(70,72,212,0.1)',
          color: '#4648d4',
          border: 'none',
          borderRadius: '8px',
          fontWeight: 600,
          fontSize: '14px',
          cursor: 'pointer',
          fontFamily: 'inherit'
        }}>
            Hapus Pencarian
          </button>
        </div>
      </div>;
  }
  return <div>
      
      <ToolbarSection title={favoritesOnly ? "Kontak Favorit" : "Daftar Kontak"} contacts={displayContacts} searchQuery={searchQuery} filterGender={filterGender} sortBy={sortBy} onSearch={handleSearch} onFilter={handleFilter} onSort={handleSort} />

      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4" style={{
      gap: '1.5rem'
    }}>
        <AnimatePresence mode="popLayout">
          {currentItems.map(item => {
          if (item.isPlaceholder) {
            return <AddContactPlaceholder key="add-placeholder" onClick={onAddContact} />;
          }
          return <ContactCard key={item.id} contact={item} onEdit={handleEdit} onDelete={handleDeleteClick} onSelect={handleCardClick} onToggleFavorite={handleToggleFavorite} />;
        })}
        </AnimatePresence>
      </div>

      
      {totalPages > 1 && <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8 pt-6 border-t border-outline-variant/30">
          <span className="text-body-sm text-on-surface-variant font-medium">
            Menampilkan {startIndex + 1}–{Math.min(endIndex, totalItems)} dari {totalItems} kartu
          </span>
          <div className="flex items-center gap-2">
            
            <button type="button" onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))} disabled={activePage === 1} className="w-10 h-10 border border-outline-variant rounded-xl text-on-surface hover:bg-surface-container-low transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center bg-white cursor-pointer">
              <span className="material-symbols-outlined" style={{
            fontSize: '20px'
          }}>
                chevron_left
              </span>
            </button>

            
            {Array.from({
          length: totalPages
        }, (_, i) => i + 1).map(pageNum => {
          const isActive = pageNum === activePage;
          return <button key={pageNum} type="button" onClick={() => setCurrentPage(pageNum)} className={`w-10 h-10 rounded-xl text-label-caps flex items-center justify-center transition-all cursor-pointer font-bold ${isActive ? 'bg-primary text-on-primary shadow-md shadow-primary/20' : 'border border-outline-variant text-on-surface-variant hover:bg-surface-container-low bg-white'}`}>
                  {pageNum}
                </button>;
        })}

            
            <button type="button" onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))} disabled={activePage === totalPages} className="w-10 h-10 border border-outline-variant rounded-xl text-on-surface hover:bg-surface-container-low transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center bg-white cursor-pointer">
              <span className="material-symbols-outlined" style={{
            fontSize: '20px'
          }}>
                chevron_right
              </span>
            </button>
          </div>
        </div>}

      
      {showDetailModal && selectedContact && <ContactDetail contact={selectedContact} onEdit={handleEdit} onClose={handleCloseDetail} onDelete={handleDeleteClick} />}

      
      <ConfirmDialog isOpen={showDeleteConfirm} onClose={() => setShowDeleteConfirm(false)} onConfirm={handleConfirmDelete} title="Hapus Kontak" message={`Apakah Anda yakin ingin menghapus ${contactToDelete?.fullName}? Tindakan ini tidak dapat dibatalkan.`} confirmLabel="Hapus" />
    </div>;
};
function ToolbarSection({
  title = "Daftar Kontak",
  contacts,
  searchQuery,
  filterGender,
  sortBy,
  onSearch,
  onFilter,
  onSort
}) {
  return <div className="flex flex-col md:flex-row md:items-center justify-between gap-4" style={{
    marginBottom: '2rem'
  }}>
      <div>
        <h2 className="text-display-lg" style={{
        color: '#0b1c30'
      }}>
          {title}
        </h2>
        <p className="text-body-base" style={{
        color: '#464554'
      }}>
          Menampilkan {contacts.length} kontak tersedia
        </p>
      </div>

      <div className="flex items-center gap-3">
        
        <div className="relative">
          <select id="gender-filter" value={filterGender} onChange={e => onFilter(e.target.value)} style={{
          appearance: 'none',
          background: '#fff',
          border: '1px solid #c7c4d7',
          borderRadius: '8px',
          padding: '8px 36px 8px 14px',
          fontSize: '14px',
          outline: 'none',
          cursor: 'pointer',
          fontFamily: 'inherit',
          color: '#0b1c30',
          transition: 'box-shadow 0.2s'
        }} onFocus={e => e.target.style.boxShadow = '0 0 0 3px rgba(70,72,212,0.15)'} onBlur={e => e.target.style.boxShadow = ''}>
            <option value="all">Semua Gender</option>
            <option value="male">Pria</option>
            <option value="female">Wanita</option>
          </select>
          <span className="material-symbols-outlined" style={{
          position: 'absolute',
          right: '8px',
          top: '50%',
          transform: 'translateY(-50%)',
          pointerEvents: 'none',
          color: '#767586',
          fontSize: '18px'
        }}>
            expand_more
          </span>
        </div>

        
        <div className="relative">
          <select id="sort-by" value={sortBy} onChange={e => onSort(e.target.value)} style={{
          appearance: 'none',
          background: '#fff',
          border: '1px solid #c7c4d7',
          borderRadius: '8px',
          padding: '8px 36px 8px 14px',
          fontSize: '14px',
          outline: 'none',
          cursor: 'pointer',
          fontFamily: 'inherit',
          color: '#0b1c30',
          transition: 'box-shadow 0.2s'
        }} onFocus={e => e.target.style.boxShadow = '0 0 0 3px rgba(70,72,212,0.15)'} onBlur={e => e.target.style.boxShadow = ''}>
            <option value="name-asc">Urutkan: Nama A-Z</option>
            <option value="name-desc">Nama Z-A</option>
            <option value="newest">Terbaru</option>
          </select>
          <span className="material-symbols-outlined" style={{
          position: 'absolute',
          right: '8px',
          top: '50%',
          transform: 'translateY(-50%)',
          pointerEvents: 'none',
          color: '#767586',
          fontSize: '18px'
        }}>
            sort
          </span>
        </div>
      </div>
    </div>;
}
function AddContactPlaceholder({
  onClick
}) {
  const [hovered, setHovered] = useState(false);
  return <div id="add-contact-card" onClick={onClick} className="rounded-xl flex flex-col items-center justify-center text-center cursor-pointer" style={{
    background: hovered ? '#dce9ff' : '#e5eeff',
    border: '2px dashed rgba(70,72,212,0.3)',
    padding: '1.5rem',
    transition: 'background 0.2s',
    minHeight: '280px'
  }} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
      <div className="rounded-full flex items-center justify-center" style={{
      width: '64px',
      height: '64px',
      background: 'rgba(70,72,212,0.1)',
      marginBottom: '1rem',
      transform: hovered ? 'scale(1.1)' : 'scale(1)',
      transition: 'transform 0.2s'
    }}>
        <span className="material-symbols-outlined" style={{
        color: '#4648d4',
        fontSize: '30px'
      }}>
          person_add
        </span>
      </div>
      <p className="text-headline-md" style={{
      color: '#4648d4'
    }}>
        Tambah Kontak Baru
      </p>
      <p className="text-body-sm" style={{
      color: '#464554',
      marginTop: '8px'
    }}>
        Perluas jaringan Anda hari ini
      </p>
    </div>;
}
export default ContactList;