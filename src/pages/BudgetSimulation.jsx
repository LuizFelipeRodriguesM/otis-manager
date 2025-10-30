import { useState, useMemo } from 'react';
import { Calculator, DollarSign, Building, MapPin, Wrench, Hash } from 'lucide-react';
import { installationsMockData } from '../mocks/installations.js';

const BudgetSimulation = () => {
  const [formData, setFormData] = useState({
    elevatorType: '',
    country: '',
    quantity: 1,
    floors: 5,
    complexity: 'standard'
  });

  // Extrair dados únicos dos mocks para os selects
  const uniqueElevatorTypes = [...new Set(installationsMockData.map(inst => inst.elevatorType))].sort();
  const uniqueCountries = [...new Set(installationsMockData.map(inst => inst.country))].sort();

  // Calcular fatores de custo baseados nos dados mock
  const costFactors = useMemo(() => {
    const costsByType = {};
    const costsByCountry = {};

    // Calcular custo médio por tipo de elevador
    uniqueElevatorTypes.forEach(type => {
      const typeInstallations = installationsMockData.filter(inst => inst.elevatorType === type);
      const avgCost = typeInstallations.reduce((sum, inst) => sum + inst.cost, 0) / typeInstallations.length;
      costsByType[type] = avgCost;
    });

    // Calcular fatores de ajuste por país (baseado em custos relativos)
    const globalAvgCost = installationsMockData.reduce((sum, inst) => sum + inst.cost, 0) / installationsMockData.length;

    uniqueCountries.forEach(country => {
      const countryInstallations = installationsMockData.filter(inst => inst.country === country);
      const countryAvgCost = countryInstallations.reduce((sum, inst) => sum + inst.cost, 0) / countryInstallations.length;
      costsByCountry[country] = countryAvgCost / globalAvgCost;
    });

    return { costsByType, costsByCountry };
  }, []);

  // Calcular orçamento
  const budgetCalculation = useMemo(() => {
    if (!formData.elevatorType || !formData.country) {
      return null;
    }

    const baseCost = costFactors.costsByType[formData.elevatorType] || 35000;
    const countryFactor = costFactors.costsByCountry[formData.country] || 1;

    // Fatores de ajuste
    const quantityFactor = formData.quantity;
    const floorFactor = Math.max(1, formData.floors / 5); // Normalizar para 5 andares como base
    const complexityFactor = formData.complexity === 'high' ? 1.3 : formData.complexity === 'low' ? 0.8 : 1;

    // Cálculos detalhados
    const baseElevatorCost = baseCost * countryFactor;
    const floorAdjustment = baseElevatorCost * 0.1 * (formData.floors - 5); // $ por andar adicional
    const complexityAdjustment = baseElevatorCost * (complexityFactor - 1);
    const totalPerElevator = baseElevatorCost + floorAdjustment + complexityAdjustment;
    const totalCost = totalPerElevator * formData.quantity;

    // Itens do orçamento
    const items = [
      {
        description: `Elevador ${formData.elevatorType} - Base`,
        quantity: formData.quantity,
        unitCost: Math.round(baseElevatorCost),
        total: Math.round(baseElevatorCost * formData.quantity)
      },
      {
        description: `Ajuste por ${formData.floors} andares`,
        quantity: formData.quantity,
        unitCost: Math.round(floorAdjustment),
        total: Math.round(floorAdjustment * formData.quantity)
      },
      {
        description: `Ajuste por complexidade ${formData.complexity}`,
        quantity: formData.quantity,
        unitCost: Math.round(complexityAdjustment),
        total: Math.round(complexityAdjustment * formData.quantity)
      }
    ];

    return {
      items,
      subtotal: Math.round(totalCost * 0.85), // 85% do total para itens principais
      additionalCosts: Math.round(totalCost * 0.15), // 15% para custos adicionais
      total: Math.round(totalCost)
    };
  }, [formData, costFactors]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  return (
    <div className="page-content" style={{ minHeight: '100vh' }}>
      <div style={{ padding: '2rem' }}>
        <div style={{ marginBottom: '2rem' }}>
          <h1>Simulação de Orçamento - OTIS Manager</h1>
        </div>

        {/* Formulário de Simulação */}
        <div style={{
          backgroundColor: 'var(--bg-secondary)',
          padding: '2rem',
          borderRadius: '8px',
          border: '1px solid var(--border)',
          marginBottom: '2rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
            <Calculator size={20} style={{ color: 'var(--text-secondary)' }} />
            <h2 style={{ margin: '0', color: 'var(--text-primary)' }}>Parâmetros da Instalação</h2>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1.5rem'
          }}>
            {/* Tipo de Elevador */}
            <div>
              <label style={{
                display: 'block',
                marginBottom: '0.5rem',
                color: 'var(--text-primary)',
                fontWeight: '500'
              }}>
                <Wrench size={16} style={{ marginRight: '0.5rem', verticalAlign: 'middle' }} />
                Tipo de Elevador
              </label>
              <select
                className="input"
                value={formData.elevatorType}
                onChange={(e) => handleInputChange('elevatorType', e.target.value)}
                style={{ width: '100%' }}
              >
                <option value="">Selecione o tipo</option>
                {uniqueElevatorTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            {/* País */}
            <div>
              <label style={{
                display: 'block',
                marginBottom: '0.5rem',
                color: 'var(--text-primary)',
                fontWeight: '500'
              }}>
                <MapPin size={16} style={{ marginRight: '0.5rem', verticalAlign: 'middle' }} />
                País
              </label>
              <select
                className="input"
                value={formData.country}
                onChange={(e) => handleInputChange('country', e.target.value)}
                style={{ width: '100%' }}
              >
                <option value="">Selecione o país</option>
                {uniqueCountries.map(country => (
                  <option key={country} value={country}>{country}</option>
                ))}
              </select>
            </div>

            {/* Quantidade */}
            <div>
              <label style={{
                display: 'block',
                marginBottom: '0.5rem',
                color: 'var(--text-primary)',
                fontWeight: '500'
              }}>
                <Hash size={16} style={{ marginRight: '0.5rem', verticalAlign: 'middle' }} />
                Quantidade de Elevadores
              </label>
              <input
                className="input"
                type="number"
                min="1"
                max="20"
                value={formData.quantity}
                onChange={(e) => handleInputChange('quantity', parseInt(e.target.value) || 1)}
                style={{ width: '100%' }}
              />
            </div>

            {/* Andares */}
            <div>
              <label style={{
                display: 'block',
                marginBottom: '0.5rem',
                color: 'var(--text-primary)',
                fontWeight: '500'
              }}>
                <Building size={16} style={{ marginRight: '0.5rem', verticalAlign: 'middle' }} />
                Número de Andares
              </label>
              <input
                className="input"
                type="number"
                min="2"
                max="100"
                value={formData.floors}
                onChange={(e) => handleInputChange('floors', parseInt(e.target.value) || 5)}
                style={{ width: '100%' }}
              />
            </div>

            {/* Complexidade */}
            <div style={{ gridColumn: 'span 2' }}>
              <label style={{
                display: 'block',
                marginBottom: '0.5rem',
                color: 'var(--text-primary)',
                fontWeight: '500'
              }}>
                Nível de Complexidade
              </label>
              <div style={{ display: 'flex', gap: '1rem' }}>
                {[
                  { value: 'low', label: 'Baixa', desc: 'Instalação simples' },
                  { value: 'standard', label: 'Padrão', desc: 'Instalação padrão' },
                  { value: 'high', label: 'Alta', desc: 'Instalação complexa' }
                ].map(option => (
                  <label key={option.value} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    cursor: 'pointer',
                    padding: '0.75rem',
                    border: `2px solid ${formData.complexity === option.value ? 'var(--primary)' : 'var(--border)'}`,
                    borderRadius: '6px',
                    backgroundColor: formData.complexity === option.value ? 'var(--bg-primary)' : 'var(--bg-secondary)',
                    transition: 'all 0.2s ease'
                  }}>
                    <input
                      type="radio"
                      name="complexity"
                      value={option.value}
                      checked={formData.complexity === option.value}
                      onChange={(e) => handleInputChange('complexity', e.target.value)}
                      style={{ margin: 0 }}
                    />
                    <div>
                      <div style={{ fontWeight: '500', color: 'var(--text-primary)' }}>{option.label}</div>
                      <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{option.desc}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Resultado da Simulação */}
        {budgetCalculation && (
          <div style={{
            backgroundColor: 'var(--bg-secondary)',
            padding: '2rem',
            borderRadius: '8px',
            border: '1px solid var(--border)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
              <DollarSign size={20} style={{ color: 'var(--text-secondary)' }} />
              <h2 style={{ margin: '0', color: 'var(--text-primary)' }}>Orçamento Estimado</h2>
            </div>

            {/* Tabela de Itens */}
            <div style={{ marginBottom: '2rem', overflowX: 'auto' }}>
              <table className="table" style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    <th style={{ textAlign: 'left' }}>Descrição</th>
                    <th style={{ textAlign: 'center', width: '100px' }}>Qtd</th>
                    <th style={{ textAlign: 'right', width: '120px' }}>Valor Unit.</th>
                    <th style={{ textAlign: 'right', width: '120px' }}>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {budgetCalculation.items.map((item, index) => (
                    <tr key={index}>
                      <td style={{ fontWeight: '500', color: 'var(--text-primary)' }}>
                        {item.description}
                      </td>
                      <td style={{ textAlign: 'center', color: 'var(--text-primary)' }}>
                        {item.quantity}
                      </td>
                      <td style={{ textAlign: 'right', color: 'var(--text-primary)' }}>
                        {formatCurrency(item.unitCost)}
                      </td>
                      <td style={{ textAlign: 'right', fontWeight: '500', color: 'var(--text-primary)' }}>
                        {formatCurrency(item.total)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Resumo Final */}
            <div style={{
              borderTop: '1px solid var(--border)',
              paddingTop: '1.5rem',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '1rem'
            }}>
              <div style={{
                backgroundColor: 'var(--bg-tertiary)',
                padding: '1rem',
                borderRadius: '6px'
              }}>
                <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                  Subtotal (Itens Principais)
                </div>
                <div style={{ fontSize: '1.25rem', fontWeight: '600', color: 'var(--text-primary)' }}>
                  {formatCurrency(budgetCalculation.subtotal)}
                </div>
              </div>

              <div style={{
                backgroundColor: 'var(--bg-tertiary)',
                padding: '1rem',
                borderRadius: '6px'
              }}>
                <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                  Custos Adicionais (15%)
                </div>
                <div style={{ fontSize: '1.25rem', fontWeight: '600', color: 'var(--text-primary)' }}>
                  {formatCurrency(budgetCalculation.additionalCosts)}
                </div>
              </div>

              <div style={{
                backgroundColor: 'var(--primary)',
                padding: '1rem',
                borderRadius: '6px',
                gridColumn: 'span 2'
              }}>
                <div style={{ color: 'var(--text-inverse)', fontSize: '0.875rem' }}>
                  Valor Total Estimado
                </div>
                <div style={{
                  fontSize: '2rem',
                  fontWeight: '700',
                  color: 'var(--text-inverse)',
                  marginTop: '0.25rem'
                }}>
                  {formatCurrency(budgetCalculation.total)}
                </div>
              </div>
            </div>

            {/* Observações */}
            <div style={{
              marginTop: '1.5rem',
              padding: '1rem',
              backgroundColor: 'var(--bg-tertiary)',
              borderRadius: '6px',
              border: '1px solid var(--border-primary)'
            }}>
              <h4 style={{ margin: '0 0 0.5rem 0', color: 'var(--text-primary)' }}>
                Observações Importantes
              </h4>
              <ul style={{
                margin: 0,
                paddingLeft: '1.5rem',
                color: 'var(--text-secondary)',
                lineHeight: '1.5'
              }}>
                <li>Este é um orçamento estimativo baseado em dados históricos</li>
                <li>O valor final pode variar dependendo de condições específicas do local</li>
                <li>Custos adicionais incluem instalação, transporte e treinamento</li>
                <li>Para orçamento preciso, entre em contato com nossa equipe comercial</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BudgetSimulation;
