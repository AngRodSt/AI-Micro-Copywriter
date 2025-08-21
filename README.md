# AI Micro-Copywriter

AI Micro-Copywriter is a tool designed to generate optimized microcopy, such as short headlines, button texts, and notifications, using modern technologies like **Next.js 15**, **TypeScript**, **Tailwind CSS**, and the Hugging Face API. This project is intended for developers, designers, and marketing teams who want to quickly and easily create effective and engaging copy.

## How can it help you?

- **Time-saving**: Generate multiple text variations in seconds.
- **Content optimization**: Adjust tone and length to fit different contexts and audiences.
- **Ease of use**: Copy generated texts directly to your clipboard.

👉 **Live demo**: Explore the tool in action. https://ai-micro-copywriter.vercel.app/

## Main features

- Generates 3 optimized text variations.
- Customize tone and content length.
- Copy-to-clipboard functionality for convenience.

## Setup

1. Create a `.env.local` file and add your API key (`HUGGINGFACE_API_KEY`).
2. Install dependencies by running: `npm install`.
3. Start the development environment with: `npm run dev`.
4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment

You can easily deploy this project using [Vercel](https://vercel.com). Make sure to add `HUGGINGFACE_API_KEY` in the Environment Variables section of your project settings.

## Testing

This project has been tested with various scenarios to ensure reliability and performance:

### Unit Testing (Jest)
- **Component Rendering**: Verified proper rendering of form inputs and generated text outputs
- **API Integration**: Tested Hugging Face API connectivity and response handling
- **Text Generation Logic**: Validated text generation with various input parameters and edge cases
- **Copy-to-Clipboard**: Ensured clipboard functionality works across different browsers
- **Error Handling**: Verified graceful handling of API errors, network timeouts, and invalid inputs

### End-to-End Testing (Cypress)
- **Complete User Workflows**: Validated full user journeys from text input to copy generation
- **Form Interactions**: Tested tone selection, length adjustment, and input validation
- **Response Handling**: Verified proper display of generated variations and error states

