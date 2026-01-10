
export enum UserRole {
  ADMIN = 'ADMIN',
  CLIENTE = 'CLIENTE'
}

export enum ServiceStatus {
  PENDENTE = 'PENDENTE',
  EM_ANALISE = 'EM_ANALISE',
  PROCESSANDO = 'PROCESSANDO',
  AGUARDANDO_DOCUMENTO = 'AGUARDANDO_DOCUMENTO',
  CONCLUIDO = 'CONCLUIDO',
  CANCELADO = 'CANCELADO'
}

export type ServiceType = 'MEI' | 'IRPF' | 'CPF' | 'PF_COMUM' | 'FINANCEIRO_PERSO' | 'OUTROS';

export interface Document {
  id: string;
  name: string;
  status: 'ENVIADO' | 'EM_ANALISE' | 'APROVADO' | 'REJEITADO';
  uploadDate: string;
  url: string;
}

export interface CommunicationLog {
  id: string;
  date: string;
  message: string;
  sender: 'ADMIN' | 'SISTEMA';
}

export interface FaqItem {
  id: string;
  category: string;
  question: string;
  answer: string;
  isActive: boolean;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  interval: 'mensal' | 'trimestral' | 'anual';
  features: string[];
  isActive: boolean;
  recommended?: boolean;
  checkoutUrl?: string;
}

export interface CompanyIdentity {
  name: string;
  slogan: string;
  logoUrl?: string;
  heroImageUrl?: string;
  primaryColor: string;
  email: string;
  phone: string;
  whatsapp: string;
  address?: string;
  socialLinks: {
    instagram?: string;
    linkedin?: string;
    facebook?: string;
  };
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  cpfCnpj?: string;
  phone?: string;
  createdAt: string;
  activePlanId?: string;
  isPlanActive?: boolean; // Ativação manual pelo admin
  termsAcceptedAt?: string;
}

export interface ServiceRequest {
  id: string;
  clientId: string;
  clientName: string;
  type: ServiceType;
  description: string;
  status: ServiceStatus;
  value: number;
  createdAt: string;
  updatedAt: string;
  invoiceId?: string;
  documents: Document[];
  history: CommunicationLog[];
  termsAccepted: boolean;
  deadline?: string;
}

export interface InternalAlert {
  id: string;
  type: 'PENDENCIA' | 'PRAZO' | 'CONCLUSAO';
  message: string;
  serviceId: string;
  clientId: string;
  createdAt: string;
  resolved: boolean;
}

export interface CommunicationTemplate {
  id: string;
  title: string;
  content: string; // Ex: "Olá [NOME], o serviço [SERVICO] está [STATUS]..."
}

export interface InvoiceData {
  fullName: string;
  cpfCnpj: string;
  address: string;
  email: string;
  city: string;
  consentDate: string;
  confirmed: boolean;
}

export interface Invoice {
  id: string;
  serviceId: string;
  clientId: string;
  issueDate: string;
  value: number;
  status: 'EMITIDA' | 'CANCELADA' | 'SUBSTITUIDA';
  fileUrl: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}
