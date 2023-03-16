import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TaxService } from '../tax.service';
@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.css']
})
export class ViewComponent {
  showLoader: boolean = false;
  taxes: any = [];
  constructor(private taxService: TaxService, private router: Router, private route: ActivatedRoute){}

  ngOnInit():void{
    this.getTaxes();
  }
  onRouteAddTax(){
    this.router.navigate(['../add'], { relativeTo: this.route } );
  }
  onRouteEditTax(id:number){
    this.router.navigate(['../','edit',id], { relativeTo: this.route } );
  }
  onDisableTax(is_applicable: boolean, id: number){
    let fd = new FormData();
    fd.append('is_applicable', is_applicable.toString());
    fd.append('id', id.toString());
    this.showLoader = true;
    this.taxService.updateTax(fd).subscribe({
      next: () => this.getTaxes,
    })
  }
  getTaxes(){
    this.showLoader = true;
    this.taxService.getTaxs().subscribe({
      next: data => {
        this.taxes = data;
        this.showLoader = false;
      }
    })
  }
}
