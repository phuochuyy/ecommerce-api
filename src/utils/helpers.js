import { BadRequestError } from './errors.js';

// Format product response
export const formatProduct = (product) => ({
  id: product.id,
  name: product.name,
  description: product.description,
  price: product.price,
  originalPrice: product.originalPrice,
  image: product.image,
  images: product.images || [],
  category: product.category,
  stock: product.stock,
  rating: parseFloat(product.rating) || 0,
  reviewCount: product.reviewCount || 0,
  brand: product.brand,
  isPrime: product.isPrime || false,
  discount: product.discount,
  specifications: product.specifications || {}
});

// Format cart response
export const formatCart = (cartItems) => {
  const items = cartItems.map(item => ({
    product: {
      id: item.product.id,
      name: item.product.name,
      price: item.product.price,
      image: item.product.image
    },
    quantity: item.quantity
  }));

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);

  return {
    items,
    totalItems,
    totalPrice
  };
};

// Validate and parse ID
export const parseId = (id, resourceName = 'Resource') => {
  const parsedId = parseInt(id);
  if (isNaN(parsedId)) {
    throw new BadRequestError(`Invalid ${resourceName.toLowerCase()} ID`);
  }
  return parsedId;
};

// Build product where clause for filtering
export const buildProductWhere = (category, search) => {
  const where = {};
  
  if (category && search) {
    where.AND = [
      { category },
      {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } }
        ]
      }
    ];
  } else if (category) {
    where.category = category;
  } else if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } }
    ];
  }
  
  return where;
};

// Build orderBy clause
export const buildOrderBy = (sort, order, validSortFields) => {
  const sortField = validSortFields.includes(sort) ? sort : 'id';
  const orderBy = {};
  orderBy[sortField] = order.toLowerCase() === 'desc' ? 'desc' : 'asc';
  return orderBy;
};

