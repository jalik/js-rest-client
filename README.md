# @jalik/rest-client

![GitHub package.json version](https://img.shields.io/github/package-json/v/jalik/js-rest-client.svg)
[![Build Status](https://travis-ci.com/jalik/js-rest-client.svg?branch=master)](https://travis-ci.com/jalik/js-rest-client)
![GitHub](https://img.shields.io/github/license/jalik/js-rest-client.svg)
![GitHub last commit](https://img.shields.io/github/last-commit/jalik/js-rest-client.svg)
[![GitHub issues](https://img.shields.io/github/issues/jalik/js-rest-client.svg)](https://github.com/jalik/js-rest-client/issues)
![npm](https://img.shields.io/npm/dt/@jalik/rest-client.svg)

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
  // The default headers for all requests...
  headers: {},
});
```

## Sending requests

### Fetch

Fetch is the simplest way to execute HTTP requests in web browsers.
The REST client is using fetch under the hood, thus it accepts the same options and returns a `Promise`.

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

The `fetch()` method which called by all other verbs (delete, get, patch...) will automatically serialize the request body, if body is an object and the header `content-type` is `application/json`.

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

```js
const client = new RestClient({
  baseUrl: 'https://rest.coinapi.io/v1',
  headers: {
    accept: 'application/json',
  }
});
```

They can be get or set at anytime.

```js
client.setHeader('accept', '*');
client.getHeader('accept');
```

Note that all header names are lowercased automatically in `getHeader()` and `setHeader()`, so the following code is referring to the same exact header.

```js
// sets 'accept' header internally
client.setHeader('Accept', '*');
client.setHeader('accept', '*');

// gets 'accept' header internally
client.getHeader('Accept');
client.getHeader('accept');
```

If you need to loop through all defined headers.

```js
client.getHeaderNames().forEach((name) => {
  // do something
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
