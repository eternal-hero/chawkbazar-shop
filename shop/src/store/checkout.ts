import { Address, Coupon } from '@framework/types';
import { CHECKOUT } from '@lib/constants';
import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';
interface DeliveryTime {
  id: string;
  title: string;
  description: string;
}
interface VerifiedResponse {
  total_tax: number;
  shipping_charge: number;
  unavailable_products: any[];
}
interface CheckoutState {
  billing_address: Address | null;
  shipping_address: Address | null;
  payment_gateway: PaymentMethodName;
  delivery_time: DeliveryTime | null;
  customer_contact: string;
  verified_response: VerifiedResponse | null;
  coupon: Coupon | null;
  [key: string]: unknown;
}
export const defaultCheckout: CheckoutState = {
  billing_address: null,
  shipping_address: null,
  delivery_time: null,
  payment_gateway: 'STRIPE',
  customer_contact: '',
  verified_response: null,
  coupon: null,
};
export type PaymentMethodName = 'CASH_ON_DELIVERY' | 'STRIPE';

// Original atom.
export const checkoutAtom = atomWithStorage(CHECKOUT, defaultCheckout);
export const clearCheckoutAtom = atom(null, (_get, set, _data) => {
  return set(checkoutAtom, defaultCheckout);
});
export const billingAddressAtom = atom(
  (get) => get(checkoutAtom).billing_address,
  (get, set, data: Address) => {
    const prev = get(checkoutAtom);
    return set(checkoutAtom, { ...prev, billing_address: data });
  }
);
export const shippingAddressAtom = atom(
  (get) => get(checkoutAtom).shipping_address,
  (get, set, data: Address) => {
    const prev = get(checkoutAtom);
    return set(checkoutAtom, { ...prev, shipping_address: data });
  }
);
export const deliveryTimeAtom = atom(
  (get) => get(checkoutAtom).delivery_time,
  (get, set, data: DeliveryTime) => {
    const prev = get(checkoutAtom);
    return set(checkoutAtom, { ...prev, delivery_time: data });
  }
);
export const paymentGatewayAtom = atom(
  (get) => get(checkoutAtom).payment_gateway,
  (get, set, data: PaymentMethodName) => {
    const prev = get(checkoutAtom);
    return set(checkoutAtom, { ...prev, payment_gateway: data });
  }
);
export const verifiedTokenAtom = atom(
  (get) => get(checkoutAtom).token,
  (get, set, data: string) => {
    const prev = get(checkoutAtom);
    return set(checkoutAtom, { ...prev, token: data });
  }
);
export const customerContactAtom = atom(
  (get) => get(checkoutAtom).customer_contact,
  (get, set, data: string) => {
    const prev = get(checkoutAtom);
    return set(checkoutAtom, { ...prev, customer_contact: data });
  }
);
export const verifiedResponseAtom = atom(
  (get) => get(checkoutAtom).verified_response,
  (get, set, data: VerifiedResponse | null) => {
    const prev = get(checkoutAtom);
    return set(checkoutAtom, { ...prev, verified_response: data });
  }
);
export const couponAtom = atom(
  (get) => get(checkoutAtom).coupon,
  (get, set, data: Coupon | null) => {
    const prev = get(checkoutAtom);
    return set(checkoutAtom, { ...prev, coupon: data });
  }
);
export const discountAtom = atom((get) => get(checkoutAtom).coupon?.amount);
