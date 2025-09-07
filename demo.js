// Demo script to test the Ad Video Generator without user input
const AdVideoGenerator = require('./adVideoGenerator');

class DemoAdVideoGenerator extends AdVideoGenerator {
  constructor() {
    super();
    // Pre-fill demo data
    this.userInputs = {
      productName: 'Smart Fitness Tracker',
      productDescription: 'A revolutionary wearable device that tracks your heart rate, sleep patterns, and daily activity with AI-powered health insights.',
      targetAudience: 'Health-conscious millennials aged 25-35 who want to optimize their fitness and wellness',
      adTone: 'motivational and empowering',
    };
  }

  // Override promptUser to use demo data
  async promptUser(question) {
    console.log(question);
    
    if (question.includes('Product Name')) {
      console.log(this.userInputs.productName);
      return this.userInputs.productName;
    } else if (question.includes('Product Description')) {
      console.log(this.userInputs.productDescription);
      return this.userInputs.productDescription;
    } else if (question.includes('Target Audience')) {
      console.log(this.userInputs.targetAudience);
      return this.userInputs.targetAudience;
    } else if (question.includes('Ad Tone')) {
      console.log(this.userInputs.adTone);
      return this.userInputs.adTone;
    } else if (question.includes('approve this script')) {
      console.log('y');
      return 'y';
    } else if (question.includes('Which part would you like to change')) {
      console.log('make it more exciting');
      return 'make it more exciting';
    } else if (question.includes('make any edits')) {
      console.log('n');
      return 'n';
    }
    
    return '';
  }

  // Override gatherInputs to skip the interactive part
  async gatherInputs() {
    console.log('\n🎯 Demo Mode: AI Ad Video Generator!');
    console.log('Using pre-configured demo data:\n');

    console.log('✅ Inputs gathered successfully!');
    console.log('📋 Summary:');
    console.log(`   Product: ${this.userInputs.productName}`);
    console.log(`   Target: ${this.userInputs.targetAudience}`);
    console.log(`   Tone: ${this.userInputs.adTone}`);
    console.log(`   Photo: ${this.userInputs.photoPath || 'None'}\n`);
  }
}

// Run demo
if (require.main === module) {
  console.log('🚀 Starting Demo Mode...');
  console.log('This will demonstrate the AI Ad Video Generator with sample data.\n');
  
  const demoGenerator = new DemoAdVideoGenerator();
  demoGenerator.run().catch(console.error);
}

module.exports = DemoAdVideoGenerator;
