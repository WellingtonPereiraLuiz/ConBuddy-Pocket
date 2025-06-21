import { registerSW } from 'virtual:pwa-register';

export const registerServiceWorker = () => {
  if ('serviceWorker' in navigator) {
    try {
      const updateSW = registerSW({
        onNeedRefresh() {
          if (confirm('Nova versão disponível. Recarregar?')) {
            updateSW(true).catch(console.error);
          }
        },
        onOfflineReady() {
          console.log('App pronto para uso offline');
        },
        onRegistered(registration) {
          console.log('Service Worker registrado:', registration);
        },
        onRegisterError(error) {
          console.error('Erro ao registrar Service Worker:', error);
        }
      });
    } catch (error) {
      console.error('Erro ao inicializar Service Worker:', error);
    }
  }
};

export { registerSW };
