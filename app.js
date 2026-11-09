// Datos ficticios incluidos en el código.
// No se usa base de datos, PHP, localStorage ni servidor.
const estudiantesIniciales = [
  { id: 1, nombre: "CB 160", curso: "34.000 Bs", Conprado: true },
  { id: 2, nombre: "Navi", curso: "32.000 Bs", presente: false },
  { id: 3, nombre: "Wave 110S", curso: "15.000 Bs", presente: true },
  { id: 4, nombre: "XR 190L", curso: "34.000 Bs", presente: true },
  { id: 5, nombre: "X-Blade 160", curso: "26.000 Bs", presente: false },
  { id: 6, nombre: "CB 100", curso: "13.000 Bs", presente: true },
  { id: 7, nombre:"XR300L Tornado", curso: "52.000 Bs", presente: true },
  { id: 8, nombre: "CRF 1100L Africa Twin", curso: "140.000 Bs", presente: false }
];

// Se crea una copia en memoria. Los cambios se pierden al recargar.
let estudiantes = estudiantesIniciales.map(estudiante => ({ ...estudiante }));

const buscar = document.getElementById("buscar");
const filtroCurso = document.getElementById("filtroCurso");
const lista = document.getElementById("listaEstudiantes");
const sinResultados = document.getElementById("sinResultados");

function iniciales(nombre) {
  return nombre
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map(parte => parte.charAt(0))
    .join("")
    .toUpperCase();
}

function prepararCursos() {
  const cursos = [...new Set(estudiantes.map(e => e.curso))].sort();
  cursos.forEach(curso => {
    const opcion = document.createElement("option");
    opcion.value = curso;
    opcion.textContent = curso;
    filtroCurso.appendChild(opcion);
  });
  document.getElementById("totaldeMotos").textContent = estudiantes.length;
  document.getElementById("totalMotos").textContent = cursos.length;
}

function actualizarResumen() {
  const presentes = estudiantes.filter(e => e.presente).length;
  document.getElementById("totaldeComprados").textContent = presentes;
}

function cambiarAsistencia(id, presente) {
  const estudiante = estudiantes.find(e => e.id === id);
  if (!estudiante) return;
  estudiante.presente = presente;
  // Solo se modifica la memoria temporal; no se guarda en el dispositivo.
  mostrarEstudiantes();
}

function crearTarjeta(estudiante) {
  const tarjeta = document.createElement("article");
  tarjeta.className = "Motos";

  const datos = document.createElement("div");
  datos.className = "datos-Motos";

  const avatar = document.createElement("div");
  avatar.className = "avatar";
  avatar.textContent = iniciales(estudiante.nombre);

  const texto = document.createElement("div");
  const nombre = document.createElement("h3");
  nombre.className = "nombre-Moto";
  nombre.textContent = estudiante.nombre;

  const curso = document.createElement("p");
  curso.className = "curso-Moto";
  curso.textContent = "Curso: " + estudiante.curso;

  texto.append(nombre, curso);
  datos.append(avatar, texto);

  const estado = document.createElement("span");
  estado.className = "estado " + (estudiante.presente ? "presente" : "ausente");
  estado.textContent = estudiante.presente ? "✓ Libre (demo)" : "✕ Comprado (demo)";

  const botones = document.createElement("div");
  botones.className = "botones";

  const btnPresente = document.createElement("button");
  btnPresente.className = "btn-presente";
  btnPresente.textContent = "Marcar Moto Libre";
  btnPresente.setAttribute("aria-label", "Marcar presente a " + estudiante.nombre);
  btnPresente.addEventListener("click", () => cambiarAsistencia(estudiante.id, true));

  const btnAusente = document.createElement("button");
  btnAusente.className = "btn-ausente";
  btnAusente.textContent = "Marcar Moto Comprado";
  btnAusente.setAttribute("aria-label", "Marcar ausente a " + estudiante.nombre);
  btnAusente.addEventListener("click", () => cambiarAsistencia(estudiante.id, false));

  botones.append(btnPresente, btnAusente);
  tarjeta.append(datos, estado, botones);
  return tarjeta;
}

function mostrarEstudiantes() {
  const consulta = buscar.value.trim().toLocaleLowerCase("es");
  const cursoElegido = filtroCurso.value;

  const filtrados = estudiantes.filter(estudiante => {
    const coincideTexto =
      estudiante.nombre.toLocaleLowerCase("es").includes(consulta) ||
      estudiante.curso.toLocaleLowerCase("es").includes(consulta);
    const coincideCurso = cursoElegido === "todos" || estudiante.curso === cursoElegido;
    return coincideTexto && coincideCurso;
  });

  lista.replaceChildren();
  filtrados.forEach(estudiante => lista.appendChild(crearTarjeta(estudiante)));
  sinResultados.hidden = filtrados.length !== 0;
  actualizarResumen();
}

buscar.addEventListener("input", mostrarEstudiantes);
filtroCurso.addEventListener("change", mostrarEstudiantes);

prepararCursos();
mostrarEstudiantes();
