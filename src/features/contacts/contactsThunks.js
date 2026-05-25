import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
const transformContact = user => {
  return {
    id: user.login.uuid,
    firstName: user.name.first,
    lastName: user.name.last,
    fullName: `${user.name.first} ${user.name.last}`,
    email: user.email,
    phone: user.phone,
    cell: user.cell,
    avatar: user.picture.large,
    thumbnailAvatar: user.picture.thumbnail,
    gender: user.gender,
    city: user.location.city,
    country: user.location.country,
    nationality: user.nat,
    age: user.dob.age,
    createdAt: new Date().toISOString()
  };
};
export const fetchContacts = createAsyncThunk('contacts/fetchContacts', async (_, {
  rejectWithValue
}) => {
  try {
    const response = await axios.get('https://randomuser.me/api/?results=30');
    const contacts = response.data.results.map(transformContact);
    return contacts;
  } catch (error) {
    return rejectWithValue(error.message || 'Failed to fetch contacts');
  }
});