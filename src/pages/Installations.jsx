import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye } from 'lucide-react';
import { installationsMockData } from '../mocks/installations.js';

const Installations = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [countryFilter, setCountryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [elevatorTypeFilter, setElevatorTypeFilter] = useState('');

  // Filtros únicos para os selects
  const uniqueCountries = [...new Set(installationsMockData.map(inst => inst.country))].sort();
  const uniqueStatuses = [...new Set(installationsMockData.map(inst => inst.status))].sort();
  const uniqueElevatorTypes = [...new Set(installationsMockData.map(inst => inst.elevatorType))].sort();

  // Dados filtrados
  const filteredInstallations = useMemo(() => {
    return installationsMockData.filter(installation => {
      const matchesSearch = searchTerm === '' ||
        installation.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
        installation.id.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCountry = countryFilter === '' || installation.country === countryFilter;
      const matchesStatus = statusFilter === '' || installation.status === statusFilter;
      const matchesElevatorType = elevatorTypeFilter === '' || installation.elevatorType === elevatorTypeFilter;

      return matchesSearch && matchesCountry && matchesStatus && matchesElevatorType;
    });
  }, [searchTerm, countryFilter, statusFilter, elevatorTypeFilter]);

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
      </div>
    </div>
  );
};

export default Installations;
