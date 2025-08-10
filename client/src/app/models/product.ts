export interface Product {
  _id: string;
  name: string;
  price: number;
  description: string;
  image: string;
  likes?: number;
  bestSeller?: boolean;
  _ownerId?: string;
  _createdOn?: number;
  _updatedOn?: number;
}
