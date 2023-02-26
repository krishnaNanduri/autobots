const { SessionsClient } = require('@google-cloud/dialogflow');

const projectId = 'autobots-378807';
const languageCode = 'en'

const client = new SessionsClient();

module.exports = async function detectIntentText(sessionId, query) {
  const sessionPath = client.projectAgentSessionPath(
    projectId,
    sessionId
  );
  const request = {
    session: sessionPath,
    queryInput: {
      text: {
        text: query,
        languageCode
      },
    },
  };
  const responses = await client.detectIntent(request);
  const [response] = responses;
  console.log(response.queryResult.fulfillmentMessages);
  response.queryResult.fulfillmentMessages.forEach(message => {
    if(message.message === 'text') {
      console.log(message.text.text);
    } else if(message.message === 'quickReplies') {
      console.log(message.quickReplies.quickReplies);
    }
  })
  if (response.queryResult.intent) {
    console.log(`Intent: ${response.queryResult.intent.displayName}`);
  } else {
    console.log('No intent matched.');
  }
  return response.queryResult.fulfillmentMessages;
}