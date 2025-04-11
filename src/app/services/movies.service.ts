// movie.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';
import { Movie } from '../interfaces/movie';
import { Observable } from 'rxjs';
import { RateRequest } from '../interfaces/rateRequest';

// interface MoviesResponse {
//   data: MovieDto[];
//   total: number;
// }

@Injectable({ providedIn: 'root' })
export class MovieService {
  private apiUrl = environment.baseUrl;

  constructor(private http: HttpClient) {}

  searchMovies(title: string) : Observable<any> {
    return this.http.get(`${this.apiUrl}omdb/search?title=${encodeURIComponent(title)}`);
  }

  addMovies(movies: Movie[]) {
    return this.http.post<Movie[]>(`${this.apiUrl}movies/addMovies`, movies);
  }

  getAllMovies() : Observable<any> {
    return this.http.get(`${this.apiUrl}movies/all`);
  }

  getMovieById(id : number) : Observable<any> {
    return this.http.get(`${this.apiUrl}movies/${id}`)
  }

  deleteMovies(ids: number[]) {
    return this.http.delete(`${this.apiUrl}movies/deleteMovies`, { body: ids });
  }

  getMovieRates(id:number) : Observable<any> {
    return this.http.get(`${this.apiUrl}rate/${id}`);
  }

  addMovieRate(rate:RateRequest) : Observable<any> {
    return this.http.post(`${this.apiUrl}rate/addRate`, rate);
  }
}