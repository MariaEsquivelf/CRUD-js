document.getElementById('vendedorForm').addEventListener('submit', saveVendedor);
function getVendedorData() {
    return {
        vendedorId: document.getElementById('vendedorId').value,
        nombre: document.getElementById('nombre').value,
        ruc: document.getElementById('ruc').value,
        direccion: document.getElementById('direccion').value,
        telefono: document.getElementById('telefono').value,
        comision: document.getElementById('comision').value
    };
}

function getStoredVendedores() {
    return JSON.parse(localStorage.getItem('vendedores')) || [];
}

function setStoredVendedores(vendedores) {
    localStorage.setItem('vendedores', JSON.stringify(vendedores));
}



function saveVendedor(e) {
    e.preventDefault();
    const { vendedorId, nombre, ruc, direccion, telefono, comision } = getVendedorData();
    const vendedores = getStoredVendedores();

    if (vendedorId === '') {
        // Nuevo vendedor
        vendedores.push({
            id: Date.now(),
            nombre,
            ruc,
            direccion,
            telefono,
            comision
        });
    } else {
        // Editar vendedor existente
        const vendedor = vendedores.find(vend => vend.id == vendedorId);
        if (vendedor) {
            vendedor.nombre = nombre;
            vendedor.ruc = ruc;
            vendedor.direccion = direccion;
            vendedor.telefono = telefono;
            vendedor.comision = comision;
            document.getElementById('vendedorId').value = ''; // Limpiar el campo de ID después de editar
        }
    }

    setStoredVendedores(vendedores);
    document.getElementById('vendedorForm').reset();
    showVendedores();
}

function showVendedores(filter) {
    const vendedores = getStoredVendedores();
    const vendedoresView = document.getElementById('vendedoresTable').getElementsByTagName('tbody')[0];
    vendedoresView.innerHTML = '';

    vendedores.forEach(vendedor => {
        vendedoresView.innerHTML += `<tr>
            <td>${vendedor.nombre}</td>
            <td>${vendedor.ruc}</td>
            <td>${vendedor.direccion}</td>
            <td>${vendedor.telefono}</td>
            <td>${vendedor.comision}</td>
            <td>
                <button class="btn btn-warning btn-sm" onclick="editVendedor(${vendedor.id})">Editar</button>
                <button class="btn btn-danger btn-sm" onclick="deleteVendedor(${vendedor.id})">Eliminar</button>
            </td>
        </tr>`;
    });
}

function editVendedor(id) {
    const vendedor = getStoredVendedores().find(vend => vend.id == id);
    if (vendedor) {
        document.getElementById('vendedorId').value = vendedor.id;
        document.getElementById('nombre').value = vendedor.nombre;
        document.getElementById('ruc').value = vendedor.ruc;
        document.getElementById('direccion').value = vendedor.direccion;
        document.getElementById('telefono').value = vendedor.telefono;
        document.getElementById('comision').value = vendedor.comision;
    }
}

function deleteVendedor(id) {
    const vendedores = getStoredVendedores();
    const updatedVendedores = vendedores.filter(vend => vend.id != id);
    setStoredVendedores(updatedVendedores);
    showVendedores();
}

showVendedores();
