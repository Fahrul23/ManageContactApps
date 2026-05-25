import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import { updateContact } from '@/features/contacts/contactsSlice';
import { getInitials, getAvatarColor } from '@/utils/formatContact';
function Icon({
  name,
  className = '',
  style = {}
}) {
  return <span className={`material-symbols-outlined ${className}`} style={{
    verticalAlign: 'middle',
    ...style
  }}>
      {name}
    </span>;
}
const ContactDetail = ({
  contact,
  onEdit,
  onClose,
  onDelete
}) => {
  const [isOpen, setIsOpen] = useState(true);
  const [imageError, setImageError] = useState(false);
  const handleClose = () => {
    setIsOpen(false);
    setTimeout(onClose, 200);
  };
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);
  if (!contact) return null;
  const handleEdit = () => {
    onEdit(contact);
    handleClose();
  };
  const handleDelete = () => {
    onDelete(contact);
    handleClose();
  };
  const handleImageError = () => {
    setImageError(true);
  };
  const avatarColor = getAvatarColor(contact.fullName);
  const statusColorClass = contact.status === 'online' ? 'bg-green-500' : contact.status === 'away' ? 'bg-yellow-500' : 'bg-slate-400';
  const displayJobTitle = contact.jobTitle || 'Tech Partner';
  const displayCompany = contact.company || 'Nexus Global Tech';
  const displayDepartment = contact.gender === 'female' ? 'Marketing & UX' : 'Tech Infrastructure';
  const displayBirthday = contact.age ? `${contact.age} tahun` : 'N/A';
  const displayConnectedVia = contact.nationality ? `LinkedIn (${contact.nationality})` : 'LinkedIn Professional';
  return <>
      
      <motion.div initial={{
      opacity: 0
    }} animate={{
      opacity: isOpen ? 1 : 0
    }} transition={{
      duration: 0.2
    }} className="fixed inset-0 z-50 bg-black/20 backdrop-blur-sm flex items-center justify-center p-8" onClick={handleClose}>
        
        <motion.div initial={{
        opacity: 0,
        scale: 0.95,
        y: 15
      }} animate={{
        opacity: isOpen ? 1 : 0,
        scale: isOpen ? 1 : 0.95,
        y: isOpen ? 0 : 15
      }} transition={{
        duration: 0.2
      }} className="bg-white w-full max-w-5xl h-[700px] rounded-[24px] shadow-2xl flex overflow-hidden relative border border-outline-variant/30 text-on-surface" onClick={e => e.stopPropagation()}>
          
          <button onClick={handleClose} className="absolute top-6 right-6 p-2 rounded-full hover:bg-surface-variant/40 transition-colors z-10 bg-transparent border-none cursor-pointer">
            <Icon name="close" className="text-on-surface-variant" />
          </button>

          
          <aside className="w-1/3 bg-surface-bright p-6 flex flex-col items-center border-r border-outline-variant/60">
            
            <div className="mt-8 relative">
              <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg bg-surface-container flex items-center justify-center">
                {!imageError && contact.avatar ? <img src={contact.avatar} alt={contact.fullName} onError={handleImageError} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-white text-3xl font-semibold" style={{
                backgroundColor: avatarColor
              }}>
                    {getInitials(contact.firstName, contact.lastName)}
                  </div>}
              </div>
              
              <div className={`absolute bottom-1 right-1 w-6 h-6 border-2 border-white rounded-full ${statusColorClass}`} />
            </div>

            
            <div className="mt-6 text-center">
              <h3 className="text-display-lg text-on-surface m-0 leading-tight">
                {contact.fullName}
              </h3>
              <p className="text-body-base text-primary font-bold mt-1 mb-0">
                {displayJobTitle}
              </p>
              <div className="mt-4 inline-flex items-center px-3 py-1 bg-primary/10 text-primary rounded-full text-[12px] font-bold uppercase tracking-wider">
                Premium Connection
              </div>
            </div>

            
            <div className="w-full mt-10 space-y-6">
              
              <div className="flex items-center gap-4 text-on-surface-variant group cursor-pointer hover:text-primary transition-colors">
                <div className="w-10 h-10 rounded-xl bg-surface-container flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                  <Icon name="mail" />
                </div>
                <div>
                  <p className="text-label-caps text-outline uppercase m-0">Email Address</p>
                  <p className="text-body-base m-0 font-medium truncate max-w-[200px]">
                    {contact.email}
                  </p>
                </div>
              </div>

              
              <div className="flex items-center gap-4 text-on-surface-variant group cursor-pointer hover:text-primary transition-colors">
                <div className="w-10 h-10 rounded-xl bg-surface-container flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                  <Icon name="call" />
                </div>
                <div>
                  <p className="text-label-caps text-outline uppercase m-0">Mobile Phone</p>
                  <p className="text-body-base m-0 font-medium">{contact.phone}</p>
                </div>
              </div>

              
              <div className="flex items-center gap-4 text-on-surface-variant">
                <div className="w-10 h-10 rounded-xl bg-surface-container flex items-center justify-center">
                  <Icon name="location_on" />
                </div>
                <div>
                  <p className="text-label-caps text-outline uppercase m-0">Location</p>
                  <p className="text-body-base m-0 font-medium">
                    {contact.city && contact.country ? `${contact.city}, ${contact.country}` : 'Jakarta, Indonesia'}
                  </p>
                </div>
              </div>
            </div>

            
            <div className="mt-auto w-full pt-8 flex gap-3">
              <button id="modal-edit-contact-btn" onClick={handleEdit} className="flex-1 flex items-center justify-center gap-2 bg-primary text-on-primary py-3 rounded-xl font-bold hover:bg-primary-container transition-all shadow-md active:scale-[0.98] border-none cursor-pointer">
                <Icon name="edit" style={{
                fontSize: '20px'
              }} />
                <span className="font-body-base">Edit Contact</span>
              </button>
              <button id="modal-delete-contact-btn" onClick={handleDelete} className="w-12 h-12 flex items-center justify-center text-error bg-error-container/30 rounded-xl hover:bg-error-container/50 transition-colors border-none cursor-pointer">
                <Icon name="delete" />
              </button>
            </div>
          </aside>

          
          <main className="flex-grow flex flex-col bg-white overflow-hidden">
            
            <div className="flex border-b border-outline-variant/60 px-6 h-16 shrink-0 bg-white items-center gap-2 text-primary font-bold">
              <Icon name="info" style={{
              fontSize: '20px'
            }} />
              <span className="text-label-caps uppercase">Information</span>
            </div>

            
            <div className="flex-grow overflow-y-auto p-6 scrollbar-hide">
              <div className="space-y-8 animate-in fade-in duration-300">
                <div className="grid grid-cols-2 gap-6">
                  <div className="p-4 bg-surface-container-low rounded-xl border border-outline-variant/40">
                    <p className="text-label-caps text-outline uppercase mb-2 mt-0">Company</p>
                    <p className="text-headline-md m-0">{displayCompany}</p>
                  </div>
                  <div className="p-4 bg-surface-container-low rounded-xl border border-outline-variant/40">
                    <p className="text-label-caps text-outline uppercase mb-2 mt-0">Department</p>
                    <p className="text-headline-md m-0">{displayDepartment}</p>
                  </div>
                  <div className="p-4 bg-surface-container-low rounded-xl border border-outline-variant/40">
                    <p className="text-label-caps text-outline uppercase mb-2 mt-0">Age / Birthday</p>
                    <p className="text-headline-md m-0">{displayBirthday}</p>
                  </div>
                  <div className="p-4 bg-surface-container-low rounded-xl border border-outline-variant/40">
                    <p className="text-label-caps text-outline uppercase mb-2 mt-0">Connected via</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Icon name="verified" className="text-primary" style={{
                      fontSize: '20px'
                    }} />
                      <p className="text-headline-md m-0">{displayConnectedVia}</p>
                    </div>
                  </div>
                </div>
                
                
                <div className="space-y-3">
                  <h4 className="text-headline-md m-0 font-bold">Professional Summary</h4>
                  <p className="text-on-surface-variant leading-relaxed m-0 text-body-base">
                    {contact.notes || `${contact.fullName} adalah profesional berbakat di bidangnya, yang saat ini mengemban peran sebagai ${displayJobTitle} di perusahaan ${displayCompany}. Merupakan rekan kerja yang memiliki rekam jejak kerja sama yang luar biasa dalam ekosistem kerja Nexus.`}
                  </p>
                </div>

                
                <div className="space-y-3">
                  <h4 className="text-headline-md m-0 font-bold">Tags &amp; Categories</h4>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-4 py-1.5 bg-secondary/10 text-secondary font-bold rounded-full text-body-sm capitalize">
                      {contact.gender === 'female' ? 'Wanita' : 'Pria'}
                    </span>
                    <span className="px-4 py-1.5 bg-primary/10 text-primary font-bold rounded-full text-body-sm capitalize">
                      {contact.status || 'Active'}
                    </span>
                    <span className="px-4 py-1.5 bg-tertiary-fixed text-on-tertiary-fixed font-bold rounded-full text-body-sm">
                      {contact.nationality || 'Global Connection'}
                    </span>
                    <span className="px-4 py-1.5 bg-surface-container-highest text-on-surface font-bold rounded-full text-body-sm">
                      Age {contact.age || 'N/A'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </motion.div>
      </motion.div>
    </>;
};
export default ContactDetail;