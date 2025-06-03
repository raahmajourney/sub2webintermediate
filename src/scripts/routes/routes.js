import HomePage from '../pages/home/home-page';
import RegisterView from '../pages/auth/register/register-view';
import LoginView from '../pages/auth/login/login-view';
import DetailView from '../pages/detail/detail-view';
import AddStoryView from '../pages/add-story/add-story-view';
import FavoriteView from '../pages/favorite/favorite-view';
import NotFoundView from '../pages/not-found/not-found-view';

const routes = {
  '/register': new RegisterView(),
  '/login': new LoginView(),

  '/': new HomePage(),
  '/stories/:id': new DetailView(),
  '/new': new AddStoryView(),
  '/favorite': new FavoriteView(),

  '*': new NotFoundView(),
};

export default routes;
