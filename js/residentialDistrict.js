class residentialDistrict {
    constructor(graph, 
        roadWidth = 100, 
        roadRoundness = 10,
        buildingWidth = 150,
        buildingMinLength = 150,
        spacing = 50,
        treeSize = 160
       ) {
        this.graph = graph;
        this.roadWidth = roadWidth;
        this.roadRoundness = roadRoundness;
        this.buildingWidth = buildingWidth;
        this.buildingMinLength = buildingMinLength;
        this.spacing = spacing;
        this.treeSize = treeSize;

        this.envelopes = [];
        this.roadBorders = [];
        this.buildings = [];
        this.trees = [];
        this.laneGuides = [];
 
       this.envelopes = [];
       this.roadBorders = [];
 
       this.markings = [];

       this.generate();
    }

    static load(info){
      const residentialdistrict= new residentialDistrict(new Graph());
      residentialdistrict.graph = Graph.load(info.graph);
      residentialdistrict.roadWidth = info.roadWidth;
      residentialdistrict.roadRoundness = info.roadRoundness;
      residentialdistrict.buildingWidth = info.buildingWidth;
      residentialdistrict.buildingMinLength = info.buildingMinLength;
      residentialdistrict.spacing = info.spacing;
      residentialdistrict.treeSize = info.treeSize;
      residentialdistrict.envelopes = info.envelopes.map((e) => Envelope.load(e));
      residentialdistrict.roadBorders = info.roadBorders.map((b) => new Segment(b.p1, b.p2));
      residentialdistrict.buildings = info.buildings.map((e) => Building.load(e));
      residentialdistrict.trees = info.trees.map((t) => new Tree(t.center, info.treeSize));
      residentialdistrict.laneGuides = info.laneGuides.map((g) => new Segment(g.p1, g.p2));
      residentialdistrict.info.markings.map((m)=> Markings.load(m));
      residentialdistrict.zoom = info.zoom;
      residentialdistrict.offset = info.offset;
      return residentialdistrict;
    }
 
    generate() {
        this.envelopes.length = 0;
        this.envelopes = this.graph.segments.map(seg =>
            new Envelope(seg, this.roadWidth, this.roadRoundness)
        );

        this.roadBorders = Polygon.union(this.envelopes.map((e) => e.poly));
        this.buildings = this.#generateBuildings();
        this.trees = this.#generateTrees();

        this.laneGuides.length = 0;
        this.laneGuides.push(...this.#generateLaneGuides());
    }

    #generateLaneGuides() {
      const tmpEnvelopes = [];
        for (const seg of this.graph.segments) {
           tmpEnvelopes.push(
              new Envelope(
                 seg,
                 this.roadWidth / 2,
                 this.roadRoundness
              )
           );
        }
        const segments = Polygon.union(tmpEnvelopes.map((e) => e.poly));
        return segments;
    }

    #generateTrees() {
        const points = [
           ...this.roadBorders.map((s) => [s.p1, s.p2]).flat(),
           ...this.buildings.map((b) => b.base.points).flat()
        ];
        const left = Math.min(...points.map((p) => p.x));
        const right = Math.max(...points.map((p) => p.x));
        const top = Math.min(...points.map((p) => p.y));
        const bottom = Math.max(...points.map((p) => p.y));
  
        const illegalPolys = [
           ...this.buildings.map((b) => b.base ),
           ...this.envelopes.map((e) => e.poly)
        ];
  
        const trees = [];
        let tryCount = 0;
        while (tryCount < 100) {
           const p = new Point(
              lerp(left, right, Math.random()),
              lerp(bottom, top, Math.random())
           );
  
           let keep = true;
           for (const poly of illegalPolys) {
              if (poly.containsPoint(p) || poly.distanceToPoint(p) < this.treeSize / 2) {
                 keep = false;
                 break;
              }
           }
  
           if (keep) {
              for (const tree of trees) {
                 if (distance(tree.center, p) < this.treeSize) {
                    keep = false;
                    break;
                 }
              }
           }
  
           if (keep) {
              let closeToSomething = false;
              for (const poly of illegalPolys) {
                 if (poly.distanceToPoint(p) < this.treeSize * 2) {
                    closeToSomething = true;
                    break;
                 }
              }
              keep = closeToSomething;
           }
  
           if (keep) {
            trees.push(new Tree(p, this.treeSize));
            tryCount = 0;
           }
           tryCount++;
        }
        return trees;
     }

     #generateBuildings() {
        const tmpEnvelopes = [];
        for (const seg of this.graph.segments) {
           tmpEnvelopes.push(
              new Envelope(
                 seg,
                 this.roadWidth + this.buildingWidth + this.spacing * 2,
                 this.roadRoundness
              )
           );
           
        }
  
        const guides = Polygon.union(tmpEnvelopes.map((e) => e.poly));
  
        for (let i = 0; i < guides.length; i++) {
           const seg = guides[i];
           if (seg.length() < this.buildingMinLength) {
              guides.splice(i, 1);
              i--;
           }
        }
  
        const supports = [];
        for (let seg of guides) {
           const len = seg.length() + this.spacing;
           const buildingCount = Math.floor(
              len / (this.buildingMinLength + this.spacing)
           );
           const buildingLength = len / buildingCount - this.spacing;
  
           const dir = seg.directionVector();
  
           let q1 = seg.p1;
           let q2 = add(q1, scale(dir, buildingLength));
           supports.push(new Segment(q1, q2));
  
           for (let i = 2; i <= buildingCount; i++) {
              q1 = add(q2, scale(dir, this.spacing));
              q2 = add(q1, scale(dir, buildingLength));
              supports.push(new Segment(q1, q2));
           }
        }
  
        const bases = [];
        for (const seg of supports) {
           bases.push(new Envelope(seg, this.buildingWidth).poly);
        }
  
        const eps = 0.001;
        for (let i = 0; i < bases.length - 1; i++) {
           for (let j = i + 1; j < bases.length; j++) {
              if (
                 bases[i].intersectsPoly(bases[j]) ||
                 bases[i].distanceToPoly(bases[j]) < this.spacing - eps
              ) {
                 bases.splice(j, 1);
                 j--;
              }
           }
        }

        return bases.map((b) => new Building(b));
     }

     draw(ctx, viewPoint) {
        const commonDrawOptions = { color: "white", width: 4 };
    
        this.envelopes.forEach(env => env.draw(ctx, { fill: "#BBB", stroke: "#BBB", lineWidth: 15 }));
        for (const markings of this.markings){
         markings.draw(ctx);
        }
        this.graph.segments.forEach(seg => seg.draw(ctx, { ...commonDrawOptions, dash: [10, 10] }));
        this.roadBorders.forEach(seg => seg.draw(ctx, commonDrawOptions));
    
        const items = [...this.buildings, ...this.trees];
        items.sort(
         (a, b) =>
            b.base.distanceToPoint(viewPoint) -
            a.base.distanceToPoint(viewPoint)
        );
        for (const item of items) {
            item.draw(ctx, viewPoint);
         }

         // for(const seg of this.laneGuides){
         //    seg.draw(ctx, {
         //       color:"red"
         //    });
         // }

      }
}