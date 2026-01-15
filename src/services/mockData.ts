import type {
  Order,
  Product,
  Customer,
  OrderStatus,
  StockStatus,
  DashboardMetrics,
  RevenueDataPoint,
  CategorySales,
  CustomerGrowth,
} from '../types';
import { generateId } from '../utils/helpers';

// Helper to generate random number in range
const random = (min: number, max: number): number =>
  Math.floor(Math.random() * (max - min + 1)) + min;

// Helper to pick random item from array
const pickRandom = <T>(arr: T[]): T => arr[random(0, arr.length - 1)];

// Helper to generate random date in last N months
const randomDate = (monthsAgo: number): Date => {
  const now = new Date();
  const past = new Date(now.getFullYear(), now.getMonth() - monthsAgo, 1);
  const diff = now.getTime() - past.getTime();
  return new Date(past.getTime() + Math.random() * diff);
};

// Data pools
const firstNames = [
  'James', 'Emma', 'Oliver', 'Ava', 'William', 'Sophia', 'Benjamin', 'Isabella',
  'Lucas', 'Mia', 'Henry', 'Charlotte', 'Alexander', 'Amelia', 'Michael', 'Harper',
  'Ethan', 'Evelyn', 'Daniel', 'Abigail', 'Matthew', 'Emily', 'Aiden', 'Elizabeth',
  'Joseph', 'Sofia', 'Jackson', 'Avery', 'Sebastian', 'Ella', 'David', 'Madison',
];

const lastNames = [
  'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis',
  'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson',
  'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin', 'Lee', 'Perez', 'Thompson',
  'White', 'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson', 'Walker',
];

const categories = ['Electronics', 'Clothing', 'Home & Garden', 'Sports', 'Books', 'Beauty'];

const productNames: Record<string, string[]> = {
  Electronics: [
    'Wireless Earbuds Pro', 'Smart Watch Ultra', '4K Webcam', 'Bluetooth Speaker',
    'Gaming Mouse', 'Mechanical Keyboard', 'USB-C Hub', 'Portable SSD 1TB',
    'Noise Canceling Headphones', 'Smart Home Hub', 'Wireless Charger Pad', 'Action Camera',
  ],
  Clothing: [
    'Premium Cotton T-Shirt', 'Slim Fit Jeans', 'Wool Blend Sweater', 'Running Shoes',
    'Leather Jacket', 'Casual Sneakers', 'Dress Shirt', 'Winter Coat',
    'Sport Leggings', 'Denim Jacket', 'Silk Scarf', 'Canvas Backpack',
  ],
  'Home & Garden': [
    'Smart LED Bulbs (4-pack)', 'Robot Vacuum', 'Air Purifier', 'Indoor Plant Set',
    'Memory Foam Pillow', 'Weighted Blanket', 'Kitchen Scale', 'Coffee Maker',
    'Knife Set', 'Cast Iron Pan', 'Bed Sheet Set', 'Bathroom Organizer',
  ],
  Sports: [
    'Yoga Mat Premium', 'Resistance Bands Set', 'Dumbbells 20lb Pair', 'Jump Rope',
    'Foam Roller', 'Water Bottle 32oz', 'Gym Bag', 'Running Belt',
    'Fitness Tracker', 'Tennis Racket', 'Basketball', 'Camping Tent',
  ],
  Books: [
    'Best Seller Novel', 'Self-Help Guide', 'Cookbook Collection', 'Business Strategy',
    'Sci-Fi Trilogy', 'History Encyclopedia', 'Art & Design Book', 'Travel Guide',
    'Biography Memoir', 'Children Picture Book', 'Poetry Anthology', 'Technical Manual',
  ],
  Beauty: [
    'Skincare Set', 'Perfume Eau de Parfum', 'Makeup Brush Set', 'Hair Dryer Pro',
    'Face Serum', 'Body Lotion', 'Nail Polish Set', 'Electric Shaver',
    'Facial Cleansing Device', 'Hair Styling Tool', 'Lip Care Kit', 'Sun Protection SPF50',
  ],
};

const orderStatuses: OrderStatus[] = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
const statusWeights = [0.1, 0.15, 0.2, 0.5, 0.05]; // Probability weights

