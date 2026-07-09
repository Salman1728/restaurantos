import type { Restaurant, MenuCategory, MenuItem } from "@/lib/types";

// Seed data. When Supabase is connected this file goes away and
// lib/data/index.ts reads from the database instead.

const slugify = (name: string) =>
  name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

// ---------------------------------------------------------------------------
// Hanam Flavour — real client menu (printed menu, 2026-07-08), served to the
// live site at hanam-flavor.vercel.app. This is the restaurant the admin
// console manages.
// ---------------------------------------------------------------------------

export const hanamRestaurant: Restaurant = {
  id: "rest_hanam",
  slug: "hanam-flavor",
  name: "Hanam Flavour",
  tagline: "Asian street kitchen, Nairobi",
  description:
    "Ramen, bao, Asian wings and Thai desserts — order at the table and we'll take it from WhatsApp.",
  phone: "+254 700 000 000",
  whatsapp: "+254 700 000 000",
  email: "hello@hanamflavour.co.ke",
  address: "Nairobi",
  currency: "KES",
  openingHours: "Mon – Sun · 10:00 AM – 10:00 PM",
  isPublished: true,
  createdAt: "2026-07-08T09:00:00Z",
};

interface SeedItem {
  name: string;
  description?: string;
  price: number;
  featured?: boolean;
}

const hanamSeed: { name: string; items: SeedItem[] }[] = [
  {
    name: "Ramen",
    items: [
      {
        name: "Truffle Cheese Vienna Noodles",
        description: "Silky noodles with vienna, parmesan and cream",
        price: 1250,
        featured: true,
      },
      {
        name: "Menu Classic Chicken Noodles",
        description:
          "Wok tossed noodle with tender chicken, infused with chilli, garlic and soy",
        price: 1250,
        featured: true,
      },
      {
        name: "Non-Spicy Menu Classic Chicken Noodles (Cheesy Creamy)",
        description:
          "Savory noodle with tender chicken, lightly tossed in garlic and soy",
        price: 1100,
      },
    ],
  },
  {
    name: "Panda Junior Noodles",
    items: [
      {
        name: "Little Panda Cheesy Chicken Noodles",
        description:
          "Soft noodles in a creamy melted sauce, topped with chicken tenders",
        price: 850,
      },
    ],
  },
  {
    name: "Asian Wings",
    items: [
      {
        name: "Thai BBQ Classic Wings",
        description: "Smoky wings glazed in a Thai style BBQ sauce",
        price: 850,
      },
      {
        name: "Chinese Soy Garlic Wings",
        description: "Crispy wings coated in a rich soy and garlic glaze",
        price: 850,
      },
      {
        name: "Korean Fire Wings",
        description: "Bold wings glazed in a fiery gochujang with sesame",
        price: 850,
      },
      {
        name: "Japanese Teriyaki Wings",
        description: "Golden wings lacquered in a delicate teriyaki glaze",
        price: 850,
      },
    ],
  },
  {
    name: "Bao Buns",
    items: [
      {
        name: "Korean Spicy Chicken Bao",
        description: "Crispy chicken coated in gochujang chilli glaze · per pc",
        price: 450,
        featured: true,
      },
      {
        name: "Mongolian Chicken Bao",
        description:
          "Tender chicken glazed in a rich mongolian soy sauce with garlic and spring onions · per pc",
        price: 450,
      },
    ],
  },
  {
    name: "Bao Burger",
    items: [
      {
        name: "Korean Fried Chicken Bao Burger",
        description: "Glazed in a rich gochujang sauce",
        price: 550,
      },
      {
        name: "Crispy Chicken Bao Burger",
        description:
          "Golden crispy chicken layered with fresh slaw and signature sauce",
        price: 550,
      },
    ],
  },
  {
    name: "Dumplings",
    items: [
      {
        name: "Kimchi Chicken Dumpling",
        description: "Chicken dumplings with spicy, tangy kimchi",
        price: 800,
      },
    ],
  },
  {
    name: "Others",
    items: [
      { name: "Tokyo Spiral Potato", price: 400 },
      { name: "Asian Toasted Fries", price: 350 },
    ],
  },
  {
    name: "Dessert",
    items: [
      { name: "Classic Thai Mango Sticky Rice", price: 700, featured: true },
      { name: "Thai Opera Cake", price: 750, featured: true },
      { name: "Umm Ali (Thai Twist)", price: 650 },
    ],
  },
  {
    name: "Hot Drinks",
    items: [
      { name: "Thai Milk Tea", price: 450 },
      { name: "Vietnamese Coffee", price: 500 },
      { name: "Spiced Chai Latte", price: 450 },
      { name: "Rooibos Chai Latte", price: 450 },
      { name: "Cappuccino", price: 400 },
      { name: "Latte", price: 450 },
    ],
  },
  {
    name: "Mocktails",
    items: [
      { name: "Passion Aide Mojito", price: 550 },
      { name: "Tropical Sunset", price: 550 },
      { name: "Mango Passion Mojito", price: 650 },
      { name: "Berry Blast Fusion", price: 600 },
      { name: "Hibiscus Bloom", price: 650 },
    ],
  },
  {
    name: "Matcha (Iced)",
    items: [
      { name: "Coconut Trio Matcha Latte", price: 750, featured: true },
      { name: "Cookie Taro Matcha Latte", price: 750 },
      { name: "Thai Mango Matcha Latte", price: 850 },
      { name: "Pistachio Matcha Latte", price: 750 },
      { name: "White Chocolate Matcha Latte", price: 750 },
    ],
  },
  {
    name: "Cold Drinks",
    items: [
      { name: "Brown Sugar Shaken Espresso", price: 550 },
      { name: "Original Vietnamese Ice Latte", price: 550 },
      { name: "Cinnamon Vietnamese Latte", price: 600 },
      { name: "Pistachio Vietnamese Latte", price: 650 },
      { name: "Tres Leches Iced Coffee", price: 650 },
      {
        name: "Flavoured Iced Latte (Vanilla / Caramel / Hazelnut)",
        price: 550,
      },
    ],
  },
];

