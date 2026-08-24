import { db } from './src/db';
import { categories, products } from './src/db/schema';

async function seed() {
  console.log('Seeding data...');

  // Clear existing data
  await db.delete(products);
  await db.delete(categories);

  const [electronics, fashion, home] = await db.insert(categories).values([
    { name: 'Electronics', slug: 'electronics', icon: 'Laptop' },
    { name: 'Fashion', slug: 'fashion', icon: 'Shirt' },
    { name: 'Home & Living', slug: 'home-living', icon: 'Home' },
  ]).returning();

  await db.insert(products).values([
    {
      name: 'Premium Smartphone X1 Pro',
      description: 'Experience the next level of mobile technology with the X1 Pro. Featuring a titanium body and the fastest processor ever.',
      price: '285000.00',
      originalPrice: '320000.00',
      discountPercent: 11,
      imageUrls: ['/phone.jpg'],
      categoryId: electronics.id,
      brand: 'Titan',
      rating: '4.9',
      affiliateUrl: 'https://daraz.lk',
      isFlashSale: true,
    },
    {
      name: 'Elite Smart Watch Series 7',
      description: 'Stay connected and healthy with the Elite Smart Watch. Real-time health tracking and 7-day battery life.',
      price: '45000.00',
      originalPrice: '55000.00',
      discountPercent: 18,
      imageUrls: ['/watch.jpg'],
      categoryId: electronics.id,
      brand: 'Elite',
      rating: '4.8',
      affiliateUrl: 'https://daraz.lk',
      isFlashSale: true,
    },
    {
      name: 'Sony WH-1000XM5 Noise Cancelling Headphones',
      description: 'Industry-leading noise cancellation and superior sound quality.',
      price: '95000.00',
      originalPrice: '110000.00',
      discountPercent: 14,
      imageUrls: ['https://images.unsplash.com/photo-1618366712277-7bcfa203c39a?w=800&q=80'],
      categoryId: electronics.id,
      brand: 'Sony',
      rating: '4.9',
      affiliateUrl: 'https://daraz.lk',
      isFlashSale: true,
    },
    {
      name: 'Modern Cotton T-Shirt',
      description: 'Comfortable and stylish cotton t-shirt for everyday wear.',
      price: '1800.00',
      originalPrice: '2500.00',
      discountPercent: 28,
      imageUrls: ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80'],
      categoryId: fashion.id,
      brand: 'Casual',
      rating: '4.5',
      affiliateUrl: 'https://daraz.lk',
      isFlashSale: false,
    },
    {
      name: 'Wireless Gaming Mouse',
      description: 'High-precision wireless gaming mouse with RGB lighting.',
      price: '12500.00',
      originalPrice: '15000.00',
      discountPercent: 16,
      imageUrls: ['https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&q=80'],
      categoryId: electronics.id,
      brand: 'GamerX',
      rating: '4.7',
      affiliateUrl: 'https://daraz.lk',
      isFlashSale: true,
    },
    {
      name: 'LED Desk Lamp',
      description: 'Adjustable brightness and color temperature for your workspace.',
      price: '5500.00',
      originalPrice: '7500.00',
      discountPercent: 26,
      imageUrls: ['https://images.unsplash.com/photo-1507473884658-66a3ea93eafa?w=800&q=80'],
      categoryId: home.id,
      brand: 'BrightLife',
      rating: '4.6',
      affiliateUrl: 'https://daraz.lk',
      isFlashSale: false,
    },
  ]);

  console.log('Seeding finished!');
}

seed().catch(err => {
  console.error(err);
  process.exit(1);
});
