import { Stripe } from "stripe";

export default defineEventHandler(async (event) => {
  // To Do:
  // 1.) take in artwork id from body
  // 2.) lookup artwork price on server
  const config = useRuntimeConfig();
  const stripe = new Stripe(config.public.stripeSecretKey);
  const amount = 1000;
  const currency = "usd";

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "payment",
    line_items: [
      {
        price_data: {
          currency,
          product_data: {
            name: "Nuxt 4 Stripe Payment",
          },
          unit_amount: amount,
        },
        quantity: 1,
      },
    ],
    success_url: `${
      getRequestURL(event).origin
    }/payments/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${getRequestURL(event).origin}/payments/cancel`,
  });

  return { url: session.url };
});
