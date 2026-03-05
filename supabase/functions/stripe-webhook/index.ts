import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@11.1.0?target=deno";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") as string, {
  apiVersion: "2022-11-15",
  httpClient: Stripe.createFetchHttpClient(),
});

const endpointSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET") as string;

// Need service role to bypass RLS and update campaign status
const supabase = createClient(
  Deno.env.get("SUPABASE_URL") ?? "",
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
);

serve(async (req: Request) => {
  const signature = req.headers.get("stripe-signature");

  if (!signature) {
    return new Response("No signature", { status: 400 });
  }

  try {
    const body = await req.text();
    let event;

    try {
      event = stripe.webhooks.constructEvent(body, signature, endpointSecret);
    } catch (err: unknown) {
      const e = err as Error;
      console.error(`Webhook signature verification failed: ${e.message}`);
      return new Response(`Webhook Error: ${e.message}`, { status: 400 });
    }

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      const campaignId = session.client_reference_id;

      if (campaignId) {
        // Activate the campaign upon successful payment
        const { error } = await supabase
          .from("ad_campaign")
          .update({ is_active: true })
          .eq("id", campaignId);

        if (error) {
          console.error("Failed to activate campaign:", error);
          throw error;
        }

        console.log(`Campaign ${campaignId} successfully activated via Stripe payment.`);
      }
    }

    return new Response(JSON.stringify({ received: true }), { status: 200 });
  } catch (err: unknown) {
    const e = err as Error;
    return new Response(
      JSON.stringify({ error: e.message }),
      { status: 400 }
    );
  }
});