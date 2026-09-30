class Product {
  constructor(name, price) {
    this.name = name;
    this.price = price;
  }

  get formattedPrice() {
    return `฿${this.price.toFixed(2)}`;
  }

  describe() {
    return `Product: ${this.name} - ${this.formattedPrice}`;
  }
}

class DiscountedProduct extends Product {
  constructor(name, price, discountPercent) {
    super(name, price);
    this.discountPercent = discountPercent;
  }

  get discountedPrice() {
    return this.price * (1 - this.discountPercent / 100);
  }

  describe() {
    return `${super.describe()} (${this.discountPercent}% off → ฿${this.discountedPrice.toFixed(2)})`;
  }
}

const p = new Product('Glass', 120);
console.log(p.formattedPrice);
console.log(p.describe());

const d = new DiscountedProduct('Glass', 120, 20);
console.log(d.discountedPrice);
console.log(d.describe());
