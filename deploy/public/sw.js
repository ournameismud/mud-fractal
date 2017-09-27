'use strict';

/* eslint-disable */
var CACHE_NAME = 'mudstone-sw';
var urlsToCache = ['/', '/dist/css/style.css', '/dist/js/bundle.js'];
/* eslint-enable */

function addToCache(request, response) {
	if (response.ok) {
		var copy = response.clone();
		caches.open(CACHE_NAME).then(function (cache) {
			cache.put(request, copy);
		});
		return response;
	}
}

function fetchFromCache(event) {
	return caches.match(event.request).then(function (response) {
		if (!response) {
			// A synchronous error that will kick off the catch handler
			throw Error('${event.request.url} not found in cache');
		}
		return response;
	});
}

function offlineResponse() {
	return new Response('Sorry, the application is offline.');
}

function respondFromNetworkThenCache(event) {
	// Check network first, then cache
	var request = event.request;
	event.respondWith(fetch(request).then(function (response) {
		return addToCache(request, response);
	}).catch(function () {
		return fetchFromCache(event);
	}).catch(function () {
		return offlineResponse();
	}));
}

function respondFromCacheThenNetwork(event) {
	// Check cache first, then network
	var request = event.request;
	event.respondWith(fetchFromCache(event).catch(function () {
		return fetch(request);
	}).then(function (response) {
		return addToCache(request, response);
	}).catch(function () {
		return offlineResponse();
	}));
}

function shouldHandleFetch(event) {
	return event.request.method.toLowerCase() === 'get' && event.request.url.indexOf('/icons/') === -1 && event.request.url.indexOf('/browser-sync/') === -1 && event.request.url.indexOf('google-analytics.com') === -1;
}

// Open cache and store assets
self.addEventListener('install', function (event) {
	// Perform install steps
	event.waitUntil(caches.open(CACHE_NAME).then(function (cache) {
		return cache.addAll(urlsToCache);
	}));
});

self.addEventListener('fetch', function (event) {
	if (shouldHandleFetch(event)) {
		if (event.request.headers.get('Accept').indexOf('text/html') >= 0) {
			respondFromNetworkThenCache(event);
		} else {
			respondFromCacheThenNetwork(event);
		}
	}
});

self.addEventListener('activate', function (event) {
	var cacheWhitelist = [CACHE_NAME];
	// Clean up old cache versions
	event.waitUntil(caches.keys().then(function (cacheNames) {
		return Promise.all(cacheNames.map(function (cacheName) {
			if (cacheWhitelist.indexOf(cacheName) === -1) {
				return caches.delete(cacheName);
			}
		}));
	}));
});