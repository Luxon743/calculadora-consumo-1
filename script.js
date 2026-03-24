// 1. Seleccionamos los elementos del DOM y los guardamos en constantes
// Usamos getElementById para vincular el HTML con nuestro código JS
const tablaHistorial = document.getElementById('tabla-historial');
const formulario = document.getElementById('calc-form');
const inputKmInicio = document.getElementById('km-inicio');
const inputKmActual = document.getElementById('km-actual');
const inputLitros = document.getElementById('litros');
const divResultado = document.getElementById('resultado');
const btnCalcular = document.getElementById('btn-calcular');
const btnReset = document.getElementById('btn-reset');

let viajeActual = {
    kmInicial: null,
    cargas: []
}

const cargaGuardada = localStorage.getItem('viajeActual');

if (cargaGuardada) {
    viajeActual = JSON.parse(cargaGuardada);
    // restaurar km inicial en el input
    if (viajeActual.kmInicial !== null) {
        inputKmInicio.value = viajeActual.kmInicial;
        inputKmInicio.disabled = true;
    }
}

function renderTabla() {
    tablaHistorial.innerHTML = '';
    if (viajeActual.cargas.length === 0) {
        tablaHistorial.innerHTML = `
            <tr>
                <td colspan="2" class="text-center text-gray-400 p-4">
                    No hay cargas registradas
                </td>
            </tr>
        `;
        return;
    }
    viajeActual.cargas.forEach(carga => {
        tablaHistorial.innerHTML += `
            <tr class="border-b">
                <td class="p-2">${carga.km}</td>
                <td class="p-2">${carga.litros}</td>
            </tr>
        `;
    });
}
renderTabla();

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
    if (isNaN(kmInicio) || isNaN(kmActual)) {
        divResultado.innerHTML = '<p class="text-red-500">El kilometraje actual es obligatorio</p>';
        return;
    }

    if (isNaN(litros) || litros <= 0) {
        divResultado.innerHTML = '<p class="text-red-500">Ingresá litros válidos</p>';
        return;
    }
    let ultimoKm = viajeActual.kmInicial;
    if (viajeActual.cargas.length > 0) {
        ultimoKm = viajeActual.cargas[viajeActual.cargas.length - 1].km;
    }
    if (kmActual <= ultimoKm) {
        divResultado.innerHTML = `
            <p class="text-red-500">
                El KM actual debe ser mayor al último registrado (${ultimoKm})
            </p>
        `;
        return;
    }
    viajeActual.cargas.push({
        km: kmActual,
        litros: litros
    })
    localStorage.setItem('viajeActual', JSON.stringify(viajeActual));
    renderTabla();
    divResultado.innerHTML = `
        <div class="success-message">
            <p>Carga agregada correctamente</p>
        </div>
    `;
    inputKmActual.value = "";
    inputLitros.value = "";
    //const consumo = (litros / distancia) * 100;
});

btnCalcular.addEventListener('click', function(){

    if (viajeActual.cargas.length === 0) {
        divResultado.innerHTML = '<p class="text-red-500">No hay cargas registradas</p>';
        return;
    }

    let totalLitros = 0;

    viajeActual.cargas.forEach(carga => {
        totalLitros += carga.litros;
    });

    const kmFinal = viajeActual.cargas[viajeActual.cargas.length - 1].km;
    const distancia = kmFinal - viajeActual.kmInicial;

    if (distancia <= 0) {
        divResultado.innerHTML = '<p class="text-red-500">Error en el cálculo de distancia</p>';
        return;
    }

    const consumo = (totalLitros / distancia) * 100;

    divResultado.innerHTML = `
        <div class="bg-green-100 text-green-700 p-4 rounded-lg">
            <p><strong>Distancia total:</strong> ${distancia} km</p>
            <p><strong>Litros totales:</strong> ${totalLitros} L</p>
            <p><strong>Consumo promedio:</strong> ${consumo.toFixed(2)} L/100km</p>
        </div>
    `;
});

btnReset.addEventListener('click', function(){
    // Resetear objeto
    viajeActual = {
        kmInicial: null,
        cargas: []
    };
    // Limpiar localStorage
    localStorage.removeItem('viajeActual');
    // Resetear inputs
    inputKmInicio.disabled = false;
    formulario.reset();
    // Limpiar UI
    renderTabla();
    divResultado.innerHTML = '<p class="text-orange-500">Viaje reiniciado</p>';
});

