document.getElementById('clienteForm').addEventListener('submit', saveCliente);

function getClientData() {
    return {
        clienteId: document.getElementById('clienteId').value,
        nombre: document.getElementById('nombre').value,
        ruc: document.getElementById('ruc').value,
        direccion: document.getElementById('direccion').value,
        telefono: document.getElementById('telefono').value
    };
}

function getStoredClients() {
    return JSON.parse(localStorage.getItem('clientes')) || [];
}

function setStoredClients(clientes) {
    localStorage.setItem('clientes', JSON.stringify(clientes));
}

function saveCliente(e) {
    e.preventDefault();
    const { clienteId, nombre, ruc, direccion, telefono } = getClientData();
    const clientes = getStoredClients();

    if (clienteId === '') {
        clientes.push({
            id: Date.now(),
            nombre,
            ruc,
            direccion,
            telefono
        });
    } else {
        const cliente = clientes.find(client => client.id == clienteId);
        if (cliente) {
            cliente.nombre = nombre;
            cliente.ruc = ruc;
            cliente.direccion = direccion;
            cliente.telefono = telefono;
            document.getElementById('clienteId').value = ''; // Limpiar el campo de ID después de editar
        }
    }

    setStoredClients(clientes);
    document.getElementById('clienteForm').reset();
    showClientes();
}

function showClientes() {
    const clientes = getStoredClients();
    const clientesView = document.getElementById('clientesTable').getElementsByTagName('tbody')[0];
    clientesView.innerHTML = '';

    clientes.forEach(cliente => {
        clientesView.innerHTML += `<tr>
            <td>${cliente.nombre}</td>
            <td>${cliente.ruc}</td>
            <td>${cliente.direccion}</td>
            <td>${cliente.telefono}</td>
            <td>
                <button class="btn btn-warning btn-sm" onclick="editCliente(${cliente.id})">Editar</button>
                <button class="btn btn-danger btn-sm" onclick="deleteCliente(${cliente.id})">Eliminar</button>
            </td>
        </tr>`;
    });
}

function editCliente(id) {
    const cliente = getStoredClients().find(client => client.id == id);
    if (cliente) {
        document.getElementById('clienteId').value = cliente.id;
        document.getElementById('nombre').value = cliente.nombre;
        document.getElementById('ruc').value = cliente.ruc;
        document.getElementById('direccion').value = cliente.direccion;
        document.getElementById('telefono').value = cliente.telefono;
    }
}

function deleteCliente(id) {
    const clientes = getStoredClients();
    const updatedClientes = clientes.filter(client => client.id != id);
    setStoredClients(updatedClientes);
    showClientes();
}

showClientes();
