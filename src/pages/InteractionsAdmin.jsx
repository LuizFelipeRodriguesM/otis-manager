import { useState, useEffect } from 'react'
import { Plus, Edit, Trash2, Check, X } from 'lucide-react'

const InteractionsAdmin = () => {
  const [interactions, setInteractions] = useState([])

  // Carregar dados do localStorage ao inicializar
  useEffect(() => {
    const savedInteractions = localStorage.getItem('otis_interactions')
    if (savedInteractions) {
      setInteractions(JSON.parse(savedInteractions))
    } else {
      // Dados iniciais se não houver nada no cache
      const initialData = [
        {
          id: 1,
          clientName: 'João Silva',
          description: 'Reunião inicial para discutir necessidades',
          date: '2024-01-15',
          status: 'Concluída',
          type: 'Reunião'
        },
        {
          id: 2,
          clientName: 'Maria Santos',
          description: 'Apresentação do produto',
          date: '2024-01-20',
          status: 'Pendente',
          type: 'Apresentação'
        }
      ]
      setInteractions(initialData)
      localStorage.setItem('otis_interactions', JSON.stringify(initialData))
    }
  }, [])

  // Salvar no localStorage sempre que interactions mudar
  useEffect(() => {
    if (interactions.length > 0) {
      localStorage.setItem('otis_interactions', JSON.stringify(interactions))
    }
  }, [interactions])

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingInteraction, setEditingInteraction] = useState(null)
  const [formData, setFormData] = useState({
    clientName: '',
    description: '',
    date: '',
    status: 'Pendente',
    type: 'Reunião'
  })

  const statusOptions = ['Pendente', 'Em Andamento', 'Concluída', 'Cancelada']
  const typeOptions = ['Reunião', 'Apresentação', 'Follow-up', 'Suporte', 'Negociação']

  const handleOpenModal = (interaction = null) => {
    if (interaction) {
      setEditingInteraction(interaction)
      setFormData({
        clientName: interaction.clientName,
        description: interaction.description,
        date: interaction.date,
        status: interaction.status,
        type: interaction.type
      })
    } else {
      setEditingInteraction(null)
      setFormData({
        clientName: '',
        description: '',
        date: '',
        status: 'Pendente',
        type: 'Reunião'
      })
    }
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingInteraction(null)
    setFormData({
      clientName: '',
      description: '',
      date: '',
      status: 'Pendente',
      type: 'Reunião'
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (editingInteraction) {
      // Update existing interaction
      setInteractions(interactions.map(interaction =>
        interaction.id === editingInteraction.id
          ? { ...interaction, ...formData }
          : interaction
      ))
    } else {
      // Create new interaction
      const newInteraction = {
        id: Math.max(...interactions.map(i => i.id)) + 1,
        ...formData
      }
      setInteractions([...interactions, newInteraction])
    }

    handleCloseModal()
  }

  const handleDelete = (id) => {
    if (window.confirm('Tem certeza que deseja excluir esta interação?')) {
      setInteractions(interactions.filter(interaction => interaction.id !== id))
    }
  }

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Concluída':
        return {
          backgroundColor: '#d1fae5',
          color: '#065f46',
          border: '1px solid #a7f3d0'
        }
      case 'Em Andamento':
        return {
          backgroundColor: '#dbeafe',
          color: '#1e40af',
          border: '1px solid #bfdbfe'
        }
      case 'Pendente':
        return {
          backgroundColor: '#fef3c7',
          color: '#92400e',
          border: '1px solid #fde68a'
        }
      case 'Cancelada':
        return {
          backgroundColor: '#fee2e2',
          color: '#991b1b',
          border: '1px solid #fecaca'
        }
      default:
        return {
          backgroundColor: 'var(--bg-tertiary)',
          color: 'var(--text-primary)',
          border: '1px solid var(--border-primary)'
        }
    }
  }

  return (
    <div className="page-content" style={{ minHeight: '100vh' }}>
      <div style={{ padding: '2rem' }}>
        <div style={{ marginBottom: '2rem' }}>
          <h1>Administração de Interações - OTIS Manager</h1>
        </div>

        <div style={{ marginTop: '80px', marginBottom: '2rem', display: 'flex', justifyContent: 'flex-start' }}>
          <button
            onClick={() => handleOpenModal()}
            className="btn btn-primary"
            style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}
          >
            <Plus size={20} />
            Nova Interação
          </button>
        </div>

      {/* Table */}
      <div style={{
        backgroundColor: 'var(--bg-primary)',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-md)',
        overflow: 'hidden'
      }}>
        <table className="table">
          <thead>
            <tr>
              <th style={{ fontSize: 'var(--text-xs)', fontWeight: '600', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
                Cliente
              </th>
              <th style={{ fontSize: 'var(--text-xs)', fontWeight: '600', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
                Descrição
              </th>
              <th style={{ fontSize: 'var(--text-xs)', fontWeight: '600', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
                Data
              </th>
              <th style={{ fontSize: 'var(--text-xs)', fontWeight: '600', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
                Status
              </th>
              <th style={{ fontSize: 'var(--text-xs)', fontWeight: '600', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
                Tipo
              </th>
              <th style={{ fontSize: 'var(--text-xs)', fontWeight: '600', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
                Ações
              </th>
            </tr>
          </thead>
          <tbody>
            {interactions.map((interaction) => (
              <tr key={interaction.id}>
                <td style={{ fontSize: 'var(--text-sm)', fontWeight: '500', color: 'var(--text-primary)' }}>
                  {interaction.clientName}
                </td>
                <td style={{
                  fontSize: 'var(--text-sm)',
                  color: 'var(--text-primary)',
                  maxWidth: '200px',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}>
                  {interaction.description}
                </td>
                <td style={{ fontSize: 'var(--text-sm)', color: 'var(--text-primary)' }}>
                  {new Date(interaction.date).toLocaleDateString('pt-BR')}
                </td>
                <td>
                  <span style={{
                    display: 'inline-flex',
                    padding: 'var(--space-xs) var(--space-sm)',
                    fontSize: 'var(--text-xs)',
                    fontWeight: '600',
                    borderRadius: 'var(--radius-xl)',
                    ...getStatusStyle(interaction.status)
                  }}>
                    {interaction.status}
                  </span>
                </td>
                <td style={{ fontSize: 'var(--text-sm)', color: 'var(--text-primary)' }}>
                  {interaction.type}
                </td>
                <td>
                  <div style={{ display: 'flex', gap: 'var(--space-sm)' }}>
                    <button
                      onClick={() => handleOpenModal(interaction)}
                      style={{
                        color: '#2563eb',
                        padding: 'var(--space-xs)',
                        border: 'none',
                        background: 'none',
                        cursor: 'pointer',
                        borderRadius: 'var(--radius-sm)'
                      }}
                      onMouseEnter={(e) => e.target.style.backgroundColor = 'var(--bg-secondary)'}
                      onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                      title="Editar"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(interaction.id)}
                      style={{
                        color: '#dc2626',
                        padding: 'var(--space-xs)',
                        border: 'none',
                        background: 'none',
                        cursor: 'pointer',
                        borderRadius: 'var(--radius-sm)'
                      }}
                      onMouseEnter={(e) => e.target.style.backgroundColor = 'var(--bg-secondary)'}
                      onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                      title="Excluir"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {interactions.length === 0 && (
          <div style={{
            textAlign: 'center',
            padding: 'var(--space-3xl)',
            color: 'var(--text-secondary)'
          }}>
            <p>Nenhuma interação encontrada.</p>
          </div>
        )}
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
            maxWidth: '500px',
            margin: 'var(--space-lg)',
            boxShadow: 'var(--shadow-xl)'
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
                {editingInteraction ? 'Editar Interação' : 'Nova Interação'}
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
              <div>
                <label style={{
                  display: 'block',
                  fontSize: 'var(--text-sm)',
                  fontWeight: '500',
                  color: 'var(--text-primary)',
                  marginBottom: 'var(--space-xs)'
                }}>
                  Nome do Cliente
                </label>
                <input
                  type="text"
                  value={formData.clientName}
                  onChange={(e) => setFormData({...formData, clientName: e.target.value})}
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

              <div>
                <label style={{
                  display: 'block',
                  fontSize: 'var(--text-sm)',
                  fontWeight: '500',
                  color: 'var(--text-primary)',
                  marginBottom: 'var(--space-xs)'
                }}>
                  Data
                </label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({...formData, date: e.target.value})}
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
                  {statusOptions.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
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
                  Tipo
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({...formData, type: e.target.value})}
                  className="input"
                >
                  {typeOptions.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
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
                  {editingInteraction ? 'Salvar' : 'Criar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      </div>
    </div>
  )
}

export default InteractionsAdmin
