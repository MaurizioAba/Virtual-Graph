class ParkingEditor extends MarkingEditor{
    constructor(viewport, residentialDistrict){
        super(viewport, residentialDistrict, residentialDistrict.laneGuides);

    }
     
    createMarking(center, directionVector){
        return new Parking(
            center,
            directionVector,
            residentialDistrict.roadWidth / 2,
            residentialDistrict.roadWidth / 2
        );
    }
}