export interface User {
  username: string;
  password: string;
  email: string;
  role: string | null;
  createdBy: string | null;
  _id: string | null;
}

export interface UserLogin {
  email: string;
  password: string;
}

export interface UserRegister {
  username: string;
  password: string;
  email: string;
}
export interface Errors {
  success: boolean;
  status: number;
  message: string;
}
