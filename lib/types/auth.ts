// Tipos para autenticación y usuarios
export interface User {
  id: string;
  nombre: string;
  email: string;
  telefono: string;
  rol: "conanp" | "prestador";
  activo: boolean;
  avatar_url?: string;
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
    accessToken: string;
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

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  isRefreshing: boolean;
  login: (credentials: LoginRequest) => Promise<User>;
  register: (userData: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
  validateInvitation: (codigo: string) => Promise<boolean>;
  refreshAccessToken: () => Promise<string>;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (data: ResetPasswordRequest) => Promise<void>;
  changePassword: (data: ChangePasswordRequest) => Promise<void>;
}

// Tipos para gestión de avatares
export interface AvatarInfo {
  has_avatar: boolean;
  avatar_url?: string;
  image_info?: {
    width: number;
    height: number;
    format: string;
    size: number;
  };
}

export interface AvatarStats {
  total_uploads: number;
  total_storage: number;
  total_bandwidth: number;
  usage_percentage: number;
}

export interface UploadAvatarRequest {
  image: File;
}

export interface UploadAvatarResponse {
  status: "success" | "error";
  message: string;
  data?: {
    user: User;
    avatar: {
      url: string;
      uploaded_at: string;
    };
  };
  error?: string;
}

export interface DeleteAvatarResponse {
  status: "success" | "error";
  message: string;
  data?: {
    user: User;
  };
  error?: string;
}

export interface GenerateDefaultAvatarResponse {
  status: "success" | "error";
  message: string;
  data?: {
    user: User;
    avatar: {
      url: string;
      type: "default";
      generated_at: string;
    };
  };
  error?: string;
}

export interface AvatarInfoResponse {
  status: "success" | "error";
  message: string;
  data?: AvatarInfo;
  error?: string;
}

export interface AvatarStatsResponse {
  status: "success" | "error";
  message: string;
  data?: AvatarStats;
  error?: string;
}

export interface AvatarHealthResponse {
  status: "success" | "error";
  message: string;
  data?: {
    cloudinary_connected: boolean;
    service_status: "healthy" | "degraded" | "down";
  };
  error?: string;
}
