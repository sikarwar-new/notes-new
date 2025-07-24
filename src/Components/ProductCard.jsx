import React from "react";
import { useCart } from "../contexts/CartContext";

const Card = ({
  title,
  subject,
  numRatings,
  price,
  btn = "Add to Cart",
  isBought = false,
}) => {
  const { addToCart, removeFromCart, isInCart } = useCart();

  const alreadyInCart = isInCart(title);

  const handleClick = () => {
    if (alreadyInCart) {
      removeFromCart(title);
    } else {
      addToCart({ title, subject, numRatings, price });
    }
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm hover:shadow-md transition-shadow duration-200">
      <h3 className="text-lg font-medium text-gray-900 mb-1">{title}</h3>
      <p className="text-sm text-gray-500 mb-1">{subject}</p>
      <p className="text-xs text-gray-400 mb-3">⭐ {numRatings} ratings</p>

      {!isBought && (
        <p className="text-md font-semibold text-green-600 mb-4">₹{price}</p>
      )}

      <button
        onClick={!isBought ? handleClick : undefined}
        className={`w-full py-2 px-4 rounded-md text-sm font-medium transition-colors duration-150 ${
          isBought
            ? "bg-gray-200 text-gray-700 hover:bg-gray-300"
            : alreadyInCart
            ? "bg-red-500 text-white hover:bg-red-600"
            : "bg-orange-500 text-white hover:bg-orange-600"
        }`}
      >
        {isBought ? "Start Reading" : alreadyInCart ? "Remove Item" : btn}
      </button>
    </div>
  );
};

export default Card;