const hanamCategories: MenuCategory[] = hanamSeed.map((cat, index) => ({
  id: slugify(cat.name),
  restaurantId: hanamRestaurant.id,
  name: cat.name,
  description: "",
  sortOrder: index + 1,
}));

const hanamItems: MenuItem[] = hanamSeed.flatMap((cat) =>
  cat.items.map((item, index) => ({
    id: slugify(item.name),
    restaurantId: hanamRestaurant.id,
    categoryId: slugify(cat.name),
    name: item.name,
    description: item.description ?? "",
    price: item.price,
    isAvailable: true,
    isFeatured: item.featured ?? false,
    sortOrder: index + 1,
  }))
);

// ---------------------------------------------------------------------------
// Saffron House — demo restaurant, kept for a second API consumer example.
// ---------------------------------------------------------------------------

const saffronRestaurant: Restaurant = {
  id: "rest_01",
  slug: "saffron-house",
  name: "Saffron House",
  tagline: "Modern coastal kitchen, Nairobi",
  description:
    "Coastal Kenyan flavours with a modern touch — slow-grilled meats, fresh seafood and house-made spice blends, served in the heart of Westlands.",
  phone: "+254 706 000 000",
  whatsapp: "+254 706 000 000",
  email: "hello@saffronhouse.co.ke",
  address: "Woodvale Grove, Westlands, Nairobi",
  currency: "KES",
  openingHours: "Mon–Sun · 11:00 AM – 10:30 PM",
  isPublished: true,
  createdAt: "2026-05-14T09:00:00Z",
};

const saffronCategories: MenuCategory[] = [
  {
    id: "cat_starters",
    restaurantId: "rest_01",
    name: "Starters",
    description: "Small plates to open the table",
    sortOrder: 1,
  },
  {
    id: "cat_mains",
    restaurantId: "rest_01",
    name: "Mains",
    description: "Signature plates from the grill and stove",
    sortOrder: 2,
  },
  {
    id: "cat_seafood",
    restaurantId: "rest_01",
    name: "Seafood",
    description: "Fresh from the coast, daily",
    sortOrder: 3,
  },
  {
    id: "cat_desserts",
    restaurantId: "rest_01",
    name: "Desserts",
    description: "Sweet finishes",
    sortOrder: 4,
  },
  {
    id: "cat_drinks",
    restaurantId: "rest_01",
    name: "Drinks",
    description: "Fresh juices, coffee and mocktails",
    sortOrder: 5,
  },
];

