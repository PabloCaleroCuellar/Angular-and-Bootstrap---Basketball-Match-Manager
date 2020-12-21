import { ThrowStmt } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { Partido } from 'src/app/model/partido';
import { DataService } from '../../service/data.service';

let interval;
let partidoAcabado: boolean = false;
let isTimerOn: boolean = false;

@Component({
  selector: 'app-partido',
  templateUrl: './partido.component.html',
  styleUrls: ['./partido.component.scss']
})

export class PartidoComponent implements OnInit {

  partido: Partido

  constructor(private data: DataService) { }

  ngOnInit() {
    this.data.match.subscribe(partido => this.partido = partido)
    let botonTimer = document.getElementById("timer");
    if(partidoAcabado) {
      let botones = document.getElementsByTagName("button")
        for (let i = 0; i < botones.length; i++) {
          (<HTMLInputElement> botones[i]).disabled = true;
        }
        botonTimer.setAttribute("class", "btn btn-warning")
        botonTimer.innerHTML = "Partido acabado";
    }
    else {
      if(isTimerOn){
            botonTimer.setAttribute("class", "btn btn-danger")
            botonTimer.innerHTML = "Parar tiempo";
          }
    }
  }

  basketLocal(value: number) {
    this.partido._puntosLocal += value
  }

  basketVisitante(value: number) {
    this.partido._puntosVisitante += value
  }

  faltaLocal() {
    this.partido._faltasLocal++;
  }

  faltaVisitante() {
    this.partido._faltasVisitante++;
  }

  tiempoMuertoLocal() {
    this.partido._tiemposLocal--;
  }

  tiempoMuertoVisitante() {
    this.partido._tiemposVisitante--;
  }

  Interval() {
    let botonTimer = document.getElementById("timer");
    if (botonTimer.innerHTML == "Reanudar partido") {
      botonTimer.setAttribute("class", "btn btn-danger")
      botonTimer.innerHTML = "Parar tiempo";
    } 
    else {
      botonTimer.setAttribute("class", "btn btn-success")
      botonTimer.innerHTML = "Reanudar partido";
    }
  
    if (!interval) {
      isTimerOn = true
      interval = setInterval(()=> {
        this.partido._segundos--;
        if(this.partido._segundos < 0) {
          this.partido._minutos--;
          this.partido._segundos = 59;
        }
        if(this.partido._segundos === 0 && this.partido._minutos === 0) {
          if(this.partido._cuarto === 4) {
            let botones = document.getElementsByTagName("button")
            for (let i = 0; i < botones.length; i++) {
              (<HTMLInputElement> botones[i]).disabled = true;
            }
            partidoAcabado = true
            this.partido._cuarto = 4
            this.partido._minutos = 88;
            this.partido._segundos = 88;
            botonTimer.setAttribute("class", "btn btn-warning")
            botonTimer.innerHTML = "Partido acabado";
            clearInterval(interval);
          }
          else {
            isTimerOn = false
            this.partido._cuarto++;
            clearInterval(interval);
            if (botonTimer.innerHTML == "Reanudar partido") {
              botonTimer.setAttribute("class", "btn btn-danger")
              botonTimer.innerHTML = "Parar tiempo";
            } 
            else {
              botonTimer.setAttribute("class", "btn btn-success")
              botonTimer.innerHTML = "Reanudar partido";
            }
            interval = null;
            this.partido._minutos = 10;
            this.partido._segundos = 0;
          }
          this.partido._faltasLocal = 0;
          this.partido._faltasVisitante = 0;
        }
      }, 1000);
    } 
    else {
      isTimerOn = false
      clearInterval(interval);
      interval = null;
    }
  }
}
