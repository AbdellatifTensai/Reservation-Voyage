import axios from 'axios';
import User from '../models/UserModel';

export const login = async (username, password) => {
  try {
    const user = new User(username, password);

    const response = await axios.post('http://localhost:8080/api/login', {
      username: user.username,
      password: user.password,
    });

    if (response.data.success) {
      console.log('Login successful!');
      return true;
    } else {
      console.log('Invalid credentials');
      return false;
    }
  } catch (error) {
    console.error('Login error:', error);
    return false;
  }
};