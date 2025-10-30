import { useState, useEffect, useMemo } from 'react';
import { Star, MessageSquare, X, Eye } from 'lucide-react';
import { feedbacksMockData } from '../mocks/feedbacks.js';

const FeedbackAdmin = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  // Details modal state
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [viewingFeedback, setViewingFeedback] = useState(null);

  // Initialize with mock data
  useEffect(() => {
    setFeedbacks(feedbacksMockData);
  }, []);

  // Filtered feedbacks
  const filteredFeedbacks = useMemo(() => {
    return feedbacks.filter(feedback => {
      const matchesSearch = searchTerm === '' ||
        feedback.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        feedback.comment.toLowerCase().includes(searchTerm.toLowerCase());

      return matchesSearch;
    });
  }, [searchTerm, feedbacks]);


  const handleOpenDetailsModal = (feedback) => {
    setViewingFeedback(feedback);
    setDetailsModalOpen(true);
  };

  const handleCloseDetailsModal = () => {
    setDetailsModalOpen(false);
    setViewingFeedback(null);
  };


  const renderStars = (rating, interactive = false, onChange = null) => {
    return (
      <div style={{ display: 'flex', gap: '2px' }}>
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={interactive ? 20 : 16}
            style={{
              color: star <= rating ? '#fbbf24' : '#e5e7eb',
              cursor: interactive ? 'pointer' : 'default',
              fill: star <= rating ? '#fbbf24' : 'none'
            }}
            onClick={interactive ? () => onChange && onChange(star) : undefined}
          />
        ))}
      </div>
    );
  };

  const getAverageRating = () => {
    if (filteredFeedbacks.length === 0) return 0;
    const sum = filteredFeedbacks.reduce((acc, feedback) => acc + feedback.rating, 0);
    return (sum / filteredFeedbacks.length).toFixed(1);
  };

  return (
    <div className="page-content" style={{ minHeight: '100vh' }}>
      <div style={{ padding: '2rem' }}>
        <div style={{ marginBottom: '2rem' }}>
          <h1>Feedback dos Clientes - OTIS Manager</h1>
          <p style={{ color: 'var(--text-secondary)', margin: '0.5rem 0' }}>
            Gerencie os feedbacks e avaliações dos clientes
          </p>
        </div>

        {/* Summary Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '1rem',
          marginBottom: '2rem'
        }}>
          <div style={{
            backgroundColor: 'var(--bg-secondary)',
            padding: '1.5rem',
            borderRadius: '8px',
            border: '1px solid var(--border)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <MessageSquare size={18} style={{ color: 'var(--text-secondary)' }} />
              <h3 style={{ margin: '0', color: 'var(--text-primary)', fontSize: '0.875rem' }}>Total de Feedbacks</h3>
            </div>
            <p style={{ margin: '0', color: 'var(--text-primary)', fontWeight: '600', fontSize: '1.5rem' }}>
              {filteredFeedbacks.length}
            </p>
          </div>

          <div style={{
            backgroundColor: 'var(--bg-secondary)',
            padding: '1.5rem',
            borderRadius: '8px',
            border: '1px solid var(--border)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <Star size={18} style={{ color: 'var(--text-secondary)' }} />
              <h3 style={{ margin: '0', color: 'var(--text-primary)', fontSize: '0.875rem' }}>Avaliação Média</h3>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              {renderStars(Math.round(getAverageRating()))}
              <span style={{ fontWeight: '600', fontSize: '1.25rem', color: 'var(--text-primary)' }}>
                {getAverageRating()}
              </span>
            </div>
          </div>
        </div>


        {/* Search */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ maxWidth: '400px' }}>
            <label style={{
              display: 'block',
              fontSize: 'var(--text-sm)',
              fontWeight: '500',
              color: 'var(--text-primary)',
              marginBottom: 'var(--space-xs)'
            }}>
              Buscar por Cliente ou Comentário
            </label>
            <input
              className="input"
              type="text"
              placeholder="Digite o nome do cliente ou comentário..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: '100%' }}
            />
          </div>
        </div>

        {/* Feedback Table */}
        <div className="table" style={{ overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th>Cliente</th>
                  <th>Avaliação</th>
                  <th>Comentário</th>
                  <th>Data</th>
                  <th style={{ textAlign: 'center' }}>Detalhes</th>
                </tr>
              </thead>
              <tbody>
                {filteredFeedbacks.length === 0 ? (
                  <tr>
                    <td colSpan="5" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                      Nenhum feedback encontrado.
                    </td>
                  </tr>
                ) : (
                  filteredFeedbacks.map((feedback) => {
                    return (
                      <tr key={feedback.id}>
                        <td style={{ fontWeight: '500', color: 'var(--text-primary)' }}>
                          <div>
                            <div>{feedback.clientName}</div>
                            {feedback.projectName && (
                              <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                                Projeto: {feedback.projectName}
                              </div>
                            )}
                          </div>
                        </td>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            {renderStars(feedback.rating)}
                            <span style={{ fontWeight: '500', color: 'var(--text-primary)' }}>
                              {feedback.rating}
                            </span>
                          </div>
                        </td>
                        <td style={{
                          maxWidth: '300px',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          color: 'var(--text-primary)'
                        }}>
                          {feedback.comment || 'Sem comentário'}
                        </td>
                        <td style={{ color: 'var(--text-primary)' }}>
                          {new Date(feedback.date).toLocaleDateString('pt-BR')}
                        </td>
                        <td style={{ textAlign: 'center' }}>
                          <button
                            className="btn"
                            onClick={() => handleOpenDetailsModal(feedback)}
                            style={{
                              padding: '0.5rem',
                              backgroundColor: 'var(--bg-tertiary)',
                              color: 'var(--text-primary)',
                              border: 'none',
                              borderRadius: '4px',
                              cursor: 'pointer'
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

        {/* Details Modal */}
        {detailsModalOpen && viewingFeedback && (
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
                  Detalhes do Feedback
                </h2>
                <button
                  onClick={handleCloseDetailsModal}
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

              <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                {/* Header com nome e estrelas */}
                <div style={{ textAlign: 'center' }}>
                  <h2 style={{
                    color: 'var(--text-primary)',
                    marginBottom: '0.5rem',
                    fontSize: '1.5rem'
                  }}>
                    Feedback de {viewingFeedback.clientName}
                  </h2>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 'var(--space-md)' }}>
                    {renderStars(viewingFeedback.rating)}
                    <span style={{ fontSize: 'var(--text-lg)', fontWeight: '600', color: 'var(--text-primary)' }}>
                      {viewingFeedback.rating} {viewingFeedback.rating === 1 ? 'estrela' : 'estrelas'}
                    </span>
                  </div>
                  <div style={{
                    textAlign: 'center',
                    marginTop: '0.5rem',
                    color: 'var(--text-secondary)',
                    fontSize: '0.9rem'
                  }}>
                    {viewingFeedback.rating === 1 && 'Muito insatisfeito'}
                    {viewingFeedback.rating === 2 && 'Insatisfeito'}
                    {viewingFeedback.rating === 3 && 'Regular'}
                    {viewingFeedback.rating === 4 && 'Satisfeito'}
                    {viewingFeedback.rating === 5 && 'Muito satisfeito'}
                  </div>
                </div>

                {/* Project Name */}
                {viewingFeedback.projectName && (
                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: '1.1rem',
                      fontWeight: '600',
                      color: 'var(--text-primary)',
                      marginBottom: '0.5rem'
                    }}>
                      Projeto
                    </label>
                    <p style={{
                      margin: 0,
                      color: 'var(--text-primary)',
                      fontSize: '1rem',
                      padding: '0.75rem',
                      backgroundColor: 'var(--bg-secondary)',
                      borderRadius: '8px',
                      border: '1px solid var(--border-primary)'
                    }}>
                      {viewingFeedback.projectName}
                    </p>
                  </div>
                )}

                {/* Comment */}
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '1.1rem',
                    fontWeight: '600',
                    color: 'var(--text-primary)',
                    marginBottom: '0.5rem'
                  }}>
                    Comentário
                  </label>
                  <p style={{
                    margin: 0,
                    color: 'var(--text-primary)',
                    lineHeight: '1.6',
                    padding: '1rem',
                    backgroundColor: 'var(--bg-secondary)',
                    borderRadius: '8px',
                    border: '1px solid var(--border-primary)',
                    minHeight: '80px'
                  }}>
                    {viewingFeedback.comment || 'Nenhum comentário foi fornecido.'}
                  </p>
                </div>

                {/* Date */}
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '1.1rem',
                    fontWeight: '600',
                    color: 'var(--text-primary)',
                    marginBottom: '0.5rem'
                  }}>
                    Data do Feedback
                  </label>
                  <p style={{
                    margin: 0,
                    color: 'var(--text-primary)',
                    fontSize: '1rem',
                    padding: '0.75rem',
                    backgroundColor: 'var(--bg-secondary)',
                    borderRadius: '8px',
                    border: '1px solid var(--border-primary)'
                  }}>
                    {new Date(viewingFeedback.date).toLocaleDateString('pt-BR')}
                  </p>
                </div>
              </div>

              <div style={{
                display: 'flex',
                justifyContent: 'flex-end',
                paddingTop: 'var(--space-lg)',
                borderTop: '1px solid var(--border-primary)',
                marginTop: 'var(--space-lg)'
              }}>
                <button
                  onClick={handleCloseDetailsModal}
                  style={{
                    padding: 'var(--space-sm) var(--space-lg)',
                    backgroundColor: '#2563eb',
                    color: 'white',
                    border: 'none',
                    borderRadius: 'var(--radius-md)',
                    cursor: 'pointer',
                    fontSize: 'var(--text-sm)',
                    fontWeight: '500'
                  }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = '#1d4ed8'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = '#2563eb'}
                >
                  Fechar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FeedbackAdmin;
