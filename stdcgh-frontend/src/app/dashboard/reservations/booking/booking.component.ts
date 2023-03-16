import { Component } from "@angular/core";

@Component({
    selector: 'app-booking',
    templateUrl: './booking.component.html',
})
export class BookingComponent{
    showSearch: boolean = true;
    showHouses: boolean = false;
    showDetails: boolean = false;
    showAck: boolean = false;
    onShowHouses(data: { status: boolean}){
        this.showHouses = data.status;
        this.showAck = !data.status;
        this.showDetails = !data.status;
        this.showSearch = data.status;
    }
    onShowAck(data: { status: boolean}){
        this.showHouses = !data.status;
        this.showAck = data.status;
        this.showDetails = !data.status;
        this.showSearch = !data.status;
    }
    onShowDetails(data: { status: boolean}){
        this.showHouses = !data.status;
        this.showAck = !data.status;
        this.showDetails = data.status;
    }
}