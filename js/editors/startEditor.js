class StartEditor extends MarkingEditor{
    constructor(viewport, residentialDistrict){
        super(viewport, residentialDistrict, residentialDistrict.laneGuides);

    }
     
    createMarking(center, directionVector){
        return new Start(
            center,
            directionVector,
            residentialDistrict.roadWidth / 2,
            residentialDistrict.roadWidth / 2
        );
    }
}