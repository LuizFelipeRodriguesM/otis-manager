import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, DollarSign, User, MapPin, Wrench, Clock } from 'lucide-react';
import { installationsMockData } from '../mocks/installations.js';

const InstallationsDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Encontrar a instalação pelo ID
  const installation = installationsMockData.find(inst => inst.id === id);

  // Se não encontrar a instalação, mostrar erro
  if (!installation) {
    return (
      <div className="page-content" style={{ minHeight: '100vh' }}>
        <div style={{ padding: '2rem', textAlign: 'center' }}>
          <h1>Instalação não encontrada</h1>
          <p>Não foi possível encontrar uma instalação com o ID: {id}</p>
          <button
            className="btn btn-secondary"
            onClick={() => navigate('/installations')}
            style={{ marginTop: '1rem' }}
          >
            Voltar para Instalações
          </button>
        </div>
      </div>
    );
  }

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

  const statusColors = getStatusColor(installation.status);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const getProgressColor = (progress) => {
    if (progress >= 80) return '#22c55e'; // verde
    if (progress >= 50) return '#eab308'; // amarelo
    return '#ef4444'; // vermelho
  };

  return (
    <div className="page-content" style={{ minHeight: '100vh' }}>
      <div style={{ padding: '2rem' }}>
        {/* Header com botão voltar */}
        <div style={{ marginBottom: '2rem' }}>
          <button
            className="btn btn-secondary"
            onClick={() => navigate('/installations')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              marginBottom: '1rem'
            }}
          >
            <ArrowLeft size={16} />
            Voltar para Instalações
          </button>
          <h1 style={{ margin: '0' }}>
            Instalação {installation.id}
          </h1>
          <p style={{ color: 'var(--text-secondary)', margin: '0.5rem 0 0 0' }}>
            {installation.client}
          </p>
        </div>

        {/* Cards de Informações Principais */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '1.5rem',
          marginBottom: '2rem'
        }}>
          {/* Status */}
          <div style={{
            backgroundColor: 'var(--bg-secondary)',
            padding: '1.5rem',
            borderRadius: '8px',
            border: '1px solid var(--border)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <Clock size={18} style={{ color: 'var(--text-secondary)' }} />
              <h3 style={{ margin: '0', color: 'var(--text-primary)' }}>Status</h3>
            </div>
            <span style={{
              padding: '0.5rem 1rem',
              borderRadius: '6px',
              fontSize: '0.875rem',
              fontWeight: '500',
              backgroundColor: statusColors.bg,
              color: statusColors.text
            }}>
              {installation.status}
            </span>
          </div>

          {/* Responsável */}
          <div style={{
            backgroundColor: 'var(--bg-secondary)',
            padding: '1.5rem',
            borderRadius: '8px',
            border: '1px solid var(--border)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <User size={18} style={{ color: 'var(--text-secondary)' }} />
              <h3 style={{ margin: '0', color: 'var(--text-primary)' }}>Responsável</h3>
            </div>
            <p style={{ margin: '0', color: 'var(--text-primary)', fontWeight: '500' }}>
              {installation.responsible}
            </p>
          </div>

          {/* Custo */}
          <div style={{
            backgroundColor: 'var(--bg-secondary)',
            padding: '1.5rem',
            borderRadius: '8px',
            border: '1px solid var(--border)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <DollarSign size={18} style={{ color: 'var(--text-secondary)' }} />
              <h3 style={{ margin: '0', color: 'var(--text-primary)' }}>Custo Total</h3>
            </div>
            <p style={{ margin: '0', color: 'var(--text-primary)', fontWeight: '500', fontSize: '1.25rem' }}>
              ${installation.cost.toLocaleString()}
            </p>
          </div>

          {/* Localização */}
          <div style={{
            backgroundColor: 'var(--bg-secondary)',
            padding: '1.5rem',
            borderRadius: '8px',
            border: '1px solid var(--border)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <MapPin size={18} style={{ color: 'var(--text-secondary)' }} />
              <h3 style={{ margin: '0', color: 'var(--text-primary)' }}>Localização</h3>
            </div>
            <p style={{ margin: '0', color: 'var(--text-primary)', fontWeight: '500' }}>
              {installation.city}, {installation.country}
            </p>
          </div>

          {/* Tipo de Elevador */}
          <div style={{
            backgroundColor: 'var(--bg-secondary)',
            padding: '1.5rem',
            borderRadius: '8px',
            border: '1px solid var(--border)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <Wrench size={18} style={{ color: 'var(--text-secondary)' }} />
              <h3 style={{ margin: '0', color: 'var(--text-primary)' }}>Tipo de Elevador</h3>
            </div>
            <p style={{ margin: '0', color: 'var(--text-primary)', fontWeight: '500' }}>
              {installation.elevatorType}
            </p>
          </div>

          {/* Progresso */}
          <div style={{
            backgroundColor: 'var(--bg-secondary)',
            padding: '1.5rem',
            borderRadius: '8px',
            border: '1px solid var(--border)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <Clock size={18} style={{ color: 'var(--text-secondary)' }} />
              <h3 style={{ margin: '0', color: 'var(--text-primary)' }}>Progresso</h3>
            </div>
            <div style={{ marginBottom: '0.5rem' }}>
              <div style={{
                width: '100%',
                height: '8px',
                backgroundColor: 'var(--bg-tertiary)',
                borderRadius: '4px',
                overflow: 'hidden'
              }}>
                <div style={{
                  width: `${installation.progress}%`,
                  height: '100%',
                  backgroundColor: getProgressColor(installation.progress),
                  transition: 'width 0.3s ease'
                }} />
              </div>
            </div>
            <p style={{ margin: '0', color: 'var(--text-primary)', fontWeight: '500' }}>
              {installation.progress}% concluído
            </p>
          </div>
        </div>

        {/* Datas */}
        <div style={{
          backgroundColor: 'var(--bg-secondary)',
          padding: '1.5rem',
          borderRadius: '8px',
          border: '1px solid var(--border)',
          marginBottom: '2rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <Calendar size={18} style={{ color: 'var(--text-secondary)' }} />
            <h3 style={{ margin: '0', color: 'var(--text-primary)' }}>Datas Importantes</h3>
          </div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1rem'
          }}>
            <div>
              <p style={{ margin: '0', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                Data de Início
              </p>
              <p style={{ margin: '0.25rem 0 0 0', color: 'var(--text-primary)', fontWeight: '500' }}>
                {formatDate(installation.startDate)}
              </p>
            </div>
            <div>
              <p style={{ margin: '0', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                Prazo
              </p>
              <p style={{
                margin: '0.25rem 0 0 0',
                color: installation.status === 'Atrasado' ? '#dc2626' : 'var(--text-primary)',
                fontWeight: '500'
              }}>
                {formatDate(installation.deadline)}
              </p>
            </div>
            {installation.completionDate && (
              <div>
                <p style={{ margin: '0', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                  Data de Conclusão
                </p>
                <p style={{ margin: '0.25rem 0 0 0', color: 'var(--text-primary)', fontWeight: '500' }}>
                  {formatDate(installation.completionDate)}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Descrição */}
        <div style={{
          backgroundColor: 'var(--bg-secondary)',
          padding: '1.5rem',
          borderRadius: '8px',
          border: '1px solid var(--border)'
        }}>
          <h3 style={{ margin: '0 0 1rem 0', color: 'var(--text-primary)' }}>Descrição do Projeto</h3>
          <p style={{
            margin: '0',
            color: 'var(--text-primary)',
            lineHeight: '1.6'
          }}>
            {installation.description}
          </p>
        </div>
      </div>
    </div>
  );
};

export default InstallationsDetails;
