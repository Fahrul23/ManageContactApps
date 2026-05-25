import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ContactCard from './ContactCard';
import { renderWithProviders } from '@/test/testUtils';
import { mockContact } from '@/test/mockData';
describe('ContactCard', () => {
  const mockOnEdit = jest.fn();
  const mockOnDelete = jest.fn();
  const mockOnSelect = jest.fn();
  beforeEach(() => {
    jest.clearAllMocks();
  });
  test('should render contact full name', () => {
    renderWithProviders(<ContactCard contact={mockContact} onEdit={mockOnEdit} onDelete={mockOnDelete} onSelect={mockOnSelect} />);
    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });
  test('should render contact email', () => {
    renderWithProviders(<ContactCard contact={mockContact} onEdit={mockOnEdit} onDelete={mockOnDelete} onSelect={mockOnSelect} />);
    expect(screen.getByText('john.doe@example.com')).toBeInTheDocument();
  });
  test('should render avatar image', () => {
    renderWithProviders(<ContactCard contact={mockContact} onEdit={mockOnEdit} onDelete={mockOnDelete} onSelect={mockOnSelect} />);
    const avatar = screen.getByRole('img', {
      name: 'John Doe'
    });
    expect(avatar).toBeInTheDocument();
    expect(avatar).toHaveAttribute('src', mockContact.avatar);
  });
  test('should call onEdit when edit button clicked', async () => {
    const user = userEvent.setup();
    renderWithProviders(<ContactCard contact={mockContact} onEdit={mockOnEdit} onDelete={mockOnDelete} onSelect={mockOnSelect} />);
    const editButton = screen.getByRole('button', {
      name: /edit/i
    });
    await user.click(editButton);
    expect(mockOnEdit).toHaveBeenCalledWith(mockContact);
    expect(mockOnEdit).toHaveBeenCalledTimes(1);
  });
  test('should call onDelete when delete button clicked', async () => {
    const user = userEvent.setup();
    renderWithProviders(<ContactCard contact={mockContact} onEdit={mockOnEdit} onDelete={mockOnDelete} onSelect={mockOnSelect} />);
    const deleteButton = screen.getByRole('button', {
      name: /hapus/i
    });
    await user.click(deleteButton);
    expect(mockOnDelete).toHaveBeenCalledWith(mockContact);
    expect(mockOnDelete).toHaveBeenCalledTimes(1);
  });
});