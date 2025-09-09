import axios from '@/axios';

export const AdminTopicService = {
  async add(formData) {
    const res = await axios.post('/admin/topics/:authorized', formData);
    return res;
  },

  async getAll(params) {
    const query = new URLSearchParams(params);
    const { data } = await axios.get('/admin/topics:authorized?' + query);
    return data;
  },

  async deleteById(id) {
    const res = await axios.delete('/admin/topics/:authorized' + id);
    return res;
  },

  async getById(id) {
    const { data } = await axios.get('/admin/topics/:authorized' + id);
    return data;
  },

  async updateById({ id, values }) {
    const res = await axios.patch('/admin/topics/:authorized' + id, { ...values });
    return res;
  },
};
