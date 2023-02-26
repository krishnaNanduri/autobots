const { WebhookClient, Suggestion } = require('dialogflow-fulfillment');
const moment = require('moment');

const orders = require('./orders.json');
const loads = require('./loads.json');

function handleLoadsIntent(agent){
    console.log('Loads handle')
    console.log(agent.parameters);
    
    const availableLoads = loads.filter(load => {
        return(
            load.origin.toLowerCase() === agent.parameters.origin.toLowerCase() &&
            load.destination.toLowerCase() === agent.parameters.destination.toLowerCase() &&
            moment(moment(load.appointment).format('L')).isSame(moment(agent.parameters.appointment).format('L'))
        )
    });
    if(availableLoads.length) {
        agent.add("Here are the list of available loads");
        availableLoads.forEach((load, index) => {
            console.log(load, index);
            if(index < 3) {
                agent.add(new Suggestion(load.loadNumber.toString()));
            }
        });
    } else {
        agent.add(`Sorry, no loads available between ${agent.parameters.origin} and ${agent.parameters.destination}`);
    }
    
}

function handleLoadInfoIntent(agent) {
    const load = loads.find((load) => load.loadNumber === parseInt(agent.parameters.loadNumber));
    console.log(agent.parameters, load);
    if(load && load.loadNumber) {
        Object.keys(load).forEach((key, index) => {
            if(key !== 'userID' && key !== 'rate') {
                agent.add(`${key}: ${Object.values(load)[index]}`);
            }
        });
    } else {
        agent.add("Sorry, we cannot find the load.");
    }
}

function handleOrderStatusIntent(agent) {
    const parameters = agent.parameters;
    console.log(parameters, 'parameters');
    console.log(parseInt(parameters.orderNumber), 'orderNumber');
    const order = orders.find(order => order.orderNumber === parseInt(parameters.orderNumber));
    console.log(order, 'order');
    let reply = '';
    if(order && order.status) {
        switch (order.status) {
            case 'pending':
                reply = 'Your order is still in pending state';
                break;
            case 'delayed':
                reply = `Your order has been delayed and is at ${order.location}`;
                break;
            case 'inTransit':
                reply = `Your order is at ${order.location}`;
                break;
            case 'delivered':
            default:
                reply = 'Your order is delivered';
                break;
        }
    } else {
        reply = 'Sorry, we cannot find the order';
    }
    agent.add(reply);
}

module.exports = async function detectIntent(req, res) {
    let agent = new WebhookClient({request: req, response: res})
    let intentMap = new Map();
    intentMap.set('Order Status Intent', handleOrderStatusIntent);
    intentMap.set('Loads Intent', handleLoadsIntent);
    intentMap.set('Load Info Intent', handleLoadInfoIntent);
    agent.handleRequest(intentMap)
}