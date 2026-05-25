import { render } from '@testing-library/react';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import contactsReducer from '@/features/contacts/contactsSlice';
export function renderWithProviders(ui, {
  preloadedState = {},
  store = configureStore({
    reducer: {
      contacts: contactsReducer
    },
    preloadedState
  }),
  ...renderOptions
} = {}) {
  function Wrapper({
    children
  }) {
    return <Provider store={store}>{children}</Provider>;
  }
  return {
    store,
    ...render(ui, {
      wrapper: Wrapper,
      ...renderOptions
    })
  };
}