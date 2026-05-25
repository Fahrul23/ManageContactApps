import { createSelector } from '@reduxjs/toolkit';
export const selectAllContacts = state => state.contacts.items;
export const selectContactsStatus = state => state.contacts.status;
export const selectContactsError = state => state.contacts.error;
export const selectSelectedContact = state => state.contacts.selectedContact;
export const selectSearchQuery = state => state.contacts.searchQuery;
export const selectFilterGender = state => state.contacts.filterGender;
export const selectSortBy = state => state.contacts.sortBy;
export const selectFilteredContacts = createSelector([selectAllContacts, selectSearchQuery, selectFilterGender, selectSortBy], (contacts, searchQuery, filterGender, sortBy) => {
  let filtered = [...contacts];
  if (searchQuery.trim()) {
    const query = searchQuery.toLowerCase();
    filtered = filtered.filter(contact => contact.fullName.toLowerCase().includes(query) || contact.email.toLowerCase().includes(query));
  }
  if (filterGender !== 'all') {
    filtered = filtered.filter(contact => contact.gender === filterGender);
  }
  filtered.sort((a, b) => {
    switch (sortBy) {
      case 'name-asc':
        return a.fullName.localeCompare(b.fullName);
      case 'name-desc':
        return b.fullName.localeCompare(a.fullName);
      case 'newest':
        return new Date(b.createdAt) - new Date(a.createdAt);
      default:
        return 0;
    }
  });
  return filtered;
});