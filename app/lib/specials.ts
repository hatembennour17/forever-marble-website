export type SpecialImage = { image: string; alt: string };
export type Special = { id: string; name: string; before: number | null; price: number; minimumSqFt: number; image: string; alt: string; hidden: boolean; order: number; imageHistory?: SpecialImage[] };
export const defaultSpecials: Special[] = [
  {
    "id": "special-azul-platino",
    "name": "Azul Platino",
    "before": 49.99,
    "price": 34.99,
    "minimumSqFt": 50,
    "image": "/images/specials-slabs/azul-platino.jpg",
    "alt": "Azul Platino countertop slab special",
    "hidden": false,
    "order": 0
  },
  {
    "id": "special-genesis",
    "name": "Genesis",
    "before": 65.99,
    "price": 49.99,
    "minimumSqFt": 50,
    "image": "/images/specials-slabs/genesis.jpg",
    "alt": "Genesis countertop slab special",
    "hidden": false,
    "order": 1
  },
  {
    "id": "special-caffe-latte",
    "name": "Caffe Latte",
    "before": 65.99,
    "price": 49.99,
    "minimumSqFt": 50,
    "image": "/images/specials-slabs/caffe-latte.jpg",
    "alt": "Caffe Latte countertop slab special",
    "hidden": false,
    "order": 2
  },
  {
    "id": "special-santa-cecilia",
    "name": "Santa Cecilia",
    "before": 55.99,
    "price": 34.99,
    "minimumSqFt": 50,
    "image": "/images/specials-slabs/santa-cecilia.jpg",
    "alt": "Santa Cecilia countertop slab special",
    "hidden": false,
    "order": 3
  },
  {
    "id": "special-steel-grey",
    "name": "Steel Grey",
    "before": 54.99,
    "price": 44.99,
    "minimumSqFt": 50,
    "image": "/images/specials-slabs/steel-grey.jpg",
    "alt": "Steel Grey countertop slab special",
    "hidden": false,
    "order": 4
  },
  {
    "id": "special-brazilian-black",
    "name": "Brazilian Black",
    "before": 55.99,
    "price": 34.99,
    "minimumSqFt": 50,
    "image": "/images/specials-slabs/brazilian-black.jpg",
    "alt": "Brazilian Black countertop slab special",
    "hidden": false,
    "order": 5
  },
  {
    "id": "special-arctic-pearl",
    "name": "Arctic Pearl",
    "before": 59.99,
    "price": 39.99,
    "minimumSqFt": 50,
    "image": "/images/specials-slabs/arctic-pearl.jpg",
    "alt": "Arctic Pearl countertop slab special",
    "hidden": false,
    "order": 6
  },
  {
    "id": "special-giallo-vicenza",
    "name": "Giallo Vicenza",
    "before": 59.99,
    "price": 44.99,
    "minimumSqFt": 50,
    "image": "/images/specials-slabs/giallo-vicenza.jpg",
    "alt": "Giallo Vicenza countertop slab special",
    "hidden": false,
    "order": 7
  },
  {
    "id": "special-fantasy-brown",
    "name": "Fantasy Brown",
    "before": 65.99,
    "price": 49.99,
    "minimumSqFt": 50,
    "image": "/images/specials-slabs/fantasy-brown.jpg",
    "alt": "Fantasy Brown countertop slab special",
    "hidden": false,
    "order": 8
  },
  {
    "id": "special-patagonia-granite",
    "name": "Patagonia Granite",
    "before": 79.99,
    "price": 59.99,
    "minimumSqFt": 50,
    "image": "/images/specials-slabs/patagonia-granite.jpg",
    "alt": "Patagonia Granite countertop slab special",
    "hidden": false,
    "order": 9
  },
  {
    "id": "special-emerald-pearl",
    "name": "Emerald Pearl",
    "before": 75.99,
    "price": 59.99,
    "minimumSqFt": 50,
    "image": "/images/specials-slabs/emerald-pearl.jpg",
    "alt": "Emerald Pearl countertop slab special",
    "hidden": false,
    "order": 10
  }
];
export const formatPrice = (value: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value);
