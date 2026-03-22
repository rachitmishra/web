export interface Review {
  id?: string;
  productId: string;
  userId: string;
  userName: string;
  rating: number; // 3, 2, 1
  comment: string;
  createdAt?: any;
}
