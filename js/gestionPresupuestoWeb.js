"use strict"

import * as gesPre from "./gestionPresupuesto.js";

//EVENTO BOTON ACTUALIZAR PRESUPUESTO

let botonActualizar = document.getElementById("actualizarpresupuesto");
botonActualizar.addEventListener('click', actualizarPresupuestoWeb)
//EVENTO BOTON AÑADIR GASTO
let botonAnyadir = document.getElementById("anyadirgasto");
botonAnyadir.addEventListener('click', nuevoGastoWeb);

function mostrarDatoEnId(idElemento,valor){
    let elemento = document.getElementById(idElemento);
    elemento.innerHTML = `<p>${valor}</p>`
    
}
function mostrarGastoWeb(idElemento,gastos){
    let element = document.getElementById(idElemento);

    gastos.forEach((gasto) => {
        let etiquetas = "";
        let listaIdEtiqueta = [];
        let listaEtiquetas = [];

        gasto.etiquetas.forEach((etiqueta, posi) => {
            etiquetas += 
                `<span class="gasto-etiquetas-etiqueta" id="${gasto.id}-${posi}">
                    ${etiqueta}
                </span>`;

            //Recogida de id del elemento y de la etiqueta a borrar en arrays para su posterior utilización.
            listaIdEtiqueta.push(`${gasto.id}-${posi}`);
            listaEtiquetas.push(`${etiqueta}`);
        }); 

        element.innerHTML +=
            `<div class="gasto">
                <div class="gasto-descripcion">${gasto.descripcion}</div>
                <div class="gasto-fecha">${gasto.fecha}</div> 
                <div class="gasto-valor">${gasto.valor}</div> 
                <div class="gasto-etiquetas">
                    ${etiquetas}
                </div>
                
                <button class="gasto-editar" id="gasto-editar-${gasto.id}" type="button">
                    Editar
                </button>
                <button class="gasto-borrar" id="gasto-borrar-${gasto.id}" type="button">
                Borrar
            </button>
            </div>`;

        //EVENTO BOTON EDITAR GASTO
        let EventoEditarHandle = new EditarHandle();
        EventoEditarHandle.gasto = gasto;
        let botonEditar = document.getElementById(`gasto-editar-${gasto.id}`);
        botonEditar.addEventListener('click', EventoEditarHandle);
        //EVENTO BOTON BORRAR GASTO
        let EventoBorrarHandle = new BorrarHandle();
        EventoBorrarHandle.gasto = gasto;
        let botonBorrar = document.getElementById(`gasto-borrar-${gasto.id}`);
        botonBorrar.addEventListener(`click`, EventoBorrarHandle);
        //EVENTO BORRAR ETIQUETA
        listaIdEtiqueta.forEach((tagId, index) => {
            let tagsHandler = new BorrarEtiquetasHandle();
            tagsHandler.gasto = gasto;
            tagsHandler.etiqueta = listaEtiquetas[index];
            document.getElementById(tagId).addEventListener('click', tagsHandler);
        });
    });
}
    
function mostrarGastosAgrupadosWeb(idElemento,agrup,periodo){
    let elemento = document.getElementById(idElemento);

    
    let gastos ="";
    for(let prop in agrup){
        gastos +=
        "<div class='agrupacion-dato'>" +
            "<span class='agrupacion-dato-clave'>" + prop + ": </span>" +
            "<span class='agrupacion-dato-valor'>" + agrup[prop] + "</span>"+
        "</div>";
    }

    elemento.innerHTML += 
    `<div class='agrupacion'> 
        <h1>Gastos agrupados por ${periodo} </h1>
        ${gastos}
    </div>`;
}

function repintar(){
    mostrarDatoEnId("presupuesto",gesPre.mostrarPresupuesto());
    mostrarDatoEnId("gastos-totales", gesPre.calcularTotalGastos());
    mostrarDatoEnId("balance-total",gesPre.calcularBalance());

    let elemento = document.getElementById("listado-gastos-completo");
    elemento.innerHTML = "";
    mostrarGastoWeb("listado-gastos-completo", gesPre.listarGastos());
}

function actualizarPresupuestoWeb (){
    let nuevoValor = parseFloat(prompt("Introduce un presupuesto."));
    gesPre.actualizarPresupuesto(nuevoValor);
    repintar();
}

function nuevoGastoWeb (){
    let descripcion = prompt("Descripción.");
    let valor = parseFloat(prompt("Valor."));
    let fecha = Date.parse(prompt("Fecha."));
    let etiquetas = prompt("Etiquetas.");

    let listaEtiquetas = etiquetas.split(',');

    let gasto = new gesPre.CrearGasto(descripcion, valor, fecha, listaEtiquetas);

    gesPre.anyadirGasto(gasto);

    repintar();
}

function EditarHandle (){
    this.handleEvent = function(evento){
        let descripcion = prompt("Descripción.");
        let valor = parseFloat(prompt("Valor."));
        let fecha = Date.parse(prompt("Fecha."));
        let etiquetas = prompt("Etiquetas.");

        this.gasto.actualizarDescripcion(descripcion);
        this.gasto.actualizarValor(valor);
        this.gasto.actualizarFecha (fecha);
        
        if(etiquetas != undefined){
            let listaEtiquetas = etiquetas.split(',');
            this.gasto.anyadirEtiquetas(listaEtiquetas); 
        }

        repintar();
    }
}

function BorrarHandle(){
    this.handleEvent = function(evento){
        gesPre.borrarGasto(this.gasto.id);
        repintar();
    }
}

function BorrarEtiquetasHandle() {
    this.handleEvent = function(evento) {
        this.gasto.borrarEtiquetas(this.etiqueta);
        repintar();
    }
}

//El export de las funciones
export{
    mostrarDatoEnId,
    mostrarGastoWeb,
    mostrarGastosAgrupadosWeb,
}