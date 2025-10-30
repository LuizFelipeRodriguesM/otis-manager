import { dashboardMockData } from '../mocks/dashboard.js';

const Dashboard = () => {
  const { kpis, recentInstallations, chartData } = dashboardMockData;

  // Dados para próximos prazos (mock)
  const upcomingDeadlines = recentInstallations
    .filter(inst => inst.status === 'Em andamento')
    .sort((a, b) => new Date(a.deadline) - new Date(b.deadline))
    .slice(0, 3);

  // Estatísticas adicionais
  const totalInstallations = 46;
  const thisMonthInstallations = 12;
  const avgCompletionTime = 45; // dias

  return (
    <div className="page-content" style={{ minHeight: '100vh' }}>
      <div style={{ padding: '2rem' }}>
        <h1>Dashboard - OTIS Manager</h1>

        {/* KPIs Cards */}
        <div className="grid gap-lg mb-xl" style={{
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          marginBottom: '2rem'
        }}>
          <div className="card">
            <h3>Instalações no Prazo</h3>
            <p className="text-3xl font-bold" style={{ color: '#2563eb' }}>{kpis.completedOnTime}%</p>
          </div>

          <div className="card">
            <h3>Custo Médio</h3>
            <p className="text-3xl font-bold" style={{ color: '#dc2626' }}>${kpis.averageCost.toLocaleString()}</p>
          </div>

          <div className="card">
            <h3>Satisfação do Cliente</h3>
            <p className="text-3xl font-bold" style={{ color: '#16a34a' }}>{kpis.customerSatisfaction}/5</p>
          </div>

          <div className="card">
            <h3>Em Andamento</h3>
            <p className="text-3xl font-bold" style={{ color: '#ca8a04' }}>{kpis.installationsInProgress}</p>
          </div>
        </div>

        {/* Gráfico e Próximos Prazos */}
        <div className="dashboard-grid mb-xl mb-lg">
          {/* Gráfico por País */}
          <div className="card">
            <h3 className="mb-lg">Instalações por País</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {chartData.byCountry.map((item, index) => (
                <div key={item.country} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <span style={{
                    minWidth: '80px',
                    fontWeight: '500',
                    color: 'var(--text-primary)'
                  }}>
                    {item.country}
                  </span>
                  <div style={{
                    flex: 1,
                    height: '24px',
                    backgroundColor: 'var(--bg-secondary)',
                    borderRadius: '4px',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      height: '100%',
                      width: `${(item.count / Math.max(...chartData.byCountry.map(c => c.count))) * 100}%`,
                      backgroundColor: `hsl(${index * 60}, 70%, 50%)`,
                      borderRadius: '4px',
                      transition: 'width 0.3s ease'
                    }}></div>
                  </div>
                  <span style={{
                    minWidth: '30px',
                    textAlign: 'right',
                    fontWeight: '600',
                    color: 'var(--text-primary)'
                  }}>
                    {item.count}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Próximos Prazos */}
          <div className="card">
            <h3 className="mb-lg">Próximos Prazos</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {upcomingDeadlines.map((installation) => {
                const daysLeft = Math.ceil((new Date(installation.deadline) - new Date()) / (1000 * 60 * 60 * 24));
                const isUrgent = daysLeft <= 7;

                return (
                  <div key={installation.id} style={{
                    padding: '0.75rem',
                    borderRadius: '6px',
                    backgroundColor: isUrgent ? 'var(--alert-bg)' : 'var(--bg-secondary)',
                    border: isUrgent ? `1px solid var(--alert-border)` : '1px solid var(--border-primary)'
                  }}>
                    <div style={{
                      fontWeight: '600',
                      color: 'var(--text-primary)',
                      fontSize: '0.875rem'
                    }}>
                      {installation.client}
                    </div>
                    <div style={{
                      color: 'var(--text-secondary)',
                      fontSize: '0.75rem',
                      marginTop: '0.25rem'
                    }}>
                      {installation.id} • {installation.country}
                    </div>
                    <div style={{
                      marginTop: '0.5rem',
                      fontSize: '0.875rem',
                      fontWeight: '500',
                      color: isUrgent ? 'var(--alert-text)' : 'var(--text-primary)'
                    }}>
                      {daysLeft > 0 ? `${daysLeft} dias` : 'Vencido'}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Tabela de Instalações Recentes */}
        <div className="card">
          <h3 className="mb-md">Instalações Recentes</h3>
          <div style={{ overflowX: 'auto' }}>
            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Cliente</th>
                  <th>País</th>
                  <th>Status</th>
                  <th>Prazo</th>
                  <th>Custo</th>
                  <th>Responsável</th>
                </tr>
              </thead>
              <tbody>
                {recentInstallations.map((installation) => (
                  <tr key={installation.id}>
                    <td>{installation.id}</td>
                    <td>{installation.client}</td>
                    <td>{installation.country}</td>
                    <td>
                      <span style={{
                        padding: '0.25rem 0.5rem',
                        borderRadius: '4px',
                        fontSize: '0.875rem',
                        backgroundColor: installation.status === 'Concluído' ? '#dcfce7' :
                                        installation.status === 'Em andamento' ? '#dbeafe' : '#fee2e2',
                        color: installation.status === 'Concluído' ? '#166534' :
                               installation.status === 'Em andamento' ? '#1e40af' : '#dc2626'
                      }}>
                        {installation.status}
                      </span>
                    </td>
                    <td>{new Date(installation.deadline).toLocaleDateString('pt-BR')}</td>
                    <td>${installation.cost.toLocaleString()}</td>
                    <td>{installation.responsible}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

