import express from "express"
import userRoutes from "./routes/userRoutes";
const app = express();
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Hello World!");
});

app.use("/", userRoutes)

app.listen(3001, () => {
    console.log("Running on port 3001");
})