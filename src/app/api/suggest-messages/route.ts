const mockMessages = [
  "What's your favorite movie and why?||Do you have any pets? Tell me about them!||What's your dream job?",
  "What's the best book you've ever read?||If you could travel anywhere, where would you go?||What's your favorite food?",
  "What hobbies are you passionate about?||What's the most interesting thing that happened to you this week?||What motivates you every day?",
  "What's your favorite season and why?||Do you prefer coffee or tea?||What skill would you love to learn?",
  "What's your favorite way to relax?||What's the best advice you've ever received?||What makes you laugh the most?"
];

export const runtime = 'edge';

export async function POST() {
  try {
    // Random message selection
    const randomIndex = Math.floor(Math.random() * mockMessages.length);
    const selectedMessage = mockMessages[randomIndex];
    
    // Create a simple stream response
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      start(controller) {
        controller.enqueue(encoder.encode(selectedMessage));
        controller.close();
      },
    });
    
    return new Response(stream, {
      status: 200,
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    });
  } catch (error) {
    console.error('Error fetching messages:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}