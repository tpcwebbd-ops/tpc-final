import { emptyRichText, normalizeSlug, type ProductInput } from "./catalog";

export type RawDemoProduct = {
  name: string;
  brand: string;
  categorySlug: string;
  categoryName: string;
  realPrice: number;
  discountPrice: number;
  stock: number;
  star: number;
  shortDescription: string;
  features: string[];
  image: string;
};
type GadgetGroup = Pick<RawDemoProduct, "categoryName" | "categorySlug"> & {
  products: Array<{ brand: string; image: string; name: string }>;
};

const gadgetGroups: GadgetGroup[] = [
  {
    categoryName: "Smartphones & Tablets",
    categorySlug: "smartphones-tablets",
    products: [
      {
        brand: "Nova",
        name: "Nova X Pro 5G Smartphone",
        image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&auto=format&fit=crop&q=80",
      },
      {
        brand: "Pixel",
        name: "PixelView OLED Android Phone",
        image: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800&auto=format&fit=crop&q=80",
      },
      {
        brand: "TabOne",
        name: "TabOne 11-inch Productivity Tablet",
        image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&auto=format&fit=crop&q=80",
      },
      {
        brand: "Readly",
        name: "Readly Paperwhite E-reader",
        image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&auto=format&fit=crop&q=80",
      },
      {
        brand: "Nova",
        name: "Nova MagSafe Clear Phone Case",
        image: "https://images.unsplash.com/photo-1601593346740-925612772716?w=800&auto=format&fit=crop&q=80",
      },
    ],
  },
  {
    categoryName: "Laptops & Computers",
    categorySlug: "laptops-computers",
    products: [
      {
        brand: "Aero",
        name: "Aero 14-inch Ultrabook",
        image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&auto=format&fit=crop&q=80",
      },
      {
        brand: "Core",
        name: "Core Mini Desktop PC",
        image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&auto=format&fit=crop&q=80",
      },
      {
        brand: "UltraView",
        name: "UltraView 34-inch Curved Monitor",
        image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&auto=format&fit=crop&q=80",
      },
      {
        brand: "KeyForge",
        name: "KeyForge RGB Mechanical Keyboard",
        image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&auto=format&fit=crop&q=80",
      },
      {
        brand: "AeroGlide",
        name: "AeroGlide Ergonomic Wireless Mouse",
        image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800&auto=format&fit=crop&q=80",
      },
    ],
  },
  {
    categoryName: "Audio & Headphones",
    categorySlug: "audio-headphones",
    products: [
      {
        brand: "SonicPulse",
        name: "SonicPulse ANC Headphones",
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80",
      },
      {
        brand: "SoundWave",
        name: "SoundWave Waterproof Bluetooth Speaker",
        image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=800&auto=format&fit=crop&q=80",
      },
      {
        brand: "Echo",
        name: "Echo Air True Wireless Earbuds",
        image: "https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=800&auto=format&fit=crop&q=80",
      },
      {
        brand: "Studio",
        name: "Studio USB Condenser Microphone",
        image: "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=800&auto=format&fit=crop&q=80",
      },
      {
        brand: "SonicPulse",
        name: "SonicPulse Portable DAC",
        image: "https://images.unsplash.com/photo-1545454675-3531b543be5d?w=800&auto=format&fit=crop&q=80",
      },
    ],
  },
  {
    categoryName: "Wearables & Smartwatches",
    categorySlug: "wearables-smartwatches",
    products: [
      {
        brand: "PulseFit",
        name: "PulseFit AMOLED Smartwatch",
        image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80",
      },
      {
        brand: "PulseFit",
        name: "PulseFit GPS Fitness Tracker",
        image: "https://images.unsplash.com/photo-1557935728-e6d1eaabe558?w=800&auto=format&fit=crop&q=80",
      },
      {
        brand: "Aura",
        name: "Aura Smart Ring",
        image: "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=800&auto=format&fit=crop&q=80",
      },
      {
        brand: "PulseFit",
        name: "PulseFit Smart Scale",
        image: "https://images.unsplash.com/photo-1576678927484-cc907957088c?w=800&auto=format&fit=crop&q=80",
      },
      {
        brand: "Tempo",
        name: "Tempo Sport Watch Band",
        image: "https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?w=800&auto=format&fit=crop&q=80",
      },
    ],
  },
  {
    categoryName: "Cameras & Drones",
    categorySlug: "cameras-drones",
    products: [
      {
        brand: "Lumix",
        name: "Lumix Mirrorless Creator Camera",
        image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&auto=format&fit=crop&q=80",
      },
      {
        brand: "SkyView",
        name: "SkyView 4K Camera Drone",
        image: "https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=800&auto=format&fit=crop&q=80",
      },
      {
        brand: "ActionPro",
        name: "ActionPro 5K Adventure Camera",
        image: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=800&auto=format&fit=crop&q=80",
      },
      {
        brand: "Lumix",
        name: "Lumix 50mm Prime Lens",
        image: "https://images.unsplash.com/photo-1510127034890-ba27508e9f1c?w=800&auto=format&fit=crop&q=80",
      },
      {
        brand: "TripodCo",
        name: "TripodCo Carbon Travel Tripod",
        image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&auto=format&fit=crop&q=80",
      },
    ],
  },
  {
    categoryName: "Gaming Gear",
    categorySlug: "gaming-gear",
    products: [
      {
        brand: "Arcade",
        name: "Arcade Wireless Gaming Controller",
        image: "https://images.unsplash.com/photo-1603481546579-65d935ba9cdd?w=800&auto=format&fit=crop&q=80",
      },
      {
        brand: "GameBox",
        name: "GameBox Compact Console",
        image: "https://images.unsplash.com/photo-1605901309584-818e25960a8f?w=800&auto=format&fit=crop&q=80",
      },
      {
        brand: "KeyForge",
        name: "KeyForge TKL Gaming Keyboard",
        image: "https://images.unsplash.com/photo-1595225476474-87563907a212?w=800&auto=format&fit=crop&q=80",
      },
      {
        brand: "AeroGlide",
        name: "AeroGlide RGB Gaming Mouse",
        image: "https://images.unsplash.com/photo-1527814050087-3793815479db?w=800&auto=format&fit=crop&q=80",
      },
      {
        brand: "Vision",
        name: "Vision 27-inch Gaming Display",
        image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&auto=format&fit=crop&q=80",
      },
    ],
  },
  {
    categoryName: "Smart Home",
    categorySlug: "smart-home",
    products: [
      {
        brand: "Glow",
        name: "Glow Smart LED Light Kit",
        image: "https://images.unsplash.com/photo-1558002038-1055907df827?w=800&auto=format&fit=crop&q=80",
      },
      {
        brand: "NestSecure",
        name: "NestSecure Indoor Wi-Fi Camera",
        image: "https://images.unsplash.com/photo-1557597774-9d273605dfa9?w=800&auto=format&fit=crop&q=80",
      },
      {
        brand: "HomePod",
        name: "HomePod Voice Smart Speaker",
        image: "https://images.unsplash.com/photo-1589492477829-5e65395b66cc?w=800&auto=format&fit=crop&q=80",
      },
      {
        brand: "Glow",
        name: "Glow Smart Plug Duo",
        image: "https://images.unsplash.com/photo-1558089687-f282ffcbc126?w=800&auto=format&fit=crop&q=80",
      },
      {
        brand: "Breeze",
        name: "Breeze Smart Air Purifier",
        image: "https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=800&auto=format&fit=crop&q=80",
      },
    ],
  },
  {
    categoryName: "Chargers & Accessories",
    categorySlug: "chargers-accessories",
    products: [
      {
        brand: "HyperCharge",
        name: "HyperCharge 100W GaN Charger",
        image: "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=800&auto=format&fit=crop&q=80",
      },
      {
        brand: "Volt",
        name: "Volt 20,000mAh Fast Power Bank",
        image: "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=800&auto=format&fit=crop&q=80",
      },
      {
        brand: "OmniHub",
        name: "OmniHub 9-in-1 USB-C Dock",
        image: "https://images.unsplash.com/photo-1616440347437-b1c73416efc2?w=800&auto=format&fit=crop&q=80",
      },
      {
        brand: "CablePro",
        name: "CablePro Braided USB-C Cable",
        image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&auto=format&fit=crop&q=80",
      },
      {
        brand: "Lift",
        name: "Lift Aluminum Laptop Stand",
        image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800&auto=format&fit=crop&q=80",
      },
    ],
  },
];

