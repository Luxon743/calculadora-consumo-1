// 1. Seleccionamos los elementos del DOM y los guardamos en constantes
// Usamos getElementById para vincular el HTML con nuestro código JS
const formulario = document.getElementById('calc-form');
const inputKmInicio = document.getElementById('km-inicio');
const inputKmActual = document.getElementById('km-actual');
const inputLitros = document.getElementById('litros');
const divResultado = document.getElementById('resultado');

let viajeActual = {
    kmInicial: null,
    cargas: []
}

formulario.addEventListener('submit', function(event){
    event.preventDefault();
    const kmInicio = parseFloat(inputKmInicio.value);
    const kmActual = parseFloat(inputKmActual.value);
    const litros = parseFloat(inputLitros.value);

    if (kmActual <= kmInicio) {
        // Si la distancia es 0 o negativa, mostramos un error y salimos de la función
        divResultado.innerHTML = '<p style="color: red;">Error: Los Km finales deben ser mayores a los iniciales.</p>';
        return; // El return vacío detiene la ejecución aquí
    }

    // Primera carga
    if (viajeActual.kmInicial === null) {
        viajeActual.kmInicial = kmInicio;
        
        // Bloqueo del input de Kilometraje Inicial luego de la primera carga
        inputKmInicio.value = kmInicio;
        inputKmInicio.disabled = true;
    }

    viajeActual.cargas.push({
        km: kmActual,
        litros: litros
    })
    
    localStorage.setItem('viajeActual', JSON.stringify(viajeActual));

    divResultado.innerHTML = `
        <div class="success-message">
            <p>Carga agregada correctamente</p>
        </div>
    `;

    inputKmActual.value = "";
    inputLitros.value = "";
    //const consumo = (litros / distancia) * 100;

});