// app/api/payments/route.js
import Razorpay from "razorpay";
import connectDB from "@/lib/db";

const RZ_ID = process.env.RAZORPAY_KEY_ID;
const RZ_SECRET = process.env.RAZORPAY_KEY_SECRET;

export async function POST(req) {
  await connectDB();
  const body = await req.json(); // { amount, currency }
  if (!body.amount) return new Response(JSON.stringify({ error: "amount required" }), { status: 400 });

  const razorpay = new Razorpay({ key_id: RZ_ID, key_secret: RZ_SECRET });
  try {
    const order = await razorpay.orders.create({
      amount: Math.round(Number(body.amount) * 100),
      currency: body.currency || "INR",
      receipt: body.receipt || `rcpt_${Date.now()}`
    });
    return new Response(JSON.stringify(order), { status: 201 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
