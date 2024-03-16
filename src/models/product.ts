export interface Product {
  name: string;
  price: string;
  url: string;
  description?: string;
  availableSizes?: string[];
  imageUrl?: string;
}

export const createProduct = (
  name: string,
  price: string,
  url: string,
  description?: string,
  availableSizes?: string[],
  imageUrl?: string
): Product => ({
  name,
  price,
  url,
  description,
  availableSizes,
  imageUrl,
});