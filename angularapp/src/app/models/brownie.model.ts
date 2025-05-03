// brownie.model.ts
export interface Brownie {
  id?: number; // Optional while adding
  name: string;
  description?: string;
  price: number | null;
  imageUrl?: string;
  stockCount: number;
}
