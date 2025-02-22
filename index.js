const fs = require("fs");
const prompts = require("prompts");
const chalk = require("chalk");

// Ruta del archivo JSON donde se almacenan las tareas
const TASKS_FILE = "tasks.json";

// Cargar tareas desde el archivo JSON
function loadTasks() {
  if (!fs.existsSync(TASKS_FILE)) {
    fs.writeFileSync(TASKS_FILE, JSON.stringify([]));
  }
  return JSON.parse(fs.readFileSync(TASKS_FILE, "utf-8"));
}

// Guardar tareas en el archivo JSON
function saveTasks(tasks) {
  fs.writeFileSync(TASKS_FILE, JSON.stringify(tasks, null, 2));
}

// Mostrar el menú principal
async function showMenu() {
  const { action } = await prompts({
    type: "select",
    name: "action",
    message: "¿Qué quieres hacer?",
    choices: [
      { title: "Listar tareas", value: "list" },
      { title: "Agregar tarea", value: "add" },
      { title: "Marcar tarea como completada", value: "complete" },
      { title: "Eliminar tarea", value: "delete" },
      { title: "Salir", value: "exit" },
    ],
  });

  return action;
}

// Listar todas las tareas
function listTasks(tasks) {
  console.log(chalk.bold("\nTareas:\n"));
  tasks.forEach((task, index) => {
    const status = task.completed ? chalk.green("✓") : chalk.red("✗");
    console.log(`${index + 1}. ${status} ${task.title}`);
  });
  console.log("");
}

// Agregar una nueva tarea
async function addTask(tasks) {
  const { title } = await prompts({
    type: "text",
    name: "title",
    message: "Ingresa el título de la tarea:",
  });

  tasks.push({ title, completed: false });
  saveTasks(tasks);
  console.log(chalk.green("Tarea agregada con éxito!\n"));
}

// Marcar una tarea como completada
async function completeTask(tasks) {
  listTasks(tasks);
  const { index } = await prompts({
    type: "number",
    name: "index",
    message: "Ingresa el número de la tarea a marcar como completada:",
    validate: (value) =>
      value > 0 && value <= tasks.length ? true : "Número de tarea inválido",
  });

  tasks[index - 1].completed = true;
  saveTasks(tasks);
  console.log(chalk.green("Tarea marcada como completada!\n"));
}

// Eliminar una tarea
async function deleteTask(tasks) {
  listTasks(tasks);
  const { index } = await prompts({
    type: "number",
    name: "index",
    message: "Ingresa el número de la tarea a eliminar:",
    validate: (value) =>
      value > 0 && value <= tasks.length ? true : "Número de tarea inválido",
  });

  tasks.splice(index - 1, 1);
  saveTasks(tasks);
  console.log(chalk.green("Tarea eliminada con éxito!\n"));
}

// Función principal
async function main() {
  let tasks = loadTasks();

  while (true) {
    const action = await showMenu();

    switch (action) {
      case "list":
        listTasks(tasks);
        break;
      case "add":
        await addTask(tasks);
        break;
      case "complete":
        await completeTask(tasks);
        break;
      case "delete":
        await deleteTask(tasks);
        break;
      case "exit":
        console.log(chalk.yellow("Saliendo de la aplicación..."));
        process.exit(0);
      default:
        console.log(chalk.red("Opción no válida\n"));
    }
  }
}

main();
