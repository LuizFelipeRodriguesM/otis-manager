// Mock data for Dashboard component
export const dashboardMockData = {
  // KPIs principais
  kpis: {
    completedOnTime: 87, // % de instalações concluídas no prazo
    averageCost: 45200, // Custo médio por país (em USD)
    customerSatisfaction: 4.2, // Satisfação do cliente (1-5)
    installationsInProgress: 23 // Número de instalações em andamento
  },

  // Lista de instalações recentes (últimas 10)
  recentInstallations: [
    {
      id: 'INST-001',
      client: 'Edifício Central Plaza',
      country: 'Brasil',
      status: 'Em andamento',
      deadline: '2024-12-15',
      cost: 45000,
      responsible: 'João Silva'
    },
    {
      id: 'INST-002',
      client: 'Hospital São Lucas',
      country: 'Argentina',
      status: 'Concluído',
      deadline: '2024-11-30',
      cost: 38000,
      responsible: 'Maria García'
    },
    {
      id: 'INST-003',
      client: 'Shopping Premium',
      country: 'Chile',
      status: 'Atrasado',
      deadline: '2024-11-20',
      cost: 52000,
      responsible: 'Carlos Ruiz'
    },
    {
      id: 'INST-004',
      client: 'Torre Empresarial',
      country: 'México',
      status: 'Em andamento',
      deadline: '2024-12-28',
      cost: 41000,
      responsible: 'Ana López'
    },
    {
      id: 'INST-005',
      client: 'Condomínio Vista Mar',
      country: 'Brasil',
      status: 'Concluído',
      deadline: '2024-11-25',
      cost: 35000,
      responsible: 'Pedro Santos'
    }
  ],

  // Dados para filtros
  filters: {
    countries: ['Brasil', 'Argentina', 'Chile', 'México', 'Colômbia', 'Peru'],
    statuses: ['Em andamento', 'Concluído', 'Atrasado', 'Cancelado'],
    elevatorTypes: ['Pessoal', 'Carga', 'Hospitalar', 'Panorâmico']
  },

  // Dados para gráficos simples (mock básico)
  chartData: {
    byCountry: [
      { country: 'Brasil', count: 15 },
      { country: 'Argentina', count: 8 },
      { country: 'Chile', count: 6 },
      { country: 'México', count: 12 }
    ],
    byStatus: [
      { status: 'Em andamento', count: 23 },
      { status: 'Concluído', count: 18 },
      { status: 'Atrasado', count: 5 }
    ]
  }
};

export default dashboardMockData;
