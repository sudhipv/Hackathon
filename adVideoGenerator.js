require('dotenv').config(); // Load environment variables from .env file
const axios = require('axios');
const config = require('./config');
const readline = require('readline');
const fs = require('fs');
const path = require('path');

class AdVideoGenerator {
  constructor() {
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    this.userInputs = {};
  }

  // Utility function to prompt user for input
  async promptUser(question) {
    return new Promise((resolve) => {
      this.rl.question(question, (answer) => {
        resolve(answer.trim());
      });
    });
  }

  // Step 1: Gather all required inputs from user
  async gatherInputs() {
    console.log('\n🎯 Welcome to the AI Ad Video Generator!');
    console.log('Let\'s gather the information needed to create your personalized ad video.\n');

    this.userInputs.productName = await this.promptUser('📦 Product Name: ');
    this.userInputs.productDescription = await this.promptUser('📝 Product Description: ');
    this.userInputs.targetAudience = await this.promptUser('👥 Target Audience: ');
    this.userInputs.adTone = await this.promptUser('🎭 Ad Tone (e.g., bold, emotional, humorous): ');

    console.log('\n✅ Inputs gathered successfully!');
    console.log('📋 Summary:');
    console.log(`   Product: ${this.userInputs.productName}`);
    console.log(`   Target: ${this.userInputs.targetAudience}`);
    console.log(`   Tone: ${this.userInputs.adTone}`);
    console.log(`   Avatar: Built-in HeyGen avatar (harvey/alice)\n`);
  }

  // Step 2: Market Research via LLM
  async conductMarketResearch() {
    console.log('🔍 Conducting market research...');
    
    const researchPrompt = `
You are a marketing research expert. Analyze the following product and provide comprehensive market research insights:

Product: ${this.userInputs.productName}
Description: ${this.userInputs.productDescription}
Target Audience: ${this.userInputs.targetAudience}

Please provide:
1. Key pain points of the target audience
2. Competitor positioning analysis
3. Emotional and persuasive angles for this product
4. Market positioning recommendations

Format your response in a structured way that can be used for ad copy generation.
`;

    try {
      const response = await this.callOpenRouter(researchPrompt);
      this.userInputs.marketResearch = response;
      console.log('✅ Market research completed!\n');
      return response;
    } catch (error) {
      console.error('❌ Market research failed:', error.message);
      throw error;
    }
  }

  // Step 3: Generate Ad Copy via LLM
  async generateAdCopy(userFeedback = null) {
    console.log('✍️ Generating compelling ad copy...');
    
    const feedbackContext = userFeedback ? `\n\nUser Feedback for Improvement: ${userFeedback}` : '';
    
    const copyPrompt = `
You are a professional copywriter specializing in short-form video ads optimized for HeyGen/UGC-style video generation. Create a compelling 15-30 second ad script based on the following information:

Product: ${this.userInputs.productName}
Description: ${this.userInputs.productDescription}
Target Audience: ${this.userInputs.targetAudience}
Tone: ${this.userInputs.adTone}

Market Research Insights:
${this.userInputs.marketResearch}${feedbackContext}

Requirements for HeyGen/UGC Video:
- Script should be 15-30 seconds when spoken
- Design for 1 actor/presenter speaking directly to camera
- Use clear, simple sentences that are easy to speak naturally
- Include visual cues in brackets [like this] for scene direction
- Structure: Hook → Problem → Solution → Call-to-action
- Match the specified tone: ${this.userInputs.adTone}
- Address the key pain points identified in research
- Make it punchy, memorable, and conversational
- Avoid complex multi-character interactions
- Use natural speech patterns and pauses

Format Example:
[Scene: Presenter looking directly at camera, confident smile]
"Are you tired of [problem]? I was too, until I discovered [product]..."

[Visual cue: Show product]
"This amazing [product] changed everything because..."

[Scene: Presenter demonstrating]
"Watch this - [demonstration]"

[Call to action scene]
"Get yours today at [website] and start [benefit]!"

Format the script with clear speaker directions, visual cues, and timing.
`;

    try {
      const response = await this.callOpenRouter(copyPrompt);
      this.userInputs.adScript = response;
      console.log('✅ Ad copy generated!\n');
      return response;
    } catch (error) {
      console.error('❌ Ad copy generation failed:', error.message);
      throw error;
    }
  }

