# AI Chat - User Documentation

## Overview

The AI Chat feature allows you to have conversations with AI assistants from multiple providers. This is a powerful tool that can help with coding questions, explanations, brainstorming, and more.

## Supported AI Providers

The chat supports four major AI providers. You only need to configure **one** to start chatting:

| Provider | Model | Best For |
|----------|-------|----------|
| Anthropic Claude | claude-sonnet-4-5 | Coding, complex reasoning, analysis |
| OpenAI ChatGPT | gpt-4.1-mini | Wide range of tasks, creative writing |
| Google Gemini | gemini-2.0-flash | Multimodal tasks, fast responses |
| Mistral AI | mistral-small | Efficient, cost-effective conversations |

## Getting Started

### Step 1: Get an API Key

Choose a provider and follow the instructions to get your API key:

#### Anthropic Claude
1. Go to https://console.anthropic.com/settings/keys
2. Sign in or create an account
3. Click "Create Key"
4. Copy the key (starts with `sk-ant-...`)

#### OpenAI ChatGPT
1. Go to https://platform.openai.com/api-keys
2. Sign in or create an account
3. Click "Create new secret key"
4. Copy the key immediately (shown only once, starts with `sk-...`)

#### Google Gemini
1. Go to https://aistudio.google.com/app/apikey
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the generated key

#### Mistral AI
1. Go to https://console.mistral.ai/api-keys/
2. Sign in or create an account
3. Click "Create new key"
4. Copy the generated key

### Step 2: Configure Environment Variables

1. Create or edit `.env.local` in your project root
2. Add your API key:

```bash
# Choose one or more providers
ANTHROPIC_API_KEY=sk-ant-your-key-here
OPENAI_API_KEY=sk-your-key-here
GEMINI_API_KEY=your-key-here
MISTRAL_API_KEY=your-key-here
```

3. Restart your development server: `npm run dev`

### Step 3: Start Chatting

1. Navigate to the AI Chat page from the sidebar
2. Type your message in the input field
3. Press Enter or click Send
4. Watch the AI response stream in real-time!

## Features

### Real-time Streaming
Responses appear token by token as the AI generates them, providing immediate feedback.

### Provider Switching
If you have multiple providers configured, you can switch between them using the dropdown in the header.

### Clear Chat
Click the "Clear" button to start a fresh conversation.

### Session-based Messages
Messages are stored in your browser session only. They are not persisted to any database, ensuring privacy.

## Tips for Better Responses

1. **Be specific**: Instead of "write code", say "write a TypeScript function that validates email addresses"
2. **Provide context**: Share relevant code snippets or error messages
3. **Ask follow-ups**: The AI remembers your conversation context
4. **Iterate**: If the first response isn't perfect, ask for refinements

## Troubleshooting

### "No AI Provider Configured"
- Make sure you've added at least one API key to `.env.local`
- Restart the development server after adding keys
- Check that your API key is valid and has available credits

### Response is slow or times out
- Some models take longer for complex questions
- Check your internet connection
- Try a different provider if available

### Error messages from the AI
- Check your API key is valid
- Verify you have sufficient credits/quota
- Check the provider's status page for outages

## Cost Considerations

Each provider has different pricing. Check their respective pricing pages:
- Anthropic: https://www.anthropic.com/pricing
- OpenAI: https://openai.com/pricing
- Google: https://ai.google.dev/pricing
- Mistral: https://mistral.ai/products/

Most providers offer free tiers or credits for new users.
