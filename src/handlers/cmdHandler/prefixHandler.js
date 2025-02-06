import prefixSchema from '../../models/prefixSchema.js';

class PrefixHandler {
    //
    _prefixes = new Map();
    _defaultPrefix = '!';

    constructor() {
        this.loadPrefixes()
    }

    //Return the default prefix
    get defaultPrefix() {
        return this._defaultPrefix;
    }

    //Load all stored prefixes to cache on boot
    async loadPrefixes() {
        const results = await prefixSchema.find({});

        for (const result of results) {
            this._prefixes.set(result._id, result.prefix);
        }
    }

    //Returns the current prefix for the specified guild
    //or the default prefix if none were added
    get(guildId) {
        if (!guildId) return defaultPrefix;
        return this._prefixes.get(guildId) || this.defaultPrefix;
    }

    //Sets the prefix for the specified guild
    //and store it in the database
    async set(guildId, prefix) {
        this._prefixes.set(guildId, prefix);
        await prefixSchema.findOneAndUpdate({
            _id: guildId,
        },{
            _id: guildId,
            prefix,
        },{
            upsert: true,
        });
    }
}

export default PrefixHandler;