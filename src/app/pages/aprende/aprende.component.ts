import {BlogsService} from './../../services/blogs.service';
import {Component, OnInit} from '@angular/core';

@Component({
    selector: 'app-aprende',
    templateUrl: './aprende.component.html',
    styleUrls: ['./aprende.component.scss']
})
export class AprendeComponent implements OnInit {
    cards = [
        {
            title: 'Consejos para ahorrar dinero',
            content:
                'Descubre algunos consejos prácticos para aumentar tus ahorros y mejorar tu situación financiera.',
            imageUrl:
                'https://plus.unsplash.com/premium_photo-1677022383099-555c0bcc63e5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1326&q=80',
            date: 'Enero 15, 2023'
        },
        {
            title: 'Cómo invertir sabiamente',
            content:
                'Aprende las mejores estrategias de inversión para hacer crecer tu dinero a largo plazo.',
            imageUrl:
                'https://images.unsplash.com/photo-1579621970795-87facc2f976d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
            date: 'Febrero 2, 2023'
        },
        {
            title: 'Planificación financiera para principiantes',
            content:
                'Descubre los fundamentos de la planificación financiera y cómo establecer metas financieras realistas.',
            imageUrl:
                'https://plus.unsplash.com/premium_photo-1681469490209-c2f9f8f5c0a2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1483&q=80',
            date: 'Marzo 10, 2023'
        },
        {
            title: 'Reducción de deudas: Estrategias efectivas',
            content:
                'Aprende cómo manejar y reducir eficazmente tus deudas para alcanzar la libertad financiera.',
            imageUrl:
                'https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1373&q=80',
            date: 'Abril 5, 2023'
        },
        {
            title: 'El impacto de los impuestos en tus finanzas',
            content:
                'Comprende cómo los impuestos pueden afectar tus inversiones y estrategias financieras.',
            imageUrl:
                'https://images.unsplash.com/photo-1633158829585-23ba8f7c8caf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
            date: 'Mayo 20, 2023'
        },
        {
            title: 'Planificación de jubilación: Pasos esenciales',
            content:
                'Descubre los pasos clave para una planificación de jubilación exitosa y sin preocupaciones.',
            imageUrl:
                'https://images.unsplash.com/photo-1459257831348-f0cdd359235f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
            date: 'Junio 12, 2023'
        }
    ];
    loadedCards = [];
    // Divide el arreglo de tarjetas en grupos de 3
    cardGroups = [];

    currentPage = 1;
    totalPages = 1;
    pages: number[] = [];

    prevPageUrl: string | null = null;
    nextPageUrl: string | null = null;
    current_page_url: string | null = null;

    constructor(private blogsService: BlogsService) {
        for (let i = 0; i < this.cards.length; i += 3) {
            this.cardGroups.push(this.cards.slice(i, i + 3));
        }
    }

    ngOnInit() {
        this.getBlogs();
    }

    updatePaginationInfo() {
        // Calcula el número total de páginas aquí en base a la cantidad de blogs y blogs por página
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

    getBlogs() {
        const perPage = 4;

        this.blogsService.getBlogs(this.currentPage, perPage).subscribe({
            next: ({
                data,
                prev_page_url,
                next_page_url,
                current_page_url,
                total
            }: any) => {
                this.loadedCards = data;
                this.prevPageUrl = prev_page_url;
                this.nextPageUrl = next_page_url;
                this.current_page_url = current_page_url;

                this.totalPages = Math.ceil(total / perPage);
                this.pages = Array(this.totalPages)
                    .fill(0)
                    .map((x, i) => i + 1);

                this.updatePaginationInfo();
            }
        });
    }
}
