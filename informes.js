document.getElementById('filtrarForm').addEventListener('submit', filtrar);
function getStoredFacturas() {
    return JSON.parse(localStorage.getItem('facturas')) || [];
}
function getStoredVendedores() {
    return JSON.parse(localStorage.getItem('vendedores')) || [];
}

function filtrar(e) {
    e.preventDefault();
    filtrar = true;
    var inicio = document.getElementById('fechaInicio').value;
    var final = document.getElementById('fechaFinal').value;
    var vendedor = document.getElementById('vendedorFiltrar').value;
    var facturas = getStoredFacturas();

    if (inicio === "" && final === "") {
        return;
    }

    var facturasFiltradas = facturas.filter(factura => {
        return (inicio === "" || factura.fecha >= inicio) && 
               (final === "" || factura.fecha <= final)&&
               (factura.vendedor === vendedor);
    });
    console.log(facturasFiltradas);

    generarInforme(facturasFiltradas);
}
function generarInforme(facturas){

    let sum = 0;

    facturas.forEach(factura => {
       sum+= factura.comision ;
    })
    showVendedor(sum);
}
function showVendedor(sum) {
    const vendedoresView = document.getElementById('vendedoresTable').getElementsByTagName('tbody')[0];
    var vendedor = document.getElementById('vendedorFiltrar').value;
    const vendedores = getStoredVendedores();
    vendedor = vendedores.find(vend => vend.nombre === vendedor)
    console.log(vendedor)
    vendedoresView.innerHTML = '';
        vendedoresView.innerHTML += `<tr>
            <td>${vendedor.nombre}</td>
            <td>${vendedor.ruc}</td>
            <td>${vendedor.direccion}</td>
            <td>${vendedor.telefono}</td>
            <td>${vendedor.comision}</td>
            <td>${sum}</td>
        </tr>`;
    };
