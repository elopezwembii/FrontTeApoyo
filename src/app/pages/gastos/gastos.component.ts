import {UiState} from '@/store/ui/state';
import {Component, OnInit, Renderer2} from '@angular/core';
import {FormBuilder, Validators, FormsModule} from '@angular/forms';
import {EChartsOption} from 'echarts';

export interface Gasto {
    id: number;
    desc: string;
    recurrente: boolean;
    tipo: number;
    subtipo: number;
    dia: number;
    mes: number;
    anio: number;
    monto: number;
}

@Component({
    selector: 'app-gastos',
    templateUrl: './gastos.component.html',
    styleUrls: ['./gastos.component.scss']
})
export class GastosComponent {



    // Mock Users Data
    gastos: Gasto[] = [
        {
            id: 1,
            desc: 'Gasto1',
            recurrente: false,
            tipo: 2,
            subtipo: 1,
            dia: 2,
            mes: 4,
            anio: 2023,
            monto: 120000
        },
        {
            id: 2,
            desc: 'Gasto2',
            recurrente: true,
            tipo: 3,
            subtipo: 3,
            dia: null,
            mes: null,
            anio: null,
            monto: 150000
        }
    ];

    gastoSelected: Gasto = {} as Gasto;
    isEditing: boolean = false;
    isAdding: boolean = false;



    public arrayMonth = [
        'Enero',
        'Febrero',
        'Marzo',
        'Abril',
        'Mayo',
        'Junio',
        'Julio',
        'Agosto',
        'Septiembre',
        'Octubre',
        'Noviembre',
        'Diciembre'
    ];
    public selectionMonth: number = new Date().getMonth();
    public selectionYear: number = new Date().getFullYear();

    public month: string = this.arrayMonth[this.selectionMonth];
    public year: number = this.selectionYear;


    options: EChartsOption = {
      tooltip: {
          trigger: 'axis',
          axisPointer: {
              type: 'shadow'
          }
      },
      legend: {},
      grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
      },
      xAxis: {
          type: 'value',
          boundaryGap: [0, 0.01]
      },
      yAxis: {
          type: 'category',
          data: ['Marzo', 'Abril']
      },
      series: [
          {
              name: 'Formales',
              type: 'bar',
              data: [this.year, 1400000],
              itemStyle: {
                color:'#bceaf3'
              }
          },
          {
              name: 'Informales',
              type: 'bar',
              data: [200000, 190000],
              itemStyle: {
                color:'#ffd48f'
              }
          }
      ]
  };


    form = this.fb.group({
      id: [''],
      desc: ['', [Validators.required]],
      recurrente: [false],
      tipo: [''],
      subtipo: [''],
      dia: [''],
      mes: [(this.selectionMonth + 1)],
      anio: [this.year],
      monto: ['']
  });

    constructor(private renderer: Renderer2, private fb: FormBuilder) {}

    addMonth() {
        this.selectionMonth++;
        if (this.selectionMonth > 11) {
            this.selectionMonth = 0;
            this.year++;
        }
        this.month = this.arrayMonth[this.selectionMonth];
    }

    removeMonth() {
        this.selectionMonth--;
        if (this.selectionMonth < 0) {
            this.selectionMonth = 11;
            this.year--;
        }
        this.month = this.arrayMonth[this.selectionMonth];
    }

    selectUser(gasto: Gasto) {
        if (Object.keys(this.gastoSelected).length === 0) {
            this.gastoSelected = gasto;
            this.isEditing = true;
            this.isAdding = true;
            this.form.patchValue({
                desc: gasto.desc,
                recurrente: gasto.recurrente,
                tipo: String(gasto.tipo),
                subtipo: String(gasto.subtipo),
                dia: String(gasto.dia),
                mes: gasto.mes,
                anio: gasto.anio,
                monto: String(gasto.monto)
            });
        }
    }

    deleteUser(index: number) {
        if (confirm('Are you sure you want to delete this user?')) {
            this.gastos.splice(index, 1);
        }
    }

    generateId() {
        return this.gastos.length;
    }

    update() {
        if (!this.isEditing) {
            this.gastos[0] = {
                id: this.generateId(),
                desc: this.form.value.desc!,
                recurrente: Boolean(this.form.value.recurrente!),
                tipo: parseInt(this.form.value.tipo!),
                subtipo: parseInt(this.form.value.subtipo!),
                dia: parseInt(this.form.value.dia!),
                mes: this.form.value.mes!,
                anio: this.form.value.anio!,
                monto: parseInt(this.form.value.monto!)
            };
        } else {
            let index = this.gastos
                .map((u) => u.id)
                .indexOf(this.gastoSelected.id);

            this.gastos[index] = {
                id: this.gastoSelected.id,
                desc: this.form.value.desc!,
                recurrente: Boolean(this.form.value.recurrente!),
                tipo: parseInt(this.form.value.tipo!),
                subtipo: parseInt(this.form.value.subtipo!),
                dia: parseInt(this.form.value.dia!),
                mes: this.form.value.mes!,
                anio: this.form.value.anio!,
                monto: parseInt(this.form.value.monto!)
            };
        }

        // clean up
        this.gastoSelected = {} as Gasto;
        this.isEditing = false;
        this.isAdding = false;
        this.form.reset();
    }

    cancel() {
        if (
            !this.isEditing &&
            confirm(
                'All unsaved changes will be removed. Are you sure you want to cancel?'
            )
        ) {
            this.gastos.splice(0, 1);
        }

        this.gastoSelected = {} as Gasto;
        this.isEditing = false;
        this.isAdding = false;
        this.form.reset();
    }

    addUser() {
        this.gastos.unshift({
            id: null,
            desc: '',
            recurrente: false,
            tipo: 0,
            subtipo: 0,
            dia: 0,
            mes: 0,
            anio: 0,
            monto: 0
        });

        this.gastoSelected = this.gastos[0];
        this.isAdding = true;
    }

    isEmpty(obj: any) {
        return Object.keys(obj).length === 0;
    }
}
