var canvas = document.getElementById("myCanvas");
var clear = document.getElementById("clearBtn");
var download = document.getElementById("downloadBtn");
var context = canvas.getContext("2d");
canvas.addEventListener("click", defineImage, false);
clear.addEventListener("click", clearTable, false);
download.addEventListener("click", downloadImage, false);
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
    var currentPos = getCurrentPos(evt);

    for (i = 0; i < document.inputForm.color.length; i++) {
        if (document.inputForm.color[i].checked) {
            var color = document.inputForm.color[i];
            break;
        }
    }
    for (i = 0; i < document.inputForm.shape.length; i++) {
        if (document.inputForm.shape[i].checked) {
            var shape = document.inputForm.shape[i];
            break;
        }
    }
    //Armamos la estructura del JSON a usar
    var json = JSON.stringify({
        "shape": shape.value,
        "color": color.value,
        "coords": {
            "x": currentPos.x,
            "y": currentPos.y
        }
        });
    drawImageText(json);
    sendText(json);
}
function clearTable(evt){
    document.inputForm.color[4].checked = true;
    document.inputForm.shape[0].checked = true;
    defineImage(evt);
    document.inputForm.color[0].checked = true;
}
function drawImageText(image) {
    var json = JSON.parse(image);
    context.fillStyle = json.color;
    switch (json.shape) {
        case "circle":
        context.beginPath();
        context.arc(json.coords.x, json.coords.y, 5, 0, 2 * Math.PI, false);
        context.fill();
        break;
        case "square":
        default:
            if(json.color==="#FFFFFF"){
                //Se define un punto del tamaño del canvas para "borrar" todo
                context.fillRect(0, 0, canvas.width, canvas.height);
            }
            else{
                context.fillRect(json.coords.x, json.coords.y, 10, 10);
            }
        break;
    }
}
