import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedContact, setSearchQuery, setFilterGender, setSortBy, addContact, updateContact, deleteContact, toggleFavorite } from '@/features/contacts/contactsSlice';
import { fetchContacts } from '@/features/contacts/contactsThunks';
import { selectFilteredContacts, selectContactsStatus, selectContactsError, selectSelectedContact, selectSearchQuery, selectFilterGender, selectSortBy } from '@/features/contacts/contactsSelectors';
const useContacts = () => {
  const dispatch = useDispatch();
  const contacts = useSelector(selectFilteredContacts);
  const status = useSelector(selectContactsStatus);
  const error = useSelector(selectContactsError);
  const selectedContact = useSelector(selectSelectedContact);
  const searchQuery = useSelector(selectSearchQuery);
  const filterGender = useSelector(selectFilterGender);
  const sortBy = useSelector(selectSortBy);
  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchContacts());
    }
  }, [status, dispatch]);
  const handleSearch = query => {
    dispatch(setSearchQuery(query));
  };
  const handleFilter = gender => {
    dispatch(setFilterGender(gender));
  };
  const handleSort = sortOption => {
    dispatch(setSortBy(sortOption));
  };
  const handleSelect = contact => {
    dispatch(setSelectedContact(contact));
  };
  const handleAdd = contact => {
    dispatch(addContact(contact));
  };
  const handleUpdate = contact => {
    dispatch(updateContact(contact));
  };
  const handleDelete = contactId => {
    dispatch(deleteContact(contactId));
  };
  const handleToggleFavorite = contactId => {
    dispatch(toggleFavorite(contactId));
  };
  const refetch = () => {
    dispatch(fetchContacts());
  };
  return {
    contacts,
    status,
    error,
    selectedContact,
    searchQuery,
    filterGender,
    sortBy,
    handleSearch,
    handleFilter,
    handleSort,
    handleSelect,
    handleAdd,
    handleUpdate,
    handleDelete,
    handleToggleFavorite,
    refetch
  };
};
export default useContacts;