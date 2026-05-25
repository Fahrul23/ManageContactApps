import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { setSearchQuery } from '@/features/contacts/contactsSlice';
import { selectSearchQuery } from '@/features/contacts/contactsSelectors';
import ContactList from '@/components/ContactList/ContactList';
import AddContactPage from '@/pages/AddContactPage';
import EditContactPage from '@/pages/EditContactPage';
const NAV_ITEMS = [{
  icon: 'person_book',
  label: 'Contacts'
}, {
  icon: 'star',
  label: 'Favorites'
}];
function Icon({
  name,
  fill = 0,
  style = {},
  className = ''
}) {
  return <span className={`material-symbols-outlined ${className}`} style={{
    fontVariationSettings: `'FILL' ${fill}, 'wght' 400, 'GRAD' 0, 'opsz' 24`,
    verticalAlign: 'middle',
    ...style
  }}>
      {name}
    </span>;
}
function Sidebar({
  activeNav,
  setActiveNav,
  onAddContact
}) {
  return <aside className="fixed left-0 top-0 flex flex-col h-full" style={{
    width: '200px',
    padding: '2rem 0.5rem',
    background: '#f8f9ff',
    borderRight: '1px solid #c7c4d7',
    zIndex: 50
  }}>
      
      <div style={{
      marginBottom: '2.5rem',
      paddingLeft: '1rem',
      paddingRight: '1rem'
    }}>
        <h1 style={{
        fontSize: '24px',
        lineHeight: '32px',
        fontWeight: 700,
        color: '#4648d4',
        margin: 0
      }}>
          Manage Contact
        </h1>
        <p style={{
        fontSize: '13px',
        color: '#464554',
        opacity: 0.7,
        marginTop: '2px'
      }}>
          Manage your network
        </p>
      </div>

      
      <nav style={{
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      gap: '4px'
    }}>
        {NAV_ITEMS.map(({
        icon,
        label
      }) => {
        const isActive = activeNav === label;
        return <a key={label} href="#" id={`nav-${label.toLowerCase()}`} onClick={e => {
          e.preventDefault();
          setActiveNav(label);
        }} className="flex items-center gap-3 rounded-lg" style={{
          padding: '10px 16px',
          textDecoration: 'none',
          color: isActive ? '#4648d4' : '#464554',
          fontWeight: isActive ? 700 : 400,
          background: isActive ? 'rgba(70,72,212,0.08)' : 'transparent',
          borderRight: isActive ? '3px solid #4648d4' : '3px solid transparent',
          transition: 'all 0.2s'
        }}>
              <Icon name={icon} style={{
            fontSize: '20px',
            color: isActive ? '#4648d4' : '#464554'
          }} />
              <span style={{
            fontSize: '11px',
            letterSpacing: '0.05em',
            fontWeight: isActive ? 700 : 600,
            color: isActive ? '#4648d4' : '#464554'
          }}>
                {label}
              </span>
            </a>;
      })}
      </nav>

      
      <div style={{
      paddingLeft: '1rem',
      paddingRight: '1rem'
    }}>
        <button id="add-contact-sidebar-btn" onClick={onAddContact} className="w-full flex items-center justify-center gap-2 rounded-xl" style={{
        background: '#4648d4',
        color: '#fff',
        padding: '12px 16px',
        fontSize: '14px',
        fontWeight: 600,
        border: 'none',
        cursor: 'pointer',
        boxShadow: '0 4px 12px rgba(70,72,212,0.3)',
        transition: 'opacity 0.2s',
        fontFamily: 'inherit'
      }} onMouseEnter={e => e.currentTarget.style.opacity = '0.9'} onMouseLeave={e => e.currentTarget.style.opacity = '1'}>
          <Icon name="add" style={{
          fontSize: '20px'
        }} />
          Add Contact
        </button>
      </div>
    </aside>;
}
function TopBar({
  onAddContact,
  onSearchActive
}) {
  const dispatch = useDispatch();
  const searchQuery = useSelector(selectSearchQuery);
  const handleSearchChange = e => {
    dispatch(setSearchQuery(e.target.value));
    if (onSearchActive) {
      onSearchActive();
    }
  };
  return <header className="flex justify-between items-center sticky top-0" style={{
    height: '64px',
    padding: '0 1.5rem',
    background: '#f8f9ff',
    borderBottom: '1px solid #c7c4d7',
    zIndex: 40,
    boxShadow: '0 1px 4px rgba(0,0,0,0.04)'
  }}>
      
      <div className="flex items-center gap-4" style={{
      flex: 1
    }}>
        <div className="relative" style={{
        maxWidth: '400px',
        width: '100%'
      }}>
          <Icon name="search" style={{
          position: 'absolute',
          left: '12px',
          top: '50%',
          transform: 'translateY(-50%)',
          color: '#767586',
          fontSize: '18px',
          pointerEvents: 'none'
        }} />
          <input id="global-search" type="text" placeholder="Cari kontak..." className="w-full rounded-full" value={searchQuery} onChange={handleSearchChange} style={{
          background: '#fff',
          border: '1px solid #c7c4d7',
          padding: '8px 16px 8px 40px',
          fontSize: '14px',
          outline: 'none',
          transition: 'box-shadow 0.2s',
          fontFamily: 'inherit',
          color: '#0b1c30'
        }} onFocus={e => e.target.style.boxShadow = '0 0 0 3px rgba(70,72,212,0.15)'} onBlur={e => e.target.style.boxShadow = ''} />
        </div>
      </div>

      
      <div className="flex items-center gap-4">
        <button id="notifications-btn" style={{
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        color: '#464554'
      }}>
          <Icon name="notifications" style={{
          fontSize: '22px'
        }} />
        </button>

        <div className="flex items-center gap-2" style={{
        paddingLeft: '16px',
        borderLeft: '1px solid #c7c4d7'
      }}>
          <Icon name="account_circle" fill={1} style={{
          color: '#464554',
          fontSize: '28px'
        }} />
        </div>

        
        <button id="add-contact-topbar-btn" onClick={onAddContact} className="flex items-center gap-2 rounded-full" style={{
        background: '#4648d4',
        color: '#fff',
        padding: '8px 20px',
        fontSize: '14px',
        fontWeight: 600,
        border: 'none',
        cursor: 'pointer',
        fontFamily: 'inherit',
        transition: 'opacity 0.2s'
      }} onMouseEnter={e => e.currentTarget.style.opacity = '0.9'} onMouseLeave={e => e.currentTarget.style.opacity = '1'}>
          Add Contact
        </button>
      </div>
    </header>;
}
function NexusApp() {
  const [activeNav, setActiveNav] = useState('Contacts');
  const [view, setView] = useState('list');
  const [contactToEdit, setContactToEdit] = useState(null);
  const goToAddContact = () => {
    setContactToEdit(null);
    setView('add');
  };
  const goToEditContact = contact => {
    setContactToEdit(contact);
    setView('edit');
  };
  const goToList = () => {
    setContactToEdit(null);
    setView('list');
  };
  return <div className="flex overflow-hidden" style={{
    fontFamily: "'Hanken Grotesk', sans-serif",
    background: '#f8f9ff',
    color: '#0b1c30',
    minHeight: '100vh'
  }}>
      
      <Sidebar activeNav={activeNav} setActiveNav={nav => {
      setActiveNav(nav);
      setView('list');
    }} onAddContact={goToAddContact} />

      
      <div className="flex flex-col" style={{
      flex: 1,
      marginLeft: '200px',
      minHeight: '100vh'
    }}>
        
        <TopBar onAddContact={goToAddContact} onSearchActive={() => setView('list')} />

        
        <main style={{
        flex: 1,
        overflowY: 'auto',
        padding: '2rem',
        background: '#f8f9ff'
      }}>
          {view === 'list' && (activeNav === 'Contacts' ? <ContactList onEditRequest={goToEditContact} onAddContact={goToAddContact} /> : <ContactList favoritesOnly={true} onEditRequest={goToEditContact} onAddContact={goToAddContact} />)}
          {view === 'add' && <AddContactPage onBack={goToList} />}
          {view === 'edit' && <EditContactPage contactToEdit={contactToEdit} onBack={goToList} />}
        </main>
      </div>

      
      <Toaster position="bottom-right" toastOptions={{
      duration: 3000,
      style: {
        background: '#fff',
        color: '#0b1c30',
        padding: '12px 16px',
        borderRadius: '12px',
        boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)',
        border: '1px solid #c7c4d7',
        fontFamily: "'Hanken Grotesk', sans-serif"
      },
      success: {
        iconTheme: {
          primary: '#22c55e',
          secondary: '#fff'
        }
      },
      error: {
        iconTheme: {
          primary: '#ba1a1a',
          secondary: '#fff'
        }
      }
    }} />
    </div>;
}
function App() {
  return <BrowserRouter>
      <Routes>
        <Route path="/" element={<NexusApp />} />
        <Route path="*" element={<NexusApp />} />
      </Routes>
    </BrowserRouter>;
}
export default App;