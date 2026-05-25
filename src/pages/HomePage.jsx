import ContactList from '@/components/ContactList/ContactList';
import ContactForm from '@/components/ContactForm/ContactForm';
import { useState } from 'react';
const HomePage = ({
  onAddContact
}) => {
  const [showContactForm, setShowContactForm] = useState(false);
  const [contactToEdit, setContactToEdit] = useState(null);
  const handleEditRequest = contact => {
    setContactToEdit(contact);
    setShowContactForm(true);
  };
  const handleCloseForm = () => {
    setShowContactForm(false);
    setContactToEdit(null);
  };
  return <>
      <ContactList onEditRequest={handleEditRequest} />
      <ContactForm isOpen={showContactForm} onClose={handleCloseForm} contactToEdit={contactToEdit} />
    </>;
};
export default HomePage;