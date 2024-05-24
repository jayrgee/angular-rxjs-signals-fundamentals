import { Injectable, computed, effect, signal } from "@angular/core";
import { CartItem } from "./cart";
import { Product } from "../products/product";

@Injectable({
  providedIn: 'root'
})
export class CartService {
  cartItems = signal<CartItem[]>([]);

  cartCount = computed(() => this.cartItems()
    .reduce((acc, item) => acc + item.quantity, 0)
  );

  subTotal = computed(() => this.cartItems().reduce((acc, item) => 
    acc + (item.quantity * item.product.price), 0));

  deliveryFee = computed<number>(() => this.subTotal() < 50 ? 5.99 : 0);

  tax = computed(() => Math.round(this.subTotal() * 10.75) / 100);

  totalPrice = computed(() => this.subTotal() + this.deliveryFee() + this.tax());

  eLength = effect(() => console.log('Cart size:', this.cartItems().length));

  addToCart(product: Product): void {
    const existingItems = this.cartItems().filter(item => item.product.id === product.id);
    if (existingItems.length === 0) {
      this.cartItems.update(items => [...items, {product, quantity: 1}]);
    } else {
      const existingItem = existingItems[0];
      this.updateQuantity(existingItem, existingItem.quantity + 1)
    }
  }

  removeFromCart(cartItem: CartItem): void {
    this.cartItems.update(items =>
      items.filter(item => item.product.id !== cartItem.product.id));
  }

  updateQuantity(cartItem: CartItem, quantity: number): void {
    this.cartItems.update(items =>
      items.map(item =>
        item.product.id === cartItem.product.id
          ? { ...item, quantity }
          : item
        ));
  }
}
