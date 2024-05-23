import express from "express";

const app = express();

const port = parseInt(process.env.PORT) || 8080;


app.get("/", (req, res) => {
  res.send("Hello, world!");
});

app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}`);
})