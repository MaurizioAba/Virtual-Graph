const HALF_PI = Math.PI / 2;

class Envelope {
    constructor(skeleton, width, roundness = 1) {
        if(skeleton) {
        this.skeleton = skeleton;
        this.poly = this.generatePolygon(width, roundness);
        }
    }

    static load(info) {
        const env = new Envelope();
        env.skeleton = new getNearestSegment(info.skeleton.p1, info.skeleton.p2);
        env.poly = Polygon.load(info.poly);
        return env;
    }

    generatePolygon(width, roundness) {
        const { p1, p2 } = this.skeleton;
        const radius = width / 2;
        const alpha = angle(subtract(p1, p2));
        const alpha_cw = alpha + HALF_PI;
        const alpha_ccw = alpha - HALF_PI;

        const points = this.generatePoints(p1, alpha_ccw, alpha_cw, radius, roundness)
            .concat(this.generatePoints(p2, Math.PI + alpha_ccw, Math.PI + alpha_cw, radius, roundness));

        return new Polygon(points);
    }

    generatePoints(center, start, end, radius, roundness) {
        const points = [];
        const step = Math.PI / Math.max(1, roundness);
        const eps = step / 2;

        for (let i = start; i <= end + eps; i += step) {
            points.push(translate(center, i, radius));
        }

        return points;
    }

    draw(ctx, options) {
        this.poly.draw(ctx, options);
    }
}
