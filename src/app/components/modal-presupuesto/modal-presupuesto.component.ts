import { Categoria, ItemPresupuesto, Presupuesto } from '@/interfaces/presupuesto';
import { Component, Input } from '@angular/core';
import { PresupuestoService } from '@services/presupuesto/presupuesto.service';
import * as bootstrap from 'bootstrap'

@Component({
  selector: 'app-modal-presupuesto',
  templateUrl: './modal-presupuesto.component.html',
  styleUrls: ['./modal-presupuesto.component.scss']
})
export class ModalPresupuestoComponent {
  public selectionMonth: number = new Date().getMonth(); // Mover antes
  public selectionYear: number = new Date().getFullYear(); // Mover antes
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
  public month: string = this.arrayMonth[this.selectionMonth];
  public year: number = this.selectionYear;

  opcionesSelect2 = {
    1: [
        'Artículos para el hogar, Mascotas, Limpieza y mantenimiento, Gasto común, Arriendo o dividendo, Asesora del hogar/niñera/cuidadora, Seguro del hogar, Otros gastos del hogar'
    ],
    2: ['Agua, Luz, Gas, Cable/Internet, Alarma, Telefonía'],
    3: [
        'Supermercado, Feria, Agua en botellón, Antojos (bebida, agua, café, snacks), Comida rápida, Gastos en delivery y propinas, Otros alimentos'
    ],
    4: [
        'Juguetes y videojuegos, Suscripciones y apps, Bares, pubs, restaurantes, Espectáculos y eventos, Otros entretenimientos'
    ],
    5: [
        'Perfumes y cosméticos, Salón de belleza/Barbería, Médico/Dentista, Gimnasio (mensual), Arriendo de canchas (deporte), Farmacia, Cuidado personal/Terapias, Otros gastos de salud y belleza'
    ],
    6: [
        'Mantenimiento y reparaciones, Autolavado, Transporte público, Gasolina, Taxi-Uber-Didi, Peajes/Autopistas, Estacionamiento diario, Estacionamiento mensual, Seguro, Otros gastos de auto y transporte'
    ],
    7: [
        'Servicios legales/contables, Otros gastos de educación y trabajo, Colegiatura, Academias/Cuotas de curso, Artículos de librería/escritorio, Transporte escolar, Otros gastos de educación y trabajo'
    ],
    8: [
        'Donaciones, Apoyo a familiares y amigos, Regalos, Otros gastos de regalos y ayuda'
    ],
    9: ['Hospedaje, Vuelos, Otros gastos de viajes'],
    10: [
        'Casas comerciales, Créditos de consumo, Crédito automotriz, Tarjeta de crédito, Línea de crédito, Otros pagos de créditos'
    ],
    11: [
        'Calzado, Accesorios, Lavandería y tintorería, Ropa, Otros gastos de ropa y calzado'
    ],
    12: [
        'Impuestos, Pago de pensión de alimentos, Seguros de vida, Alcohol, Tabaco, Juegos de azar/Apuestas online'
    ],
    13: [
        'AliExpress/Shein, Grandes tiendas/Mercado libre, Otras compras online'
    ],
    14: [
        'Ahorro para celebraciones, Ahorro para cumpleaños, Ahorro para educación, Ahorro para fiestas patrias, Ahorro para fin de semana largo, Ahorro para Navidad/Año Nuevo, Ahorro para viajes/vacaciones, Fondo de emergencia, Ahorro general (varios), Inversiones y Acciones'
    ]
};
  tourStarted = false;
  tourCancelled = false;
  presupuestoSelected: ItemPresupuesto = {} as ItemPresupuesto;
  categorias: Categoria[] = [];

  presupuestoMonto: number = 0;
  presupuesto: Presupuesto = {} as Presupuesto;
  itemsPresupuesto: ItemPresupuesto[] = [];
  loading: boolean = false;

  sumaTotalReal: number = 0;

  isEditing: boolean = false;
  isAdding: boolean = false;
  graficoDonaPresupuesto: any;
  gastosGraficoBarra: any;
  @Input() titulo: string = 'Presupuesto';
  myModal: any;
  selectedCategoryIds: number[] = [];

  get getFecha() {
      return `${this.year}/${this.selectionMonth + 1}/01`;
  }

  constructor(
    private presupuestoService: PresupuestoService,
  ) {}

  ngOnInit(): void {
    this.myModal = new bootstrap.Modal(document.getElementById('modalPresupuesto'), {});
    this.obtenerPresupuesto();
    this.presupuestoService.obtenerCategoria().subscribe({
      next: (resp: any) => {
          this.categorias = resp;
      }
  });
  }
  
  onCategoryChange(categoryId: number, isChecked: boolean): void {
    if (isChecked) {
      this.selectedCategoryIds.push(categoryId); // Añadir ID si está seleccionado
    } else {
      this.selectedCategoryIds = this.selectedCategoryIds.filter(id => id !== categoryId); // Quitar ID si se deselecciona
    }
  }

  async obtenerPresupuesto() {
    this.loading = true;
    this.presupuestoMonto = 0;
    (
        await this.presupuestoService.getPresupuesto(
            this.selectionMonth + 1,
            this.year
        )
    ).subscribe({
        next: ({presupuesto}: {presupuesto: Presupuesto}) => {
            this.presupuesto = presupuesto;
            this.sumaTotalReal = presupuesto.presupuesto;
            this.itemsPresupuesto = this.presupuesto.get_items;
            this.presupuesto.get_items.map(
                (item) => (this.presupuestoMonto += item.monto)
            );
            this.loading = false;
        },
        error: (error: any) => {
            console.log(error);
        }
    });
  }

  openModal() {
    this.myModal.show(); // Mostrar el modal
  }

  closeModal() {
    this.myModal.hide(); // Ocultar el modal
  }
}
