# 🎬 AI Ad Video Generator

A complete user-generated ad video system that uses LLMs (via OpenRouter API) and HeyGen for video generation. This system creates personalized ad videos based on product inputs through a supervised AI agent workflow.

## 🎯 Features

- **Supervisor Agent Architecture**: Manages the entire workflow from input to video generation
- **LLM-Powered Market Research**: Analyzes target audience pain points and competitor positioning
- **AI-Generated Ad Copy**: Creates compelling 15-30 second ad scripts
- **HeyGen Integration**: Generates professional videos with user photos or avatars
- **Interactive Feedback Loop**: Allows script refinement based on user feedback
- **Modular Design**: Easy to swap video generation providers

## 🚀 Quick Start

### Prerequisites

- Node.js (v14 or higher)
- OpenRouter API key
- HeyGen API key (optional for demo)

### Installation

1. **Clone or download the project**
2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure API keys**:
   - The system uses the OpenRouter API key from `key_file.txt` by default
   - For HeyGen, add your API key to `config.js` or set `HEYGEN_API_KEY` environment variable

### Usage

Run the ad video generator:

```bash
npm start
```

Or directly:

```bash
node adVideoGenerator.js
```

## 📋 Required Inputs

The system will prompt you for:

1. **Product Name**: Name of the product/service
2. **Product Description**: Detailed description of what you're selling
3. **Target Audience**: Who your ideal customers are
4. **Ad Tone**: Desired tone (e.g., bold, emotional, humorous)

## 🔄 Workflow

1. **Input Gathering**: Collects all required information from user
2. **Market Research**: LLM analyzes market and audience pain points
3. **Ad Copy Generation**: Creates compelling script optimized for HeyGen/UGC videos
4. **Interactive Approval**: Shows generated script with feedback loop for refinement
5. **Video Creation**: Generates video using HeyGen API
6. **Completion**: Returns video URL and allows for edits

### 🔁 Script Refinement Loop

When you don't approve the generated script:
- System asks for specific feedback (e.g., "make it funnier", "target moms", "simpler language")
- LLM regenerates the script incorporating your feedback
- Process repeats until you approve or exit manually
- No automatic exits - you're in control!

## ⚙️ Configuration

### Environment Variables

Create a `.env` file (optional):

```env
OPENROUTER_API_KEY=your_openrouter_api_key
OPENROUTER_MODEL=anthropic/claude-3.5-sonnet
HEYGEN_API_KEY=your_heygen_api_key
HEYGEN_BASE_URL=https://api.heygen.com/v1
```

### Model Selection

The system uses Claude 3.5 Sonnet by default, but you can change the model in `config.js`:

```javascript
model: process.env.OPENROUTER_MODEL || 'anthropic/claude-3.5-sonnet'
```

Available models on OpenRouter:
- `anthropic/claude-3.5-sonnet` (default)
- `openai/gpt-4o`
- `google/gemini-pro-1.5`
- And many more...

## 🛠️ API Integration

### OpenRouter API

Used for:
- Market research analysis
- Ad copy generation

The system makes two API calls per video generation:
1. Market research prompt
2. Ad copy generation prompt

### HeyGen API

Used for:
- Video generation with script
- Avatar selection (user photo or default)
- Voice synthesis

## 📁 Project Structure

```
├── adVideoGenerator.js    # Main supervisor agent
├── config.js             # Configuration and API keys
├── package.json          # Dependencies and scripts
├── key_file.txt          # OpenRouter API key
└── README.md             # This file
```

## 🔧 Customization

### Adding New Video Providers

The system is modular. To add a new video generation provider:

1. Create a new method in `AdVideoGenerator` class
2. Update the `createHeyGenVideo()` method to call your provider
3. Modify the API payload structure as needed

### Modifying Prompts

Edit the prompt templates in:
- `conductMarketResearch()` - Market research prompt
- `generateAdCopy()` - Ad copy generation prompt

## 🐛 Troubleshooting

### Common Issues

1. **API Key Errors**: Ensure your OpenRouter API key is valid
2. **HeyGen Errors**: Check HeyGen API key and account status
3. **Network Issues**: Verify internet connection for API calls

### Error Handling

The system includes comprehensive error handling:
- API call failures are caught and logged
- User-friendly error messages
- Graceful fallbacks for demo purposes

## 📝 Example Output

```
🎯 Welcome to the AI Ad Video Generator!

📦 Product Name: Smart Fitness Tracker
📝 Product Description: A wearable device that tracks your health metrics
👥 Target Audience: Health-conscious millennials
🎭 Ad Tone: motivational
🎭 Avatar: Built-in HeyGen avatar (harvey/alice)

✅ Inputs gathered successfully!

🔍 Conducting market research...
✅ Market research completed!

✍️ Generating compelling ad copy...
✅ Ad copy generated!

📄 Generated Ad Script:
==================================================
[Generated script content]
==================================================

❓ Do you approve this script? (y/n): y

🎬 Creating video with HeyGen...
✅ Video created successfully!

🎉 Ad Video Generation Complete!
==================================================
📹 Video URL: https://demo.heygen.com/video/demo123.mp4
==================================================
```

## 🤝 Contributing

This is a hackathon project. Feel free to:
- Add new video providers
- Improve prompt engineering
- Add new features
- Fix bugs

## 📄 License

ISC License - see package.json for details.

---

**Built for Hackathon** 🚀 | **Powered by OpenRouter & HeyGen** ⚡