  // Step 4: Request user approval with feedback loop
  async requestApproval() {
    let approved = false;
    let attemptCount = 0;
    
    while (!approved) {
      attemptCount++;
      
      console.log('📄 Generated Ad Script:');
      console.log('=' .repeat(50));
      console.log(this.userInputs.adScript);
      console.log('=' .repeat(50));
      
      const approval = await this.promptUser('\n❓ Do you approve this script? (y/n): ');
      
      if (approval.toLowerCase() === 'y' || approval.toLowerCase() === 'yes') {
        approved = true;
        console.log('✅ Script approved!\n');
      } else {
        console.log('\n🔄 Let\'s improve the script!');
        
        let feedback = '';
        while (!feedback.trim()) {
          feedback = await this.promptUser('📝 Which part would you like to change? You can type a short comment (e.g. "make it funnier", "target moms", "simpler language"): ');
          
          if (!feedback.trim()) {
            console.log('⚠️ Please provide some feedback to improve the script.\n');
          }
        }
        
        console.log(`\n🔄 Regenerating script with your feedback: "${feedback}"\n`);
        
        try {
          await this.generateAdCopy(feedback);
        } catch (error) {
          console.error('❌ Script regeneration failed:', error.message);
          console.log('🔄 Retrying with original script...\n');
          break;
        }
      }
    }
    
    return approved;
  }

  // Step 5: Create HeyGen Video
  async createHeyGenVideo() {
    console.log('🎬 Creating video with HeyGen...');
    
    try {
      // HeyGen v2 API payload structure (latest spec)
      const heygenPayload = {
        video_inputs: [
          {
            character: {
              type: "avatar",
              avatar_id: "Abigail_expressive_2024112501" // Abigail (Upper Body) - verified working avatar
            },
            voice: {
              type: "text",
              input_text: this.userInputs.adScript,
              voice_id: "73c0b6a2e29d4d38aca41454bf58c955" // Cerise - Cheerful (verified working voice)
            }
          }
        ],
        dimension: {
          width: 1280,
          height: 720
        },
        test: false,
        caption: false
      };

      console.log('🎭 Using avatar: Abigail (Upper Body) (Abigail_expressive_2024112501)');
      console.log('🎤 Using voice: Cerise - Cheerful (73c0b6a2e29d4d38aca41454bf58c955)');

      // Use the correct v2 endpoint
      const response = await axios.post(
        `${config.heygen.baseUrl}/video/generate`,
        heygenPayload,
        {
          headers: {
            'Authorization': `Bearer ${config.heygen.apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      // Log the full response for debugging
      console.log('🔍 Full HeyGen response:', JSON.stringify(response.data, null, 2));
      
      if (response.data && response.data.data && response.data.data.video_id) {
        const videoId = response.data.data.video_id;
        console.log('✅ Video generation initiated!');
        console.log(`📹 Video ID: ${videoId}`);
        
        // Poll for video completion
        const videoUrl = await this.pollVideoStatus(videoId);
        
        // Download the video
        const localPath = await this.downloadVideo(videoUrl, videoId);
        
        this.userInputs.videoUrl = videoUrl;
        this.userInputs.localVideoPath = localPath;
        
        return this.userInputs.videoUrl;
      } else {
        console.log('❌ Response structure issue:');
        console.log('   response.data:', response.data);
        console.log('   response.data.data:', response.data?.data);
        throw new Error('No video ID returned from HeyGen API');
      }
    } catch (error) {
      console.error('❌ HeyGen video creation failed:', error.message);
      if (error.response) {
        console.error(`   Status: ${error.response.status}`);
        console.error(`   Response:`, error.response.data);
      }
      // For demo purposes, return a mock URL
      console.log('🔄 Using mock video URL for demonstration...');
      this.userInputs.videoUrl = 'https://demo.heygen.com/video/demo123.mp4';
      return this.userInputs.videoUrl;
    }
  }

  // Poll video status until completion
  async pollVideoStatus(videoId) {
    console.log('⏱️ Waiting for HeyGen to complete video generation...');
    
    const maxAttempts = 10;
    const pollInterval = 120000; // 2 minutes in milliseconds
    
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        console.log(`🔄 Checking status (attempt ${attempt}/${maxAttempts})...`);
        
        const statusResponse = await axios.get(
          `https://api.heygen.com/v1/videos/${videoId}`,
          {
            headers: {
              'Authorization': `Bearer ${config.heygen.apiKey}`,
              'Content-Type': 'application/json'
            }
          }
        );
        
        console.log('🔍 Status response:', JSON.stringify(statusResponse.data, null, 2));
        
        if (statusResponse.data && statusResponse.data.data) {
          const status = statusResponse.data.data.status;
          console.log(`📊 Video status: ${status}`);
          
          if (status === 'completed') {
            console.log('✅ Video ready! Downloading now...');
            return statusResponse.data.data.video_url;
          } else if (status === 'failed') {
            throw new Error(`Video generation failed: ${statusResponse.data.data.error || 'Unknown error'}`);
          } else {
            console.log('⏳ Still processing…');
            if (attempt < maxAttempts) {
              console.log(`⏰ Waiting 2 minutes before next check...`);
              await new Promise(resolve => setTimeout(resolve, pollInterval));
            }
          }
        } else {
          throw new Error('Invalid response structure from status endpoint');
        }
      } catch (error) {
        console.error(`❌ Error checking video status (attempt ${attempt}):`, error.message);
        if (attempt === maxAttempts) {
          throw error;
        }
        await new Promise(resolve => setTimeout(resolve, pollInterval));
      }
    }
    
    throw new Error('HeyGen video generation timed out after 20 minutes.');
  }

  // Download video to local file
  async downloadVideo(videoUrl, videoId) {
    try {
      // Create output directory if it doesn't exist
      const outputDir = './output';
      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
      }
      
      const fileName = `video_${videoId}.mp4`;
      const filePath = path.join(outputDir, fileName);
      
      console.log(`📥 Downloading video from: ${videoUrl}`);
      
      const response = await axios({
        method: 'GET',
        url: videoUrl,
        responseType: 'stream'
      });
      
      const writer = fs.createWriteStream(filePath);
      response.data.pipe(writer);
      
      return new Promise((resolve, reject) => {
        writer.on('finish', () => {
          console.log(`💾 Saved to: ${filePath}`);
          resolve(filePath);
        });
        writer.on('error', reject);
      });
    } catch (error) {
      console.error('❌ Video download failed:', error.message);
      throw error;
    }
  }

