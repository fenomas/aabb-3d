import { test } from 'node:test'
import { ok, strictEqual } from 'node:assert'
import aabb from './index.js'


if(typeof Float32Array === 'undefined') {

}

/**
 * @param {number} [n]
 * @returns {number}
 */
function random(n) {
  return Math.random() * (n || 10) + 1
}

/**
 * @param {number} [n]
 * @returns {number}
 */
function randint(n) {
  return ~~random(n)
}

/**
 * @param {number} x
 * @param {number} y
 * @returns {boolean}
 */
function eps(x, y) {
  return Math.abs(x - y) < 10e-5
}

test('translate works', function() {
  var w = random()
    , h = random()
    , d = random()
    , b = new aabb([0, 0, 0], [w, h, d])
    , tx = random()
    , ty = random()
    , tz = random()

  strictEqual(b.x0(), 0, 'x0 == 0')
  strictEqual(b.y0(), 0, 'y0 == 0')
  ok(eps(b.x1(), w), 'x1 == w')
  ok(eps(b.y1(), h), 'y1 == h')
  strictEqual(b.z0(), 0, 'z0 == 0')
  ok(eps(b.z1(), d), 'z1 == d')

  b.translate([tx, ty, tz])

  ok(eps(b.x0(), tx), 'x0 == tx')
  ok(eps(b.x1(), tx + w), 'x1 == tx + w')
  ok(eps(b.y0(), ty), 'y0 == ty')
  ok(eps(b.y1(), ty + h), 'y1 == ty + h')
  ok(eps(b.z0(), tz), 'z0 == tz')
  ok(eps(b.z1(), tz + d), 'z1 == tz + d')
})

test('setPosition works', function() {
  var fromx = random()
    , fromy = random()
    , fromz = random()
    , w = random()
    , h = random()
    , d = random()
    , b = new aabb([fromx, fromy, fromz], [w, h, d])
    , tox = random()
    , toy = random()
    , toz = random()

  ok(eps(b.x0(), fromx),   'x0 == fromx')
  ok(eps(b.y0(), fromy),   'y0 == fromy')
  ok(eps(b.z0(), fromz),   'z0 == fromz')
  ok(eps(b.x1(), fromx+w), 'x1 == fromx+w')
  ok(eps(b.y1(), fromy+h), 'y1 == fromy+h')
  ok(eps(b.z1(), fromz+d), 'z1 == fromz+d')
  
  b.setPosition([tox, toy, toz])
  
  ok(eps(b.x0(), tox),   'x0 == tox')
  ok(eps(b.y0(), toy),   'y0 == toy')
  ok(eps(b.z0(), toz),   'z0 == toz')
  ok(eps(b.x1(), tox+w), 'x1 == tox+w')
  ok(eps(b.y1(), toy+h), 'y1 == toy+h')
  ok(eps(b.z1(), toz+d), 'z1 == toz+d')
})

test('expand works', function() {
  var b0 = new aabb([0, 0, 0], [10, 10, 10])
    , b1 = new aabb([-5, -5, -5], [2, 2, 2])
    , b2 

  b2 = b0.expand(b1)

  ok(eps(b2.y1(), b0.y1()), 'outer y bound is 10')
  ok(eps(b2.x1(), b0.x1()), 'outer x bound is 10')
  ok(eps(b2.x0(), b1.x0()), 'inner x bound is -5')
  ok(eps(b2.y0(), b1.y0()), 'inner y bound is -5')
})

test('intersects works', function() {
  var b0 = new aabb([10, 10, 10], [10, 10, 10])
    , b1 = new aabb([0, 0, 0], [2, 2, 2])

  strictEqual(b0.intersects(b1), false, 'should not intersect (either axis)')

  b1 = new aabb([0, 0, 0], [20, 2, 2])
  strictEqual(b0.intersects(b1), false, 'should not intersect (x intersects)')

  b1 = new aabb([0, 0, 0], [2, 20, 2])
  strictEqual(b0.intersects(b1), false, 'should not intersect (y intersects)')
  
  b1 = new aabb([0, 0, 0], [2, 2, 20])
  strictEqual(b0.intersects(b1), false, 'should not intersect (z intersects)')
  
  b1 = new aabb([21, 20, 20], [20, 20, 20])
  strictEqual(b0.intersects(b1), false, 'should not intersect (y intersects base)')
  
  b1 = new aabb([20, 21, 20], [20, 20, 20])
  strictEqual(b0.intersects(b1), false, 'should not intersect (x intersects base)')
  
  b1 = new aabb([20, 20, 21], [20, 20, 20])
  strictEqual(b0.intersects(b1), false, 'should not intersect (z intersects base)')

  b1 = new aabb([20, 20, 20], [20, 20, 20])
  strictEqual(b0.intersects(b1), true, 'should intersect (b0 touches b1)')

  b1 = new aabb([12, 12, 12], [4, 4, 4])
  strictEqual(b0.intersects(b1), true, 'should intersect (b0 contains b1)')

  b1 = new aabb([-5, -5, -5], [20, 20, 20])
  strictEqual(b0.intersects(b1), true, 'should intersects (b0 contains b1)')

  b1 = new aabb([-5, -5, -5], [10, 10, 10])
  strictEqual(b0.intersects(b1), false, 'should not intersect (b0 does not contain b1)')
})

test('touches works', function() { 
  var b0 = new aabb([10,10,10], [10, 10, 10])
    , b1 = new aabb([0, 0, 0], [10, 10, 10])

  strictEqual(b0.touches(b1), true, 'should touch')

  b1 = new aabb([10, 0, 0], [10, 10, 10])
  strictEqual(b0.touches(b1), true, 'should touch')

  b1 = new aabb([0, 10, 0], [10, 10, 10])
  strictEqual(b0.touches(b1), true, 'should touch')

  b1 = new aabb([0, 0, 10], [10, 10, 10])
  strictEqual(b0.touches(b1), true, 'should touch')

  b1 = new aabb([-10, -10, -10], [10, 10, 10])
  strictEqual(b0.touches(b1), false, 'should not touch')
})
