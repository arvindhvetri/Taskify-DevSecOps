import { API_PATHS } from './apiPaths';
import axiosInstance from './axiosInstance';

const uploadImage = async (imageFile) => {
  const formData = new FormData();
  formData.append('image', imageFile); // Key name must match backend expectations

  try {
    const response = await axiosInstance.post(API_PATHS.IMAGE.UPLOAD_IMAGE, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data; // Should include { imageUrl: '...' } or similar
  } catch (error) {
    console.error('Error uploading the image:', error);
    throw error; // Let the calling function handle the error
  }
};

export default uploadImage;
