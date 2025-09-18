export interface ApiResponse<T> {
  status: string;
  code: number;
  total: number;
  data: T[];
}

export interface Person {
  firstname: string;
  lastname: string;
  email: string;
  phone?: string;
  birthday?: string;
  gender?: string;
  website?: string;
  image?: string;
  [key: string]: any;
}
