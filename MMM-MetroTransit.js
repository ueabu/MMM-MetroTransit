/* global Module */

/* Magic Mirror
 * Module: MMM-MetroTransit
 *
 * By Uma Abu
 * MIT Licensed.
 */

Module.register("MMM-MetroTransit", {
    busesInfo:[],
    defaults: {
        header: 'Minneapolis Metro',
        buses: [
            {
                line: '120'
            }
        ],
        updateInterval: 30000, // update interval in milliseconds
        fadeSpeed: 4000,
        infoClass: 'big' // small, medium or big
    },

    getStyles: function() {
        return ["MMM-MetroTransit.css"]
    },

    start: function() {
        Log.info("Starting module: " + this.name);

        var info = {}
        this.getBusInfo(info)

        // this.config.buses.forEach(info => {
        //     this.getBusInfo(info)
        // })
      
        this.scheduleUpdate()
    },
    // https://docs.magicmirror.builders/development/core-module-file.html#suspend
    // used in combination with ModuleScheduler in order to halt the timers
    suspend: function() {
        window.clearInterval(this.intervalID)
    },

    resume: function() {
        this.scheduleUpdate()
    },

    scheduleUpdate: function(delay) {
        var nextLoad = this.config.updateInterval
        if (typeof delay !== "undefined" && delay >= 0) {
          nextLoad = delay
        }
        var self = this
        this.intervalID = setInterval(function() {
          self.busesInfo = [] // prevent redrawing twice the same info
          self.config.buses.forEach(info => {
            self.getBusInfo(info)
          })
        }, nextLoad)
    },

    getBusInfo: function (info) {
        this.sendSocketNotification('GET_INFO', info)
    },

    socketNotificationReceived: function(notification, payload) {
        var self = this
        if (notification === "BUS_RESULT") {
          if (payload.length !== 0) { // update DOM only if it's needed
            Log.info(this.busesInfo);
            this.busesInfo.push(payload)
            this.updateDom(self.config.fadeSpeed)
          }
        }
    },

    getHeader: function() {
        return this.config.header
    },

    getDom: function() {
        Log.info(this.busesInfo);
        var element = document.createElement("div")
        element.className = "myContent"
        element.innerHTML = "Hello, World!"
        return element

        // var wrapper = document.createElement("table")
      
        // Log.info(this.busesInfo);

        // return wrapper
    }
    

})