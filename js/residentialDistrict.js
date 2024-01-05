class residentialDistrict {
    constructor(graph, roadWidth = 100, roadRoundness = 10) {
       this.graph = graph;
       this.roadWidth = roadWidth;
       this.roadRoundness = roadRoundness;
 
       this.envelopes = [];
       this.roadBorders = [];
 
       this.generate();
    }
 
    generate() {
        this.envelopes = this.graph.segments.map(seg =>
            new Envelope(seg, this.roadWidth, this.roadRoundness)
        );

        this.roadBorders = Polygon.union(this.envelopes.map(e => e.poly));
    }

    draw(ctx) {
        const commonDrawOptions = { color: "white", width: 4 };

        this.envelopes.forEach(env => env.draw(ctx, { fill: "#BBB", stroke: "#BBB", lineWidth: 15 }));
        this.graph.segments.forEach(seg => seg.draw(ctx, { ...commonDrawOptions, dash: [10, 10] }));
        this.roadBorders.forEach(seg => seg.draw(ctx, commonDrawOptions));
    }
}