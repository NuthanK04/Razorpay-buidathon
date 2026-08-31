import { Product } from '../types';

export function getProductImageUrl(product: Partial<Product>): string {
  if (product.imageUrl && product.imageUrl.startsWith('http')) {
    return product.imageUrl;
  }

  const name = (product.name || '').toLowerCase();
  const cat = (product.category || '').toLowerCase();
  const id = (product.id || '').toLowerCase();

  // 1. Smartphones
  if (name.includes('nothing phone') || id.includes('nothing')) {
    return 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=600&q=80';
  }
  if (name.includes('iphone') || id.includes('iphone')) {
    return 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?auto=format&fit=crop&w=600&q=80';
  }
  if (name.includes('samsung galaxy') || name.includes('pixel') || name.includes('oneplus') || cat.includes('smartphone') || cat.includes('phone')) {
    return 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=600&q=80';
  }

  // 2. Laptops
  if (name.includes('asus') || name.includes('tuf') || name.includes('rog')) {
    return 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=600&q=80';
  }
  if (name.includes('lenovo') || name.includes('loq') || name.includes('thinkpad')) {
    return 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=600&q=80';
  }
  if (name.includes('macbook') || name.includes('apple')) {
    return 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=600&q=80';
  }
  if (name.includes('hp omen') || name.includes('omen')) {
    return 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?auto=format&fit=crop&w=600&q=80';
  }
  if (name.includes('acer') || name.includes('nitro') || cat.includes('laptop')) {
    return 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&w=600&q=80';
  }

  // 3. Monitors
  if (name.includes('ultrasharp') || name.includes('dell')) {
    return 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=600&q=80';
  }
  if (name.includes('ultragear') || name.includes('lg') || name.includes('odyssey') || cat.includes('monitor')) {
    return 'https://images.unsplash.com/photo-1547119957-637f8679db1e?auto=format&fit=crop&w=600&q=80';
  }

  // 4. Headphones & Audio
  if (name.includes('sony') || name.includes('wh-1000') || name.includes('xm5')) {
    return 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80';
  }
  if (name.includes('bose') || name.includes('sennheiser') || name.includes('airpods') || cat.includes('headphone') || cat.includes('audio')) {
    return 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=600&q=80';
  }

  // 5. Keyboards
  if (name.includes('keychron') || name.includes('nuphy') || name.includes('keyboard') || cat.includes('keyboard')) {
    return 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=600&q=80';
  }

  // 6. Mice
  if (name.includes('mx master') || name.includes('logitech') || name.includes('mouse') || name.includes('razer') || cat.includes('mice')) {
    return 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=600&q=80';
  }

  // 7. Warranties / Protection Plans
  if (name.includes('protection') || name.includes('warranty') || name.includes('shield') || cat.includes('warranty')) {
    return 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=600&q=80';
  }

  // 8. Accessories (Cooling pad, Docks, Chargers, Power bank)
  if (name.includes('cooling') || name.includes('dock') || name.includes('charger') || name.includes('power bank') || name.includes('ssd') || cat.includes('accessories')) {
    return 'https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?auto=format&fit=crop&w=600&q=80';
  }

  // 9. Lifestyle Studio Items
  if (id.includes('tote') || name.includes('tote')) {
    return 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=600&q=80';
  }
  if (id.includes('backpack') || name.includes('backpack')) {
    return 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=600&q=80';
  }
  if (id.includes('weekender') || name.includes('weekender')) {
    return 'https://images.unsplash.com/photo-1547949003-9792a18a2601?auto=format&fit=crop&w=600&q=80';
  }
  if (id.includes('crossbody') || name.includes('crossbody')) {
    return 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=600&q=80';
  }
  if (id.includes('jacket') || name.includes('jacket')) {
    return 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=600&q=80';
  }
  if (id.includes('cap') || name.includes('cap')) {
    return 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=600&q=80';
  }
  if (id.includes('pouch') || name.includes('pouch')) {
    return 'https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?auto=format&fit=crop&w=600&q=80';
  }
  if (id.includes('wallet') || name.includes('wallet')) {
    return 'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=600&q=80';
  }

  return 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80';
}
