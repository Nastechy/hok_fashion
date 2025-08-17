-- Insert sample products into the database
INSERT INTO public.products (name, description, price, image_url, category, is_best_seller, is_new_arrival, features, stock_quantity) VALUES 
('Elegant Tote Collection', 'A sophisticated tote bag crafted from premium leather with spacious interior and elegant finish.', 349.99, '/src/assets/bag-1.jpg', 'Totes', true, false, ARRAY['Premium leather', 'Spacious interior', 'Elegant finish', 'Multiple compartments'], 15),

('Classic Crossbody', 'Versatile crossbody bag perfect for everyday use, featuring adjustable strap and secure closures.', 189.99, '/src/assets/bag-2.jpg', 'Crossbody', true, true, ARRAY['Adjustable strap', 'Secure closures', 'Everyday versatility', 'Compact design'], 25),

('Luxe Shoulder Bag', 'Premium shoulder bag with refined design, perfect for professional and casual occasions.', 299.99, '/src/assets/bag-3.jpg', 'Shoulder', false, true, ARRAY['Refined design', 'Professional style', 'Casual versatility', 'Quality hardware'], 12),

('Designer Clutch', 'Elegant evening clutch with sophisticated details, ideal for special occasions and events.', 159.99, '/src/assets/bag-4.jpg', 'Clutches', true, false, ARRAY['Evening elegance', 'Sophisticated details', 'Special occasions', 'Compact luxury'], 8),

('Hero Collection Tote', 'Our signature tote bag featuring exceptional craftsmanship and timeless design.', 429.99, '/src/assets/hero-bag.jpg', 'Totes', true, true, ARRAY['Signature design', 'Exceptional craftsmanship', 'Timeless appeal', 'Premium materials'], 10);