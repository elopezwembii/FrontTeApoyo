import {Ahorro, TipoAhorro} from '@/interfaces/ahorro';
import {Gasto} from '@/interfaces/gastos';
import {
    Component,
    ElementRef,
    OnInit,
    Renderer2,
    ViewChild
} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {ModalAhorroComponent} from '@components/modal-ahorro/modal-ahorro.component';
import {AhorroService} from '@services/ahorro/ahorro.service';
import {GastosService} from '@services/gastos/gastos.service';
import {ToastrService} from 'ngx-toastr';

@Component({
    selector: 'app-ahorros',
    templateUrl: './ahorros.component.html',
    styleUrls: ['./ahorros.component.scss']
})
export class AhorrosComponent implements OnInit {
    ahorros: Ahorro[] = [];
    historial: any = [];
    loading: boolean = false;
    change: boolean = false;
    fechaActual = new Date();
    ahorros2: any = [];
    historial2: any = [];
    diasDelMesActual: number[] = [];
    selectedTipoAhorro: any;
    user = JSON.parse(sessionStorage.getItem('user')).user.id;
    selectedTipoAhorroNombre: any;
    selectedTipoAhorroId: any;

    @ViewChild('modalAhorro') modalAhorro: ModalAhorroComponent;

    public tiposAhorro: TipoAhorro[] = [
        {
            id: 1,
            descripcion: 'Ahorro celebraciones',
            img: 'assets/img/ahorro/ahorro1.svg'
        },
        {
            id: 2,
            descripcion: 'Ahorro cumpleaños',
            img: 'assets/img/ahorro/ahorro1.svg'
        },
        {
            id: 3,
            descripcion: 'Ahorro Educación',
            img: 'assets/img/ahorro/ahorro1.svg'
        },
        {
            id: 4,
            descripcion: 'Ahorro fiestas patrias',
            img: 'assets/img/ahorro/ahorro1.svg'
        },
        {
            id: 5,
            descripcion: 'Ahorro fin de semana largo',
            img: 'assets/img/ahorro/ahorro3.svg'
        },
        {
            id: 6,
            descripcion: 'Ahorro navidad/año nuevo',
            img: 'assets/img/ahorro/ahorro1.svg'
        },
        {
            id: 7,
            descripcion: 'Ahorro viajes/vacaciones',
            img: 'assets/img/ahorro/ahorro3.svg'
        },
        {
            id: 8,
            descripcion: 'Fondo de emergencia',
            img: 'assets/img/ahorro/ahorro4.svg'
        },
        {
            id: 9,
            descripcion: 'Ahorro general (varios)',
            img: 'assets/img/ahorro/ahorro1.svg'
        },
        {
            id: 10,
            descripcion: 'Inversiones y Acciones',
            img: 'assets/img/ahorro/ahorro1.svg'
        }
    ];

    ahorroForm = this.fb.group({
        descripcion: ['', Validators.required],
        monto: ['', [Validators.required, Validators.min(1)]],
        fecha: [this.fechaActual.getDate(), Validators.required]
    });

    setDiasDelMesActual(): void {
        const diasEnMes = new Date(
            this.fechaActual.getFullYear(),
            this.fechaActual.getMonth() + 1,
            0
        ).getDate();
        this.diasDelMesActual = Array.from(
            {length: diasEnMes},
            (_, i) => i + 1
        );
    }

    constructor(
        private ahorroService: AhorroService,
        private toastr: ToastrService,
        private fb: FormBuilder,
        private gastoService: GastosService,
        private renderer: Renderer2,
        private el: ElementRef
    ) {}
    ngOnInit() {
        this.obtenerAhorros();
        this.obtenerAhorros2()
        this.setDiasDelMesActual();
    }

    cerrarModal() {
        const modal = document.getElementById('modalRegistroAhorroEfectuado');
        modal.style.display = 'none';
        modal.setAttribute('aria-hidden', 'true');
        modal.classList.remove('show');

        // Elimina TODOS los fondos oscuros (backdrops)
        const backdrops = document.querySelectorAll('.modal-backdrop');
        backdrops.forEach((backdrop) => {
            document.body.removeChild(backdrop);
        });

        // Restaurar el scroll en el body si es necesario
        document.body.style.paddingRight = '0';
        document.body.classList.remove('modal-open');
    }

