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

export const mockRestaurants: Restaurant[] = [hanamRestaurant, saffronRestaurant];
export const mockCategories: MenuCategory[] = [
  ...hanamCategories,
  ...saffronCategories,
];
export const mockItems: MenuItem[] = [...hanamItems, ...saffronItems];

// The restaurant the admin console manages in this single-tenant MVP.
export const adminRestaurant = hanamRestaurant;
