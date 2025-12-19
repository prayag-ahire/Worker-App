# AI Screen Testing Guide

## Prerequisites

### 1. Backend Server Running
The chatbot server must be running on port 3001.

```bash
cd chatbot/server
npm install  # if not already done
npm start
```

**Expected output:**
```
✅ ProWorker API running on http://localhost:3001
📝 Health check: http://localhost:3001/api/health
💬 Chat endpoint: POST http://localhost:3001/api/chat
⏱️  Rate limit: 15 requests per 24 hours
```

### 2. Environment Variables
Ensure `chatbot/server/.env` has:
```
VITE_GEMINI_API_KEY=your_gemini_api_key
PORT=3001
```

### 3. React Native App
```bash
# From project root
npx react-native run-android
```

## Test Scenarios

### Test 1: Initial Load & Greeting
**Steps:**
1. Navigate to AI screen
2. Observe initial greeting message

**Expected Result:**
```
I am your personal AI assistant.

I can assist you with your information like 
order, rating, review, schedule, etc.

I will happy to help you 😊
```

**What to check:**
- ✅ Message appears with proper line breaks
- ✅ Emoji renders correctly
- ✅ Message is in AI bubble (left side, gray background)
- ✅ Timestamp shows current time

---

### Test 2: Simple Greeting
**Steps:**
1. Type "Hi" or "Hello"
2. Send message

**Expected Response:**
```
I am your personal AI assistant.

I can assist you with your information like order, 
rating, review, schedule, etc.

I will happy to help you 😊
```

**What to check:**
- ✅ User message appears on right (blue background)
- ✅ AI response appears on left (gray background)
- ✅ Loading indicator shows while processing
- ✅ Auto-scrolls to bottom

---

### Test 3: Bold Text Rendering
**Steps:**
1. Ask: "What's my rating?"

**Expected Response Format:**
```
Your rating is **4.5 stars** which is **above average** 
for electricians!
```

**What to check:**
- ✅ Text between ** appears bold
- ✅ Regular text appears normal weight
- ✅ No ** symbols visible in rendered text

---

### Test 4: Bullet Lists
**Steps:**
1. Ask: "What are my top achievements?"

**Expected Response Format:**
```
Here are your highlights:
• Completed 50 orders
• Maintained 4.8 rating
• Zero cancellations this month
```

**What to check:**
- ✅ Bullets are properly indented
- ✅ Bullet point (•) is bold and separated
- ✅ Text wraps properly if long
- ✅ Vertical spacing between items

---

### Test 5: Numbered Lists
**Steps:**
1. Ask: "How can I improve my rating?"

**Expected Response Format:**
```
Here are 3 tips to boost your rating:
1. Respond to clients within 2 hours
2. Complete orders on scheduled time
3. Ask satisfied clients for reviews
```

**What to check:**
- ✅ Numbers are bold and aligned
- ✅ Text is properly indented
- ✅ Spacing is consistent
- ✅ Numbers have minimum width for alignment

---

### Test 6: Mixed Formatting
**Steps:**
1. Ask: "Give me a performance summary"

**Expected Response Format:**
```
Your performance summary:

**Overall Rating:** 4.5/5 stars

Key metrics:
• Total orders: **50**
• Completion rate: **95%**
• Average response time: **1.5 hours**

Top 3 improvements:
1. Reduce cancellations
2. Improve punctuality
3. Update availability regularly
```

**What to check:**
- ✅ Bold text renders in headers and numbers
- ✅ Bullets and numbers both work
- ✅ Line breaks create proper spacing
- ✅ Overall readability is good

---

### Test 7: Error Handling - Server Offline
**Steps:**
1. Stop the backend server
2. Try sending a message

**Expected Result:**
```
AI Assistant is currently offline. 
Please try again later.
```

**What to check:**
- ✅ Error message appears as AI response
- ✅ No app crash
- ✅ Can still type in input
- ✅ Header shows "Offline" status

---

### Test 8: Error Handling - Network Issue
**Steps:**
1. Disconnect internet/WiFi
2. Try sending a message

**Expected Result:**
```
I'm sorry, I couldn't process that. 
Please try again.
```

**What to check:**
- ✅ Graceful error handling
- ✅ User message still appears
- ✅ Error message is user-friendly
- ✅ Can retry when connection restored

---