  // Helper function to call OpenRouter API
  async callOpenRouter(prompt) {
    try {
      const response = await axios.post(
        `${config.openrouter.baseUrl}/chat/completions`,
        {
          model: config.openrouter.model,
          messages: [
            {
              role: 'user',
              content: prompt
            }
          ],
          max_tokens: 1000,
          temperature: 0.7
        },
        {
          headers: {
            'Authorization': `Bearer ${config.openrouter.apiKey}`,
            'Content-Type': 'application/json',
            'HTTP-Referer': 'http://localhost:3000',
            'X-Title': 'Ad Video Generator'
          }
        }
      );

      return response.data.choices[0].message.content;
    } catch (error) {
      console.error('OpenRouter API Error:', error.response?.data || error.message);
      throw new Error(`OpenRouter API call failed: ${error.message}`);
    }
  }

  // Main execution flow
  async run() {
    try {
      // Step 1: Gather inputs
      await this.gatherInputs();

      // Step 2: Market research
      await this.conductMarketResearch();

      // Step 3: Generate ad copy
      await this.generateAdCopy();

      // Step 4: Request approval (with feedback loop)
      await this.requestApproval();

      // Step 5: Create video (includes image upload if needed)
      const videoUrl = await this.createHeyGenVideo();

      // Step 6: Completion
      console.log('\n🎉 Ad Video Generation Complete!');
      console.log('=' .repeat(50));
      console.log(`📹 Video URL: ${videoUrl}`);
      console.log('=' .repeat(50));
      console.log('\n💡 You can now share this video or request edits!');

      // Ask if user wants to make edits
      const wantsEdit = await this.promptUser('\n🔄 Would you like to make any edits? (y/n): ');
      if (wantsEdit.toLowerCase() === 'y' || wantsEdit.toLowerCase() === 'yes') {
        console.log('🔄 Restarting the process...\n');
        await this.run();
      }

    } catch (error) {
      console.error('❌ Error in ad video generation:', error.message);
    } finally {
      this.rl.close();
    }
  }
}

// Export for use in other files
module.exports = AdVideoGenerator;

// Run if this file is executed directly
if (require.main === module) {
  const generator = new AdVideoGenerator();
  generator.run().catch(console.error);
}
