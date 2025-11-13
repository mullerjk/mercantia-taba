// Entity types for the application

export interface Entity {
  id: string;
  type: string;
  properties: Record<string, any>;
  createdAt: string;
  verifications: Verification[];
  trustScore?: number;
}

export interface Person extends Entity {
  type: 'Person';
  properties: {
    name: string;
    email?: string;
    telephone?: string;
    birthDate?: string;
    givenName?: string;
    familyName?: string;
    gender?: string;
    address?: string;
    jobTitle?: string;
    worksFor?: string;
    image?: string;
    knowsAbout?: string[];
  };
}

export interface Product extends Entity {
  type: 'Product';
  properties: {
    name: string;
    description?: string;
    brand?: string;
    sku?: string;
    category?: string;
    image?: string;
    price?: {
      value: number;
      currency: string;
    };
  };
}

export interface Organization extends Entity {
  type: 'Organization';
  properties: {
    name: string;
    legalName?: string;
    description?: string;
    email?: string;
    telephone?: string;
    address?: string;
    logo?: string;
    foundingDate?: string;
    url?: string;
    orgType?: string;
  };
}

export interface Verification {
  method: string;
  verifiedBy: string;
  timestamp: string;
  expiresAt?: string;
  proof?: {
    type: string;
    url?: string;
    hash?: string;
  };
}

export interface Action {
  id: string;
  type: string;
  agent: string;
  object: string;
  startTime?: string;
  endTime?: string;
  location?: string;
  proofs?: Proof[];
  witnesses?: string[];
  createdAt: string;
  trustScore?: number;
}

export interface ConsumeAction extends Action {
  type: 'ConsumeAction';
}

export interface BuyAction extends Action {
  type: 'BuyAction';
}

export interface Proof {
  type: string;
  url?: string;
  hash?: string;
  timestamp?: string;
  verifiedBy?: string;
}
