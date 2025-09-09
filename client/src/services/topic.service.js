import axios from '@/axios';

export const TopicService = {
  async getAll(params) {
    const query = new URLSearchParams(params);
    const { data } = await axios.get('/topics?' + query);
    return data;
  },
};
