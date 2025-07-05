export interface GrapeVariety {
    name: string;
    percentage?: number | null;
  }
  
export interface FormValues {
    selectedVarieties: GrapeVariety[];
  }