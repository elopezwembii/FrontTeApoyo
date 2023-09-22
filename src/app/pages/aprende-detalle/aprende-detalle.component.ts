import {ActivatedRoute, Router} from '@angular/router';
import {Component} from '@angular/core';
import {BlogsService} from '@services/blogs.service';

@Component({
    selector: 'app-aprende-detalle',
    templateUrl: './aprende-detalle.component.html',
    styleUrls: ['./aprende-detalle.component.scss']
})
export class AprendeDetalleComponent {
    blogs: any = {};

    constructor(
        private route: ActivatedRoute,
        private blogService: BlogsService,
        private router: Router
    ) {}

    ngOnInit(): void {
        // Accede al valor del parámetro 'id' desde ActivatedRoute
        this.route.params.subscribe((params) => {
            const id = params['id'];
            // Ahora puedes utilizar 'id' en tu componente
            this.getBlogId(id);
        });
    }

    getBlogId(id: number) {
        this.blogService.getBlogsId(id).subscribe({
            next: ({data}: any) => {
                console.log(data);
                this.blogs = data;
            }
        });
    }

    atras() {
        this.router.navigate(['/aprende']);
    }
}
