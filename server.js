const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

// Middleware para servir archivos estáticos en la carpeta "public"
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json()); // Middleware para analizar el cuerpo de las solicitudes JSON

// Endpoint para manejar la reserva de servicios
app.post("/api/reservations", (req, res) => {
  const { serviceType, serviceDate } = req.body;

  // Aquí podrías agregar lógica para guardar los datos en una base de datos
  // Por ahora, simulemos un registro de reserva en el servidor
  console.log("Reserva recibida:", { serviceType, serviceDate });

  // Respuesta de éxito
  res.json({ message: "Reserva realizada con éxito" });
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor iniciado en http://localhost:${PORT}`);
});
// Endpoint para obtener el historial de servicios
app.get("/api/history", (req, res) => {
  // Historial simulado de servicios
  const history = [
    { serviceDate: "2024-10-01", serviceType: "Mantenimiento", status: "Completado" },
    { serviceDate: "2024-12-15", serviceType: "Reparación", status: "Pendiente" },
    { serviceDate: "2023-11-01", serviceType: "Diagnóstico", status: "Completado" },
  ];

  // Enviar el historial como respuesta
  res.json(history);
});
// Datos simulados de perfil de usuario
let userProfile = {
  username: "Usuario Ejemplo",
  email: "usuario@ejemplo.com"
};

// Endpoint para obtener los datos del perfil
app.get("/api/profile", (req, res) => {
  res.json(userProfile);
});

// Endpoint para actualizar los datos del perfil
app.post("/api/profile", (req, res) => {
  const { username, email } = req.body;
  userProfile = { username, email }; // Actualizar el perfil simulado

  res.json({ message: "Perfil actualizado con éxito", userProfile });
});
// Datos simulados de proveedores
let providers = [
  { id: 1, name: "Proveedor Ejemplo 1", contact: "contacto1@ejemplo.com" },
  { id: 2, name: "Proveedor Ejemplo 2", contact: "contacto2@ejemplo.com" },
];

// Endpoint para obtener la lista de proveedores
app.get("/api/providers", (req, res) => {
  res.json(providers);
});

// Endpoint para agregar un nuevo proveedor
app.post("/api/providers", (req, res) => {
  const { name, contact } = req.body;

  // Crear un nuevo proveedor con un ID único
  const newProvider = { id: providers.length + 1, name, contact };
  providers.push(newProvider);

  res.json({ message: "Proveedor agregado con éxito", provider: newProvider });
});
// Datos simulados de servicios completados
let completedServices = [
  { id: 1, serviceDate: "2023-10-01", serviceType: "Mantenimiento", cost: 100 },
  { id: 2, serviceDate: "2023-10-15", serviceType: "Reparación", cost: 150 },
  { id: 3, serviceDate: "2023-11-01", serviceType: "Diagnóstico", cost: 80 },
];

// Endpoint para obtener los servicios completados (facturables)
app.get("/api/completed-services", (req, res) => {
  res.json(completedServices);
});

// Endpoint para generar la factura de un servicio
app.post("/api/generate-invoice", (req, res) => {
  const { serviceId } = req.body;
  const service = completedServices.find((s) => s.id === serviceId);

  if (service) {
    // Generar datos simulados de factura
    const invoice = {
      invoiceId: `FAC-${serviceId}-${Date.now()}`,
      serviceDate: service.serviceDate,
      serviceType: service.serviceType,
      cost: service.cost,
      generatedAt: new Date().toISOString(),
    };

    res.json({ message: "Factura generada con éxito", invoice });
  } else {
    res.status(404).json({ error: "Servicio no encontrado" });
  }
});

