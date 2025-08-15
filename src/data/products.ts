export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  description: string;
  features: string[];
}

export const products: Product[] = [
  {
    id: '1',
    name: 'Classic Black Tote',
    price: 299,
    image: '/src/assets/hero-bag.jpg',
    category: 'Totes',
    description: 'Elegant black leather tote bag with gold hardware. Perfect for work or everyday use.',
    features: ['Genuine leather', 'Gold-tone hardware', 'Interior pockets', 'Spacious main compartment']
  },
  {
    id: '2',
    name: 'Beige Crossbody',
    price: 199,
    image: '/src/assets/bag-1.jpg',
    category: 'Crossbody',
    description: 'Chic beige crossbody bag with chain strap. Ideal for day-to-night styling.',
    features: ['Adjustable chain strap', 'Compact design', 'Secure closure', 'Multiple compartments']
  },
  {
    id: '3',
    name: 'Shoulder Bag Deluxe',
    price: 249,
    image: '/src/assets/bag-2.jpg',
    category: 'Shoulder',
    description: 'Sophisticated black shoulder bag with premium leather and elegant hardware.',
    features: ['Premium leather', 'Comfortable shoulder strap', 'Organized interior', 'Timeless design']
  },
  {
    id: '4',
    name: 'Evening Clutch',
    price: 149,
    image: '/src/assets/bag-3.jpg',
    category: 'Clutches',
    description: 'Luxurious cream evening clutch with gold chain. Perfect for special occasions.',
    features: ['Evening design', 'Removable chain', 'Silk lining', 'Magnetic closure']
  },
  {
    id: '5',
    name: 'Brown Leather Tote',
    price: 329,
    image: '/src/assets/bag-4.jpg',
    category: 'Totes',
    description: 'Spacious brown leather tote with sturdy handles. Ideal for shopping or travel.',
    features: ['Large capacity', 'Durable handles', 'Interior organizer', 'Natural leather']
  }
];

export const categories = ['All', 'Totes', 'Crossbody', 'Shoulder', 'Clutches'];