import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-tab4',
  templateUrl: './tab4.page.html',
  styleUrls: ['./tab4.page.scss'],
})
export class Tab4Page implements OnInit {

  path : string;
  check : Boolean = false;

  constructor(private route : ActivatedRoute) { }

  ngOnInit() {
    let temp = this.route.snapshot.paramMap.get('path');
    this.path = temp;
    if(this.path != null){
      this.check = true;
    }
    
  }

}
