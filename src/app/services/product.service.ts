import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, catchError, delay, shareReplay, tap, map } from 'rxjs';
import { Product } from '../models/product.interface';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  products$: Observable<Product[]>
  private baseUrl = 'https://retoolapi.dev/U1A9pK/products/';

  constructor(
    private http: HttpClient
  ) {
    this.initProducts()
  }

  deleteProduct(id: number): Observable<any> {
    return this.http.delete(this.baseUrl + id);
  }

  insertProduct(newProduct: Product): Observable<Product> {
    newProduct.modifiedDate = new Date();
    return this.http.post<Product>(this.baseUrl, newProduct);
  }

  getProductById(id: number): Observable<Product> {
    return this
            .products$
            .pipe(
              map(products => products.find(product => product.id == id))
            )
  }

  initProducts() {
    let url:string = this.baseUrl + '?_sort=modifiedDate&_order=desc';

    this.products$ = this
                      .http
                      .get<Product[]>(url)
                      .pipe(
                        delay(1500),
                        tap(console.table),
                        shareReplay()
                      )
  }
}
