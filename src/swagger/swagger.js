const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Rest Escalável com Node.js e MongoDB',
      version: '1.0.0',
      description: 'API de Eventos com Autenticação e Gerenciamento Completo',
      contact: {
        name: 'API Support',
        email: 'support@api.com'
      }
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Servidor de Desenvolvimento'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Token JWT obrigatório para rotas protegidas'
        }
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              description: 'ID único do usuário'
            },
            name: {
              type: 'string',
              description: 'Nome completo do usuário'
            },
            email: {
              type: 'string',
              description: 'Email único do usuário'
            },
            password: {
              type: 'string',
              description: 'Senha criptografada (nunca retornada)'
            }
          },
          required: ['name', 'email', 'password'],
          example: {
            name: 'João Silva',
            email: 'joao@example.com',
            password: 'senha123'
          }
        },
        Event: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              description: 'ID único do evento'
            },
            title: {
              type: 'string',
              description: 'Título do evento'
            },
            description: {
              type: 'string',
              description: 'Descrição detalhada do evento'
            },
            date: {
              type: 'string',
              format: 'date-time',
              description: 'Data e hora do evento'
            },
            participants: {
              type: 'array',
              items: {
                type: 'string'
              },
              description: 'Lista de participantes do evento'
            }
          },
          required: ['title'],
          example: {
            title: 'Conferência Tech 2026',
            description: 'Grande conferência de tecnologia',
            date: '2026-07-15T10:00:00Z',
            participants: ['participant1@example.com', 'participant2@example.com']
          }
        },
        LoginResponse: {
          type: 'object',
          properties: {
            token: {
              type: 'string',
              description: 'Token JWT para autenticação'
            }
          },
          example: {
            token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
          }
        },
        Error: {
          type: 'object',
          properties: {
            erro: {
              type: 'string',
              description: 'Mensagem de erro'
            }
          },
          example: {
            erro: 'Dados inválidos'
          }
        }
      }
    }
  },
  apis: ['./src/routes/routes.js']
};

const specs = swaggerJsdoc(options);

module.exports = specs;