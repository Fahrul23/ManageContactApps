import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SearchBar from './SearchBar';
describe('SearchBar', () => {
  const mockOnChange = jest.fn();
  beforeEach(() => {
    jest.clearAllMocks();
  });
  test('should render search input with placeholder', () => {
    render(<SearchBar value="" onChange={mockOnChange} placeholder="Search contacts..." />);
    expect(screen.getByPlaceholderText('Search contacts...')).toBeInTheDocument();
  });
  test('should call onChange with typed value', async () => {
    const user = userEvent.setup();
    render(<SearchBar value="" onChange={mockOnChange} />);
    const input = screen.getByRole('textbox');
    await user.type(input, 'j');
    expect(mockOnChange).toHaveBeenCalled();
  });
  test('should show clear button when value is not empty', () => {
    render(<SearchBar value="john" onChange={mockOnChange} />);
    const clearButton = screen.getByRole('button', {
      name: /clear search/i
    });
    expect(clearButton).toBeInTheDocument();
  });
  test('should hide clear button when value is empty', () => {
    render(<SearchBar value="" onChange={mockOnChange} />);
    const clearButton = screen.queryByRole('button', {
      name: /clear search/i
    });
    expect(clearButton).not.toBeInTheDocument();
  });
});