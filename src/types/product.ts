export type ProductCategory =| 'elektronik' | 'kitap' | 'giyim' | 'ev' | 'oyuncak' | 'mobilya' | 'aksesuar';
 

export interface RawProduct {
  id: string;  
  name: string;
  price: string;  
  stock: number;  
  category: string | string[];    
  description?: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;  
  stock: number;
  category: ProductCategory;  
  description?: string;   
}
