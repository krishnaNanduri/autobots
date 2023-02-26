const {SessionsClient} = require('@google-cloud/dialogflow-cx');

const projectId = 'autobots-378807';
const location = 'asia-south1';
const agentId = '8e47935b-d420-466b-a692-b0b913c818ae';
const languageCode = 'en'

const client = new SessionsClient({apiEndpoint: 'asia-south1-dialogflow.googleapis.com'});

module.exports = async function detectIntentText(sessionId, query) {
  let reply = "";
  const sessionPath = client.projectLocationAgentSessionPath(
    projectId,
    location,
    agentId,
    sessionId
  );
  const request = {
    session: sessionPath,
    queryInput: {
      text: {
        text: query,
      },
      languageCode,
    },
  };
  const [response] = await client.detectIntent(request);
  for (const message of response.queryResult.responseMessages) {
    if (message.text) {
      console.log(`Agent Response: ${message.text.text}`);
      reply = reply + message.text.text;
    }
  }
  if (response.queryResult.match.intent) {
    console.log(
      `Matched Intent: ${response.queryResult.match.intent.displayName}`
    );
  }
  console.log(
    `Current Page: ${response.queryResult.currentPage.displayName}`
  );
  return reply;
}