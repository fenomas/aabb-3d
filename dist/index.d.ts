/// <reference types="gl-matrix/index.js" />
import { vec3 } from 'gl-matrix';
import type { ReadonlyVec3 } from 'gl-matrix';
export default class AABB {
    readonly base: vec3;
    readonly vec: vec3;
    readonly max: vec3;
    readonly mag: number;
    constructor(pos: ReadonlyVec3, vec: ReadonlyVec3);
    width(): number;
    height(): number;
    depth(): number;
    x0(): number;
    y0(): number;
    z0(): number;
    x1(): number;
    y1(): number;
    z1(): number;
    /**
     * Moves the box. Returns itself.
     */
    translate(by: ReadonlyVec3): this;
    setPosition(pos: ReadonlyVec3): this;
    /**
     * Returns a new `aabb` that surrounds both `aabb`'s.
     */
    expand(aabb: AABB): AABB;
    /**
     * Returns `true` if the two bounding boxes intersect (or touch at all.)
     */
    intersects(aabb: AABB): boolean;
    touches(aabb: AABB): boolean;
    /**
     * Returns a new `aabb` representing the shared area of the
     * two `aabb`'s. returns `null` if the boxes don't intersect.
     */
    union(aabb: AABB): AABB | null;
}
