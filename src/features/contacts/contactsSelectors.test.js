import { selectFilteredContacts } from './contactsSelectors';
import { mockContact, mockContact2 } from '@/test/mockData';
describe('contactsSelectors', () => {
  const mockContact3 = {
    ...mockContact,
    id: 'test-uuid-003',
    firstName: 'Alice',
    lastName: 'Johnson',
    fullName: 'Alice Johnson',
    email: 'alice.johnson@example.com',
    gender: 'female',
    createdAt: '2024-01-03T00:00:00.000Z'
  };
  const mockState = {
    contacts: {
      items: [mockContact, mockContact2, mockContact3],
      status: 'succeeded',
      error: null,
      selectedContact: null,
      searchQuery: '',
      filterGender: 'all',
      sortBy: 'name-asc'
    }
  };
  test('should return all contacts when no filter', () => {
    const result = selectFilteredContacts(mockState);
    expect(result).toHaveLength(3);
  });
  test('should filter by search query (name)', () => {
    const state = {
      ...mockState,
      contacts: {
        ...mockState.contacts,
        searchQuery: 'john'
      }
    };
    const result = selectFilteredContacts(state);
    expect(result).toHaveLength(2);
    expect(result.some(c => c.fullName.toLowerCase().includes('john'))).toBe(true);
  });
  test('should filter by gender', () => {
    const state = {
      ...mockState,
      contacts: {
        ...mockState.contacts,
        filterGender: 'female'
      }
    };
    const result = selectFilteredContacts(state);
    expect(result).toHaveLength(2);
    expect(result.every(c => c.gender === 'female')).toBe(true);
  });
  test('should sort by name A-Z', () => {
    const state = {
      ...mockState,
      contacts: {
        ...mockState.contacts,
        sortBy: 'name-asc'
      }
    };
    const result = selectFilteredContacts(state);
    expect(result[0].fullName).toBe('Alice Johnson');
    expect(result[1].fullName).toBe('Jane Smith');
    expect(result[2].fullName).toBe('John Doe');
  });
});