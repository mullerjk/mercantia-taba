const { db } = require('./src/db/index.ts');
const { stores, products, carts, cartItems, orders, orderItems, shippingAddresses, orderAddresses } = require('./src/db/schema.ts');

async function checkDB() {
  try {
    // Try to query stores table
    const storesCount = await db.select().from(stores).limit(1);
    console.log('✓ Stores table exists');
    
    const productsCount = await db.select().from(products).limit(1);
    console.log('✓ Products table exists');
    
    const cartsCount = await db.select().from(carts).limit(1);
    console.log('✓ Carts table exists');
    
    const ordersCount = await db.select().from(orders).limit(1);
    console.log('✓ Orders table exists');
    
    console.log('\n✓ All marketplace tables exist!');
    process.exit(0);
  } catch (error) {
    console.error('✗ Error:', error.message);
    process.exit(1);
  }
}

checkDB();
