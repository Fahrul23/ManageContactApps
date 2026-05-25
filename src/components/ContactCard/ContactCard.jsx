import { useState } from 'react';
import { motion } from 'framer-motion';
import { getInitials, getAvatarColor } from '@/utils/formatContact';
const statusColors = {
  online: '#22c55e',
  away: '#facc15'
};
const ContactCard = ({
  contact,
  onEdit,
  onDelete,
  onSelect,
  onToggleFavorite
}) => {
  const [imageError, setImageError] = useState(false);
  const isWoman = contact.gender === 'female';
  const displayGender = isWoman ? 'Wanita' : 'Pria';
  const handleImageError = () => {
    setImageError(true);
  };
  const handleCardClick = e => {
    if (e.target.closest('button')) return;
    onSelect(contact);
  };
  const handleEdit = e => {
    e.stopPropagation();
    onEdit(contact);
  };
  const handleDelete = e => {
    e.stopPropagation();
    onDelete(contact);
  };
  const handleToggleFavorite = e => {
    e.stopPropagation();
    onToggleFavorite(contact.id);
  };
  return <motion.div initial={{
    opacity: 0,
    y: 20
  }} animate={{
    opacity: 1,
    y: 0
  }} exit={{
    opacity: 0,
    scale: 0.95
  }} transition={{
    duration: 0.2
  }} onClick={handleCardClick} className="bg-white rounded-xl flex flex-col items-center text-center cursor-pointer" style={{
    position: 'relative',
    border: '1px solid rgba(199,196,215,0.3)',
    padding: '1.5rem',
    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.05), 0 2px 4px -2px rgb(0 0 0 / 0.05)',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease'
  }} onMouseEnter={e => {
    e.currentTarget.style.transform = 'translateY(-4px)';
    e.currentTarget.style.boxShadow = '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)';
  }} onMouseLeave={e => {
    e.currentTarget.style.transform = '';
    e.currentTarget.style.boxShadow = '0 4px 6px -1px rgb(0 0 0 / 0.05), 0 2px 4px -2px rgb(0 0 0 / 0.05)';
  }}>
      
      <button onClick={handleToggleFavorite} style={{
      position: 'absolute',
      top: '12px',
      right: '12px',
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      color: contact.isFavorite ? '#facc15' : '#c7c4d7',
      transition: 'transform 0.2s, color 0.2s',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '4px',
      zIndex: 10
    }} onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.2)'} onMouseLeave={e => e.currentTarget.style.transform = ''}>
        <span className="material-symbols-outlined" style={{
        fontVariationSettings: `'FILL' ${contact.isFavorite ? 1 : 0}, 'wght' 400, 'GRAD' 0, 'opsz' 24`,
        fontSize: '24px'
      }}>
          star
        </span>
      </button>
      
      <div className="relative" style={{
      marginBottom: '1rem'
    }}>
        {!imageError && contact.avatar ? <img src={contact.avatar} alt={contact.fullName} onError={handleImageError} className="w-24 h-24 rounded-full object-cover" style={{
        border: '4px solid white',
        boxShadow: '0 2px 8px rgb(0 0 0 / 0.12)'
      }} /> : <div className="w-24 h-24 rounded-full flex items-center justify-center text-white" style={{
        backgroundColor: getAvatarColor(contact.fullName),
        border: '4px solid white',
        boxShadow: '0 2px 8px rgb(0 0 0 / 0.12)',
        fontSize: '24px',
        fontWeight: 600
      }}>
            {getInitials(contact.firstName, contact.lastName)}
          </div>}

        
        {contact.status && statusColors[contact.status] && <div className="absolute rounded-full" style={{
        bottom: '-2px',
        right: '-2px',
        width: '16px',
        height: '16px',
        background: statusColors[contact.status],
        border: '2px solid white'
      }} />}
      </div>

      
      <span className="rounded-full inline-block" style={{
      background: isWoman ? '#ffd9e4' : '#d3e4fe',
      color: isWoman ? '#8c0053' : '#464554',
      padding: '2px 12px',
      fontSize: '11px',
      lineHeight: '16px',
      letterSpacing: '0.05em',
      fontWeight: 600,
      marginBottom: '8px'
    }}>
        {displayGender}
      </span>

      
      <h3 className="text-headline-md" style={{
      color: '#0b1c30',
      marginBottom: '1rem'
    }}>
        {contact.fullName}
      </h3>

      
      <div className="w-full" style={{
      color: '#464554',
      marginBottom: '1.5rem'
    }}>
        {[{
        icon: 'mail',
        text: contact.email
      }, {
        icon: 'call',
        text: contact.phone
      }, {
        icon: 'location_on',
        text: `${contact.city}, ${contact.country}`
      }].map(({
        icon,
        text
      }) => <div key={icon} className="flex items-center justify-center gap-2" style={{
        marginBottom: '6px'
      }}>
            <span className="material-symbols-outlined" style={{
          color: '#4648d4',
          fontSize: '16px',
          verticalAlign: 'middle'
        }}>
              {icon}
            </span>
            <span className="text-body-base" style={{
          color: '#464554'
        }}>
              {text}
            </span>
          </div>)}
      </div>

      
      <div className="flex gap-2 w-full" style={{
      marginTop: 'auto'
    }}>
        <button id={`edit-contact-${contact.id}`} onClick={handleEdit} className="flex-1 rounded-lg" style={{
        padding: '8px',
        background: 'rgba(96,99,238,0.1)',
        color: '#4648d4',
        fontSize: '11px',
        letterSpacing: '0.05em',
        fontWeight: 600,
        border: 'none',
        cursor: 'pointer',
        transition: 'background 0.2s',
        fontFamily: 'inherit'
      }} onMouseEnter={e => e.currentTarget.style.background = 'rgba(96,99,238,0.2)'} onMouseLeave={e => e.currentTarget.style.background = 'rgba(96,99,238,0.1)'}>
          EDIT
        </button>
        <button id={`delete-contact-${contact.id}`} onClick={handleDelete} className="flex-1 rounded-lg" style={{
        padding: '8px',
        background: 'rgba(255,218,214,0.3)',
        color: '#ba1a1a',
        fontSize: '11px',
        letterSpacing: '0.05em',
        fontWeight: 600,
        border: 'none',
        cursor: 'pointer',
        transition: 'background 0.2s',
        fontFamily: 'inherit'
      }} onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,218,214,0.5)'} onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,218,214,0.3)'}>
          HAPUS
        </button>
      </div>
    </motion.div>;
};
export default ContactCard;