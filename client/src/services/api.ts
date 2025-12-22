// Mock API service
const apiClient = {
  getCurrentUser: async () => {
    return { user: null };
  },
  login: async (credentials: any) => {
    return { user: { id: '1', email: credentials.email, name: 'Demo User' } };
  },
  register: async (userData: any) => {
    return { user: { id: '1', email: userData.email, name: userData.name || 'New User' } };
  },
  logout: async () => {
    return { success: true };
  },
  updateProfile: async (data: any) => {
    return { user: { id: '1', ...data } };
  }
};

export default apiClient;
