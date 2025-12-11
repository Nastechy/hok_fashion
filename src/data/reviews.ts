export interface Review {
  id: string;
  name: string;
  rating: number;
  comment: string;
  product: string;
  date: string;
  verified: boolean;
}

export const reviews: Review[] = [
  {
    id: '1',
    name: 'Adaeze Okafor',
    rating: 5,
    comment: 'Absolutely love this tote! The stitching is neat and it fits everything I need for work and Sunday service.',
    product: 'Classic Black Tote',
    date: '2024-03-12',
    verified: true
  },
  {
    id: '2',
    name: 'Chiamaka Nwosu',
    rating: 5,
    comment: 'Perfect size for everyday errands. Soft leather and the design stays stylish for Lagos heat.',
    product: 'Beige Crossbody',
    date: '2024-03-05',
    verified: true
  },
  {
    id: '3',
    name: 'Amina Bello',
    rating: 4,
    comment: 'Beautiful bag! Great quality and fast delivery to Abuja. I will definitely order again.',
    product: 'Evening Clutch',
    date: '2024-02-22',
    verified: true
  },
  {
    id: '4',
    name: 'Kemi Balogun',
    rating: 5,
    comment: 'This is my third purchase from HOK Fashion. Always impressed with the quality!',
    product: 'Shoulder Bag Deluxe',
    date: '2024-02-10',
    verified: true
  },
  {
    id: '5',
    name: 'Ifeanyi Okeke',
    rating: 5,
    comment: 'Exactly as described. Craftsmanship is top-notch and delivery to Enugu was fast. Highly recommend!',
    product: 'Brown Leather Tote',
    date: '2024-01-30',
    verified: true
  }
];
