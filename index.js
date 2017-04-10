var document = require('global/document')
var assert = require('assert')

module.exports = CachedElement

function CachedElement () {
  this._hasWindow = typeof window !== 'undefined'
  this._element = null
  this._proxy = null
  this._isProxied  = false
  this._args = null
}

CachedElement.prototype.render = function () {
  var args = new Array(arguments.length)
  for (var i = 0; i < args.length; i++) {
    args[i] = arguments[i]
  }

  if (!this._element || !this._hasWindow) {
    this._element = this._render.apply(this, args)
    this._args = args
    return this._element
  } else {
    var shouldUpdate = this._update(args, this._args)
    if (shouldUpdate) {
      this._element = this._render.apply(this, args)
      this._isProxied = false
      this._args = args
      return this._element
    } else {
      if (!this._isProxied) this._proxy = this._createProxy()
      return this._proxy
    }
  }
}

CachedElement.prototype._createProxy = function () {
  var el = document.createElement('div')
  el.setAttribute('data-cached-element', '')
  var self = this
  el.isSameNode = function (el) {
    return el === self._element
  }
  return el
}

CachedElement.prototype._update = function (args1, args2) {
  var length = args1.length
  if (length !== args2.length) return true
  for (var i = 0; i < length; i++) {
    if (args1[i] !== args2[i]) return true
  }
  return false
}
