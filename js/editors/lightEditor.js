class LightEditor extends MarkingEditor{
    constructor(viewport, residentialDistrict){
        super(viewport, residentialDistrict, residentialDistrict.laneGuides);

    }
     
    createMarking(center, directionVector){
        return new Light(
            center,
            directionVector,
            residentialDistrict.roadWidth / 2,
            residentialDistrict.roadWidth / 2
        );
    }
}