### Test 9: Long Conversation
**Steps:**
1. Send 5-10 messages in a row
2. Observe scrolling behavior

**What to check:**
- ✅ Auto-scrolls to latest message
- ✅ Can manually scroll up to see history
- ✅ All messages render correctly
- ✅ No performance issues
- ✅ Timestamps are accurate

---

### Test 10: Input Validation
**Steps:**
1. Try sending empty message
2. Try sending only spaces
3. Try very long message (500+ chars)

**What to check:**
- ✅ Empty/spaces don't send
- ✅ Send button disabled when empty
- ✅ Long messages are accepted
- ✅ Long messages wrap properly in bubble

---

## Visual Checks

### Message Bubbles
- **User bubbles:** Blue background, white text, right-aligned
- **AI bubbles:** Light gray background, dark text, left-aligned
- **Corners:** User bubbles have sharp bottom-right, AI bubbles have sharp bottom-left
- **Spacing:** 12px between messages
- **Max width:** 80% of screen width

### Typography
- **Regular text:** 15px, line height 20px
- **Bold text:** 700 weight, same size
- **Timestamps:** 10px, gray, positioned at bottom
- **Bullets:** Bold, 8px right margin
- **Numbers:** Bold, 24px min width for alignment

### Colors (from Colors.ts)
- **User bubble:** `Colors.accent` (blue)
- **AI bubble:** `Colors.backgroundSoft` (light gray)
- **Text:** `Colors.textDark` (dark gray/black)
- **Timestamp:** `Colors.textLight` (light gray)

---

## API Health Check

### Manual Test
```bash
# In terminal
curl http://localhost:3001/api/health
```

**Expected Response:**
```json
{
  "status": "API is running",
  "timestamp": "2025-12-19T...",
  "requestsUsed": 0,
  "requestsRemaining": 15
}
```

### From Android Emulator
The app uses `http://10.0.2.2:3001` which maps to `localhost:3001` on your host machine.

---

## Common Issues & Solutions

### Issue: "API is currently offline"
**Solution:**
1. Check if server is running: `cd chatbot/server && npm start`
2. Verify port 3001 is not blocked by firewall
3. Check server logs for errors

### Issue: Bold text shows ** symbols
**Solution:**
- This means the markdown parser isn't working
- Check that the message is from AI (not user)
- Verify `parseMarkdown()` function is being called

### Issue: Bullets/numbers not indented
**Solution:**
- Check styles: `bulletContainer`, `bulletPoint`, `bulletText`
- Verify flexDirection is 'row'
- Check marginRight on bullet/number

### Issue: Messages not scrolling
**Solution:**
- Check `scrollViewRef` is attached to ScrollView
- Verify `useEffect` dependency array includes `[messages, isLoading]`
- Check setTimeout is 100ms

### Issue: CORS error in logs
**Solution:**
- Verify server CORS includes mobile origins
- Check `chatbot/server/index.js` line 54-60
- Restart server after CORS changes

---

## Performance Metrics

### Expected Response Times
- **Health check:** < 100ms
- **Simple query:** 1-3 seconds
- **Complex query:** 3-5 seconds
- **Cached response:** < 500ms

### Rate Limits
- **Daily limit:** 15 requests
- **Queue delay:** 1 second between requests
- **Cache TTL:** 5 minutes

---

## Debugging Tips

### Enable Detailed Logs
In `AIChatScreen.tsx`, the following are already logged:
- Worker data fetch
- API health check
- Message sending
- Errors

### Check Server Logs
Server logs show:
- Incoming requests
- Cache hits/misses
- Rate limit status
- Gemini API calls
- Errors

### React Native Debugger
```bash
# Open debugger
npx react-native log-android
```

Look for:
- `Fetching worker data for ID: 1`
- `Sending message to http://10.0.2.2:3001/api/chat`
- `Backend API not connected` (if offline)

---

## Success Criteria

All tests pass when:
- ✅ Initial greeting displays with formatting
- ✅ Bold text renders without ** symbols
- ✅ Bullet lists are properly indented
- ✅ Numbered lists are aligned
- ✅ Mixed formatting works together
- ✅ Error handling is graceful
- ✅ Auto-scroll works smoothly
- ✅ Input validation prevents empty sends
- ✅ Visual design matches specifications
- ✅ No console errors or warnings
