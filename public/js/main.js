document.addEventListener("DOMContentLoaded", () => {
    // === SECCIÓN DE RESERVAS ===
    const reservationForm = document.querySelector("#reservation form");
  
    if (reservationForm) {
      reservationForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const serviceType = document.getElementById("serviceType").value;
        const serviceDate = document.getElementById("serviceDate").value;
  
        try {
          const response = await fetch("/api/reservations", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ serviceType, serviceDate }),
          });
  
          const data = await response.json();
          if (response.ok) {
            alert("Reserva realizada con éxito");
            reservationForm.reset();
          } else {
            alert(`Error: ${data.error}`);
          }
        } catch (error) {
          console.error("Error al enviar la reserva:", error);
          alert("Hubo un problema al realizar la reserva.");
        }
      });
    }
  
    // === SECCIÓN HISTORIAL DE SERVICIOS ===
    const historyTableBody = document.getElementById("historyTableBody");
    const historyTab = document.getElementById("history-tab");
  
    async function loadServiceHistory() {
      try {
        const response = await fetch("/api/history");
        const historyData = await response.json();
        historyTableBody.innerHTML = "";
        historyData.forEach((entry) => {
          const row = document.createElement("tr");
          row.innerHTML = `<td>${entry.serviceDate}</td><td>${entry.serviceType}</td><td>${entry.status}</td>`;
          historyTableBody.appendChild(row);
        });
      } catch (error) {
        console.error("Error al cargar el historial:", error);
      }
    }
  
    if (historyTab) {
      historyTab.addEventListener("click", loadServiceHistory);
    }
  
    // === SECCIÓN PERFIL DE USUARIO ===
    const profileForm = document.getElementById("profileForm");
    const usernameInput = document.getElementById("username");
    const emailInput = document.getElementById("email");
    const profileTab = document.getElementById("profile-tab");
  
    async function loadUserProfile() {
      try {
        const response = await fetch("/api/profile");
        const userProfile = await response.json();
        usernameInput.value = userProfile.username;
        emailInput.value = userProfile.email;
      } catch (error) {
        console.error("Error al cargar el perfil:", error);
      }
    }
  
    async function updateUserProfile(event) {
      event.preventDefault();
      const updatedProfile = {
        username: usernameInput.value,
        email: emailInput.value,
      };
  
      try {
        const response = await fetch("/api/profile", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedProfile),
        });
  
        const result = await response.json();
        if (response.ok) {
          alert(result.message);
        } else {
          alert(`Error: ${result.error}`);
        }
      } catch (error) {
        console.error("Error al actualizar el perfil:", error);
        alert("Hubo un problema al actualizar el perfil.");
      }
    }
  
    if (profileTab) {
      profileTab.addEventListener("click", loadUserProfile);
    }
    if (profileForm) {
      profileForm.addEventListener("submit", updateUserProfile);
    }
  
    // === SECCIÓN GESTIÓN DE PROVEEDORES ===
    const providerForm = document.getElementById("providerForm");
    const providersTableBody = document.getElementById("providersTableBody");
    let providers = [];
  
    function renderProviders() {
      providersTableBody.innerHTML = "";
      providers.forEach((provider, index) => {
        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${provider.name}</td>
          <td>${provider.industry}</td>
          <td>${provider.contact}</td>
          <td>
            <button class="btn btn-sm btn-danger" onclick="deleteProvider(${index})">Eliminar</button>
          </td>`;
        providersTableBody.appendChild(row);
      });
    }
  
    providerForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const newProvider = {
        name: document.getElementById("providerName").value,
        industry: document.getElementById("providerIndustry").value,
        contact: document.getElementById("providerContact").value,
      };
  
      providers.push(newProvider);
      renderProviders();
      providerForm.reset();
    });
  
    window.deleteProvider = (index) => {
      providers.splice(index, 1);
      renderProviders();
    };
  
    // === SECCIÓN GESTIÓN DE FACTURAS ===
    const billingTableBody = document.getElementById("billingTableBody");
    const billingTab = document.getElementById("billing-tab");
  
    async function loadBillableServices() {
      try {
        const response = await fetch("/api/completed-services");
        const servicesData = await response.json();
        billingTableBody.innerHTML = "";
  
        servicesData.forEach((service) => {
          const row = document.createElement("tr");
          row.innerHTML = `
            <td>${service.serviceDate}</td>
            <td>${service.serviceType}</td>
            <td>$${service.cost}</td>
            <td><button class="btn btn-sm btn-success" onclick="generateInvoice(${service.id})">Generar Factura</button></td>`;
          billingTableBody.appendChild(row);
        });
      } catch (error) {
        console.error("Error al cargar servicios facturables:", error);
      }
    }
  
    window.generateInvoice = async function (serviceId) {
      try {
        const response = await fetch("/api/generate-invoice", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ serviceId }),
        });
        const result = await response.json();
        if (response.ok) {
          alert(`Factura generada:\nID: ${result.invoice.invoiceId}\nTipo: ${result.invoice.serviceType}\nFecha: ${result.invoice.serviceDate}\nCosto: $${result.invoice.cost}\nGenerada el: ${result.invoice.generatedAt}`);
        } else {
          alert(`Error: ${result.error}`);
        }
      } catch (error) {
        console.error("Error al generar factura:", error);
        alert("Hubo un problema al generar la factura.");
      }
    };
  
    if (billingTab) {
      billingTab.addEventListener("click", loadBillableServices);
    }
  });
  
  