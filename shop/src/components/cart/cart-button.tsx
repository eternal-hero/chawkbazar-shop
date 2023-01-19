import CartIcon from "@components/icons/cart-icon";
import { useUI } from "@contexts/ui.context";
import { useCart } from "@store/quick-cart/cart.context";

const CartButton = () => {
  const { openCart } = useUI();
  const { totalItems } = useCart();
  function handleCartOpen() {
    return openCart();
  }

  return (
    <button
      className="flex items-center justify-center flex-shrink-0 h-auto relative focus:outline-none transform"
      onClick={handleCartOpen}
      aria-label="cart-button"
    >
      <CartIcon />
      <span className="cart-counter-badge flex items-center justify-center bg-heading text-white absolute -top-3 -end-2.5 xl:-end-3 rounded-full font-bold">
        {totalItems}
      </span>
    </button>
  );
};

export default CartButton;
