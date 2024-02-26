require("dotenv").config()
const express = require("express")
const axios = require("axios")
const app = express()
const port = process.env.PORT || 3000
const cors = require("cors")

const corsOptions = {
    origin: "https://biblefy-app.vercel.app",
    optionsSuccessStatus: 200,
}

app.use(cors(corsOptions))

app.use(express.static("public"))

app.use(express.json())

app.post("/get-response", async (req, res) => {
    try {
        const response = await axios.post(
            "https://api.openai.com/v1/chat/completions",
            {
                model: "gpt-3.5-turbo",
                messages: req.body.messages,
            },
            {
                headers: {
                    Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
                },
            }
        )
        res.json(response.data)
    } catch (error) {
        console.error(
            "Error calling OpenAI:",
            error.response ? error.response.data : error.message
        )
        res.status(500).json({
            message: "Error processing your request",
            error: error.message,
        })
    }
})

app.listen(port, () => {
    console.log(`Server running on port ${port}`)
})
