export interface ProductInput {
  productName: string;
  description: string;
  features: string[];
  targetAudience: string;
  price: string;
  uniqueSellingPoints: string[];
}

export interface SalesPageOutput {
  headline: string;
  subheadline: string;
  description: string;
  benefits: string[];
  features: string[];
  socialProof: string;
  pricing: string;
  cta: string;
  painPoints?: string[];
  guarantee?: string;
}

export interface SavedPage {
  id: string;
  userId: string;
  productName: string;
  inputData: ProductInput;
  outputData: SalesPageOutput;
  template: string;
  createdAt: string;
  updatedAt: string;
}

export interface SavedPageRaw {
  id: string;
  userId: string;
  productName: string;
  inputData: string;
  outputData: string;
  template: string;
  createdAt: string;
  updatedAt: string;
}

export type Template = "modern" | "bold" | "minimal";