const saffronItems: MenuItem[] = [
  {
    id: "item_01",
    restaurantId: "rest_01",
    categoryId: "cat_starters",
    name: "Viazi Karai",
    description: "Turmeric-battered potatoes, tamarind-chilli chutney",
    price: 450,
    isAvailable: true,
    isFeatured: false,
    sortOrder: 1,
  },
  {
    id: "item_02",
    restaurantId: "rest_01",
    categoryId: "cat_starters",
    name: "Coconut Prawn Skewers",
    description: "Char-grilled prawns, coconut glaze, lime",
    price: 950,
    isAvailable: true,
    isFeatured: true,
    sortOrder: 2,
  },
  {
    id: "item_03",
    restaurantId: "rest_01",
    categoryId: "cat_starters",
    name: "Bhajia & Ukwaju",
    description: "Crisp gram-flour bhajia with tangy ukwaju dip",
    price: 400,
    isAvailable: false,
    isFeatured: false,
    sortOrder: 3,
  },
  {
    id: "item_04",
    restaurantId: "rest_01",
    categoryId: "cat_mains",
    name: "Swahili Chicken Biryani",
    description: "Slow-cooked biryani, kachumbari, raita",
    price: 1150,
    isAvailable: true,
    isFeatured: true,
    sortOrder: 1,
  },
  {
    id: "item_05",
    restaurantId: "rest_01",
    categoryId: "cat_mains",
    name: "Nyama Choma Platter",
    description: "Half-kilo grilled goat, mukimo, house salsa",
    price: 1600,
    isAvailable: true,
    isFeatured: false,
    sortOrder: 2,
  },
  {
    id: "item_06",
    restaurantId: "rest_01",
    categoryId: "cat_mains",
    name: "Coconut Bean Curry",
    description: "Njahi beans in coconut cream, chapati (v)",
    price: 850,
    isAvailable: true,
    isFeatured: false,
    sortOrder: 3,
  },
  {
    id: "item_07",
    restaurantId: "rest_01",
    categoryId: "cat_seafood",
    name: "Grilled Red Snapper",
    description: "Whole snapper, pili pili butter, coconut rice",
    price: 1850,
    isAvailable: true,
    isFeatured: true,
    sortOrder: 1,
  },
  {
    id: "item_08",
    restaurantId: "rest_01",
    categoryId: "cat_seafood",
    name: "Swahili Fish Curry",
    description: "Kingfish in spiced coconut sauce, mahamri",
    price: 1400,
    isAvailable: false,
    isFeatured: false,
    sortOrder: 2,
  },
  {
    id: "item_09",
    restaurantId: "rest_01",
    categoryId: "cat_desserts",
    name: "Mahamri & Spiced Honey",
    description: "Warm cardamom doughnuts, chai-spiced honey",
    price: 350,
    isAvailable: true,
    isFeatured: false,
    sortOrder: 1,
  },
  {
    id: "item_10",
    restaurantId: "rest_01",
    categoryId: "cat_desserts",
    name: "Passion Fruit Cheesecake",
    description: "Baked cheesecake, passion coulis",
    price: 550,
    isAvailable: true,
    isFeatured: false,
    sortOrder: 2,
  },
  {
    id: "item_11",
    restaurantId: "rest_01",
    categoryId: "cat_drinks",
    name: "Fresh Passion Juice",
    description: "Cold-pressed, no added sugar",
    price: 300,
    isAvailable: true,
    isFeatured: false,
    sortOrder: 1,
  },
  {
    id: "item_12",
    restaurantId: "rest_01",
    categoryId: "cat_drinks",
    name: "Spiced Chai Latte",
    description: "House masala blend, steamed milk",
    price: 320,
    isAvailable: true,
    isFeatured: false,
    sortOrder: 2,
  },
];

// ---------------------------------------------------------------------------
// QuickTap Restaurant — demo deployment of the QuickTap QR-menu template
// (quicktap-menu.vercel.app). Photo menu: items carry imageUrl/badge/dietary.
// ---------------------------------------------------------------------------

const quicktapRestaurant: Restaurant = {
  id: "rest_quicktap",
  slug: "quicktap",
  name: "QuickTap Restaurant",
  tagline: "Modern Kenyan comfort food & specialty coffee",
  description:
    "Demo restaurant for the QuickTap digital menu — modern Kenyan comfort food and specialty coffee on Riverside Drive.",
  phone: "+254 700 000 000",
  whatsapp: "+254 700 000 000",
  email: "hello@quicktap.design",
  address: "Riverside Drive, Nairobi",
  currency: "KES",
  openingHours: "Mon – Sun · 7:30 AM – 10:00 PM",
  isPublished: true,
  createdAt: "2026-06-20T09:00:00Z",
};