// Generate weighted random status
const getRandomStatus = (): OrderStatus => {
  const rand = Math.random();
  let cumulative = 0;
  for (let i = 0; i < statusWeights.length; i++) {
    cumulative += statusWeights[i];
    if (rand < cumulative) return orderStatuses[i];
  }
  return 'delivered';
};

// Generate products
export const generateProducts = (count: number = 100): Product[] => {
  const products: Product[] = [];

  for (let i = 0; i < count; i++) {
    const category = pickRandom(categories);
    const productList = productNames[category];
    const name = pickRandom(productList);
    const stock = random(0, 200);

    let stockStatus: StockStatus = 'in_stock';
    if (stock === 0) stockStatus = 'out_of_stock';
    else if (stock < 20) stockStatus = 'low_stock';

    products.push({
      id: generateId(),
      name: `${name} #${i + 1}`,
      description: `High-quality ${name.toLowerCase()} for everyday use.`,
      category,
      price: random(1, 50) * 10 - 0.01, // $9.99, $19.99, etc.
      stock,
      stockStatus,
      imageUrl: `https://picsum.photos/seed/${generateId()}/200/200`,
      totalSales: random(0, 500),
      createdAt: randomDate(12).toISOString(),
    });
  }

  return products;
};

// Generate customers
export const generateCustomers = (count: number = 200): Customer[] => {
  const customers: Customer[] = [];

  for (let i = 0; i < count; i++) {
    const firstName = pickRandom(firstNames);
    const lastName = pickRandom(lastNames);
    const name = `${firstName} ${lastName}`;
    const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${random(1, 99)}@email.com`;

    customers.push({
      id: generateId(),
      name,
      email,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${generateId()}`,
      totalOrders: random(1, 30),
      totalSpent: random(50, 5000),
      createdAt: randomDate(18).toISOString(),
      lastOrderAt: Math.random() > 0.1 ? randomDate(3).toISOString() : null,
    });
  }

  return customers;
};

// Generate orders
export const generateOrders = (
  count: number = 500,
  customers: Customer[],
  products: Product[]
): Order[] => {
  const orders: Order[] = [];

  for (let i = 0; i < count; i++) {
    const customer = pickRandom(customers);
    const itemCount = random(1, 4);
    const items = [];
    let total = 0;

    for (let j = 0; j < itemCount; j++) {
      const product = pickRandom(products);
      const quantity = random(1, 3);
      const itemTotal = product.price * quantity;
      total += itemTotal;

      items.push({
        productId: product.id,
        productName: product.name,
        quantity,
        price: product.price,
      });
    }

    const createdAt = randomDate(12);
    const updatedAt = new Date(createdAt.getTime() + random(0, 7) * 24 * 60 * 60 * 1000);

    orders.push({
      id: `ORD-${String(i + 1).padStart(5, '0')}`,
      customerId: customer.id,
      customerName: customer.name,
      customerEmail: customer.email,
      items,
      total: Math.round(total * 100) / 100,
      status: getRandomStatus(),
      createdAt: createdAt.toISOString(),
      updatedAt: updatedAt.toISOString(),
    });
  }

  // Sort by date descending
  return orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
};

