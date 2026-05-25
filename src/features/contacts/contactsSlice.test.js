import reducer, { setSelectedContact, setSearchQuery, setFilterGender, setSortBy, addContact, updateContact, deleteContact, toggleFavorite } from './contactsSlice';
import { fetchContacts } from './contactsThunks';
import { mockContact, mockContact2 } from '@/test/mockData';
describe('contactsSlice - reducers', () => {
  const initialState = {
    items: [],
    status: 'idle',
    error: null,
    selectedContact: null,
    searchQuery: '',
    filterGender: 'all',
    sortBy: 'name-asc'
  };
  test('should return the initial state', () => {
    expect(reducer(undefined, {
      type: 'unknown'
    })).toEqual(initialState);
  });
  test('should handle addContact - prepend to items', () => {
    const state = reducer(initialState, addContact(mockContact));
    expect(state.items).toHaveLength(1);
    expect(state.items[0]).toEqual(mockContact);
    expect(state.items[0].id).toBe('test-uuid-001');
  });
  test('should handle updateContact - update existing contact', () => {
    const stateWithContact = {
      ...initialState,
      items: [mockContact]
    };
    const updatedData = {
      id: 'test-uuid-001',
      firstName: 'Johnny',
      lastName: 'Doe',
      email: 'johnny.doe@example.com'
    };
    const state = reducer(stateWithContact, updateContact(updatedData));
    expect(state.items).toHaveLength(1);
    expect(state.items[0].firstName).toBe('Johnny');
    expect(state.items[0].fullName).toBe('Johnny Doe');
    expect(state.items[0].email).toBe('johnny.doe@example.com');
  });
  test('should handle deleteContact - remove by id', () => {
    const stateWithContacts = {
      ...initialState,
      items: [mockContact, mockContact2]
    };
    const state = reducer(stateWithContacts, deleteContact('test-uuid-001'));
    expect(state.items).toHaveLength(1);
    expect(state.items[0].id).toBe('test-uuid-002');
  });
  test('should handle setSearchQuery', () => {
    const state = reducer(initialState, setSearchQuery('john'));
    expect(state.searchQuery).toBe('john');
  });
  test('should handle setFilterGender', () => {
    const state = reducer(initialState, setFilterGender('female'));
    expect(state.filterGender).toBe('female');
  });
  test('should handle setSortBy', () => {
    const state = reducer(initialState, setSortBy('name-desc'));
    expect(state.sortBy).toBe('name-desc');
  });
  test('should handle setSelectedContact', () => {
    const state = reducer(initialState, setSelectedContact(mockContact));
    expect(state.selectedContact).toEqual(mockContact);
  });
  test('should handle toggleFavorite - toggle isFavorite status', () => {
    const stateWithContact = {
      ...initialState,
      items: [{
        ...mockContact,
        isFavorite: false
      }]
    };
    const state = reducer(stateWithContact, toggleFavorite('test-uuid-001'));
    expect(state.items[0].isFavorite).toBe(true);
    const stateFavorited = reducer(state, toggleFavorite('test-uuid-001'));
    expect(stateFavorited.items[0].isFavorite).toBe(false);
  });
});
describe('contactsSlice - fetchContacts async thunk', () => {
  const initialState = {
    items: [],
    status: 'idle',
    error: null,
    selectedContact: null,
    searchQuery: '',
    filterGender: 'all',
    sortBy: 'name-asc'
  };
  test('fetchContacts.pending should set status to loading', () => {
    const action = {
      type: fetchContacts.pending.type
    };
    const state = reducer(initialState, action);
    expect(state.status).toBe('loading');
    expect(state.error).toBe(null);
  });
  test('fetchContacts.fulfilled should set contacts and status to succeeded', () => {
    const action = {
      type: fetchContacts.fulfilled.type,
      payload: [mockContact]
    };
    const state = reducer(initialState, action);
    expect(state.status).toBe('succeeded');
    expect(state.items).toHaveLength(1);
    expect(state.items[0]).toEqual(mockContact);
  });
  test('fetchContacts.rejected should set error and status to failed', () => {
    const action = {
      type: fetchContacts.rejected.type,
      payload: 'Network Error',
      error: {
        message: 'Network Error'
      }
    };
    const state = reducer(initialState, action);
    expect(state.status).toBe('failed');
    expect(state.error).toBe('Network Error');
  });
});