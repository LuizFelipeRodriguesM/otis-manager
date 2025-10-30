import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, Send, ArrowLeft } from 'lucide-react';
import { installationsMockData } from '../mocks/installations.js';
import { useAuth } from '../contexts/AuthContext';

const ClientFeedback = () => {
  const navigate = useNavigate();
  const { logout, userEmail } = useAuth();
  const [formData, setFormData] = useState({
    clientName: '',
    projectName: '',
    rating: 5,
    comment: ''
  });
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    // Pre-fill client name with user email if available
    if (userEmail && !formData.clientName) {
      setFormData(prev => ({
        ...prev,
        clientName: userEmail.split('@')[0] // Use part before @ as name
      }));
    }
  }, [userEmail, formData.clientName]);

  const handleRatingChange = (rating) => {
    setFormData({ ...formData, rating });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Create feedback object
    const feedback = {
      id: Date.now(), // Simple ID generation
      clientName: formData.clientName,
      clientId: `CLIENT-${Date.now()}`, // Generate a simple client ID
      country: 'Brasil', // Default country for clients
      projectName: formData.projectName,
      rating: formData.rating,
      comment: formData.comment,
      status: 'Pendente',
      date: new Date().toISOString().split('T')[0],
      responsible: 'Sistema',
      response: null
    };

    // Get existing feedbacks and add new one
    const existingFeedbacks = JSON.parse(localStorage.getItem('otis_feedbacks') || '[]');
    const updatedFeedbacks = [...existingFeedbacks, feedback];
    localStorage.setItem('otis_feedbacks', JSON.stringify(updatedFeedbacks));

    setSubmitted(true);

    // Auto-logout after 5 seconds
    setTimeout(() => {
      logout();
      navigate('/login');
    }, 5000);
  };

  const renderStars = (rating, interactive = false, onChange = null) => {
    return (
      <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={interactive ? 32 : 28}
            style={{
              color: star <= rating ? '#fbbf24' : '#e5e7eb',
              cursor: interactive ? 'pointer' : 'default',
              fill: star <= rating ? '#fbbf24' : 'none',
              transition: 'all 0.2s ease'
            }}
            onClick={interactive ? () => onChange(star) : undefined}
          />
        ))}
      </div>
    );
  };

  if (submitted) {
    return (
      <div className="page-content" style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'var(--bg-secondary)'
      }}>
        <div style={{
          backgroundColor: 'var(--bg-primary)',
          padding: '3rem',
          borderRadius: '12px',
          border: '1px solid var(--border)',
          textAlign: 'center',
          maxWidth: '500px',
          boxShadow: 'var(--shadow-lg)'
        }}>
          <div style={{
            fontSize: '4rem',
            color: '#22c55e',
            marginBottom: '1rem'
          }}>
            ✓
          </div>
          <h2 style={{
            color: 'var(--text-primary)',
            marginBottom: '1rem',
            fontSize: '1.5rem'
          }}>
            Feedback Enviado com Sucesso!
          </h2>
          <p style={{
            color: 'var(--text-secondary)',
            marginBottom: '2rem',
            lineHeight: '1.6'
          }}>
            Obrigado pelo seu feedback! Ele será analisado pela nossa equipe e usado para melhorar nossos serviços.
          </p>
          <p style={{
            color: 'var(--text-secondary)',
            fontSize: '0.875rem'
          }}>
            Você será redirecionado para a tela de login em alguns segundos...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-content" style={{ minHeight: '100vh' }}>
      <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
          <button
            onClick={() => {
              logout();
              navigate('/login');
            }}
            style={{
              position: 'absolute',
              top: '2rem',
              left: '2rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              color: 'var(--text-secondary)',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '0.5rem',
              borderRadius: '6px'
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = 'var(--bg-secondary)'}
            onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
          >
            <ArrowLeft size={16} />
            Sair
          </button>

          <h1 style={{
            color: 'var(--text-primary)',
            marginBottom: '0.5rem',
            fontSize: '2rem'
          }}>
            Feedback do Cliente
          </h1>
          <p style={{
            color: 'var(--text-secondary)',
            fontSize: '1.1rem'
          }}>
            Conte-nos sobre sua experiência com nossos serviços
          </p>
        </div>

        {/* Feedback Form */}
        <div style={{
          backgroundColor: 'var(--bg-primary)',
          padding: '2.5rem',
          borderRadius: '12px',
          border: '1px solid var(--border)',
          boxShadow: 'var(--shadow-md)'
        }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

            {/* Client Name */}
            <div>
              <label style={{
                display: 'block',
                fontSize: '1.1rem',
                fontWeight: '600',
                color: 'var(--text-primary)',
                marginBottom: '1rem'
              }}>
                Seu Nome
              </label>
              <input
                type="text"
                value={formData.clientName}
                onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                className="input"
                style={{
                  width: '100%',
                  padding: '1rem',
                  fontSize: '1rem',
                  borderRadius: '8px'
                }}
                placeholder="Digite seu nome completo"
                required
              />
            </div>

            {/* Project Name */}
            <div>
              <label style={{
                display: 'block',
                fontSize: '1.1rem',
                fontWeight: '600',
                color: 'var(--text-primary)',
                marginBottom: '1rem'
              }}>
                Nome do Projeto (Opcional)
              </label>
              <input
                type="text"
                value={formData.projectName}
                onChange={(e) => setFormData({ ...formData, projectName: e.target.value })}
                className="input"
                style={{
                  width: '100%',
                  padding: '1rem',
                  fontSize: '1rem',
                  borderRadius: '8px'
                }}
                placeholder="Ex: Edifício Central Plaza, Shopping Boulevard..."
              />
            </div>

            {/* Rating */}
            <div>
              <label style={{
                display: 'block',
                fontSize: '1.1rem',
                fontWeight: '600',
                color: 'var(--text-primary)',
                marginBottom: '1rem',
                textAlign: 'center'
              }}>
                Como você avalia nossa prestação de serviço?
              </label>
              {renderStars(formData.rating, true, handleRatingChange)}
              <div style={{
                textAlign: 'center',
                marginTop: '1rem',
                color: 'var(--text-secondary)',
                fontSize: '0.9rem'
              }}>
                {formData.rating === 1 && 'Muito insatisfeito'}
                {formData.rating === 2 && 'Insatisfeito'}
                {formData.rating === 3 && 'Regular'}
                {formData.rating === 4 && 'Satisfeito'}
                {formData.rating === 5 && 'Muito satisfeito'}
              </div>
            </div>

            {/* Comment */}
            <div>
              <label style={{
                display: 'block',
                fontSize: '1.1rem',
                fontWeight: '600',
                color: 'var(--text-primary)',
                marginBottom: '1rem'
              }}>
                Compartilhe sua experiência (opcional)
              </label>
              <textarea
                value={formData.comment}
                onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                rows={6}
                className="input"
                style={{
                  width: '100%',
                  padding: '1rem',
                  fontSize: '1rem',
                  borderRadius: '8px',
                  resize: 'vertical',
                  minHeight: '120px'
                }}
                placeholder="Conte-nos mais sobre sua experiência, pontos positivos, sugestões de melhoria..."
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              style={{
                padding: '1rem 2rem',
                backgroundColor: '#2563eb',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '1.1rem',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                marginTop: '1rem',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#1d4ed8'}
              onMouseLeave={(e) => e.target.style.backgroundColor = '#2563eb'}
            >
              <Send size={20} />
              Enviar Feedback
            </button>
          </form>
        </div>

        {/* Info Section */}
        <div style={{
          marginTop: '2rem',
          padding: '1.5rem',
          backgroundColor: 'var(--bg-secondary)',
          borderRadius: '8px',
          border: '1px solid var(--border)'
        }}>
          <h3 style={{
            color: 'var(--text-primary)',
            marginBottom: '0.5rem',
            fontSize: '1rem'
          }}>
            ℹ️ Sobre seu feedback
          </h3>
          <ul style={{
            color: 'var(--text-secondary)',
            margin: 0,
            paddingLeft: '1.5rem',
            lineHeight: '1.6',
            fontSize: '0.9rem'
          }}>
            <li>Seu feedback é anônimo e será usado apenas para melhorar nossos serviços</li>
            <li>A equipe técnica analisará seu comentário e poderá entrar em contato se necessário</li>
            <li>Feedbacks ajudam-nos a oferecer um serviço ainda melhor para todos os clientes</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ClientFeedback;
