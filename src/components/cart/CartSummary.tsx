
import React from "react";
import { useCart } from "../../context/CartContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingBag } from "lucide-react";
import { toast } from "sonner";

const CartSummary: React.FC = () => {
  const { items, totalPrice, clearCart } = useCart();
  
  // Calculate subtotal (without discounts)
  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  
  // Calculate total discount
  const totalDiscount = subtotal - totalPrice;
  
  // Estimated tax (for demo purposes)
  const tax = totalPrice * 0.08;
  
  // Final total
  const finalTotal = totalPrice + tax;
  
  // Shipping fee (free over $100 for demo purposes)
  const shippingFee = totalPrice > 100 ? 0 : 10;

  const handleCheckout = () => {
    toast.success("This is a demo! Your order would be processed here in a real application.");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <ShoppingBag className="h-5 w-5 mr-2" />
          Order Summary
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Subtotal</span>
            <span className="font-medium">${subtotal.toFixed(2)}</span>
          </div>
          
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Discount</span>
            <span className="font-medium text-red-600">-${totalDiscount.toFixed(2)}</span>
          </div>
          
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Shipping</span>
            {shippingFee > 0 ? (
              <span className="font-medium">${shippingFee.toFixed(2)}</span>
            ) : (
              <span className="font-medium text-green-600">Free</span>
            )}
          </div>
          
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Estimated Tax</span>
            <span className="font-medium">${tax.toFixed(2)}</span>
          </div>
          
          <div className="border-t pt-4 flex justify-between">
            <span className="font-medium">Total</span>
            <span className="font-bold text-lg">${(finalTotal + shippingFee).toFixed(2)}</span>
          </div>

          {totalPrice > 100 && (
            <div className="bg-green-50 text-green-700 text-sm p-2 rounded">
              You've qualified for free shipping!
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex-col gap-3">
        <Button 
          className="w-full bg-brand-600 hover:bg-brand-700"
          onClick={handleCheckout}
        >
          Checkout
        </Button>
        
        <Button 
          variant="outline" 
          className="w-full"
          onClick={clearCart}
        >
          Clear Cart
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CartSummary;
