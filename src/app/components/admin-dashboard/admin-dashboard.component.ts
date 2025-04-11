// admin-dashboard.component.ts
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { Movie } from '../../interfaces/movie';
import { MovieService } from '../../services/movies.service';
import { FormsModule } from '@angular/forms'; 
import { AuthService } from '../../services/auth.service';
import { RouterLink } from '@angular/router';

interface MovieWithSelection extends Movie {
  selected?: boolean;
}

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  imports: [
    FormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatCheckboxModule,
    RouterLink
  ],
  standalone: true,
  styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent implements OnInit {
   // Search Section
   searchTerm = '';
   searchResult?: Movie;
 
   // Selected Movies
   selectedMovies: Movie[] = [];
 
   // Existing Movies
   allMovies: MovieWithSelection[] = [];
   displayedColumns: string[] = ['select', 'title', 'year', 'actions'];
   existingMovies: MovieWithSelection[] = [];
   allSelected = false;
   currentPage = 0;
   pageSize = 5;
   totalMovies = 0;
 
   @ViewChild(MatPaginator) paginator!: MatPaginator;
 
   constructor(
     private movieService: MovieService,
     private authService: AuthService
   ) {}
 
   ngOnInit(): void {
     this.loadAllMovies();
   }

   private loadAllMovies(): void {
    this.movieService.getAllMovies().subscribe({
      next: (res) => {
        this.allMovies = res.data.map((movie: Movie) => ({ ...movie, selected: false }));
        this.totalMovies = this.allMovies.length;
        this.currentPage = 0;
        if (this.paginator) {
          this.paginator.firstPage();
        }
        this.updatePaginatedMovies();
      },
      error: (err) => console.error('Failed to load movies:', err)
    });
  }

  private updatePaginatedMovies(): void {
    const startIndex = this.currentPage * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.existingMovies = [...this.allMovies.slice(startIndex, endIndex)];
  }

 

  // Search Functions
  onSearch(): void {
    if (!this.searchTerm) return;

    this.movieService.searchMovies(this.searchTerm).subscribe({
      next: (res) => {
        this.searchResult = res.data;
        console.log(this.searchResult);
        this.searchTerm = '';
      },
      error: (err) => console.error('Search failed:', err)
    });
  }

  // Selection Management
  addToSelected(movie: Movie): void {
    if (!this.selectedMovies.find(m => m.title === movie.title)) {
      this.selectedMovies = [...this.selectedMovies, movie];
    }
  }

  removeFromSelected(index: number): void {
    this.selectedMovies.splice(index, 1);
    this.selectedMovies = [...this.selectedMovies];
  }

  // Database Operations
  addAllMovies(): void {
    this.movieService.addMovies(this.selectedMovies).subscribe({
      next: () => {
        this.selectedMovies = [];
        this.loadAllMovies();
      },
      error: (err) => console.error('Add movies failed:', err)
    });
  }


  // Pagination
  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.updatePaginatedMovies();
  }

  // Selection Helpers
  toggleAllSelection(event: any): void {
    this.allSelected = event.checked;
    this.existingMovies = this.existingMovies.map(movie => ({
      ...movie,
      selected: this.allSelected
    }));
  }

  updateSelection(): void {
    this.allSelected = this.existingMovies.every(movie => movie.selected);
  }

  hasSelectedMovies(): boolean {
    return this.existingMovies.some(movie => movie.selected);
  }

  deleteSelectedMovies(): void {
    const selectedIds = this.existingMovies
      .filter(movie => movie.selected && movie.id)
      .map(movie => movie.id!);

    if (selectedIds.length > 0) {
      this.movieService.deleteMovies(selectedIds).subscribe({
        next: () => {
          this.loadAllMovies();
        },
        error: (err) => console.error('Delete failed:', err)
      });
    }
  }

  deleteMovie(movie: MovieWithSelection): void {
    if (movie.id) {
      this.movieService.deleteMovies([movie.id]).subscribe({
        next: () => {
          this.loadAllMovies();
        },
        error: (err) => console.error('Delete failed:', err)
      });
    }
  }

  logout(): void {
    this.authService.logout();
  }
}