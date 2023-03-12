import { Injectable } from '@angular/core';
import { Cliente } from './Cliente';
import { CLIENTES } from './clientes.json';
import { Observable, catchError, throwError } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  private urlEndPoint: string = "http://localhost:8080/api/clientes";
  private HttpHeaders = new HttpHeaders({'Content-type': 'application/json'});
  constructor(private http: HttpClient,
    private router: Router) { }

  
  getClientes() : Observable<Cliente[]> {
    //return of(CLIENTES); //opcion 1
    //return this.http.get<Cliente[]>(this.urlEndPoint); //opción 2
    return this.http.get(this.urlEndPoint).pipe(
      map( (response) => response as Cliente[])
    ); //opción 3
  }

  create(cliente: Cliente) :Observable<Cliente>{
    return this.http.post(this.urlEndPoint, cliente, {headers: this.HttpHeaders}).pipe(
      map( (response: any) => response.cliente as Cliente),
      catchError( e => {

        //VALIDO SI EL ERROR ES 400
        if(e.status==400){
          return throwError(e);
        }
        console.log(e.error.mensaje);
        Swal.fire(e.error.mensaje, e.error.error, 'error');
        return throwError(e);
      })
    )
  }

  getCliente(id) :Observable<Cliente>{
    return this.http.get<Cliente>(`${this.urlEndPoint}/${id}`).pipe(
      catchError( e => {
        this.router.navigate(['/clientes']);
        console.log(e.error.mensaje);
        Swal.fire('Error al editar', e.error.mensaje, 'error');
        return throwError(e);
      })
    );
  }

  update(cliente: Cliente) :Observable<any>{
    return this.http.put<any>(`${this.urlEndPoint}/${cliente.id}`, cliente, {headers: this.HttpHeaders}).pipe(
      catchError( e => {

        //VALIDO SI EL ERROR ES 400
        if(e.status==400){
          return throwError(e);
        }
        
        console.log(e.error.mensaje);
        Swal.fire(e.error.mensaje, e.error.error, 'error');
        return throwError(e);
      })
    );
  }

  delete(id: number) :Observable<Cliente> {
    return this.http.delete<Cliente>(`${this.urlEndPoint}/${id}`, {headers: this.HttpHeaders}).pipe(
      catchError( e => {
        console.log(e.error.mensaje);
        Swal.fire(e.error.mensaje, e.error.error, 'error');
        return throwError(e);
      })
    )
  }
  
}
