import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AppService } from '@services/app.service';
import * as bootstrap from 'bootstrap';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-modal-user-test',
  templateUrl: './modal-user-test.component.html',
  styleUrls: ['./modal-user-test.component.scss']
})
export class ModalUserTestComponent {

  @Output() preguntas: EventEmitter<any[]> = new EventEmitter();
  @Output() preuser: EventEmitter<any[]> = new EventEmitter();

  titulo = 'Autentiquese para realizar el test';
  myModal: any;
  public isAuthLoading = false;
  public isGoogleLoading = false;

  constructor(
    private fb: FormBuilder,
    private appService: AppService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {

    this.myModal = new bootstrap.Modal(
      document.getElementById('modalUserTest'),
      {}
    );    
  }

  form: FormGroup = this.fb.group({
    email: [, [Validators.required]],
    autoriza: []
  });

  async submit() {

    if (this.form.valid) {
        try {
          this.myModal.hide();
          this.isAuthLoading = true;
          let data = this.form.value;
          data.autoriza = data.autoriza ? 1 : 0;
          
          let resp:any = await this.appService.userTest(data);
          if (Array.isArray(resp.preguntas)) {
            this.preguntas.emit(resp.preguntas);
            this.preuser.emit(resp.user);
          }
          this.isAuthLoading = false;
        } catch (error) {
          console.error(error);
        }
    } else {
      this.toastr.error('Debe ingresar su email, para realizar el test de personalidad financiera');
    }

  }

  openModal(data: any = null) {
    this.myModal.show();
  }

}
