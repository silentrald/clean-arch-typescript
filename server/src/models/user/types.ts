export interface UserSchema {
  username: string;
  password?: string;
  email: string;
  fname: string;
  lname: string;
}

export interface User {
  getUsername: () => string;
  getPassword: () => string | undefined;
  getEmail: () => string;
  getFname: () => string;
  getLname: () => string;
  
  removePassword: () => void;
}