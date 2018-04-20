/**
 * Module dependencies.
 */
const routing = {};
import events from './event_handlers.js';
export default routing;

/**
 * Function sendPostrequest
 * Description: Function to send post request to server
 *
 * Parameter: endpoint
 * Type: string
 * Description: endpoint that you want to send data to.
 * Example: "/createDatabase" if there is an endpoint on the server to create a databse
 * Parameter data
 * Type: Object
 * Description: Any parameters, or additional data you want to send to endpoint. By default is empty
 */
routing.sendPostRequest = function (endpoint, data) {
  var xhr = new XMLHttpRequest();
  xhr.open("POST", "http://localhost:8000/" + endpoint, true);
  // xhr.setRequestHeader('Content-Type', 'application/json');
  //
  // //Check if data was passed to function, if not, add empty object
  // if (data) {
  //   xhr.send(JSON.stringify(data));
  // }
  // else {
  //   xhr.send();
  // }

};

/**
 * Setup SSE
 */
routing.setupSSE = function() {
  if (!!window.EventSource) {
    var source = new EventSource('/stream');

    source.addEventListener('message', function (e) {
      var data = JSON.parse(e.data);
      events.SSEReceived(data);
    }, false);

    source.addEventListener('open', function (e) {
      console.log("SSE Stream Opened!");
    }, false);

    source.addEventListener('error', function (e) {
      if (e.target.readyState === EventSource.CLOSED) {
        console.log("Disconnected");
      }
      else if (e.target.readyState === EventSource.CONNECTING) {
        console.log("Connecting...");
      }
    }, false)
  } else {
    console.log("Your browser doesn't support SSE");
  }
};
