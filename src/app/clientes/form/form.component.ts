import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Cliente } from '../Cliente';
import { ClienteService } from '../cliente.service';
import swal from 'sweetalert2';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit{
  public cliente: Cliente = new Cliente();
  public titulo: string = "Crear cliente";
  public errores: String[];

  constructor(private clienteService: ClienteService,
    private router: Router,
    private activatedRoute: ActivatedRoute
    ){

  }

  ngOnInit(){
    this.cargarCliente();
  }

  cargarCliente() :void {
    this.activatedRoute.params.subscribe( params => {
      let id = params['id'];
      if(id){
        this.clienteService.getCliente(id).subscribe( (cliente) => this.cliente = cliente);
      }
    })
  }

  create() :void {
    this.clienteService.create(this.cliente).subscribe(
      cliente => {
        this.router.navigate(['/clientes']);
        swal.fire('Nuevo cliente', `El cliente ${cliente.nombre} ha sido creado con exito!`, 'success');
      }, err => {
        this.errores = err.error.errors as string[];
        console.log("Codigo del error desde el backen: " + err.status);
        console.log(err.error.errors);
      }
    )
  }

  update() :void {
    this.clienteService.update(this.cliente).subscribe( json => {
      this.router.navigate(['/clientes']);
      swal.fire('Cliente actualizado', `${json.mensaje} ${json.cliente.nombre}`, 'success');
    })
  }
}
