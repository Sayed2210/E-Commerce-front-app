export const mockLoginResponse = {
  user: {
    id: '123',
    email: 'test@example.com',
    firstName: 'Test',
    lastName: 'User',
    roles: ['CUSTOMER'],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  accessToken: 'mock-access-token',
  refreshToken: 'mock-refresh-token'
}

export const mockAdminLoginResponse = {
  user: {
    id: '456',
    email: 'admin@example.com',
    firstName: 'Admin',
    lastName: 'User',
    roles: ['ADMIN'],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  accessToken: 'mock-admin-access-token',
  refreshToken: 'mock-admin-refresh-token'
}

export const mockErrorResponse = {
  statusCode: 401,
  message: 'Invalid credentials'
}

export const mockValidationErrorResponse = {
  statusCode: 400,
  message: 'Validation failed',
  errors: {
    email: ['Invalid email format'],
    password: ['Password too short']
  }
}
