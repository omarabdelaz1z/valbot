!(function (e, t) {
	'object' == typeof exports && 'object' == typeof module
		? (module.exports = t())
		: 'function' == typeof define && define.amd
		? define('Fuse', [], t)
		: 'object' == typeof exports
		? (exports.Fuse = t())
		: (e.Fuse = t())
})(this, function () {
	return (
		(n = {}),
		(o.m = r = [
			function (e, t) {
				e.exports = function (e) {
					return Array.isArray
						? Array.isArray(e)
						: '[object Array]' === Object.prototype.toString.call(e)
				}
			},
			function (e, t, r) {
				function l(e) {
					return (l =
						'function' == typeof Symbol && 'symbol' == typeof Symbol.iterator
							? function (e) {
									return typeof e
							  }
							: function (e) {
									return e &&
										'function' == typeof Symbol &&
										e.constructor === Symbol &&
										e !== Symbol.prototype
										? 'symbol'
										: typeof e
							  })(e)
				}
				function n(e, t) {
					for (var r = 0; r < t.length; r++) {
						var n = t[r]
						;(n.enumerable = n.enumerable || !1),
							(n.configurable = !0),
							'value' in n && (n.writable = !0),
							Object.defineProperty(e, n.key, n)
					}
				}
				var i = r(2),
					$ = r(8),
					E = r(0),
					o =
						(n(J.prototype, [
							{
								key: 'setCollection',
								value: function (e) {
									return (this.list = e)
								}
							},
							{
								key: 'search',
								value: function (e) {
									var t =
										1 < arguments.length && void 0 !== arguments[1]
											? arguments[1]
											: { limit: !1 }
									this._log('---------\nSearch pattern: "'.concat(e, '"'))
									var r = this._prepareSearchers(e),
										n = r.tokenSearchers,
										o = r.fullSearcher,
										i = this._search(n, o),
										a = i.weights,
										s = i.results
									return (
										this._computeScore(a, s),
										this.options.shouldSort && this._sort(s),
										t.limit &&
											'number' == typeof t.limit &&
											(s = s.slice(0, t.limit)),
										this._format(s)
									)
								}
							},
							{
								key: '_prepareSearchers',
								value: function () {
									var e =
											0 < arguments.length && void 0 !== arguments[0]
												? arguments[0]
												: '',
										t = []
									if (this.options.tokenize)
										for (
											var r = e.split(this.options.tokenSeparator),
												n = 0,
												o = r.length;
											n < o;
											n += 1
										)
											t.push(new i(r[n], this.options))
									return {
										tokenSearchers: t,
										fullSearcher: new i(e, this.options)
									}
								}
							},
							{
								key: '_search',
								value: function () {
									var e =
											0 < arguments.length && void 0 !== arguments[0]
												? arguments[0]
												: [],
										t = 1 < arguments.length ? arguments[1] : void 0,
										r = this.list,
										n = {},
										o = []
									if ('string' == typeof r[0]) {
										for (var i = 0, a = r.length; i < a; i += 1)
											this._analyze(
												{ key: '', value: r[i], record: i, index: i },
												{
													resultMap: n,
													results: o,
													tokenSearchers: e,
													fullSearcher: t
												}
											)
										return { weights: null, results: o }
									}
									for (var s = {}, c = 0, h = r.length; c < h; c += 1)
										for (
											var l = r[c], u = 0, f = this.options.keys.length;
											u < f;
											u += 1
										) {
											var d = this.options.keys[u]
											if ('string' != typeof d) {
												if (
													((s[d.name] = { weight: 1 - d.weight || 1 }),
													d.weight <= 0 || 1 < d.weight)
												)
													throw new Error('Key weight has to be > 0 and <= 1')
												d = d.name
											} else s[d] = { weight: 1 }
											this._analyze(
												{
													key: d,
													value: this.options.getFn(l, d),
													record: l,
													index: c
												},
												{
													resultMap: n,
													results: o,
													tokenSearchers: e,
													fullSearcher: t
												}
											)
										}
									return { weights: s, results: o }
								}
							},
							{
								key: '_analyze',
								value: function (e, t) {
									var r = e.key,
										n = e.arrayIndex,
										o = void 0 === n ? -1 : n,
										i = e.value,
										a = e.record,
										s = e.index,
										c = t.tokenSearchers,
										h = void 0 === c ? [] : c,
										l = t.fullSearcher,
										u = void 0 === l ? [] : l,
										f = t.resultMap,
										d = void 0 === f ? {} : f,
										v = t.results,
										p = void 0 === v ? [] : v
									if (null != i) {
										var g = !1,
											y = -1,
											m = 0
										if ('string' == typeof i) {
											this._log('\nKey: '.concat('' === r ? '-' : r))
											var k = u.search(i)
											if (
												(this._log(
													'Full text: "'.concat(i, '", score: ').concat(k.score)
												),
												this.options.tokenize)
											) {
												for (
													var S = i.split(this.options.tokenSeparator),
														x = [],
														b = 0;
													b < h.length;
													b += 1
												) {
													var M = h[b]
													this._log('\nPattern: "'.concat(M.pattern, '"'))
													for (var _ = !1, L = 0; L < S.length; L += 1) {
														var w = S[L],
															A = M.search(w),
															C = {}
														A.isMatch
															? ((C[w] = A.score),
															  (_ = g = !0),
															  x.push(A.score))
															: ((C[w] = 1),
															  this.options.matchAllTokens || x.push(1)),
															this._log(
																'Token: "'.concat(w, '", score: ').concat(C[w])
															)
													}
													_ && (m += 1)
												}
												y = x[0]
												for (var I = x.length, O = 1; O < I; O += 1) y += x[O]
												;(y /= I), this._log('Token score average:', y)
											}
											var j = k.score
											;-1 < y && (j = (j + y) / 2),
												this._log('Score average:', j)
											var P =
												!this.options.tokenize ||
												!this.options.matchAllTokens ||
												m >= h.length
											if (
												(this._log('\nCheck Matches: '.concat(P)),
												(g || k.isMatch) && P)
											) {
												var F = d[s]
												F
													? F.output.push({
															key: r,
															arrayIndex: o,
															value: i,
															score: j,
															matchedIndices: k.matchedIndices
													  })
													: ((d[s] = {
															item: a,
															output: [
																{
																	key: r,
																	arrayIndex: o,
																	value: i,
																	score: j,
																	matchedIndices: k.matchedIndices
																}
															]
													  }),
													  p.push(d[s]))
											}
										} else if (E(i))
											for (var T = 0, z = i.length; T < z; T += 1)
												this._analyze(
													{
														key: r,
														arrayIndex: T,
														value: i[T],
														record: a,
														index: s
													},
													{
														resultMap: d,
														results: p,
														tokenSearchers: h,
														fullSearcher: u
													}
												)
									}
								}
							},
							{
								key: '_computeScore',
								value: function (e, t) {
									this._log('\n\nComputing score:\n')
									for (var r = 0, n = t.length; r < n; r += 1) {
										for (
											var o = t[r].output, i = o.length, a = 1, s = 1, c = 0;
											c < i;
											c += 1
										) {
											var h = e ? e[o[c].key].weight : 1,
												l = (1 === h ? o[c].score : o[c].score || 0.001) * h
											1 !== h ? (s = Math.min(s, l)) : (a *= o[c].nScore = l)
										}
										;(t[r].score = 1 === s ? a : s), this._log(t[r])
									}
								}
							},
							{
								key: '_sort',
								value: function (e) {
									this._log('\n\nSorting....'), e.sort(this.options.sortFn)
								}
							},
							{
								key: '_format',
								value: function (e) {
									var t = []
									if (this.options.verbose) {
										var r = []
										this._log(
											'\n\nOutput:\n\n',
											JSON.stringify(e, function (e, t) {
												if ('object' === l(t) && null !== t) {
													if (-1 !== r.indexOf(t)) return
													r.push(t)
												}
												return t
											})
										),
											(r = null)
									}
									var n = []
									this.options.includeMatches &&
										n.push(function (e, t) {
											var r = e.output
											t.matches = []
											for (var n = 0, o = r.length; n < o; n += 1) {
												var i = r[n]
												if (0 !== i.matchedIndices.length) {
													var a = { indices: i.matchedIndices, value: i.value }
													i.key && (a.key = i.key),
														i.hasOwnProperty('arrayIndex') &&
															-1 < i.arrayIndex &&
															(a.arrayIndex = i.arrayIndex),
														t.matches.push(a)
												}
											}
										}),
										this.options.includeScore &&
											n.push(function (e, t) {
												t.score = e.score
											})
									for (var o = 0, i = e.length; o < i; o += 1) {
										var a = e[o]
										if (
											(this.options.id &&
												(a.item = this.options.getFn(
													a.item,
													this.options.id
												)[0]),
											n.length)
										) {
											for (
												var s = { item: a.item }, c = 0, h = n.length;
												c < h;
												c += 1
											)
												n[c](a, s)
											t.push(s)
										} else t.push(a.item)
									}
									return t
								}
							},
							{
								key: '_log',
								value: function () {
									var e
									this.options.verbose && (e = console).log.apply(e, arguments)
								}
							}
						]),
						J)
				function J(e, t) {
					var r = t.location,
						n = void 0 === r ? 0 : r,
						o = t.distance,
						i = void 0 === o ? 100 : o,
						a = t.threshold,
						s = void 0 === a ? 0.6 : a,
						c = t.maxPatternLength,
						h = void 0 === c ? 32 : c,
						l = t.caseSensitive,
						u = void 0 !== l && l,
						f = t.tokenSeparator,
						d = void 0 === f ? / +/g : f,
						v = t.findAllMatches,
						p = void 0 !== v && v,
						g = t.minMatchCharLength,
						y = void 0 === g ? 1 : g,
						m = t.id,
						k = void 0 === m ? null : m,
						S = t.keys,
						x = void 0 === S ? [] : S,
						b = t.shouldSort,
						M = void 0 === b || b,
						_ = t.getFn,
						L = void 0 === _ ? $ : _,
						w = t.sortFn,
						A =
							void 0 === w
								? function (e, t) {
										return e.score - t.score
								  }
								: w,
						C = t.tokenize,
						I = void 0 !== C && C,
						O = t.matchAllTokens,
						j = void 0 !== O && O,
						P = t.includeMatches,
						F = void 0 !== P && P,
						T = t.includeScore,
						z = void 0 !== T && T,
						E = t.verbose,
						K = void 0 !== E && E
					!(function (e) {
						if (!(e instanceof J))
							throw new TypeError('Cannot call a class as a function')
					})(this),
						(this.options = {
							location: n,
							distance: i,
							threshold: s,
							maxPatternLength: h,
							isCaseSensitive: u,
							tokenSeparator: d,
							findAllMatches: p,
							minMatchCharLength: y,
							id: k,
							keys: x,
							includeMatches: F,
							includeScore: z,
							shouldSort: M,
							getFn: L,
							sortFn: A,
							verbose: K,
							tokenize: I,
							matchAllTokens: j
						}),
						this.setCollection(e)
				}
				e.exports = o
			},
			function (e, t, r) {
				function n(e, t) {
					for (var r = 0; r < t.length; r++) {
						var n = t[r]
						;(n.enumerable = n.enumerable || !1),
							(n.configurable = !0),
							'value' in n && (n.writable = !0),
							Object.defineProperty(e, n.key, n)
					}
				}
				var l = r(3),
					u = r(4),
					m = r(7),
					o =
						(n(k.prototype, [
							{
								key: 'search',
								value: function (e) {
									if (
										(this.options.isCaseSensitive || (e = e.toLowerCase()),
										this.pattern === e)
									)
										return {
											isMatch: !0,
											score: 0,
											matchedIndices: [[0, e.length - 1]]
										}
									var t = this.options,
										r = t.maxPatternLength,
										n = t.tokenSeparator
									if (this.pattern.length > r) return l(e, this.pattern, n)
									var o = this.options,
										i = o.location,
										a = o.distance,
										s = o.threshold,
										c = o.findAllMatches,
										h = o.minMatchCharLength
									return u(e, this.pattern, this.patternAlphabet, {
										location: i,
										distance: a,
										threshold: s,
										findAllMatches: c,
										minMatchCharLength: h
									})
								}
							}
						]),
						k)
				function k(e, t) {
					var r = t.location,
						n = void 0 === r ? 0 : r,
						o = t.distance,
						i = void 0 === o ? 100 : o,
						a = t.threshold,
						s = void 0 === a ? 0.6 : a,
						c = t.maxPatternLength,
						h = void 0 === c ? 32 : c,
						l = t.isCaseSensitive,
						u = void 0 !== l && l,
						f = t.tokenSeparator,
						d = void 0 === f ? / +/g : f,
						v = t.findAllMatches,
						p = void 0 !== v && v,
						g = t.minMatchCharLength,
						y = void 0 === g ? 1 : g
					!(function (e) {
						if (!(e instanceof k))
							throw new TypeError('Cannot call a class as a function')
					})(this),
						(this.options = {
							location: n,
							distance: i,
							threshold: s,
							maxPatternLength: h,
							isCaseSensitive: u,
							tokenSeparator: d,
							findAllMatches: p,
							minMatchCharLength: y
						}),
						(this.pattern = this.options.isCaseSensitive ? e : e.toLowerCase()),
						this.pattern.length <= h && (this.patternAlphabet = m(this.pattern))
				}
				e.exports = o
			},
			function (e, t) {
				var l = /[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g
				e.exports = function (e, t) {
					var r =
							2 < arguments.length && void 0 !== arguments[2]
								? arguments[2]
								: / +/g,
						n = new RegExp(t.replace(l, '\\$&').replace(r, '|')),
						o = e.match(n),
						i = !!o,
						a = []
					if (i)
						for (var s = 0, c = o.length; s < c; s += 1) {
							var h = o[s]
							a.push([e.indexOf(h), h.length - 1])
						}
					return { score: i ? 0.5 : 1, isMatch: i, matchedIndices: a }
				}
			},
			function (e, t, r) {
				var E = r(5),
					K = r(6)
				e.exports = function (e, t, r, n) {
					for (
						var o = n.location,
							i = void 0 === o ? 0 : o,
							a = n.distance,
							s = void 0 === a ? 100 : a,
							c = n.threshold,
							h = void 0 === c ? 0.6 : c,
							l = n.findAllMatches,
							u = void 0 !== l && l,
							f = n.minMatchCharLength,
							d = void 0 === f ? 1 : f,
							v = i,
							p = e.length,
							g = h,
							y = e.indexOf(t, v),
							m = t.length,
							k = [],
							S = 0;
						S < p;
						S += 1
					)
						k[S] = 0
					if (-1 !== y) {
						var x = E(t, {
							errors: 0,
							currentLocation: y,
							expectedLocation: v,
							distance: s
						})
						if (((g = Math.min(x, g)), -1 !== (y = e.lastIndexOf(t, v + m)))) {
							var b = E(t, {
								errors: 0,
								currentLocation: y,
								expectedLocation: v,
								distance: s
							})
							g = Math.min(b, g)
						}
					}
					y = -1
					for (
						var M = [], _ = 1, L = m + p, w = 1 << (m - 1), A = 0;
						A < m;
						A += 1
					) {
						for (var C = 0, I = L; C < I; )
							E(t, {
								errors: A,
								currentLocation: v + I,
								expectedLocation: v,
								distance: s
							}) <= g
								? (C = I)
								: (L = I),
								(I = Math.floor((L - C) / 2 + C))
						L = I
						var O = Math.max(1, v - I + 1),
							j = u ? p : Math.min(v + I, p) + m,
							P = Array(j + 2)
						P[j + 1] = (1 << A) - 1
						for (var F = j; O <= F; F -= 1) {
							var T = F - 1,
								z = r[e.charAt(T)]
							if (
								(z && (k[T] = 1),
								(P[F] = ((P[F + 1] << 1) | 1) & z),
								0 !== A && (P[F] |= ((M[F + 1] | M[F]) << 1) | 1 | M[F + 1]),
								P[F] & w &&
									(_ = E(t, {
										errors: A,
										currentLocation: T,
										expectedLocation: v,
										distance: s
									})) <= g)
							) {
								if (((g = _), (y = T) <= v)) break
								O = Math.max(1, 2 * v - y)
							}
						}
						if (
							E(t, {
								errors: A + 1,
								currentLocation: v,
								expectedLocation: v,
								distance: s
							}) > g
						)
							break
						M = P
					}
					return {
						isMatch: 0 <= y,
						score: 0 === _ ? 0.001 : _,
						matchedIndices: K(k, d)
					}
				}
			},
			function (e, t) {
				e.exports = function (e, t) {
					var r = t.errors,
						n = void 0 === r ? 0 : r,
						o = t.currentLocation,
						i = void 0 === o ? 0 : o,
						a = t.expectedLocation,
						s = void 0 === a ? 0 : a,
						c = t.distance,
						h = void 0 === c ? 100 : c,
						l = n / e.length,
						u = Math.abs(s - i)
					return h ? l + u / h : u ? 1 : l
				}
			},
			function (e, t) {
				e.exports = function () {
					for (
						var e =
								0 < arguments.length && void 0 !== arguments[0]
									? arguments[0]
									: [],
							t =
								1 < arguments.length && void 0 !== arguments[1]
									? arguments[1]
									: 1,
							r = [],
							n = -1,
							o = -1,
							i = 0,
							a = e.length;
						i < a;
						i += 1
					) {
						var s = e[i]
						s && -1 === n
							? (n = i)
							: s ||
							  -1 === n ||
							  ((o = i - 1) - n + 1 >= t && r.push([n, o]), (n = -1))
					}
					return e[i - 1] && t <= i - n && r.push([n, i - 1]), r
				}
			},
			function (e, t) {
				e.exports = function (e) {
					for (var t = {}, r = e.length, n = 0; n < r; n += 1)
						t[e.charAt(n)] = 0
					for (var o = 0; o < r; o += 1) t[e.charAt(o)] |= 1 << (r - o - 1)
					return t
				}
			},
			function (e, t, r) {
				var l = r(0)
				e.exports = function (e, t) {
					return (function e(t, r, n) {
						if (r) {
							var o = r.indexOf('.'),
								i = r,
								a = null
							;-1 !== o && ((i = r.slice(0, o)), (a = r.slice(o + 1)))
							var s = t[i]
							if (null != s)
								if (a || ('string' != typeof s && 'number' != typeof s))
									if (l(s))
										for (var c = 0, h = s.length; c < h; c += 1) e(s[c], a, n)
									else a && e(s, a, n)
								else n.push(s.toString())
						} else n.push(t)
						return n
					})(e, t, [])
				}
			}
		]),
		(o.c = n),
		(o.d = function (e, t, r) {
			o.o(e, t) || Object.defineProperty(e, t, { enumerable: !0, get: r })
		}),
		(o.r = function (e) {
			'undefined' != typeof Symbol &&
				Symbol.toStringTag &&
				Object.defineProperty(e, Symbol.toStringTag, { value: 'Module' }),
				Object.defineProperty(e, '__esModule', { value: !0 })
		}),
		(o.t = function (t, e) {
			if ((1 & e && (t = o(t)), 8 & e)) return t
			if (4 & e && 'object' == typeof t && t && t.__esModule) return t
			var r = Object.create(null)
			if (
				(o.r(r),
				Object.defineProperty(r, 'default', { enumerable: !0, value: t }),
				2 & e && 'string' != typeof t)
			)
				for (var n in t)
					o.d(
						r,
						n,
						function (e) {
							return t[e]
						}.bind(null, n)
					)
			return r
		}),
		(o.n = function (e) {
			var t =
				e && e.__esModule
					? function () {
							return e.default
					  }
					: function () {
							return e
					  }
			return o.d(t, 'a', t), t
		}),
		(o.o = function (e, t) {
			return Object.prototype.hasOwnProperty.call(e, t)
		}),
		(o.p = ''),
		o((o.s = 1))
	)
	function o(e) {
		if (n[e]) return n[e].exports
		var t = (n[e] = { i: e, l: !1, exports: {} })
		return r[e].call(t.exports, t, t.exports, o), (t.l = !0), t.exports
	}
	var r, n
})
