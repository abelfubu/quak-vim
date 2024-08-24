;(function () {
  'use strict'

  const p = /[^{\}]+(?=})/g,
    f = {}

  function L(e, r) {
    if (r) {
      if (e === 'input') return k(r)
      if (e === 'button') return h(r)
      if (!f[e]) {
        const t = e.match(p)
        f[e] = t
      }
      f[e] &&
        f[e].forEach((t) => {
          e = e.replace(`{${t}}`, r[t])
        })
    } else return
    return e.substring(0, 120)
  }

  function k(e) {
    let r = ''
    if (e.ariaLabel) r = e.ariaLabel
    else if (e.title) r = e.title
    else if (e.id) {
      const t = document.querySelector(`[for="${e.id}"]`)
      t && (r = t.innerText)
    } else if (e.getAttribute('aria-labelledby')) {
      const t = document.getElementById(e.getAttribute('aria-labelledby'))
      t && (r = t.innerText)
    } else r = e.placeholder
    return r ? `${r} Input` : null
  }

  function h(e) {
    if (e.dataset.tooltip) return e.dataset.tooltip
    if (e.title) return e.title
    if (e.ariaLabel) return e.ariaLabel
    if (e.getAttribute('aria-labelledby')) {
      const r = document.getElementById(e.getAttribute('aria-labelledby'))
      if (r) return r.innerText
    }
    return e.innerText
  }

  function d(e) {
    let r
    try {
      if (
        (e.startsWith('/') && (e = `${window.location.origin}${e}`),
        (r = new URL(e)),
        r.protocol === 'http:' || r.protocol === 'https:')
      )
        return r.href
    } catch {
      return null
    }
  }

  function E(e, r) {
    return r.allowHidden ? !1 : e.offsetParent === null
  }
  const l = {
    ALL: 'All',
    PAGE: 'Page',
    TABS: 'Tabs',
    BOOKMARKS: 'Bookmarks',
  }

  function T(e, r, t) {
    var o
    let c
    const u =
        (o = t.label) != null && o.selector
          ? e.querySelector(t.label.selector)
          : e,
      s = L(t.label.template, u),
      a = t.trigger.selector ? e.querySelector(t.trigger.selector) : e
    if (s && s !== '#' && a && !E(a, t)) {
      if (t.trigger.type === 'open') {
        const n = d(a.href)
        if (n) return (c = g(s, n, t.order, t.disabled, [l.ALL, l.PAGE], a)), c
        t.trigger.type = 'click'
      }
      c = {
        type: r,
        key: a,
        label: s,
        categories: [l.ALL, l.PAGE],
        scopeElement: e,
        triggerElement: a,
        config: t,
      }
    }
    return c
  }

  function g(e, r, t, c, u, s = null) {
    return {
      type: 'link',
      key: r,
      label: e,
      categories: u,
      config: {
        url: r,
        label: e,
        target: '_self',
        order: t,
        disabled: c,
      },
      triggerElement: s,
    }
  }

  function P(e) {
    const r = new Map()
    let t
    e.commandTemplates.forEach((a, o) => {
      var b
      const n = a.type,
        i = (b = a.config) != null ? b : a[a.type]
      ;(i.order = i.order || o + 1),
        n === 'element'
          ? document.querySelectorAll(i.scope.selector).forEach((y) => {
              const A = JSON.parse(JSON.stringify(i))
              ;(t = T(y, n, A)), t && r.set(t.key, t)
            })
          : n == 'link' &&
            ((t = g(i.label, d(i.url), i.order, i.disabled, [l.ALL, l.PAGE])),
            r.set(t.key, t))
    }),
      r.set('goBack', {
        type: 'callback',
        label: 'Go back',
        config: {},
        categories: [l.ALL, l.PAGE],
        callback: () => history.back(),
      }),
      r.set('goForward', {
        type: 'callback',
        label: 'Go forward',
        config: {},
        categories: [l.ALL, l.PAGE],
        callback: () => history.forward(),
      }),
      r.set('reload', {
        type: 'callback',
        label: 'Reload this page',
        config: {},
        categories: [l.ALL, l.PAGE],
        callback: () => location.reload(),
      }),
      e.chromeCommands.forEach((a) => {
        r.set(`${a.label}-${a.config.id}`, a)
      })

    function c(a) {
      let o = a.label + a.type
      return a.type === 'element' && (o += a.config.trigger.type), o
    }
    const u = new Map()
    return (
      Array.from(r.values()).forEach((a) => {
        const o = c(a)
        u.set(o, a)
      }),
      Array.from(u.values())
        .filter((a) => {
          var o
          return !((o = a.config) != null && o.disabled)
        })
        .sort((a, o) => {
          var n, i
          return (
            ((n = o.config) == null ? void 0 : n.order) -
            ((i = a.config) == null ? void 0 : i.order)
          )
        })
    )
  }

  var ps = Object.defineProperty,
    hs = Object.defineProperties
  var vs = Object.getOwnPropertyDescriptors
  var wn = Object.getOwnPropertySymbols
  var po = Object.prototype.hasOwnProperty,
    ho = Object.prototype.propertyIsEnumerable
  var fo = (e, t, n) =>
      t in e
        ? ps(e, t, {
            enumerable: !0,
            configurable: !0,
            writable: !0,
            value: n,
          })
        : (e[t] = n),
    Q = (e, t) => {
      for (var n in t || (t = {})) po.call(t, n) && fo(e, n, t[n])
      if (wn) for (var n of wn(t)) ho.call(t, n) && fo(e, n, t[n])
      return e
    },
    ze = (e, t) => hs(e, vs(t))
  var et = (e, t) => {
    var n = {}
    for (var r in e) po.call(e, r) && t.indexOf(r) < 0 && (n[r] = e[r])
    if (e != null && wn)
      for (var r of wn(e)) t.indexOf(r) < 0 && ho.call(e, r) && (n[r] = e[r])
    return n
  }

  function Mr(e, t) {
    const n = Object.create(null),
      r = e.split(',')
    for (let o = 0; o < r.length; o++) n[r[o]] = !0
    return t ? (o) => !!n[o.toLowerCase()] : (o) => !!n[o]
  }
  const gs =
      'itemscope,allowfullscreen,formnovalidate,ismap,nomodule,novalidate,readonly',
    bs = Mr(gs)

  function Qo(e) {
    return !!e || e === ''
  }

  function $r(e) {
    if (Z(e)) {
      const t = {}
      for (let n = 0; n < e.length; n++) {
        const r = e[n],
          o = ye(r) ? _s(r) : $r(r)
        if (o) for (const l in o) t[l] = o[l]
      }
      return t
    } else {
      if (ye(e)) return e
      if (_e(e)) return e
    }
  }
  const xs = /;(?![^(]*\))/g,
    ys = /:(.+)/

  function _s(e) {
    const t = {}
    return (
      e.split(xs).forEach((n) => {
        if (n) {
          const r = n.split(ys)
          r.length > 1 && (t[r[0].trim()] = r[1].trim())
        }
      }),
      t
    )
  }

  function Dt(e) {
    let t = ''
    if (ye(e)) t = e
    else if (Z(e))
      for (let n = 0; n < e.length; n++) {
        const r = Dt(e[n])
        r && (t += r + ' ')
      }
    else if (_e(e)) for (const n in e) e[n] && (t += n + ' ')
    return t.trim()
  }
  const Rt = (e) =>
      ye(e)
        ? e
        : e == null
        ? ''
        : Z(e) || (_e(e) && (e.toString === tl || !G(e.toString)))
        ? JSON.stringify(e, Zo, 2)
        : String(e),
    Zo = (e, t) =>
      t && t.__v_isRef
        ? Zo(e, t.value)
        : Vt(t)
        ? {
            [`Map(${t.size})`]: [...t.entries()].reduce(
              (n, [r, o]) => ((n[`${r} =>`] = o), n),
              {}
            ),
          }
        : Go(t)
        ? {
            [`Set(${t.size})`]: [...t.values()],
          }
        : _e(t) && !Z(t) && !nl(t)
        ? String(t)
        : t,
    de = {},
    zt = [],
    Xe = () => {},
    ws = () => !1,
    Cs = /^on[^a-z]/,
    zn = (e) => Cs.test(e),
    jr = (e) => e.startsWith('onUpdate:'),
    De = Object.assign,
    Br = (e, t) => {
      const n = e.indexOf(t)
      n > -1 && e.splice(n, 1)
    },
    Es = Object.prototype.hasOwnProperty,
    re = (e, t) => Es.call(e, t),
    Z = Array.isArray,
    Vt = (e) => Vn(e) === '[object Map]',
    Go = (e) => Vn(e) === '[object Set]',
    G = (e) => typeof e == 'function',
    ye = (e) => typeof e == 'string',
    Ur = (e) => typeof e == 'symbol',
    _e = (e) => e !== null && typeof e == 'object',
    el = (e) => _e(e) && G(e.then) && G(e.catch),
    tl = Object.prototype.toString,
    Vn = (e) => tl.call(e),
    Os = (e) => Vn(e).slice(8, -1),
    nl = (e) => Vn(e) === '[object Object]',
    Hr = (e) =>
      ye(e) && e !== 'NaN' && e[0] !== '-' && '' + parseInt(e, 10) === e,
    Pn = Mr(
      ',key,ref,ref_for,ref_key,onVnodeBeforeMount,onVnodeMounted,onVnodeBeforeUpdate,onVnodeUpdated,onVnodeBeforeUnmount,onVnodeUnmounted'
    ),
    Yn = (e) => {
      const t = Object.create(null)
      return (n) => t[n] || (t[n] = e(n))
    },
    Ts = /-(\w)/g,
    st = Yn((e) => e.replace(Ts, (t, n) => (n ? n.toUpperCase() : ''))),
    Is = /\B([A-Z])/g,
    Bt = Yn((e) => e.replace(Is, '-$1').toLowerCase()),
    Jn = Yn((e) => e.charAt(0).toUpperCase() + e.slice(1)),
    sr = Yn((e) => (e ? `on${Jn(e)}` : '')),
    pn = (e, t) => !Object.is(e, t),
    Rn = (e, t) => {
      for (let n = 0; n < e.length; n++) e[n](t)
    },
    Mn = (e, t, n) => {
      Object.defineProperty(e, t, {
        configurable: !0,
        enumerable: !1,
        value: n,
      })
    },
    dr = (e) => {
      const t = parseFloat(e)
      return isNaN(t) ? e : t
    }
  let vo
  const Ss = () =>
    vo ||
    (vo =
      typeof globalThis != 'undefined'
        ? globalThis
        : typeof self != 'undefined'
        ? self
        : typeof window != 'undefined'
        ? window
        : typeof global != 'undefined'
        ? global
        : {})
  let nt
  class As {
    constructor(t = !1) {
      ;(this.active = !0),
        (this.effects = []),
        (this.cleanups = []),
        !t &&
          nt &&
          ((this.parent = nt),
          (this.index = (nt.scopes || (nt.scopes = [])).push(this) - 1))
    }
    run(t) {
      if (this.active) {
        const n = nt
        try {
          return (nt = this), t()
        } finally {
          nt = n
        }
      }
    }
    on() {
      nt = this
    }
    off() {
      nt = this.parent
    }
    stop(t) {
      if (this.active) {
        let n, r
        for (n = 0, r = this.effects.length; n < r; n++) this.effects[n].stop()
        for (n = 0, r = this.cleanups.length; n < r; n++) this.cleanups[n]()
        if (this.scopes)
          for (n = 0, r = this.scopes.length; n < r; n++)
            this.scopes[n].stop(!0)
        if (this.parent && !t) {
          const o = this.parent.scopes.pop()
          o &&
            o !== this &&
            ((this.parent.scopes[this.index] = o), (o.index = this.index))
        }
        this.active = !1
      }
    }
  }

  function Fs(e, t = nt) {
    t && t.active && t.effects.push(e)
  }
  const Kr = (e) => {
      const t = new Set(e)
      return (t.w = 0), (t.n = 0), t
    },
    rl = (e) => (e.w & Et) > 0,
    ol = (e) => (e.n & Et) > 0,
    Ps = ({ deps: e }) => {
      if (e.length) for (let t = 0; t < e.length; t++) e[t].w |= Et
    },
    Rs = (e) => {
      const { deps: t } = e
      if (t.length) {
        let n = 0
        for (let r = 0; r < t.length; r++) {
          const o = t[r]
          rl(o) && !ol(o) ? o.delete(e) : (t[n++] = o),
            (o.w &= ~Et),
            (o.n &= ~Et)
        }
        t.length = n
      }
    },
    pr = new WeakMap()
  let ln = 0,
    Et = 1
  const hr = 30
  let Ve
  const Nt = Symbol(''),
    vr = Symbol('')
  class qr {
    constructor(t, n = null, r) {
      ;(this.fn = t),
        (this.scheduler = n),
        (this.active = !0),
        (this.deps = []),
        (this.parent = void 0),
        Fs(this, r)
    }
    run() {
      if (!this.active) return this.fn()
      let t = Ve,
        n = wt
      for (; t; ) {
        if (t === this) return
        t = t.parent
      }
      try {
        return (
          (this.parent = Ve),
          (Ve = this),
          (wt = !0),
          (Et = 1 << ++ln),
          ln <= hr ? Ps(this) : mo(this),
          this.fn()
        )
      } finally {
        ln <= hr && Rs(this),
          (Et = 1 << --ln),
          (Ve = this.parent),
          (wt = n),
          (this.parent = void 0),
          this.deferStop && this.stop()
      }
    }
    stop() {
      Ve === this
        ? (this.deferStop = !0)
        : this.active &&
          (mo(this), this.onStop && this.onStop(), (this.active = !1))
    }
  }

  function mo(e) {
    const { deps: t } = e
    if (t.length) {
      for (let n = 0; n < t.length; n++) t[n].delete(e)
      t.length = 0
    }
  }
  let wt = !0
  const ll = []

  function Qt() {
    ll.push(wt), (wt = !1)
  }

  function Zt() {
    const e = ll.pop()
    wt = e === void 0 ? !0 : e
  }

  function Ue(e, t, n) {
    if (wt && Ve) {
      let r = pr.get(e)
      r || pr.set(e, (r = new Map()))
      let o = r.get(n)
      o || r.set(n, (o = Kr())), sl(o)
    }
  }

  function sl(e, t) {
    let n = !1
    ln <= hr ? ol(e) || ((e.n |= Et), (n = !rl(e))) : (n = !e.has(Ve)),
      n && (e.add(Ve), Ve.deps.push(e))
  }

  function pt(e, t, n, r, o, l) {
    const s = pr.get(e)
    if (!s) return
    let i = []
    if (t === 'clear') i = [...s.values()]
    else if (n === 'length' && Z(e))
      s.forEach((a, f) => {
        ;(f === 'length' || f >= r) && i.push(a)
      })
    else
      switch ((n !== void 0 && i.push(s.get(n)), t)) {
        case 'add':
          Z(e)
            ? Hr(n) && i.push(s.get('length'))
            : (i.push(s.get(Nt)), Vt(e) && i.push(s.get(vr)))
          break
        case 'delete':
          Z(e) || (i.push(s.get(Nt)), Vt(e) && i.push(s.get(vr)))
          break
        case 'set':
          Vt(e) && i.push(s.get(Nt))
          break
      }
    if (i.length === 1) i[0] && mr(i[0])
    else {
      const a = []
      for (const f of i) f && a.push(...f)
      mr(Kr(a))
    }
  }

  function mr(e, t) {
    for (const n of Z(e) ? e : [...e])
      (n !== Ve || n.allowRecurse) && (n.scheduler ? n.scheduler() : n.run())
  }
  const ks = Mr('__proto__,__v_isRef,__isVue'),
    il = new Set(
      Object.getOwnPropertyNames(Symbol)
        .map((e) => Symbol[e])
        .filter(Ur)
    ),
    Ls = Wr(),
    Ds = Wr(!1, !0),
    Ns = Wr(!0),
    go = Ms()

  function Ms() {
    const e = {}
    return (
      ['includes', 'indexOf', 'lastIndexOf'].forEach((t) => {
        e[t] = function (...n) {
          const r = q(this)
          for (let l = 0, s = this.length; l < s; l++) Ue(r, 'get', l + '')
          const o = r[t](...n)
          return o === -1 || o === !1 ? r[t](...n.map(q)) : o
        }
      }),
      ['push', 'pop', 'shift', 'unshift', 'splice'].forEach((t) => {
        e[t] = function (...n) {
          Qt()
          const r = q(this)[t].apply(this, n)
          return Zt(), r
        }
      }),
      e
    )
  }

  function Wr(e = !1, t = !1) {
    return function (r, o, l) {
      if (o === '__v_isReactive') return !e
      if (o === '__v_isReadonly') return e
      if (o === '__v_isShallow') return t
      if (o === '__v_raw' && l === (e ? (t ? Gs : dl) : t ? fl : cl).get(r))
        return r
      const s = Z(r)
      if (!e && s && re(go, o)) return Reflect.get(go, o, l)
      const i = Reflect.get(r, o, l)
      return (Ur(o) ? il.has(o) : ks(o)) || (e || Ue(r, 'get', o), t)
        ? i
        : Ae(i)
        ? !s || !Hr(o)
          ? i.value
          : i
        : _e(i)
        ? e
          ? pl(i)
          : xn(i)
        : i
    }
  }
  const $s = al(),
    js = al(!0)

  function al(e = !1) {
    return function (n, r, o, l) {
      let s = n[r]
      if (hn(s) && Ae(s) && !Ae(o)) return !1
      if (
        !e &&
        !hn(o) &&
        (hl(o) || ((o = q(o)), (s = q(s))), !Z(n) && Ae(s) && !Ae(o))
      )
        return (s.value = o), !0
      const i = Z(n) && Hr(r) ? Number(r) < n.length : re(n, r),
        a = Reflect.set(n, r, o, l)
      return (
        n === q(l) && (i ? pn(o, s) && pt(n, 'set', r, o) : pt(n, 'add', r, o)),
        a
      )
    }
  }

  function Bs(e, t) {
    const n = re(e, t)
    e[t]
    const r = Reflect.deleteProperty(e, t)
    return r && n && pt(e, 'delete', t, void 0), r
  }

  function Us(e, t) {
    const n = Reflect.has(e, t)
    return (!Ur(t) || !il.has(t)) && Ue(e, 'has', t), n
  }

  function Hs(e) {
    return Ue(e, 'iterate', Z(e) ? 'length' : Nt), Reflect.ownKeys(e)
  }
  const ul = {
      get: Ls,
      set: $s,
      deleteProperty: Bs,
      has: Us,
      ownKeys: Hs,
    },
    Ks = {
      get: Ns,
      set(e, t) {
        return !0
      },
      deleteProperty(e, t) {
        return !0
      },
    },
    qs = De({}, ul, {
      get: Ds,
      set: js,
    }),
    zr = (e) => e,
    Xn = (e) => Reflect.getPrototypeOf(e)

  function Cn(e, t, n = !1, r = !1) {
    e = e.__v_raw
    const o = q(e),
      l = q(t)
    t !== l && !n && Ue(o, 'get', t), !n && Ue(o, 'get', l)
    const { has: s } = Xn(o),
      i = r ? zr : n ? Jr : vn
    if (s.call(o, t)) return i(e.get(t))
    if (s.call(o, l)) return i(e.get(l))
    e !== o && e.get(t)
  }

  function En(e, t = !1) {
    const n = this.__v_raw,
      r = q(n),
      o = q(e)
    return (
      e !== o && !t && Ue(r, 'has', e),
      !t && Ue(r, 'has', o),
      e === o ? n.has(e) : n.has(e) || n.has(o)
    )
  }

  function On(e, t = !1) {
    return (
      (e = e.__v_raw), !t && Ue(q(e), 'iterate', Nt), Reflect.get(e, 'size', e)
    )
  }

  function bo(e) {
    e = q(e)
    const t = q(this)
    return Xn(t).has.call(t, e) || (t.add(e), pt(t, 'add', e, e)), this
  }

  function xo(e, t) {
    t = q(t)
    const n = q(this),
      { has: r, get: o } = Xn(n)
    let l = r.call(n, e)
    l || ((e = q(e)), (l = r.call(n, e)))
    const s = o.call(n, e)
    return (
      n.set(e, t), l ? pn(t, s) && pt(n, 'set', e, t) : pt(n, 'add', e, t), this
    )
  }

  function yo(e) {
    const t = q(this),
      { has: n, get: r } = Xn(t)
    let o = n.call(t, e)
    o || ((e = q(e)), (o = n.call(t, e))), r && r.call(t, e)
    const l = t.delete(e)
    return o && pt(t, 'delete', e, void 0), l
  }

  function _o() {
    const e = q(this),
      t = e.size !== 0,
      n = e.clear()
    return t && pt(e, 'clear', void 0, void 0), n
  }

  function Tn(e, t) {
    return function (r, o) {
      const l = this,
        s = l.__v_raw,
        i = q(s),
        a = t ? zr : e ? Jr : vn
      return (
        !e && Ue(i, 'iterate', Nt),
        s.forEach((f, u) => r.call(o, a(f), a(u), l))
      )
    }
  }

  function In(e, t, n) {
    return function (...r) {
      const o = this.__v_raw,
        l = q(o),
        s = Vt(l),
        i = e === 'entries' || (e === Symbol.iterator && s),
        a = e === 'keys' && s,
        f = o[e](...r),
        u = n ? zr : t ? Jr : vn
      return (
        !t && Ue(l, 'iterate', a ? vr : Nt),
        {
          next() {
            const { value: p, done: m } = f.next()
            return m
              ? {
                  value: p,
                  done: m,
                }
              : {
                  value: i ? [u(p[0]), u(p[1])] : u(p),
                  done: m,
                }
          },
          [Symbol.iterator]() {
            return this
          },
        }
      )
    }
  }

  function gt(e) {
    return function (...t) {
      return e === 'delete' ? !1 : this
    }
  }

  function Ws() {
    const e = {
        get(l) {
          return Cn(this, l)
        },
        get size() {
          return On(this)
        },
        has: En,
        add: bo,
        set: xo,
        delete: yo,
        clear: _o,
        forEach: Tn(!1, !1),
      },
      t = {
        get(l) {
          return Cn(this, l, !1, !0)
        },
        get size() {
          return On(this)
        },
        has: En,
        add: bo,
        set: xo,
        delete: yo,
        clear: _o,
        forEach: Tn(!1, !0),
      },
      n = {
        get(l) {
          return Cn(this, l, !0)
        },
        get size() {
          return On(this, !0)
        },
        has(l) {
          return En.call(this, l, !0)
        },
        add: gt('add'),
        set: gt('set'),
        delete: gt('delete'),
        clear: gt('clear'),
        forEach: Tn(!0, !1),
      },
      r = {
        get(l) {
          return Cn(this, l, !0, !0)
        },
        get size() {
          return On(this, !0)
        },
        has(l) {
          return En.call(this, l, !0)
        },
        add: gt('add'),
        set: gt('set'),
        delete: gt('delete'),
        clear: gt('clear'),
        forEach: Tn(!0, !0),
      }
    return (
      ['keys', 'values', 'entries', Symbol.iterator].forEach((l) => {
        ;(e[l] = In(l, !1, !1)),
          (n[l] = In(l, !0, !1)),
          (t[l] = In(l, !1, !0)),
          (r[l] = In(l, !0, !0))
      }),
      [e, n, t, r]
    )
  }
  const [zs, Vs, Ys, Js] = Ws()

  function Vr(e, t) {
    const n = t ? (e ? Js : Ys) : e ? Vs : zs
    return (r, o, l) =>
      o === '__v_isReactive'
        ? !e
        : o === '__v_isReadonly'
        ? e
        : o === '__v_raw'
        ? r
        : Reflect.get(re(n, o) && o in r ? n : r, o, l)
  }
  const Xs = {
      get: Vr(!1, !1),
    },
    Qs = {
      get: Vr(!1, !0),
    },
    Zs = {
      get: Vr(!0, !1),
    },
    cl = new WeakMap(),
    fl = new WeakMap(),
    dl = new WeakMap(),
    Gs = new WeakMap()

  function ei(e) {
    switch (e) {
      case 'Object':
      case 'Array':
        return 1
      case 'Map':
      case 'Set':
      case 'WeakMap':
      case 'WeakSet':
        return 2
      default:
        return 0
    }
  }

  function ti(e) {
    return e.__v_skip || !Object.isExtensible(e) ? 0 : ei(Os(e))
  }

  function xn(e) {
    return hn(e) ? e : Yr(e, !1, ul, Xs, cl)
  }

  function ni(e) {
    return Yr(e, !1, qs, Qs, fl)
  }

  function pl(e) {
    return Yr(e, !0, Ks, Zs, dl)
  }

  function Yr(e, t, n, r, o) {
    if (!_e(e) || (e.__v_raw && !(t && e.__v_isReactive))) return e
    const l = o.get(e)
    if (l) return l
    const s = ti(e)
    if (s === 0) return e
    const i = new Proxy(e, s === 2 ? r : n)
    return o.set(e, i), i
  }

  function Yt(e) {
    return hn(e) ? Yt(e.__v_raw) : !!(e && e.__v_isReactive)
  }

  function hn(e) {
    return !!(e && e.__v_isReadonly)
  }

  function hl(e) {
    return !!(e && e.__v_isShallow)
  }

  function vl(e) {
    return Yt(e) || hn(e)
  }

  function q(e) {
    const t = e && e.__v_raw
    return t ? q(t) : e
  }

  function ml(e) {
    return Mn(e, '__v_skip', !0), e
  }
  const vn = (e) => (_e(e) ? xn(e) : e),
    Jr = (e) => (_e(e) ? pl(e) : e)

  function gl(e) {
    wt && Ve && ((e = q(e)), sl(e.dep || (e.dep = Kr())))
  }

  function bl(e, t) {
    ;(e = q(e)), e.dep && mr(e.dep)
  }

  function Ae(e) {
    return !!(e && e.__v_isRef === !0)
  }

  function X(e) {
    return ri(e, !1)
  }

  function ri(e, t) {
    return Ae(e) ? e : new oi(e, t)
  }
  class oi {
    constructor(t, n) {
      ;(this.__v_isShallow = n),
        (this.dep = void 0),
        (this.__v_isRef = !0),
        (this._rawValue = n ? t : q(t)),
        (this._value = n ? t : vn(t))
    }
    get value() {
      return gl(this), this._value
    }
    set value(t) {
      ;(t = this.__v_isShallow ? t : q(t)),
        pn(t, this._rawValue) &&
          ((this._rawValue = t),
          (this._value = this.__v_isShallow ? t : vn(t)),
          bl(this))
    }
  }

  function $n(e) {
    return Ae(e) ? e.value : e
  }
  const li = {
    get: (e, t, n) => $n(Reflect.get(e, t, n)),
    set: (e, t, n, r) => {
      const o = e[t]
      return Ae(o) && !Ae(n) ? ((o.value = n), !0) : Reflect.set(e, t, n, r)
    },
  }

  function xl(e) {
    return Yt(e) ? e : new Proxy(e, li)
  }
  class si {
    constructor(t, n, r, o) {
      ;(this._setter = n),
        (this.dep = void 0),
        (this.__v_isRef = !0),
        (this._dirty = !0),
        (this.effect = new qr(t, () => {
          this._dirty || ((this._dirty = !0), bl(this))
        })),
        (this.effect.computed = this),
        (this.effect.active = this._cacheable = !o),
        (this.__v_isReadonly = r)
    }
    get value() {
      const t = q(this)
      return (
        gl(t),
        (t._dirty || !t._cacheable) &&
          ((t._dirty = !1), (t._value = t.effect.run())),
        t._value
      )
    }
    set value(t) {
      this._setter(t)
    }
  }

  function ii(e, t, n = !1) {
    let r, o
    const l = G(e)
    return (
      l ? ((r = e), (o = Xe)) : ((r = e.get), (o = e.set)),
      new si(r, o, l || !o, n)
    )
  }

  function Ct(e, t, n, r) {
    let o
    try {
      o = r ? e(...r) : e()
    } catch (l) {
      Qn(l, t, n)
    }
    return o
  }

  function Qe(e, t, n, r) {
    if (G(e)) {
      const l = Ct(e, t, n, r)
      return (
        l &&
          el(l) &&
          l.catch((s) => {
            Qn(s, t, n)
          }),
        l
      )
    }
    const o = []
    for (let l = 0; l < e.length; l++) o.push(Qe(e[l], t, n, r))
    return o
  }

  function Qn(e, t, n, r = !0) {
    const o = t ? t.vnode : null
    if (t) {
      let l = t.parent
      const s = t.proxy,
        i = n
      for (; l; ) {
        const f = l.ec
        if (f) {
          for (let u = 0; u < f.length; u++) if (f[u](e, s, i) === !1) return
        }
        l = l.parent
      }
      const a = t.appContext.config.errorHandler
      if (a) {
        Ct(a, null, 10, [e, s, i])
        return
      }
    }
    ai(e, n, o, r)
  }

  function ai(e, t, n, r = !0) {
    console.error(e)
  }
  let jn = !1,
    gr = !1
  const Be = []
  let ut = 0
  const an = []
  let sn = null,
    Kt = 0
  const un = []
  let bt = null,
    qt = 0
  const yl = Promise.resolve()
  let Xr = null,
    br = null

  function lt(e) {
    const t = Xr || yl
    return e ? t.then(this ? e.bind(this) : e) : t
  }

  function ui(e) {
    let t = ut + 1,
      n = Be.length
    for (; t < n; ) {
      const r = (t + n) >>> 1
      mn(Be[r]) < e ? (t = r + 1) : (n = r)
    }
    return t
  }

  function _l(e) {
    ;(!Be.length || !Be.includes(e, jn && e.allowRecurse ? ut + 1 : ut)) &&
      e !== br &&
      (e.id == null ? Be.push(e) : Be.splice(ui(e.id), 0, e), wl())
  }

  function wl() {
    !jn && !gr && ((gr = !0), (Xr = yl.then(Ol)))
  }

  function ci(e) {
    const t = Be.indexOf(e)
    t > ut && Be.splice(t, 1)
  }

  function Cl(e, t, n, r) {
    Z(e)
      ? n.push(...e)
      : (!t || !t.includes(e, e.allowRecurse ? r + 1 : r)) && n.push(e),
      wl()
  }

  function fi(e) {
    Cl(e, sn, an, Kt)
  }

  function di(e) {
    Cl(e, bt, un, qt)
  }

  function Qr(e, t = null) {
    if (an.length) {
      for (
        br = t, sn = [...new Set(an)], an.length = 0, Kt = 0;
        Kt < sn.length;
        Kt++
      )
        sn[Kt]()
      ;(sn = null), (Kt = 0), (br = null), Qr(e, t)
    }
  }

  function El(e) {
    if (un.length) {
      const t = [...new Set(un)]
      if (((un.length = 0), bt)) {
        bt.push(...t)
        return
      }
      for (
        bt = t, bt.sort((n, r) => mn(n) - mn(r)), qt = 0;
        qt < bt.length;
        qt++
      )
        bt[qt]()
      ;(bt = null), (qt = 0)
    }
  }
  const mn = (e) => (e.id == null ? 1 / 0 : e.id)

  function Ol(e) {
    ;(gr = !1), (jn = !0), Qr(e), Be.sort((n, r) => mn(n) - mn(r))
    try {
      for (ut = 0; ut < Be.length; ut++) {
        const n = Be[ut]
        n && n.active !== !1 && Ct(n, null, 14)
      }
    } finally {
      ;(ut = 0),
        (Be.length = 0),
        El(),
        (jn = !1),
        (Xr = null),
        (Be.length || an.length || un.length) && Ol(e)
    }
  }

  function pi(e, t, ...n) {
    if (e.isUnmounted) return
    const r = e.vnode.props || de
    let o = n
    const l = t.startsWith('update:'),
      s = l && t.slice(7)
    if (s && s in r) {
      const u = `${s === 'modelValue' ? 'model' : s}Modifiers`,
        { number: p, trim: m } = r[u] || de
      m ? (o = n.map((y) => y.trim())) : p && (o = n.map(dr))
    }
    let i,
      a = r[(i = sr(t))] || r[(i = sr(st(t)))]
    !a && l && (a = r[(i = sr(Bt(t)))]), a && Qe(a, e, 6, o)
    const f = r[i + 'Once']
    if (f) {
      if (!e.emitted) e.emitted = {}
      else if (e.emitted[i]) return
      ;(e.emitted[i] = !0), Qe(f, e, 6, o)
    }
  }

  function Tl(e, t, n = !1) {
    const r = t.emitsCache,
      o = r.get(e)
    if (o !== void 0) return o
    const l = e.emits
    let s = {},
      i = !1
    if (!G(e)) {
      const a = (f) => {
        const u = Tl(f, t, !0)
        u && ((i = !0), De(s, u))
      }
      !n && t.mixins.length && t.mixins.forEach(a),
        e.extends && a(e.extends),
        e.mixins && e.mixins.forEach(a)
    }
    return !l && !i
      ? (r.set(e, null), null)
      : (Z(l) ? l.forEach((a) => (s[a] = null)) : De(s, l), r.set(e, s), s)
  }

  function Zn(e, t) {
    return !e || !zn(t)
      ? !1
      : ((t = t.slice(2).replace(/Once$/, '')),
        re(e, t[0].toLowerCase() + t.slice(1)) || re(e, Bt(t)) || re(e, t))
  }
  let Ye = null,
    Gn = null

  function Bn(e) {
    const t = Ye
    return (Ye = e), (Gn = (e && e.type.__scopeId) || null), t
  }

  function hi(e) {
    Gn = e
  }

  function vi() {
    Gn = null
  }

  function ct(e, t = Ye, n) {
    if (!t || e._n) return e
    const r = (...o) => {
      r._d && Ro(-1)
      const l = Bn(t),
        s = e(...o)
      return Bn(l), r._d && Ro(1), s
    }
    return (r._n = !0), (r._c = !0), (r._d = !0), r
  }

  function ir(e) {
    const {
      type: t,
      vnode: n,
      proxy: r,
      withProxy: o,
      props: l,
      propsOptions: [s],
      slots: i,
      attrs: a,
      emit: f,
      render: u,
      renderCache: p,
      data: m,
      setupState: y,
      ctx: P,
      inheritAttrs: K,
    } = e
    let W, te
    const U = Bn(e)
    try {
      if (n.shapeFlag & 4) {
        const L = o || r
        ;(W = rt(u.call(L, L, p, l, y, m, P))), (te = a)
      } else {
        const L = t
        ;(W = rt(
          L.length > 1
            ? L(l, {
                attrs: a,
                slots: i,
                emit: f,
              })
            : L(l, null)
        )),
          (te = t.props ? a : mi(a))
      }
    } catch (L) {
      ;(fn.length = 0), Qn(L, e, 1), (W = xe(jt))
    }
    let pe = W
    if (te && K !== !1) {
      const L = Object.keys(te),
        { shapeFlag: $ } = pe
      L.length &&
        $ & 7 &&
        (s && L.some(jr) && (te = gi(te, s)), (pe = Jt(pe, te)))
    }
    return (
      n.dirs && (pe.dirs = pe.dirs ? pe.dirs.concat(n.dirs) : n.dirs),
      n.transition && (pe.transition = n.transition),
      (W = pe),
      Bn(U),
      W
    )
  }
  const mi = (e) => {
      let t
      for (const n in e)
        (n === 'class' || n === 'style' || zn(n)) && ((t || (t = {}))[n] = e[n])
      return t
    },
    gi = (e, t) => {
      const n = {}
      for (const r in e) (!jr(r) || !(r.slice(9) in t)) && (n[r] = e[r])
      return n
    }

  function bi(e, t, n) {
    const { props: r, children: o, component: l } = e,
      { props: s, children: i, patchFlag: a } = t,
      f = l.emitsOptions
    if (t.dirs || t.transition) return !0
    if (n && a >= 0) {
      if (a & 1024) return !0
      if (a & 16) return r ? wo(r, s, f) : !!s
      if (a & 8) {
        const u = t.dynamicProps
        for (let p = 0; p < u.length; p++) {
          const m = u[p]
          if (s[m] !== r[m] && !Zn(f, m)) return !0
        }
      }
    } else
      return (o || i) && (!i || !i.$stable)
        ? !0
        : r === s
        ? !1
        : r
        ? s
          ? wo(r, s, f)
          : !0
        : !!s
    return !1
  }

  function wo(e, t, n) {
    const r = Object.keys(t)
    if (r.length !== Object.keys(e).length) return !0
    for (let o = 0; o < r.length; o++) {
      const l = r[o]
      if (t[l] !== e[l] && !Zn(n, l)) return !0
    }
    return !1
  }

  function xi({ vnode: e, parent: t }, n) {
    for (; t && t.subTree === e; ) ((e = t.vnode).el = n), (t = t.parent)
  }
  const yi = (e) => e.__isSuspense

  function _i(e, t) {
    t && t.pendingBranch
      ? Z(e)
        ? t.effects.push(...e)
        : t.effects.push(e)
      : di(e)
  }

  function Ze(e, t) {
    if (Se) {
      let n = Se.provides
      const r = Se.parent && Se.parent.provides
      r === n && (n = Se.provides = Object.create(r)), (n[e] = t)
    }
  }

  function $e(e, t, n = !1) {
    const r = Se || Ye
    if (r) {
      const o =
        r.parent == null
          ? r.vnode.appContext && r.vnode.appContext.provides
          : r.parent.provides
      if (o && e in o) return o[e]
      if (arguments.length > 1) return n && G(t) ? t.call(r.proxy) : t
    }
  }

  function Ne(e, t) {
    return Zr(e, null, t)
  }
  const Co = {}

  function dt(e, t, n) {
    return Zr(e, t, n)
  }

  function Zr(
    e,
    t,
    { immediate: n, deep: r, flush: o, onTrack: l, onTrigger: s } = de
  ) {
    const i = Se
    let a,
      f = !1,
      u = !1
    if (
      (Ae(e)
        ? ((a = () => e.value), (f = hl(e)))
        : Yt(e)
        ? ((a = () => e), (r = !0))
        : Z(e)
        ? ((u = !0),
          (f = e.some(Yt)),
          (a = () =>
            e.map((te) => {
              if (Ae(te)) return te.value
              if (Yt(te)) return Lt(te)
              if (G(te)) return Ct(te, i, 2)
            })))
        : G(e)
        ? t
          ? (a = () => Ct(e, i, 2))
          : (a = () => {
              if (!(i && i.isUnmounted)) return p && p(), Qe(e, i, 3, [m])
            })
        : (a = Xe),
      t && r)
    ) {
      const te = a
      a = () => Lt(te())
    }
    let p,
      m = (te) => {
        p = W.onStop = () => {
          Ct(te, i, 4)
        }
      }
    if (gn)
      return (m = Xe), t ? n && Qe(t, i, 3, [a(), u ? [] : void 0, m]) : a(), Xe
    let y = u ? [] : Co
    const P = () => {
      if (!!W.active)
        if (t) {
          const te = W.run()
          ;(r || f || (u ? te.some((U, pe) => pn(U, y[pe])) : pn(te, y))) &&
            (p && p(), Qe(t, i, 3, [te, y === Co ? void 0 : y, m]), (y = te))
        } else W.run()
    }
    P.allowRecurse = !!t
    let K
    o === 'sync'
      ? (K = P)
      : o === 'post'
      ? (K = () => Me(P, i && i.suspense))
      : (K = () => {
          !i || i.isMounted ? fi(P) : P()
        })
    const W = new qr(a, K)
    return (
      t
        ? n
          ? P()
          : (y = W.run())
        : o === 'post'
        ? Me(W.run.bind(W), i && i.suspense)
        : W.run(),
      () => {
        W.stop(), i && i.scope && Br(i.scope.effects, W)
      }
    )
  }

  function wi(e, t, n) {
    const r = this.proxy,
      o = ye(e) ? (e.includes('.') ? Il(r, e) : () => r[e]) : e.bind(r, r)
    let l
    G(t) ? (l = t) : ((l = t.handler), (n = t))
    const s = Se
    Xt(this)
    const i = Zr(o, l.bind(r), n)
    return s ? Xt(s) : $t(), i
  }

  function Il(e, t) {
    const n = t.split('.')
    return () => {
      let r = e
      for (let o = 0; o < n.length && r; o++) r = r[n[o]]
      return r
    }
  }

  function Lt(e, t) {
    if (!_e(e) || e.__v_skip || ((t = t || new Set()), t.has(e))) return e
    if ((t.add(e), Ae(e))) Lt(e.value, t)
    else if (Z(e)) for (let n = 0; n < e.length; n++) Lt(e[n], t)
    else if (Go(e) || Vt(e))
      e.forEach((n) => {
        Lt(n, t)
      })
    else if (nl(e)) for (const n in e) Lt(e[n], t)
    return e
  }

  function we(e) {
    return G(e)
      ? {
          setup: e,
          name: e.name,
        }
      : e
  }
  const xr = (e) => !!e.type.__asyncLoader,
    Sl = (e) => e.type.__isKeepAlive

  function Ci(e, t) {
    Al(e, 'a', t)
  }

  function Ei(e, t) {
    Al(e, 'da', t)
  }

  function Al(e, t, n = Se) {
    const r =
      e.__wdc ||
      (e.__wdc = () => {
        let o = n
        for (; o; ) {
          if (o.isDeactivated) return
          o = o.parent
        }
        return e()
      })
    if ((er(t, r, n), n)) {
      let o = n.parent
      for (; o && o.parent; )
        Sl(o.parent.vnode) && Oi(r, t, n, o), (o = o.parent)
    }
  }

  function Oi(e, t, n, r) {
    const o = er(t, e, r, !0)
    vt(() => {
      Br(r[t], o)
    }, n)
  }

  function er(e, t, n = Se, r = !1) {
    if (n) {
      const o = n[e] || (n[e] = []),
        l =
          t.__weh ||
          (t.__weh = (...s) => {
            if (n.isUnmounted) return
            Qt(), Xt(n)
            const i = Qe(t, n, e, s)
            return $t(), Zt(), i
          })
      return r ? o.unshift(l) : o.push(l), l
    }
  }
  const ht =
      (e) =>
      (t, n = Se) =>
        (!gn || e === 'sp') && er(e, t, n),
    Ti = ht('bm'),
    Le = ht('m'),
    Ii = ht('bu'),
    Si = ht('u'),
    Ai = ht('bum'),
    vt = ht('um'),
    Fi = ht('sp'),
    Pi = ht('rtg'),
    Ri = ht('rtc')

  function ki(e, t = Se) {
    er('ec', e, t)
  }
  let yr = !0

  function Li(e) {
    const t = Pl(e),
      n = e.proxy,
      r = e.ctx
    ;(yr = !1), t.beforeCreate && Eo(t.beforeCreate, e, 'bc')
    const {
      data: o,
      computed: l,
      methods: s,
      watch: i,
      provide: a,
      inject: f,
      created: u,
      beforeMount: p,
      mounted: m,
      beforeUpdate: y,
      updated: P,
      activated: K,
      deactivated: W,
      beforeDestroy: te,
      beforeUnmount: U,
      destroyed: pe,
      unmounted: L,
      render: $,
      renderTracked: Y,
      renderTriggered: S,
      errorCaptured: D,
      serverPrefetch: H,
      expose: z,
      inheritAttrs: ie,
      components: ee,
      directives: at,
      filters: Te,
    } = t
    if ((f && Di(f, r, null, e.appContext.config.unwrapInjectedRef), s))
      for (const _ in s) {
        const x = s[_]
        G(x) && (r[_] = x.bind(n))
      }
    if (o) {
      const _ = o.call(n, n)
      _e(_) && (e.data = xn(_))
    }
    if (((yr = !0), l))
      for (const _ in l) {
        const x = l[_],
          F = G(x) ? x.bind(n, n) : G(x.get) ? x.get.bind(n, n) : Xe,
          k = !G(x) && G(x.set) ? x.set.bind(n) : Xe,
          R = ne({
            get: F,
            set: k,
          })
        Object.defineProperty(r, _, {
          enumerable: !0,
          configurable: !0,
          get: () => R.value,
          set: (T) => (R.value = T),
        })
      }
    if (i) for (const _ in i) Fl(i[_], r, n, _)
    if (a) {
      const _ = G(a) ? a.call(n) : a
      Reflect.ownKeys(_).forEach((x) => {
        Ze(x, _[x])
      })
    }
    u && Eo(u, e, 'c')

    function v(_, x) {
      Z(x) ? x.forEach((F) => _(F.bind(n))) : x && _(x.bind(n))
    }
    if (
      (v(Ti, p),
      v(Le, m),
      v(Ii, y),
      v(Si, P),
      v(Ci, K),
      v(Ei, W),
      v(ki, D),
      v(Ri, Y),
      v(Pi, S),
      v(Ai, U),
      v(vt, L),
      v(Fi, H),
      Z(z))
    )
      if (z.length) {
        const _ = e.exposed || (e.exposed = {})
        z.forEach((x) => {
          Object.defineProperty(_, x, {
            get: () => n[x],
            set: (F) => (n[x] = F),
          })
        })
      } else e.exposed || (e.exposed = {})
    $ && e.render === Xe && (e.render = $),
      ie != null && (e.inheritAttrs = ie),
      ee && (e.components = ee),
      at && (e.directives = at)
  }

  function Di(e, t, n = Xe, r = !1) {
    Z(e) && (e = _r(e))
    for (const o in e) {
      const l = e[o]
      let s
      _e(l)
        ? 'default' in l
          ? (s = $e(l.from || o, l.default, !0))
          : (s = $e(l.from || o))
        : (s = $e(l)),
        Ae(s) && r
          ? Object.defineProperty(t, o, {
              enumerable: !0,
              configurable: !0,
              get: () => s.value,
              set: (i) => (s.value = i),
            })
          : (t[o] = s)
    }
  }

  function Eo(e, t, n) {
    Qe(Z(e) ? e.map((r) => r.bind(t.proxy)) : e.bind(t.proxy), t, n)
  }

  function Fl(e, t, n, r) {
    const o = r.includes('.') ? Il(n, r) : () => n[r]
    if (ye(e)) {
      const l = t[e]
      G(l) && dt(o, l)
    } else if (G(e)) dt(o, e.bind(n))
    else if (_e(e))
      if (Z(e)) e.forEach((l) => Fl(l, t, n, r))
      else {
        const l = G(e.handler) ? e.handler.bind(n) : t[e.handler]
        G(l) && dt(o, l, e)
      }
  }

  function Pl(e) {
    const t = e.type,
      { mixins: n, extends: r } = t,
      {
        mixins: o,
        optionsCache: l,
        config: { optionMergeStrategies: s },
      } = e.appContext,
      i = l.get(t)
    let a
    return (
      i
        ? (a = i)
        : !o.length && !n && !r
        ? (a = t)
        : ((a = {}),
          o.length && o.forEach((f) => Un(a, f, s, !0)),
          Un(a, t, s)),
      l.set(t, a),
      a
    )
  }

  function Un(e, t, n, r = !1) {
    const { mixins: o, extends: l } = t
    l && Un(e, l, n, !0), o && o.forEach((s) => Un(e, s, n, !0))
    for (const s in t)
      if (!(r && s === 'expose')) {
        const i = Ni[s] || (n && n[s])
        e[s] = i ? i(e[s], t[s]) : t[s]
      }
    return e
  }
  const Ni = {
    data: Oo,
    props: At,
    emits: At,
    methods: At,
    computed: At,
    beforeCreate: Pe,
    created: Pe,
    beforeMount: Pe,
    mounted: Pe,
    beforeUpdate: Pe,
    updated: Pe,
    beforeDestroy: Pe,
    beforeUnmount: Pe,
    destroyed: Pe,
    unmounted: Pe,
    activated: Pe,
    deactivated: Pe,
    errorCaptured: Pe,
    serverPrefetch: Pe,
    components: At,
    directives: At,
    watch: $i,
    provide: Oo,
    inject: Mi,
  }

  function Oo(e, t) {
    return t
      ? e
        ? function () {
            return De(
              G(e) ? e.call(this, this) : e,
              G(t) ? t.call(this, this) : t
            )
          }
        : t
      : e
  }

  function Mi(e, t) {
    return At(_r(e), _r(t))
  }

  function _r(e) {
    if (Z(e)) {
      const t = {}
      for (let n = 0; n < e.length; n++) t[e[n]] = e[n]
      return t
    }
    return e
  }

  function Pe(e, t) {
    return e ? [...new Set([].concat(e, t))] : t
  }

  function At(e, t) {
    return e ? De(De(Object.create(null), e), t) : t
  }

  function $i(e, t) {
    if (!e) return t
    if (!t) return e
    const n = De(Object.create(null), e)
    for (const r in t) n[r] = Pe(e[r], t[r])
    return n
  }

  function ji(e, t, n, r = !1) {
    const o = {},
      l = {}
    Mn(l, tr, 1), (e.propsDefaults = Object.create(null)), Rl(e, t, o, l)
    for (const s in e.propsOptions[0]) s in o || (o[s] = void 0)
    n
      ? (e.props = r ? o : ni(o))
      : e.type.props
      ? (e.props = o)
      : (e.props = l),
      (e.attrs = l)
  }

  function Bi(e, t, n, r) {
    const {
        props: o,
        attrs: l,
        vnode: { patchFlag: s },
      } = e,
      i = q(o),
      [a] = e.propsOptions
    let f = !1
    if ((r || s > 0) && !(s & 16)) {
      if (s & 8) {
        const u = e.vnode.dynamicProps
        for (let p = 0; p < u.length; p++) {
          let m = u[p]
          if (Zn(e.emitsOptions, m)) continue
          const y = t[m]
          if (a)
            if (re(l, m)) y !== l[m] && ((l[m] = y), (f = !0))
            else {
              const P = st(m)
              o[P] = wr(a, i, P, y, e, !1)
            }
          else y !== l[m] && ((l[m] = y), (f = !0))
        }
      }
    } else {
      Rl(e, t, o, l) && (f = !0)
      let u
      for (const p in i)
        (!t || (!re(t, p) && ((u = Bt(p)) === p || !re(t, u)))) &&
          (a
            ? n &&
              (n[p] !== void 0 || n[u] !== void 0) &&
              (o[p] = wr(a, i, p, void 0, e, !0))
            : delete o[p])
      if (l !== i)
        for (const p in l) (!t || (!re(t, p) && !0)) && (delete l[p], (f = !0))
    }
    f && pt(e, 'set', '$attrs')
  }

  function Rl(e, t, n, r) {
    const [o, l] = e.propsOptions
    let s = !1,
      i
    if (t)
      for (let a in t) {
        if (Pn(a)) continue
        const f = t[a]
        let u
        o && re(o, (u = st(a)))
          ? !l || !l.includes(u)
            ? (n[u] = f)
            : ((i || (i = {}))[u] = f)
          : Zn(e.emitsOptions, a) ||
            ((!(a in r) || f !== r[a]) && ((r[a] = f), (s = !0)))
      }
    if (l) {
      const a = q(n),
        f = i || de
      for (let u = 0; u < l.length; u++) {
        const p = l[u]
        n[p] = wr(o, a, p, f[p], e, !re(f, p))
      }
    }
    return s
  }

  function wr(e, t, n, r, o, l) {
    const s = e[n]
    if (s != null) {
      const i = re(s, 'default')
      if (i && r === void 0) {
        const a = s.default
        if (s.type !== Function && G(a)) {
          const { propsDefaults: f } = o
          n in f ? (r = f[n]) : (Xt(o), (r = f[n] = a.call(null, t)), $t())
        } else r = a
      }
      s[0] &&
        (l && !i ? (r = !1) : s[1] && (r === '' || r === Bt(n)) && (r = !0))
    }
    return r
  }

  function kl(e, t, n = !1) {
    const r = t.propsCache,
      o = r.get(e)
    if (o) return o
    const l = e.props,
      s = {},
      i = []
    let a = !1
    if (!G(e)) {
      const u = (p) => {
        a = !0
        const [m, y] = kl(p, t, !0)
        De(s, m), y && i.push(...y)
      }
      !n && t.mixins.length && t.mixins.forEach(u),
        e.extends && u(e.extends),
        e.mixins && e.mixins.forEach(u)
    }
    if (!l && !a) return r.set(e, zt), zt
    if (Z(l))
      for (let u = 0; u < l.length; u++) {
        const p = st(l[u])
        To(p) && (s[p] = de)
      }
    else if (l)
      for (const u in l) {
        const p = st(u)
        if (To(p)) {
          const m = l[u],
            y = (s[p] =
              Z(m) || G(m)
                ? {
                    type: m,
                  }
                : m)
          if (y) {
            const P = Ao(Boolean, y.type),
              K = Ao(String, y.type)
            ;(y[0] = P > -1),
              (y[1] = K < 0 || P < K),
              (P > -1 || re(y, 'default')) && i.push(p)
          }
        }
      }
    const f = [s, i]
    return r.set(e, f), f
  }

  function To(e) {
    return e[0] !== '$'
  }

  function Io(e) {
    const t = e && e.toString().match(/^\s*function (\w+)/)
    return t ? t[1] : e === null ? 'null' : ''
  }

  function So(e, t) {
    return Io(e) === Io(t)
  }

  function Ao(e, t) {
    return Z(t) ? t.findIndex((n) => So(n, e)) : G(t) && So(t, e) ? 0 : -1
  }
  const Ll = (e) => e[0] === '_' || e === '$stable',
    Gr = (e) => (Z(e) ? e.map(rt) : [rt(e)]),
    Ui = (e, t, n) => {
      const r = ct((...o) => Gr(t(...o)), n)
      return (r._c = !1), r
    },
    Dl = (e, t, n) => {
      const r = e._ctx
      for (const o in e) {
        if (Ll(o)) continue
        const l = e[o]
        if (G(l)) t[o] = Ui(o, l, r)
        else if (l != null) {
          const s = Gr(l)
          t[o] = () => s
        }
      }
    },
    Nl = (e, t) => {
      const n = Gr(t)
      e.slots.default = () => n
    },
    Hi = (e, t) => {
      if (e.vnode.shapeFlag & 32) {
        const n = t._
        n ? ((e.slots = q(t)), Mn(t, '_', n)) : Dl(t, (e.slots = {}))
      } else (e.slots = {}), t && Nl(e, t)
      Mn(e.slots, tr, 1)
    },
    Ki = (e, t, n) => {
      const { vnode: r, slots: o } = e
      let l = !0,
        s = de
      if (r.shapeFlag & 32) {
        const i = t._
        i
          ? n && i === 1
            ? (l = !1)
            : (De(o, t), !n && i === 1 && delete o._)
          : ((l = !t.$stable), Dl(t, o)),
          (s = t)
      } else
        t &&
          (Nl(e, t),
          (s = {
            default: 1,
          }))
      if (l) for (const i in o) !Ll(i) && !(i in s) && delete o[i]
    }

  function qi(e, t) {
    const n = Ye
    if (n === null) return e
    const r = nr(n) || n.proxy,
      o = e.dirs || (e.dirs = [])
    for (let l = 0; l < t.length; l++) {
      let [s, i, a, f = de] = t[l]
      G(s) &&
        (s = {
          mounted: s,
          updated: s,
        }),
        s.deep && Lt(i),
        o.push({
          dir: s,
          instance: r,
          value: i,
          oldValue: void 0,
          arg: a,
          modifiers: f,
        })
    }
    return e
  }

  function Tt(e, t, n, r) {
    const o = e.dirs,
      l = t && t.dirs
    for (let s = 0; s < o.length; s++) {
      const i = o[s]
      l && (i.oldValue = l[s].value)
      let a = i.dir[r]
      a && (Qt(), Qe(a, n, 8, [e.el, i, e, t]), Zt())
    }
  }

  function Ml() {
    return {
      app: null,
      config: {
        isNativeTag: ws,
        performance: !1,
        globalProperties: {},
        optionMergeStrategies: {},
        errorHandler: void 0,
        warnHandler: void 0,
        compilerOptions: {},
      },
      mixins: [],
      components: {},
      directives: {},
      provides: Object.create(null),
      optionsCache: new WeakMap(),
      propsCache: new WeakMap(),
      emitsCache: new WeakMap(),
    }
  }
  let Wi = 0

  function zi(e, t) {
    return function (r, o = null) {
      G(r) || (r = Object.assign({}, r)), o != null && !_e(o) && (o = null)
      const l = Ml(),
        s = new Set()
      let i = !1
      const a = (l.app = {
        _uid: Wi++,
        _component: r,
        _props: o,
        _container: null,
        _context: l,
        _instance: null,
        version: va,
        get config() {
          return l.config
        },
        set config(f) {},
        use(f, ...u) {
          return (
            s.has(f) ||
              (f && G(f.install)
                ? (s.add(f), f.install(a, ...u))
                : G(f) && (s.add(f), f(a, ...u))),
            a
          )
        },
        mixin(f) {
          return l.mixins.includes(f) || l.mixins.push(f), a
        },
        component(f, u) {
          return u ? ((l.components[f] = u), a) : l.components[f]
        },
        directive(f, u) {
          return u ? ((l.directives[f] = u), a) : l.directives[f]
        },
        mount(f, u, p) {
          if (!i) {
            const m = xe(r, o)
            return (
              (m.appContext = l),
              u && t ? t(m, f) : e(m, f, p),
              (i = !0),
              (a._container = f),
              (f.__vue_app__ = a),
              nr(m.component) || m.component.proxy
            )
          }
        },
        unmount() {
          i && (e(null, a._container), delete a._container.__vue_app__)
        },
        provide(f, u) {
          return (l.provides[f] = u), a
        },
      })
      return a
    }
  }

  function Cr(e, t, n, r, o = !1) {
    if (Z(e)) {
      e.forEach((m, y) => Cr(m, t && (Z(t) ? t[y] : t), n, r, o))
      return
    }
    if (xr(r) && !o) return
    const l = r.shapeFlag & 4 ? nr(r.component) || r.component.proxy : r.el,
      s = o ? null : l,
      { i, r: a } = e,
      f = t && t.r,
      u = i.refs === de ? (i.refs = {}) : i.refs,
      p = i.setupState
    if (
      (f != null &&
        f !== a &&
        (ye(f)
          ? ((u[f] = null), re(p, f) && (p[f] = null))
          : Ae(f) && (f.value = null)),
      G(a))
    )
      Ct(a, i, 12, [s, u])
    else {
      const m = ye(a),
        y = Ae(a)
      if (m || y) {
        const P = () => {
          if (e.f) {
            const K = m ? u[a] : a.value
            o
              ? Z(K) && Br(K, l)
              : Z(K)
              ? K.includes(l) || K.push(l)
              : m
              ? ((u[a] = [l]), re(p, a) && (p[a] = u[a]))
              : ((a.value = [l]), e.k && (u[e.k] = a.value))
          } else
            m
              ? ((u[a] = s), re(p, a) && (p[a] = s))
              : Ae(a) && ((a.value = s), e.k && (u[e.k] = s))
        }
        s ? ((P.id = -1), Me(P, n)) : P()
      }
    }
  }
  const Me = _i

  function Vi(e) {
    return Yi(e)
  }

  function Yi(e, t) {
    const n = Ss()
    n.__VUE__ = !0
    const {
        insert: r,
        remove: o,
        patchProp: l,
        createElement: s,
        createText: i,
        createComment: a,
        setText: f,
        setElementText: u,
        parentNode: p,
        nextSibling: m,
        setScopeId: y = Xe,
        cloneNode: P,
        insertStaticContent: K,
      } = e,
      W = (
        c,
        d,
        h,
        g = null,
        b = null,
        C = null,
        A = !1,
        E = null,
        O = !!d.dynamicChildren
      ) => {
        if (c === d) return
        c && !rn(c, d) && ((g = ae(c)), M(c, b, C, !0), (c = null)),
          d.patchFlag === -2 && ((O = !1), (d.dynamicChildren = null))
        const { type: w, ref: j, shapeFlag: N } = d
        switch (w) {
          case no:
            te(c, d, h, g)
            break
          case jt:
            U(c, d, h, g)
            break
          case ar:
            c == null && pe(d, h, g, A)
            break
          case Re:
            at(c, d, h, g, b, C, A, E, O)
            break
          default:
            N & 1
              ? Y(c, d, h, g, b, C, A, E, O)
              : N & 6
              ? Te(c, d, h, g, b, C, A, E, O)
              : (N & 64 || N & 128) && w.process(c, d, h, g, b, C, A, E, O, Ke)
        }
        j != null && b && Cr(j, c && c.ref, C, d || c, !d)
      },
      te = (c, d, h, g) => {
        if (c == null) r((d.el = i(d.children)), h, g)
        else {
          const b = (d.el = c.el)
          d.children !== c.children && f(b, d.children)
        }
      },
      U = (c, d, h, g) => {
        c == null ? r((d.el = a(d.children || '')), h, g) : (d.el = c.el)
      },
      pe = (c, d, h, g) => {
        ;[c.el, c.anchor] = K(c.children, d, h, g, c.el, c.anchor)
      },
      L = ({ el: c, anchor: d }, h, g) => {
        let b
        for (; c && c !== d; ) (b = m(c)), r(c, h, g), (c = b)
        r(d, h, g)
      },
      $ = ({ el: c, anchor: d }) => {
        let h
        for (; c && c !== d; ) (h = m(c)), o(c), (c = h)
        o(d)
      },
      Y = (c, d, h, g, b, C, A, E, O) => {
        ;(A = A || d.type === 'svg'),
          c == null ? S(d, h, g, b, C, A, E, O) : z(c, d, b, C, A, E, O)
      },
      S = (c, d, h, g, b, C, A, E) => {
        let O, w
        const {
          type: j,
          props: N,
          shapeFlag: B,
          transition: J,
          patchFlag: le,
          dirs: be,
        } = c
        if (c.el && P !== void 0 && le === -1) O = c.el = P(c.el)
        else {
          if (
            ((O = c.el = s(c.type, C, N && N.is, N)),
            B & 8
              ? u(O, c.children)
              : B & 16 &&
                H(c.children, O, null, g, b, C && j !== 'foreignObject', A, E),
            be && Tt(c, null, g, 'created'),
            N)
          ) {
            for (const me in N)
              me !== 'value' &&
                !Pn(me) &&
                l(O, me, null, N[me], C, c.children, g, b, ge)
            'value' in N && l(O, 'value', null, N.value),
              (w = N.onVnodeBeforeMount) && tt(w, g, c)
          }
          D(O, c, c.scopeId, A, g)
        }
        be && Tt(c, null, g, 'beforeMount')
        const fe = (!b || (b && !b.pendingBranch)) && J && !J.persisted
        fe && J.beforeEnter(O),
          r(O, d, h),
          ((w = N && N.onVnodeMounted) || fe || be) &&
            Me(() => {
              w && tt(w, g, c),
                fe && J.enter(O),
                be && Tt(c, null, g, 'mounted')
            }, b)
      },
      D = (c, d, h, g, b) => {
        if ((h && y(c, h), g)) for (let C = 0; C < g.length; C++) y(c, g[C])
        if (b) {
          let C = b.subTree
          if (d === C) {
            const A = b.vnode
            D(c, A, A.scopeId, A.slotScopeIds, b.parent)
          }
        }
      },
      H = (c, d, h, g, b, C, A, E, O = 0) => {
        for (let w = O; w < c.length; w++) {
          const j = (c[w] = E ? yt(c[w]) : rt(c[w]))
          W(null, j, d, h, g, b, C, A, E)
        }
      },
      z = (c, d, h, g, b, C, A) => {
        const E = (d.el = c.el)
        let { patchFlag: O, dynamicChildren: w, dirs: j } = d
        O |= c.patchFlag & 16
        const N = c.props || de,
          B = d.props || de
        let J
        h && It(h, !1),
          (J = B.onVnodeBeforeUpdate) && tt(J, h, d, c),
          j && Tt(d, c, h, 'beforeUpdate'),
          h && It(h, !0)
        const le = b && d.type !== 'foreignObject'
        if (
          (w
            ? ie(c.dynamicChildren, w, E, h, g, le, C)
            : A || F(c, d, E, null, h, g, le, C, !1),
          O > 0)
        ) {
          if (O & 16) ee(E, d, N, B, h, g, b)
          else if (
            (O & 2 && N.class !== B.class && l(E, 'class', null, B.class, b),
            O & 4 && l(E, 'style', N.style, B.style, b),
            O & 8)
          ) {
            const be = d.dynamicProps
            for (let fe = 0; fe < be.length; fe++) {
              const me = be[fe],
                We = N[me],
                Ut = B[me]
              ;(Ut !== We || me === 'value') &&
                l(E, me, We, Ut, b, c.children, h, g, ge)
            }
          }
          O & 1 && c.children !== d.children && u(E, d.children)
        } else !A && w == null && ee(E, d, N, B, h, g, b)
        ;((J = B.onVnodeUpdated) || j) &&
          Me(() => {
            J && tt(J, h, d, c), j && Tt(d, c, h, 'updated')
          }, g)
      },
      ie = (c, d, h, g, b, C, A) => {
        for (let E = 0; E < d.length; E++) {
          const O = c[E],
            w = d[E],
            j =
              O.el && (O.type === Re || !rn(O, w) || O.shapeFlag & 70)
                ? p(O.el)
                : h
          W(O, w, j, null, g, b, C, A, !0)
        }
      },
      ee = (c, d, h, g, b, C, A) => {
        if (h !== g) {
          for (const E in g) {
            if (Pn(E)) continue
            const O = g[E],
              w = h[E]
            O !== w && E !== 'value' && l(c, E, w, O, A, d.children, b, C, ge)
          }
          if (h !== de)
            for (const E in h)
              !Pn(E) &&
                !(E in g) &&
                l(c, E, h[E], null, A, d.children, b, C, ge)
          'value' in g && l(c, 'value', h.value, g.value)
        }
      },
      at = (c, d, h, g, b, C, A, E, O) => {
        const w = (d.el = c ? c.el : i('')),
          j = (d.anchor = c ? c.anchor : i(''))
        let { patchFlag: N, dynamicChildren: B, slotScopeIds: J } = d
        J && (E = E ? E.concat(J) : J),
          c == null
            ? (r(w, h, g), r(j, h, g), H(d.children, h, j, b, C, A, E, O))
            : N > 0 && N & 64 && B && c.dynamicChildren
            ? (ie(c.dynamicChildren, B, h, b, C, A, E),
              (d.key != null || (b && d === b.subTree)) && eo(c, d, !0))
            : F(c, d, h, j, b, C, A, E, O)
      },
      Te = (c, d, h, g, b, C, A, E, O) => {
        ;(d.slotScopeIds = E),
          c == null
            ? d.shapeFlag & 512
              ? b.ctx.activate(d, h, g, A, O)
              : I(d, h, g, b, C, A, O)
            : v(c, d, O)
      },
      I = (c, d, h, g, b, C, A) => {
        const E = (c.component = aa(c, g, b))
        if ((Sl(c) && (E.ctx.renderer = Ke), ua(E), E.asyncDep)) {
          if ((b && b.registerDep(E, _), !c.el)) {
            const O = (E.subTree = xe(jt))
            U(null, O, d, h)
          }
          return
        }
        _(E, c, d, h, b, C, A)
      },
      v = (c, d, h) => {
        const g = (d.component = c.component)
        if (bi(c, d, h))
          if (g.asyncDep && !g.asyncResolved) {
            x(g, d, h)
            return
          } else (g.next = d), ci(g.update), g.update()
        else (d.component = c.component), (d.el = c.el), (g.vnode = d)
      },
      _ = (c, d, h, g, b, C, A) => {
        const E = () => {
            if (c.isMounted) {
              let { next: j, bu: N, u: B, parent: J, vnode: le } = c,
                be = j,
                fe
              It(c, !1),
                j ? ((j.el = le.el), x(c, j, A)) : (j = le),
                N && Rn(N),
                (fe = j.props && j.props.onVnodeBeforeUpdate) &&
                  tt(fe, J, j, le),
                It(c, !0)
              const me = ir(c),
                We = c.subTree
              ;(c.subTree = me),
                W(We, me, p(We.el), ae(We), c, b, C),
                (j.el = me.el),
                be === null && xi(c, me.el),
                B && Me(B, b),
                (fe = j.props && j.props.onVnodeUpdated) &&
                  Me(() => tt(fe, J, j, le), b)
            } else {
              let j
              const { el: N, props: B } = d,
                { bm: J, m: le, parent: be } = c,
                fe = xr(d)
              if (
                (It(c, !1),
                J && Rn(J),
                !fe && (j = B && B.onVnodeBeforeMount) && tt(j, be, d),
                It(c, !0),
                N && qe)
              ) {
                const me = () => {
                  ;(c.subTree = ir(c)), qe(N, c.subTree, c, b, null)
                }
                fe
                  ? d.type.__asyncLoader().then(() => !c.isUnmounted && me())
                  : me()
              } else {
                const me = (c.subTree = ir(c))
                W(null, me, h, g, c, b, C), (d.el = me.el)
              }
              if ((le && Me(le, b), !fe && (j = B && B.onVnodeMounted))) {
                const me = d
                Me(() => tt(j, be, me), b)
              }
              d.shapeFlag & 256 && c.a && Me(c.a, b),
                (c.isMounted = !0),
                (d = h = g = null)
            }
          },
          O = (c.effect = new qr(E, () => _l(c.update), c.scope)),
          w = (c.update = O.run.bind(O))
        ;(w.id = c.uid), It(c, !0), w()
      },
      x = (c, d, h) => {
        d.component = c
        const g = c.vnode.props
        ;(c.vnode = d),
          (c.next = null),
          Bi(c, d.props, g, h),
          Ki(c, d.children, h),
          Qt(),
          Qr(void 0, c.update),
          Zt()
      },
      F = (c, d, h, g, b, C, A, E, O = !1) => {
        const w = c && c.children,
          j = c ? c.shapeFlag : 0,
          N = d.children,
          { patchFlag: B, shapeFlag: J } = d
        if (B > 0) {
          if (B & 128) {
            R(w, N, h, g, b, C, A, E, O)
            return
          } else if (B & 256) {
            k(w, N, h, g, b, C, A, E, O)
            return
          }
        }
        J & 8
          ? (j & 16 && ge(w, b, C), N !== w && u(h, N))
          : j & 16
          ? J & 16
            ? R(w, N, h, g, b, C, A, E, O)
            : ge(w, b, C, !0)
          : (j & 8 && u(h, ''), J & 16 && H(N, h, g, b, C, A, E, O))
      },
      k = (c, d, h, g, b, C, A, E, O) => {
        ;(c = c || zt), (d = d || zt)
        const w = c.length,
          j = d.length,
          N = Math.min(w, j)
        let B
        for (B = 0; B < N; B++) {
          const J = (d[B] = O ? yt(d[B]) : rt(d[B]))
          W(c[B], J, h, null, b, C, A, E, O)
        }
        w > j ? ge(c, b, C, !0, !1, N) : H(d, h, g, b, C, A, E, O, N)
      },
      R = (c, d, h, g, b, C, A, E, O) => {
        let w = 0
        const j = d.length
        let N = c.length - 1,
          B = j - 1
        for (; w <= N && w <= B; ) {
          const J = c[w],
            le = (d[w] = O ? yt(d[w]) : rt(d[w]))
          if (rn(J, le)) W(J, le, h, null, b, C, A, E, O)
          else break
          w++
        }
        for (; w <= N && w <= B; ) {
          const J = c[N],
            le = (d[B] = O ? yt(d[B]) : rt(d[B]))
          if (rn(J, le)) W(J, le, h, null, b, C, A, E, O)
          else break
          N--, B--
        }
        if (w > N) {
          if (w <= B) {
            const J = B + 1,
              le = J < j ? d[J].el : g
            for (; w <= B; )
              W(null, (d[w] = O ? yt(d[w]) : rt(d[w])), h, le, b, C, A, E, O),
                w++
          }
        } else if (w > B) for (; w <= N; ) M(c[w], b, C, !0), w++
        else {
          const J = w,
            le = w,
            be = new Map()
          for (w = le; w <= B; w++) {
            const je = (d[w] = O ? yt(d[w]) : rt(d[w]))
            je.key != null && be.set(je.key, w)
          }
          let fe,
            me = 0
          const We = B - le + 1
          let Ut = !1,
            ao = 0
          const nn = new Array(We)
          for (w = 0; w < We; w++) nn[w] = 0
          for (w = J; w <= N; w++) {
            const je = c[w]
            if (me >= We) {
              M(je, b, C, !0)
              continue
            }
            let Ge
            if (je.key != null) Ge = be.get(je.key)
            else
              for (fe = le; fe <= B; fe++)
                if (nn[fe - le] === 0 && rn(je, d[fe])) {
                  Ge = fe
                  break
                }
            Ge === void 0
              ? M(je, b, C, !0)
              : ((nn[Ge - le] = w + 1),
                Ge >= ao ? (ao = Ge) : (Ut = !0),
                W(je, d[Ge], h, null, b, C, A, E, O),
                me++)
          }
          const uo = Ut ? Ji(nn) : zt
          for (fe = uo.length - 1, w = We - 1; w >= 0; w--) {
            const je = le + w,
              Ge = d[je],
              co = je + 1 < j ? d[je + 1].el : g
            nn[w] === 0
              ? W(null, Ge, h, co, b, C, A, E, O)
              : Ut && (fe < 0 || w !== uo[fe] ? T(Ge, h, co, 2) : fe--)
          }
        }
      },
      T = (c, d, h, g, b = null) => {
        const { el: C, type: A, transition: E, children: O, shapeFlag: w } = c
        if (w & 6) {
          T(c.component.subTree, d, h, g)
          return
        }
        if (w & 128) {
          c.suspense.move(d, h, g)
          return
        }
        if (w & 64) {
          A.move(c, d, h, Ke)
          return
        }
        if (A === Re) {
          r(C, d, h)
          for (let N = 0; N < O.length; N++) T(O[N], d, h, g)
          r(c.anchor, d, h)
          return
        }
        if (A === ar) {
          L(c, d, h)
          return
        }
        if (g !== 2 && w & 1 && E)
          if (g === 0) E.beforeEnter(C), r(C, d, h), Me(() => E.enter(C), b)
          else {
            const { leave: N, delayLeave: B, afterLeave: J } = E,
              le = () => r(C, d, h),
              be = () => {
                N(C, () => {
                  le(), J && J()
                })
              }
            B ? B(C, le, be) : be()
          }
        else r(C, d, h)
      },
      M = (c, d, h, g = !1, b = !1) => {
        const {
          type: C,
          props: A,
          ref: E,
          children: O,
          dynamicChildren: w,
          shapeFlag: j,
          patchFlag: N,
          dirs: B,
        } = c
        if ((E != null && Cr(E, null, h, c, !0), j & 256)) {
          d.ctx.deactivate(c)
          return
        }
        const J = j & 1 && B,
          le = !xr(c)
        let be
        if ((le && (be = A && A.onVnodeBeforeUnmount) && tt(be, d, c), j & 6))
          se(c.component, h, g)
        else {
          if (j & 128) {
            c.suspense.unmount(h, g)
            return
          }
          J && Tt(c, null, d, 'beforeUnmount'),
            j & 64
              ? c.type.remove(c, d, h, b, Ke, g)
              : w && (C !== Re || (N > 0 && N & 64))
              ? ge(w, d, h, !1, !0)
              : ((C === Re && N & 384) || (!b && j & 16)) && ge(O, d, h),
            g && V(c)
        }
        ;((le && (be = A && A.onVnodeUnmounted)) || J) &&
          Me(() => {
            be && tt(be, d, c), J && Tt(c, null, d, 'unmounted')
          }, h)
      },
      V = (c) => {
        const { type: d, el: h, anchor: g, transition: b } = c
        if (d === Re) {
          oe(h, g)
          return
        }
        if (d === ar) {
          $(c)
          return
        }
        const C = () => {
          o(h), b && !b.persisted && b.afterLeave && b.afterLeave()
        }
        if (c.shapeFlag & 1 && b && !b.persisted) {
          const { leave: A, delayLeave: E } = b,
            O = () => A(h, C)
          E ? E(c.el, C, O) : O()
        } else C()
      },
      oe = (c, d) => {
        let h
        for (; c !== d; ) (h = m(c)), o(c), (c = h)
        o(d)
      },
      se = (c, d, h) => {
        const { bum: g, scope: b, update: C, subTree: A, um: E } = c
        g && Rn(g),
          b.stop(),
          C && ((C.active = !1), M(A, c, d, h)),
          E && Me(E, d),
          Me(() => {
            c.isUnmounted = !0
          }, d),
          d &&
            d.pendingBranch &&
            !d.isUnmounted &&
            c.asyncDep &&
            !c.asyncResolved &&
            c.suspenseId === d.pendingId &&
            (d.deps--, d.deps === 0 && d.resolve())
      },
      ge = (c, d, h, g = !1, b = !1, C = 0) => {
        for (let A = C; A < c.length; A++) M(c[A], d, h, g, b)
      },
      ae = (c) =>
        c.shapeFlag & 6
          ? ae(c.component.subTree)
          : c.shapeFlag & 128
          ? c.suspense.next()
          : m(c.anchor || c.el),
      he = (c, d, h) => {
        c == null
          ? d._vnode && M(d._vnode, null, null, !0)
          : W(d._vnode || null, c, d, null, null, null, h),
          El(),
          (d._vnode = c)
      },
      Ke = {
        p: W,
        um: M,
        m: T,
        r: V,
        mt: I,
        mc: H,
        pc: F,
        pbc: ie,
        n: ae,
        o: e,
      }
    let mt, qe
    return (
      t && ([mt, qe] = t(Ke)),
      {
        render: he,
        hydrate: mt,
        createApp: zi(he, mt),
      }
    )
  }

  function It({ effect: e, update: t }, n) {
    e.allowRecurse = t.allowRecurse = n
  }

  function eo(e, t, n = !1) {
    const r = e.children,
      o = t.children
    if (Z(r) && Z(o))
      for (let l = 0; l < r.length; l++) {
        const s = r[l]
        let i = o[l]
        i.shapeFlag & 1 &&
          !i.dynamicChildren &&
          ((i.patchFlag <= 0 || i.patchFlag === 32) &&
            ((i = o[l] = yt(o[l])), (i.el = s.el)),
          n || eo(s, i))
      }
  }

  function Ji(e) {
    const t = e.slice(),
      n = [0]
    let r, o, l, s, i
    const a = e.length
    for (r = 0; r < a; r++) {
      const f = e[r]
      if (f !== 0) {
        if (((o = n[n.length - 1]), e[o] < f)) {
          ;(t[r] = o), n.push(r)
          continue
        }
        for (l = 0, s = n.length - 1; l < s; )
          (i = (l + s) >> 1), e[n[i]] < f ? (l = i + 1) : (s = i)
        f < e[n[l]] && (l > 0 && (t[r] = n[l - 1]), (n[l] = r))
      }
    }
    for (l = n.length, s = n[l - 1]; l-- > 0; ) (n[l] = s), (s = t[s])
    return n
  }
  const Xi = (e) => e.__isTeleport,
    cn = (e) => e && (e.disabled || e.disabled === ''),
    Fo = (e) => typeof SVGElement != 'undefined' && e instanceof SVGElement,
    Er = (e, t) => {
      const n = e && e.to
      return ye(n) ? (t ? t(n) : null) : n
    },
    Qi = {
      __isTeleport: !0,
      process(e, t, n, r, o, l, s, i, a, f) {
        const {
            mc: u,
            pc: p,
            pbc: m,
            o: { insert: y, querySelector: P, createText: K, createComment: W },
          } = f,
          te = cn(t.props)
        let { shapeFlag: U, children: pe, dynamicChildren: L } = t
        if (e == null) {
          const $ = (t.el = K('')),
            Y = (t.anchor = K(''))
          y($, n, r), y(Y, n, r)
          const S = (t.target = Er(t.props, P)),
            D = (t.targetAnchor = K(''))
          S && (y(D, S), (s = s || Fo(S)))
          const H = (z, ie) => {
            U & 16 && u(pe, z, ie, o, l, s, i, a)
          }
          te ? H(n, Y) : S && H(S, D)
        } else {
          t.el = e.el
          const $ = (t.anchor = e.anchor),
            Y = (t.target = e.target),
            S = (t.targetAnchor = e.targetAnchor),
            D = cn(e.props),
            H = D ? n : Y,
            z = D ? $ : S
          if (
            ((s = s || Fo(Y)),
            L
              ? (m(e.dynamicChildren, L, H, o, l, s, i), eo(e, t, !0))
              : a || p(e, t, H, z, o, l, s, i, !1),
            te)
          )
            D || Sn(t, n, $, f, 1)
          else if ((t.props && t.props.to) !== (e.props && e.props.to)) {
            const ie = (t.target = Er(t.props, P))
            ie && Sn(t, ie, null, f, 0)
          } else D && Sn(t, Y, S, f, 1)
        }
      },
      remove(e, t, n, r, { um: o, o: { remove: l } }, s) {
        const {
          shapeFlag: i,
          children: a,
          anchor: f,
          targetAnchor: u,
          target: p,
          props: m,
        } = e
        if ((p && l(u), (s || !cn(m)) && (l(f), i & 16)))
          for (let y = 0; y < a.length; y++) {
            const P = a[y]
            o(P, t, n, !0, !!P.dynamicChildren)
          }
      },
      move: Sn,
      hydrate: Zi,
    }

  function Sn(e, t, n, { o: { insert: r }, m: o }, l = 2) {
    l === 0 && r(e.targetAnchor, t, n)
    const { el: s, anchor: i, shapeFlag: a, children: f, props: u } = e,
      p = l === 2
    if ((p && r(s, t, n), (!p || cn(u)) && a & 16))
      for (let m = 0; m < f.length; m++) o(f[m], t, n, 2)
    p && r(i, t, n)
  }

  function Zi(
    e,
    t,
    n,
    r,
    o,
    l,
    { o: { nextSibling: s, parentNode: i, querySelector: a } },
    f
  ) {
    const u = (t.target = Er(t.props, a))
    if (u) {
      const p = u._lpa || u.firstChild
      t.shapeFlag & 16 &&
        (cn(t.props)
          ? ((t.anchor = f(s(e), t, i(e), n, r, o, l)), (t.targetAnchor = p))
          : ((t.anchor = s(e)), (t.targetAnchor = f(p, t, u, n, r, o, l))),
        (u._lpa = t.targetAnchor && s(t.targetAnchor)))
    }
    return t.anchor && s(t.anchor)
  }
  const Gi = Qi,
    to = 'components'

  function ft(e, t) {
    return jl(to, e, !0, t) || e
  }
  const $l = Symbol()

  function ea(e) {
    return ye(e) ? jl(to, e, !1) || e : e || $l
  }

  function jl(e, t, n = !0, r = !1) {
    const o = Ye || Se
    if (o) {
      const l = o.type
      if (e === to) {
        const i = pa(l)
        if (i && (i === t || i === st(t) || i === Jn(st(t)))) return l
      }
      const s = Po(o[e] || l[e], t) || Po(o.appContext[e], t)
      return !s && r ? l : s
    }
  }

  function Po(e, t) {
    return e && (e[t] || e[st(t)] || e[Jn(st(t))])
  }
  const Re = Symbol(void 0),
    no = Symbol(void 0),
    jt = Symbol(void 0),
    ar = Symbol(void 0),
    fn = []
  let Mt = null

  function ue(e = !1) {
    fn.push((Mt = e ? null : []))
  }

  function ta() {
    fn.pop(), (Mt = fn[fn.length - 1] || null)
  }
  let Hn = 1

  function Ro(e) {
    Hn += e
  }

  function Bl(e) {
    return (
      (e.dynamicChildren = Hn > 0 ? Mt || zt : null),
      ta(),
      Hn > 0 && Mt && Mt.push(e),
      e
    )
  }

  function Ee(e, t, n, r, o, l) {
    return Bl(ce(e, t, n, r, o, l, !0))
  }

  function Je(e, t, n, r, o) {
    return Bl(xe(e, t, n, r, o, !0))
  }

  function Or(e) {
    return e ? e.__v_isVNode === !0 : !1
  }

  function rn(e, t) {
    return e.type === t.type && e.key === t.key
  }
  const tr = '__vInternal',
    Ul = ({ key: e }) => (e != null ? e : null),
    kn = ({ ref: e, ref_key: t, ref_for: n }) =>
      e != null
        ? ye(e) || Ae(e) || G(e)
          ? {
              i: Ye,
              r: e,
              k: t,
              f: !!n,
            }
          : e
        : null

  function ce(
    e,
    t = null,
    n = null,
    r = 0,
    o = null,
    l = e === Re ? 0 : 1,
    s = !1,
    i = !1
  ) {
    const a = {
      __v_isVNode: !0,
      __v_skip: !0,
      type: e,
      props: t,
      key: t && Ul(t),
      ref: t && kn(t),
      scopeId: Gn,
      slotScopeIds: null,
      children: n,
      component: null,
      suspense: null,
      ssContent: null,
      ssFallback: null,
      dirs: null,
      transition: null,
      el: null,
      anchor: null,
      target: null,
      targetAnchor: null,
      staticCount: 0,
      shapeFlag: l,
      patchFlag: r,
      dynamicProps: o,
      dynamicChildren: null,
      appContext: null,
    }
    return (
      i
        ? (ro(a, n), l & 128 && e.normalize(a))
        : n && (a.shapeFlag |= ye(n) ? 8 : 16),
      Hn > 0 &&
        !s &&
        Mt &&
        (a.patchFlag > 0 || l & 6) &&
        a.patchFlag !== 32 &&
        Mt.push(a),
      a
    )
  }
  const xe = na

  function na(e, t = null, n = null, r = 0, o = null, l = !1) {
    if (((!e || e === $l) && (e = jt), Or(e))) {
      const i = Jt(e, t, !0)
      return n && ro(i, n), i
    }
    if ((ha(e) && (e = e.__vccOpts), t)) {
      t = ra(t)
      let { class: i, style: a } = t
      i && !ye(i) && (t.class = Dt(i)),
        _e(a) && (vl(a) && !Z(a) && (a = De({}, a)), (t.style = $r(a)))
    }
    const s = ye(e) ? 1 : yi(e) ? 128 : Xi(e) ? 64 : _e(e) ? 4 : G(e) ? 2 : 0
    return ce(e, t, n, r, o, s, l, !0)
  }

  function ra(e) {
    return e ? (vl(e) || tr in e ? De({}, e) : e) : null
  }

  function Jt(e, t, n = !1) {
    const { props: r, ref: o, patchFlag: l, children: s } = e,
      i = t ? oa(r || {}, t) : r
    return {
      __v_isVNode: !0,
      __v_skip: !0,
      type: e.type,
      props: i,
      key: i && Ul(i),
      ref:
        t && t.ref
          ? n && o
            ? Z(o)
              ? o.concat(kn(t))
              : [o, kn(t)]
            : kn(t)
          : o,
      scopeId: e.scopeId,
      slotScopeIds: e.slotScopeIds,
      children: s,
      target: e.target,
      targetAnchor: e.targetAnchor,
      staticCount: e.staticCount,
      shapeFlag: e.shapeFlag,
      patchFlag: t && e.type !== Re ? (l === -1 ? 16 : l | 16) : l,
      dynamicProps: e.dynamicProps,
      dynamicChildren: e.dynamicChildren,
      appContext: e.appContext,
      dirs: e.dirs,
      transition: e.transition,
      component: e.component,
      suspense: e.suspense,
      ssContent: e.ssContent && Jt(e.ssContent),
      ssFallback: e.ssFallback && Jt(e.ssFallback),
      el: e.el,
      anchor: e.anchor,
    }
  }

  function Gt(e = ' ', t = 0) {
    return xe(no, null, e, t)
  }

  function Ft(e = '', t = !1) {
    return t ? (ue(), Je(jt, null, e)) : xe(jt, null, e)
  }

  function rt(e) {
    return e == null || typeof e == 'boolean'
      ? xe(jt)
      : Z(e)
      ? xe(Re, null, e.slice())
      : typeof e == 'object'
      ? yt(e)
      : xe(no, null, String(e))
  }

  function yt(e) {
    return e.el === null || e.memo ? e : Jt(e)
  }

  function ro(e, t) {
    let n = 0
    const { shapeFlag: r } = e
    if (t == null) t = null
    else if (Z(t)) n = 16
    else if (typeof t == 'object')
      if (r & 65) {
        const o = t.default
        o && (o._c && (o._d = !1), ro(e, o()), o._c && (o._d = !0))
        return
      } else {
        n = 32
        const o = t._
        !o && !(tr in t)
          ? (t._ctx = Ye)
          : o === 3 &&
            Ye &&
            (Ye.slots._ === 1 ? (t._ = 1) : ((t._ = 2), (e.patchFlag |= 1024)))
      }
    else
      G(t)
        ? ((t = {
            default: t,
            _ctx: Ye,
          }),
          (n = 32))
        : ((t = String(t)), r & 64 ? ((n = 16), (t = [Gt(t)])) : (n = 8))
    ;(e.children = t), (e.shapeFlag |= n)
  }

  function oa(...e) {
    const t = {}
    for (let n = 0; n < e.length; n++) {
      const r = e[n]
      for (const o in r)
        if (o === 'class')
          t.class !== r.class && (t.class = Dt([t.class, r.class]))
        else if (o === 'style') t.style = $r([t.style, r.style])
        else if (zn(o)) {
          const l = t[o],
            s = r[o]
          s &&
            l !== s &&
            !(Z(l) && l.includes(s)) &&
            (t[o] = l ? [].concat(l, s) : s)
        } else o !== '' && (t[o] = r[o])
    }
    return t
  }

  function tt(e, t, n, r = null) {
    Qe(e, t, 7, [n, r])
  }

  function Ln(e, t, n, r) {
    let o
    const l = n && n[r]
    if (Z(e) || ye(e)) {
      o = new Array(e.length)
      for (let s = 0, i = e.length; s < i; s++)
        o[s] = t(e[s], s, void 0, l && l[s])
    } else if (typeof e == 'number') {
      o = new Array(e)
      for (let s = 0; s < e; s++) o[s] = t(s + 1, s, void 0, l && l[s])
    } else if (_e(e))
      if (e[Symbol.iterator])
        o = Array.from(e, (s, i) => t(s, i, void 0, l && l[i]))
      else {
        const s = Object.keys(e)
        o = new Array(s.length)
        for (let i = 0, a = s.length; i < a; i++) {
          const f = s[i]
          o[i] = t(e[f], f, i, l && l[i])
        }
      }
    else o = []
    return n && (n[r] = o), o
  }
  const Tr = (e) => (e ? (Hl(e) ? nr(e) || e.proxy : Tr(e.parent)) : null),
    Kn = De(Object.create(null), {
      $: (e) => e,
      $el: (e) => e.vnode.el,
      $data: (e) => e.data,
      $props: (e) => e.props,
      $attrs: (e) => e.attrs,
      $slots: (e) => e.slots,
      $refs: (e) => e.refs,
      $parent: (e) => Tr(e.parent),
      $root: (e) => Tr(e.root),
      $emit: (e) => e.emit,
      $options: (e) => Pl(e),
      $forceUpdate: (e) => () => _l(e.update),
      $nextTick: (e) => lt.bind(e.proxy),
      $watch: (e) => wi.bind(e),
    }),
    la = {
      get({ _: e }, t) {
        const {
          ctx: n,
          setupState: r,
          data: o,
          props: l,
          accessCache: s,
          type: i,
          appContext: a,
        } = e
        let f
        if (t[0] !== '$') {
          const y = s[t]
          if (y !== void 0)
            switch (y) {
              case 1:
                return r[t]
              case 2:
                return o[t]
              case 4:
                return n[t]
              case 3:
                return l[t]
            }
          else {
            if (r !== de && re(r, t)) return (s[t] = 1), r[t]
            if (o !== de && re(o, t)) return (s[t] = 2), o[t]
            if ((f = e.propsOptions[0]) && re(f, t)) return (s[t] = 3), l[t]
            if (n !== de && re(n, t)) return (s[t] = 4), n[t]
            yr && (s[t] = 0)
          }
        }
        const u = Kn[t]
        let p, m
        if (u) return t === '$attrs' && Ue(e, 'get', t), u(e)
        if ((p = i.__cssModules) && (p = p[t])) return p
        if (n !== de && re(n, t)) return (s[t] = 4), n[t]
        if (((m = a.config.globalProperties), re(m, t))) return m[t]
      },
      set({ _: e }, t, n) {
        const { data: r, setupState: o, ctx: l } = e
        return o !== de && re(o, t)
          ? ((o[t] = n), !0)
          : r !== de && re(r, t)
          ? ((r[t] = n), !0)
          : re(e.props, t) || (t[0] === '$' && t.slice(1) in e)
          ? !1
          : ((l[t] = n), !0)
      },
      has(
        {
          _: {
            data: e,
            setupState: t,
            accessCache: n,
            ctx: r,
            appContext: o,
            propsOptions: l,
          },
        },
        s
      ) {
        let i
        return (
          !!n[s] ||
          (e !== de && re(e, s)) ||
          (t !== de && re(t, s)) ||
          ((i = l[0]) && re(i, s)) ||
          re(r, s) ||
          re(Kn, s) ||
          re(o.config.globalProperties, s)
        )
      },
      defineProperty(e, t, n) {
        return (
          n.get != null
            ? (e._.accessCache[t] = 0)
            : re(n, 'value') && this.set(e, t, n.value, null),
          Reflect.defineProperty(e, t, n)
        )
      },
    },
    sa = Ml()
  let ia = 0

  function aa(e, t, n) {
    const r = e.type,
      o = (t ? t.appContext : e.appContext) || sa,
      l = {
        uid: ia++,
        vnode: e,
        type: r,
        parent: t,
        appContext: o,
        root: null,
        next: null,
        subTree: null,
        effect: null,
        update: null,
        scope: new As(!0),
        render: null,
        proxy: null,
        exposed: null,
        exposeProxy: null,
        withProxy: null,
        provides: t ? t.provides : Object.create(o.provides),
        accessCache: null,
        renderCache: [],
        components: null,
        directives: null,
        propsOptions: kl(r, o),
        emitsOptions: Tl(r, o),
        emit: null,
        emitted: null,
        propsDefaults: de,
        inheritAttrs: r.inheritAttrs,
        ctx: de,
        data: de,
        props: de,
        attrs: de,
        slots: de,
        refs: de,
        setupState: de,
        setupContext: null,
        suspense: n,
        suspenseId: n ? n.pendingId : 0,
        asyncDep: null,
        asyncResolved: !1,
        isMounted: !1,
        isUnmounted: !1,
        isDeactivated: !1,
        bc: null,
        c: null,
        bm: null,
        m: null,
        bu: null,
        u: null,
        um: null,
        bum: null,
        da: null,
        a: null,
        rtg: null,
        rtc: null,
        ec: null,
        sp: null,
      }
    return (
      (l.ctx = {
        _: l,
      }),
      (l.root = t ? t.root : l),
      (l.emit = pi.bind(null, l)),
      e.ce && e.ce(l),
      l
    )
  }
  let Se = null
  const Xt = (e) => {
      ;(Se = e), e.scope.on()
    },
    $t = () => {
      Se && Se.scope.off(), (Se = null)
    }

  function Hl(e) {
    return e.vnode.shapeFlag & 4
  }
  let gn = !1

  function ua(e, t = !1) {
    gn = t
    const { props: n, children: r } = e.vnode,
      o = Hl(e)
    ji(e, n, o, t), Hi(e, r)
    const l = o ? ca(e, t) : void 0
    return (gn = !1), l
  }

  function ca(e, t) {
    const n = e.type
    ;(e.accessCache = Object.create(null)), (e.proxy = ml(new Proxy(e.ctx, la)))
    const { setup: r } = n
    if (r) {
      const o = (e.setupContext = r.length > 1 ? da(e) : null)
      Xt(e), Qt()
      const l = Ct(r, e, 0, [e.props, o])
      if ((Zt(), $t(), el(l))) {
        if ((l.then($t, $t), t))
          return l
            .then((s) => {
              ko(e, s, t)
            })
            .catch((s) => {
              Qn(s, e, 0)
            })
        e.asyncDep = l
      } else ko(e, l, t)
    } else Kl(e, t)
  }

  function ko(e, t, n) {
    G(t)
      ? e.type.__ssrInlineRender
        ? (e.ssrRender = t)
        : (e.render = t)
      : _e(t) && (e.setupState = xl(t)),
      Kl(e, n)
  }
  let Lo

  function Kl(e, t, n) {
    const r = e.type
    if (!e.render) {
      if (!t && Lo && !r.render) {
        const o = r.template
        if (o) {
          const { isCustomElement: l, compilerOptions: s } =
              e.appContext.config,
            { delimiters: i, compilerOptions: a } = r,
            f = De(
              De(
                {
                  isCustomElement: l,
                  delimiters: i,
                },
                s
              ),
              a
            )
          r.render = Lo(o, f)
        }
      }
      e.render = r.render || Xe
    }
    Xt(e), Qt(), Li(e), Zt(), $t()
  }

  function fa(e) {
    return new Proxy(e.attrs, {
      get(t, n) {
        return Ue(e, 'get', '$attrs'), t[n]
      },
    })
  }

  function da(e) {
    const t = (r) => {
      e.exposed = r || {}
    }
    let n
    return {
      get attrs() {
        return n || (n = fa(e))
      },
      slots: e.slots,
      emit: e.emit,
      expose: t,
    }
  }

  function nr(e) {
    if (e.exposed)
      return (
        e.exposeProxy ||
        (e.exposeProxy = new Proxy(xl(ml(e.exposed)), {
          get(t, n) {
            if (n in t) return t[n]
            if (n in Kn) return Kn[n](e)
          },
        }))
      )
  }

  function pa(e) {
    return (G(e) && e.displayName) || e.name
  }

  function ha(e) {
    return G(e) && '__vccOpts' in e
  }
  const ne = (e, t) => ii(e, t, gn)

  function Ie(e, t, n) {
    const r = arguments.length
    return r === 2
      ? _e(t) && !Z(t)
        ? Or(t)
          ? xe(e, null, [t])
          : xe(e, t)
        : xe(e, null, t)
      : (r > 3
          ? (n = Array.prototype.slice.call(arguments, 2))
          : r === 3 && Or(n) && (n = [n]),
        xe(e, t, n))
  }
  const va = '3.2.33',
    ma = 'http://www.w3.org/2000/svg',
    kt = typeof document != 'undefined' ? document : null,
    Do = kt && kt.createElement('template'),
    ga = {
      insert: (e, t, n) => {
        t.insertBefore(e, n || null)
      },
      remove: (e) => {
        const t = e.parentNode
        t && t.removeChild(e)
      },
      createElement: (e, t, n, r) => {
        const o = t
          ? kt.createElementNS(ma, e)
          : kt.createElement(
              e,
              n
                ? {
                    is: n,
                  }
                : void 0
            )
        return (
          e === 'select' &&
            r &&
            r.multiple != null &&
            o.setAttribute('multiple', r.multiple),
          o
        )
      },
      createText: (e) => kt.createTextNode(e),
      createComment: (e) => kt.createComment(e),
      setText: (e, t) => {
        e.nodeValue = t
      },
      setElementText: (e, t) => {
        e.textContent = t
      },
      parentNode: (e) => e.parentNode,
      nextSibling: (e) => e.nextSibling,
      querySelector: (e) => kt.querySelector(e),
      setScopeId(e, t) {
        e.setAttribute(t, '')
      },
      cloneNode(e) {
        const t = e.cloneNode(!0)
        return '_value' in e && (t._value = e._value), t
      },
      insertStaticContent(e, t, n, r, o, l) {
        const s = n ? n.previousSibling : t.lastChild
        if (o && (o === l || o.nextSibling))
          for (
            ;
            t.insertBefore(o.cloneNode(!0), n),
              !(o === l || !(o = o.nextSibling));

          );
        else {
          Do.innerHTML = r ? `<svg>${e}</svg>` : e
          const i = Do.content
          if (r) {
            const a = i.firstChild
            for (; a.firstChild; ) i.appendChild(a.firstChild)
            i.removeChild(a)
          }
          t.insertBefore(i, n)
        }
        return [
          s ? s.nextSibling : t.firstChild,
          n ? n.previousSibling : t.lastChild,
        ]
      },
    }

  function ba(e, t, n) {
    const r = e._vtc
    r && (t = (t ? [t, ...r] : [...r]).join(' ')),
      t == null
        ? e.removeAttribute('class')
        : n
        ? e.setAttribute('class', t)
        : (e.className = t)
  }

  function xa(e, t, n) {
    const r = e.style,
      o = ye(n)
    if (n && !o) {
      for (const l in n) Ir(r, l, n[l])
      if (t && !ye(t)) for (const l in t) n[l] == null && Ir(r, l, '')
    } else {
      const l = r.display
      o ? t !== n && (r.cssText = n) : t && e.removeAttribute('style'),
        '_vod' in e && (r.display = l)
    }
  }
  const No = /\s*!important$/

  function Ir(e, t, n) {
    if (Z(n)) n.forEach((r) => Ir(e, t, r))
    else if ((n == null && (n = ''), t.startsWith('--'))) e.setProperty(t, n)
    else {
      const r = ya(e, t)
      No.test(n)
        ? e.setProperty(Bt(r), n.replace(No, ''), 'important')
        : (e[r] = n)
    }
  }
  const Mo = ['Webkit', 'Moz', 'ms'],
    ur = {}

  function ya(e, t) {
    const n = ur[t]
    if (n) return n
    let r = st(t)
    if (r !== 'filter' && r in e) return (ur[t] = r)
    r = Jn(r)
    for (let o = 0; o < Mo.length; o++) {
      const l = Mo[o] + r
      if (l in e) return (ur[t] = l)
    }
    return t
  }
  const $o = 'http://www.w3.org/1999/xlink'

  function _a(e, t, n, r, o) {
    if (r && t.startsWith('xlink:'))
      n == null
        ? e.removeAttributeNS($o, t.slice(6, t.length))
        : e.setAttributeNS($o, t, n)
    else {
      const l = bs(t)
      n == null || (l && !Qo(n))
        ? e.removeAttribute(t)
        : e.setAttribute(t, l ? '' : n)
    }
  }

  function wa(e, t, n, r, o, l, s) {
    if (t === 'innerHTML' || t === 'textContent') {
      r && s(r, o, l), (e[t] = n == null ? '' : n)
      return
    }
    if (t === 'value' && e.tagName !== 'PROGRESS' && !e.tagName.includes('-')) {
      e._value = n
      const a = n == null ? '' : n
      ;(e.value !== a || e.tagName === 'OPTION') && (e.value = a),
        n == null && e.removeAttribute(t)
      return
    }
    let i = !1
    if (n === '' || n == null) {
      const a = typeof e[t]
      a === 'boolean'
        ? (n = Qo(n))
        : n == null && a === 'string'
        ? ((n = ''), (i = !0))
        : a === 'number' && ((n = 0), (i = !0))
    }
    try {
      e[t] = n
    } catch {}
    i && e.removeAttribute(t)
  }
  const [ql, Ca] = (() => {
    let e = Date.now,
      t = !1
    if (typeof window != 'undefined') {
      Date.now() > document.createEvent('Event').timeStamp &&
        (e = () => performance.now())
      const n = navigator.userAgent.match(/firefox\/(\d+)/i)
      t = !!(n && Number(n[1]) <= 53)
    }
    return [e, t]
  })()
  let Sr = 0
  const Ea = Promise.resolve(),
    Oa = () => {
      Sr = 0
    },
    Ta = () => Sr || (Ea.then(Oa), (Sr = ql()))

  function Wt(e, t, n, r) {
    e.addEventListener(t, n, r)
  }

  function Ia(e, t, n, r) {
    e.removeEventListener(t, n, r)
  }

  function Sa(e, t, n, r, o = null) {
    const l = e._vei || (e._vei = {}),
      s = l[t]
    if (r && s) s.value = r
    else {
      const [i, a] = Aa(t)
      if (r) {
        const f = (l[t] = Fa(r, o))
        Wt(e, i, f, a)
      } else s && (Ia(e, i, s, a), (l[t] = void 0))
    }
  }
  const jo = /(?:Once|Passive|Capture)$/

  function Aa(e) {
    let t
    if (jo.test(e)) {
      t = {}
      let n
      for (; (n = e.match(jo)); )
        (e = e.slice(0, e.length - n[0].length)), (t[n[0].toLowerCase()] = !0)
    }
    return [Bt(e.slice(2)), t]
  }

  function Fa(e, t) {
    const n = (r) => {
      const o = r.timeStamp || ql()
      ;(Ca || o >= n.attached - 1) && Qe(Pa(r, n.value), t, 5, [r])
    }
    return (n.value = e), (n.attached = Ta()), n
  }

  function Pa(e, t) {
    if (Z(t)) {
      const n = e.stopImmediatePropagation
      return (
        (e.stopImmediatePropagation = () => {
          n.call(e), (e._stopped = !0)
        }),
        t.map((r) => (o) => !o._stopped && r && r(o))
      )
    } else return t
  }
  const Bo = /^on[a-z]/,
    Ra = (e, t, n, r, o = !1, l, s, i, a) => {
      t === 'class'
        ? ba(e, r, o)
        : t === 'style'
        ? xa(e, n, r)
        : zn(t)
        ? jr(t) || Sa(e, t, n, r, s)
        : (
            t[0] === '.'
              ? ((t = t.slice(1)), !0)
              : t[0] === '^'
              ? ((t = t.slice(1)), !1)
              : ka(e, t, r, o)
          )
        ? wa(e, t, r, l, s, i, a)
        : (t === 'true-value'
            ? (e._trueValue = r)
            : t === 'false-value' && (e._falseValue = r),
          _a(e, t, r, o))
    }

  function ka(e, t, n, r) {
    return r
      ? !!(
          t === 'innerHTML' ||
          t === 'textContent' ||
          (t in e && Bo.test(t) && G(n))
        )
      : t === 'spellcheck' ||
        t === 'draggable' ||
        t === 'translate' ||
        t === 'form' ||
        (t === 'list' && e.tagName === 'INPUT') ||
        (t === 'type' && e.tagName === 'TEXTAREA') ||
        (Bo.test(t) && ye(n))
      ? !1
      : t in e
  }
  const Uo = (e) => {
    const t = e.props['onUpdate:modelValue']
    return Z(t) ? (n) => Rn(t, n) : t
  }

  function La(e) {
    e.target.composing = !0
  }

  function Ho(e) {
    const t = e.target
    t.composing && ((t.composing = !1), Da(t, 'input'))
  }

  function Da(e, t) {
    const n = document.createEvent('HTMLEvents')
    n.initEvent(t, !0, !0), e.dispatchEvent(n)
  }
  const Na = {
      created(e, { modifiers: { lazy: t, trim: n, number: r } }, o) {
        e._assign = Uo(o)
        const l = r || (o.props && o.props.type === 'number')
        Wt(e, t ? 'change' : 'input', (s) => {
          if (s.target.composing) return
          let i = e.value
          n ? (i = i.trim()) : l && (i = dr(i)), e._assign(i)
        }),
          n &&
            Wt(e, 'change', () => {
              e.value = e.value.trim()
            }),
          t ||
            (Wt(e, 'compositionstart', La),
            Wt(e, 'compositionend', Ho),
            Wt(e, 'change', Ho))
      },
      mounted(e, { value: t }) {
        e.value = t == null ? '' : t
      },
      beforeUpdate(
        e,
        { value: t, modifiers: { lazy: n, trim: r, number: o } },
        l
      ) {
        if (
          ((e._assign = Uo(l)),
          e.composing ||
            (document.activeElement === e &&
              (n ||
                (r && e.value.trim() === t) ||
                ((o || e.type === 'number') && dr(e.value) === t))))
        )
          return
        const s = t == null ? '' : t
        e.value !== s && (e.value = s)
      },
    },
    Ma = {
      esc: 'escape',
      space: ' ',
      up: 'arrow-up',
      left: 'arrow-left',
      right: 'arrow-right',
      down: 'arrow-down',
      delete: 'backspace',
    },
    Pt = (e, t) => (n) => {
      if (!('key' in n)) return
      const r = Bt(n.key)
      if (t.some((o) => o === r || Ma[o] === r)) return e(n)
    },
    $a = De(
      {
        patchProp: Ra,
      },
      ga
    )
  let Ko

  function ja() {
    return Ko || (Ko = Vi($a))
  }
  const Ba = (...e) => {
    const t = ja().createApp(...e),
      { mount: n } = t
    return (
      (t.mount = (r) => {
        const o = Ua(r)
        if (!o) return
        const l = t._component
        !G(l) && !l.render && !l.template && (l.template = o.innerHTML),
          (o.innerHTML = '')
        const s = n(o, !1, o instanceof SVGElement)
        return (
          o instanceof Element &&
            (o.removeAttribute('v-cloak'), o.setAttribute('data-v-app', '')),
          s
        )
      }),
      t
    )
  }

  function Ua(e) {
    return ye(e) ? document.querySelector(e) : e
  }

  function Oe(e, t, ...n) {
    if (e in t) {
      let o = t[e]
      return typeof o == 'function' ? o(...n) : o
    }
    let r = new Error(
      `Tried to handle "${e}" but there is no handler defined. Only defined handlers are: ${Object.keys(
        t
      )
        .map((o) => `"${o}"`)
        .join(', ')}.`
    )
    throw (Error.captureStackTrace && Error.captureStackTrace(r, Oe), r)
  }
  var Ot = ((e) => (
      (e[(e.None = 0)] = 'None'),
      (e[(e.RenderStrategy = 1)] = 'RenderStrategy'),
      (e[(e.Static = 2)] = 'Static'),
      e
    ))(Ot || {}),
    _t = ((e) => (
      (e[(e.Unmount = 0)] = 'Unmount'), (e[(e.Hidden = 1)] = 'Hidden'), e
    ))(_t || {})

  function Ce(r) {
    var o = r,
      { visible: e = !0, features: t = 0 } = o,
      n = et(o, ['visible', 'features'])
    var l
    if (e || (t & 2 && n.props.static)) return cr(n)
    if (t & 1) {
      let s = (l = n.props.unmount) == null || l ? 0 : 1
      return Oe(s, {
        [0]() {
          return null
        },
        [1]() {
          return cr(
            ze(Q({}, n), {
              props: ze(Q({}, n.props), {
                hidden: !0,
                style: {
                  display: 'none',
                },
              }),
            })
          )
        },
      })
    }
    return cr(n)
  }

  function cr({ props: e, attrs: t, slots: n, slot: r, name: o }) {
    var l
    let u = yn(e, ['unmount', 'static']),
      { as: s } = u,
      i = et(u, ['as']),
      a = (l = n.default) == null ? void 0 : l.call(n, r),
      f = {}
    if (s === 'template') {
      if (Object.keys(i).length > 0 || Object.keys(t).length > 0) {
        let [p, ...m] = a != null ? a : []
        if (!Ka(p) || m.length > 0)
          throw new Error(
            [
              'Passing props on "template"!',
              '',
              `The current component <${o} /> is rendering a "template".`,
              'However we need to passthrough the following props:',
              Object.keys(i)
                .concat(Object.keys(t))
                .map((y) => `  - ${y}`).join(`
`),
              '',
              'You can apply a few solutions:',
              [
                'Add an `as="..."` prop, to ensure that we render an actual element instead of a "template".',
                'Render a single element as the child so that we can forward the props onto that element.',
              ].map((y) => `  - ${y}`).join(`
`),
            ].join(`
`)
          )
        return Jt(p, Object.assign({}, i, f))
      }
      return Array.isArray(a) && a.length === 1 ? a[0] : a
    }
    return Ie(s, Object.assign({}, i, f), a)
  }

  function Ha(e) {
    let t = Object.assign({}, e)
    for (let n in t) t[n] === void 0 && delete t[n]
    return t
  }

  function yn(e, t = []) {
    let n = Object.assign({}, e)
    for (let r of t) r in n && delete n[r]
    return n
  }

  function Ka(e) {
    return e == null
      ? !1
      : typeof e.type == 'string' ||
          typeof e.type == 'object' ||
          typeof e.type == 'function'
  }
  let qa = 0

  function Wa() {
    return ++qa
  }

  function He() {
    return Wa()
  }
  var Fe = ((e) => (
    (e.Space = ' '),
    (e.Enter = 'Enter'),
    (e.Escape = 'Escape'),
    (e.Backspace = 'Backspace'),
    (e.Delete = 'Delete'),
    (e.ArrowLeft = 'ArrowLeft'),
    (e.ArrowUp = 'ArrowUp'),
    (e.ArrowRight = 'ArrowRight'),
    (e.ArrowDown = 'ArrowDown'),
    (e.Home = 'Home'),
    (e.End = 'End'),
    (e.PageUp = 'PageUp'),
    (e.PageDown = 'PageDown'),
    (e.Tab = 'Tab'),
    e
  ))(Fe || {})

  function za(e) {
    throw new Error('Unexpected object: ' + e)
  }
  var ke = ((e) => (
    (e[(e.First = 0)] = 'First'),
    (e[(e.Previous = 1)] = 'Previous'),
    (e[(e.Next = 2)] = 'Next'),
    (e[(e.Last = 3)] = 'Last'),
    (e[(e.Specific = 4)] = 'Specific'),
    (e[(e.Nothing = 5)] = 'Nothing'),
    e
  ))(ke || {})

  function Va(e, t) {
    let n = t.resolveItems()
    if (n.length <= 0) return null
    let r = t.resolveActiveIndex(),
      o = r != null ? r : -1,
      l = (() => {
        switch (e.focus) {
          case 0:
            return n.findIndex((s) => !t.resolveDisabled(s))
          case 1: {
            let s = n
              .slice()
              .reverse()
              .findIndex((i, a, f) =>
                o !== -1 && f.length - a - 1 >= o ? !1 : !t.resolveDisabled(i)
              )
            return s === -1 ? s : n.length - 1 - s
          }
          case 2:
            return n.findIndex((s, i) => (i <= o ? !1 : !t.resolveDisabled(s)))
          case 3: {
            let s = n
              .slice()
              .reverse()
              .findIndex((i) => !t.resolveDisabled(i))
            return s === -1 ? s : n.length - 1 - s
          }
          case 4:
            return n.findIndex((s) => t.resolveId(s) === e.id)
          case 5:
            return null
          default:
            za(e)
        }
      })()
    return l === -1 ? r : l
  }

  function ve(e) {
    return e == null || e.value == null
      ? null
      : '$el' in e.value
      ? e.value.$el
      : e.value
  }
  let Wl = Symbol('Context')
  var it = ((e) => (
    (e[(e.Open = 0)] = 'Open'), (e[(e.Closed = 1)] = 'Closed'), e
  ))(it || {})

  function Ya() {
    return rr() !== null
  }

  function rr() {
    return $e(Wl, null)
  }

  function zl(e) {
    Ze(Wl, e)
  }

  function qo(e, t) {
    if (e) return e
    let n = t != null ? t : 'button'
    if (typeof n == 'string' && n.toLowerCase() === 'button') return 'button'
  }

  function Ja(e, t) {
    let n = X(qo(e.value.type, e.value.as))
    return (
      Le(() => {
        n.value = qo(e.value.type, e.value.as)
      }),
      Ne(() => {
        var r
        n.value ||
          !ve(t) ||
          (ve(t) instanceof HTMLButtonElement &&
            !((r = ve(t)) != null && r.hasAttribute('type')) &&
            (n.value = 'button'))
      }),
      n
    )
  }

  function en(e) {
    if (typeof window == 'undefined') return null
    if (e instanceof Node) return e.ownerDocument
    if (e != null && e.hasOwnProperty('value')) {
      let t = ve(e)
      if (t) return t.ownerDocument
    }
    return document
  }

  function Xa({ container: e, accept: t, walk: n, enabled: r }) {
    Ne(() => {
      let o = e.value
      if (!o || (r !== void 0 && !r.value)) return
      let l = en(e)
      if (!l) return
      let s = Object.assign((a) => t(a), {
          acceptNode: t,
        }),
        i = l.createTreeWalker(o, NodeFilter.SHOW_ELEMENT, s, !1)
      for (; i.nextNode(); ) n(i.currentNode)
    })
  }
  let Qa = [
    '[contentEditable=true]',
    '[tabindex]',
    'a[href]',
    'area[href]',
    'button:not([disabled])',
    'iframe',
    'input:not([disabled])',
    'select:not([disabled])',
    'textarea:not([disabled])',
  ]
    .map((e) => `${e}:not([tabindex='-1'])`)
    .join(',')
  var qn = ((e) => (
      (e[(e.First = 1)] = 'First'),
      (e[(e.Previous = 2)] = 'Previous'),
      (e[(e.Next = 4)] = 'Next'),
      (e[(e.Last = 8)] = 'Last'),
      (e[(e.WrapAround = 16)] = 'WrapAround'),
      (e[(e.NoScroll = 32)] = 'NoScroll'),
      e
    ))(qn || {}),
    Vl = ((e) => (
      (e[(e.Error = 0)] = 'Error'),
      (e[(e.Overflow = 1)] = 'Overflow'),
      (e[(e.Success = 2)] = 'Success'),
      (e[(e.Underflow = 3)] = 'Underflow'),
      e
    ))(Vl || {}),
    Za = ((e) => (
      (e[(e.Previous = -1)] = 'Previous'), (e[(e.Next = 1)] = 'Next'), e
    ))(Za || {})

  function Ga(e = document.body) {
    return e == null ? [] : Array.from(e.querySelectorAll(Qa))
  }
  var eu = ((e) => (
    (e[(e.Strict = 0)] = 'Strict'), (e[(e.Loose = 1)] = 'Loose'), e
  ))(eu || {})

  function dn(e) {
    e == null ||
      e.focus({
        preventScroll: !0,
      })
  }
  let tu = ['textarea', 'input'].join(',')

  function nu(e) {
    var t, n
    return (n =
      (t = e == null ? void 0 : e.matches) == null ? void 0 : t.call(e, tu)) !=
      null
      ? n
      : !1
  }

  function Yl(e, t = (n) => n) {
    return e.slice().sort((n, r) => {
      let o = t(n),
        l = t(r)
      if (o === null || l === null) return 0
      let s = o.compareDocumentPosition(l)
      return s & Node.DOCUMENT_POSITION_FOLLOWING
        ? -1
        : s & Node.DOCUMENT_POSITION_PRECEDING
        ? 1
        : 0
    })
  }

  function Ar(e, t, n = !0) {
    var r
    let o =
        (r = Array.isArray(e)
          ? e.length > 0
            ? e[0].ownerDocument
            : document
          : e == null
          ? void 0
          : e.ownerDocument) != null
          ? r
          : document,
      l = Array.isArray(e) ? (n ? Yl(e) : e) : Ga(e),
      s = o.activeElement,
      i = (() => {
        if (t & 5) return 1
        if (t & 10) return -1
        throw new Error(
          'Missing Focus.First, Focus.Previous, Focus.Next or Focus.Last'
        )
      })(),
      a = (() => {
        if (t & 1) return 0
        if (t & 2) return Math.max(0, l.indexOf(s)) - 1
        if (t & 4) return Math.max(0, l.indexOf(s)) + 1
        if (t & 8) return l.length - 1
        throw new Error(
          'Missing Focus.First, Focus.Previous, Focus.Next or Focus.Last'
        )
      })(),
      f =
        t & 32
          ? {
              preventScroll: !0,
            }
          : {},
      u = 0,
      p = l.length,
      m
    do {
      if (u >= p || u + p <= 0) return 0
      let y = a + u
      if (t & 16) y = (y + p) % p
      else {
        if (y < 0) return 3
        if (y >= p) return 1
      }
      ;(m = l[y]), m == null || m.focus(f), (u += i)
    } while (m !== o.activeElement)
    return (
      m.hasAttribute('tabindex') || m.setAttribute('tabindex', '0'),
      t & 6 && nu(m) && m.select(),
      2
    )
  }

  function Fr(e, t, n) {
    typeof window != 'undefined' &&
      Ne((r) => {
        window.addEventListener(e, t, n),
          r(() => window.removeEventListener(e, t, n))
      })
  }

  function ru(e) {
    typeof queueMicrotask == 'function'
      ? queueMicrotask(e)
      : Promise.resolve()
          .then(e)
          .catch((t) =>
            setTimeout(() => {
              throw t
            })
          )
  }
  var Jl = ((e) => (
    (e[(e.None = 1)] = 'None'),
    (e[(e.IgnoreScrollbars = 2)] = 'IgnoreScrollbars'),
    e
  ))(Jl || {})

  function Xl(e, t, n = 1) {
    let r = !1

    function o(l) {
      if (r) return
      ;(r = !0),
        ru(() => {
          r = !1
        })
      let s = l.target
      if (!s.ownerDocument.documentElement.contains(s)) return
      let i = (function a(f) {
        return typeof f == 'function'
          ? a(f())
          : Array.isArray(f) || f instanceof Set
          ? f
          : [f]
      })(e)
      if ((n & 2) === 2) {
        let a = 20,
          f = s.ownerDocument.documentElement
        if (
          l.clientX > f.clientWidth - a ||
          l.clientX < a ||
          l.clientY > f.clientHeight - a ||
          l.clientY < a
        )
          return
      }
      for (let a of i) {
        if (a === null) continue
        let f = a instanceof HTMLElement ? a : ve(a)
        if (f != null && f.contains(s)) return
      }
      t(l, s)
    }
    Fr('pointerdown', o), Fr('mousedown', o)
  }
  var bn = ((e) => (
    (e[(e.None = 1)] = 'None'),
    (e[(e.Focusable = 2)] = 'Focusable'),
    (e[(e.Hidden = 4)] = 'Hidden'),
    e
  ))(bn || {})
  let Wn = we({
    name: 'Hidden',
    props: {
      as: {
        type: [Object, String],
        default: 'div',
      },
      features: {
        type: Number,
        default: 1,
      },
    },
    setup(e, { slots: t, attrs: n }) {
      return () => {
        let s = e,
          { features: r } = s,
          o = et(s, ['features']),
          l = {
            'aria-hidden': (r & 2) === 2 ? !0 : void 0,
            style: Q(
              {
                position: 'absolute',
                width: 1,
                height: 1,
                padding: 0,
                margin: -1,
                overflow: 'hidden',
                clip: 'rect(0, 0, 0, 0)',
                whiteSpace: 'nowrap',
                borderWidth: '0',
              },
              (r & 4) === 4 &&
                (r & 2) !== 2 && {
                  display: 'none',
                }
            ),
          }
        return Ce({
          props: Q(Q({}, o), l),
          slot: {},
          attrs: n,
          slots: t,
          name: 'Hidden',
        })
      }
    },
  })

  function Ql(e = {}, t = null, n = []) {
    for (let [r, o] of Object.entries(e)) Gl(n, Zl(t, r), o)
    return n
  }

  function Zl(e, t) {
    return e ? e + '[' + t + ']' : t
  }

  function Gl(e, t, n) {
    if (Array.isArray(n))
      for (let [r, o] of n.entries()) Gl(e, Zl(t, r.toString()), o)
    else
      n instanceof Date
        ? e.push([t, n.toISOString()])
        : typeof n == 'boolean'
        ? e.push([t, n ? '1' : '0'])
        : typeof n == 'string'
        ? e.push([t, n])
        : typeof n == 'number'
        ? e.push([t, `${n}`])
        : n == null
        ? e.push([t, ''])
        : Ql(n, t, e)
  }
  var ou = ((e) => (
      (e[(e.Open = 0)] = 'Open'), (e[(e.Closed = 1)] = 'Closed'), e
    ))(ou || {}),
    lu = ((e) => (
      (e[(e.Single = 0)] = 'Single'), (e[(e.Multi = 1)] = 'Multi'), e
    ))(lu || {}),
    su = ((e) => (
      (e[(e.Pointer = 0)] = 'Pointer'), (e[(e.Other = 1)] = 'Other'), e
    ))(su || {})
  let es = Symbol('ComboboxContext')

  function tn(e) {
    let t = $e(es, null)
    if (t === null) {
      let n = new Error(`<${e} /> is missing a parent <Combobox /> component.`)
      throw (Error.captureStackTrace && Error.captureStackTrace(n, tn), n)
    }
    return t
  }
  let iu = we({
    name: 'Combobox',
    emits: {
      'update:modelValue': (e) => !0,
    },
    props: {
      as: {
        type: [Object, String],
        default: 'template',
      },
      disabled: {
        type: [Boolean],
        default: !1,
      },
      modelValue: {
        type: [Object, String, Number, Boolean],
      },
      name: {
        type: String,
      },
      nullable: {
        type: Boolean,
        default: !1,
      },
      multiple: {
        type: [Boolean],
        default: !1,
      },
    },
    inheritAttrs: !1,
    setup(e, { slots: t, attrs: n, emit: r }) {
      let o = X(1),
        l = X(null),
        s = X(null),
        i = X(null),
        a = X(null),
        f = X({
          static: !1,
          hold: !1,
        }),
        u = X([]),
        p = X(null),
        m = X(1),
        y = X(!1)

      function P(L = ($) => $) {
        let $ = p.value !== null ? u.value[p.value] : null,
          Y = Yl(L(u.value.slice()), (D) => ve(D.dataRef.domRef)),
          S = $ ? Y.indexOf($) : null
        return (
          S === -1 && (S = null),
          {
            options: Y,
            activeOptionIndex: S,
          }
        )
      }
      let K = ne(() => e.modelValue),
        W = ne(() => (e.multiple ? 1 : 0)),
        te = ne(() => e.nullable),
        U = {
          comboboxState: o,
          value: K,
          mode: W,
          compare(L, $) {
            return L === $
          },
          nullable: te,
          inputRef: s,
          labelRef: l,
          buttonRef: i,
          optionsRef: a,
          disabled: ne(() => e.disabled),
          options: u,
          change(L) {
            r('update:modelValue', L)
          },
          activeOptionIndex: ne(() => {
            if (y.value && p.value === null && u.value.length > 0) {
              let L = u.value.findIndex(($) => !$.dataRef.disabled)
              if (L !== -1) return L
            }
            return p.value
          }),
          activationTrigger: m,
          inputPropsRef: X({
            displayValue: void 0,
          }),
          optionsPropsRef: f,
          closeCombobox() {
            ;(y.value = !1),
              !e.disabled && o.value !== 1 && ((o.value = 1), (p.value = null))
          },
          openCombobox() {
            if (((y.value = !0), e.disabled || o.value === 0)) return
            let L = u.value.findIndex(($) => {
              let Y = q($.dataRef.value)
              return Oe(W.value, {
                [0]: () => U.compare(q(U.value.value), q(Y)),
                [1]: () => q(U.value.value).some((S) => U.compare(q(S), q(Y))),
              })
            })
            L !== -1 && (p.value = L), (o.value = 0)
          },
          goToOption(L, $, Y) {
            if (
              ((y.value = !1),
              e.disabled || (a.value && !f.value.static && o.value === 1))
            )
              return
            let S = P()
            if (S.activeOptionIndex === null) {
              let H = S.options.findIndex((z) => !z.dataRef.disabled)
              H !== -1 && (S.activeOptionIndex = H)
            }
            let D = Va(
              L === ke.Specific
                ? {
                    focus: ke.Specific,
                    id: $,
                  }
                : {
                    focus: L,
                  },
              {
                resolveItems: () => S.options,
                resolveActiveIndex: () => S.activeOptionIndex,
                resolveId: (H) => H.id,
                resolveDisabled: (H) => H.dataRef.disabled,
              }
            )
            ;(p.value = D), (m.value = Y != null ? Y : 1), (u.value = S.options)
          },
          syncInputValue() {
            var L
            let $ = U.value.value
            if (!ve(U.inputRef)) return
            let Y = U.inputPropsRef.value.displayValue
            typeof Y == 'function'
              ? (U.inputRef.value.value = (L = Y($)) != null ? L : '')
              : typeof $ == 'string'
              ? (U.inputRef.value.value = $)
              : (U.inputRef.value.value = '')
          },
          selectOption(L) {
            let $ = u.value.find((S) => S.id === L)
            if (!$) return
            let { dataRef: Y } = $
            r(
              'update:modelValue',
              Oe(W.value, {
                [0]: () => Y.value,
                [1]: () => {
                  let S = q(U.value.value).slice(),
                    D = q(Y.value),
                    H = S.indexOf(D)
                  return H === -1 ? S.push(D) : S.splice(H, 1), S
                },
              })
            ),
              U.syncInputValue()
          },
          selectActiveOption() {
            if (U.activeOptionIndex.value === null) return
            let { dataRef: L, id: $ } = u.value[U.activeOptionIndex.value]
            r(
              'update:modelValue',
              Oe(W.value, {
                [0]: () => L.value,
                [1]: () => {
                  let Y = q(U.value.value).slice(),
                    S = q(L.value),
                    D = Y.indexOf(S)
                  return D === -1 ? Y.push(S) : Y.splice(D, 1), Y
                },
              })
            ),
              U.syncInputValue(),
              U.goToOption(ke.Specific, $)
          },
          registerOption(L, $) {
            let Y = {
                id: L,
                dataRef: $,
              },
              S = P((D) => [...D, Y])
            if (p.value === null) {
              let D = $.value.value
              Oe(W.value, {
                [0]: () => U.compare(q(U.value.value), q(D)),
                [1]: () => q(U.value.value).some((H) => U.compare(q(H), q(D))),
              }) && (S.activeOptionIndex = S.options.indexOf(Y))
            }
            ;(u.value = S.options),
              (p.value = S.activeOptionIndex),
              (m.value = 1)
          },
          unregisterOption(L) {
            let $ = P((Y) => {
              let S = Y.findIndex((D) => D.id === L)
              return S !== -1 && Y.splice(S, 1), Y
            })
            ;(u.value = $.options),
              (p.value = $.activeOptionIndex),
              (m.value = 1)
          },
        }
      Xl([s, i, a], () => {
        o.value === 0 && U.closeCombobox()
      }),
        dt([U.value, U.inputRef], () => U.syncInputValue(), {
          immediate: !0,
        }),
        dt(
          U.comboboxState,
          (L) => {
            L === 1 && U.syncInputValue()
          },
          {
            immediate: !0,
          }
        ),
        Ze(es, U),
        zl(
          ne(() =>
            Oe(o.value, {
              [0]: it.Open,
              [1]: it.Closed,
            })
          )
        )
      let pe = ne(() =>
        U.activeOptionIndex.value === null
          ? null
          : u.value[U.activeOptionIndex.value].dataRef.value
      )
      return () => {
        let H = e,
          { name: L, modelValue: $, disabled: Y } = H,
          S = et(H, ['name', 'modelValue', 'disabled']),
          D = {
            open: o.value === 0,
            disabled: Y,
            activeIndex: U.activeOptionIndex.value,
            activeOption: pe.value,
          }
        return Ie(Re, [
          ...(L != null && $ != null
            ? Ql({
                [L]: $,
              }).map(([z, ie]) =>
                Ie(
                  Wn,
                  Ha({
                    features: bn.Hidden,
                    key: z,
                    as: 'input',
                    type: 'hidden',
                    hidden: !0,
                    readOnly: !0,
                    name: z,
                    value: ie,
                  })
                )
              )
            : []),
          Ce({
            props: Q(
              Q({}, n),
              yn(S, ['nullable', 'multiple', 'onUpdate:modelValue', 'by'])
            ),
            slot: D,
            slots: t,
            attrs: n,
            name: 'Combobox',
          }),
        ])
      }
    },
  })
  we({
    name: 'ComboboxLabel',
    props: {
      as: {
        type: [Object, String],
        default: 'label',
      },
    },
    setup(e, { attrs: t, slots: n }) {
      let r = tn('ComboboxLabel'),
        o = `headlessui-combobox-label-${He()}`

      function l() {
        var s
        ;(s = ve(r.inputRef)) == null ||
          s.focus({
            preventScroll: !0,
          })
      }
      return () => {
        let s = {
            open: r.comboboxState.value === 0,
            disabled: r.disabled.value,
          },
          i = {
            id: o,
            ref: r.labelRef,
            onClick: l,
          }
        return Ce({
          props: Q(Q({}, e), i),
          slot: s,
          attrs: t,
          slots: n,
          name: 'ComboboxLabel',
        })
      }
    },
  })
  let au = we({
      name: 'ComboboxButton',
      props: {
        as: {
          type: [Object, String],
          default: 'button',
        },
      },
      setup(e, { attrs: t, slots: n, expose: r }) {
        let o = tn('ComboboxButton'),
          l = `headlessui-combobox-button-${He()}`
        r({
          el: o.buttonRef,
          $el: o.buttonRef,
        })

        function s(f) {
          o.disabled.value ||
            (o.comboboxState.value === 0
              ? o.closeCombobox()
              : (f.preventDefault(), o.openCombobox()),
            lt(() => {
              var u
              return (u = ve(o.inputRef)) == null
                ? void 0
                : u.focus({
                    preventScroll: !0,
                  })
            }))
        }

        function i(f) {
          switch (f.key) {
            case Fe.ArrowDown:
              f.preventDefault(),
                f.stopPropagation(),
                o.comboboxState.value === 1 && o.openCombobox(),
                lt(() => {
                  var u
                  return (u = o.inputRef.value) == null
                    ? void 0
                    : u.focus({
                        preventScroll: !0,
                      })
                })
              return
            case Fe.ArrowUp:
              f.preventDefault(),
                f.stopPropagation(),
                o.comboboxState.value === 1 &&
                  (o.openCombobox(),
                  lt(() => {
                    o.value.value || o.goToOption(ke.Last)
                  })),
                lt(() => {
                  var u
                  return (u = o.inputRef.value) == null
                    ? void 0
                    : u.focus({
                        preventScroll: !0,
                      })
                })
              return
            case Fe.Escape:
              if (o.comboboxState.value !== 0) return
              f.preventDefault(),
                o.optionsRef.value &&
                  !o.optionsPropsRef.value.static &&
                  f.stopPropagation(),
                o.closeCombobox(),
                lt(() => {
                  var u
                  return (u = o.inputRef.value) == null
                    ? void 0
                    : u.focus({
                        preventScroll: !0,
                      })
                })
              return
          }
        }
        let a = Ja(
          ne(() => ({
            as: e.as,
            type: t.type,
          })),
          o.buttonRef
        )
        return () => {
          var f, u
          let p = {
              open: o.comboboxState.value === 0,
              disabled: o.disabled.value,
            },
            m = {
              ref: o.buttonRef,
              id: l,
              type: a.value,
              tabindex: '-1',
              'aria-haspopup': !0,
              'aria-controls': (f = ve(o.optionsRef)) == null ? void 0 : f.id,
              'aria-expanded': o.disabled.value
                ? void 0
                : o.comboboxState.value === 0,
              'aria-labelledby': o.labelRef.value
                ? [(u = ve(o.labelRef)) == null ? void 0 : u.id, l].join(' ')
                : void 0,
              disabled: o.disabled.value === !0 ? !0 : void 0,
              onKeydown: i,
              onClick: s,
            }
          return Ce({
            props: Q(Q({}, e), m),
            slot: p,
            attrs: t,
            slots: n,
            name: 'ComboboxButton',
          })
        }
      },
    }),
    uu = we({
      name: 'ComboboxInput',
      props: {
        as: {
          type: [Object, String],
          default: 'input',
        },
        static: {
          type: Boolean,
          default: !1,
        },
        unmount: {
          type: Boolean,
          default: !0,
        },
        displayValue: {
          type: Function,
        },
      },
      emits: {
        change: (e) => !0,
      },
      setup(e, { emit: t, attrs: n, slots: r, expose: o }) {
        let l = tn('ComboboxInput'),
          s = `headlessui-combobox-input-${He()}`
        ;(l.inputPropsRef = ne(() => e)),
          o({
            el: l.inputRef,
            $el: l.inputRef,
          })

        function i(u) {
          switch (u.key) {
            case Fe.Backspace:
            case Fe.Delete:
              if (
                l.comboboxState.value !== 0 ||
                l.mode.value !== 0 ||
                !l.nullable.value
              )
                return
              let p = u.currentTarget
              requestAnimationFrame(() => {
                if (p.value === '') {
                  l.change(null)
                  let m = ve(l.optionsRef)
                  m && (m.scrollTop = 0), l.goToOption(ke.Nothing)
                }
              })
              break
            case Fe.Enter:
              if (l.comboboxState.value !== 0) return
              if (
                (u.preventDefault(),
                u.stopPropagation(),
                l.activeOptionIndex.value === null)
              ) {
                l.closeCombobox()
                return
              }
              l.selectActiveOption(), l.mode.value === 0 && l.closeCombobox()
              break
            case Fe.ArrowDown:
              return (
                u.preventDefault(),
                u.stopPropagation(),
                Oe(l.comboboxState.value, {
                  [0]: () => l.goToOption(ke.Next),
                  [1]: () => l.openCombobox(),
                })
              )
            case Fe.ArrowUp:
              return (
                u.preventDefault(),
                u.stopPropagation(),
                Oe(l.comboboxState.value, {
                  [0]: () => l.goToOption(ke.Previous),
                  [1]: () => {
                    l.openCombobox(),
                      lt(() => {
                        l.value.value || l.goToOption(ke.Last)
                      })
                  },
                })
              )
            case Fe.Home:
            case Fe.PageUp:
              return (
                u.preventDefault(), u.stopPropagation(), l.goToOption(ke.First)
              )
            case Fe.End:
            case Fe.PageDown:
              return (
                u.preventDefault(), u.stopPropagation(), l.goToOption(ke.Last)
              )
            case Fe.Escape:
              if (l.comboboxState.value !== 0) return
              u.preventDefault(),
                l.optionsRef.value &&
                  !l.optionsPropsRef.value.static &&
                  u.stopPropagation(),
                l.closeCombobox()
              break
            case Fe.Tab:
              if (l.comboboxState.value !== 0) return
              l.selectActiveOption(), l.closeCombobox()
              break
          }
        }

        function a(u) {
          t('change', u)
        }

        function f(u) {
          l.openCombobox(), t('change', u)
        }
        return () => {
          var u, p, m, y, P, K
          let W = {
              open: l.comboboxState.value === 0,
            },
            te = {
              'aria-controls': (u = l.optionsRef.value) == null ? void 0 : u.id,
              'aria-expanded': l.disabled
                ? void 0
                : l.comboboxState.value === 0,
              'aria-activedescendant':
                l.activeOptionIndex.value === null ||
                (p = l.options.value[l.activeOptionIndex.value]) == null
                  ? void 0
                  : p.id,
              'aria-multiselectable': l.mode.value === 1 ? !0 : void 0,
              'aria-labelledby':
                (P = (m = ve(l.labelRef)) == null ? void 0 : m.id) != null
                  ? P
                  : (y = ve(l.buttonRef)) == null
                  ? void 0
                  : y.id,
              id: s,
              onKeydown: i,
              onChange: a,
              onInput: f,
              role: 'combobox',
              type: (K = n.type) != null ? K : 'text',
              tabIndex: 0,
              ref: l.inputRef,
            },
            U = yn(e, ['displayValue'])
          return Ce({
            props: Q(Q({}, U), te),
            slot: W,
            attrs: n,
            slots: r,
            features: Ot.RenderStrategy | Ot.Static,
            name: 'ComboboxInput',
          })
        }
      },
    }),
    cu = we({
      name: 'ComboboxOptions',
      props: {
        as: {
          type: [Object, String],
          default: 'ul',
        },
        static: {
          type: Boolean,
          default: !1,
        },
        unmount: {
          type: Boolean,
          default: !0,
        },
        hold: {
          type: [Boolean],
          default: !1,
        },
      },
      setup(e, { attrs: t, slots: n, expose: r }) {
        let o = tn('ComboboxOptions'),
          l = `headlessui-combobox-options-${He()}`
        r({
          el: o.optionsRef,
          $el: o.optionsRef,
        }),
          Ne(() => {
            o.optionsPropsRef.value.static = e.static
          }),
          Ne(() => {
            o.optionsPropsRef.value.hold = e.hold
          })
        let s = rr(),
          i = ne(() =>
            s !== null ? s.value === it.Open : o.comboboxState.value === 0
          )
        return (
          Xa({
            container: ne(() => ve(o.optionsRef)),
            enabled: ne(() => o.comboboxState.value === 0),
            accept(a) {
              return a.getAttribute('role') === 'option'
                ? NodeFilter.FILTER_REJECT
                : a.hasAttribute('role')
                ? NodeFilter.FILTER_SKIP
                : NodeFilter.FILTER_ACCEPT
            },
            walk(a) {
              a.setAttribute('role', 'none')
            },
          }),
          () => {
            var a, f, u, p
            let m = {
                open: o.comboboxState.value === 0,
              },
              y = {
                'aria-activedescendant':
                  o.activeOptionIndex.value === null ||
                  (a = o.options.value[o.activeOptionIndex.value]) == null
                    ? void 0
                    : a.id,
                'aria-labelledby':
                  (p = (f = ve(o.labelRef)) == null ? void 0 : f.id) != null
                    ? p
                    : (u = ve(o.buttonRef)) == null
                    ? void 0
                    : u.id,
                id: l,
                ref: o.optionsRef,
                role: 'listbox',
              },
              P = yn(e, ['hold'])
            return Ce({
              props: Q(Q({}, P), y),
              slot: m,
              attrs: t,
              slots: n,
              features: Ot.RenderStrategy | Ot.Static,
              visible: i.value,
              name: 'ComboboxOptions',
            })
          }
        )
      },
    }),
    fu = we({
      name: 'ComboboxOption',
      props: {
        as: {
          type: [Object, String],
          default: 'li',
        },
        value: {
          type: [Object, String, Number, Boolean],
        },
        disabled: {
          type: Boolean,
          default: !1,
        },
      },
      setup(e, { slots: t, attrs: n, expose: r }) {
        let o = tn('ComboboxOption'),
          l = `headlessui-combobox-option-${He()}`,
          s = X(null)
        r({
          el: s,
          $el: s,
        })
        let i = ne(() =>
            o.activeOptionIndex.value !== null
              ? o.options.value[o.activeOptionIndex.value].id === l
              : !1
          ),
          a = ne(() =>
            Oe(o.mode.value, {
              [0]: () => o.compare(q(o.value.value), q(e.value)),
              [1]: () =>
                q(o.value.value).some((P) => o.compare(q(P), q(e.value))),
            })
          ),
          f = ne(() => ({
            disabled: e.disabled,
            value: e.value,
            domRef: s,
          }))
        Le(() => o.registerOption(l, f)),
          vt(() => o.unregisterOption(l)),
          Ne(() => {
            o.comboboxState.value === 0 &&
              (!i.value ||
                (o.activationTrigger.value !== 0 &&
                  lt(() => {
                    var P, K
                    return (K =
                      (P = ve(s)) == null ? void 0 : P.scrollIntoView) == null
                      ? void 0
                      : K.call(P, {
                          block: 'nearest',
                        })
                  })))
          })

        function u(P) {
          if (e.disabled) return P.preventDefault()
          o.selectOption(l),
            o.mode.value === 0 &&
              (o.closeCombobox(),
              lt(() => {
                var K
                return (K = ve(o.inputRef)) == null
                  ? void 0
                  : K.focus({
                      preventScroll: !0,
                    })
              }))
        }

        function p() {
          if (e.disabled) return o.goToOption(ke.Nothing)
          o.goToOption(ke.Specific, l)
        }

        function m() {
          e.disabled || i.value || o.goToOption(ke.Specific, l, 0)
        }

        function y() {
          e.disabled ||
            !i.value ||
            o.optionsPropsRef.value.hold ||
            o.goToOption(ke.Nothing)
        }
        return () => {
          let { disabled: P } = e,
            K = {
              active: i.value,
              selected: a.value,
              disabled: P,
            },
            W = {
              id: l,
              ref: s,
              role: 'option',
              tabIndex: P === !0 ? void 0 : -1,
              'aria-disabled': P === !0 ? !0 : void 0,
              'aria-selected': a.value === !0 ? a.value : void 0,
              disabled: void 0,
              onClick: u,
              onFocus: p,
              onPointermove: m,
              onMousemove: m,
              onPointerleave: y,
              onMouseleave: y,
            }
          return Ce({
            props: Q(Q({}, e), W),
            slot: K,
            attrs: n,
            slots: t,
            name: 'ComboboxOption',
          })
        }
      },
    })
  var Pr = ((e) => (
    (e[(e.Forwards = 0)] = 'Forwards'), (e[(e.Backwards = 1)] = 'Backwards'), e
  ))(Pr || {})

  function du() {
    let e = X(0)
    return (
      Fr('keydown', (t) => {
        t.key === 'Tab' && (e.value = t.shiftKey ? 1 : 0)
      }),
      e
    )
  }

  function ts(e, t, n, r) {
    typeof window != 'undefined' &&
      Ne((o) => {
        ;(e = e != null ? e : window),
          e.addEventListener(t, n, r),
          o(() => e.removeEventListener(t, n, r))
      })
  }
  var ns = ((e) => (
    (e[(e.None = 1)] = 'None'),
    (e[(e.InitialFocus = 2)] = 'InitialFocus'),
    (e[(e.TabLock = 4)] = 'TabLock'),
    (e[(e.FocusLock = 8)] = 'FocusLock'),
    (e[(e.RestoreFocus = 16)] = 'RestoreFocus'),
    (e[(e.All = 30)] = 'All'),
    e
  ))(ns || {})
  let on = Object.assign(
    we({
      name: 'FocusTrap',
      props: {
        as: {
          type: [Object, String],
          default: 'div',
        },
        initialFocus: {
          type: Object,
          default: null,
        },
        features: {
          type: Number,
          default: 30,
        },
        containers: {
          type: Object,
          default: X(new Set()),
        },
      },
      inheritAttrs: !1,
      setup(e, { attrs: t, slots: n, expose: r }) {
        let o = X(null)
        r({
          el: o,
          $el: o,
        })
        let l = ne(() => en(o))
        pu(
          {
            ownerDocument: l,
          },
          ne(() => Boolean(e.features & 16))
        )
        let s = hu(
          {
            ownerDocument: l,
            container: o,
            initialFocus: ne(() => e.initialFocus),
          },
          ne(() => Boolean(e.features & 2))
        )
        vu(
          {
            ownerDocument: l,
            container: o,
            containers: e.containers,
            previousActiveElement: s,
          },
          ne(() => Boolean(e.features & 8))
        )
        let i = du()

        function a() {
          let f = ve(o)
          !f ||
            Oe(i.value, {
              [Pr.Forwards]: () => Ar(f, qn.First),
              [Pr.Backwards]: () => Ar(f, qn.Last),
            })
        }
        return () => {
          let f = {},
            u = {
              'data-hi': 'container',
              ref: o,
            },
            K = e,
            { features: p, initialFocus: m, containers: y } = K,
            P = et(K, ['features', 'initialFocus', 'containers'])
          return Ie(Re, [
            Boolean(p & 4) &&
              Ie(Wn, {
                as: 'button',
                type: 'button',
                onFocus: a,
                features: bn.Focusable,
              }),
            Ce({
              props: Q(Q(Q({}, t), P), u),
              slot: f,
              attrs: t,
              slots: n,
              name: 'FocusTrap',
            }),
            Boolean(p & 4) &&
              Ie(Wn, {
                as: 'button',
                type: 'button',
                onFocus: a,
                features: bn.Focusable,
              }),
          ])
        }
      },
    }),
    {
      features: ns,
    }
  )

  function pu({ ownerDocument: e }, t) {
    let n = X(null),
      r = {
        value: !1,
      }
    Le(() => {
      dt(
        t,
        (o, l) => {
          var s
          o !== l &&
            (!t.value ||
              ((r.value = !0),
              n.value ||
                (n.value = (s = e.value) == null ? void 0 : s.activeElement)))
        },
        {
          immediate: !0,
        }
      ),
        dt(
          t,
          (o, l, s) => {
            o !== l &&
              (!t.value ||
                s(() => {
                  r.value !== !1 &&
                    ((r.value = !1), dn(n.value), (n.value = null))
                }))
          },
          {
            immediate: !0,
          }
        )
    })
  }

  function hu({ ownerDocument: e, container: t, initialFocus: n }, r) {
    let o = X(null)
    return (
      Le(() => {
        dt(
          [t, n, r],
          (l, s) => {
            var i, a
            if (
              l.every((m, y) => (s == null ? void 0 : s[y]) === m) ||
              !r.value
            )
              return
            let f = ve(t)
            if (!f) return
            let u = ve(n),
              p = (i = e.value) == null ? void 0 : i.activeElement
            if (u) {
              if (u === p) {
                o.value = p
                return
              }
            } else if (f.contains(p)) {
              o.value = p
              return
            }
            u
              ? dn(u)
              : Ar(f, qn.First) === Vl.Error &&
                console.warn(
                  'There are no focusable elements inside the <FocusTrap />'
                ),
              (o.value = (a = e.value) == null ? void 0 : a.activeElement)
          },
          {
            immediate: !0,
            flush: 'post',
          }
        )
      }),
      o
    )
  }

  function vu(
    { ownerDocument: e, container: t, containers: n, previousActiveElement: r },
    o
  ) {
    var l
    ts(
      (l = e.value) == null ? void 0 : l.defaultView,
      'focus',
      (s) => {
        if (!o.value) return
        let i = new Set(n == null ? void 0 : n.value)
        i.add(t)
        let a = r.value
        if (!a) return
        let f = s.target
        f && f instanceof HTMLElement
          ? mu(i, f)
            ? ((r.value = f), dn(f))
            : (s.preventDefault(), s.stopPropagation(), dn(a))
          : dn(r.value)
      },
      !0
    )
  }

  function mu(e, t) {
    var n
    for (let r of e) if ((n = r.value) != null && n.contains(t)) return !0
    return !1
  }
  let Wo = 'body > *',
    Ht = new Set(),
    xt = new Map()

  function zo(e) {
    e.setAttribute('aria-hidden', 'true'), (e.inert = !0)
  }

  function Vo(e) {
    let t = xt.get(e)
    !t ||
      (t['aria-hidden'] === null
        ? e.removeAttribute('aria-hidden')
        : e.setAttribute('aria-hidden', t['aria-hidden']),
      (e.inert = t.inert))
  }

  function gu(e, t = X(!0)) {
    Ne((n) => {
      if (!t.value || !e.value) return
      let r = e.value,
        o = en(r)
      if (o) {
        Ht.add(r)
        for (let l of xt.keys()) l.contains(r) && (Vo(l), xt.delete(l))
        o.querySelectorAll(Wo).forEach((l) => {
          if (l instanceof HTMLElement) {
            for (let s of Ht) if (l.contains(s)) return
            Ht.size === 1 &&
              (xt.set(l, {
                'aria-hidden': l.getAttribute('aria-hidden'),
                inert: l.inert,
              }),
              zo(l))
          }
        }),
          n(() => {
            if ((Ht.delete(r), Ht.size > 0))
              o.querySelectorAll(Wo).forEach((l) => {
                if (l instanceof HTMLElement && !xt.has(l)) {
                  for (let s of Ht) if (l.contains(s)) return
                  xt.set(l, {
                    'aria-hidden': l.getAttribute('aria-hidden'),
                    inert: l.inert,
                  }),
                    zo(l)
                }
              })
            else for (let l of xt.keys()) Vo(l), xt.delete(l)
          })
      }
    })
  }
  let rs = Symbol('ForcePortalRootContext')

  function bu() {
    return $e(rs, !1)
  }
  let Rr = we({
    name: 'ForcePortalRoot',
    props: {
      as: {
        type: [Object, String],
        default: 'template',
      },
      force: {
        type: Boolean,
        default: !1,
      },
    },
    setup(e, { slots: t, attrs: n }) {
      return (
        Ze(rs, e.force),
        () => {
          let l = e,
            o = et(l, ['force'])
          return Ce({
            props: o,
            slot: {},
            slots: t,
            attrs: n,
            name: 'ForcePortalRoot',
          })
        }
      )
    },
  })

  function xu(e) {
    let t = en(e)
    if (!t) {
      if (e === null) return null
      throw new Error(
        `[Headless UI]: Cannot find ownerDocument for contextElement: ${e}`
      )
    }
    let n = t.getElementById('headlessui-portal-root')
    if (n) return n
    let r = t.createElement('div')
    return r.setAttribute('id', 'headlessui-portal-root'), t.body.appendChild(r)
  }
  let os = we({
      name: 'Portal',
      props: {
        as: {
          type: [Object, String],
          default: 'div',
        },
      },
      setup(e, { slots: t, attrs: n }) {
        let r = X(null),
          o = ne(() => en(r)),
          l = bu(),
          s = $e(ls, null),
          i = X(l === !0 || s == null ? xu(r.value) : s.resolveTarget())
        return (
          Ne(() => {
            l || (s != null && (i.value = s.resolveTarget()))
          }),
          vt(() => {
            var a, f
            let u =
              (a = o.value) == null
                ? void 0
                : a.getElementById('headlessui-portal-root')
            !u ||
              (i.value === u &&
                i.value.children.length <= 0 &&
                ((f = i.value.parentElement) == null || f.removeChild(i.value)))
          }),
          () => {
            if (i.value === null) return null
            let a = {
              ref: r,
            }
            return Ie(
              Gi,
              {
                to: i.value,
              },
              Ce({
                props: Q(Q({}, e), a),
                slot: {},
                attrs: n,
                slots: t,
                name: 'Portal',
              })
            )
          }
        )
      },
    }),
    ls = Symbol('PortalGroupContext'),
    yu = we({
      name: 'PortalGroup',
      props: {
        as: {
          type: [Object, String],
          default: 'template',
        },
        target: {
          type: Object,
          default: null,
        },
      },
      setup(e, { attrs: t, slots: n }) {
        let r = xn({
          resolveTarget() {
            return e.target
          },
        })
        return (
          Ze(ls, r),
          () => {
            let s = e,
              l = et(s, ['target'])
            return Ce({
              props: l,
              slot: {},
              attrs: t,
              slots: n,
              name: 'PortalGroup',
            })
          }
        )
      },
    }),
    ss = Symbol('StackContext')
  var kr = ((e) => (
    (e[(e.Add = 0)] = 'Add'), (e[(e.Remove = 1)] = 'Remove'), e
  ))(kr || {})

  function _u() {
    return $e(ss, () => {})
  }

  function wu({ type: e, element: t, onUpdate: n }) {
    let r = _u()

    function o(...l) {
      n == null || n(...l), r(...l)
    }
    Le(() => {
      o(0, e, t),
        vt(() => {
          o(1, e, t)
        })
    }),
      Ze(ss, o)
  }
  let is = Symbol('DescriptionContext')

  function Cu() {
    let e = $e(is, null)
    if (e === null) throw new Error('Missing parent')
    return e
  }

  function Eu({
    slot: e = X({}),
    name: t = 'Description',
    props: n = {},
  } = {}) {
    let r = X([])

    function o(l) {
      return (
        r.value.push(l),
        () => {
          let s = r.value.indexOf(l)
          s !== -1 && r.value.splice(s, 1)
        }
      )
    }
    return (
      Ze(is, {
        register: o,
        slot: e,
        name: t,
        props: n,
      }),
      ne(() => (r.value.length > 0 ? r.value.join(' ') : void 0))
    )
  }
  we({
    name: 'Description',
    props: {
      as: {
        type: [Object, String],
        default: 'p',
      },
    },
    setup(e, { attrs: t, slots: n }) {
      let r = Cu(),
        o = `headlessui-description-${He()}`
      return (
        Le(() => vt(r.register(o))),
        () => {
          let { name: l = 'Description', slot: s = X({}), props: i = {} } = r,
            a = e,
            f = ze(
              Q(
                {},
                Object.entries(i).reduce(
                  (u, [p, m]) =>
                    Object.assign(u, {
                      [p]: $n(m),
                    }),
                  {}
                )
              ),
              {
                id: o,
              }
            )
          return Ce({
            props: Q(Q({}, a), f),
            slot: s.value,
            attrs: t,
            slots: n,
            name: l,
          })
        }
      )
    },
  })
  var Ou = ((e) => (
    (e[(e.Open = 0)] = 'Open'), (e[(e.Closed = 1)] = 'Closed'), e
  ))(Ou || {})
  let Lr = Symbol('DialogContext')

  function _n(e) {
    let t = $e(Lr, null)
    if (t === null) {
      let n = new Error(`<${e} /> is missing a parent <Dialog /> component.`)
      throw (Error.captureStackTrace && Error.captureStackTrace(n, _n), n)
    }
    return t
  }
  let An = 'DC8F892D-2EBD-447C-A4C8-A03058436FF4',
    Tu = we({
      name: 'Dialog',
      inheritAttrs: !1,
      props: {
        as: {
          type: [Object, String],
          default: 'div',
        },
        static: {
          type: Boolean,
          default: !1,
        },
        unmount: {
          type: Boolean,
          default: !0,
        },
        open: {
          type: [Boolean, String],
          default: An,
        },
        initialFocus: {
          type: Object,
          default: null,
        },
      },
      emits: {
        close: (e) => !0,
      },
      setup(e, { emit: t, attrs: n, slots: r, expose: o }) {
        var l
        let s = X(0),
          i = rr(),
          a = ne(() =>
            e.open === An && i !== null
              ? Oe(i.value, {
                  [it.Open]: !0,
                  [it.Closed]: !1,
                })
              : e.open
          ),
          f = X(new Set()),
          u = X(null),
          p = X(null),
          m = ne(() => en(u))
        if (
          (o({
            el: u,
            $el: u,
          }),
          !(e.open !== An || i !== null))
        )
          throw new Error(
            'You forgot to provide an `open` prop to the `Dialog`.'
          )
        if (typeof a.value != 'boolean')
          throw new Error(
            `You provided an \`open\` prop to the \`Dialog\`, but the value is not a boolean. Received: ${
              a.value === An ? void 0 : e.open
            }`
          )
        let y = ne(() => (a.value ? 0 : 1)),
          P = ne(() => y.value === 0),
          K = ne(() => s.value > 1),
          W = $e(Lr, null) !== null,
          te = ne(() => (K.value ? 'parent' : 'leaf'))
        gu(
          u,
          ne(() => (K.value ? P.value : !1))
        ),
          wu({
            type: 'Dialog',
            element: u,
            onUpdate: (S, D, H) => {
              if (D === 'Dialog')
                return Oe(S, {
                  [kr.Add]() {
                    f.value.add(H), (s.value += 1)
                  },
                  [kr.Remove]() {
                    f.value.delete(H), (s.value -= 1)
                  },
                })
            },
          })
        let U = Eu({
            name: 'DialogDescription',
            slot: ne(() => ({
              open: a.value,
            })),
          }),
          pe = `headlessui-dialog-${He()}`,
          L = X(null),
          $ = {
            titleId: L,
            panelRef: X(null),
            dialogState: y,
            setTitleId(S) {
              L.value !== S && (L.value = S)
            },
            close() {
              t('close', !1)
            },
          }
        Ze(Lr, $),
          Xl(
            () => {
              var S, D, H
              return [
                ...Array.from(
                  (D =
                    (S = m.value) == null
                      ? void 0
                      : S.querySelectorAll('body > *')) != null
                    ? D
                    : []
                ).filter(
                  (z) =>
                    !(
                      !(z instanceof HTMLElement) ||
                      z.contains(ve(p)) ||
                      ($.panelRef.value && z.contains($.panelRef.value))
                    )
                ),
                (H = $.panelRef.value) != null ? H : u.value,
              ]
            },
            (S, D) => {
              y.value === 0 &&
                (K.value ||
                  ($.close(), lt(() => (D == null ? void 0 : D.focus()))))
            },
            Jl.IgnoreScrollbars
          ),
          ts((l = m.value) == null ? void 0 : l.defaultView, 'keydown', (S) => {
            S.defaultPrevented ||
              (S.key === Fe.Escape &&
                y.value === 0 &&
                (K.value ||
                  (S.preventDefault(), S.stopPropagation(), $.close())))
          }),
          Ne((S) => {
            var D
            if (y.value !== 0 || W) return
            let H = m.value
            if (!H) return
            let z = H == null ? void 0 : H.documentElement,
              ie = (D = H.defaultView) != null ? D : window,
              ee = z.style.overflow,
              at = z.style.paddingRight,
              Te = ie.innerWidth - z.clientWidth
            if (((z.style.overflow = 'hidden'), Te > 0)) {
              let I = z.clientWidth - z.offsetWidth,
                v = Te - I
              z.style.paddingRight = `${v}px`
            }
            S(() => {
              ;(z.style.overflow = ee), (z.style.paddingRight = at)
            })
          }),
          Ne((S) => {
            if (y.value !== 0) return
            let D = ve(u)
            if (!D) return
            let H = new IntersectionObserver((z) => {
              for (let ie of z)
                ie.boundingClientRect.x === 0 &&
                  ie.boundingClientRect.y === 0 &&
                  ie.boundingClientRect.width === 0 &&
                  ie.boundingClientRect.height === 0 &&
                  $.close()
            })
            H.observe(D), S(() => H.disconnect())
          })

        function Y(S) {
          S.stopPropagation()
        }
        return () => {
          let S = ze(Q({}, n), {
              ref: u,
              id: pe,
              role: 'dialog',
              'aria-modal': y.value === 0 ? !0 : void 0,
              'aria-labelledby': L.value,
              'aria-describedby': U.value,
              onClick: Y,
            }),
            ee = e,
            { open: D, initialFocus: H } = ee,
            z = et(ee, ['open', 'initialFocus']),
            ie = {
              open: y.value === 0,
            }
          return Ie(
            Rr,
            {
              force: !0,
            },
            () => [
              Ie(os, () =>
                Ie(
                  yu,
                  {
                    target: u.value,
                  },
                  () =>
                    Ie(
                      Rr,
                      {
                        force: !1,
                      },
                      () =>
                        Ie(
                          on,
                          {
                            initialFocus: H,
                            containers: f,
                            features: P.value
                              ? Oe(te.value, {
                                  parent: on.features.RestoreFocus,
                                  leaf:
                                    on.features.All & ~on.features.FocusLock,
                                })
                              : on.features.None,
                          },
                          () =>
                            Ce({
                              props: Q(Q({}, z), S),
                              slot: ie,
                              attrs: n,
                              slots: r,
                              visible: y.value === 0,
                              features: Ot.RenderStrategy | Ot.Static,
                              name: 'Dialog',
                            })
                        )
                    )
                )
              ),
              Ie(Wn, {
                features: bn.Hidden,
                ref: p,
              }),
            ]
          )
        }
      },
    })
  we({
    name: 'DialogOverlay',
    props: {
      as: {
        type: [Object, String],
        default: 'div',
      },
    },
    setup(e, { attrs: t, slots: n }) {
      let r = _n('DialogOverlay'),
        o = `headlessui-dialog-overlay-${He()}`

      function l(s) {
        s.target === s.currentTarget &&
          (s.preventDefault(), s.stopPropagation(), r.close())
      }
      return () =>
        Ce({
          props: ze(Q({}, e), {
            id: o,
            'aria-hidden': !0,
            onClick: l,
          }),
          slot: {
            open: r.dialogState.value === 0,
          },
          attrs: t,
          slots: n,
          name: 'DialogOverlay',
        })
    },
  })
  we({
    name: 'DialogBackdrop',
    props: {
      as: {
        type: [Object, String],
        default: 'div',
      },
    },
    inheritAttrs: !1,
    setup(e, { attrs: t, slots: n, expose: r }) {
      let o = _n('DialogBackdrop'),
        l = `headlessui-dialog-backdrop-${He()}`,
        s = X(null)
      return (
        r({
          el: s,
          $el: s,
        }),
        Le(() => {
          if (o.panelRef.value === null)
            throw new Error(
              'A <DialogBackdrop /> component is being used, but a <DialogPanel /> component is missing.'
            )
        }),
        () => {
          let i = e,
            a = {
              id: l,
              ref: s,
              'aria-hidden': !0,
            }
          return Ie(
            Rr,
            {
              force: !0,
            },
            () =>
              Ie(os, () =>
                Ce({
                  props: Q(Q(Q({}, t), i), a),
                  slot: {
                    open: o.dialogState.value === 0,
                  },
                  attrs: t,
                  slots: n,
                  name: 'DialogBackdrop',
                })
              )
          )
        }
      )
    },
  })
  let Iu = we({
    name: 'DialogPanel',
    props: {
      as: {
        type: [Object, String],
        default: 'div',
      },
    },
    setup(e, { attrs: t, slots: n, expose: r }) {
      let o = _n('DialogPanel'),
        l = `headlessui-dialog-panel-${He()}`
      return (
        r({
          el: o.panelRef,
          $el: o.panelRef,
        }),
        () => {
          let s = {
            id: l,
            ref: o.panelRef,
          }
          return Ce({
            props: Q(Q({}, e), s),
            slot: {
              open: o.dialogState.value === 0,
            },
            attrs: t,
            slots: n,
            name: 'DialogPanel',
          })
        }
      )
    },
  })
  we({
    name: 'DialogTitle',
    props: {
      as: {
        type: [Object, String],
        default: 'h2',
      },
    },
    setup(e, { attrs: t, slots: n }) {
      let r = _n('DialogTitle'),
        o = `headlessui-dialog-title-${He()}`
      return (
        Le(() => {
          r.setTitleId(o), vt(() => r.setTitleId(null))
        }),
        () =>
          Ce({
            props: ze(Q({}, e), {
              id: o,
            }),
            slot: {
              open: r.dialogState.value === 0,
            },
            attrs: t,
            slots: n,
            name: 'DialogTitle',
          })
      )
    },
  })

  function Su(e) {
    let t = {
      called: !1,
    }
    return (...n) => {
      if (!t.called) return (t.called = !0), e(...n)
    }
  }

  function as() {
    let e = [],
      t = [],
      n = {
        enqueue(r) {
          t.push(r)
        },
        requestAnimationFrame(...r) {
          let o = requestAnimationFrame(...r)
          n.add(() => cancelAnimationFrame(o))
        },
        nextFrame(...r) {
          n.requestAnimationFrame(() => {
            n.requestAnimationFrame(...r)
          })
        },
        setTimeout(...r) {
          let o = setTimeout(...r)
          n.add(() => clearTimeout(o))
        },
        add(r) {
          e.push(r)
        },
        dispose() {
          for (let r of e.splice(0)) r()
        },
        async workQueue() {
          for (let r of t.splice(0)) await r()
        },
      }
    return n
  }

  function fr(e, ...t) {
    e && t.length > 0 && e.classList.add(...t)
  }

  function Fn(e, ...t) {
    e && t.length > 0 && e.classList.remove(...t)
  }
  var Dr = ((e) => ((e.Finished = 'finished'), (e.Cancelled = 'cancelled'), e))(
    Dr || {}
  )

  function Au(e, t) {
    let n = as()
    if (!e) return n.dispose
    let { transitionDuration: r, transitionDelay: o } = getComputedStyle(e),
      [l, s] = [r, o].map((i) => {
        let [a = 0] = i
          .split(',')
          .filter(Boolean)
          .map((f) => (f.includes('ms') ? parseFloat(f) : parseFloat(f) * 1e3))
          .sort((f, u) => u - f)
        return a
      })
    return (
      l !== 0 ? n.setTimeout(() => t('finished'), l + s) : t('finished'),
      n.add(() => t('cancelled')),
      n.dispose
    )
  }

  function Yo(e, t, n, r, o, l) {
    let s = as(),
      i = l !== void 0 ? Su(l) : () => {}
    return (
      Fn(e, ...o),
      fr(e, ...t, ...n),
      s.nextFrame(() => {
        Fn(e, ...n),
          fr(e, ...r),
          s.add(Au(e, (a) => (Fn(e, ...r, ...t), fr(e, ...o), i(a))))
      }),
      s.add(() => Fn(e, ...t, ...n, ...r, ...o)),
      s.add(() => i('cancelled')),
      s.dispose
    )
  }

  function St(e = '') {
    return e.split(' ').filter((t) => t.trim().length > 1)
  }
  let oo = Symbol('TransitionContext')
  var Fu = ((e) => ((e.Visible = 'visible'), (e.Hidden = 'hidden'), e))(
    Fu || {}
  )

  function Pu() {
    return $e(oo, null) !== null
  }

  function Ru() {
    let e = $e(oo, null)
    if (e === null)
      throw new Error(
        'A <TransitionChild /> is used but it is missing a parent <TransitionRoot />.'
      )
    return e
  }

  function ku() {
    let e = $e(lo, null)
    if (e === null)
      throw new Error(
        'A <TransitionChild /> is used but it is missing a parent <TransitionRoot />.'
      )
    return e
  }
  let lo = Symbol('NestingContext')

  function or(e) {
    return 'children' in e
      ? or(e.children)
      : e.value.filter(({ state: t }) => t === 'visible').length > 0
  }

  function us(e) {
    let t = X([]),
      n = X(!1)
    Le(() => (n.value = !0)), vt(() => (n.value = !1))

    function r(l, s = _t.Hidden) {
      let i = t.value.findIndex(({ id: a }) => a === l)
      i !== -1 &&
        (Oe(s, {
          [_t.Unmount]() {
            t.value.splice(i, 1)
          },
          [_t.Hidden]() {
            t.value[i].state = 'hidden'
          },
        }),
        !or(t) && n.value && (e == null || e()))
    }

    function o(l) {
      let s = t.value.find(({ id: i }) => i === l)
      return (
        s
          ? s.state !== 'visible' && (s.state = 'visible')
          : t.value.push({
              id: l,
              state: 'visible',
            }),
        () => r(l, _t.Unmount)
      )
    }
    return {
      children: t,
      register: o,
      unregister: r,
    }
  }
  let cs = Ot.RenderStrategy,
    fs = we({
      props: {
        as: {
          type: [Object, String],
          default: 'div',
        },
        show: {
          type: [Boolean],
          default: null,
        },
        unmount: {
          type: [Boolean],
          default: !0,
        },
        appear: {
          type: [Boolean],
          default: !1,
        },
        enter: {
          type: [String],
          default: '',
        },
        enterFrom: {
          type: [String],
          default: '',
        },
        enterTo: {
          type: [String],
          default: '',
        },
        entered: {
          type: [String],
          default: '',
        },
        leave: {
          type: [String],
          default: '',
        },
        leaveFrom: {
          type: [String],
          default: '',
        },
        leaveTo: {
          type: [String],
          default: '',
        },
      },
      emits: {
        beforeEnter: () => !0,
        afterEnter: () => !0,
        beforeLeave: () => !0,
        afterLeave: () => !0,
      },
      setup(e, { emit: t, attrs: n, slots: r, expose: o }) {
        if (!Pu() && Ya())
          return () =>
            Ie(
              ds,
              ze(Q({}, e), {
                onBeforeEnter: () => t('beforeEnter'),
                onAfterEnter: () => t('afterEnter'),
                onBeforeLeave: () => t('beforeLeave'),
                onAfterLeave: () => t('afterLeave'),
              }),
              r
            )
        let l = X(null),
          s = X('visible'),
          i = ne(() => (e.unmount ? _t.Unmount : _t.Hidden))
        o({
          el: l,
          $el: l,
        })
        let { show: a, appear: f } = Ru(),
          { register: u, unregister: p } = ku(),
          m = {
            value: !0,
          },
          y = He(),
          P = {
            value: !1,
          },
          K = us(() => {
            P.value || ((s.value = 'hidden'), p(y), t('afterLeave'))
          })
        Le(() => {
          let D = u(y)
          vt(D)
        }),
          Ne(() => {
            if (i.value === _t.Hidden && !!y) {
              if (a && s.value !== 'visible') {
                s.value = 'visible'
                return
              }
              Oe(s.value, {
                hidden: () => p(y),
                visible: () => u(y),
              })
            }
          })
        let W = St(e.enter),
          te = St(e.enterFrom),
          U = St(e.enterTo),
          pe = St(e.entered),
          L = St(e.leave),
          $ = St(e.leaveFrom),
          Y = St(e.leaveTo)
        Le(() => {
          Ne(() => {
            if (s.value === 'visible') {
              let D = ve(l)
              if (D instanceof Comment && D.data === '')
                throw new Error(
                  'Did you forget to passthrough the `ref` to the actual DOM node?'
                )
            }
          })
        })

        function S(D) {
          let H = m.value && !f.value,
            z = ve(l)
          !z ||
            !(z instanceof HTMLElement) ||
            H ||
            ((P.value = !0),
            a.value && t('beforeEnter'),
            a.value || t('beforeLeave'),
            D(
              a.value
                ? Yo(z, W, te, U, pe, (ie) => {
                    ;(P.value = !1), ie === Dr.Finished && t('afterEnter')
                  })
                : Yo(z, L, $, Y, pe, (ie) => {
                    ;(P.value = !1),
                      ie === Dr.Finished &&
                        (or(K) || ((s.value = 'hidden'), p(y), t('afterLeave')))
                  })
            ))
        }
        return (
          Le(() => {
            dt(
              [a],
              (D, H, z) => {
                S(z), (m.value = !1)
              },
              {
                immediate: !0,
              }
            )
          }),
          Ze(lo, K),
          zl(
            ne(() =>
              Oe(s.value, {
                visible: it.Open,
                hidden: it.Closed,
              })
            )
          ),
          () => {
            let x = e,
              _ = et(x, [
                'appear',
                'show',
                'enter',
                'enterFrom',
                'enterTo',
                'entered',
                'leave',
                'leaveFrom',
                'leaveTo',
              ])
            return Ce({
              props: ze(Q({}, _), {
                ref: l,
              }),
              slot: {},
              slots: r,
              attrs: n,
              features: cs,
              visible: s.value === 'visible',
              name: 'TransitionChild',
            })
          }
        )
      },
    }),
    Lu = fs,
    ds = we({
      inheritAttrs: !1,
      props: {
        as: {
          type: [Object, String],
          default: 'div',
        },
        show: {
          type: [Boolean],
          default: null,
        },
        unmount: {
          type: [Boolean],
          default: !0,
        },
        appear: {
          type: [Boolean],
          default: !1,
        },
        enter: {
          type: [String],
          default: '',
        },
        enterFrom: {
          type: [String],
          default: '',
        },
        enterTo: {
          type: [String],
          default: '',
        },
        entered: {
          type: [String],
          default: '',
        },
        leave: {
          type: [String],
          default: '',
        },
        leaveFrom: {
          type: [String],
          default: '',
        },
        leaveTo: {
          type: [String],
          default: '',
        },
      },
      emits: {
        beforeEnter: () => !0,
        afterEnter: () => !0,
        beforeLeave: () => !0,
        afterLeave: () => !0,
      },
      setup(e, { emit: t, attrs: n, slots: r }) {
        let o = rr(),
          l = ne(() =>
            e.show === null && o !== null
              ? Oe(o.value, {
                  [it.Open]: !0,
                  [it.Closed]: !1,
                })
              : e.show
          )
        Ne(() => {
          if (![!0, !1].includes(l.value))
            throw new Error(
              'A <Transition /> is used but it is missing a `:show="true | false"` prop.'
            )
        })
        let s = X(l.value ? 'visible' : 'hidden'),
          i = us(() => {
            s.value = 'hidden'
          }),
          a = X(!0),
          f = {
            show: l,
            appear: ne(() => e.appear || !a.value),
          }
        return (
          Le(() => {
            Ne(() => {
              ;(a.value = !1),
                l.value ? (s.value = 'visible') : or(i) || (s.value = 'hidden')
            })
          }),
          Ze(lo, i),
          Ze(oo, f),
          () => {
            let u = yn(e, ['show', 'appear', 'unmount']),
              p = {
                unmount: e.unmount,
              }
            return Ce({
              props: ze(Q({}, p), {
                as: 'template',
              }),
              slot: {},
              slots: ze(Q({}, r), {
                default: () => [
                  Ie(
                    Lu,
                    Q(
                      Q(
                        Q(
                          {
                            onBeforeEnter: () => t('beforeEnter'),
                            onAfterEnter: () => t('afterEnter'),
                            onBeforeLeave: () => t('beforeLeave'),
                            onAfterLeave: () => t('afterLeave'),
                          },
                          n
                        ),
                        p
                      ),
                      u
                    ),
                    r.default
                  ),
                ],
              }),
              attrs: {},
              features: cs,
              visible: s.value === 'visible',
              name: 'Transition',
            })
          }
        )
      },
    })
  var so = (e, t) => {
    const n = e.__vccOpts || e
    for (const [r, o] of t) n[r] = o
    return n
  }
  const Du = {
      data() {
        return {
          baseUrl: 'https://www.singledispatch.com',
        }
      },
      methods: {
        recordTab() {
          this.$emit('close'),
            chrome.runtime.sendMessage({
              type: 'RECORD_TAB',
            })
        },
      },
    },
    Nu = {
      class: 'sd-p-8 sd-text-center',
    },
    Mu = Gt(' Please '),
    $u = ['href'],
    ju = Gt(' or '),
    Bu = ['href'],
    Uu = Gt(' to use the '),
    Hu = ce(
      'span',
      {
        class:
          'sd-font-bold leading-tight tracking-tight sd-bg-clisd-p-text sd-text-transparent sd-bg-gradient-to-r frosd-m-cyan-300 to-teal-300',
      },
      'Single Dispatch',
      -1
    ),
    Ku = Gt(' command palette. ')

  function qu(e, t, n, r, o, l) {
    return (
      ue(),
      Ee('div', Nu, [
        Mu,
        ce(
          'a',
          {
            href: `${o.baseUrl}/login`,
            target: '_blank',
            onClick:
              t[0] || (t[0] = (...s) => l.recordTab && l.recordTab(...s)),
            class:
              'sd-font-bold sd-text-cyan-300 visited:sd-text-cyan-300 focus:sd-px-2 focus:sd-py-1 focus:sd-mx-2 focus:sd-ring-cyan-100 focus:sd-outline-cyan-200',
          },
          'Log In',
          8,
          $u
        ),
        ju,
        ce(
          'a',
          {
            href: `${o.baseUrl}/register`,
            target: '_blank',
            onClick:
              t[1] || (t[1] = (...s) => l.recordTab && l.recordTab(...s)),
            class:
              'sd-font-bold sd-text-teal-300 visited:sd-text-teal-300 focus:sd-px-2 focus:sd-mx-2 focus:sd-py-1 focus:sd-ring-teal-100 focus:sd-outline-teal-200',
          },
          'Sign Up',
          8,
          Bu
        ),
        Uu,
        Hu,
        Ku,
      ])
    )
  }
  var Wu = so(Du, [['render', qu]])

  function zu(e, t) {
    return (
      ue(),
      Je(
        'svg',
        {
          xmlns: 'http://www.w3.org/2000/svg',
          viewBox: '0 0 20 20',
          fill: 'currentColor',
          'aria-hidden': 'true',
        },
        [
          xe('path', {
            'fill-rule': 'evenodd',
            d: 'M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z',
            'clip-rule': 'evenodd',
          }),
        ]
      )
    )
  }

  function Vu(e, t) {
    return (
      ue(),
      Je(
        'svg',
        {
          xmlns: 'http://www.w3.org/2000/svg',
          fill: 'none',
          viewBox: '0 0 24 24',
          'stroke-width': '2',
          stroke: 'currentColor',
          'aria-hidden': 'true',
        },
        [
          xe('path', {
            'stroke-linecap': 'round',
            'stroke-linejoin': 'round',
            d: 'M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z',
          }),
        ]
      )
    )
  }

  function Yu(e, t) {
    return (
      ue(),
      Je(
        'svg',
        {
          xmlns: 'http://www.w3.org/2000/svg',
          fill: 'none',
          viewBox: '0 0 24 24',
          'stroke-width': '2',
          stroke: 'currentColor',
          'aria-hidden': 'true',
        },
        [
          xe('path', {
            'stroke-linecap': 'round',
            'stroke-linejoin': 'round',
            d: 'M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122',
          }),
        ]
      )
    )
  }

  function Ju(e, t) {
    return (
      ue(),
      Je(
        'svg',
        {
          xmlns: 'http://www.w3.org/2000/svg',
          fill: 'none',
          viewBox: '0 0 24 24',
          'stroke-width': '2',
          stroke: 'currentColor',
          'aria-hidden': 'true',
        },
        [
          xe('path', {
            'stroke-linecap': 'round',
            'stroke-linejoin': 'round',
            d: 'M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9',
          }),
        ]
      )
    )
  }

  function Xu(e, t) {
    return (
      ue(),
      Je(
        'svg',
        {
          xmlns: 'http://www.w3.org/2000/svg',
          fill: 'none',
          viewBox: '0 0 24 24',
          'stroke-width': '2',
          stroke: 'currentColor',
          'aria-hidden': 'true',
        },
        [
          xe('path', {
            'stroke-linecap': 'round',
            'stroke-linejoin': 'round',
            d: 'M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1',
          }),
        ]
      )
    )
  }
  const Qu = {
      class: 'sd-px-6 sd-py-8',
    },
    Zu = {
      class: 'sd-text-lg sd-mx-2',
    },
    Gu = ['for'],
    ec = ['id', 'onUpdate:modelValue', 'onKeydown'],
    tc = {
      props: {
        form: Object,
        title: String,
      },
      emits: ['submit'],
      setup(e, { emit: t }) {
        const n = e,
          r = Object.keys(n.form).map((s) => {
            const i = n.form[s]
            return {
              name: s,
              type: i.type,
              value: i.default,
            }
          })
        Le(() => {
          document.getElementById(r[0].name).select()
        })

        function o() {
          r.length === 1 &&
            t(
              'submit',
              r.reduce(function (s, i) {
                return (s[i.name] = i.value), s
              }, {})
            )
        }

        function l() {
          t(
            'submit',
            r.reduce(function (s, i) {
              return (s[i.name] = i.value), s
            }, {})
          )
        }
        return (s, i) => (
          ue(),
          Ee('div', Qu, [
            ce('h2', Zu, Rt(e.title), 1),
            (ue(!0),
            Ee(
              Re,
              null,
              Ln(
                $n(r),
                (a) => (
                  ue(),
                  Ee(
                    'div',
                    {
                      id: 'command-form',
                      key: a.name,
                      class: 'sd-mt-3 sd-text-sm',
                    },
                    [
                      ce(
                        'label',
                        {
                          for: a.name,
                          class: 'sd-text-gray-200 sd-mx-2',
                        },
                        Rt(a.name),
                        9,
                        Gu
                      ),
                      qi(
                        ce(
                          'input',
                          {
                            id: a.name,
                            type: 'text',
                            'onUpdate:modelValue': (f) => (a.value = f),
                            onKeydown: Pt(o, ['enter']),
                            class:
                              'sd-transform sd-bg-gray-800 sd-shadow-2xl sd-transition-all sd-w-full sd-border-0 sd-m-0 sd-py-2 sd-px-3 rounded sd-text-gray-200 sd-placeholder-gray-500 focus:sd-ring-0 focus:sd-outline-none sm:sd-text-sm;',
                          },
                          null,
                          40,
                          ec
                        ),
                        [[Na, a.value]]
                      ),
                    ]
                  )
                )
              ),
              128
            )),
            $n(r).length > 1
              ? (ue(),
                Ee(
                  'button',
                  {
                    key: 0,
                    onClick: l,
                  },
                  'Run'
                ))
              : Ft('', !0),
          ])
        )
      },
    }

  function nc(e) {
    function t(r, o) {
      var l = new MouseEvent(o, {
        view: window,
        bubbles: !1,
        cancelable: !1,
      })
      return r.dispatchEvent(l)
    }

    function n(r) {
      ;['mouseover', 'mousedown', 'mouseup', 'mouseout'].forEach(function (o) {
        t(r, o)
      })
    }
    e.focus(), n(e)
  }

  function rc(e) {
    e.triggerElement
      ? e.triggerElement.click()
      : window.open(e.config.url, e.config.target ? e.config.target : '_self')
  }

  function oc(e) {
    const t = e.config.trigger.type,
      n = e.triggerElement
    if (t === 'click')
      n.click(),
        n.scrollIntoView({
          block: 'center',
          inline: 'center',
        })
    else if (t === 'simulatedClick')
      setTimeout(() => {
        nc(n),
          n.scrollIntoView({
            block: 'center',
            inline: 'center',
          })
      }, 200)
    else if (t === 'dblclick') {
      var r = new Event('dblclick')
      n.dispatchEvent(r)
    } else
      t === 'focus' &&
        setTimeout(() => {
          n.focus(),
            n.scrollIntoView({
              block: 'center',
              inline: 'center',
            })
        }, 200)
  }

  function lc(e) {
    if (e.type === 'link') return 'LinkIcon'
    if (e.type === 'element') {
      const t = e.config.trigger.type
      if ((t === 'click') | (t === 'simulatedClick')) return 'CursorClickIcon'
      if (t === 'open') return 'LinkIcon'
      if (t === 'focus') return 'AnnotationIcon'
    } else return 'GlobeAltIcon'
  }
  async function Nr(e) {
    e.type === 'element'
      ? oc(e)
      : e.type === 'link'
      ? rc(e)
      : e.type === 'chrome'
      ? await chrome.runtime.sendMessage({
          type: 'execute_chrome_command',
          command: e,
        })
      : e.type === 'callback' && e.callback(),
      e.config.next &&
        chrome.runtime.sendMessage({
          type: 'next_command',
          command: e.config.next,
        })
  }
  var sc =
      typeof globalThis != 'undefined'
        ? globalThis
        : typeof window != 'undefined'
        ? window
        : typeof global != 'undefined'
        ? global
        : typeof self != 'undefined'
        ? self
        : {},
    Dn = {
      exports: {},
    }
  ;(function (e) {
    ;((t, n) => {
      e.exports ? (e.exports = n()) : (t.fuzzysort = n())
    })(sc, (t) => {
      var n = (I, v) => {
          if (I == 'farzher')
            return {
              target: 'farzher was here (^-^*)/',
              score: 0,
              _indexes: [0],
            }
          if (!I || !v) return ee
          var _ = u(I)
          D(v) || (v = f(v))
          var x = _.bitflags
          return (x & v._bitflags) !== x ? ee : m(_, v)
        },
        r = (I, v, _) => {
          if (I == 'farzher')
            return [
              {
                target: 'farzher was here (^-^*)/',
                score: 0,
                _indexes: [0],
                obj: v ? v[0] : ee,
              },
            ]
          if (!I) return _ && _.all ? p(I, v, _) : ie
          var x = u(I),
            F = x.bitflags
          x.containsSpace
          var k = (_ && _.threshold) || z,
            R = (_ && _.limit) || H,
            T = 0,
            M = 0,
            V = v.length
          if (_ && _.key)
            for (var oe = _.key, se = 0; se < V; ++se) {
              var ge = v[se],
                ae = S(ge, oe)
              if (!!ae && (D(ae) || (ae = f(ae)), (F & ae._bitflags) === F)) {
                var he = m(x, ae)
                he !== ee &&
                  (he.score < k ||
                    ((he = {
                      target: he.target,
                      _targetLower: '',
                      _targetLowerCodes: ee,
                      _nextBeginningIndexes: ee,
                      _bitflags: 0,
                      score: he.score,
                      _indexes: he._indexes,
                      obj: ge,
                    }),
                    T < R
                      ? (Te.add(he), ++T)
                      : (++M, he.score > Te.peek().score && Te.replaceTop(he))))
              }
            }
          else if (_ && _.keys)
            for (
              var Ke = _.scoreFn || Y, mt = _.keys, qe = mt.length, se = 0;
              se < V;
              ++se
            ) {
              for (var ge = v[se], c = new Array(qe), d = 0; d < qe; ++d) {
                var oe = mt[d],
                  ae = S(ge, oe)
                if (!ae) {
                  c[d] = ee
                  continue
                }
                D(ae) || (ae = f(ae)),
                  (F & ae._bitflags) !== F ? (c[d] = ee) : (c[d] = m(x, ae))
              }
              c.obj = ge
              var h = Ke(c)
              h !== ee &&
                (h < k ||
                  ((c.score = h),
                  T < R
                    ? (Te.add(c), ++T)
                    : (++M, h > Te.peek().score && Te.replaceTop(c))))
            }
          else
            for (var se = 0; se < V; ++se) {
              var ae = v[se]
              if (!!ae && (D(ae) || (ae = f(ae)), (F & ae._bitflags) === F)) {
                var he = m(x, ae)
                he !== ee &&
                  (he.score < k ||
                    (T < R
                      ? (Te.add(he), ++T)
                      : (++M, he.score > Te.peek().score && Te.replaceTop(he))))
              }
            }
          if (T === 0) return ie
          for (var g = new Array(T), se = T - 1; se >= 0; --se)
            g[se] = Te.poll()
          return (g.total = T + M), g
        },
        o = (I, v, _) => {
          if (typeof v == 'function') return l(I, v)
          if (I === ee) return ee
          v === void 0 && (v = '<b>'), _ === void 0 && (_ = '</b>')
          var x = '',
            F = 0,
            k = !1,
            R = I.target,
            T = R.length,
            M = I._indexes
          M = M.slice(0, M.len).sort((se, ge) => se - ge)
          for (var V = 0; V < T; ++V) {
            var oe = R[V]
            if (M[F] === V) {
              if ((++F, k || ((k = !0), (x += v)), F === M.length)) {
                x += oe + _ + R.substr(V + 1)
                break
              }
            } else k && ((k = !1), (x += _))
            x += oe
          }
          return x
        },
        l = (V, v) => {
          if (V === ee) return ee
          var _ = V.target,
            x = _.length,
            F = V._indexes
          F = F.slice(0, F.len).sort((ge, ae) => ge - ae)
          for (var k = '', R = 0, T = 0, M = !1, V = [], oe = 0; oe < x; ++oe) {
            var se = _[oe]
            if (F[T] === oe) {
              if ((++T, M || ((M = !0), V.push(k), (k = '')), T === F.length)) {
                ;(k += se),
                  V.push(v(k, R++)),
                  (k = ''),
                  V.push(_.substr(oe + 1))
                break
              }
            } else M && ((M = !1), V.push(v(k, R++)), (k = ''))
            k += se
          }
          return V
        },
        s = (I) => I._indexes.slice(0, I._indexes.len).sort((v, _) => v - _),
        i = (I) => {
          typeof I != 'string' && (I = '')
          var v = P(I)
          return {
            target: I,
            _targetLower: v._lower,
            _targetLowerCodes: v.lowerCodes,
            _nextBeginningIndexes: ee,
            _bitflags: v.bitflags,
            score: ee,
            _indexes: [0],
            obj: ee,
          }
        },
        a = (I) => {
          typeof I != 'string' && (I = ''), (I = I.trim())
          var v = P(I),
            _ = []
          if (v.containsSpace) {
            var x = I.split(/\s+/)
            x = [...new Set(x)]
            for (var F = 0; F < x.length; F++)
              if (x[F] !== '') {
                var k = P(x[F])
                _.push({
                  lowerCodes: k.lowerCodes,
                  _lower: x[F].toLowerCase(),
                  containsSpace: !1,
                })
              }
          }
          return {
            lowerCodes: v.lowerCodes,
            bitflags: v.bitflags,
            containsSpace: v.containsSpace,
            _lower: v._lower,
            spaceSearches: _,
          }
        },
        f = (I) => {
          if (I.length > 999) return i(I)
          var v = U.get(I)
          return v !== void 0 || ((v = i(I)), U.set(I, v)), v
        },
        u = (I) => {
          if (I.length > 999) return a(I)
          var v = pe.get(I)
          return v !== void 0 || ((v = a(I)), pe.set(I, v)), v
        },
        p = (I, v, _) => {
          var x = []
          x.total = v.length
          var F = (_ && _.limit) || H
          if (_ && _.key)
            for (var k = 0; k < v.length; k++) {
              var R = v[k],
                T = S(R, _.key)
              if (!!T) {
                D(T) || (T = f(T)), (T.score = z), (T._indexes.len = 0)
                var M = T
                if (
                  ((M = {
                    target: M.target,
                    _targetLower: '',
                    _targetLowerCodes: ee,
                    _nextBeginningIndexes: ee,
                    _bitflags: 0,
                    score: T.score,
                    _indexes: ee,
                    obj: R,
                  }),
                  x.push(M),
                  x.length >= F)
                )
                  return x
              }
            }
          else if (_ && _.keys)
            for (var k = 0; k < v.length; k++) {
              for (
                var R = v[k],
                  V = new Array(_.keys.length),
                  oe = _.keys.length - 1;
                oe >= 0;
                --oe
              ) {
                var T = S(R, _.keys[oe])
                if (!T) {
                  V[oe] = ee
                  continue
                }
                D(T) || (T = f(T)),
                  (T.score = z),
                  (T._indexes.len = 0),
                  (V[oe] = T)
              }
              if (((V.obj = R), (V.score = z), x.push(V), x.length >= F))
                return x
            }
          else
            for (var k = 0; k < v.length; k++) {
              var T = v[k]
              if (
                !!T &&
                (D(T) || (T = f(T)),
                (T.score = z),
                (T._indexes.len = 0),
                x.push(T),
                x.length >= F)
              )
                return x
            }
          return x
        },
        m = (I, v) => {
          if (I.containsSpace) return y(I, v)
          for (
            var _ = I._lower,
              x = I.lowerCodes,
              F = x[0],
              k = v._targetLowerCodes,
              R = x.length,
              T = k.length,
              se = 0,
              M = 0,
              V = 0;
            ;

          ) {
            var oe = F === k[M]
            if (oe) {
              if (((L[V++] = M), ++se, se === R)) break
              F = x[se]
            }
            if ((++M, M >= T)) return ee
          }
          var se = 0,
            ge = !1,
            ae = 0,
            he = v._nextBeginningIndexes
          he === ee && (he = v._nextBeginningIndexes = W(v.target)),
            (M = L[0] === 0 ? 0 : he[L[0] - 1])
          var Ke = 0
          if (M !== T)
            for (;;)
              if (M >= T) {
                if (se <= 0 || (++Ke, Ke > 200)) break
                --se
                var mt = $[--ae]
                M = he[mt]
              } else {
                var oe = x[se] === k[M]
                if (oe) {
                  if ((($[ae++] = M), ++se, se === R)) {
                    ge = !0
                    break
                  }
                  ++M
                } else M = he[M]
              }
          var qe = v._targetLower.indexOf(_, L[0]),
            c = ~qe
          if (c && !ge) for (var d = 0; d < V; ++d) L[d] = qe + d
          var h = !1
          c && (h = v._nextBeginningIndexes[qe - 1] === qe)
          {
            if (ge)
              var g = $,
                b = ae
            else
              var g = L,
                b = V
            for (var C = 0, A = 0, d = 1; d < R; ++d)
              g[d] - g[d - 1] !== 1 && ((C -= g[d]), ++A)
            var E = g[R - 1] - g[0] - (R - 1)
            if (((C -= (12 + E) * A), g[0] !== 0 && (C -= g[0] * 10), !ge))
              C *= 1e3
            else {
              for (var O = 1, d = he[0]; d < T; d = he[d]) ++O
              O > 24 && (C *= (O - 24) * 10)
            }
            c && (C /= 10), h && (C /= 10), (C -= T - R), (v.score = C)
            for (var d = 0; d < b; ++d) v._indexes[d] = g[d]
            return (v._indexes.len = b), v
          }
        },
        y = (I, v) => {
          for (
            var _ = new Set(), x = 0, F = ee, k = 0, R = I.spaceSearches, V = 0;
            V < R.length;
            ++V
          ) {
            var T = R[V]
            if (((F = m(T, v)), F === ee)) return ee
            ;(x += F.score),
              F._indexes[0] < k && (x -= k - F._indexes[0]),
              (k = F._indexes[0])
            for (var M = 0; M < F._indexes.len; ++M) _.add(F._indexes[M])
          }
          F.score = x
          var V = 0
          for (let oe of _) F._indexes[V++] = oe
          return (F._indexes.len = V), F
        },
        P = (I) => {
          for (
            var v = I.length, _ = I.toLowerCase(), x = [], F = 0, k = !1, R = 0;
            R < v;
            ++R
          ) {
            var T = (x[R] = _.charCodeAt(R))
            if (T === 32) {
              k = !0
              continue
            }
            var M =
              T >= 97 && T <= 122
                ? T - 97
                : T >= 48 && T <= 57
                ? 26
                : T <= 127
                ? 30
                : 31
            F |= 1 << M
          }
          return {
            lowerCodes: x,
            bitflags: F,
            containsSpace: k,
            _lower: _,
          }
        },
        K = (I) => {
          for (
            var v = I.length, _ = [], x = 0, F = !1, k = !1, R = 0;
            R < v;
            ++R
          ) {
            var T = I.charCodeAt(R),
              M = T >= 65 && T <= 90,
              V = M || (T >= 97 && T <= 122) || (T >= 48 && T <= 57),
              oe = (M && !F) || !k || !V
            ;(F = M), (k = V), oe && (_[x++] = R)
          }
          return _
        },
        W = (I) => {
          for (
            var v = I.length, _ = K(I), x = [], F = _[0], k = 0, R = 0;
            R < v;
            ++R
          )
            F > R ? (x[R] = F) : ((F = _[++k]), (x[R] = F === void 0 ? v : F))
          return x
        },
        te = () => {
          U.clear(), pe.clear(), (L = []), ($ = [])
        },
        U = new Map(),
        pe = new Map(),
        L = [],
        $ = [],
        Y = (I) => {
          for (var v = z, _ = I.length, x = 0; x < _; ++x) {
            var F = I[x]
            if (F !== ee) {
              var k = F.score
              k > v && (v = k)
            }
          }
          return v === z ? ee : v
        },
        S = (I, v) => {
          var _ = I[v]
          if (_ !== void 0) return _
          var x = v
          Array.isArray(v) || (x = v.split('.'))
          for (var F = x.length, k = -1; I && ++k < F; ) I = I[x[k]]
          return I
        },
        D = (I) => typeof I == 'object',
        H = 1 / 0,
        z = -H,
        ie = []
      ie.total = 0
      var ee = null,
        at = (I) => {
          var v = [],
            _ = 0,
            x = {},
            F = (k) => {
              for (var R = 0, T = v[R], M = 1; M < _; ) {
                var V = M + 1
                ;(R = M),
                  V < _ && v[V].score < v[M].score && (R = V),
                  (v[(R - 1) >> 1] = v[R]),
                  (M = 1 + (R << 1))
              }
              for (
                var oe = (R - 1) >> 1;
                R > 0 && T.score < v[oe].score;
                oe = ((R = oe) - 1) >> 1
              )
                v[R] = v[oe]
              v[R] = T
            }
          return (
            (x.add = (k) => {
              var R = _
              v[_++] = k
              for (
                var T = (R - 1) >> 1;
                R > 0 && k.score < v[T].score;
                T = ((R = T) - 1) >> 1
              )
                v[R] = v[T]
              v[R] = k
            }),
            (x.poll = (k) => {
              if (_ !== 0) {
                var R = v[0]
                return (v[0] = v[--_]), F(), R
              }
            }),
            (x.peek = (k) => {
              if (_ !== 0) return v[0]
            }),
            (x.replaceTop = (k) => {
              ;(v[0] = k), F()
            }),
            x
          )
        },
        Te = at()
      return {
        single: n,
        go: r,
        highlight: o,
        prepare: i,
        indexes: s,
        cleanup: te,
      }
    })
  })(Dn)
  const ot = xn({
    commands: [],
    isLoggedIn: !1,
    currentUser: {
      preferences: {},
    },
  })
  const ic = {
      components: {
        Combobox: iu,
        ComboboxInput: uu,
        ComboboxOptions: cu,
        ComboboxOption: fu,
        ComboboxButton: au,
        AnnotationIcon: Vu,
        CursorClickIcon: Yu,
        LinkIcon: Xu,
        SearchIcon: zu,
        GlobeAltIcon: Ju,
        CommandForm: tc,
      },
      setup() {
        const e = X(ot.commands.length > 0 ? ot.commands[0] : null),
          t = X(null),
          n = ot.currentUser.preferences
        let r = n.additionalCategories
        n.showAllTab && (r = [l.ALL].concat(n.additionalCategories))
        const o = X(r[0]),
          l$1 = X(''),
          s = X(0),
          i = X(ot.commands.length > 0 ? ot.commands[0] : null),
          a = ne(() => {
            const f = ot.commands.filter((p) =>
                o.value === l.ALL
                  ? p.categories.some((m) => n.categoriesInAllTab.includes(m))
                  : p.categories.includes(o.value)
              ),
              u = Dn.exports.go(l$1.value.toLowerCase(), f, {
                key: 'label',
                limit: 10,
                all: !0,
              })
            return (
              u.length === 0
                ? ((s.value = null), (i.value = null))
                : ((s.value = 0), (i.value = u[0].obj)),
              u
            )
          })
        return {
          form: t,
          tabCategories: r,
          selectedCategory: o,
          preferences: n,
          query: l$1,
          recent: e,
          filteredCommandResults: a,
          getIconNameForCommand: lc,
          highlight: Dn.exports.highlight,
          activeCommandIndex: s,
          activeCommand: i,
          logoUrl: chrome.runtime.getURL('assets/128x128.png'),
        }
      },
      watch: {
        activeCommand(e) {
          var t
          if (!e || this.activeCommandIndex === 0) {
            const n = document.getElementById('options-box')
            n && (n.scrollTop = 0)
          } else
            (t = document.getElementById(e.label)) == null || t.scrollIntoView()
        },
      },
      methods: {
        handleKeys(e) {
          e.code === 'Tab' && !e.ctrlKey && !e.altKey && !e.shiftKey
            ? this.selectNextCategory(e)
            : e.code === 'Tab' && !e.ctrlKey && e.shiftKey && !e.altKey
            ? this.selectPreviousCategory(e)
            : e.ctrlKey && e.shiftKey && !e.altKey
            ? this.selectNth(e)
            : e.ctrlKey &&
              !e.shiftKey &&
              e.altKey &&
              (e.code == 'KeyS'
                ? (e.preventDefault(), this.search())
                : this.selectOption(e))
        },
        selectNextCategory(e) {
          e.preventDefault()
          const t = this.tabCategories.findIndex(
            (n) => n === this.selectedCategory
          )
          t + 1 === this.tabCategories.length
            ? (this.selectedCategory = this.tabCategories[0])
            : (this.selectedCategory = this.tabCategories[t + 1])
        },
        selectPreviousCategory(e) {
          e.preventDefault()
          const t = this.tabCategories.findIndex(
            (n) => n === this.selectedCategory
          )
          t === 0
            ? (this.selectedCategory =
                this.tabCategories[this.tabCategories.length - 1])
            : (this.selectedCategory = this.tabCategories[t - 1])
        },
        async search() {
          await chrome.runtime.sendMessage({
            type: 'search',
            query: this.query,
          })
        },
        selectNextActiveCommand(e) {
          e.preventDefault(),
            this.activeCommandIndex + 1 === this.filteredCommandResults.length
              ? (this.activeCommandIndex = 0)
              : (this.activeCommandIndex += 1),
            (this.activeCommand =
              this.filteredCommandResults[this.activeCommandIndex].obj)
        },
        selectPreviousActiveCommand(e) {
          e.preventDefault(),
            this.activeCommandIndex === 0
              ? (this.activeCommandIndex =
                  this.filteredCommandResults.length - 1)
              : (this.activeCommandIndex -= 1),
            (this.activeCommand =
              this.filteredCommandResults[this.activeCommandIndex].obj)
        },
        onSelect(e) {
          var t, n
          ;(t = e.config) != null &&
            t.form &&
            (this.form = (n = e.config) == null ? void 0 : n.form),
            this.form || (this.$emit('close'), Nr(e)),
            (this.selectedCategory = l[0])
        },
        triggerActiveCommand(e) {
          e.preventDefault(),
            this.activeCommand && this.onSelect(this.activeCommand)
        },
        selectFirst() {
          this.filteredCommandResults.length > 0 &&
            this.onSelect(this.filteredCommandResults[0].obj)
        },
        selectNth(e) {
          const t = parseInt(e.key)
          t &&
            t < this.filteredCommandResults.length + 1 &&
            (e.preventDefault(),
            this.onSelect(this.filteredCommandResults[t - 1].obj))
        },
        async handleFormSubmit(e) {
          ;(this.activeCommand.config.form = e),
            Nr(this.activeCommand),
            this.$emit('close'),
            (this.form = null)
        },
        highlight(e) {
          return this.query
            ? Dn.exports.highlight(
                e,
                '<span class="sd-text-cyan-300 sd-font-bold">',
                '</span>'
              )
            : e.obj.label
        },
        getOptions(e) {
          var n
          const t = []
          if (
            e.type === 'element' &&
            ((n = e.config.options) == null ? void 0 : n.length) > 0
          )
            e.config.options
              .filter((r) => (r.type = 'element'))
              .forEach((r) => {
                const o = r.type,
                  l = e.scopeElement,
                  s = r[o],
                  i = T(l, o, s)
                i && t.push(i)
              })
          else if (e.type === 'link')
            t.push({
              type: 'link',
              label: 'Open in New Tab',
              config: {
                url: e.config.url,
                label: 'Open in New Tab',
                target: '_blank',
              },
            })
          else if (e.type === 'chrome' && e.options) return e.options
          return t
        },
        selectOption(e) {
          if (this.activeCommand) {
            const t = this.getOptions(this.activeCommand),
              n = parseInt(e.key)
            n &&
              n < t.length + 1 &&
              (e.preventDefault(), this.onSelect(t[n - 1]))
          }
        },
      },
    },
    io = (e) => (hi('data-v-35193566'), (e = e()), vi(), e),
    ac = {
      key: 0,
    },
    uc = {
      class:
        'sd-flex sd-text-xs sd-mt-1 sd-items-center sd-px-6 sd-py-6 sd-justify-between',
    },
    cc = {
      class: 'sd-flex sd-items-center sd-space-x-2',
    },
    fc = ['src'],
    dc = ['onClick'],
    pc = io(() =>
      ce(
        'a',
        {
          href: 'https://www.singledispatch.com/feedback',
          target: '_blank',
          class: 'sd-text-cyan-300 sd-underline visited:sd-text-cyan-300',
          tabindex: '-1',
        },
        'Send feedback',
        -1
      )
    ),
    hc = {
      class: 'sd-mx-6',
    },
    vc = io(() =>
      ce(
        'span',
        {
          class: 'sd-border-r sd-pr-1 sd-mr-1',
        },
        'ctrl+alt+s',
        -1
      )
    ),
    mc = Gt('Search in New Tab '),
    gc = [vc, mc],
    bc = {
      class: 'sd-p-2',
    },
    xc = {
      class: 'sd-text-sm sd-text-gray-200 sd-m-0 sd-p-0 sd-list-none',
    },
    yc = {
      class: 'sd-flex sd-items-center sd-space-x-2',
    },
    _c = ['src', 'alt'],
    wc = {
      class: 'sd-overflow-hidden sd-max-w-2xl sd-whitespace-nowrap',
    },
    Cc = ['innerHTML'],
    Ec = {
      key: 0,
      class: 'sd-m-0 sd-text-gray-200 sd-text-xs sd-text-left',
    },
    Oc = {
      key: 0,
      class: 'sd-flex sd-flex-row sd-flex-wrap sd-text-sm',
    },
    Tc = ['onClick'],
    Ic = {
      class: 'sd-border-r sd-pr-1',
    },
    Sc = {
      class: 'sd-pl-1',
    },
    Ac = {
      key: 1,
    },
    Fc = {
      key: 1,
      class: 'sd-py-14 sd-px-6 sd-text-center sm:sd-px-14',
    },
    Pc = io(() =>
      ce(
        'div',
        {
          class: 'sd-mt-4 sd-text-sm sd-text-gray-200',
        },
        " We couldn't find any commands with that term. Please try again. ",
        -1
      )
    ),
    Rc = [Pc]

  function kc(e, t, n, r, o, l) {
    const s = ft('CommandForm'),
      i = ft('ComboboxOption'),
      a = ft('ComboboxOptions'),
      f = ft('Combobox')
    return (
      ue(),
      Ee('div', null, [
        r.form
          ? (ue(),
            Ee('div', ac, [
              xe(
                s,
                {
                  onSubmit: l.handleFormSubmit,
                  form: r.form,
                  title: r.activeCommand.label,
                },
                null,
                8,
                ['onSubmit', 'form', 'title']
              ),
            ]))
          : (ue(),
            Je(
              f,
              {
                key: 1,
                as: 'div',
              },
              {
                default: ct(() => [
                  ce('div', uc, [
                    ce('div', cc, [
                      ce(
                        'img',
                        {
                          src: r.logoUrl,
                          alt: 'logo',
                          class: 'sd-w-12 sd-h-12 sd-inline sd-mx-2',
                        },
                        null,
                        8,
                        fc
                      ),
                      (ue(!0),
                      Ee(
                        Re,
                        null,
                        Ln(
                          r.tabCategories,
                          (u) => (
                            ue(),
                            Ee(
                              'div',
                              {
                                key: u,
                              },
                              [
                                ce(
                                  'div',
                                  {
                                    class: Dt([
                                      'sd-cursor-default sd-px-2 sd-py-1 hover:sd-bg-gray-600 sd-rounded-md sd-text-white sd-text-sm',
                                      r.selectedCategory === u &&
                                        'sd-bg-gray-700 sd-text-cyan-300',
                                    ]),
                                    onClick: () => (r.selectedCategory = u),
                                  },
                                  Rt(u),
                                  11,
                                  dc
                                ),
                              ]
                            )
                          )
                        ),
                        128
                      )),
                    ]),
                    pc,
                  ]),
                  ce(
                    'input',
                    {
                      id: 'search',
                      placeholder: 'Search...',
                      onInput:
                        t[0] || (t[0] = (u) => (r.query = u.target.value)),
                      autocomplete: 'off',
                      onKeydown: [
                        t[1] ||
                          (t[1] = (...u) => l.handleKeys && l.handleKeys(...u)),
                        t[2] ||
                          (t[2] = Pt(
                            (...u) =>
                              l.selectNextCategory &&
                              l.selectNextCategory(...u),
                            ['right']
                          )),
                        t[3] ||
                          (t[3] = Pt(
                            (...u) =>
                              l.selectPreviousCategory &&
                              l.selectPreviousCategory(...u),
                            ['left']
                          )),
                        t[4] ||
                          (t[4] = Pt(
                            (...u) =>
                              l.triggerActiveCommand &&
                              l.triggerActiveCommand(...u),
                            ['enter']
                          )),
                        t[5] || (t[5] = Pt((u) => e.$emit('close'), ['esc'])),
                        t[6] ||
                          (t[6] = Pt(
                            (...u) =>
                              l.selectNextActiveCommand &&
                              l.selectNextActiveCommand(...u),
                            ['down']
                          )),
                        t[7] ||
                          (t[7] = Pt(
                            (...u) =>
                              l.selectPreviousActiveCommand &&
                              l.selectPreviousActiveCommand(...u),
                            ['up']
                          )),
                      ],
                    },
                    null,
                    32
                  ),
                  ce('div', hc, [
                    r.query
                      ? (ue(),
                        Ee(
                          'button',
                          {
                            key: 0,
                            tabindex: '-1',
                            onClick:
                              t[8] ||
                              (t[8] = (...u) => l.search && l.search(...u)),
                            class:
                              'sd-bg-gray-900 sd-border-none sd-text-gray-100 sd-text-xs sd-select-none sd-rounded-md sd-px-2 sd-py-1',
                          },
                          gc
                        ))
                      : Ft('', !0),
                  ]),
                  r.query === '' || r.filteredCommandResults.length > 0
                    ? (ue(),
                      Je(
                        a,
                        {
                          key: 0,
                          id: 'options-box',
                          static: '',
                        },
                        {
                          default: ct(() => [
                            ce('li', bc, [
                              ce('ul', xc, [
                                (ue(!0),
                                Ee(
                                  Re,
                                  null,
                                  Ln(
                                    r.filteredCommandResults,
                                    (u, p) => (
                                      ue(),
                                      Je(
                                        i,
                                        {
                                          key: p,
                                          id: u.obj.label,
                                          value: u.obj,
                                          as: 'template',
                                        },
                                        {
                                          default: ct(() => {
                                            var m, y
                                            return [
                                              ce(
                                                'li',
                                                {
                                                  class: Dt([
                                                    'sd-flex sd-flex-col sd-cursor-default sd-select-none sd-rounded-md sd-px-3 sd-py-2',
                                                    r.activeCommandIndex ===
                                                      p &&
                                                      'sd-bg-gray-700 sd-text-white',
                                                  ]),
                                                  onClick:
                                                    t[9] ||
                                                    (t[9] = (...P) =>
                                                      l.triggerActiveCommand &&
                                                      l.triggerActiveCommand(
                                                        ...P
                                                      )),
                                                },
                                                [
                                                  ce('div', yc, [
                                                    ce(
                                                      'div',
                                                      {
                                                        class: Dt([
                                                          'sd-h-6 sd-w-6 sd-flex-none',
                                                          r.activeCommandIndex ===
                                                          p
                                                            ? 'sd-text-cyan-300'
                                                            : 'sd-text-gray-200',
                                                        ]),
                                                        'aria-hidden': 'true',
                                                      },
                                                      [
                                                        (m = u.obj.config) !=
                                                          null && m.favIconUrl
                                                          ? (ue(),
                                                            Ee(
                                                              'img',
                                                              {
                                                                key: 0,
                                                                src:
                                                                  (y =
                                                                    u.obj
                                                                      .config) ==
                                                                  null
                                                                    ? void 0
                                                                    : y.favIconUrl,
                                                                alt: u.obj
                                                                  .label,
                                                                class:
                                                                  'sd-w-full',
                                                              },
                                                              null,
                                                              8,
                                                              _c
                                                            ))
                                                          : (ue(),
                                                            Je(
                                                              ea(
                                                                r.getIconNameForCommand(
                                                                  u.obj
                                                                )
                                                              ),
                                                              {
                                                                key: 1,
                                                              }
                                                            )),
                                                      ],
                                                      2
                                                    ),
                                                    ce('div', wc, [
                                                      ce(
                                                        'p',
                                                        {
                                                          class:
                                                            'sd-m-0 sd-text-gray-200 sd-text-sm sd-text-left',
                                                          innerHTML:
                                                            l.highlight(u),
                                                        },
                                                        null,
                                                        8,
                                                        Cc
                                                      ),
                                                      u.obj.config.url
                                                        ? (ue(),
                                                          Ee(
                                                            'p',
                                                            Ec,
                                                            Rt(
                                                              u.obj.config.url.substring(
                                                                0,
                                                                120
                                                              )
                                                            ),
                                                            1
                                                          ))
                                                        : Ft('', !0),
                                                    ]),
                                                  ]),
                                                  r.activeCommandIndex === p
                                                    ? (ue(),
                                                      Ee('div', Oc, [
                                                        (ue(!0),
                                                        Ee(
                                                          Re,
                                                          null,
                                                          Ln(
                                                            l.getOptions(u.obj),
                                                            (P, K) => (
                                                              ue(),
                                                              Ee(
                                                                'div',
                                                                {
                                                                  key: P.label,
                                                                  class:
                                                                    'sd-text-xs sd-text-center sd-rounded-md sd-px-2 sd-py-1 sd-bg-gray-800 hover:sd-bg-gray-700 hover:sd-text-cyan-300 sd-border sd-border-gray-100 hover:sd-border-cyan-300 sd-m-1',
                                                                  onClick: () =>
                                                                    l.onSelect(
                                                                      P
                                                                    ),
                                                                },
                                                                [
                                                                  ce(
                                                                    'span',
                                                                    Ic,
                                                                    ' ctrl+alt+' +
                                                                      Rt(K + 1),
                                                                    1
                                                                  ),
                                                                  ce(
                                                                    'span',
                                                                    Sc,
                                                                    Rt(P.label),
                                                                    1
                                                                  ),
                                                                ],
                                                                8,
                                                                Tc
                                                              )
                                                            )
                                                          ),
                                                          128
                                                        )),
                                                      ]))
                                                    : Ft('', !0),
                                                  r.activeCommandIndex === p &&
                                                  r.preferences.debug
                                                    ? (ue(),
                                                      Ee(
                                                        'pre',
                                                        Ac,
                                                        Rt(
                                                          JSON.stringify(
                                                            u.obj.config,
                                                            void 0,
                                                            2
                                                          )
                                                        ),
                                                        1
                                                      ))
                                                    : Ft('', !0),
                                                ],
                                                2
                                              ),
                                            ]
                                          }),
                                          _: 2,
                                        },
                                        1032,
                                        ['id', 'value']
                                      )
                                    )
                                  ),
                                  128
                                )),
                              ]),
                            ]),
                          ]),
                          _: 1,
                        }
                      ))
                    : Ft('', !0),
                  r.query !== '' && r.filteredCommandResults.length === 0
                    ? (ue(), Ee('div', Fc, Rc))
                    : Ft('', !0),
                ]),
                _: 1,
              }
            )),
      ])
    )
  }
  var Lc = so(ic, [
    ['render', kc],
    ['__scopeId', 'data-v-35193566'],
  ])
  const Dc = {
      components: {
        CommandPalette: Lc,
        Dialog: Tu,
        DialogPanel: Iu,
        TransitionChild: fs,
        TransitionRoot: ds,
        Login: Wu,
      },
      setup() {
        return {
          visible: X(!1),
          store: ot,
        }
      },
    },
    Nc = ce(
      'div',
      {
        class:
          'sd-fixed sd-inset-0 sd-bg-gray-500 sd-bg-opacity-25 sd-transition-opacity',
      },
      null,
      -1
    ),
    Mc = {
      class:
        'sd-fixed sd-inset-0 sd-z-10 sd-overflow-y-auto sd-p-4 sm:sd-p-6 md:sd-p-20',
    }

  function $c(e, t, n, r, o, l) {
    const s = ft('TransitionChild'),
      i = ft('CommandPalette'),
      a = ft('DialogPanel'),
      f = ft('Dialog'),
      u = ft('TransitionRoot')
    return (
      ue(),
      Je(
        u,
        {
          show: r.visible,
          as: 'template',
          onAfterLeave: t[2] || (t[2] = (p) => (e.query = '')),
        },
        {
          default: ct(() => [
            xe(
              f,
              {
                as: 'div',
                class: Dt([
                  'sd-font-sans sd-fixed sd-inset-0 sd-z-[10000] sd-overflow-y-auto sd-p-4 sm:sd-p-6 md:sd-p-20 sd-mt-24',
                  {
                    'sd-z-0': !r.visible,
                  },
                ]),
                onClose: t[1] || (t[1] = (p) => (r.visible = !1)),
              },
              {
                default: ct(() => [
                  xe(
                    s,
                    {
                      as: 'template',
                      enter: 'ease-out duration-75',
                      'enter-from': 'opacity-0',
                      'enter-to': 'opacity-100',
                      leave: 'ease-in duration-75',
                      'leave-from': 'opacity-100',
                      'leave-to': 'opacity-0',
                    },
                    {
                      default: ct(() => [Nc]),
                      _: 1,
                    }
                  ),
                  ce('div', Mc, [
                    xe(
                      s,
                      {
                        as: 'template',
                        enter: 'ease-out duration-75',
                        'enter-from': 'opacity-0 scale-95',
                        'enter-to': 'opacity-100 scale-100',
                        leave: 'ease-in duration-75',
                        'leave-from': 'opacity-100 scale-100',
                        'leave-to': 'opacity-0 scale-95',
                      },
                      {
                        default: ct(() => [
                          xe(
                            a,
                            {
                              class:
                                'sd-mx-auto sd-text-gray-100 sd-max-w-2xl sd-transform sd-divide-y sd-divide-gray-500 sd-divide-opacity-20 sd-overflow-hidden sd-rounded-xl sd-bg-gray-900 sd-shadow-2xl sd-transition-all',
                            },
                            {
                              default: ct(() => [
                                xe(i, {
                                  onClose:
                                    t[0] || (t[0] = (p) => (r.visible = !1)),
                                }),
                              ]),
                              _: 1,
                            }
                          ),
                        ]),
                        _: 1,
                      }
                    ),
                  ]),
                ]),
                _: 1,
              },
              8,
              ['class']
            ),
          ]),
          _: 1,
        },
        8,
        ['show']
      )
    )
  }
  var jc = so(Dc, [['render', $c]])
  let Nn
  const Jo = 'single-dispatch-root'
  if (!document.getElementById(Jo)) {
    const e = document.createElement('div')
    ;(e.id = Jo), document.body.appendChild(e), (Nn = Ba(jc, {}).mount(e))
  }
  chrome.runtime.onMessage.addListener(async (e, t, n) => {
    if (e.toggleVisible)
      (Nn.visible = !Nn.visible),
        Nn.visible &&
          ((ot.commands = P(e.data)),
          (ot.currentUser = e.data.store.currentUser),
          (ot.isLoggedIn = e.data.store.isLoggedIn))
    else if (e.type === 'run_command') {
      let r = e.command,
        o = r.interval || 200,
        l = r.timeout || 1e4,
        s = 0
      const i = r.type,
        a = r[i],
        f = a.trigger.selector,
        u = setInterval(async function () {
          document.querySelector(f)
            ? ((r = T(document.body, i, a)), r && (Nr(r), clearInterval(u)))
            : s > l && clearInterval(u),
            (s += o)
        }, o)
    }
    n(null)
  })
})()
