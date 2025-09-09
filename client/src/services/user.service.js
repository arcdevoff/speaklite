import axios from '@/axios';

export const UserService = {
  async getProfile() {
    const res = await axios.get('/users/profile:authorized');
    return res;
  },

  async confirm(token) {
    const res = await axios.post('/users/confirm', { token });
    return res;
  },

  async subscribe() {
    const { data } = await axios.post('/users/subscribe:authorized');
    return data;
  },
};
