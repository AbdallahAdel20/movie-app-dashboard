import { Component, OnInit } from '@angular/core';
import { MovieService } from '../../services/movies.service';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';
import { Movie } from '../../interfaces/movie';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-user-dashboard',
  standalone: true,
  imports: [FormsModule, MatTableModule,
    MatPaginatorModule , RouterLink],
  templateUrl: './user-dashboard.component.html',
  styleUrl: './user-dashboard.component.css',
})
export class UserDashboardComponent implements OnInit {
  constructor(
    private movieService: MovieService,
    private authService: AuthService
  ) {}

  logout(): void {
    this.authService.logout();
  }
  searchTerm = '';
  allMovies: Movie[] = [];
  filteredMovies: Movie[] = [];
  paginatedMovies: Movie[] = [];
  displayedColumns = ['title', 'year', 'genre', 'details'];
  isLoading = true;
  
  // Pagination
  pageSize = 5;
  currentPage = 0;


  ngOnInit(): void {
    this.loadMovies();
  }

  private loadMovies(): void {
    this.movieService.getAllMovies().subscribe({
      next: (res) => {
        console.log(res);
        this.allMovies = res.data;
        this.applyFilter();
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to load movies:', err);
        this.isLoading = false;
      }
    });
  }

  applyFilter(): void {
    this.filteredMovies = this.allMovies.filter(movie =>
      movie.title.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
    this.updatePagination();
  }


  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.updatePagination();
  }

  private updatePagination(): void {
    const start = this.currentPage * this.pageSize;
    const end = start + this.pageSize;
    this.paginatedMovies = this.filteredMovies.slice(start, end);
  }
}
