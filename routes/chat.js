const express = require("express");
const router = express.Router();

const { HfInference } = require("@huggingface/inference");

const hf = new HfInference(process.env.HF_TOKEN);


router.post("/chat", async (req, res) => {

    try {

        const { message, mode } = req.body;


        const prompt = `
You are KIKO, a friendly AI coding tutor.

Student level:
${mode || "Beginner"}

Rules:
- Teach programming clearly.
- Explain step by step.
- Use examples.
- Be encouraging.
- Adapt to the student's age.

Student question:
${message}

KIKO:
`;


        const response = await hf.chatCompletion({

            model: "meta-llama/Llama-3.1-8B-Instruct",

            messages: [
                {
                    role: "user",
                    content: prompt
                }
            ],

            max_tokens: 500
        });


        res.json({
            reply: response.choices[0].message.content
        });


    } catch(error){

        console.error(error);

        res.status(500).json({
            error: "KIKO AI connection failed"
        });

    }

});


module.exports = router;