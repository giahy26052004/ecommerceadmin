import { mongooseConnect } from "@/lib/mongoose";
import { Order } from "@/models/order";

export default async function handle(req, res) {
  await mongooseConnect();
  res.json(await Order.find().sort({ createAt: -1 }));
}
