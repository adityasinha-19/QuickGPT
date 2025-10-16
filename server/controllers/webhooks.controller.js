import Stripe from "stripe";
import Transaction from "../models/Transaction.model.js ";
import User from "../models/User.model.js";

export const stripeWebHooks = async (request, response) => {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  const sign = request.headers["stripe-signature"];

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      request.body,
      sign,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (error) {
    return response.status(400).send(`webhook Error: ${error.messsage}`);
  }

  try {
    switch (event.type) {
      case "payment_intent.succeeded": {
        const paymentIntent = event.data.object;
        const sessionList = await stripe.checkout.sessions.list({
          payment_intent: paymentIntent.id,
        });

        const session = sessionList.data[0];
        const { transactionId, appId } = session.metadata;

        if (appId === "quickgpt") {
          const transaction = await Transaction.findOne({
            _id: transactionId,
            isPaid: false,
          });

          // update credits in user account
          await User.updateOne(
            {
              _id: transaction.userId,
            },
            { $inc: { credits: transaction.credits } }
          );

          // update credit payment status
          transaction.isPaid = true;
          await transaction.save();
        } else {
          return response.json({
            recived: true,
            message: "Ignored event: Invalid app",
          });
        }
        break;
      }

      default:
        console.log("Unhandled event type,", event.type);

        break;
    }

    response.json({ recived: true });
  } catch (error) {
    console.error("Webhook processing error", error);
    response.status(500).send(`Internal servor error`);
  }
};
