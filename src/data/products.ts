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
  },
  {
    id: '6',
    name: 'Red Leather Crossbody',
    price: 259,
    image: '/src/assets/bag-1.jpg',
    category: 'Crossbody',
    description: 'Bold red crossbody bag that makes a statement. Perfect for adding color to any outfit.',
    features: ['Vibrant red leather', 'Adjustable strap', 'Secure zipper closure', 'Lightweight design'],
    isBestSeller: false,
    isNewArrival: true
  },
  {
    id: '7',
    name: 'Executive Briefcase',
    price: 449,
    image: '/src/assets/bag-2.jpg',
    category: 'Shoulder',
    description: 'Professional leather briefcase with laptop compartment. Ideal for business meetings.',
    features: ['Laptop compartment', 'Document organizer', 'Premium leather', 'Business card slots'],
    isBestSeller: true,
    isNewArrival: false
  },
  {
    id: '8',
    name: 'Mini Evening Clutch',
    price: 129,
    image: '/src/assets/bag-3.jpg',
    category: 'Clutches',
    description: 'Compact clutch for evening events. Features elegant beading and secure closure.',
    features: ['Beaded design', 'Magnetic closure', 'Removable wrist strap', 'Satin lining'],
    isBestSeller: false,
    isNewArrival: true
  },
  {
    id: '9',
    name: 'Weekend Travel Tote',
    price: 379,
    image: '/src/assets/bag-4.jpg',
    category: 'Totes',
    description: 'Large capacity tote perfect for weekend getaways. Durable and stylish.',
    features: ['Extra large capacity', 'Reinforced handles', 'Interior zip pocket', 'Water-resistant'],
    isBestSeller: true,
    isNewArrival: false
  },
  {
    id: '10',
    name: 'Vintage Shoulder Bag',
    price: 219,
    image: '/src/assets/hero-bag.jpg',
    category: 'Shoulder',
    description: 'Vintage-inspired shoulder bag with brass hardware. Timeless elegance meets modern function.',
    features: ['Vintage brass hardware', 'Soft leather', 'Multiple pockets', 'Comfortable strap'],
    isBestSeller: false,
    isNewArrival: true
  },
  {
    id: '11',
    name: 'Sports Crossbody',
    price: 179,
    image: '/src/assets/bag-1.jpg',
    category: 'Crossbody',
    description: 'Active lifestyle crossbody with water-resistant material. Perfect for workouts and outdoor activities.',
    features: ['Water-resistant', 'Reflective accents', 'Multiple compartments', 'Breathable strap'],
    isBestSeller: false,
    isNewArrival: true
  },
  {
    id: '12',
    name: 'Luxury Evening Clutch',
    price: 199,
    image: '/src/assets/bag-3.jpg',
    category: 'Clutches',
    description: 'Premium evening clutch with crystal embellishments. Perfect for formal occasions.',
    features: ['Crystal embellishments', 'Silk interior', 'Gold chain', 'Mirror included'],
    isBestSeller: true,
    isNewArrival: false
  }
];

export const categories = ['All', 'Totes', 'Crossbody', 'Shoulder', 'Clutches'];