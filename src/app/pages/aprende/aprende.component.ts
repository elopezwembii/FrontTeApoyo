import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {BlogsService} from './../../services/blogs.service';
import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ToastrService} from 'ngx-toastr';
import {Router} from '@angular/router';

@Component({
    selector: 'app-aprende',
    templateUrl: './aprende.component.html',
    styleUrls: ['./aprende.component.scss']
})
export class AprendeComponent implements OnInit {
    cards = [];
    loadedCards = [];
    cardGroups = [];
    currentPage = 1;
    totalPages = 1;
    pages: number[] = [];
    prevPageUrl: string | null = null;
    nextPageUrl: string | null = null;
    current_page_url: string | null = null;

    rol = JSON.parse(sessionStorage.getItem('user')).rol.nombre;

    categorias: any[] = [];
    categoria_modal: any[] = [];

    idCategoriaActual = 1;

    constructor(
        private blogsService: BlogsService,
        private fb: FormBuilder,
        private toastr: ToastrService,
        private router: Router
    ) {}

    ngOnInit() {
        this.getFirstSixBlogs();
        this.getBlogs();
        this.getCategorias();
    }

    get indicatorIndexes() {
        return Array(this.cardGroups.length)
            .fill(0)
            .map((x, i) => i);
    }

    showMore(card: any) {
        console.log('Mostrar más detalles de la tarjeta:', card);
    }

    goToPage(pageUrl: string | number) {
        if (typeof pageUrl === 'string' && pageUrl.startsWith('http')) {
            const pageNumberMatch = pageUrl.match(/page=(\d+)/);
            if (pageNumberMatch) {
                this.currentPage = parseInt(pageNumberMatch[1], 10);
                this.getBlogs();
            }
        } else if (typeof pageUrl === 'number') {
            this.currentPage = pageUrl;
            this.getBlogs();
        }
    }

    getBlogs(termino?: string) {
        this.loading = true;
        const perPage = 4;
        if (termino) {
            this.blogsService
                .getBlogs(
                    this.currentPage,
                    perPage,
                    this.idCategoriaActual,
                    termino
                )
                .subscribe({
                    next: ({
                        data,
                        prev_page_url,
                        next_page_url,
                        current_page_url,
                        total
                    }: any) => {
                        this.loading = false;
                        this.loadedCards = data;
                        this.prevPageUrl = prev_page_url;
                        this.nextPageUrl = next_page_url;
                        this.current_page_url = current_page_url;

                        this.totalPages = Math.ceil(total / perPage);
                        this.pages = Array(this.totalPages)
                            .fill(0)
                            .map((x, i) => i + 1);
                    }
                });
        } else {
            this.blogsService
                .getBlogs(this.currentPage, perPage, this.idCategoriaActual)
                .subscribe({
                    next: ({
                        data,
                        prev_page_url,
                        next_page_url,
                        current_page_url,
                        total
                    }: any) => {
                        this.loading = false;
                        this.loadedCards = data;
                        this.prevPageUrl = prev_page_url;
                        this.nextPageUrl = next_page_url;
                        this.current_page_url = current_page_url;

                        this.totalPages = Math.ceil(total / perPage);
                        this.pages = Array(this.totalPages)
                            .fill(0)
                            .map((x, i) => i + 1);
                    }
                });
        }
    }

    getFirstSixBlogs() {
        this.blogsService.getFirstSixBlogs(this.idCategoriaActual).subscribe({
            next: ({data}: any) => {
                this.cards = [];
                this.cardGroups = [];
                this.cards = data;

                for (let i = 0; i < this.cards.length; i += 3) {
                    this.cardGroups.push(this.cards.slice(i, i + 3));
                }
            }
        });
    }

    generatePageNumbers() {
        const maxPageNumbers = 10;
        const halfMaxPageNumbers = Math.floor(maxPageNumbers / 2);
        const pages = [];

        for (
            let i = this.currentPage - halfMaxPageNumbers;
            i <= this.currentPage + halfMaxPageNumbers;
            i++
        ) {
            if (i >= 1 && i <= this.totalPages) {
                pages.push(i);
            }
        }

        if (pages[0] > 1) {
            pages.unshift('...');
        }
        if (pages[pages.length - 1] < this.totalPages) {
            pages.push('...');
        }

        return pages;
    }

    getCategorias() {
        this.blogsService.getCategorias().subscribe({
            next: ({data}: any) => {
                this.categorias = data;
                this.categoria_modal = this.categorias.filter(
                    (categoria) => categoria.id !== 1
                );
            }
        });
    }

    categoriaActual: any = null; // Inicialmente no hay categoría seleccionada

    seleccionarCategoria(categoria: any): void {
        this.idCategoriaActual = categoria.id;
        this.categoriaActual = categoria;

        this.getFirstSixBlogs();
        this.getBlogs();
    }

    formulario: FormGroup = this.fb.group({
        termino: ['']
    });
    loading = false;
    buscar() {
        const termino = this.formulario.get('termino').value;
        this.getBlogs(termino);
    }

    limpiar() {
        this.formulario.get('termino').setValue('');
        this.pages;
        this.getBlogs();
    }

    formulario_crear = this.fb.group({
        id: [],
        title: ['', Validators.required],
        content: ['', Validators.required],
        imageUrl: ['', Validators.required],
        categoria_id: [, Validators.required] // Asigna un valor por defecto (ejemplo: categoría 1)
    });

    @ViewChild('crearBlogModal') modal: ElementRef; // Referencia al modal

    crearBlog() {
        if (this.formulario_crear.valid) {
            const formData = this.formulario_crear.value;

            this.blogsService.addCategoria(formData).subscribe({
                complete: () => {
                    this.cerrarModal();
                    this.pages;
                    this.formulario_crear.reset();
                    this.toastr.success('Agregado correctamente!');
                    this.getBlogs();
                    this.getFirstSixBlogs();
                }
            });
        } else {
            this.toastr.error('Campos incompletos');
        }
    }

    cerrarModal() {
        const modal = document.getElementById('crearBlogModal');
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

    tituloModal: string = 'Crear Nuevo Blogs';

    editarCard(blog: any) {
        this.tituloModal = 'Editar Blogs';
        this.formulario_crear.patchValue({
            id: blog.id,
            title: blog.title,
            content: blog.content,
            imageUrl: blog.imageUrl,
            categoria_id: blog.categoria_id
        });
    }

    resetForm() {
        this.tituloModal = 'Crear Nuevo Blogs';
        this.formulario_crear.reset();
    }

    verDetalle(id: number) {
        // Construye la URL utilizando el ID y redirige al detalle del blog
        this.router.navigate(['/blogs', id]);
    }

    eliminarBlog() {
        if (confirm('¿Estás seguro de que quieres eliminar este blog?')) {
            const formId = this.formulario_crear.get('id').value;

            this.blogsService.deleteBlog(formId).subscribe({
                next:(resp:any)=>{
                    this.cerrarModal();
                    this.toastr.success('El Blog se ha eliminado correctamente');
                    this.getBlogs();
                    this.getFirstSixBlogs();
                }
            })

            console.log('Blog eliminado',formId);
        }
    }
}
