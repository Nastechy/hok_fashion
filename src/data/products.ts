// Import all bag images
import heroImg from '@/assets/hero-bag.jpg';
import bag1Img from '@/assets/bag-1.jpg';
import bag2Img from '@/assets/bag-2.jpg';
import bag3Img from '@/assets/bag-3.jpg';
import bag4Img from '@/assets/bag-4.jpg';

export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  description: string;
  features: string[];
  productCode: string;
  isBestSeller?: boolean;
  isNewArrival?: boolean;
}

export const products: Product[] = [
  {
    id: '1',
    name: 'Classic Black Tote',
    price: 299,
    image: heroImg,
    category: 'Totes',
    description: 'Elegant black leather tote bag with premium hardware. Perfect for work or everyday use.',
    features: ['Genuine leather', 'Premium hardware', 'Interior pockets', 'Spacious main compartment'],
    productCode: 'CBT-001',
    isBestSeller: true,
    isNewArrival: false
  },
  {
    id: '2',
    name: 'Beige Crossbody',
    price: 199,
    image: bag1Img,
    category: 'Crossbody',
    description: 'Chic beige crossbody bag with chain strap. Ideal for day-to-night styling.',
    features: ['Adjustable chain strap', 'Compact design', 'Secure closure', 'Multiple compartments'],
    productCode: 'BCB-002',
    isBestSeller: false,
    isNewArrival: true
  },
  {
    id: '3',
    name: 'Shoulder Bag Deluxe',
    price: 249,
    image: bag2Img,
    category: 'Shoulder',
    description: 'Sophisticated black shoulder bag with premium leather and elegant hardware.',
    features: ['Premium leather', 'Comfortable shoulder strap', 'Organized interior', 'Timeless design'],
    productCode: 'SBD-003',
    isBestSeller: true,
    isNewArrival: false
  },
  {
    id: '4',
    name: 'Evening Clutch',
    price: 149,
    image: bag3Img,
    category: 'Clutches',
    description: 'Luxurious cream evening clutch with chain. Perfect for special occasions.',
    features: ['Evening design', 'Removable chain', 'Silk lining', 'Magnetic closure'],
    productCode: 'EC-004',
    isBestSeller: false,
    isNewArrival: true
  },
  {
    id: '5',
    name: 'Brown Leather Tote',
    price: 329,
    image: bag4Img,
    category: 'Totes',
    description: 'Spacious brown leather tote with sturdy handles. Ideal for shopping or travel.',
    features: ['Large capacity', 'Durable handles', 'Interior organizer', 'Natural leather'],
    productCode: 'BLT-005',
    isBestSeller: true,
    isNewArrival: false
  },
  {
    id: '6',
    name: 'Red Leather Crossbody',
    price: 259,
    image: bag1Img,
    category: 'Crossbody',
    description: 'Bold red crossbody bag that makes a statement. Perfect for adding color to any outfit.',
    features: ['Vibrant red leather', 'Adjustable strap', 'Secure zipper closure', 'Lightweight design'],
    productCode: 'RLC-006',
    isBestSeller: false,
    isNewArrival: true
  },
  {
    id: '7',
    name: 'Executive Briefcase',
    price: 449,
    image: bag2Img,
    category: 'Shoulder',
    description: 'Professional leather briefcase with laptop compartment. Ideal for business meetings.',
    features: ['Laptop compartment', 'Document organizer', 'Premium leather', 'Business card slots'],
    productCode: 'EB-007',
    isBestSeller: true,
    isNewArrival: false
  },
  {
    id: '8',
    name: 'Mini Evening Clutch',
    price: 129,
    image: bag3Img,
    category: 'Clutches',
    description: 'Compact clutch for evening events. Features elegant beading and secure closure.',
    features: ['Beaded design', 'Magnetic closure', 'Removable wrist strap', 'Satin lining'],
    productCode: 'MEC-008',
    isBestSeller: false,
    isNewArrival: true
  },
  {
    id: '9',
    name: 'Weekend Travel Tote',
    price: 379,
    image: bag4Img,
    category: 'Totes',
    description: 'Large capacity tote perfect for weekend getaways. Durable and stylish.',
    features: ['Extra large capacity', 'Reinforced handles', 'Interior zip pocket', 'Water-resistant'],
    productCode: 'WTT-009',
    isBestSeller: true,
    isNewArrival: false
  },
  {
    id: '10',
    name: 'Vintage Shoulder Bag',
    price: 219,
    image: heroImg,
    category: 'Shoulder',
    description: 'Vintage-inspired shoulder bag with brass hardware. Timeless elegance meets modern function.',
    features: ['Vintage brass hardware', 'Soft leather', 'Multiple pockets', 'Comfortable strap'],
    productCode: 'VSB-010',
    isBestSeller: false,
    isNewArrival: true
  },
  {
    id: '11',
    name: 'Sports Crossbody',
    price: 179,
    image: bag1Img,
    category: 'Crossbody',
    description: 'Active lifestyle crossbody with water-resistant material. Perfect for workouts and outdoor activities.',
    features: ['Water-resistant', 'Reflective accents', 'Multiple compartments', 'Breathable strap'],
    productCode: 'SC-011',
    isBestSeller: false,
    isNewArrival: true
  },
  {
    id: '12',
    name: 'Luxury Evening Clutch',
    price: 199,
    image: bag3Img,
    category: 'Clutches',
    description: 'Premium evening clutch with crystal embellishments. Perfect for formal occasions.',
    features: ['Crystal embellishments', 'Silk interior', 'Gold chain', 'Mirror included'],
    productCode: 'LEC-012',
    isBestSeller: true,
    isNewArrival: false
  }
];

export const categories = ['All', 'Totes', 'Crossbody', 'Shoulder', 'Clutches'];