import express from "express";
import authRoutes from "./src/routes/companyRouter.js";
import productRoutes from "./src/routes/prodctRouter.js";
import helmet from "helmet";
import cors from "cors";
const app = express();

const port = parseInt(process.env.PORT) || 8080;
app.use(express.json());
app.use("/auth", authRoutes);
app.use("/product", productRoutes);
app.use("/uploads", express.static("uploads"));

app.use(helmet());
app.use(cors());


app.get("/", (req, res) => {
  res.send("Hello, world!");
});
app.use((err, req, res, next) => {
  if (err.status === 500 || !err.status) {
    res.status(500).json({
      message: "Internal Server Error",
      error: err.message,
    });
  } else {
    next(err);
  }
});

app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}`);
});
