const routing = {};

/**
 * Function sendPostrequest
 * Description: Function to send post request to server
 * 
 * Parameter: endpoint
 * Type: string
 * Description: endpoint that you want to send data to.
 * Example: "/createDatabase" if there is an endpoint on the server to create a databse
 * 
 * 
 * Parameter data
 * Type: Object
 * Description: Any parameters, or additional data you want to send to endpoint. By default is empty
 */
routing.sendPostRequest = function(endpoint, data) {
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "http://localhost:8000/"+endpoint, true);
    xhr.setRequestHeader('Content-Type', 'application/json');

    //Check if data was passed to function, if not, add empty object
    if (data) {
        xhr.send(JSON.stringify(data));
    }
    else {
        xhr.send();
    }
    
}

module.exports = routing;