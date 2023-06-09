import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Cliente } from '../Cliente';
import { ClienteService } from '../cliente.service';
import swal from 'sweetalert2';
import { Region } from '../Region';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit{
  public cliente: Cliente = new Cliente();
  public titulo: string = "Crear cliente";
  public errores: String[];
  public regiones: Region[];

  constructor(private clienteService: ClienteService,
    private router: Router,
    private activatedRoute: ActivatedRoute
    ){

  }

  ngOnInit(){
    this.cargarCliente();

    this.clienteService.getRegiones().subscribe( regiones => this.regiones = regiones)
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
    }, err => {
      this.errores = err.error.errors as string[];
      console.log("Codigo del error desde el backen: " + err.status);
      console.log(err.error.errors);
    })
  }

  compararRegion(o1: Region, o2: Region): boolean {
    if(o1 === undefined && o2 === undefined)
      return true;
    return o1 == null || o2 == null ? false : o1.id === o2.id;
  }
}
