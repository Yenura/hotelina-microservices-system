const PORT = process.env.PORT || 5004;

const swaggerSpec = {
  openapi: '3.0.0',
  info: {
    title: 'Restaurant Service API',
    version: '1.0.0',
    description: 'API documentation for the Hotelina Restaurant Service',
  },
  servers: [
    {
      url: `http://localhost:${PORT}`,
      description: 'Local Restaurant Service',
    },
  ],
  components: {
    schemas: {
      Food: {
        type: 'object',
        required: ['name', 'category', 'price', 'preparationTimeMinutes', 'availabilityStatus'],
        properties: {
          _id: {
            type: 'string',
            example: '640a1f2e6b7e8c00123d4567',
          },
          name: {
            type: 'string',
            example: 'Margherita Pizza',
          },
          category: {
            type: 'string',
            example: 'Pizza',
          },
          description: {
            type: 'string',
            example: 'Classic pizza with tomato sauce and mozzarella',
          },
          price: {
            type: 'number',
            example: 12.5,
          },
          availabilityStatus: {
            type: 'string',
            enum: ['available', 'unavailable'],
            example: 'available',
          },
          imageUrl: {
            type: 'string',
            example: 'https://example.com/images/margherita.jpg',
          },
          preparationTimeMinutes: {
            type: 'number',
            example: 20,
          },
          createdAt: {
            type: 'string',
            format: 'date-time',
          },
          updatedAt: {
            type: 'string',
            format: 'date-time',
          },
        },
      },
      Order: {
        type: 'object',
        required: ['guestName', 'roomNumber', 'items', 'totalAmount', 'orderStatus'],
        properties: {
          _id: {
            type: 'string',
            example: '640a1f2e6b7e8c00123d4568',
          },
          guestName: {
            type: 'string',
            example: 'John Doe',
          },
          roomNumber: {
            type: 'string',
            example: '502',
          },
          items: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                foodId: {
                  type: 'string',
                  example: '640a1f2e6b7e8c00123d4567',
                },
                quantity: {
                  type: 'number',
                  example: 2,
                },
              },
            },
          },
          totalAmount: {
            type: 'number',
            example: 25.0,
          },
          orderStatus: {
            type: 'string',
            enum: ['pending', 'preparing', 'delivered', 'cancelled'],
            example: 'pending',
          },
          notes: {
            type: 'string',
            example: 'Please deliver after 7 PM',
          },
          orderedAt: {
            type: 'string',
            format: 'date-time',
          },
          deliveredAt: {
            type: 'string',
            format: 'date-time',
          },
          createdAt: {
            type: 'string',
            format: 'date-time',
          },
          updatedAt: {
            type: 'string',
            format: 'date-time',
          },
        },
      },
    },
  },
  paths: {},
};

module.exports = swaggerSpec;
