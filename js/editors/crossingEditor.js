class CrossingEditor extends MarkingEditor{
    constructor(viewport, residentialDistrict){
        super(viewport, residentialDistrict, residentialDistrict.graph.segments);
    }


    createMarkings(center, directionVector) {
        return new Crossing(
            center,
            directionVector,
            residentialDistrict.roadWidth,
            residentialDistrict.roadWidth / 2
        );
    } 
}