// Calculate metrics from orders
export const calculateMetrics = (orders: Order[], customers: Customer[]): DashboardMetrics => {
  const now = new Date();
  const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

  // Filter orders by period
  const thisMonthOrders = orders.filter(o => new Date(o.createdAt) >= thisMonth);
  const lastMonthOrders = orders.filter(
    o => new Date(o.createdAt) >= lastMonth && new Date(o.createdAt) < thisMonth
  );

  // Calculate totals
  const totalRevenue = orders
    .filter(o => o.status !== 'cancelled')
    .reduce((sum, o) => sum + o.total, 0);

  const thisMonthRevenue = thisMonthOrders
    .filter(o => o.status !== 'cancelled')
    .reduce((sum, o) => sum + o.total, 0);

  const lastMonthRevenue = lastMonthOrders
    .filter(o => o.status !== 'cancelled')
    .reduce((sum, o) => sum + o.total, 0);

  const revenueGrowth = lastMonthRevenue > 0
    ? ((thisMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100
    : 0;

  const totalOrders = orders.filter(o => o.status !== 'cancelled').length;
  const thisMonthOrderCount = thisMonthOrders.filter(o => o.status !== 'cancelled').length;
  const lastMonthOrderCount = lastMonthOrders.filter(o => o.status !== 'cancelled').length;

  const ordersGrowth = lastMonthOrderCount > 0
    ? ((thisMonthOrderCount - lastMonthOrderCount) / lastMonthOrderCount) * 100
    : 0;

  // Customer metrics
  const totalCustomers = customers.length;
  const thisMonthCustomers = customers.filter(c => new Date(c.createdAt) >= thisMonth).length;
  const lastMonthCustomers = customers.filter(
    c => new Date(c.createdAt) >= lastMonth && new Date(c.createdAt) < thisMonth
  ).length;

  const customersGrowth = lastMonthCustomers > 0
    ? ((thisMonthCustomers - lastMonthCustomers) / lastMonthCustomers) * 100
    : 0;

  // Average order value
  const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
  const thisMonthAvg = thisMonthOrderCount > 0 ? thisMonthRevenue / thisMonthOrderCount : 0;
  const lastMonthAvg = lastMonthOrderCount > 0 ? lastMonthRevenue / lastMonthOrderCount : 0;

  const avgOrderValueGrowth = lastMonthAvg > 0
    ? ((thisMonthAvg - lastMonthAvg) / lastMonthAvg) * 100
    : 0;

  return {
    totalRevenue,
    revenueGrowth,
    totalOrders,
    ordersGrowth,
    totalCustomers,
    customersGrowth,
    avgOrderValue,
    avgOrderValueGrowth,
  };
};

// Generate revenue data for charts (last 12 months)
export const generateRevenueData = (orders: Order[]): RevenueDataPoint[] => {
  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];

  const now = new Date();
  const data: RevenueDataPoint[] = [];

  for (let i = 11; i >= 0; i--) {
    const monthDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const nextMonth = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);

    const monthOrders = orders.filter(o => {
      const orderDate = new Date(o.createdAt);
      return orderDate >= monthDate && orderDate < nextMonth && o.status !== 'cancelled';
    });

    const revenue = monthOrders.reduce((sum, o) => sum + o.total, 0);

    data.push({
      month: months[monthDate.getMonth()],
      revenue: Math.round(revenue),
      orders: monthOrders.length,
    });
  }

  return data;
};

// Generate category sales for pie chart
export const generateCategorySales = (orders: Order[], products: Product[]): CategorySales[] => {
  const salesByCategory: Record<string, number> = {};

  // Create product lookup
  const productLookup = new Map(products.map(p => [p.id, p]));

  // Calculate sales by category
  orders
    .filter(o => o.status !== 'cancelled')
    .forEach(order => {
      order.items.forEach(item => {
        const product = productLookup.get(item.productId);
        if (product) {
          salesByCategory[product.category] =
            (salesByCategory[product.category] || 0) + (item.price * item.quantity);
        }
      });
    });

  // Convert to array and calculate percentages
  const total = Object.values(salesByCategory).reduce((sum, val) => sum + val, 0);

  return Object.entries(salesByCategory)
    .map(([category, sales]) => ({
      category,
      sales: Math.round(sales),
      percentage: Math.round((sales / total) * 100),
    }))
    .sort((a, b) => b.sales - a.sales);
};

// Generate customer growth data
export const generateCustomerGrowth = (customers: Customer[]): CustomerGrowth[] => {
  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];

  const now = new Date();
  const data: CustomerGrowth[] = [];

  for (let i = 11; i >= 0; i--) {
    const monthDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const nextMonth = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);

    const newCustomers = customers.filter(c => {
      const createdAt = new Date(c.createdAt);
      return createdAt >= monthDate && createdAt < nextMonth;
    }).length;

    // Simulate returning customers (roughly 60-80% of new customers come back)
    const returningCustomers = Math.floor(newCustomers * (0.6 + Math.random() * 0.2));

    data.push({
      month: months[monthDate.getMonth()],
      newCustomers,
      returningCustomers,
    });
  }

  return data;
};

// Generate all mock data
export const generateAllData = () => {
  const products = generateProducts(100);
  const customers = generateCustomers(200);
  const orders = generateOrders(500, customers, products);
  const metrics = calculateMetrics(orders, customers);
  const revenueData = generateRevenueData(orders);
  const categorySales = generateCategorySales(orders, products);
  const customerGrowth = generateCustomerGrowth(customers);

  return {
    products,
    customers,
    orders,
    metrics,
    revenueData,
    categorySales,
    customerGrowth,
  };
};
