const normalize = (value = "") => String(value).toLowerCase().trim();

const CATEGORY_IMAGE_MAP = {
  food: {
    src: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=80",
    alt: "Fresh food items and meals"
  },
  clothing: {
    src: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1200&q=80",
    alt: "Clothing and fashion products"
  },
  fashion: {
    src: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1200&q=80",
    alt: "Fashion apparel collection"
  },
  electronics: {
    src: "https://images.unsplash.com/photo-1518773553398-650c184e0bb3?auto=format&fit=crop&w=1200&q=80",
    alt: "Electronic gadgets and devices"
  },
  books: {
    src: "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?auto=format&fit=crop&w=1200&q=80",
    alt: "Books and reading materials"
  },
  stationery: {
    src: "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1200&q=80",
    alt: "Stationery supplies and notebooks"
  },
  accessories: {
    src: "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&w=1200&q=80",
    alt: "Accessories and daily essentials"
  },
  handmade: {
    src: "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?auto=format&fit=crop&w=1200&q=80",
    alt: "Handmade and craft products"
  },
  general: {
    src: "https://images.unsplash.com/photo-1472851294608-062f824d29cc?auto=format&fit=crop&w=1200&q=80",
    alt: "Marketplace products"
  }
};

const KEYWORD_TO_CATEGORY = [
  { keys: ["pizza", "burger", "pasta", "salad", "cake", "wings", "food", "cafe"], category: "food" },
  { keys: ["t-shirt", "shirt", "jeans", "hoodie", "dress", "jacket", "clothing", "fashion", "sneakers"], category: "clothing" },
  { keys: ["electronics", "mouse", "keyboard", "webcam", "headset", "laptop", "usb"], category: "electronics" },
  { keys: ["book", "novel", "notebook", "calculator", "pen", "stationery"], category: "books" },
  { keys: ["accessories", "phone case", "power bank", "earphones", "screen protector"], category: "accessories" },
  { keys: ["handmade", "craft", "bracelet", "keychain", "wall art", "greeting card"], category: "handmade" }
];

const resolveCategory = (product) => {
  const categoryName = normalize(product?.categoryId?.name);
  const categorySlug = normalize(product?.categoryId?.slug);
  const productName = normalize(product?.name);
  const haystack = `${categoryName} ${categorySlug} ${productName}`;

  // 1) Strong match by explicit category fields
  for (const key of Object.keys(CATEGORY_IMAGE_MAP)) {
    if (key !== "general" && (categoryName.includes(key) || categorySlug.includes(key))) return key;
  }

  // 2) Fallback keyword detection
  for (const rule of KEYWORD_TO_CATEGORY) {
    if (rule.keys.some((key) => haystack.includes(key))) return rule.category;
  }

  return "general";
};

export const getProductImageData = (product) => {
  const category = resolveCategory(product);
  const item = CATEGORY_IMAGE_MAP[category] || CATEGORY_IMAGE_MAP.general;
  const name = product?.name ? String(product.name) : "Product";

  return {
    src: item.src,
    alt: `${name} - ${item.alt}`,
    fallbackSrc: CATEGORY_IMAGE_MAP.general.src
  };
};

export const applyImageFallback = (event, fallbackSrc = CATEGORY_IMAGE_MAP.general.src) => {
  const image = event.currentTarget;
  if (image.dataset.fallbackApplied === "1") return;
  image.dataset.fallbackApplied = "1";
  image.src = fallbackSrc;
};
