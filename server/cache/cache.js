const NodeCache = require("node-cache");

class Cache {
	constructor(ttlSeconds) {
		this.cache = new NodeCache({
			stdTTL: ttlSeconds,
			checkperiod: ttlSeconds * 0.2,
			useClones: false,
		});
	}

	//gets an item from the cache or adds it if needed
	get(key, retrieveFunction) {
		//gets an item from the cache based on the key
		const value = this.cache.get(key);
		if (value) {
			//if the value exists then return that value
			return Promise.resolve(value);
		}
		//if it doesn't then call the function to get it
		return retrieveFunction().then((result) => {
			//adds it to the cache
			this.cache.set(key, result);
			//returns the value just added to the cache
			return result;
		});
	}

	//removes an item with a certain key from the cache
	del(keys) {
		this.cache.del(keys);
	}

	//clears the cache
	flush() {
		this.cache.flushAll();
	}
}

module.exports = { Cache };
