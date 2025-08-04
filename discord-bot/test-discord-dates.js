// Test Discord date parsing exactly like the bot does
import * as chrono from 'chrono-node';

console.log('🤖 Testing Discord Event Creation Date Parsing\n');

// Simulate different user inputs for Discord slash commands
const testCases = [
  {
    title: "Team Meeting",
    start: "tomorrow at 3pm",
    end: "tomorrow at 4pm"
  },
  {
    title: "Weekend Event", 
    start: "next saturday 10am",
    end: "next saturday 2pm"
  },
  {
    title: "Christmas Party",
    start: "December 25th at 7pm", 
    end: "December 25th at 11pm"
  },
  {
    title: "Conference Call",
    start: "Monday 9am",
    end: "Monday 10am"
  },
  {
    title: "Bad Date Format",
    start: "invalid date",
    end: "also invalid"
  },
  {
    title: "Partial Bad Date",
    start: "tomorrow 3pm",
    end: "not a real date"
  },
  {
    title: "Bad Date Format",
    start: "invalid date",
    end: "also invalid"
  },
  {
    title: "Partial Bad Date",
    start: "tomorrow 3pm",
    end: "not a real date"
  }
];

// Test each case with the exact logic from your Discord bot
testCases.forEach((testCase, index) => {
  console.log(`\n📋 Test Case ${index + 1}: ${testCase.title}`);
  console.log(`   Input: start="${testCase.start}", end="${testCase.end}"`);
  
  try {
    // This is exactly your Discord bot logic
    const startInput = testCase.start;
    const endInput = testCase.end;
    
    console.log(`📅 Parsing dates: start="${startInput}", end="${endInput}"`);
    
    const startDate = chrono.parseDate(startInput);
    const endDate = chrono.parseDate(endInput);
    
    if (!startDate || !endDate) {
      throw new Error(`Invalid date format. Please use natural language like "tomorrow at 3pm" or "Dec 25 at 2pm". Start: "${startInput}", End: "${endInput}"`);
    }
    
    console.log(`✅ Parsed dates: start=${startDate.toISOString()}, end=${endDate.toISOString()}`);
    
    // Simulate what would be sent to Convex
    const eventData = {
      title: testCase.title,
      start: startDate.toISOString(),
      end: endDate.toISOString(),
      discordUserId: "123456789"
    };
    
    console.log(`🎯 Would create event:`, eventData);
    console.log(`✅ SUCCESS: Event would be created successfully`);
    
  } catch (error) {
    console.log(`❌ ERROR: ${error.message}`);
  }
});

console.log('\n🔍 Testing edge cases:');

// Test what happens with empty strings
console.log('\n📝 Empty string test:');
console.log('chrono.parseDate(""):', chrono.parseDate(""));
console.log('chrono.parseDate(null):', chrono.parseDate(null));
console.log('chrono.parseDate(undefined):', chrono.parseDate(undefined));

// Test what Discord might send
console.log('\n📝 Discord command simulation:');
const mockDiscordOptions = [
  { value: "Test Event" },           // title
  { value: "tomorrow 3pm" },         // start  
  { value: "tomorrow 5pm" },         // end
  { value: "Test description" },     // description
  { value: false },                  // allDay
  { value: "Test location" },        // location
  { value: 0 }                       // price
];

console.log('Mock Discord options:', mockDiscordOptions);
console.log('start value:', mockDiscordOptions[1].value);
console.log('end value:', mockDiscordOptions[2].value);

const startResult = chrono.parseDate(mockDiscordOptions[1].value);
const endResult = chrono.parseDate(mockDiscordOptions[2].value);

console.log('Parsed start:', startResult);
console.log('Parsed end:', endResult);