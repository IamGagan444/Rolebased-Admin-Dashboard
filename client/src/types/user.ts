export interface User {
  username: string;
  password: string;
  email: string;
  role: string | null;
  createdBy:string|null
}

export interface UserLogin {
  username: string;
  password: string;
}

export interface UserRegister {
  username: string;
  password: string;
  email: string;
}