interface QuickTapSeedItem {
  id: string;
  name: string;
  description?: string;
  price: number;
  category: string;
  image?: string;
  badge?: string;
  dietary?: string[];
}

const quicktapSeed: { categories: { id: string; label: string }[]; items: QuickTapSeedItem[] } = {
  categories: [
    { id: "drinks", label: "Drinks" },
    { id: "coffee", label: "Coffee" },
    { id: "tea", label: "Tea" },
    { id: "food", label: "Food" },
    { id: "desserts", label: "Desserts" },
    { id: "extras", label: "Extras" },
  ],
  items: [
    { id: "fresh-passion-juice", name: "Fresh Passion Juice", description: "Cold-pressed passion fruit, served over ice", price: 350, category: "drinks", image: "https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=800&q=80", badge: "popular" },
    { id: "mango-smoothie", name: "Mango Smoothie", description: "Ripe mango blended with yoghurt and a hint of lime", price: 450, category: "drinks", image: "https://images.unsplash.com/photo-1505252585461-04db1eb84625?w=800&q=80" },
    { id: "berry-mocktail", name: "Berry Hibiscus Cooler", description: "Sparkling hibiscus, mixed berries & fresh mint", price: 500, category: "drinks", image: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=800&q=80", badge: "new" },
    { id: "vanilla-milkshake", name: "Vanilla Bean Milkshake", description: "Thick and creamy, topped with whipped cream", price: 550, category: "drinks", image: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=800&q=80" },
    { id: "espresso", name: "Espresso", description: "Double shot of single-origin Kenyan AA", price: 250, category: "coffee", image: "https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?w=800&q=80" },
    { id: "cappuccino", name: "Cappuccino", description: "Velvety steamed milk over a rich double shot", price: 350, category: "coffee", image: "https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=800&q=80", badge: "popular" },
    { id: "caramel-latte", name: "Caramel Latte", description: "House caramel, espresso & silky milk foam", price: 420, category: "coffee", image: "https://images.unsplash.com/photo-1541167760496-1628856ab772?w=800&q=80" },
    { id: "iced-americano", name: "Iced Americano", description: "Bold espresso over ice — simple and refreshing", price: 320, category: "coffee", image: "https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=800&q=80" },
    { id: "kenyan-chai", name: "Kenyan Chai", description: "Slow-brewed with fresh milk, ginger & cardamom", price: 250, category: "tea", image: "https://images.unsplash.com/photo-1571934811356-5cc061b6821f?w=800&q=80", badge: "popular" },
    { id: "matcha-latte", name: "Matcha Latte", description: "Ceremonial-grade matcha with steamed oat milk", price: 480, category: "tea", image: "https://images.unsplash.com/photo-1515823064-d6e0c04616a7?w=800&q=80", badge: "new", dietary: ["vegan"] },
    { id: "iced-lemon-tea", name: "Iced Lemon Tea", description: "Cold-brewed black tea, honey & fresh lemon", price: 300, category: "tea", image: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=800&q=80" },
    { id: "hibiscus-tea", name: "Hibiscus Infusion", description: "Caffeine-free, lightly sweetened, served hot or iced", price: 280, category: "tea", image: "https://images.unsplash.com/photo-1597318181409-cf64d0b5d8a2?w=800&q=80" },
    { id: "signature-smash-burger", name: "Signature Smash Burger", description: "Double beef patty, cheddar, caramelised onions & house sauce", price: 950, category: "food", image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&q=80", badge: "popular" },
    { id: "swahili-chicken", name: "Swahili Grilled Chicken", description: "Half chicken in coconut-lime marinade, served with kachumbari", price: 1100, category: "food", image: "https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?w=800&q=80", badge: "chef", dietary: ["gluten-free", "spicy"] },
    { id: "avocado-toast", name: "Avocado Sourdough Toast", description: "Smashed avo, poached eggs, chilli oil & dukkah", price: 750, category: "food", image: "https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?w=800&q=80", dietary: ["vegetarian", "spicy", "contains-nuts"] },
    { id: "steak-frites", name: "Steak & Frites", description: "250g sirloin, garlic butter & hand-cut fries", price: 1450, category: "food", image: "https://images.unsplash.com/photo-1600891964092-4316c288032e?w=800&q=80" },
    { id: "veggie-bowl", name: "Harvest Veggie Bowl", description: "Roast sweet potato, quinoa, greens & tahini dressing", price: 800, category: "food", image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&q=80", badge: "new", dietary: ["vegan", "gluten-free"] },
    { id: "margherita-pizza", name: "Wood-Fired Margherita", description: "San Marzano tomato, fior di latte & fresh basil", price: 1050, category: "food", image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&q=80", dietary: ["vegetarian"] },
    { id: "chocolate-cake", name: "Dark Chocolate Fudge Cake", description: "Warm, gooey centre with vanilla ice cream", price: 550, category: "desserts", image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&q=80", badge: "popular" },
    { id: "cheesecake", name: "Passion Fruit Cheesecake", description: "Baked New York style with a passion fruit glaze", price: 500, category: "desserts", image: "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=800&q=80" },
    { id: "pancakes", name: "Fluffy Buttermilk Pancakes", description: "Stacked high with berries & maple syrup", price: 650, category: "desserts", image: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800&q=80" },
    { id: "ice-cream", name: "Artisan Ice Cream", description: "Two scoops — ask your server for today's flavours", price: 350, category: "desserts", image: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=800&q=80" },
    { id: "hand-cut-fries", name: "Hand-Cut Fries", description: "With rosemary salt & garlic aioli", price: 350, category: "extras", image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=800&q=80", badge: "popular" },
    { id: "samosas", name: "Beef Samosas (3 pcs)", description: "Crispy pastry with spiced minced beef & tamarind dip", price: 300, category: "extras", image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800&q=80" },
    { id: "garden-salad", name: "Side Garden Salad", description: "Mixed leaves, cherry tomatoes & citrus vinaigrette", price: 400, category: "extras", image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800&q=80", dietary: ["vegan", "gluten-free"] },
    { id: "butter-croissant", name: "Butter Croissant", description: "Baked fresh every morning", price: 250, category: "extras", image: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=800&q=80" },
  ],
};

const quicktapCategories: MenuCategory[] = quicktapSeed.categories.map(
  (cat, index) => ({
    id: `qt-${cat.id}`,
    restaurantId: quicktapRestaurant.id,
    name: cat.label,
    description: "",
    sortOrder: index + 1,
  })
);

const quicktapItems: MenuItem[] = quicktapSeed.items.map((item, index) => ({
  id: `qt-${item.id}`,
  restaurantId: quicktapRestaurant.id,
  categoryId: `qt-${item.category}`,
  name: item.name,
  description: item.description ?? "",
  price: item.price,
  isAvailable: true,
  isFeatured: item.badge === "popular" || item.badge === "chef",
  sortOrder: index + 1,
  imageUrl: item.image,
  badge: item.badge,
  dietary: item.dietary,
}));

// ---------------------------------------------------------------------------
// MOMcha — matcha café, Mombasa (momcha.vercel.app). Sections use sub-groups
// (`group`) and small/large pricing (`priceLarge`).
// ---------------------------------------------------------------------------

const momchaRestaurant: Restaurant = {
  id: "rest_momcha",
  slug: "momcha",
  name: "MOMcha",
  tagline: "Sip. Smile. Repeat.",
  description:
    "Matcha lattes, specialty coffee, iced drinks, mojitos, waffles and more — Mombasa's matcha café.",
  phone: "+254 700 123 456",
  whatsapp: "+254 700 123 456",
  email: "hello@momcha.co.ke",
  address: "Mombasa, Kenya",
  currency: "KSh",
  openingHours: "Tuesday – Sunday · 11:00 AM – 11:00 PM",
  isPublished: true,
  createdAt: "2026-07-03T09:00:00Z",
};

interface MomchaSeedItem {
  name: string;
  price: number;
  priceLarge?: number;
  group?: string;
}

const momchaSeed: { id: string; title: string; items: MomchaSeedItem[] }[] = [
  {
    id: "matcha",
    title: "Matcha",
    items: [
      { name: "Matcha Latte", price: 650, group: "Classic Sips" },
      { name: "Vanilla Matcha Latte", price: 750, group: "Classic Sips" },
      { name: "Caramel Matcha Latte", price: 750, group: "Classic Sips" },
      { name: "Coconut Matcha Latte", price: 750, group: "Classic Sips" },
      { name: "Mango Matcha Latte", price: 750, group: "Fruity Sips" },
      { name: "Blueberry Matcha Latte", price: 750, group: "Fruity Sips" },
      { name: "Strawberry Matcha Latte", price: 750, group: "Fruity Sips" },
      { name: "Mixed Berry Matcha Latte", price: 750, group: "Fruity Sips" },
      { name: "Lotus Matcha Latte", price: 750, group: "Decadent Sips" },
      { name: "White Choc Matcha Latte", price: 750, group: "Decadent Sips" },
    ],
  },
  {
    id: "coffee",
    title: "Coffee",
    items: [
      { name: "Latte", price: 350 },
      { name: "Espresso", price: 200 },
      { name: "Cappuccino", price: 350 },
      { name: "Caffè Mocha", price: 400 },
      { name: "Flat White", price: 350 },
      { name: "Americano", price: 250 },
      { name: "Spanish Latte", price: 350 },
      { name: "Latte Macchiato", price: 350 },
      { name: "Espresso Macchiato", price: 250 },
    ],
  },
  {
    id: "iced-coffee",
    title: "Iced Coffee",
    items: [
      { name: "Iced Latte", price: 400 },
      { name: "Iced Cappuccino", price: 400 },
      { name: "Iced Americano", price: 350 },
      { name: "Iced Mocha", price: 450 },
      { name: "Iced Spanish Latte", price: 500 },
    ],
  },
  {
    id: "warm-drinks",
    title: "Warm Drinks",
    items: [
      { name: "Matcha Latte", price: 400 },
      { name: "Karak", price: 400 },
      { name: "Hot Chocolate", price: 350 },
      { name: "Dawa", price: 350 },
    ],
  },
  {
    id: "iced-drinks",
    title: "Iced Drinks",
    items: [
      { name: "Iced Karak", price: 500 },
      { name: "Cold Dawa", price: 400 },
    ],
  },
  {
    id: "mojitos",
    title: "Mojitos",
    items: [
      { name: "Classic", price: 550, priceLarge: 650 },
      { name: "Strawberry", price: 550, priceLarge: 650 },
      { name: "Passion", price: 550, priceLarge: 650 },
      { name: "Mixed Berry", price: 550, priceLarge: 650 },
    ],
  },
  {
    id: "waffles",
    title: "Waffles",
    items: [
      { name: "Lotus Waffle", price: 650 },
      { name: "Chocolate Waffle", price: 650 },
      { name: "Pistachio Waffle", price: 650 },
      { name: "Scoop of Ice Cream", price: 100 },
    ],
  },
  {
    id: "extras",
    title: "Extras",
    items: [
      { name: "Shot of Matcha", price: 150 },
      { name: "Shot of Flavour", price: 100 },
      { name: "Upsize to Large", price: 100 },
      { name: "Oat Milk", price: 100 },
      { name: "Almond Milk", price: 100 },
    ],
  },
  {
    id: "cold-foams",
    title: "Cold Foams",
    items: [
      { name: "Sea Salt & Vanilla", price: 50 },
      { name: "Cinnamon & Coconut", price: 50 },
      { name: "Cardamom & Date", price: 50 },
    ],
  },
];

const momchaCategories: MenuCategory[] = momchaSeed.map((section, index) => ({
  id: `mo-${section.id}`,
  restaurantId: momchaRestaurant.id,
  name: section.title,
  description: "",
  sortOrder: index + 1,
}));

const momchaItems: MenuItem[] = momchaSeed.flatMap((section) =>
  section.items.map((item, index) => ({
    id: `mo-${section.id}-${slugify(item.name)}`,
    restaurantId: momchaRestaurant.id,
    categoryId: `mo-${section.id}`,
    name: item.name,
    description: "",
    price: item.price,
    isAvailable: true,
    isFeatured: false,
    sortOrder: index + 1,
    group: item.group,
    priceLarge: item.priceLarge,
  }))
);

// ---------------------------------------------------------------------------

export const mockRestaurants: Restaurant[] = [
  hanamRestaurant,
  momchaRestaurant,
  quicktapRestaurant,
  saffronRestaurant,
];
export const mockCategories: MenuCategory[] = [
  ...hanamCategories,
  ...momchaCategories,
  ...quicktapCategories,
  ...saffronCategories,
];
export const mockItems: MenuItem[] = [
  ...hanamItems,
  ...momchaItems,
  ...quicktapItems,
  ...saffronItems,
];

// The restaurant the admin opens on first load.
export const adminRestaurant = hanamRestaurant;
