const swaggerJsdoc = require('swagger-jsdoc');

const secured = [{ bearerAuth: [], userIdHeader: [] }];

const jsonBody = (schemaRef, example) => ({
  required: true,
  content: {
    'application/json': {
      schema: { $ref: schemaRef },
      ...(example ? { example } : {})
    }
  }
});

const idParam = {
  in: 'path',
  name: 'id',
  required: true,
  schema: { type: 'integer' },
  description: 'ID do registro'
};

const crudPaths = ({ basePath, tag, schema, inputSchema, createSummary, updateSummary }) => ({
  [basePath]: {
    get: {
      tags: [tag],
      summary: `Listar ${tag.toLowerCase()}`,
      security: secured,
      responses: {
        200: {
          description: 'Lista retornada com sucesso',
          content: {
            'application/json': {
              schema: {
                type: 'array',
                items: { $ref: schema }
              }
            }
          }
        },
        401: { description: 'Token ausente ou invalido' },
        403: { description: 'ID do usuario ausente ou divergente' }
      }
    },
    post: {
      tags: [tag],
      summary: createSummary,
      security: secured,
      requestBody: jsonBody(inputSchema),
      responses: {
        201: {
          description: 'Registro criado com sucesso',
          content: {
            'application/json': {
              schema: { $ref: schema }
            }
          }
        },
        400: { description: 'Dados invalidos' },
        401: { description: 'Token ausente ou invalido' },
        403: { description: 'ID do usuario ausente ou divergente' }
      }
    }
  },
  [`${basePath}/{id}`]: {
    get: {
      tags: [tag],
      summary: `Buscar ${tag.toLowerCase()} por ID`,
      security: secured,
      parameters: [idParam],
      responses: {
        200: {
          description: 'Registro encontrado',
          content: {
            'application/json': {
              schema: { $ref: schema }
            }
          }
        },
        401: { description: 'Token ausente ou invalido' },
        403: { description: 'ID do usuario ausente ou divergente' },
        404: { description: 'Registro nao encontrado' }
      }
    },
    put: {
      tags: [tag],
      summary: updateSummary,
      security: secured,
      parameters: [idParam],
      requestBody: jsonBody(inputSchema),
      responses: {
        200: {
          description: 'Registro atualizado',
          content: {
            'application/json': {
              schema: { $ref: schema }
            }
          }
        },
        400: { description: 'Dados invalidos' },
        401: { description: 'Token ausente ou invalido' },
        403: { description: 'ID do usuario ausente ou divergente' },
        404: { description: 'Registro nao encontrado' }
      }
    },
    delete: {
      tags: [tag],
      summary: `Remover ${tag.toLowerCase()} por ID`,
      security: secured,
      parameters: [idParam],
      responses: {
        200: { description: 'Registro removido' },
        400: { description: 'Registro possui vinculos' },
        401: { description: 'Token ausente ou invalido' },
        403: { description: 'ID do usuario ausente ou divergente' },
        404: { description: 'Registro nao encontrado' }
      }
    }
  }
});

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Loja - MySQL',
      version: '2.0.0',
      description: 'API REST com autenticacao JWT e persistencia relacional MySQL'
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Servidor local'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Informe apenas o token JWT, sem escrever Bearer manualmente'
        },
        userIdHeader: {
          type: 'apiKey',
          in: 'header',
          name: 'x-user-id',
          description: 'ID do usuario autenticado, igual ao id_usuario retornado no login'
        }
      },
      schemas: {
        RegisterRequest: {
          type: 'object',
          required: ['nome', 'nick', 'senha'],
          properties: {
            nome: { type: 'string', maxLength: 45, example: 'Usuario Teste' },
            nick: { type: 'string', maxLength: 15, example: 'teste01' },
            senha: { type: 'string', maxLength: 90, example: '123456' }
          }
        },
        LoginRequest: {
          type: 'object',
          required: ['nick', 'senha'],
          properties: {
            nick: { type: 'string', example: 'teste01' },
            senha: { type: 'string', example: '123456' }
          }
        },
        LoginResponse: {
          type: 'object',
          properties: {
            token: { type: 'string' },
            usuario: {
              type: 'object',
              properties: {
                id_usuario: { type: 'integer', example: 1 },
                nome: { type: 'string', example: 'Usuario Teste' },
                nick: { type: 'string', example: 'teste01' }
              }
            }
          }
        },
        Usuario: {
          type: 'object',
          properties: {
            id_usuario: { type: 'integer', example: 1 },
            nome: { type: 'string', example: 'Usuario Teste' },
            nick: { type: 'string', example: 'teste01' }
          }
        },
        CategoriaInput: {
          type: 'object',
          required: ['nome'],
          properties: {
            nome: { type: 'string', example: 'Perifericos' }
          }
        },
        Categoria: {
          allOf: [
            { $ref: '#/components/schemas/CategoriaInput' },
            {
              type: 'object',
              properties: {
                id_categoria: { type: 'integer', example: 1 }
              }
            }
          ]
        },
        ProdutoInput: {
          type: 'object',
          required: ['nome', 'valor', 'categorias_id_categoria'],
          properties: {
            nome: { type: 'string', example: 'Mouse USB' },
            valor: { type: 'number', example: 59.9 },
            estoque: { type: 'integer', example: 10 },
            categorias_id_categoria: { type: 'integer', example: 5 }
          }
        },
        Produto: {
          allOf: [
            { $ref: '#/components/schemas/ProdutoInput' },
            {
              type: 'object',
              properties: {
                id_produto: { type: 'integer', example: 1 },
                categoria: { type: 'string', example: 'Acessorio' }
              }
            }
          ]
        },
        ClienteInput: {
          type: 'object',
          required: ['nome', 'telefone'],
          properties: {
            nome: { type: 'string', example: 'Cliente Teste' },
            telefone: { type: 'string', example: '51999999999' },
            status: { type: 'string', enum: ['bom', 'medio', 'ruim'], example: 'medio' }
          }
        },
        Cliente: {
          allOf: [
            { $ref: '#/components/schemas/ClienteInput' },
            {
              type: 'object',
              properties: {
                id_cliente: { type: 'integer', example: 1 }
              }
            }
          ]
        },
        ItemPedidoInput: {
          type: 'object',
          required: ['produtos_id_produto', 'quantidade', 'valor'],
          properties: {
            produtos_id_produto: { type: 'integer', example: 1 },
            quantidade: { type: 'number', example: 1 },
            valor: { type: 'number', example: 1259 }
          }
        },
        PedidoInput: {
          type: 'object',
          required: ['data', 'clientes_id_cliente'],
          properties: {
            data: { type: 'string', format: 'date', example: '2026-07-01' },
            clientes_id_cliente: { type: 'integer', example: 1 },
            itens: {
              type: 'array',
              items: { $ref: '#/components/schemas/ItemPedidoInput' }
            }
          }
        },
        Pedido: {
          allOf: [
            { $ref: '#/components/schemas/PedidoInput' },
            {
              type: 'object',
              properties: {
                id_pedido: { type: 'integer', example: 1 },
                cliente: { type: 'string', example: 'Cliente Teste' }
              }
            }
          ]
        },
        Error: {
          type: 'object',
          properties: {
            erro: { type: 'string', example: 'Token nao informado' }
          }
        }
      }
    },
    paths: {
      '/api/status': {
        get: {
          tags: ['Metadados'],
          summary: 'Status publico da API',
          responses: {
            200: {
              description: 'API online',
              content: {
                'application/json': {
                  example: { versao: '2.0.0', status: 'online' }
                }
              }
            }
          }
        }
      },
      '/api/versao': {
        get: {
          tags: ['Metadados'],
          summary: 'Versao publica da API',
          responses: {
            200: {
              description: 'API online',
              content: {
                'application/json': {
                  example: { versao: '2.0.0', status: 'online' }
                }
              }
            }
          }
        }
      },
      '/register': {
        post: {
          tags: ['Autenticacao'],
          summary: 'Cadastrar usuario na tabela usuarios',
          requestBody: jsonBody('#/components/schemas/RegisterRequest'),
          responses: {
            201: {
              description: 'Usuario cadastrado',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/Usuario' }
                }
              }
            },
            400: { description: 'Dados invalidos' },
            409: { description: 'Nick ja cadastrado' }
          }
        }
      },
      '/login': {
        post: {
          tags: ['Autenticacao'],
          summary: 'Autenticar usuario pela tabela usuarios',
          requestBody: jsonBody('#/components/schemas/LoginRequest'),
          responses: {
            200: {
              description: 'Login realizado',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/LoginResponse' }
                }
              }
            },
            400: { description: 'Dados invalidos' },
            401: { description: 'Senha invalida' },
            404: { description: 'Usuario nao encontrado' }
          }
        }
      },
      ...crudPaths({
        basePath: '/api/categorias',
        tag: 'Categorias',
        schema: '#/components/schemas/Categoria',
        inputSchema: '#/components/schemas/CategoriaInput',
        createSummary: 'Criar categoria',
        updateSummary: 'Atualizar categoria'
      }),
      ...crudPaths({
        basePath: '/api/produtos',
        tag: 'Produtos',
        schema: '#/components/schemas/Produto',
        inputSchema: '#/components/schemas/ProdutoInput',
        createSummary: 'Criar produto',
        updateSummary: 'Atualizar produto'
      }),
      ...crudPaths({
        basePath: '/api/clientes',
        tag: 'Clientes',
        schema: '#/components/schemas/Cliente',
        inputSchema: '#/components/schemas/ClienteInput',
        createSummary: 'Criar cliente',
        updateSummary: 'Atualizar cliente'
      }),
      ...crudPaths({
        basePath: '/api/pedidos',
        tag: 'Pedidos',
        schema: '#/components/schemas/Pedido',
        inputSchema: '#/components/schemas/PedidoInput',
        createSummary: 'Criar pedido',
        updateSummary: 'Atualizar pedido'
      })
    }
  },
  apis: []
};

module.exports = swaggerJsdoc(options);
