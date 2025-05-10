import swaggerJsdoc from 'swagger-jsdoc'
import swaggerUi from 'swagger-ui-express'

const getServerUrl = () => {
  const port = process.env.PORT || 3333
  const host = process.env.HOST || 'localhost'
  return `http://${host}:${port}`
}

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Aiqfome API',
      version: '1.0.0',
      description: 'API para gerenciamento de clientes e produtos',
    },
    servers: [
      {
        url: getServerUrl(),
        description: 'Servidor atual',
      },
    ],
    components: {
      securitySchemes: {
        jwt: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        ValidationError: {
          type: 'object',
          properties: {
            message: {
              type: 'string',
              example: 'Invalid Data',
            },
            errors: {
              type: 'array',
              items: {
                type: 'string',
              },
              example: ['Invalid email'],
            },
          },
        },
        Error: {
          type: 'object',
          properties: {
            message: {
              type: 'string',
              example: 'Resource not found',
            },
            error: {
              type: 'string',
              example: 'ResourceNotFoundError',
            },
          },
        },
        Client: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
            },
            name: {
              type: 'string',
            },
            email: {
              type: 'string',
              format: 'email',
            },
            favoriteProducts: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/FavoriteProduct',
              },
            },
          },
        },
        FavoriteProduct: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
            },
            productId: {
              type: 'string',
            },
            title: {
              type: 'string',
            },
            imageUrl: {
              type: 'string',
            },
            price: {
              type: 'number',
            },
            reviewScore: {
              type: 'number',
            },
            reviewCount: {
              type: 'number',
            },
          },
        },
      },
    },
  },
  apis: ['./src/infra/http/controllers/**/*.ts'],
}

export const swaggerSpec = swaggerJsdoc(options)
export const swaggerUiSetup: ReturnType<typeof swaggerUi.setup> =
  swaggerUi.setup(swaggerSpec)
