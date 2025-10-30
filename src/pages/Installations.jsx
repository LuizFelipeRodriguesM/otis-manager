import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, Plus, Check, X } from 'lucide-react';
import { installationsMockData } from '../mocks/installations.js';

const Installations = () => {
  const navigate = useNavigate();
  const [installations, setInstallations] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [countryFilter, setCountryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [elevatorTypeFilter, setElevatorTypeFilter] = useState('');

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    client: '',
    country: 'Brasil',
    city: '',
    status: 'Em andamento',
    deadline: '',
    cost: '',
    responsible: '',
    elevatorType: 'Pessoal',
    progress: 0,
    startDate: '',
    description: ''
  });

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedInstallations = localStorage.getItem('otis_installations');
    if (savedInstallations) {
      setInstallations(JSON.parse(savedInstallations));
    } else {
      setInstallations(installationsMockData);
      localStorage.setItem('otis_installations', JSON.stringify(installationsMockData));
    }
  }, []);

  // Save to localStorage whenever installations change
  useEffect(() => {
    if (installations.length > 0) {
      localStorage.setItem('otis_installations', JSON.stringify(installations));
    }
  }, [installations]);

  // Filtros únicos para os selects
  const uniqueCountries = [...new Set(installations.map(inst => inst.country))].sort();
  const uniqueStatuses = [...new Set(installations.map(inst => inst.status))].sort();
  const uniqueElevatorTypes = [...new Set(installations.map(inst => inst.elevatorType))].sort();

  // Dados filtrados
  const filteredInstallations = useMemo(() => {
    return installations.filter(installation => {
      const matchesSearch = searchTerm === '' ||
        installation.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
        installation.id.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCountry = countryFilter === '' || installation.country === countryFilter;
      const matchesStatus = statusFilter === '' || installation.status === statusFilter;
      const matchesElevatorType = elevatorTypeFilter === '' || installation.elevatorType === elevatorTypeFilter;

      return matchesSearch && matchesCountry && matchesStatus && matchesElevatorType;
    });
  }, [searchTerm, countryFilter, statusFilter, elevatorTypeFilter, installations]);

  const handleOpenModal = () => {
    setFormData({
      client: '',
      country: 'Brasil',
      city: '',
      status: 'Em andamento',
      deadline: '',
      cost: '',
      responsible: '',
      elevatorType: 'Pessoal',
      progress: 0,
      startDate: '',
      description: ''
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setFormData({
      client: '',
      country: 'Brasil',
      city: '',
      status: 'Em andamento',
      deadline: '',
      cost: '',
      responsible: '',
      elevatorType: 'Pessoal',
      progress: 0,
      startDate: '',
      description: ''
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Generate new ID
    const maxId = Math.max(...installations.map(inst => parseInt(inst.id.split('-')[1])));
    const newId = `INST-${String(maxId + 1).padStart(3, '0')}`;

    const newInstallation = {
      id: newId,
      ...formData,
      cost: parseFloat(formData.cost)
    };

    setInstallations([...installations, newInstallation]);
    handleCloseModal();
  };

  const handleViewDetails = (installationId) => {
    navigate(`/installations/${installationId}`);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setCountryFilter('');
    setStatusFilter('');
    setElevatorTypeFilter('');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Concluído':
        return { bg: '#dcfce7', text: '#166534' };
      case 'Em andamento':
        return { bg: '#dbeafe', text: '#1e40af' };
      case 'Atrasado':
        return { bg: '#fee2e2', text: '#dc2626' };
      default:
        return { bg: '#f3f4f6', text: '#374151' };
    }
  };

  return (
    <div className="page-content" style={{ minHeight: '100vh' }}>
      <div style={{ padding: '2rem' }}>
        <div style={{ marginBottom: '2rem' }}>
          <h1>Instalações - OTIS Manager</h1>
        </div>

        <div style={{ marginTop: '80px', marginBottom: '2rem', display: 'flex', justifyContent: 'flex-start' }}>
          <button
            onClick={handleOpenModal}
            className="btn btn-primary"
            style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}
          >
            <Plus size={20} />
            Nova Instalação
          </button>
        </div>

        {/* Filtros e Busca */}
        <div style={{ marginBottom: '2rem' }}>
          <div className="filters-grid">
            {/* Campo de Busca */}
            <div className="filter-item">
              <label>
                Buscar por Cliente ou ID
              </label>
              <input
                className="input"
                type="text"
                placeholder="Digite o nome do cliente ou ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Filtro por País */}
            <div className="filter-item">
              <label>
                País
              </label>
              <select
                className="input"
                value={countryFilter}
                onChange={(e) => setCountryFilter(e.target.value)}
              >
                <option value="">Todos os países</option>
                {uniqueCountries.map(country => (
                  <option key={country} value={country}>{country}</option>
                ))}
              </select>
            </div>

            {/* Filtro por Status */}
            <div className="filter-item">
              <label>
                Status
              </label>
              <select
                className="input"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="">Todos os status</option>
                {uniqueStatuses.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>

            {/* Filtro por Tipo de Elevador */}
            <div className="filter-item">
              <label>
                Tipo de Elevador
              </label>
              <select
                className="input"
                value={elevatorTypeFilter}
                onChange={(e) => setElevatorTypeFilter(e.target.value)}
              >
                <option value="">Todos os tipos</option>
                {uniqueElevatorTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            {/* Botão Limpar Filtros */}
            <div className="clear-filters-container">
              <button
                className="btn btn-secondary clear-filters-btn"
                onClick={clearFilters}
              >
                Limpar Filtros
              </button>
            </div>
          </div>
        </div>

        {/* Tabela de Instalações */}
        <div className="table" style={{ overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Cliente</th>
                  <th>País</th>
                  <th>Status</th>
                  <th>Tipo</th>
                  <th>Prazo</th>
                  <th>Custo</th>
                  <th>Responsável</th>
                  <th style={{ textAlign: 'center' }}>Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredInstallations.length === 0 ? (
                  <tr>
                    <td colSpan="9" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                      Nenhuma instalação encontrada com os filtros aplicados.
                    </td>
                  </tr>
                ) : (
                  filteredInstallations.map((installation) => {
                    const statusColors = getStatusColor(installation.status);
                    return (
                      <tr key={installation.id}>
                        <td style={{ fontWeight: '500', color: 'var(--text-primary)' }}>
                          {installation.id}
                        </td>
                        <td>
                          <div>
                            <div style={{ fontWeight: '500', color: 'var(--text-primary)' }}>{installation.client}</div>
                            <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{installation.city}</div>
                          </div>
                        </td>
                        <td style={{ color: 'var(--text-primary)' }}>{installation.country}</td>
                        <td style={{ padding: '1rem' }}>
                          <span style={{
                            padding: '0.375rem 0.75rem',
                            borderRadius: '6px',
                            fontSize: '0.875rem',
                            fontWeight: '500',
                            backgroundColor: statusColors.bg,
                            color: statusColors.text
                          }}>
                            {installation.status}
                          </span>
                        </td>
                        <td style={{ color: 'var(--text-primary)' }}>{installation.elevatorType}</td>
                        <td style={{ color: 'var(--text-primary)' }}>
                          {new Date(installation.deadline).toLocaleDateString('pt-BR')}
                        </td>
                        <td style={{ fontWeight: '500', color: 'var(--text-primary)' }}>
                          ${installation.cost.toLocaleString()}
                        </td>
                        <td style={{ color: 'var(--text-primary)' }}>{installation.responsible}</td>
                        <td style={{ textAlign: 'center' }}>
                          <button
                            className="btn"
                            onClick={() => handleViewDetails(installation.id)}
                            style={{
                              padding: '0.5rem',
                              backgroundColor: 'var(--bg-tertiary)',
                              color: 'var(--text-inverse)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}
                            title="Ver Detalhes"
                          >
                            <Eye size={16} />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal */}
        {isModalOpen && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'var(--bg-overlay)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
          }}>
            <div style={{
              backgroundColor: 'var(--bg-primary)',
              borderRadius: 'var(--radius-lg)',
              padding: 'var(--space-xl)',
              width: '100%',
              maxWidth: '600px',
              margin: 'var(--space-lg)',
              boxShadow: 'var(--shadow-xl)',
              maxHeight: '90vh',
              overflowY: 'auto'
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 'var(--space-lg)'
              }}>
                <h2 style={{
                  fontSize: 'var(--text-xl)',
                  fontWeight: '700',
                  color: 'var(--text-primary)'
                }}>
                  Nova Instalação
                </h2>
                <button
                  onClick={handleCloseModal}
                  style={{
                    color: 'var(--text-tertiary)',
                    border: 'none',
                    background: 'none',
                    cursor: 'pointer',
                    padding: 'var(--space-xs)',
                    borderRadius: 'var(--radius-sm)'
                  }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = 'var(--bg-secondary)'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                >
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-lg)' }}>
                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: 'var(--text-sm)',
                      fontWeight: '500',
                      color: 'var(--text-primary)',
                      marginBottom: 'var(--space-xs)'
                    }}>
                      Cliente/Edifício
                    </label>
                    <input
                      type="text"
                      value={formData.client}
                      onChange={(e) => setFormData({...formData, client: e.target.value})}
                      className="input"
                      required
                    />
                  </div>

                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: 'var(--text-sm)',
                      fontWeight: '500',
                      color: 'var(--text-primary)',
                      marginBottom: 'var(--space-xs)'
                    }}>
                      País
                    </label>
                    <select
                      value={formData.country}
                      onChange={(e) => setFormData({...formData, country: e.target.value})}
                      className="input"
                    >
                      <option value="Brasil">Brasil</option>
                      <option value="Argentina">Argentina</option>
                      <option value="Chile">Chile</option>
                      <option value="México">México</option>
                      <option value="Colômbia">Colômbia</option>
                      <option value="Peru">Peru</option>
                    </select>
                  </div>

                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: 'var(--text-sm)',
                      fontWeight: '500',
                      color: 'var(--text-primary)',
                      marginBottom: 'var(--space-xs)'
                    }}>
                      Cidade
                    </label>
                    <input
                      type="text"
                      value={formData.city}
                      onChange={(e) => setFormData({...formData, city: e.target.value})}
                      className="input"
                      required
                    />
                  </div>

                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: 'var(--text-sm)',
                      fontWeight: '500',
                      color: 'var(--text-primary)',
                      marginBottom: 'var(--space-xs)'
                    }}>
                      Status
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({...formData, status: e.target.value})}
                      className="input"
                    >
                      <option value="Em andamento">Em andamento</option>
                      <option value="Concluído">Concluído</option>
                      <option value="Atrasado">Atrasado</option>
                    </select>
                  </div>

                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: 'var(--text-sm)',
                      fontWeight: '500',
                      color: 'var(--text-primary)',
                      marginBottom: 'var(--space-xs)'
                    }}>
                      Data Limite
                    </label>
                    <input
                      type="date"
                      value={formData.deadline}
                      onChange={(e) => setFormData({...formData, deadline: e.target.value})}
                      className="input"
                      required
                    />
                  </div>

                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: 'var(--text-sm)',
                      fontWeight: '500',
                      color: 'var(--text-primary)',
                      marginBottom: 'var(--space-xs)'
                    }}>
                      Custo (USD)
                    </label>
                    <input
                      type="number"
                      value={formData.cost}
                      onChange={(e) => setFormData({...formData, cost: e.target.value})}
                      className="input"
                      min="0"
                      step="0.01"
                      required
                    />
                  </div>

                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: 'var(--text-sm)',
                      fontWeight: '500',
                      color: 'var(--text-primary)',
                      marginBottom: 'var(--space-xs)'
                    }}>
                      Responsável
                    </label>
                    <input
                      type="text"
                      value={formData.responsible}
                      onChange={(e) => setFormData({...formData, responsible: e.target.value})}
                      className="input"
                      required
                    />
                  </div>

                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: 'var(--text-sm)',
                      fontWeight: '500',
                      color: 'var(--text-primary)',
                      marginBottom: 'var(--space-xs)'
                    }}>
                      Tipo de Elevador
                    </label>
                    <select
                      value={formData.elevatorType}
                      onChange={(e) => setFormData({...formData, elevatorType: e.target.value})}
                      className="input"
                    >
                      <option value="Pessoal">Pessoal</option>
                      <option value="Carga">Carga</option>
                      <option value="Hospitalar">Hospitalar</option>
                      <option value="Panorâmico">Panorâmico</option>
                    </select>
                  </div>

                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: 'var(--text-sm)',
                      fontWeight: '500',
                      color: 'var(--text-primary)',
                      marginBottom: 'var(--space-xs)'
                    }}>
                      Progresso (%)
                    </label>
                    <input
                      type="number"
                      value={formData.progress}
                      onChange={(e) => setFormData({...formData, progress: parseInt(e.target.value)})}
                      className="input"
                      min="0"
                      max="100"
                      required
                    />
                  </div>

                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: 'var(--text-sm)',
                      fontWeight: '500',
                      color: 'var(--text-primary)',
                      marginBottom: 'var(--space-xs)'
                    }}>
                      Data de Início
                    </label>
                    <input
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                      className="input"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label style={{
                    display: 'block',
                    fontSize: 'var(--text-sm)',
                    fontWeight: '500',
                    color: 'var(--text-primary)',
                    marginBottom: 'var(--space-xs)'
                  }}>
                    Descrição
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    rows={3}
                    className="input"
                    style={{ resize: 'vertical', minHeight: '100px' }}
                    required
                  />
                </div>

                <div style={{
                  display: 'flex',
                  gap: 'var(--space-md)',
                  paddingTop: 'var(--space-lg)',
                  borderTop: '1px solid var(--border-primary)'
                }}>
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    style={{
                      flex: 1,
                      padding: 'var(--space-sm) var(--space-lg)',
                      color: 'var(--text-primary)',
                      backgroundColor: 'var(--bg-secondary)',
                      border: '1px solid var(--border-primary)',
                      borderRadius: 'var(--radius-md)',
                      cursor: 'pointer',
                      fontSize: 'var(--text-sm)',
                      fontWeight: '500'
                    }}
                    onMouseEnter={(e) => e.target.style.backgroundColor = 'var(--bg-tertiary)'}
                    onMouseLeave={(e) => e.target.style.backgroundColor = 'var(--bg-secondary)'}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    style={{
                      flex: 1,
                      padding: 'var(--space-sm) var(--space-lg)',
                      backgroundColor: '#2563eb',
                      color: 'white',
                      border: 'none',
                      borderRadius: 'var(--radius-md)',
                      cursor: 'pointer',
                      fontSize: 'var(--text-sm)',
                      fontWeight: '500',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 'var(--space-xs)'
                    }}
                    onMouseEnter={(e) => e.target.style.backgroundColor = '#1d4ed8'}
                    onMouseLeave={(e) => e.target.style.backgroundColor = '#2563eb'}
                  >
                    <Check size={16} />
                    Criar
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Installations;
