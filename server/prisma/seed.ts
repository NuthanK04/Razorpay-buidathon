import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting comprehensive database seed for AgentCart...');

  // Clean existing tables in reverse dependency order
  await prisma.auditLog.deleteMany();
  await prisma.aiAction.deleteMany();
  await prisma.aiMessage.deleteMany();
  await prisma.aiSession.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.productRelationship.deleteMany();
  await prisma.product.deleteMany();
  await prisma.policy.deleteMany();
  await prisma.merchantSettings.deleteMany();
  await prisma.revenueMetric.deleteMany();
  await prisma.customer.deleteMany();
  await prisma.merchant.deleteMany();
  await prisma.user.deleteMany();

  const salt = await bcrypt.genSalt(10);
  const defaultPasswordHash = await bcrypt.hash('password123', salt);

  // 1. Create Users & Merchants
  const merchantUser1 = await prisma.user.create({
    data: {
      email: 'owner@electrotech.com',
      passwordHash: defaultPasswordHash,
      name: 'Vikram Sharma',
      role: 'MERCHANT',
    },
  });

  const merchant1 = await prisma.merchant.create({
    data: {
      userId: merchantUser1.id,
      storeName: 'ElectroTech Apex',
      slug: 'electrotech-apex',
      category: 'Electronics & AI Hardware',
      description: 'Premier destination for AI developer laptops, gaming rigs, and high-performance workstations.',
      logoUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=200&q=80',
    },
  });

  const merchantUser2 = await prisma.user.create({
    data: {
      email: 'admin@audioverse.com',
      passwordHash: defaultPasswordHash,
      name: 'Priya Nair',
      role: 'MERCHANT',
    },
  });

  const merchant2 = await prisma.merchant.create({
    data: {
      userId: merchantUser2.id,
      storeName: 'AudioVerse Pro',
      slug: 'audioverse-pro',
      category: 'Pro Audio & Sound Engineering',
      description: 'Studio-grade acoustics, reference monitors, and audiophile gear.',
      logoUrl: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=200&q=80',
    },
  });

  const merchantUser3 = await prisma.user.create({
    data: {
      email: 'sales@gadgetnest.in',
      passwordHash: defaultPasswordHash,
      name: 'Arjun Mehta',
      role: 'MERCHANT',
    },
  });

  const merchant3 = await prisma.merchant.create({
    data: {
      userId: merchantUser3.id,
      storeName: 'GadgetNest India',
      slug: 'gadgetnest-india',
      category: 'Smart Peripherals & Ergonomics',
      description: 'Developer productivity setups, mechanical keyboards, and 4K displays.',
      logoUrl: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=200&q=80',
    },
  });

  // 2. Create Demo Customer
  const customerUser = await prisma.user.create({
    data: {
      email: 'customer@agentcart.ai',
      passwordHash: defaultPasswordHash,
      name: 'Rohan Gupta',
      role: 'CUSTOMER',
    },
  });

  const customer = await prisma.customer.create({
    data: {
      userId: customerUser.id,
      name: 'Rohan Gupta',
      email: 'customer@agentcart.ai',
      phone: '+91 9876543210',
    },
  });

  // 3. Create Merchant Settings & Policies
  await prisma.merchantSettings.create({
    data: {
      merchantId: merchant1.id,
      maxTransactionAmount: 100000.0,
      maxDiscountPercent: 15.0,
      upsellRequiresApproval: true,
      paymentRequiresConfirm: true,
      refundRequiresMerchant: true,
      autoAiDiscoveryEnabled: true,
      rankingWeightMatch: 0.35,
      rankingWeightPrice: 0.25,
      rankingWeightRating: 0.15,
      rankingWeightStock: 0.15,
      rankingWeightPriority: 0.10,
    },
  });

  const policiesList = [
    { code: 'MAX_TRANSACTION_AMOUNT', name: 'Transaction Limit Guard', desc: 'Caps single autonomous transaction to ₹1,00,000 INR', val: '100000' },
    { code: 'MAX_DISCOUNT_PERCENT', name: 'Maximum Discount Guard', desc: 'Prevents agent from exceeding 15% discount threshold', val: '15' },
    { code: 'UPSELL_REQUIRES_CUSTOMER_APPROVAL', name: 'Explicit Consent Protocol', desc: 'Requires affirmative user click before adding upsell item to order', val: 'true' },
    { code: 'PAYMENT_REQUIRES_CUSTOMER_CONFIRMATION', name: 'Payment Confirmation Guard', desc: 'Customer must confirm cart total before Razorpay checkout launches', val: 'true' },
  ];

  for (const pol of policiesList) {
    await prisma.policy.create({
      data: {
        merchantId: merchant1.id,
        code: pol.code,
        name: pol.name,
        description: pol.desc,
        ruleType: 'LIMIT',
        value: pol.val,
        isActive: true,
        severity: 'HIGH',
      },
    });
  }

  // 4. Seed Products for ElectroTech Apex (Merchant 1)
  console.log('📦 Seeding products for ElectroTech Apex...');

  // Core Demo Laptop 1: Primary Demo Match
  const laptopAsus = await prisma.product.create({
    data: {
      merchantId: merchant1.id,
      name: 'ASUS TUF Gaming A15 (AI Edition)',
      slug: 'asus-tuf-gaming-a15-ai-edition',
      description: 'Engineered for AI machine learning workloads and high-FPS gaming. Features AMD Ryzen 7 7735HS, NVIDIA GeForce RTX 4060 (8GB GDDR6, 140W TGP), 16GB DDR5 4800MHz RAM, and 512GB PCIe 4.0 NVMe SSD.',
      category: 'laptops',
      price: 74999.0,
      originalPrice: 89999.0,
      stock: 14,
      rating: 4.8,
      reviewsCount: 142,
      features: JSON.stringify([
        'NVIDIA GeForce RTX 4060 8GB GDDR6 GPU with CUDA and Tensor Cores',
        '16GB High-Speed DDR5 RAM (Expandable to 32GB)',
        'AMD Ryzen 7 7735HS Octa-Core Processor with AI Boost',
        '15.6" FHD 144Hz IPS Display with 100% sRGB',
        'Dual Arc Flow Fans for intense cooling under ML training loads',
      ]),
      specifications: JSON.stringify({
        ram: '16GB DDR5',
        gpu: 'NVIDIA RTX 4060 8GB',
        cpu: 'AMD Ryzen 7 7735HS',
        storage: '512GB PCIe 4.0 NVMe SSD',
        display: '15.6" 144Hz FHD IPS',
        weight: '2.20 kg',
        battery: '90Whr Fast Charge',
      }),
      tags: 'ai-ready,developer,coding,nvidia,rtx-4060,16gb-ram,gaming,dedicated-gpu',
      active: true,
      priorityScore: 1.8,
      imageUrl: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=600&q=80',
    },
  });

  // Core Demo Laptop 2: Alternative Option
  const laptopLenovo = await prisma.product.create({
    data: {
      merchantId: merchant1.id,
      name: 'Lenovo LOQ 15 Intel Core i5 13th Gen',
      slug: 'lenovo-loq-15-intel-i5-13th-gen',
      description: 'High-stability mobile workstation equipped with Intel Core i5-13450HX, NVIDIA GeForce RTX 4050 (6GB GDDR6), 16GB DDR5 RAM, and 512GB SSD.',
      category: 'laptops',
      price: 72990.0,
      originalPrice: 84990.0,
      stock: 9,
      rating: 4.6,
      reviewsCount: 98,
      features: JSON.stringify([
        'NVIDIA RTX 4050 6GB GDDR6 Dedicated GPU',
        '16GB DDR5 5200MHz RAM',
        'Intel Core i5-13450HX 10-core processor',
        'Lenovo LA1 AI Chip for dynamic performance tuning',
        '15.6" FHD 144Hz Anti-Glare Display',
      ]),
      specifications: JSON.stringify({
        ram: '16GB DDR5',
        gpu: 'NVIDIA RTX 4050 6GB',
        cpu: 'Intel Core i5-13450HX',
        storage: '512GB NVMe SSD',
        display: '15.6" 144Hz FHD',
        weight: '2.40 kg',
        battery: '60Whr with Super Rapid Charge Pro',
      }),
      tags: 'developer,coding,intel,rtx-4050,16gb-ram,dedicated-gpu',
      active: true,
      priorityScore: 1.4,
      imageUrl: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=600&q=80',
    },
  });

  // Core Demo Laptop 3: Budget Option
  const laptopAcer = await prisma.product.create({
    data: {
      merchantId: merchant1.id,
      name: 'Acer Nitro V 15 Gaming & ML Laptop',
      slug: 'acer-nitro-v-15-gaming-ml',
      description: 'Unbeatable value for AI beginners and developers. Core i5-13420H with RTX 3050 6GB GPU and 16GB RAM.',
      category: 'laptops',
      price: 63990.0,
      originalPrice: 76999.0,
      stock: 18,
      rating: 4.4,
      reviewsCount: 110,
      features: JSON.stringify([
        'NVIDIA GeForce RTX 3050 6GB GDDR6 Dedicated GPU',
        '16GB DDR5 RAM with dual channel support',
        '15.6" 144Hz IPS Slim Bezel',
        'Dual fan exhaust cooling with NitroSense control',
      ]),
      specifications: JSON.stringify({
        ram: '16GB DDR5',
        gpu: 'NVIDIA RTX 3050 6GB',
        cpu: 'Intel Core i5-13420H',
        storage: '512GB PCIe Gen4 SSD',
        display: '15.6" 144Hz IPS',
        weight: '2.10 kg',
      }),
      tags: 'budget,coding,nvidia,rtx-3050,16gb-ram,dedicated-gpu',
      active: true,
      priorityScore: 1.1,
      imageUrl: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&w=600&q=80',
    },
  });

  // Premium High-Tier Laptop
  await prisma.product.create({
    data: {
      merchantId: merchant1.id,
      name: 'HP Omen 16 AI Pro Creator Edition',
      slug: 'hp-omen-16-ai-pro-creator',
      description: 'Heavyweight AI training rig with Intel Core i7-13700HX, RTX 4070 8GB GPU, and 32GB DDR5 RAM.',
      category: 'laptops',
      price: 98990.0,
      originalPrice: 119990.0,
      stock: 6,
      rating: 4.9,
      reviewsCount: 64,
      features: JSON.stringify([
        'NVIDIA RTX 4070 8GB GDDR6 GPU with full TGP 140W',
        '32GB DDR5 RAM pre-installed for massive PyTorch datasets',
        '16.1" QHD 240Hz 3ms IPS Display (100% sRGB)',
        'Omen Tempest Cooling Technology',
      ]),
      specifications: JSON.stringify({
        ram: '32GB DDR5',
        gpu: 'NVIDIA RTX 4070 8GB',
        cpu: 'Intel Core i7-13700HX',
        storage: '1TB Gen4 NVMe SSD',
        display: '16.1" QHD 240Hz',
        weight: '2.37 kg',
      }),
      tags: 'premium,32gb-ram,rtx-4070,creator,ai-pro',
      active: true,
      priorityScore: 1.6,
      imageUrl: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?auto=format&fit=crop&w=600&q=80',
    },
  });

  // Upsell Product 1: 2-Year Extended Protection Plan
  const warranty2Yr = await prisma.product.create({
    data: {
      merchantId: merchant1.id,
      name: '2-Year AgentCart Complete Damage & Hardware Protection Plan',
      slug: '2-year-complete-damage-protection-plan',
      description: 'Comprehensive 24/7 on-site repair, 100% liquid spill and accidental drop coverage, battery degradation replacement, and zero-deductible priority claims.',
      category: 'warranty',
      price: 2499.0,
      originalPrice: 4999.0,
      stock: 999,
      rating: 4.9,
      reviewsCount: 382,
      features: JSON.stringify([
        '100% Cashless Repairs across 5,000+ Authorized Service Centers',
        'Zero Deductible on accidental drops, motherboard repairs, and liquid damage',
        'Free Battery Replacement if health drops below 80%',
        'Dedicated 24/7 AI & Human Technical Hotline',
      ]),
      specifications: JSON.stringify({
        coverageDuration: '24 Months',
        claimLimit: 'Up to 100% of Laptop Invoice Value',
        transferable: 'Yes',
        activationType: 'Instant Digital Certificate',
      }),
      tags: 'warranty,protection,upsell,high-margin,care-pack',
      active: true,
      priorityScore: 2.0,
      imageUrl: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=600&q=80',
    },
  });

  // Upsell Product 2: 3-Year Pro Warranty
  const warranty3Yr = await prisma.product.create({
    data: {
      merchantId: merchant1.id,
      name: '3-Year Enterprise Hardware Shield & On-Site Care',
      slug: '3-year-enterprise-hardware-shield',
      description: 'Maximum 36-month peace of mind for professional developers and enterprise hardware.',
      category: 'warranty',
      price: 3999.0,
      originalPrice: 7499.0,
      stock: 999,
      rating: 5.0,
      reviewsCount: 190,
      features: JSON.stringify([
        'Next-Business-Day On-Site Technician Dispatch',
        'Unlimited accidental damage claims',
        'Complimentary annual thermal repasting and dust cleaning',
      ]),
      specifications: JSON.stringify({
        coverageDuration: '36 Months',
        type: 'Enterprise Shield',
      }),
      tags: 'warranty,enterprise,upsell',
      active: true,
      priorityScore: 1.8,
      imageUrl: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=600&q=80',
    },
  });

  // Cross-sell Product 1: Cooling Pad
  const coolingPad = await prisma.product.create({
    data: {
      merchantId: merchant1.id,
      name: 'IETS GT500 Turbo Laptop Cooling Pad (5000 RPM)',
      slug: 'iets-gt500-turbo-cooling-pad',
      description: 'Industrial-grade sealed foam cooling pad capable of lowering laptop GPU/CPU temperatures by up to 20°C during prolonged neural network training.',
      category: 'accessories',
      price: 4299.0,
      originalPrice: 5999.0,
      stock: 25,
      rating: 4.8,
      reviewsCount: 215,
      features: JSON.stringify([
        'Sealed foam ring forces 100% of air through laptop intake vents',
        'Variable speed rotary dial from 0 to 5000 RPM',
        'Integrated dust filter protects internal laptop components',
        'Front-facing 3-port USB hub',
      ]),
      specifications: JSON.stringify({
        fanSpeed: '5000 RPM Max',
        noiseLevel: 'Adjustable 25dB - 55dB',
        compatibility: '13" to 17.3" Laptops',
      }),
      tags: 'accessories,cooling,ai-dev,cross-sell',
      active: true,
      priorityScore: 1.5,
      imageUrl: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=600&q=80',
    },
  });

  // Cross-sell Product 2: Ergonomic Wireless Mouse
  const mouse = await prisma.product.create({
    data: {
      merchantId: merchant1.id,
      name: 'Logitech MX Master 3S Wireless Performance Mouse',
      slug: 'logitech-mx-master-3s-wireless',
      description: 'The definitive tool for coders and creators with 8K DPI Darkfield sensor and MagSpeed electromagnetic scrolling.',
      category: 'mice',
      price: 8995.0,
      originalPrice: 10995.0,
      stock: 30,
      rating: 4.9,
      reviewsCount: 512,
      features: JSON.stringify([
        'MagSpeed scrolling scrolls 1,000 lines per second',
        'Quiet clicks eliminate 90% of click noise',
        'Track-on-glass 8000 DPI sensor',
        'Customizable gesture buttons for VS Code and terminal navigation',
      ]),
      specifications: JSON.stringify({
        dpi: '8000 DPI',
        batteryLife: '70 Days per Charge',
        connectivity: 'Bluetooth + Logi Bolt USB Receiver',
      }),
      tags: 'mice,developer,ergonomic,logitech,cross-sell',
      active: true,
      priorityScore: 1.7,
      imageUrl: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=600&q=80',
    },
  });

  // Cross-sell Product 3: Mechanical Keyboard
  const keyboard = await prisma.product.create({
    data: {
      merchantId: merchant1.id,
      name: 'Keychron Q1 Pro Wireless Custom Mechanical Keyboard',
      slug: 'keychron-q1-pro-wireless-custom',
      description: 'Full CNC aluminum body, QMK/VIA programmable, hot-swappable switches, double-gasket acoustic design.',
      category: 'keyboards',
      price: 14999.0,
      originalPrice: 17999.0,
      stock: 12,
      rating: 4.9,
      reviewsCount: 160,
      features: JSON.stringify([
        'Full CNC Machined Aluminum Frame',
        'QMK & VIA Key Remapping Support',
        'Hot-Swappable Gateron Jupiter Brown Switches',
        'Connects up to 3 devices via Bluetooth 5.1 or Type-C',
      ]),
      specifications: JSON.stringify({
        layout: '75% Compact',
        switches: 'Gateron Jupiter Brown / Red',
        keycaps: 'KSA Profile Double-Shot PBT',
      }),
      tags: 'keyboards,mechanical,developer,keychron,cross-sell',
      active: true,
      priorityScore: 1.4,
      imageUrl: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=600&q=80',
    },
  });

  // Monitors
  await prisma.product.create({
    data: {
      merchantId: merchant1.id,
      name: 'LG UltraGear 27" QHD 240Hz Nano-IPS Gaming Monitor',
      slug: 'lg-ultragear-27-qhd-240hz-nano-ips',
      description: '2560x1440 resolution with 1ms GtG response time, NVIDIA G-Sync Compatible, DisplayHDR 400.',
      category: 'monitors',
      price: 29990.0,
      originalPrice: 38000.0,
      stock: 15,
      rating: 4.7,
      reviewsCount: 140,
      features: JSON.stringify(['27" QHD Nano-IPS Panel', '240Hz Refresh Rate', '1ms GtG Response', '98% DCI-P3 Color Gamut']),
      specifications: JSON.stringify({ resolution: '2560x1440', panel: 'Nano IPS', refreshRate: '240Hz' }),
      tags: 'monitors,qhd,240hz,ips',
      active: true,
      priorityScore: 1.3,
      imageUrl: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=600&q=80',
    },
  });

  // 5. Seed 90+ additional products across multiple categories for 100+ total catalog size
  const categoriesPool = [
    { cat: 'smartphones', names: ['Samsung Galaxy S24 Ultra 256GB', 'Google Pixel 8 Pro AI Edition', 'OnePlus 12 5G (16GB RAM)', 'iPhone 15 Pro 128GB', 'Nothing Phone (2) 12GB+256GB'], basePrice: 65000 },
    { cat: 'headphones', names: ['Sony WH-1000XM5 ANC Headphones', 'Bose QuietComfort Ultra Wireless', 'Sennheiser HD 660S2 Open-Back', 'Audio-Technica ATH-M50xBT2', 'Apple AirPods Pro 2nd Gen USB-C'], basePrice: 19990 },
    { cat: 'monitors', names: ['Dell UltraSharp 32" 4K USB-C Hub Monitor', 'Samsung Odyssey G7 28" 4K 144Hz', 'BenQ EW3270U 32" 4K HDR', 'Gigabyte M27Q 27" 170Hz KVM Monitor'], basePrice: 32000 },
    { cat: 'keyboards', names: ['NuPhy Air75 V2 Low-Profile Keyboard', 'Logitech G915 LIGHTSPEED Wireless', 'Razer Huntsman V2 Optical Gaming', 'Epomaker RT100 Retro Keyboard'], basePrice: 9999 },
    { cat: 'mice', names: ['Razer DeathAdder V3 Pro Wireless', 'Glorious Model O 2 Wireless Mouse', 'Logitech G Pro X Superlight 2', 'Pulsar X2V2 Wireless Gaming Mouse'], basePrice: 7499 },
    { cat: 'accessories', names: ['Anker 737 Power Bank (PowerCore 24K 140W)', 'CalDigit TS4 Thunderbolt 4 Dock 18-in-1', 'UGREEN 100W GaN 4-Port Fast Desktop Charger', 'SanDisk 2TB Extreme Portable SSD NVMe', 'Elgato Stream Deck MK.2 White'], basePrice: 6999 },
    { cat: 'warranty', names: ['1-Year Screen & Liquid Protection Plan', '2-Year Audio Equipment Extended Care', '1-Year Fast-Track Onsite Tech Support Pass'], basePrice: 1499 },
  ];

  let addedCount = 0;
  for (let i = 1; i <= 20; i++) {
    for (const pool of categoriesPool) {
      const nameTemplate = pool.names[i % pool.names.length];
      const prodName = `${nameTemplate} ${i > 5 ? `(Batch ${i})` : ''}`.trim();
      const priceVariation = Math.round((pool.basePrice + (i * 350) + (Math.random() * 500)) / 10) * 10;
      const originalPrice = Math.round(priceVariation * 1.25);
      const merchantChoice = i % 3 === 0 ? merchant2.id : i % 3 === 1 ? merchant1.id : merchant3.id;

      await prisma.product.create({
        data: {
          merchantId: merchantChoice,
          name: prodName,
          slug: `${prodName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${i}-${Date.now().toString().slice(-3)}`,
          description: `High-grade ${pool.cat} unit with certified build quality, performance stability, and comprehensive warranty coverage.`,
          category: pool.cat,
          price: priceVariation,
          originalPrice,
          stock: Math.floor(Math.random() * 35) + 5,
          rating: parseFloat((4.2 + Math.random() * 0.7).toFixed(1)),
          reviewsCount: Math.floor(Math.random() * 200) + 15,
          features: JSON.stringify([
            `Premium industrial build with certified quality standard`,
            `High efficiency component performance designed for longevity`,
            `1-Year standard manufacturer warranty included`,
          ]),
          specifications: JSON.stringify({
            category: pool.cat,
            modelYear: '2026',
            sku: `SKU-${pool.cat.slice(0, 3).toUpperCase()}-${i * 100}`,
          }),
          tags: `${pool.cat},electronic,verified-stock,tier-${(i % 3) + 1}`,
          active: true,
          priorityScore: parseFloat((0.8 + Math.random() * 0.8).toFixed(2)),
          imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80',
        },
      });
      addedCount++;
    }
  }

  console.log(`✅ Seeded ${addedCount + 8} total products across 3 merchants.`);

  // 6. Connect Explicit Relationships (Upsell and Cross-sells for Demo Laptop)
  await prisma.productRelationship.create({
    data: {
      sourceProductId: laptopAsus.id,
      targetProductId: warranty2Yr.id,
      type: 'UPSELL',
      discountPercent: 0,
      reason: 'Since this is a high-value laptop for AI development, a 2-year protection plan covers accidental liquid damage and repairs for ₹2,499.',
      active: true,
      priority: 1,
    },
  });

  await prisma.productRelationship.create({
    data: {
      sourceProductId: laptopAsus.id,
      targetProductId: coolingPad.id,
      type: 'ACCESSORY',
      discountPercent: 10,
      reason: 'High-RPM sealed cooling pad reduces GPU/CPU temperatures by 20°C during prolonged neural network training.',
      active: true,
      priority: 2,
    },
  });

  await prisma.productRelationship.create({
    data: {
      sourceProductId: laptopAsus.id,
      targetProductId: mouse.id,
      type: 'CROSS_SELL',
      discountPercent: 5,
      reason: 'Ergonomic 8K DPI scrolling mouse accelerates IDE code navigation and multitasking.',
      active: true,
      priority: 3,
    },
  });

  // Relationships for Lenovo
  await prisma.productRelationship.create({
    data: {
      sourceProductId: laptopLenovo.id,
      targetProductId: warranty2Yr.id,
      type: 'UPSELL',
      discountPercent: 0,
      reason: 'Comprehensive 2-year accidental coverage and priority repairs for ₹2,499.',
      active: true,
      priority: 1,
    },
  });

  // 7. Seed Initial Revenue Metrics for Growth Lab
  const dates = ['2026-08-17', '2026-08-18', '2026-08-19', '2026-08-20', '2026-08-21', '2026-08-22', '2026-08-23'];
  for (let i = 0; i < dates.length; i++) {
    const d = dates[i];
    await prisma.revenueMetric.create({
      data: {
        merchantId: merchant1.id,
        date: d,
        totalSessions: 35 + i * 4,
        aiSessionsCount: 22 + i * 3,
        baselineSessionsCount: 13 + i,
        totalOrders: 12 + i * 2,
        aiOrdersCount: 8 + i * 2,
        baselineOrdersCount: 4,
        totalRevenue: 640000 + i * 75000,
        aiAssistedRevenue: 460000 + i * 62000,
        upsellRevenue: 42000 + i * 8500,
        crossSellRevenue: 18000 + i * 4200,
        baselineRevenue: 180000 + i * 13000,
        aovBaseline: 58200,
        aovAi: 77498,
        upsellImpressions: 22 + i * 3,
        upsellAcceptances: 12 + i * 2,
        conversionRateBaseline: 18.2,
        conversionRateAi: 34.5 + i * 0.8,
      },
    });
  }

  // 8. Seed Initial Audit Record
  await prisma.auditLog.create({
    data: {
      auditCode: 'AC-10492',
      merchantId: merchant1.id,
      actionType: 'SYSTEM_INITIALIZATION',
      toolName: 'system_bootstrap',
      inputSummary: 'AgentCart Commerce Platform initialized for Razorpay Buildathon 2026',
      decisionSummary: 'Seeded 3 merchants, catalog inventory, policies, and AI tool bindings.',
      reason: 'Platform startup',
      policyResult: 'PASSED',
      executionResult: 'SUCCESS',
      status: 'COMMITTED',
    },
  });

  console.log('✨ Seed completed successfully! Database is ready.');
}

main()
  .catch((e) => {
    console.error('❌ Error during seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
