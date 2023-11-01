document.getElementById('facturaForm').addEventListener('submit', saveFactura);
document.getElementById('vendedorForm').addEventListener('submit', filtrar);

const facturas = getStoredFacturas();

let itemsCounter = 0;

function addItem() {
    const itemDiv = document.createElement('div');
    itemDiv.setAttribute('class', 'item');
    itemDiv.innerHTML = `
        <hr>
        <h6>Item ${itemsCounter + 1}</h6>
        <div class="form-group">
            <label>Cantidad:</label>
            <input type="number" class="form-control cantidad" required>
        </div>
        <div class="form-group">
            <label>Descripción:</label>
            <input type="text" class="form-control descripcion" required>
        </div>
        <div class="form-group">
            <label>Precio:</label>
            <input type="number" class="form-control precio" required>
        </div>
        <div class="form-group">
            <label>Subtotal:</label>
            <input type="number" class="form-control subtotal" disabled>
        </div>
    `;

    document.getElementById('itemsDiv').appendChild(itemDiv);
    itemsCounter++;

    itemDiv.querySelector('.cantidad').addEventListener('input', updateSubtotal);
    itemDiv.querySelector('.precio').addEventListener('input', updateSubtotal);
}

function updateSubtotal(e) {
    const parentDiv = e.target.closest('.item');
    const cantidad = parentDiv.querySelector('.cantidad').value;
    const precio = parentDiv.querySelector('.precio').value;
    const subtotalInput = parentDiv.querySelector('.subtotal');
    const subtotal = cantidad * precio;
    subtotalInput.value = subtotal;

    updateTotal();
}

function updateTotal() {
    const items = document.querySelectorAll('.item');
    let total = 0;
    items.forEach(item => {
        total += Number(item.querySelector('.subtotal').value);
    });

    document.getElementById('total').value = total;
}

function getFacturaData() {
    const itemsData = [];
    const items = document.querySelectorAll('.item');

    items.forEach(item => {
        itemsData.push({
            cantidad: item.querySelector('.cantidad').value,
            descripcion: item.querySelector('.descripcion').value,
            precio: item.querySelector('.precio').value,
            subtotal: item.querySelector('.subtotal').value
        });
    });
    var vendedor =  document.getElementById('vendedor').value;
    tipoPago = document.getElementById('tipoPago').value;
    var comision = 0;
    if(tipoPago == 'contado'){
         comision = getStoredVendedores(vendedor).comision * document.getElementById('total').value / 100;
    }
    return {
        fecha: document.getElementById('fecha').value,

        cliente: document.getElementById('cliente').value,
        vendedor: vendedor,
        tipoPago: tipoPago,
        items: itemsData,
        comision: comision,
        total: document.getElementById('total').value
        
        
    };
}



function getStoredFacturas() {
    return JSON.parse(localStorage.getItem('facturas')) || [];
}
function getStoredVendedores(vendedor) {
    var vendedores = JSON.parse(localStorage.getItem('vendedores')) || [];
    return vendedores.find(vend => vend.nombre === vendedor );
}

function setStoredFacturas(facturas) {
    localStorage.setItem('facturas', JSON.stringify(facturas));
}



function isClienteRegistered(cliente) {
    const clientes = JSON.parse(localStorage.getItem('clientes')) || [];
    return clientes.some(client => client.nombre === cliente);
}

function isVendedorRegistered(vendedor) {
    const vendedores = JSON.parse(localStorage.getItem('vendedores')) || [];
    return vendedores.some(vend => vend.nombre === vendedor);
}
function saveFactura(e) {
    e.preventDefault();
    
    const facturaData = getFacturaData();

    
    if (!isClienteRegistered(facturaData.cliente)) {
        alert('El cliente no está registrado. ¿Desea registrar al cliente?');
        window.location.href = 'cliente.html'; 
        return;
    }

    if (!isVendedorRegistered(facturaData.vendedor)) {
        alert('El vendedor no está registrado. ¿Desea registrar al vendedor?');
        window.location.href = 'vendedores.html'; 
        return;
    }

    const facturas = getStoredFacturas();

    const editingId = document.getElementById('facturaForm').dataset.editing;

    if (editingId) {
        const facturaIndex = facturas.findIndex(factura => factura.id == editingId);
        if (facturaIndex > -1) {
            facturas[facturaIndex] = {
                id: editingId,
                ...facturaData
            };
        }
        delete document.getElementById('facturaForm').dataset.editing;
    } else {
        facturas.push({
            id: Date.now(),
            ...facturaData
        });
    }

    setStoredFacturas(facturas);
    document.getElementById('facturaForm').reset();
    showFacturas(facturas);
}

function filtrar(e) {
    e.preventDefault();
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

    generarInforme(facturasFiltradas);
}
function generarInforme(facturas){

    let sum = 0;

    facturas.forEach(factura => {
       sum+= factura.comision ;
    })
    console.log(sum)
}

function showFacturas(facturas) {
    const facturasView = document.getElementById('facturasTable').getElementsByTagName('tbody')[0];
    facturasView.innerHTML = '';
    facturas.forEach(factura => {
        facturasView.innerHTML += `<tr>
            <td>${factura.fecha}</td>
            <td>${factura.cliente}</td>
            <td>${factura.vendedor}</td>
            <td>${factura.comision}</td>
            <td>${factura.total}</td>
            <td>${factura.tipoPago}</td>
            <td>
                <button class="btn btn-warning btn-sm" onclick="editFactura(${factura.id})">Editar</button>
                <button class="btn btn-danger btn-sm" onclick="deleteFactura(${factura.id})">Eliminar</button>
            </td>
        </tr>`;
    });
}

function editFactura(id) {
    const facturas = getStoredFacturas();
    const facturaToEdit = facturas.find(factura => factura.id === id);

    if (!facturaToEdit) return;

    document.getElementById('fecha').value = facturaToEdit.fecha;
    document.getElementById('cliente').value = facturaToEdit.cliente;
    document.getElementById('vendedor').value = facturaToEdit.vendedor;
    document.getElementById('tipoPago').value = facturaToEdit.tipoPago;
    document.getElementById('total').value = facturaToEdit.total;

    const itemsDiv = document.getElementById('itemsDiv');
    itemsDiv.innerHTML = '';

    itemsCounter = 0;
    facturaToEdit.items.forEach(item => {
        addItem();
        const lastItemDiv = itemsDiv.lastElementChild;
        lastItemDiv.querySelector('.cantidad').value = item.cantidad;
        lastItemDiv.querySelector('.descripcion').value = item.descripcion;
        lastItemDiv.querySelector('.precio').value = item.precio;
        lastItemDiv.querySelector('.subtotal').value = item.subtotal;
    });

    document.getElementById('facturaForm').dataset.editing = id;
}


function deleteFactura(id) {
    const facturas = getStoredFacturas();
    const updatedFacturas = facturas.filter(factura => factura.id !== id);
    setStoredFacturas(updatedFacturas);
    showFacturas(facturas);
}

showFacturas(facturas);
