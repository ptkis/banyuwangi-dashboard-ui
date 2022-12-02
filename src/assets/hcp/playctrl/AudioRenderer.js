"use strict"
var _createClass = (function () {
  function i(e, t) {
    for (var n = 0; n < t.length; n++) {
      var i = t[n]
      i.enumerable = i.enumerable || false
      i.configurable = true
      if ("value" in i) i.writable = true
      Object.defineProperty(e, i.key, i)
    }
  }
  return function (e, t, n) {
    if (t) i(e.prototype, t)
    if (n) i(e, n)
    return e
  }
})()
function _classCallCheck(e, t) {
  if (!(e instanceof t)) {
    throw new TypeError("Cannot call a class as a function")
  }
}
var __instance = (function () {
  var t = void 0
  return function (e) {
    if (e) t = e
    return t
  }
})()
var AudioRenderer = (function () {
  function t() {
    _classCallCheck(this, t)
    if (__instance()) return __instance()
    if (t.unique !== undefined) {
      return t.unique
    }
    t.unique = this
    this.oAudioContext = null
    this.currentVolume = 0.8
    this.bSetVolume = false
    this.gainNode = null
    this.iWndNum = -1
    this.mVolumes = new Map()
    var e = window.AudioContext || window.webkitAudioContext
    this.oAudioContext = new e()
    this.writeString = function (e, t, n) {
      for (var i = 0; i < n.length; i++) {
        e.setUint8(t + i, n.charCodeAt(i))
      }
    }
    this.setBufferToDataview = function (e, t, n) {
      for (var i = 0; i < n.length; i++, t++) {
        e.setUint8(t, n[i])
      }
    }
    __instance(this)
  }
  _createClass(t, [
    {
      key: "Play",
      value: function e(t, n, i) {
        var r = new ArrayBuffer(44 + n)
        var u = new DataView(r)
        var o = i.samplesPerSec
        var a = i.channels
        var s = i.bitsPerSample
        this.writeString(u, 0, "RIFF")
        u.setUint32(4, 32 + n * 2, true)
        this.writeString(u, 8, "WAVE")
        this.writeString(u, 12, "fmt ")
        u.setUint32(16, 16, true)
        u.setUint16(20, 1, true)
        u.setUint16(22, a, true)
        u.setUint32(24, o, true)
        u.setUint32(28, o * 2, true)
        u.setUint16(32, (a * s) / 8, true)
        u.setUint16(34, s, true)
        this.writeString(u, 36, "data")
        u.setUint32(40, n, true)
        this.setBufferToDataview(u, 44, t)
        var l = this
        this.oAudioContext.decodeAudioData(
          u.buffer,
          function (e) {
            var t = l.oAudioContext.createBufferSource()
            if (t == null) {
              return -1
            }
            t.buffer = e
            t.start(0)
            if (l.gainNode == null || l.bSetVolume) {
              l.gainNode = l.oAudioContext.createGain()
              l.bSetVolume = false
            }
            l.gainNode.gain.value = l.currentVolume
            l.gainNode.connect(l.oAudioContext.destination)
            t.connect(l.gainNode)
          },
          function (e) {
            console.log("decode error")
            return -1
          }
        )
        return 0
      },
    },
    {
      key: "Stop",
      value: function e() {
        if (this.gainNode != null) {
          this.gainNode.disconnect()
          this.gainNode = null
        }
        return true
      },
    },
    {
      key: "SetVolume",
      value: function e(t) {
        this.bSetVolume = true
        this.currentVolume = t
        this.mVolumes.set(this.iWndNum, t)
        return true
      },
    },
    {
      key: "SetWndNum",
      value: function e(t) {
        this.iWndNum = t
        var n = this.mVolumes.get(t)
        if (n == undefined) {
          n = 0.8
        }
        this.currentVolume = n
        return true
      },
    },
    {
      key: "GetVolume",
      value: function e() {
        var t = this.mVolumes.get(this.iWndNum)
        if (t == undefined) {
          t = 0.8
        }
        return t
      },
    },
  ])
  return t
})()
