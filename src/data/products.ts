export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  description: string;
  features: string[];
  isBestSeller?: boolean;
  isNewArrival?: boolean;
}

export const products: Product[] = [
  {
    id: '1',
    name: 'Classic Black Tote',
    price: 299,
    image: '/src/assets/hero-bag.jpg',
    category: 'Totes',
    description: 'Elegant black leather tote bag with premium hardware. Perfect for work or everyday use.',
    features: ['Genuine leather', 'Premium hardware', 'Interior pockets', 'Spacious main compartment'],
    isBestSeller: true,
    isNewArrival: false
  },
  {
    id: '2',
    name: 'Beige Crossbody',
    price: 199,
    image: '/src/assets/bag-1.jpg',
    category: 'Crossbody',
    description: 'Chic beige crossbody bag with chain strap. Ideal for day-to-night styling.',
    features: ['Adjustable chain strap', 'Compact design', 'Secure closure', 'Multiple compartments'],
    isBestSeller: false,
    isNewArrival: true
  },
  {
    id: '3',
    name: 'Shoulder Bag Deluxe',
    price: 249,
    image: '/src/assets/bag-2.jpg',
    category: 'Shoulder',
    description: 'Sophisticated black shoulder bag with premium leather and elegant hardware.',
    features: ['Premium leather', 'Comfortable shoulder strap', 'Organized interior', 'Timeless design'],
    isBestSeller: true,
    isNewArrival: false
  },
  {
    id: '4',
    name: 'Evening Clutch',
    price: 149,
    image: '/src/assets/bag-3.jpg',
    category: 'Clutches',
    description: 'Luxurious cream evening clutch with chain. Perfect for special occasions.',
    features: ['Evening design', 'Removable chain', 'Silk lining', 'Magnetic closure'],
    isBestSeller: false,
    isNewArrival: true
  },
  {
    id: '5',
    name: 'Brown Leather Tote',
    price: 329,
    image: '/src/assets/bag-4.jpg',
    category: 'Totes',
    description: 'Spacious brown leather tote with sturdy handles. Ideal for shopping or travel.',
    features: ['Large capacity', 'Durable handles', 'Interior organizer', 'Natural leather'],
    isBestSeller: true,
    isNewArrival: false
  }
];

export const categories = ['All', 'Totes', 'Crossbody', 'Shoulder', 'Clutches'];