export const commaSeparated = (price) => (
  price.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
);