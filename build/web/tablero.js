var canvas = document.getElementById("myCanvas");//Milienzo
var clear = document.getElementById("clearBtn");
var download = document.getElementById("downloadBtn");
var context = canvas.getContext("2d");//contexto
var flagPaint=false; //Para saber si pintar o no
var position; // la posición actual donde el usuario hizo click

canvas.addEventListener('mousedown', changeFlag, false);
canvas.addEventListener('mouseup', changeFlag, false);
canvas.addEventListener('mousemove', defineImage, false);
clear.addEventListener("click", clearTable, false);
download.addEventListener("click", downloadImage, false);

//Funcion para saber si se debe pintar o no
function changeFlag(evt){
    flagPaint=!flagPaint;
    position=getCoords(evt);
}
function getCoords(evt){
    var posX;
    var posY;

    if (evt.pageX || evt.pageY) {
            posX = evt.pageX- canvas.getBoundingClientRect().left;
            posY = evt.pageY- canvas.getBoundingClientRect().top;
    }else{
            posX = evt.clientX - canvas.getBoundingClientRect().left;
            posY = evt.clientY - canvas.getBoundingClientRect().top;
    }

    return {x:posX,
            y:posY
    };
}
//Funcion para descargar la imagen
function downloadImage(){
    //convierte el canva en una imagen
    var dato = canvas.toDataURL("image/png");
    //cambia el formato para que el navegador la descargue automaticamente
    dato = dato.replace("image/png", "image/octet-stream");
    document.location.href = dato;
}
//Funcion que toma las coordenadas x y y
function getCurrentPos(evt) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
    };
}
//Funcion para tomar el color y la forma desde el formulario HTML5
function defineImage(evt) {
    if(flagPaint){
        for (i = 0; i < document.inputForm.color.length; i++) {
            if (document.inputForm.color[i].checked) {
                var color = document.inputForm.color[i];
                break;
            }
        }
        var coords=getCoords(evt);
        //Se define la estructura del Json
        var json = JSON.stringify({
            "shape": "square",
            "color": color.value,
            "coords": {
                "x": position.x,
                "y": position.y
            },
            "coordsNext": {
                "x": coords.x,
                "y": coords.y
            },
            "clr": "false"
        });
        position={
            x:coords.x,
            y:coords.y
        };
        drawImageText(json);
        sendText(json);
    }
}
function clearTable(){
    //Envia un json con la orden para limpiar el tablero
    var json = JSON.stringify({
        "shape": "square",
        "color": "#000000",
        "coords": {
            "x": 0,
            "y": 0
        },
        "coordsNext": {
            "x": 0,
            "y": 0
        },
        "clr": "true"
    });
    drawImageText(json);
    sendText(json);
}
function drawImageText(image) {
    var json = JSON.parse(image);
    context.fillStyle = json.color;
    context.beginPath(); // inicia el dibujo
    context.moveTo(json.coords.x, json.coords.y); // Ubica el cursor del canva donde en el punto inicial
    context.lineTo(json.coordsNext.x,json.coordsNext.y); // Crea una linea hasta el punto final
    context.strokeStyle = json.color; // color de la linea
    context.stroke(); // muestra la linea en el canva
    if(json.clr=="true"){ //Si el json es para limpiar el tablero, borra todo
        context.clearRect(0, 0, canvas.width, canvas.height);
    }
}
