// Test chrono-node parsing
import * as chrono from 'chrono-node';

console.log('🧪 Testing chrono-node parsing...\n');

// Test various date formats that users might input
const testDates = [
  'tomorrow at 3pm',
  'next friday at 7:30pm', 
  'December 25th at 2pm',
  '2024-03-15 14:30',
  'in 2 hours',
  'next week',
  'monday 9am',
  'invalid date string'
];

console.log('Available chrono methods:');
console.log('chrono.parse:', typeof chrono.parse);
console.log('chrono.parseDate:', typeof chrono.parseDate);
console.log('chrono.casual:', typeof chrono.casual);
console.log();

testDates.forEach(dateStr => {
  console.log(`📅 Testing: "${dateStr}"`);
  
  try {
    // Method 1: Using chrono.parse() - returns array of results
    const parseResults = chrono.parse(dateStr);
    console.log(`  chrono.parse() results:`, parseResults.length);
    if (parseResults.length > 0) {
      console.log(`    First result date:`, parseResults[0].start.date());
      console.log(`    ISO string:`, parseResults[0].start.date().toISOString());
    }
    
    // Method 2: Using chrono.parseDate() - returns single Date or null  
    const parseDate = chrono.parseDate(dateStr);
    console.log(`  chrono.parseDate():`, parseDate);
    if (parseDate) {
      console.log(`    ISO string:`, parseDate.toISOString());
    }
    
    // Method 3: Using chrono.casual.parseDate() - more flexible parsing
    const casualDate = chrono.casual.parseDate(dateStr);
    console.log(`  chrono.casual.parseDate():`, casualDate);
    if (casualDate) {
      console.log(`    ISO string:`, casualDate.toISOString());
    }
    
  } catch (error) {
    console.log(`  ❌ Error:`, error.message);
  }
  
  console.log();
});

// Test the specific pattern from your Discord bot
console.log('🤖 Testing Discord bot pattern:');
const mockEvent = {
  start: 'tomorrow at 3pm',
  end: 'tomorrow at 5pm'
};

console.log(`Mock event: start="${mockEvent.start}", end="${mockEvent.end}"`);

// Your current code (which doesn't work):
console.log('\n❌ Your current approach:');
try {
  console.log('chrono.parseDate exists:', typeof chrono.parseDate);
  const start = chrono.parseDate?.(mockEvent.start)?.toISOString();
  const end = chrono.parseDate?.(mockEvent.end)?.toISOString();
  console.log('start:', start);
  console.log('end:', end);
} catch (error) {
  console.log('Error:', error.message);
}

// Fixed approach:
console.log('\n✅ Fixed approach:');
try {
  const start = chrono.parseDate(mockEvent.start)?.toISOString();
  const end = chrono.parseDate(mockEvent.end)?.toISOString();
  console.log('start:', start);
  console.log('end:', end);
} catch (error) {
  console.log('Error:', error.message);
}