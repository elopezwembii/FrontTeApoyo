import {
  Component,
  OnInit,
  OnDestroy,
  Renderer2,
  HostBinding,
  ViewChild
} from '@angular/core';
import {UntypedFormGroup, UntypedFormControl, Validators, FormGroup, FormControl, FormBuilder, FormArray} from '@angular/forms';
import {ToastrService} from 'ngx-toastr';
import {AppService} from '@services/app.service';
import { ModalUserTestComponent } from '@components/modal-user-test/modal-user-test.component';

@Component({
  selector: 'app-tests',
  templateUrl: './tests.component.html',
  styleUrls: ['./tests.component.scss']
})
export class TestsComponent {
  @HostBinding('style') class = 'width: 90%';
  public loginForm: UntypedFormGroup;
  public isLoading = false;
  public read = false;
  public verPersonalidad = false;
  public personalidad:any = "Sin personalidad";
  public definicion:any = "-";
  public preusers:any = 0;

  public fields: any[] = [];
  public form: FormGroup;

  @ViewChild('modalUserTest') modalUserTest: ModalUserTestComponent;

  constructor(
      private renderer: Renderer2,
      private toastr: ToastrService,
      private appService: AppService,
      private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.renderer.addClass(
      document.querySelector('app-root'),
      'login-page'
    );
  }

  preuser(modelo: any){
    this.preusers = modelo;
  }

  preguntasRam(modelo: any[]) {
    this.read = true;
    this.fields = modelo;

    this.form = this.fb.group({
      fields: new FormArray([])
    });
    this.addControls();
  }
  
  addControls() {
    const arr = this.fields.map(element => {
      return this.fb.group({
        pregunta_id: [element.id],
        pregunta: [element.pregunta],
        respuesta_id: [''],
        respuestas: this.fb.array(element.respuestas.map(
          respuesta => this.fb.group({
            id: respuesta.id,
            respuesta: respuesta.respuesta
          })
        ))
      });
    });
    this.form.setControl('fields', this.fb.array(arr));
  }

  get fieldArray() {
    return this.form.get('fields') as FormArray;
  }

  openModal() {
    this.modalUserTest.openModal();
  }

  ngOnDestroy() {
      this.renderer.removeClass(
          document.querySelector('app-root'),
          'login-page'
      );
    }

    onRadioChange(i: number, event: any) {
      const selectedValue = event.target.value;
      if (this.form.get('fields') instanceof FormArray) {
        const fieldsArray = this.form.get('fields') as FormArray;
        if (fieldsArray.at(i).get('respuesta_id')) {
          fieldsArray.at(i).get('respuesta_id').setValue(selectedValue);
        }
      }
    }

    async enviarRespuestas(){
      this.isLoading = true;
      const respuestas = this.form.value.fields;
      const data = [];
      for (let i = 0; i < respuestas.length; i++) {
        let respuesta_id = parseInt(respuestas[i].respuesta_id);
        if (isNaN(respuesta_id)) {
          this.toastr.error('Falta seleccion, en la pregunta "' + respuestas[i].pregunta +'"');
          this.isLoading = false;
          return;
        }
        data.push({
          preusers_id: this.preusers,
          pregunta_id: respuestas[i].pregunta_id,
          respuesta_id: respuesta_id
        });
      }
      let resp:any = await this.appService.submitTest(data);
      this.verPersonalidad = true;
      this.read = false;
      this.personalidad = resp.personalidad;
      this.definicion = resp.definicion;
      this.isLoading = false;
    }

}
