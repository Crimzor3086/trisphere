// --- Dynamic Toast notifications ---
    function showToast(title, body, type = "success") {
      const container = document.getElementById("toastContainer");
      const toast = document.createElement("div");
      toast.className = `toast ${type}`;
      toast.innerHTML = `
        <div style="display:flex; flex-direction:column">
          <span style="font-size:0.85rem; font-weight:700">${title}</span>
          <span style="font-size:0.75rem; color:var(--text-muted); margin-top:2px">${body}</span>
        </div>
      `;
      container.appendChild(toast);
      
      setTimeout(() => {
        toast.style.animation = "fadeOut 0.3s forwards";
        setTimeout(() => {
          container.removeChild(toast);
        }, 300);
      }, 3500);
    }
