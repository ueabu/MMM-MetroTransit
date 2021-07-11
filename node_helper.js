/* global module */

/* Magic Mirror
 * Node Helper: MMM-MetroTansit
 *
 * By Uma Abu
 * MIT Licensed.
 */

var NodeHelper = require('node_helper')
var request = require('request')

var minneapolisMetroAPI = 'https://svc.metrotransit.org/nextrip/17897'

module.exports = NodeHelper.create({
    start: function () {
        console.log('Starting node helper for: ' + this.name)
    },
    getBusInfo: function(info){
        var self = this    
        var options = {
            method: 'GET',
            url: minneapolisMetroAPI
        }
        request(options, function (error, response, body) {
            Log.info(response);

            if (!error && response.statusCode == 200) {
                Log.info("==============================");
                Log.info(response);
                var result = JSON.parse(body)
                Log.info(result);
                self.sendSocketNotification('BUS_RESULT', result)
            }
        })
    },
    socketNotificationReceived: function(notification, payload) {
        Log.info("socketNotificationReceived");

        if (notification === 'GET_INFO') {
          this.getBusInfo(payload)
        }
    }
});
