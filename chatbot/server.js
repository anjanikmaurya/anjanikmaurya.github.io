const WebSocket = require('ws');
const openai = require('openai');

const wss = new WebSocket.Server({ port: 8080 });

const openaiApiKey = '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';

openai.apiKey = openaiApiKey;

wss.on('connection', (ws) => {
  console.log('Client connected');

  ws.on('message', async (message) => {
    console.log(`Received message: ${message}`);

    try {
      const response = await openai.complete({
        engine: 'davinci',
        prompt: message,
        maxTokens: 150,
        n: 1,
        stop: '\n',
        temperature: 0.5,
      });

      const answer = response.choices[0].text.trim();
      console.log(`Sending answer: ${answer}`);
      ws.send(answer);
    } catch (error) {
      console.error(error);
    }
  });

  ws.on('close', () => {
    console.log('Client disconnected');
  });
});
