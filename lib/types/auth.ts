// Tipos para autenticación y usuarios
export interface User {
  id: string;
  nombre: string;
  email: string;
  telefono: string;
  rol: "conanp" | "prestador";
  activo: boolean;
  created_at: string;
  updated_at: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  status: "success" | "error";
  message: string;
  data: {
    user: User;
    token: string;
    refreshToken: string;
  };
}

export interface RegisterRequest {
  nombre: string;
  email: string;
  password: string;
  telefono: string;
  codigo_invitacion: string;
}

export interface RegisterResponse {
  status: "success" | "error";
  message: string;
  data: {
    user: User;
    token: string;
  };
}

export interface InvitationValidationRequest {
  codigo: string;
}

export interface InvitationValidationResponse {
  status: "success" | "error";
  message: string;
  data: {
    valido: boolean;
    codigo: string;
    fecha_expiracion?: string;
  };
}

// Recuperación de contraseña
export interface ForgotPasswordRequest {
  email: string;
}

export interface ForgotPasswordResponse {
  status: "success" | "error";
  message: string;
  error?: string;
}

export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
  confirmPassword: string;
}

export interface ResetPasswordResponse {
  status: "success" | "error";
  message: string;
  error?: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface ChangePasswordResponse {
  status: "success" | "error";
  message: string;
  error?: string;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (credentials: LoginRequest) => Promise<User>;
  register: (userData: RegisterRequest) => Promise<void>;
  logout: () => void;
  validateInvitation: (codigo: string) => Promise<boolean>;
  refreshToken: () => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (data: ResetPasswordRequest) => Promise<void>;
  changePassword: (data: ChangePasswordRequest) => Promise<void>;
}
