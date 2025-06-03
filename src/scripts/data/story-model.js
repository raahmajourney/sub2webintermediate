import { ACCESS_TOKEN_KEY } from '../config';
import { ENDPOINTS } from './api';

export async function getAllStories(token, page = 1, size = 12, location = 1) {
  const url = new URL(ENDPOINTS.STORY);

  url.searchParams.append('page', page);
  url.searchParams.append('size', size);
  url.searchParams.append('location', location);

  const response = await fetch(url.toString(), {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to fetch stories');
  }

  return await response.json();
}

export async function getDetailStory(id, token) {
  const url = `${ENDPOINTS.STORY}/${id}`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Failed to fetch story details:', error);
    return {
      error: true,
      message: error.message,
      story: null,
    };
  }
}

export const addStory = async (storyData) => {
  try {
    const token = localStorage.getItem(ACCESS_TOKEN_KEY);

    const formData = new FormData();
    formData.append('description', storyData.description);
    formData.append('photo', storyData.photo);

    if (storyData.lat) formData.append('lat', storyData.lat);
    if (storyData.lon) formData.append('lon', storyData.lon);

    const response = await fetch(ENDPOINTS.STORY, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const responseData = await response.json();

    if (!response.ok) {
      throw new Error(responseData.message || 'Failed to add story');
    }

    return responseData;
  } catch (error) {
    console.error('Error adding story:', error);
    throw error;
  }
};
