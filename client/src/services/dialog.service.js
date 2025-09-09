import axios from '@/axios';

export const DialogService = {
  async getBySlug({ slug, type }) {
    const { data } = await axios.get(`/dialogs:authorized/${slug}/${type}`);
    return data;
  },
};
