import express from "express"
import userRoutes from "./routes/userRoutes";
import { prisma } from "@repo/db/db";
const app = express();
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Hello World!");
});

app.use("/", userRoutes)


app.get("/chats/:roomId", async (req, res) => {
    const roomId = req.params.roomId
    const messages = await prisma.chat.findMany({
        where: {
            roomId: roomId
        },
        orderBy: {
            id: "desc"
        },
        take: 50
    })

    res.json({ messages })

})
app.listen(3001, () => {
    console.log("Running on port 3001");
})