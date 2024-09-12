import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { stripeProducts } from '@/app/constants';

export async function GET() {
  const stripe = new Stripe(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY || '');
  const ids = stripeProducts.map((product) => product.id);
  const products = await stripe.products.list({
    ids,
  });

  return NextResponse.json({ message: products });
}
