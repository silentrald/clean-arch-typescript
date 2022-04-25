interface User {
  id: string;
  username: string;
  email: string;
  fname: string;
  lname: string;
}

export interface ARequest {
  body: Record<string, any>;
  params: Record<string, any>;
  query: Record<string, any>;
  headers: Record<string, any>;
  csrfToken: () => string;

  // Session Handling
  sessionId?: string;
  session: {
    user: User;
  };
}

export interface AResponse {
  status: number;
  cookies?: { [key: string]: string };
  data?: Record<string, any> | string;
  errors?: string[];
}