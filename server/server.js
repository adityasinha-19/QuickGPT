import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./configs/db.js";
import { stripeWebHooks } from "./controllers/webhooks.controller.js";

const app = express();

await connectDB();

// stripe webhooks
app.post(
  "/api/stripe",
  express.raw({ type: "application/json" }),
  stripeWebHooks
);

// middlewares
app.use(cors());
app.use(express.json());

// import routes
import userRouter from "./routes/user.route.js";
import chatRouter from "./routes/chat.route.js";
import messageRouter from "./routes/message.route.js";
import creditRouter from "./routes/credit.route.js";

// routes
app.get("/", (req, res) => {
  res.send("Server is Live!⚙️");
});
app.use("/api/user", userRouter);
app.use("/api/chat", chatRouter);
app.use("/api/messages", messageRouter);
app.use("/api/credits", creditRouter);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🔗Server is running on port ${PORT}`);
});
