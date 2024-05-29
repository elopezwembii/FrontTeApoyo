import {ActivatedRoute, Router} from '@angular/router';
import {Component, OnInit} from '@angular/core';
import {BlogsService} from '@services/blogs.service';
import {Editor, Toolbar, Validators} from 'ngx-editor';
import {AbstractControl, FormControl, FormGroup} from '@angular/forms';

import {ToastrService} from 'ngx-toastr';

@Component({
    selector: 'app-aprende-detalle',
    templateUrl: './aprende-detalle.component.html',
    styleUrls: ['./aprende-detalle.component.scss']
})
export class AprendeDetalleComponent implements OnInit {
    blogs: any = {};
    rol = JSON.parse(sessionStorage.getItem('user')).rol.nombre;
    idblog: number = 0;
    form: FormGroup; // Declarar el FormGroup

    constructor(
        private route: ActivatedRoute,
        private blogService: BlogsService,
        private router: Router,
        private toastr: ToastrService
    ) {}

    ngOnInit(): void {
        this.form = new FormGroup({
            editorContent: new FormControl(
                {value: this.vacio, disabled: this.rol !== 'Administrador'},
                Validators.required()
            )
        });

        // Accede al valor del parámetro 'id' desde ActivatedRoute
        this.route.params.subscribe((params) => {
            this.idblog = params['id'];
            const id = params['id'];

            this.getBlogId(id);
        });

        this.editor = new Editor();
    }

    getBlogId(id: number) {
        this.blogService.getBlogsId(id).subscribe({
            next: ({data}: any) => {
                this.blogs = data;
                console.log(this.blogs.description);

                // Parsea la descripción del blog como JSON antes de asignarla al control
                const parsedDescription = JSON.parse(this.blogs.description);

                // Luego de obtener los datos del blog, asigna el valor parseado a editorContent
                this.form.get('editorContent').setValue(parsedDescription);
            }
        });
    }

    atras() {
        this.router.navigate(['/aprende']);
    }

    editor: Editor;
    toolbar: Toolbar = [
        ['bold', 'italic'],
        ['underline', 'strike'],
        ['code', 'blockquote'],
        ['ordered_list', 'bullet_list'],
        [{heading: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6']}],
        ['link', 'image'],
        ['text_color', 'background_color'],
        ['align_left', 'align_center', 'align_right', 'align_justify']
    ];

    vacio: any = {
        type: 'doc',
        content: []
    };

    ngOnDestroy(): void {
        this.editor.destroy();
    }

    guardar() {
        // Convierte editorContent a una cadena (string)
        const editorContentAsString = JSON.stringify(
            this.form.get('editorContent').value
        );

        this.blogService
            .updateDescriptionBlog(this.idblog, editorContentAsString)
            .subscribe({
                next: (resp) => {
                    this.getBlogId(this.idblog);
                    this.toastr.success('Agregado correctamente!');
                }
            });
    }
}
