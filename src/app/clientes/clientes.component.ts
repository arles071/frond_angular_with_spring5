import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { Cliente } from './Cliente';
import { ClienteService } from './cliente.service';
import { tap } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.css']
})
export class ClientesComponent implements OnInit {
  clientes: Cliente[];
  paginator: any;

  constructor(private clienteService: ClienteService,
    private activatedRoute: ActivatedRoute){

  }

  ngOnInit(){

    this.activatedRoute.paramMap.subscribe(
      params => {
        let page: number = +params.get('page');

        if(!page)
          page = 0;

        this.clienteService.getClientes(page)
        .pipe(
          tap( (response: any) => {
            //this.clientes = clientes;
            console.log('ClientesComponent: tap 3');
            (response.content as Cliente[]).forEach( cliente => {
              console.log(cliente.nombre);
            })
          })
        )
        .subscribe( (response: any) => {
          this.clientes = (response.content as Cliente[]);
          this.paginator = response;
        });
      }
    );
    
    
  }

  delete(cliente: Cliente) :void {

    Swal.fire({
      title: 'Esta seguro?',
      text: `¿Seguro que desea eliminar al cliente ${cliente.nombre} ${cliente.apellido}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText: 'No, cancelar!',
      confirmButtonText: 'Si, eliminar!'
    }).then((result) => {
      if (result.isConfirmed) {

        this.clienteService.delete(cliente.id).subscribe(response => {
          this.clientes = this.clientes.filter(cli => cli !== cliente);
          Swal.fire(
            'Cliente eliminado!',
            `Cliente ${cliente.nombre} ${cliente.apellido} eliminado con exito.`,
            'success'
          )
        })
        
      }
    })
    
  }
}
