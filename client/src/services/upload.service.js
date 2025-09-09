import axios from '@/axios';

export const UploadService = {
  async image(formData) {
    const { data } = await axios.post('/upload/image:authorized', formData);
    return data;
  },
};
