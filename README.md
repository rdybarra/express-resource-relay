# Resource Relay
An HTTP proxy that forwards requests with conventionally appended data with the goal of reducing boilerplate code. 

The module forwards a request to a remote domain and optionally adds query stings and/or body params to the incoming ones. It lets you use any of the very popular [request](https://github.com/request/request) options that you want including the ones for basic auth.

The code is very short. You can look at it.

## Examples
```
GET mysite.com/foo -> GET othersite.com/foo?specialVar 
// Also can add auth headers and `specialVar` is just an example.

PATCH mysite.com/foo/5 -> PATCH othersite.com/foo/5?specialVar 
// Also can add auth headers and otherSpecialVar added to body payload
```

## Use Case
I have a client side app that needs to work with resources on remote services. However, for security purposes, instead of calling the remote service from the browser, I call my local service to attach authentication information and some helpful variables (e.g. accountId). Then, I make the request and pass the response back to the client.

For a typical resource (e.g. widget), I have the routes for each of the following requests:

```
GET /widgets              
GET /widgets/:widgetId
POST /widgets             
PUT /widgets/:widgetId    
PATCH /widgets/:widgetId   
DELETE /widgets/:widgetId 
```

Each route does basically the same thing. It maps the request to a remote service... with my accountId and auth headers...like this:

```
GET /widgets              /sprockets?accountId
GET /widgets/:widgetId    /sprockets/:widgetId?accountId
POST /widgets             /sprockets?accountId  (accountId added to body)
PUT /widgets/:widgetId    /sprockets/:widgetId?accountId  (accountId added to body)
PATCH /widgets/:widgetId  /sprockets/:widgetId?accountId
DELETE /widgets/:widgetId /sprockets/:widgetId?accountId
```

Instead of creating six routes per resource, this module allows me to create one. Here's how it looks.
```
router.all('/widgets/*', function(req, res, next) {
  new ResourceRelay(req, res, next, {
      uri: 'http://localhost:3000/sprockets',
      qs: {
        accountId: req.accountId
      },
      body: {
        accountId: req.accountId
      },
      auth: {
        user: 'Chandler',
        pass: 'Bing'
      }
    }
  ).makeRequest();
});
```

The above code covers all HTTP request types, forwards the full path of the url, attaches query stings and body params. It also attaches basic auth params.

## Usage
Require the module

```
var ResourceRelay = require('../lib/resource-relay.js');
```

Make a wildcard route for your resouce

```
router.all('/widgets/*', function(req, res, next) {
});
```

*My wildcard routes are in separate files per resource. I recommend that approach.*

Inside, instantiate a new RelayResource object and call the `makeRequest` method.

```
  new ResourceRelay(req, res, next, options).makeRequest();
```

All your settings should be in the `options` variable. The options variable is sent to the [request module](https://github.com/request/request)... with a few caveats (the following will make more sense if you familiarize yourself with the [request module options](https://github.com/request/request#requestoptions-callback).):

1. The `uri` parameter is required and should match the base domain of the remote resource. (e.g. "http://localhost:3000/sprockets").
2. The specified `qs` and `body` parameters are *added* to any incoming query strings or body parameters. They do not replace them.
3. The `method` parameter will be set automatically for you based on the incoming request method. It can, like any property, be overwritten if you wish.
4. The `json` parameter is set to `true` by default.












