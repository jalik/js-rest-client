# @jalik/rest-client

![GitHub package.json version](https://img.shields.io/github/package-json/v/jalik/js-rest-client.svg)
[![Build Status](https://travis-ci.com/jalik/js-rest-client.svg?branch=master)](https://travis-ci.com/jalik/js-rest-client)
![GitHub](https://img.shields.io/github/license/jalik/js-rest-client.svg)
![GitHub last commit](https://img.shields.io/github/last-commit/jalik/js-rest-client.svg)
[![GitHub issues](https://img.shields.io/github/issues/jalik/js-rest-client.svg)](https://github.com/jalik/js-rest-client/issues)
![npm](https://img.shields.io/npm/dt/@jalik/rest-client.svg)

**WARNING: DEPRECATED PACKAGE**  
I've made a mistake while naming this package, so I decided to create a new one with a different name and lightly different goal, using TypeScript.  
Have a look at [@jalik/fetch-client](https://github.com/jalik/js-fetch-client) to use an HTTP client based on fetch which runs in the Browser and NodeJS, with global config, shortcut methods, transformations capabilities and more.

## Why using this ?

We often repeat our self when creating a REST client, however there are some little things that could be avoided on each request, like concatenating base URL with path, passing credentials, serializing data...

With this lib, you can build a REST client quickly and almost effortlessly.
It can also be used to create an REST SDK, so your users would not have to craft the requests entirely.

## Creating a REST client

Let's see how to create a REST client.

```js
import RestClient from '@jalik/rest-client';

const client = new RestClient({
  // The base URL of all requests.
  baseUrl: 'https://rest.coinapi.io/v1',
});
```

## Sending requests

### Fetch

Fetch is the standard and simplest way to execute HTTP requests in web browsers using `Promise`.
This lib is using `fetch()` under the hood (via the `whatwg-fetch` polyfill package), so if you know how to use `fetch()`, you already know how to craft requests with this REST client.

See how to use fetch on https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch.

```js
const body = { name: 'Karl' };

client.fetch('/users', { 
  method: 'POST',
  body: JSON.stringify(body),
  headers: {
    'content-type': 'application/json'
  }
})
  .then((resp) => {
    // handle response
  })
  .catch((error) => {
    // handle error
  });
```

This method is generic, so to make code more concise and readable, you can use any of the next shortcut methods, which correspond to an HTTP verb.

**Note about JSON serialization**

The `fetch()` method which is called by all the methods below (delete, get, patch...) will automatically serialize the request body, if `body` is an object and the header `content-type` is `application/json`.

### DELETE

```js
client.delete('/users/1')
  .then((resp) => {
    // handle response
  })
  .catch((error) => {
    // handle error
  });
```

### GET

```js
client.get('/users', {
  headers: { accept: 'application/json' }
})
  .then((resp) => resp.json())
  .then((json) => {
    // handle response
  })
  .catch((error) => {
    // handle error
  });
```

### HEAD

```js
client.head('/users', {
  headers: { accept: 'application/json' }
})
  .then((resp) => {
    // handle response
  })
  .catch((error) => {
    // handle error
  });
```

### OPTIONS

```js
client.options('/users', {
  headers: { accept: 'application/json' }
})
  .then((resp) => {
    // handle response
  })
  .catch((error) => {
    // handle error
  });
```

### PATCH

```js
const body = { name: 'Karl' };

client.patch('/users/1', body, {
  headers: { 'content-type': 'application/json' }
})
  .then((resp) => {
    // handle response
  })
  .catch((error) => {
    // handle error
  });
```

### POST

```js
const body = { name: 'Karl' };

client.post('/users', body, {
  headers: { 'content-type': 'application/json' }
})
  .then((resp) => {
    // handle response
  })
  .catch((error) => {
    // handle error
  });
```

### PUT

```js
const body = { name: 'Karl' };

client.put('/users', body, {
  headers: { 'content-type': 'application/json' }
})
  .then((resp) => {
    // handle response
  })
  .catch((error) => {
    // handle error
  });
```

## Managing headers

Headers can be set when creating the `RestClient` instance.
For example the code below will send the `accept` header with all requests (while being overridable on each request).

```js
const client = new RestClient({
  baseUrl: 'https://rest.coinapi.io/v1',
  headers: {
    accept: 'application/json',
  }
});
```

Headers can be get or set at anytime and anywhere in your code.

```js
client.setHeader('accept', '*');
client.getHeader('accept');
```

Note that all header names are lower cased automatically in `getHeader()` and `setHeader()` to make it more bug proof, so the following code is referring to the same header.

```js
// Define 'accept' header equivalents
client.setHeader('Accept', '*');
client.setHeader('ACCEPT', '*');
client.setHeader('accept', '*');

// Return 'accept' header equivalents
client.getHeader('Accept');
client.getHeader('ACCEPT');
client.getHeader('accept');
```

If you need to override or remove specific headers for a request it's still possible by passing these headers in the request options. The next example works with all methods (delete, patch, post...).

```js
// This will replace the `accept` header only for this request.
client.get('/users', {
  headers: { accept: 'application/xml' }
});

// This will not send current credentials for this request.
client.post('/auth', { user: 'jalik', pass: 'yun8amginIr#' }, {
  headers: { authorization: '' }
});
```

Finally, if you need to loop through all defined headers.

```js
client.getHeaderNames().forEach((name) => {
  const value = client.getHeader(name);
  // do something with value...
});
```

## Authentication

Generally, authenticating against an API is done by providing a header, which could be the classic `authorization` header or a custom access token header. Below is a list of examples showing some of them.

```js
// Basic authentication
client.setHeader('authorization', 'Basic dGVzdDoxMjPCow==');

// Bearer authentication
client.setHeader('authorization', 'Bearer mF_9.B5f-4.1JqM');

// Custom access token (api key)
client.setHeader('x-api-key', 'Jec5omtyacuzUcCanQuibPyFrajecEif');
```

Note that there is no mechanism to support token as query parameter because it is a bad practice and not secure (https://tools.ietf.org/html/rfc6750#section-2.3). However, this can still be achieved by passing the access token on each request manually.

## Changelog

History of releases is in the [changelog](./CHANGELOG.md).

## License

The code is released under the [MIT License](http://www.opensource.org/licenses/MIT).
