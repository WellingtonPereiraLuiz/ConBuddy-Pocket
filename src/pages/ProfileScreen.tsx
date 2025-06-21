import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Camera, Mail, Calendar, LogOut, CheckCircle, X, Sun, Moon } from 'lucide-react'; // Certifique-se de que Sun e Moon estão aqui
import { useAuth } from '../contexts/AuthContext';
import { userInterests } from '../services/mockData';
import { Button } from '../components/ui/Button';

import { useTheme } from '../contexts/ThemeContext';
import { useAgenda } from '../hooks/useAgenda'; // <<< MANTÉM este import

const ProfileScreen = () => {
  // === ESTADOS E HOOKS - TUDO AQUI EM CIMA UMA ÚNICA VEZ ===
  const { isDarkMode, toggleTheme } = useTheme(); // Para o toggle de tema
  const { user, logout, updateUserProfile } = useAuth();
  const { agendaEvents } = useAgenda(); // Para a agenda

  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user?.displayName || '');
  const [selectedInterests, setSelectedInterests] = useState<string[]>(['1', '3', '4']); // Initialize with default interests
  const [notification, setNotification] = useState<{ type: 'success' | 'error', message: string } | null>(null);
  const [activeTab, setActiveTab] = useState('profile'); // 'profile' | 'agenda' - Para as abas

  // === FUNÇÕES AUXILIARES ===
  const handleLogout = async () => {
    try {
      await logout();
      // Redireciona para o login (adicionado aqui, se não estiver em outro lugar já)
      // Se você usa navigate, importe useNavigate e chame navigate('/login');
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

      setNotification(null); // Limpa notificações anteriores

      await updateUserProfile({
        displayName: name.trim(),
        // Removed interests property since it's not defined in ProfileUpdateData type
      });

      setEditing(false);
      setNotification({
        type: 'success',
        message: 'Perfil atualizado com sucesso!'
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao atualizar perfil. Tente novamente.';
      setNotification({
        type: 'error',
        message: errorMessage
      });
    }
  };

  const toggleInterest = (id: string) => {
    if (selectedInterests.includes(id)) {
      setSelectedInterests(selectedInterests.filter(i => i !== id));
    } else {
      setSelectedInterests([...selectedInterests, id]);
    }
  };

  // === RENDERIZAÇÃO DO COMPONENTE ===
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-6" // Adicionado o className original do container
    >
      {/* Notificações (mantém onde estava) */}
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

      {/* Tabs para Perfil e Minha Agenda */}
      <div className="flex space-x-4 mb-6">
        <button
          onClick={() => setActiveTab('profile')}
          className={`px-4 py-2 rounded-lg ${activeTab === 'profile' ? 'bg-primary text-white' : 'text-text-secondary'}`}
        >
          Perfil
        </button>
        <button
          onClick={() => setActiveTab('agenda')}
          className={`px-4 py-2 rounded-lg ${activeTab === 'agenda' ? 'bg-primary text-white' : 'text-text-secondary'}`}
        >
          Minha Agenda
        </button>
      </div>

      {/* Conteúdo baseado na aba ativa */}
      {activeTab === 'profile' ? (
        // === CONTEÚDO ORIGINAL DO PERFIL ===
        <>
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
                <button className="absolute bottom-0 right-0 bg-primary text-white p-2 rounded-full">
                  <Camera className="w-4 h-4" />
                </button>
              </div>

              <div className="flex-1 text-center md:text-left">
                {editing ? (
                  <div className="mb-4">
                    <label htmlFor="name" className="block text-sm font-medium mb-1"> {/* Removi a barra invertida aqui */}
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

          {/* Interests */}
          <div className="card">
            <h3 className="text-xl font-bold mb-4">Meus interesses</h3>
            <p className="text-text-secondary mb-4">
              Selecione seus interesses para recebermos recomendações personalizadas.
            </p>

            <div className="flex flex-wrap gap-2 mb-4">
              {userInterests.map((interest) => (
                <button
                  key={interest.id}
                  onClick={() => toggleInterest(interest.id)}
                  className={`px-4 py-2 rounded-full transition-colors ${
                    selectedInterests.includes(interest.id)
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 dark:bg-gray-800 text-text-secondary'
                  }`}
                >
                  {interest.name}
                </button>
              ))}
            </div>

            <Button variant="outline" fullWidth>
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

              {/* === TOGGLE DE TEMA - AGORA AQUI DENTRO, E FUNCIONAL === */}
              <div className="flex justify-between items-center py-2">
                <div>
                  <h4 className="font-medium">Tema escuro</h4>
                  <p className="text-sm text-text-secondary">Mudar aparência do aplicativo</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  {/* Conectando o input ao estado e função do tema */}
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={isDarkMode} // Controlado pelo estado do tema
                    onChange={toggleTheme} // Chama a função para alternar o tema
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>
              {/* === FIM TOGGLE DE TEMA === */}

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
        </>
      ) : (
        // === CONTEÚDO DA AGENDA (seção "Minha Agenda") ===
        <div className="space-y-4">
          <h2 className="text-xl font-bold">Minha Agenda de Eventos</h2>
          {agendaEvents.length > 0 ? (
            // Se houver eventos na agenda, mapeie e exiba-os aqui.
            // Exemplo de como poderia ser um card de evento.
            agendaEvents.map(event => (
              <div key={event.id} className="card p-4 flex items-center gap-4">
                <Calendar className="w-6 h-6 text-primary flex-shrink-0" />
                <div>
                  <h3 className="font-bold">{event.title}</h3>
                  <p className="text-sm text-text-secondary">{event.location} - {new Date(event.startDate).toLocaleDateString()}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-text-secondary text-center py-8">
              Você ainda não adicionou eventos à sua agenda.
            </p>
          )}
        </div>
      )}
    </motion.div>
  );
};

export default ProfileScreen; // <<< APENAS UMA EXPORTAÇÃO NO FINAL DO ARQUIVO!