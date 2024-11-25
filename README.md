# Math tutor (only for 2 value multiplication)

to run this project, go into math-tutor directory and run

```
 pnpm dev
```

Afterwards add your openAi key to the .env file with

```
OPENAI_API_KEY="<your key>"
```

# how to use this

- First upload an image of a multiplication problem (preferrably not hand written)
- use the image below if you don't have one
- <img width="1080" alt="Screenshot 2024-11-24 at 5 16 07 PM" src="https://github.com/user-attachments/assets/9de6392f-b0a4-4139-be5e-99e612de8e09">
- press submit chosen image button
- follow steps to learn math!

- this doesn't really work well with hand written (probably have to switch out tesseract js with another OCR)
- in future might switch out TRPC with a REST solution, TRPC not being able to handle File uploads is annoying
