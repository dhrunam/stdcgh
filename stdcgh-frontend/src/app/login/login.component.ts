import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { AuthService } from '../services/auth-service/auth.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  error = null;
  constructor(private authService: AuthService, private router: Router, private route: ActivatedRoute){}
  login(data:NgForm){
    if(!data.valid){
      data.control.markAllAsTouched();
    }
    else{
      this.error = null;
      let fd = new FormData();
      fd.append('username', data.value.username);
      fd.append('password', data.value.password);
      fd.append('client', 'web');
      this.authService.onLogin(fd).subscribe({
        next: data => {
          this.router.navigate(['/dashboard'], { relativeTo: this.route } );
        },
        error: err => { this.error = err; console.log(err) },
      });
      data.reset();
    }
  }
}
