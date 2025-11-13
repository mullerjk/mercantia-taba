"use client";

import { useState } from "react";
import { GlobalSidebar } from "@/components/global-sidebar";
import { DockNavigation } from "@/components/dock-navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useCart } from "@/contexts/CartContext";
import { useTranslation } from "@/contexts/TranslationContext";
import { ArrowLeft, CreditCard, Truck, ShoppingBag } from "lucide-react";
import Link from "next/link";

export default function Checkout() {
  const [showSidebar, setShowSidebar] = useState(false);
  const { state, updateQuantity, removeItem, clearCart } = useCart();
  const { t } = useTranslation();

  const [shippingInfo, setShippingInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States'
  });

  const [paymentMethod, setPaymentMethod] = useState('card');
  const [billingSameAsShipping, setBillingSameAsShipping] = useState(true);

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  const handleRouteChange = (route: string) => {
    console.log("Route change:", route);
  };

  const handleEntitySelect = (entityName: string) => {
    console.log("Entity selected in checkout:", entityName);
  };

  const handleQuantityChange = (id: string, newQuantity: number) => {
    if (newQuantity < 0) {
      // Prevent negative quantities
      updateQuantity(id, 0);
    } else {
      updateQuantity(id, newQuantity);
    }
  };

  const shippingCost = state.total > 50 ? 0 : 9.99;
  const tax = state.total * 0.08; // 8% tax
  const finalTotal = state.total + shippingCost + tax;

  const handlePlaceOrder = () => {
    // Here you would integrate with a payment processor
    alert('Order placed successfully! (This is a demo)');
    clearCart();
    // Redirect to order confirmation page
  };

  if (state.items.length === 0) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <ShoppingBag className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h1 className="text-2xl font-bold mb-2">{t('checkout.emptyCart')}</h1>
            <p className="text-muted-foreground mb-6">{t('checkout.emptyCartDesc')}</p>
            <Link href="/marketplace">
              <Button>
                {t('checkout.continueShopping')}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <div className="relative w-full p-8 pb-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <Link href="/marketplace">
              <Button variant="outline" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                {t('checkout.backToMarketplace')}
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold">{t('checkout.title')}</h1>
              <p className="text-muted-foreground">{t('checkout.subtitle')}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full px-8 pb-24">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Summary */}
          <div className="lg:col-span-2 space-y-6">
            {/* Cart Items */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5" />
                  {t('checkout.orderSummary')}
                </CardTitle>
                <CardDescription>
                  {t('checkout.reviewItems')}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {state.items.map((item) => (
                  <div key={item.id} className="flex items-center gap-4 p-4 border rounded-lg">
                    <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center">
                      <ShoppingBag className="w-8 h-8" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium">{item.name}</h4>
                      <p className="text-sm text-muted-foreground">{item.category}</p>
                      <p className="text-sm font-medium">${item.price.toFixed(2)}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                      >
                        -
                      </Button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                      >
                        +
                      </Button>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => removeItem(item.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        {t('checkout.remove')}
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Shipping Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Truck className="w-5 h-5" />
                  {t('checkout.shippingInfo')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">{t('checkout.firstName')}</Label>
                    <Input
                      id="firstName"
                      value={shippingInfo.firstName}
                      onChange={(e) => setShippingInfo({...shippingInfo, firstName: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">{t('checkout.lastName')}</Label>
                    <Input
                      id="lastName"
                      value={shippingInfo.lastName}
                      onChange={(e) => setShippingInfo({...shippingInfo, lastName: e.target.value})}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="email">{t('checkout.email')}</Label>
                  <Input
                    id="email"
                    type="email"
                    value={shippingInfo.email}
                    onChange={(e) => setShippingInfo({...shippingInfo, email: e.target.value})}
                  />
                </div>

                <div>
                  <Label htmlFor="phone">{t('checkout.phone')}</Label>
                  <Input
                    id="phone"
                    value={shippingInfo.phone}
                    onChange={(e) => setShippingInfo({...shippingInfo, phone: e.target.value})}
                  />
                </div>

                <div>
                  <Label htmlFor="address">{t('checkout.address')}</Label>
                  <Input
                    id="address"
                    value={shippingInfo.address}
                    onChange={(e) => setShippingInfo({...shippingInfo, address: e.target.value})}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="city">{t('checkout.city')}</Label>
                    <Input
                      id="city"
                      value={shippingInfo.city}
                      onChange={(e) => setShippingInfo({...shippingInfo, city: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="state">{t('checkout.state')}</Label>
                    <Input
                      id="state"
                      value={shippingInfo.state}
                      onChange={(e) => setShippingInfo({...shippingInfo, state: e.target.value})}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="zipCode">{t('checkout.zipCode')}</Label>
                    <Input
                      id="zipCode"
                      value={shippingInfo.zipCode}
                      onChange={(e) => setShippingInfo({...shippingInfo, zipCode: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="country">{t('checkout.country')}</Label>
                    <Input
                      id="country"
                      value={shippingInfo.country}
                      onChange={(e) => setShippingInfo({...shippingInfo, country: e.target.value})}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  {t('checkout.paymentInfo')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="billingSame"
                    checked={billingSameAsShipping}
                    onChange={(e) => setBillingSameAsShipping(e.target.checked)}
                    className="h-4 w-4"
                  />
                  <Label htmlFor="billingSame">{t('checkout.billingSameAsShipping')}</Label>
                </div>

                <div className="space-y-2">
                  <Label>{t('checkout.paymentMethod')}</Label>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <input
                        type="radio"
                        id="card"
                        name="paymentMethod"
                        value="card"
                        checked={paymentMethod === 'card'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                      />
                      <Label htmlFor="card">{t('checkout.creditDebitCard')}</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="radio"
                        id="paypal"
                        name="paymentMethod"
                        value="paypal"
                        checked={paymentMethod === 'paypal'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                      />
                      <Label htmlFor="paypal">{t('checkout.paypal')}</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="radio"
                        id="bank"
                        name="paymentMethod"
                        value="bank"
                        checked={paymentMethod === 'bank'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                      />
                      <Label htmlFor="bank">{t('checkout.bankTransfer')}</Label>
                    </div>
                  </div>
                </div>

                {paymentMethod === 'card' && (
                  <div className="space-y-4 mt-4">
                    <div>
                      <Label htmlFor="cardNumber">{t('checkout.cardNumber')}</Label>
                      <Input id="cardNumber" placeholder="1234 5678 9012 3456" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="expiry">{t('checkout.expiryDate')}</Label>
                        <Input id="expiry" placeholder="MM/YY" />
                      </div>
                      <div>
                        <Label htmlFor="cvv">{t('checkout.cvv')}</Label>
                        <Input id="cvv" placeholder="123" />
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Order Summary Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>{t('checkout.orderSummaryTitle')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>{t('checkout.subtotal')} ({state.itemCount} {t('checkout.items')})</span>
                  <span>${state.total.toFixed(2)}</span>
                </div>

                <div className="flex justify-between">
                  <span>{t('checkout.shipping')}</span>
                  <span>{shippingCost === 0 ? t('checkout.free') : `$${shippingCost.toFixed(2)}`}</span>
                </div>

                <div className="flex justify-between">
                  <span>{t('checkout.tax')}</span>
                  <span>${tax.toFixed(2)}</span>
                </div>

                <div className="border-t border-border my-4"></div>

                <div className="flex justify-between text-lg font-bold">
                  <span>{t('checkout.total')}</span>
                  <span>${finalTotal.toFixed(2)}</span>
                </div>

                <Button
                  className="w-full"
                  size="lg"
                  onClick={handlePlaceOrder}
                  disabled={!shippingInfo.firstName || !shippingInfo.email}
                >
                  {t('checkout.placeOrder')} - ${finalTotal.toFixed(2)}
                </Button>

                <p className="text-xs text-muted-foreground text-center">
                  {t('checkout.termsAgreement')}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">{t('checkout.secureCheckout')}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">
                  {t('checkout.secureCheckoutDesc')}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Global Sidebar Overlay */}
      <GlobalSidebar
        isVisible={showSidebar}
        onClose={() => setShowSidebar(false)}
        onRouteChange={handleRouteChange}
        onEntitySelect={handleEntitySelect}
      />

      {/* Dock Navigation */}
      <DockNavigation
        showSidebar={showSidebar}
        onToggleSidebar={toggleSidebar}
      />
    </div>
  );
}
