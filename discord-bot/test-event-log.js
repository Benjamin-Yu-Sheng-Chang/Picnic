// Test the event logging format
const formatEventLog = (event) => {
  const formatDate = (date) => {
    try {
      // Handle both string dates and timestamp numbers
      const dateObj = typeof date === 'string' ? new Date(date) : new Date(date);
      return dateObj.toLocaleString('en-US', {
        weekday: 'short',
        month: 'short', 
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        timeZoneName: 'short'
      });
    } catch {
      return String(date);
    }
  };

  const parts = [
    `📅 **${event.title}**`,
    `⏰ ${formatDate(event.start)} → ${formatDate(event.end)}`,
  ];

  // Add optional fields if they exist
  if (event.description) parts.push(`📝 ${event.description}`);
  if (event.location) parts.push(`📍 ${event.location}`);
  if (event.price && event.price > 0) parts.push(`💰 $${event.price}`);
  if (event.allDay) parts.push(`🌅 All day event`);

  return parts.join('\n   ');
};

console.log('🧪 Testing Event Log Formatting\n');

// Test different event scenarios
const testEvents = [
  {
    title: "Team Meeting",
    start: new Date('2024-08-05T15:00:00.000Z'),
    end: new Date('2024-08-05T16:00:00.000Z'),
    description: "Weekly team sync",
    location: "Conference Room A"
  },
  {
    title: "Birthday Party", 
    start: "2024-12-25T19:00:00.000Z",
    end: "2024-12-25T23:00:00.000Z",
    description: "Sarah's birthday celebration",
    location: "My house",
    price: 25
  },
  {
    title: "All Day Conference",
    start: Date.now() + 86400000, // Tomorrow
    end: Date.now() + 86400000 + 3600000, // Tomorrow + 1 hour
    allDay: true,
    location: "Convention Center",
    price: 150
  },
  {
    title: "Simple Event",
    start: new Date().toISOString(),
    end: new Date(Date.now() + 7200000).toISOString() // 2 hours later
  }
];

testEvents.forEach((event, index) => {
  console.log(`📋 Test Case ${index + 1}:`);
  console.log('Raw event data:', event);
  console.log('\nFormatted log message:');
  console.log(`✅ Event Created Successfully!\n   ${formatEventLog(event)}`);
  console.log('\n' + '─'.repeat(50) + '\n');
});

// Test what Discord would send
console.log('🤖 Discord Bot Example:');
const discordEvent = {
  _id: "k123456789",
  title: "Pizza Party",
  start: "tomorrow at 6pm", // This is what user types
  end: "tomorrow at 9pm", 
  description: "Monthly team pizza gathering",
  location: "Office break room",
  price: 15,
  allDay: false,
  createdBy: "user123",
  createdAt: Date.now(),
  updatedAt: Date.now()
};

console.log('Discord event object:', discordEvent);
console.log('\nFormatted Discord log:');
console.log(`✅ Event Created Successfully!\n   ${formatEventLog(discordEvent)}`);