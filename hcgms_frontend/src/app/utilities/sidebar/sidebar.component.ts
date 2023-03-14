import { Renderer2,Component, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { LocalStorageService } from 'src/app/services/local-storage-service/local-storage.service';
@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
  role: number = 0;
  constructor(private _renderer2: Renderer2, @Inject(DOCUMENT) private _document: Document, private localStorageService: LocalStorageService) {
  }
  ngOnInit():void{
    this.role = this.localStorageService.getRoleId();
    this.injectScript();
  }
  async injectScript(){
    let script = await this._renderer2.createElement('script');
    script.type = 'text/javascript';
    script.text = "let btn = document.getElementById('btn');let sideBar = document.querySelector('.sidebar');btn.onclick=function(){sideBar.classList.toggle('closed')};let arrow = document.querySelectorAll('.parent');for(var i=0;i<arrow.length;i++){arrow[i].addEventListener('click',(e)=>{let arrowParent = e.target.parentElement.parentElement.parentElement;arrowParent.classList.toggle('showMenu')})};let arrow1 = document.querySelectorAll('.arrow');for(var i=0;i<arrow1.length;i++){arrow1[i].addEventListener('click',(e)=>{let arrowParent = e.target.parentElement.parentElement;arrowParent.classList.toggle('showMenu')})}"
    await this._renderer2.appendChild(this._document.body, script);
  }
}
