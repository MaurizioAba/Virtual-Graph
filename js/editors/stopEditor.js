class StopEditor extends MarkingEditor{
    constructor(viewport, residentialDistrict){
        super(viewport, residentialDistrict, residentialDistrict.laneGuides);

    }
     
    createMarking(center, directionVector){
        return new Stop(
            center,
            directionVector,
            residentialDistrict.roadWidth / 2,
            residentialDistrict.roadWidth / 2
        );
    }
}