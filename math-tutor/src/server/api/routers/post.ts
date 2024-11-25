import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const postRouter = createTRPCRouter({
  solveMath: publicProcedure
    .input(
      z.object({
        text: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const { text } = input;
      try {
        // Query OpenAI API
        const response = await openai.chat.completions.create({
          model: "gpt-3.5-turbo", // Use the ChatGPT model
          messages: [
            {
              role: "system",
              content:
                "If the math problem isn’t a multiplication problem, return a empty message. if it is then solve the given math problem and give the output as a JSON object. In the JSON object, have a key called steps, where the value is an array of strings and each element of the array is a step in solving the math problem, do not include the final solution in the list of steps. Have another key called firstNumber and another key called secondNumber, those keys will hold the values of the numbers being multiplied.",
            },
            {
              role: "user",
              content: text,
            },
          ],
        });
        console.log("response ", response);
        // Extract the response text
        const solution = response.choices[0]?.message?.content ?? "No response";

        return { solution };
      } catch (error) {
        console.error("Error calling OpenAI API:", error);
        throw new Error("Failed to process the math problem.");
      }

    }),

});
