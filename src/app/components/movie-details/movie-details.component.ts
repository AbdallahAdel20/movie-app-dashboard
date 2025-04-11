import { Component, OnInit } from '@angular/core';
import { Movie } from '../../interfaces/movie';
import { MovieService } from '../../services/movies.service';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RateResponse } from '../../interfaces/rateResponse';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-movie-details',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './movie-details.component.html',
  styleUrl: './movie-details.component.css'
})
export class MovieDetailsComponent implements OnInit{

  movie?: Movie;
  isLoading = true;
  movieRates : RateResponse[] = [];
  
  // Rating form properties
  newRating: number = 3;
  isInvalidRating: boolean = false;
  isSubmitting: boolean = false;
  ratingError: string = '';

  constructor(
    private route: ActivatedRoute,
    private movieService: MovieService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const movieId = this.route.snapshot.paramMap.get('id');
    if (movieId) {
      this.loadMovieDetails(+movieId);
      this.loadMovieRates(+movieId)
    }
  }

  getReturnRoute(): string {
    const userRole = this.authService.getUserRole();
    return userRole === 'ADMIN' ? '/admin' : '/user';
  }

  submitRating(): void {
    // Validate rating
    if (!this.newRating || this.newRating < 1 || this.newRating > 5) {
      this.isInvalidRating = true;
      return;
    }
    
    this.isInvalidRating = false;
    this.isSubmitting = true;
    this.ratingError = '';

    const movieId = this.route.snapshot.paramMap.get('id');
    if (!movieId) return;

    const rateRequest = {
      movieId: +movieId,
      rating: this.newRating
    };

    this.movieService.addMovieRate(rateRequest).subscribe({
      next: () => {
        // Refresh rates after successful submission
        this.loadMovieRates(+movieId);
        this.isSubmitting = false;
        this.newRating = 3; // Reset to default
      },
      error: (err) => {
        console.error('Failed to submit rating:', err);
        this.ratingError = err.error?.message || 'Failed to submit rating. Please try again.';
        this.isSubmitting = false;
      }
    });
  }

  private loadMovieRates(id:number) : void {
    this.movieService.getMovieRates(id).subscribe({
      next: (res) => {
        console.log(res);
        this.movieRates = res.data;
      },
      error: (err)=> {
        console.error('Failed to load rates:', err);
      }
    })
  }

  private loadMovieDetails(id: number): void {
    this.movieService.getMovieById(id).subscribe({
      next: (res) => {
        console.log(res);
        this.movie = res.data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to load movie:', err);
        this.isLoading = false;
      }
    });
  }
}
