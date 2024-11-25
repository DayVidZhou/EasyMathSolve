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
- press submit chosen image button
- follow steps to learn math!

- this doesn't really work well with hand written (probably have to switch out tesseract js with another OCR)
- in future might switch out TRPC with a REST solution, TRPC not being able to handle File uploads is annoying
