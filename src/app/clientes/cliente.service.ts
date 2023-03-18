import { Injectable } from '@angular/core';
import { Cliente } from './Cliente';
import { CLIENTES } from './clientes.json';
import { Observable, catchError, throwError } from 'rxjs';
import { HttpClient, HttpEvent, HttpHeaders, HttpRequest } from '@angular/common/http';
import { map, tap } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { formatDate, DatePipe } from '@angular/common';


@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  private urlEndPoint: string = "http://localhost:8080/api/clientes";
  private HttpHeaders = new HttpHeaders({'Content-type': 'application/json'});
  constructor(private http: HttpClient,
    private router: Router) { }

  
  getClientes(page: number) : Observable<any[]> {
    //return of(CLIENTES); //opcion 1
    //return this.http.get<Cliente[]>(this.urlEndPoint); //opción 2
    return this.http.get(this.urlEndPoint + '/page/' + page).pipe(
      tap( (response: any) => {
        let clientes = (response.content as Cliente[]);
        console.log('ClienteService: tap 1');
        clientes.forEach( cliente => {
          console.log(cliente.nombre);
        })
      }),
      map( (response: any) => {

        (response.content as Cliente[]).map(cliente => {
          cliente.nombre = cliente.nombre.toUpperCase();

          //opción 1
          //cliente.createAt = formatDate(cliente.createAt, 'dd-MM-yyyy', "en-US");

          //opción 2
          let datePipe = new DatePipe('es-CO');
          //cliente.createAt = datePipe.transform(cliente.createAt, 'fullDate');//'EEE dd, MMM yyyy' //'EEEE dd, MMMM yyyy'
          return cliente;
        });
        return response;
      }),
      tap( (response: any) => {
        console.log('ClienteService: tap 2');
        (response.content as Cliente[]).forEach( cliente => {
          console.log(cliente.nombre);
        })
      })
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

  subirFoto(archivo: File, id): Observable<HttpEvent<{}>> {
    
    let formData = new FormData();
    formData.append("archivo", archivo);
    formData.append("id", id);

    const req = new HttpRequest('POST', `${this.urlEndPoint}/upload`, formData, {
      reportProgress: true
    });

    return this.http.request(req);
  }
  
}
