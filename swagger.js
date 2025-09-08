

// swagger.js
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'El Bossely Bikes API',
      version: '1.0.0',
      description: 'API documentation for El Bossely Bikes backend',
    },
    servers: [
      {
        url: 'http://localhost:5000',
      },
    ],
  },
  // Path to the API docs
  apis: ['./Docs/authDocs.yaml','./Docs/ordersDocs.yaml','./Docs/bikesDocs.yaml'], // <-- This tells Swagger where to find JSDoc comments
};

export const swaggerSpec = swaggerJsdoc(options);
export { swaggerUi };
