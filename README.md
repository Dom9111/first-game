# first-game

A small browser-based 3D demo with an AI voice chat assistant.

## Run locally

1. Install dependencies:
   npm install
2. Copy the example environment file:
   cp .env.example .env
3. Add your OpenAI API key to `.env`
4. Start the app:
   npm start
5. Open http://localhost:3000

## Notes

- This version uses an OpenAI backend for real AI responses.
- The browser still handles speech recognition and speech synthesis when supported.
- You can swap the model by changing `OPENAI_MODEL` in `.env`.
