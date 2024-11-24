import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import OpenAI from 'openai';



// Mocked DB
interface Post {
  id: number;
  name: string;
}
const posts: Post[] = [
  {
    id: 1,
    name: "Hello World",
  },
];

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const postRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),

  create: publicProcedure
    .input(z.object({ name: z.string().min(1) }))
    .mutation(async ({ input }) => {
      const post: Post = {
        id: posts.length + 1,
        name: input.name,
      };
      posts.push(post);
      return post;
    }),

  getLatest: publicProcedure.query(() => {
    return posts.at(-1) ?? null;
  }),

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
                "You are a helpful assistant. If given a math problem, provide a step-by-step solution. If it's not a math problem, respond with 'This is not a math problem.'",
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
