module.exports = {
  HTTP_STATUS: {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    NOT_FOUND: 404,
    CONFLICT: 409,
    INTERNAL_ERROR: 500,
  },
  ERROR_MESSAGES: {
    USER_EXISTS: 'User already exists with this email',
    INVALID_CREDENTIALS: 'Invalid email or password',
    USER_NOT_FOUND: 'User not found',
    TOKEN_EXPIRED: 'Token has expired',
    NO_TOKEN: 'No token provided',
    INVALID_TOKEN: 'Invalid token',
    INTERNAL_ERROR: 'Internal server error',
    VALIDATION_ERROR: 'Validation error',
  },
  JWT: {
    EXPIRE: process.env.JWT_EXPIRE || '7d',
  },
  SERVICE: {
    NAME: 'auth-service',
    PORT: process.env.PORT || 8001,
  },
};
