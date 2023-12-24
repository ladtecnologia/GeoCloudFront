import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastService } from './toast-service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

/**
 * Login Component
 */
export class LoginComponent implements OnInit {

  // Login Form
  loginForm!: UntypedFormGroup;
  submitted = false;
  fieldTextType!: boolean;
  error = '';
  returnUrl!: string;

  // set the current year
  year: number = new Date().getFullYear();
  // Carousel navigation arrow show
  showNavigationArrows: any;

  constructor(private formBuilder: UntypedFormBuilder,
              private router: Router,
              public toastService: ToastService) { }

  ngOnInit(): void {
    // Form Validation
    this.loginForm = this.formBuilder.group({
      email: ['adm@geocloudai.com', [Validators.required, Validators.email]],
      password: ['GeoCloudAI_2024', Validators.required],
    });
  }
 
  get f() { return this.loginForm.controls; }

  // Form submit
  onSubmit() {
    this.submitted = true;
    
    if (this.loginForm.invalid) {
      return;
    }

    if (this.f['email'].value == 'adm@geocloudai.com' && this.f['password'].value == 'GeoCloudAI_2024') {
      this.router.navigate(['/pages/crm/users']);
    } else {
      this.toastService.show('Email or password incorrect !', { classname: 'bg-danger text-white', delay: 5000 });
    }
  }

  // Password Hide/Show
  toggleFieldTextType() {
    this.fieldTextType = !this.fieldTextType;
  }

}
