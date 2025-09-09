import axios from '@/axios';

export const AdminDialogService = {
  async add(values) {
    const res = await axios.post('/admin/dialogs/:authorized', { ...values });
    return res;
  },

  async getAll(params) {
    const query = new URLSearchParams(params);
    const { data } = await axios.get('/admin/dialogs:authorized?' + query);
    return data;
  },

  async deleteById(id) {
    const res = await axios.delete('/admin/dialogs/:authorized' + id);
    return res;
  },

  async getById(id) {
    const { data } = await axios.get('/admin/dialogs/:authorized' + id);
    return data;
  },

  async updateById({ id, values }) {
    const res = await axios.patch('/admin/dialogs/:authorized' + id, { ...values });
    return res;
  },
};
