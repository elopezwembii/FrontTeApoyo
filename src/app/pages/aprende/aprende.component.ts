import {BlogsService} from './../../services/blogs.service';
import {Component, OnInit} from '@angular/core';

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

    constructor(private blogsService: BlogsService) {}

    ngOnInit() {
        this.getFirstSixBlogs();
        this.getBlogs();
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
            }
        });
    }

    getFirstSixBlogs() {
        this.blogsService.getFirstSixBlogs().subscribe({
            next: ({data}: any) => {
                console.log(data);

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
}