    setTipoAhorro(tipo: any, nombre: any, id: any) {
        this.selectedTipoAhorro = tipo;
        this.selectedTipoAhorroNombre = nombre;
        this.selectedTipoAhorroId = id;
    }

    async guardarAhorroEfectuado(): Promise<void> {
        if (this.ahorroForm.valid) {
            const descripcion = this.ahorroForm.get('descripcion').value;
            const monto: number = +this.ahorroForm.get('monto').value;
            const dia = this.ahorroForm.get('fecha').value;

            const gasto: Gasto = {
                id: 0,
                desc: descripcion,
                fijar: 0,
                tipo_gasto: 14,
                subtipo_gasto: this.selectedTipoAhorro,
                dia: dia,
                mes: this.fechaActual.getMonth() + 1,
                anio: this.fechaActual.getFullYear(),
                monto: monto
            };

            this.actualizarMonto(this.selectedTipoAhorroId, monto);

            const res = await this.gastoService.agregarGastoAsociandoAhorro(
                gasto,
                this.selectedTipoAhorroId
            );

            if (res) {
                this.cerrarModal();
                this.toastr.success('Ingresado correctamente');
            } else {
                this.toastr.error('Error al agregar un nuevo gasto.');
                this.loading = false;
            }

            this.ahorroForm.setValue({
                descripcion: '',
                monto: '',
                fecha: this.fechaActual.getDate()
            });
        } else {
            this.toastr.error(
                'Por favor completa todos los campos correctamente.'
            );
        }
    }

    async obtenerAhorros() {
        this.change = !this.change;
        this.loading = true;

        (await this.ahorroService.obtenerAhorros()).subscribe({
            next: ({ahorros, historial}: {ahorros: any; historial: any}) => {
                this.ahorros = ahorros;
                this.historial = historial;
                this.loading = false;
            },
            error: (error: any) => {}
        });
                        console.log({
                            historial: this.historial,
                            ahorros: this.ahorros
                        });
    }

    async obtenerAhorros2() {
        this.change = !this.change;
        this.loading = true;
    
        try {
            const data: any = await this.ahorroService.getAhorros(this.user);
    
            const monthNames = [
                "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
                "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
            ];
    
            this.ahorros2 = Object.keys(data).map((month) => {
                const [year, monthIndex] = month.split('-');
                const monthName = monthNames[parseInt(monthIndex) - 1];
                return {
                    year: monthName + ' ' + year,
                    amount: data[month].recaudado
                };
            });
            
            // Asigna el array transformado a `historial`
            this.historial2 = this.ahorros2;
            this.loading = false;
            console.log(this.historial2);
        } catch (error) {
            this.loading = false;
            console.error('Error al obtener ahorros:', error);
        }
    }
    
    
    

    async eliminarAhorro(ahorro: Ahorro) {
        if (confirm('¿Estás seguro de eliminar el ahorro?')) {
            const res = this.ahorroService.eliminarAhorro(ahorro);
            if (res) {
                this.obtenerAhorros();
                this.toastr.success('Ahorro eliminado');
            } else {
                this.toastr.error('Error');
                this.loading = false;
            }
        }
    }

    openModal(ahorro: Ahorro = null) {
        this.modalAhorro.openModal(ahorro, this.ahorros);
    }

    actualizarAhorro(ahorroMod: Ahorro[]) {
        this.ahorros = ahorroMod;
    }

    actualizarCarga(loading: boolean) {
        this.loading = loading;
    }

    calculoMontoMensual(fecha, meta, recaudado) {
        let dia1 = new Date();
        let dia2 = new Date(fecha);
        let diferenciaMilisegundos: number = dia2.getTime() - dia1.getTime();
        let mesesDiferencia: number =
            diferenciaMilisegundos / (1000 * 60 * 60 * 24 * 30.4375);
        const mesesDiferenciaRedondeado: number = Math.round(mesesDiferencia);
        if (mesesDiferenciaRedondeado === 0) {
            return meta - recaudado;
        } else {
            return (meta - recaudado) / mesesDiferenciaRedondeado;
        }
    }

    actualizarMonto(id, monto) {
        this.ahorroService.actualizarMontoAhorro(id, monto).subscribe({
            next: (resp) => {
                this.obtenerAhorros();
            }
        });
    }
}
