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
            if (!error && response.statusCode == 200) {
              var result = JSON.parse(body)
              self.sendSocketNotification('BUS_RESULT', result)
            }
        })
    },
    socketNotificationReceived: function(notification, payload) {
        if (notification === 'GET_INFO') {
          this.getBusInfo(payload)
        }
    }
});
