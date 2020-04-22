/*
 * The MIT License (MIT)
 *
 * Copyright (c) 2020 Karl STEIN
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NON INFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

import RestClient from '../src/RestClient';
import server, {
  API_KEY,
  API_KEY_HEADER,
} from './server';

const baseUrl = `http://localhost:${server.getPort()}`;
const APPLICATION_JSON = 'application/json';

beforeAll(() => {
  server.start();
});

afterAll(() => {
  server.stop();
});

describe('new RestClient(options)', () => {
  const options = { baseUrl, headers: { accept: APPLICATION_JSON } };
  const client = new RestClient(options);

  it('should set baseUrl from options', () => {
    expect(client.baseUrl).toBe(options.baseUrl);
  });

  it('should throw an error if baseUrl is not set or invalid', () => {
    expect(() => new RestClient({ baseUrl: undefined })).toThrow();
    expect(() => new RestClient({ baseUrl: '' })).toThrow();
  });

  describe('delete(url, options)', () => {
    const promise = client.delete('/delete/1');

    it('should return a promise', () => {
      expect(promise).not.toBeNull();
      expect(promise).toBeInstanceOf(Promise);
    });

    it('should return the result', () => (
      promise.then((resp) => {
        expect(resp.status).toBe(204);
        return resp.text();
      }).then((result) => {
        expect(result).toBe('');
      })
    ));
  });

  describe('fetch(url, options)', () => {
    const promise = client.fetch('/get/2');

    it('should return a promise', () => {
      expect(promise).not.toBeNull();
      expect(promise).toBeInstanceOf(Promise);
    });

    it('should return the result', () => (
      promise.then((resp) => resp.json()).then((result) => {
        expect(result).toStrictEqual({ id: '2' });
      })
    ));

    it('should send headers', () => (
      client.get('/private', {
        headers: { [API_KEY_HEADER]: API_KEY },
      })
        .then((resp) => {
          expect(resp.status).toBe(200);
          return resp.json();
        })
        .then((result) => {
          expect(result).toStrictEqual({ private: true });
        })
    ));
  });

  describe('get(url, options)', () => {
    const promise = client.get('/get/3');

    it('should return a promise', () => {
      expect(promise).not.toBeNull();
      expect(promise).toBeInstanceOf(Promise);
    });

    it('should return the result', () => (
      promise.then((resp) => {
        expect(resp.status).toBe(200);
        return resp.json();
      }).then((result) => {
        expect(result).toStrictEqual({ id: '3' });
      })
    ));
  });

  describe('getHeader(name)', () => {
    it('should return header value', () => {
      expect(client.headers.accept).toBe(APPLICATION_JSON);
    });

    it('should be insensitive', () => {
      expect(client.getHeader('accept')).toBe(APPLICATION_JSON);
      expect(client.getHeader('Accept')).toBe(APPLICATION_JSON);
    });
  });

  describe('getHeaderNames()', () => {
    it('should return all header names', () => {
      expect(client.getHeaderNames()).toBeInstanceOf(Array);
      expect(client.getHeaderNames()).toEqual(expect.arrayContaining(Object.keys(client.headers)));
    });
  });

  describe('head(url, options)', () => {
    const promise = client.head('/head/3');

    it('should return a promise', () => {
      expect(promise).not.toBeNull();
      expect(promise).toBeInstanceOf(Promise);
    });

    it('should return the result', () => (
      promise.then((resp) => {
        expect(resp.status).toBe(204);
        return resp.text();
      }).then((result) => {
        expect(result).toBe('');
      })
    ));
  });

  describe('options(url, options)', () => {
    const promise = client.options('/options');

    it('should return a promise', () => {
      expect(promise).not.toBeNull();
      expect(promise).toBeInstanceOf(Promise);
    });

    it('should return the result', () => (
      promise.then((resp) => {
        expect(resp.status).toBe(204);
        return resp.text();
      }).then((result) => {
        expect(result).toBe('');
      })
    ));
  });

  describe('patch(url, body, options)', () => {
    const body = { patched: true };
    const promise = client.patch('/patch/4', body, {
      headers: { 'content-type': APPLICATION_JSON },
    });

    it('should return a promise', () => {
      expect(promise).not.toBeNull();
      expect(promise).toBeInstanceOf(Promise);
    });

    it('should return the result', () => (
      promise.then((resp) => {
        expect(resp.status).toBe(200);
        return resp.json();
      }).then((result) => {
        expect(result).toStrictEqual({ id: '4', ...body });
      })
    ));
  });

  describe('post(url, body, options)', () => {
    const body = { posted: true };
    const promise = client.post('/post/5', body, {
      headers: { 'content-type': APPLICATION_JSON },
    });

    it('should return a promise', () => {
      expect(promise).not.toBeNull();
      expect(promise).toBeInstanceOf(Promise);
    });

    it('should return the result', () => (
      promise.then((resp) => {
        expect(resp.status).toBe(201);
        return resp.json();
      }).then((result) => {
        expect(result).toStrictEqual({ id: '5', ...body });
      })
    ));
  });

  describe('put(url, body, options)', () => {
    const body = { putted: true };
    const promise = client.put('/put/6', body, {
      headers: { 'content-type': APPLICATION_JSON },
    });

    it('should return a promise', () => {
      expect(promise).not.toBeNull();
      expect(promise).toBeInstanceOf(Promise);
    });

    it('should return the result', () => (
      promise.then((resp) => {
        expect(resp.status).toBe(200);
        return resp.json();
      }).then((result) => {
        expect(result).toStrictEqual({ id: '6', ...body });
      })
    ));
  });

  describe('setHeader(name, value)', () => {
    it('should set header value', () => {
      client.setHeader('test', 'true');
      expect(client.headers.test).toBe('true');
    });

    it('should lowercase header name', () => {
      client.setHeader('Test', 'true');
      expect(client.headers.test).toBe('true');
      expect(client.headers.Test).toBeUndefined();
    });
  });
});
