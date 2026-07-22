export function buildVehicleSearchFilter({ make, model, category, minPrice, maxPrice }) {
  const filter = {};

  if (make) {
    filter.make = { $regex: make, $options: 'i' };
  }

  if (model) {
    filter.model = { $regex: model, $options: 'i' };
  }

  if (category) {
    filter.category = category.toLowerCase();
  }

  if (minPrice !== undefined && minPrice !== '') {
    filter.price = { ...filter.price, $gte: Number(minPrice) };
  }

  if (maxPrice !== undefined && maxPrice !== '') {
    filter.price = { ...filter.price, $lte: Number(maxPrice) };
  }

  return filter;
}
