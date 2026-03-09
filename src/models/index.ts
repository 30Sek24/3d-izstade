export interface User {
  id: string;
  email: string;
  created_at: string;
  plan: 'free' | 'pro' | 'enterprise';
  company_id?: string;
}

export interface Company {
  id: string;
  name: string;
  country: string;
  vat?: string;
  created_at: string;
}

export interface Client {
  id: string;
  company_id: string;
  name: string;
  phone?: string;
  email?: string;
  address?: string;
}

export interface Project {
  id: string;
  company_id: string;
  client_id: string;
  title: string;
  status: 'draft' | 'active' | 'completed' | 'cancelled';
  created_at: string;
}

export interface Task {
  id: string;
  project_id: string;
  type: string;
  description: string;
  cost: number;
  hours: number;
}

export interface Material {
  id: string;
  project_id: string;
  name: string;
  quantity: number;
  price: number;
}

export interface Quote {
  id: string;
  project_id: string;
  total_price: number;
  created_at: string;
  status: 'draft' | 'sent' | 'accepted';
}

export interface Invoice {
  id: string;
  project_id: string;
  amount: number;
  status: 'unpaid' | 'paid';
  created_at: string;
}

export interface Payment {
  id: string;
  project_id: string;
  amount: number;
  status: 'pending' | 'success';
  created_at: string;
}
