class TargetEditor extends MarkingEditor{
    constructor(viewport, residentialDistrict){
        super(viewport, residentialDistrict, residentialDistrict.laneGuides);

    }
     
    createMarking(center, directionVector){
        return new Target(
            center,
            directionVector,
            residentialDistrict.roadWidth / 2,
            residentialDistrict.roadWidth / 2
        );
    }
}