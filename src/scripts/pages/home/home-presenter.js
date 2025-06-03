import { getAllStories } from '../../data/story-model';

const HomePresenter = {
  async getStories(token) {
    await new Promise((resolve) => setTimeout(resolve, 400));
    try {
      const data = await getAllStories(token);
      return {
        status: 'success',
        stories: data?.listStory ?? [],
      };
    } catch (error) {
      return {
        status: 'error',
        message: error.message,
      };
    }
  },

  async getLottieAnimation() {
    try {
      const response = await fetch('json/story.json');
      const data = await response.json();
      return { status: 'success', animationData: data };
    } catch (error) {
      return { status: 'error', message: error.message };
    }
  },
};

export default HomePresenter;
