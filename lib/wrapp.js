const Promise = require("bluebird")
const co = Promise.coroutine

module.exports = function (opts, func) {
	// assign against defaults
	opts = Object.assign({every: 1, files: 1}, opts)

	return co(function * (o, ...args) {
		o = o || {}
		// grab alias to chosen source type
		const arr = this._[opts.files ? "files" : "globs"]
		// wrapper pass all arguments to plugin func
		const run = s => co(func)(s, o, ...args)
		// loop thru EACH if `every`, else send full source array
		yield (opts.every ? Promise.all(arr.map(run)) : run(arr))
		// send back instance allow chain
		return this
	})
}