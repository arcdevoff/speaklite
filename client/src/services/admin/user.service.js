import axios from '@/axios';

export const AdminUserService = {
  async getAll(params) {
    params.limit = 12;
    const query = new URLSearchParams(params);
    const { data } = await axios.get('/admin/users:authorized?' + query);

    return data;
  },

  async deleteById(id) {
    const res = await axios.delete('/admin/users/:authorized' + id);
    return res;
  },

  async getById(id) {
    const { data } = await axios.get('/admin/users/:authorized' + id);
    return data;
  },

  async updateById({ id, values }) {
    const res = await axios.patch('/admin/users/:authorized' + id, { ...values });
    return res;
  },
};
