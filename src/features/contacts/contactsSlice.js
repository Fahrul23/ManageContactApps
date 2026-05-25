import { createSlice } from '@reduxjs/toolkit';
import { fetchContacts } from './contactsThunks';
const initialState = {
  items: [],
  status: 'idle',
  error: null,
  selectedContact: null,
  searchQuery: '',
  filterGender: 'all',
  sortBy: 'name-asc'
};
const contactsSlice = createSlice({
  name: 'contacts',
  initialState,
  reducers: {
    setSelectedContact: (state, action) => {
      state.selectedContact = action.payload;
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    setFilterGender: (state, action) => {
      state.filterGender = action.payload;
    },
    setSortBy: (state, action) => {
      state.sortBy = action.payload;
    },
    addContact: (state, action) => {
      state.items.unshift(action.payload);
    },
    updateContact: (state, action) => {
      const index = state.items.findIndex(contact => contact.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = {
          ...state.items[index],
          ...action.payload,
          fullName: `${action.payload.firstName} ${action.payload.lastName}`
        };
      }
    },
    deleteContact: (state, action) => {
      state.items = state.items.filter(contact => contact.id !== action.payload);
      if (state.selectedContact?.id === action.payload) {
        state.selectedContact = null;
      }
    },
    toggleFavorite: (state, action) => {
      const contact = state.items.find(c => c.id === action.payload);
      if (contact) {
        contact.isFavorite = !contact.isFavorite;
      }
    }
  },
  extraReducers: builder => {
    builder.addCase(fetchContacts.pending, state => {
      state.status = 'loading';
      state.error = null;
    }).addCase(fetchContacts.fulfilled, (state, action) => {
      state.status = 'succeeded';
      state.items = action.payload;
    }).addCase(fetchContacts.rejected, (state, action) => {
      state.status = 'failed';
      state.error = action.payload || action.error.message;
    });
  }
});
export const {
  setSelectedContact,
  setSearchQuery,
  setFilterGender,
  setSortBy,
  addContact,
  updateContact,
  deleteContact,
  toggleFavorite
} = contactsSlice.actions;
export default contactsSlice.reducer;