export const DEMO_PRODUCTS: RawDemoProduct[] = gadgetGroups.flatMap((group, groupIndex) =>
  group.products.map((product, productIndex) => {
    const price = 1800 + (groupIndex * 5 + productIndex) * 450;
    return {
      ...group,
      ...product,
      realPrice: price,
      discountPrice: Math.round(price * 0.85),
      stock: 15 + ((groupIndex * 5 + productIndex) % 7) * 10,
      star: 4.5 + ((groupIndex + productIndex) % 5) / 10,
      shortDescription: `A reliable ${product.name.toLowerCase()} with practical everyday features and a real product photograph.`,
      features: ["Quality-tested hardware", "Modern connectivity", "One-year warranty", "Ready to ship"],
      image: product.image,
    };
  }),
);

export function buildDemoProductPayload({
  demo,
  index,
  categoryId,
  imageUrl,
}: {
  demo: RawDemoProduct;
  index: number;
  categoryId: string;
  imageUrl?: string;
}): ProductInput {
  const seed = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}-${index + 1}`.toLowerCase();
  const primaryImage = imageUrl || demo.image;
  return {
    name: demo.name,
    slug: normalizeSlug(`${demo.name}-${seed}`),
    sku: `DEMO-${seed.toUpperCase()}`,
    description: emptyRichText,
    shortDescription: demo.shortDescription,
    realPrice: demo.realPrice,
    discountPrice: demo.discountPrice,
    discount: Number((((demo.realPrice - demo.discountPrice) / demo.realPrice) * 100).toFixed(2)),
    taxRate: 0,
    shippingCost: 0,
    star: demo.star,
    primaryImage,
    images: [primaryImage],
    video: "",
    mainFeatures: demo.features,
    deliveryTime: "2–4 business days",
    warranty: "1 Year Official Warranty",
    stock: demo.stock,
    categories: [categoryId],
    brand: demo.brand,
    status: "active",
    isFeatured: index < 5,
  };
}
export function getDemo8Products(): RawDemoProduct[] {
  return DEMO_PRODUCTS.filter((_, index) => index % 5 === 0);
}
export function getDemo16Products(): RawDemoProduct[] {
  return DEMO_PRODUCTS.filter((_, index) => index % 5 < 2);
}
