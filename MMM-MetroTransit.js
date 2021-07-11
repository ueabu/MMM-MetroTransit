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
        useHeader: true,           // false if you don't want a header
        maxWidth: "450px",
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
        var xmldata = payload.body
        
        var xmlDataObject = new window.DOMParser().parseFromString(xmldata, "text/xml")
        const arrayOfNexTripDeparture = xmlDataObject.getElementsByTagName("NexTripDeparture");
        for (var i = 0; i < arrayOfNexTripDeparture.length; i++) {
            
            var route = xmlDataObject.getElementsByTagName("Route")[i].childNodes[0].nodeValue

            if (route == 14){
                var upcomingTimes = {}
                upcomingTimes['depatureText'] = xmlDataObject.getElementsByTagName("DepartureText")[i].childNodes[0].nodeValue
                upcomingTimes['depatureTime'] = xmlDataObject.getElementsByTagName("DepartureTime")[i].childNodes[0].nodeValue
                upcomingTimes['description'] = xmlDataObject.getElementsByTagName("Description")[i].childNodes[0].nodeValue
                this.busesInfo.push(upcomingTimes)
            }
        }
        var self = this

        if (notification === "BUS_RESULT") {
            if (arrayOfNexTripDeparture.length !== 0) { // update DOM only if it's needed
              this.updateDom(self.config.fadeSpeed)
            }
          }
    
    },

    getHeader: function() {
        return this.config.header
    },

    getDom: function() {
        Log.info(this.busesInfo)
        var wrapper = document.createElement("wrapper")
        wrapper.className = "wrapper";
        wrapper.style.maxWidth = this.config.maxWidth;


        // loading
        if (!this.loaded) {
            wrapper.innerHTML = "Finding buses . . .";
            wrapper.classList.add("bright", "light", "small");
            return wrapper;
        }

        // creating the header
        if (this.config.useHeader != false) {
            var header = document.createElement("header");
            header.classList.add("xsmall", "bright", "light", "header");
            header.innerHTML = this.config.header;
            wrapper.appendChild(header);
        }

        var table = document.createElement("table");
        table.classList.add("xsmall", "bright", "light");
        wrapper.appendChild(table);

        var tr = document.createElement("tr");
        table.appendChild(tr);

        return element
    }
    

})