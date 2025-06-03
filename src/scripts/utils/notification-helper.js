export function showStoryNotification(storyDescription) {
  if ('Notification' in window && Notification.permission === 'granted') {
    navigator.serviceWorker.ready.then((registration) => {
      registration.showNotification('Story berhasil dibuat', {
        body: `Anda telah membuat story baru dengan deskripsi: ${storyDescription}`,
      });
    });
  }
}
