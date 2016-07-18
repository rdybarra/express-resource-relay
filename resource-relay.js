'use strict'

var request = require('request');

class ResourceRelay {

  constructor(req, res, next, options) {
    this.req = req;
    this.res = res;

    options = options || {};

    let moduleDefaults = {
      json: true,
      method: this.req.method
    };

    this.requestOptions = Object.assign({}, moduleDefaults, options);

    this._forwardPathWithUri();
    this._addRequestQueryStrings();
    this._addRequestBody();
    this._removeBodyOnRequestsThatShouldNotHaveit();
  }

  makeRequest(debug) {
    if (debug) {
      console.log(this.requestOptions);
    }

    request(this.requestOptions).pipe(this.res);
  }

  _forwardPathWithUri() {
    this.requestOptions.uri += this.req._parsedUrl.pathname;
  }

  _addRequestQueryStrings() {
    if (this.requestOptions.qs) {
      this.requestOptions.qs = Object.assign(this.req.query, this.requestOptions.qs);
    }
  }

  _addRequestBody() {
    if (this.requestOptions.body) {
      this.requestOptions.body = Object.assign(this.req.body, this.requestOptions.body);
    }
  }

  _removeBodyOnRequestsThatShouldNotHaveit() {
    if (['POST', 'PUT', 'PATCH'].indexOf(this.requestOptions.method) ===  -1) {
      delete this.requestOptions.body;
    }
  }
}

module.exports = ResourceRelay;
