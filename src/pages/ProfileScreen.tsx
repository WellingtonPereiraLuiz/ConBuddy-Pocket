import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Camera, Mail, Calendar, LogOut, CheckCircle, X, Sun, Moon } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { userInterests } from '../services/mockData';
import { Button } from '../components/ui/Button';
import { useTheme } from '../contexts/ThemeContext';

const ProfileScreen = () => {
  const { isDarkMode, toggleTheme } = useTheme();
  const { user, logout, updateUserProfile } = useAuth();

  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user?.displayName || '');
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [notification, setNotification] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  // Carregar interesses salvos do localStorage na inicialização
  useEffect(() => {
    const savedInterests = localStorage.getItem('conbuddy_user_interests');
    if (savedInterests) {
      try {
        const parsedInterests = JSON.parse(savedInterests);
        setSelectedInterests(parsedInterests);
      } catch (error) {
        console.error('Erro ao carregar interesses salvos:', error);
        // Se houver erro, usar interesses padrão
        setSelectedInterests(['1', '3', '4']);
      }
    } else {
      // Interesses padrão se não houver salvos
      setSelectedInterests(['1', '3', '4']);
    }
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  const handleSaveProfile = async () => {
    try {
      if (!name.trim()) {
        throw new Error('O nome não pode estar vazio.');
      }

      if (!user) {
        throw new Error('Usuário não autenticado');
      }

      setNotification(null);

      await updateUserProfile({
        displayName: name.trim(),
      });

      setEditing(false);
      setNotification({
        type: 'success',
        message: 'Perfil atualizado com sucesso!'
      });

      // Auto-hide notification after 3 seconds
      setTimeout(() => setNotification(null), 3000);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao atualizar perfil. Tente novamente.';
      setNotification({
        type: 'error',
        message: errorMessage
      });

      // Auto-hide notification after 5 seconds
      setTimeout(() => setNotification(null), 5000);
    }
  };

  const toggleInterest = (id: string) => {
    if (selectedInterests.includes(id)) {
      setSelectedInterests(selectedInterests.filter(i => i !== id));
    } else {
      setSelectedInterests([...selectedInterests, id]);
    }
  };

  // Função para salvar interesses - CORRIGIDA conforme solicitado
  const handleSaveInterests = () => {
    try {
      // Salvar no localStorage
      localStorage.setItem('conbuddy_user_interests', JSON.stringify(selectedInterests));
      
      setNotification({
        type: 'success',
        message: 'Interesses salvos com sucesso! Suas recomendações serão personalizadas.'
      });

      // Auto-hide notification after 3 seconds
      setTimeout(() => setNotification(null), 3000);
    } catch (error) {
      console.error('Erro ao salvar interesses:', error);
      setNotification({
        type: 'error',
        message: 'Erro ao salvar interesses. Tente novamente.'
      });

      // Auto-hide notification after 5 seconds
      setTimeout(() => setNotification(null), 5000);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-6"
    >
      {/* Notificações */}
      {notification && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className={`p-4 rounded-lg flex items-start mb-6 ${
            notification.type === 'success' ? 'bg-success/10 text-success' : 'bg-error/10 text-error'
          }`}
        >
          {notification.type === 'success' ? (
            <CheckCircle className="w-5 h-5 mr-2 flex-shrink-0" />
          ) : (
            <X className="w-5 h-5 mr-2 flex-shrink-0" />
          )}
          <p>{notification.message}</p>
        </motion.div>
      )}

      {/* Profile Card */}
      <div className="card">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
              {user?.photoURL ? (
                <img src={user.photoURL} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <User className="w-12 h-12 text-gray-500" />
              )}
            </div>
            <button className="absolute bottom-0 right-0 bg-primary text-white p-2 rounded-full hover:bg-primary-dark transition-colors">
              <Camera className="w-4 h-4" />
            </button>
          </div>

          <div className="flex-1 text-center md:text-left">
            {editing ? (
              <div className="mb-4">
                <label htmlFor="name" className="block text-sm font-medium mb-1">
                  Nome
                </label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="input"
                />
              </div>
            ) : (
              <h2 className="text-2xl font-bold mb-1">{user?.displayName || 'Usuário'}</h2>
            )}

            <div className="flex flex-col md:flex-row md:items-center gap-2 text-text-secondary mb-4">
              <div className="flex items-center">
                <Mail className="w-4 h-4 mr-1" />
                <span>{user?.email}</span>
              </div>
              <div className="hidden md:block">•</div>
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-1" />
                <span>Membro desde 2023</span>
              </div>
            </div>

            {editing ? (
              <div className="flex gap-2">
                <Button onClick={handleSaveProfile}>
                  Salvar
                </Button>
                <Button variant="outline" onClick={() => setEditing(false)}>
                  Cancelar
                </Button>
              </div>
            ) : (
              <Button variant="outline" onClick={() => setEditing(true)}>
                Editar perfil
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Interests - CORRIGIDO conforme solicitado */}
      <div className="card">
        <h3 className="text-xl font-bold mb-4">Meus interesses</h3>
        <p className="text-text-secondary mb-4">
          Selecione seus interesses para recebermos recomendações personalizadas de eventos.
        </p>

        <div className="flex flex-wrap gap-2 mb-4">
          {userInterests.map((interest) => (
            <button
              key={interest.id}
              onClick={() => toggleInterest(interest.id)}
              className={`px-4 py-2 rounded-full transition-colors ${
                selectedInterests.includes(interest.id)
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-text-secondary hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              {interest.name}
            </button>
          ))}
        </div>

        {/* Mostrar interesses selecionados */}
        {selectedInterests.length > 0 && (
          <div className="mb-4 p-3 bg-primary/10 rounded-lg">
            <p className="text-sm text-primary font-medium mb-2">
              Interesses selecionados ({selectedInterests.length}):
            </p>
            <div className="flex flex-wrap gap-1">
              {selectedInterests.map((interestId) => {
                const interest = userInterests.find(i => i.id === interestId);
                return interest ? (
                  <span key={interestId} className="text-xs px-2 py-1 bg-primary/20 text-primary rounded-full">
                    {interest.name}
                  </span>
                ) : null;
              })}
            </div>
          </div>
        )}

        <Button 
          variant="outline" 
          fullWidth 
          onClick={handleSaveInterests}
          disabled={selectedInterests.length === 0}
        >
          Salvar interesses
        </Button>
      </div>

      {/* Account Settings */}
      <div className="card">
        <h3 className="text-xl font-bold mb-4">Configurações da conta</h3>

        <div className="space-y-4">
          <div className="flex justify-between items-center py-2">
            <div>
              <h4 className="font-medium">Notificações por email</h4>
              <p className="text-sm text-text-secondary">Receba atualizações sobre eventos</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>

          <div className="flex justify-between items-center py-2">
            <div>
              <h4 className="font-medium">Notificações push</h4>
              <p className="text-sm text-text-secondary">Alertas em tempo real no seu dispositivo</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>

          {/* Toggle de tema */}
          <div className="flex justify-between items-center py-2">
            <div>
              <h4 className="font-medium flex items-center">
                {isDarkMode ? <Moon className="w-4 h-4 mr-2" /> : <Sun className="w-4 h-4 mr-2" />}
                Tema escuro
              </h4>
              <p className="text-sm text-text-secondary">Mudar aparência do aplicativo</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={isDarkMode}
                onChange={toggleTheme}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>

          <div className="pt-4 border-t border-border">
            <Button
              variant="outline"
              className="text-error border-error hover:bg-error/10"
              onClick={handleLogout}
            >
              <LogOut className="w-5 h-5 mr-2" />
              Sair da conta
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProfileScreen;