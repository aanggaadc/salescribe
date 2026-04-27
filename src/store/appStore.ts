import { create } from "zustand";
import { ProductInput, SalesPageOutput, Template } from "@/types";

interface AppStore {
  // Input state
  input: Partial<ProductInput>;
  setInput: (data: Partial<ProductInput>) => void;
  resetInput: () => void;

  // Output state
  output: SalesPageOutput | null;
  setOutput: (data: SalesPageOutput | null) => void;

  // UI state
  isGenerating: boolean;
  setIsGenerating: (val: boolean) => void;

  // Template
  selectedTemplate: Template;
  setSelectedTemplate: (template: Template) => void;

  // Current page ID (for editing)
  currentPageId: string | null;
  setCurrentPageId: (id: string | null) => void;
}

const initialInput: Partial<ProductInput> = {
  productName: "",
  description: "",
  features: [""],
  targetAudience: "",
  price: "",
  uniqueSellingPoints: [""],
};

export const useAppStore = create<AppStore>((set) => ({
  input: initialInput,
  setInput: (data) =>
    set((state) => ({ input: { ...state.input, ...data } })),
  resetInput: () => set({ input: initialInput }),

  output: null,
  setOutput: (data) => set({ output: data }),

  isGenerating: false,
  setIsGenerating: (val) => set({ isGenerating: val }),

  selectedTemplate: "modern",
  setSelectedTemplate: (template) => set({ selectedTemplate: template }),

  currentPageId: null,
  setCurrentPageId: (id) => set({ currentPageId: id }),
}));