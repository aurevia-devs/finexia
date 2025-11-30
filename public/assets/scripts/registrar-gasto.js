let gastos = JSON.parse(localStorage.getItem('gastos')) || [];
let transferencias = JSON.parse(localStorage.getItem('transferencias')) || [];

const gastoForm = document.getElementById('gastoForm');
const listaGastos = document.getElementById('listaGastos');
const listaTransferencias = document.getElementById('listaTransferencias');
const saldoTotalEl = document.getElementById('saldoTotal');

function actualizarListaGastos() {
  listaGastos.innerHTML = '';

  gastos.forEach((gasto, index) => {
    const li = document.createElement('li');
    li.innerHTML = `
      ${gasto.fecha} - ${gasto.categoria}: $${gasto.monto.toFixed(2)}
      <button class="eliminar-btn" data-index="${index}">Eliminar</button>
    `;
    listaGastos.appendChild(li);
  });

  document.querySelectorAll('.eliminar-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const index = e.target.getAttribute('data-index');
      eliminarGasto(index);
    });
  });
}

function actualizarListaTransferencias() {
  listaTransferencias.innerHTML = '';

  transferencias.forEach((t, index) => {
    const li = document.createElement('li');
    li.innerHTML = `
      ${t.fecha} - ${t.nombre}: $${t.monto.toFixed(2)}
      <button class="hecho-btn" data-index="${index}">He realizado la transferencia</button>
      <button class="eliminar-t-btn" data-index="${index}">Eliminar</button>
    `;
    listaTransferencias.appendChild(li);
  });

  document.querySelectorAll('.hecho-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const index = e.target.getAttribute('data-index');
      transferirComoGasto(index);
    });
  });

  document.querySelectorAll('.eliminar-t-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const index = e.target.getAttribute('data-index');
      transferencias.splice(index, 1);
      localStorage.setItem('transferencias', JSON.stringify(transferencias));
      actualizarListaTransferencias();
    });
  });
}

function transferirComoGasto(index) {
  const t = transferencias[index];

  gastos.push({ categoria: t.nombre, monto: t.monto, fecha: t.fecha });
  localStorage.setItem('gastos', JSON.stringify(gastos));

  transferencias.splice(index, 1);
  localStorage.setItem('transferencias', JSON.stringify(transferencias));

  actualizarListaGastos();
  actualizarListaTransferencias();
  actualizarSaldo();
}

function actualizarSaldo() {
  const saldoTotal = gastos.reduce((sum, g) => sum + g.monto, 0);
  saldoTotalEl.textContent = saldoTotal.toFixed(2);
}

function eliminarGasto(index) {
  gastos.splice(index, 1);
  localStorage.setItem('gastos', JSON.stringify(gastos));
  actualizarListaGastos();
  actualizarSaldo();
}

gastoForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const categoria = document.getElementById('categoria').value;
  const monto = parseFloat(document.getElementById('monto').value);
  const fecha = document.getElementById('fecha').value;
  const fechaPago = document.getElementById('fechaPago').value;

  if (!categoria || !monto || !fecha) return alert("Completa todos los campos");

  gastos.push({ categoria, monto, fecha });
  localStorage.setItem('gastos', JSON.stringify(gastos));

  if (fechaPago && new Date(fechaPago) > new Date()) {
    transferencias.push({ nombre: categoria, monto, fecha: fechaPago });
    localStorage.setItem('transferencias', JSON.stringify(transferencias));
  }

  actualizarListaGastos();
  actualizarListaTransferencias();
  actualizarSaldo();
  gastoForm.reset();
});

actualizarListaGastos();
actualizarListaTransferencias();
actualizarSaldo();
