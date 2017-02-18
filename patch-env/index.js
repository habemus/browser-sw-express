/**
 * This is a study in progress, we intend to contribute to the source repo.
 * The main problem is that the project still does not have its
 * scope closed so it is better for now to have full control over the code.
 * 
 * Taken from:
 * https://github.com/bahmutov/express-service
 */

// patch and mock the environment

// XMLHttpRequest is used to figure out the environment features
if (typeof global.XMLHttpRequest === 'undefined') {
  global.XMLHttpRequest = function XMLHttpRequest () {
    this.open = function open () {}
  };
}

// high resolution timestamps
/* global performance */
process.hrtime = performance.now.bind(performance)

process.stdout = {
  write: function fakeWrite (str) {
    console.log(str)
  }
}

// http structures used inside Express
var http = require('http')
if (!http.IncomingMessage) {
  http.IncomingMessage = {}
}

if (!http.ServerResponse) {
  http.ServerResponseProto = {
    _headers: {},
    setHeader: function setHeader (name, value) {
      console.log('set header %s to %s', name, value)
      this._headers[name] = value
    },
    getHeader: function getHeader (name) {
      return this._headers[name]
    },
    get: function get (name) {
      return this._headers[name]
    }
  }
  http.ServerResponse = Object.create({}, http.ServerResponseProto)
}

// setImmediate is missing in the ServiceWorker
if (typeof setImmediate === 'undefined') {
  global.setImmediate = function setImmediate (cb, param) {
    setTimeout(cb.bind(null, param), 0)
  }
}