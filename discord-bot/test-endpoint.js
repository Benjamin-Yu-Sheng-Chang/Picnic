// Test script for the Convex HTTP endpoint
// Run with: node test-endpoint.js

const testCreateSchedule = async () => {
  const CONVEX_HTTP_URL = "https://your-deployment.convex.cloud"; // Replace with your URL
  
  const testData = {
    title: "Test Event from Script",
    description: "This is a test event",
    start: Math.floor(Date.now() / 1000) + 3600, // 1 hour from now
    end: Math.floor(Date.now() / 1000) + 7200,   // 2 hours from now
    allDay: false,
    color: "#ff0000",
    location: "Test Location",
    price: 25.50,
    userId: "test-discord-user-123"
  };

  try {
    console.log("Testing Convex HTTP endpoint...");
    console.log("Request data:", testData);
    
    const response = await fetch(`${CONVEX_HTTP_URL}/create-schedule`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData),
    });

    console.log("Response status:", response.status);
    
    if (response.ok) {
      const result = await response.json();
      console.log("✅ Success:", result);
    } else {
      const error = await response.text();
      console.log("❌ Error:", error);
    }
  } catch (error) {
    console.error("❌ Request failed:", error.message);
  }
};

testCreateSchedule();