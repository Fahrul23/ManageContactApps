import { screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ContactForm from './ContactForm';
import { renderWithProviders } from '@/test/testUtils';
import { mockContact } from '@/test/mockData';
describe('ContactForm', () => {
  const mockOnClose = jest.fn();
  beforeEach(() => {
    jest.clearAllMocks();
  });
  test('should render "Add New Contact" title in create mode', () => {
    renderWithProviders(<ContactForm isOpen={true} onClose={mockOnClose} contactToEdit={null} />);
    expect(screen.getByText('Add New Contact')).toBeInTheDocument();
  });
  test('should render "Edit Contact" title in edit mode', () => {
    renderWithProviders(<ContactForm isOpen={true} onClose={mockOnClose} contactToEdit={mockContact} />);
    expect(screen.getByText('Edit Contact')).toBeInTheDocument();
  });
  test('should prefill form fields in edit mode', () => {
    renderWithProviders(<ContactForm isOpen={true} onClose={mockOnClose} contactToEdit={mockContact} />);
    const firstNameInput = screen.getByLabelText(/first name/i);
    const emailInput = screen.getByLabelText(/email/i);
    expect(firstNameInput).toHaveValue('John');
    expect(emailInput).toHaveValue('john.doe@example.com');
  });
  test('should show validation error for empty firstName on submit', async () => {
    const user = userEvent.setup();
    renderWithProviders(<ContactForm isOpen={true} onClose={mockOnClose} contactToEdit={null} />);
    const submitButton = screen.getByRole('button', {
      name: /add contact/i
    });
    await user.click(submitButton);
    await waitFor(() => {
      expect(screen.getAllByText(/min 2 characters/i).length).toBeGreaterThan(0);
    });
  });
  test('should show validation error for invalid email', async () => {
    const user = userEvent.setup();
    renderWithProviders(<ContactForm isOpen={true} onClose={mockOnClose} contactToEdit={null} />);
    const firstNameInput = screen.getByLabelText(/first name/i);
    const lastNameInput = screen.getByLabelText(/last name/i);
    const emailInput = screen.getByLabelText(/email/i);
    const phoneInput = screen.getByLabelText(/phone/i);
    fireEvent.change(firstNameInput, {
      target: {
        value: 'John'
      }
    });
    fireEvent.change(lastNameInput, {
      target: {
        value: 'Doe'
      }
    });
    fireEvent.change(emailInput, {
      target: {
        value: 'notanemail'
      }
    });
    fireEvent.change(phoneInput, {
      target: {
        value: '1234567890'
      }
    });
    const form = emailInput.closest('form');
    fireEvent.submit(form);
    await waitFor(() => {
      expect(screen.getByText(/invalid email/i)).toBeInTheDocument();
    });
  });
  test('should call onClose when Cancel button clicked', async () => {
    const user = userEvent.setup();
    renderWithProviders(<ContactForm isOpen={true} onClose={mockOnClose} contactToEdit={null} />);
    const cancelButton = screen.getByRole('button', {
      name: /cancel/i
    });
    await user.click(cancelButton);
    expect(mockOnClose).toHaveBeenCalled();
  });
});