import {ActivatedRoute, Router} from '@angular/router';
import {Component} from '@angular/core';
import {BlogsService} from '@services/blogs.service';
import {Editor, Toolbar, Validators} from 'ngx-editor';
import {AbstractControl, FormControl, FormGroup} from '@angular/forms';

import jsonDoc from './doc';

@Component({
    selector: 'app-aprende-detalle',
    templateUrl: './aprende-detalle.component.html',
    styleUrls: ['./aprende-detalle.component.scss']
})
export class AprendeDetalleComponent {
    blogs: any = {};
    rol = JSON.parse(sessionStorage.getItem('user')).rol.nombre;
    idblog: number = 0;
    constructor(
        private route: ActivatedRoute,
        private blogService: BlogsService,
        private router: Router
    ) {}

    ngOnInit(): void {
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
            }
        });
    }

    atras() {
        this.router.navigate(['/aprende']);
    }

    editordoc = jsonDoc;
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

    form = new FormGroup({
        editorContent: new FormControl(
            {value: this.vacio, disabled: this.rol !== 'Administrador'}, 
            Validators.required()
        )
    });

    get doc(): AbstractControl {
        return this.form.get('editorContent');
    }

    ngOnDestroy(): void {
        this.editor.destroy();
    }

    guardar() {
        const {editorContent} = this.form.value;

        this.blogService
            .updateDescriptionBlog(this.idblog, editorContent)
            .subscribe({
                next: (resp) => {
                    console.log(resp);
                }
            });
    }
}
