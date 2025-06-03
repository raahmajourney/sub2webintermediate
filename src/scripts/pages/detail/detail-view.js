import DetailPresenter from './detail-presenter';

class DetailView {
  async render() {
    return `
      <div id="storyDetail" class="container">
        <p>Memuat detail story...</p>
      </div>
    `;
  }

  async afterRender() {
    const url = window.location.hash.split('/');
    const id = url[url.length - 1];
    const token = localStorage.getItem('authToken');

    await DetailPresenter.showDetail(id, token);
  }
}

export default DetailView;
