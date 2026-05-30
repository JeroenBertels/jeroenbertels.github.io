(() => {
  const canonicalHost = "brtls.be";
  const redirectHosts = new Set(["www.brtls.be", "jeroenbertels.github.io"]);

  if (redirectHosts.has(window.location.hostname)) {
    window.location.replace(`https://${canonicalHost}${window.location.pathname}${window.location.search}${window.location.hash}`);
    return;
  }

  const navToggle = document.querySelector("[data-nav-toggle]");
  const nav = document.querySelector("[data-nav]");

  if (navToggle && nav) {
    navToggle.addEventListener("click", () => {
      const isOpen = document.body.classList.toggle("nav-open");
      navToggle.setAttribute("aria-expanded", String(isOpen));
    });

    nav.addEventListener("click", (event) => {
      if (event.target instanceof HTMLAnchorElement) {
        document.body.classList.remove("nav-open");
        navToggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  const form = document.querySelector("[data-contact-form]");

  if (form) {
    form.addEventListener("submit", (event) => {
      event.preventDefault();

      if (!form.reportValidity()) {
        return;
      }

      const data = new FormData(form);
      const name = data.get("name")?.toString().trim() || "";
      const email = data.get("email")?.toString().trim() || "";
      const company = data.get("company")?.toString().trim() || "";
      const topic = data.get("topic")?.toString().trim() || "Consultancy";
      const message = data.get("message")?.toString().trim() || "";
      const subject = `BRTLS Logic enquiry: ${topic}`;
      const body = [
        `Name: ${name}`,
        `Email: ${email}`,
        company ? `Company: ${company}` : "",
        `Topic: ${topic}`,
        "",
        message,
      ].filter(Boolean).join("\n");

      window.location.href = `mailto:contact@brtls.be?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    });
  }

  const canvas = document.getElementById("logic-canvas");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  if (!canvas || reduceMotion.matches) {
    return;
  }

  const ctx = canvas.getContext("2d");
  const pointer = { x: 0, y: 0, active: false };
  let nodes = [];
  let rafId = 0;
  let width = 0;
  let height = 0;
  let dpr = 1;

  const colors = {
    ink: "rgba(6, 62, 104, 0.62)",
    teal: "rgba(19, 179, 193, 0.68)",
    aqua: "rgba(95, 199, 205, 0.34)",
    line: "rgba(6, 62, 104, 0.14)",
    lineHot: "rgba(19, 179, 193, 0.38)",
  };

  function resize() {
    const rect = canvas.getBoundingClientRect();
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = rect.width;
    height = rect.height;
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    createNodes();
  }

  function createNodes() {
    const area = Math.max(width * height, 1);
    const count = Math.max(30, Math.min(68, Math.round(area / 17000)));
    nodes = Array.from({ length: count }, (_, index) => {
      const columnBias = index / count;
      return {
        x: width * (0.1 + Math.random() * 0.86),
        y: height * (0.08 + Math.random() * 0.82),
        vx: (Math.random() - 0.5) * 0.24,
        vy: (Math.random() - 0.5) * 0.24,
        radius: 2.4 + Math.random() * 2.8,
        phase: Math.random() * Math.PI * 2,
        color: columnBias > 0.58 ? colors.teal : colors.ink,
      };
    });
  }

  function drawFacet(a, b, c, alpha) {
    ctx.beginPath();
    ctx.moveTo(a.x, a.y);
    ctx.lineTo(b.x, b.y);
    ctx.lineTo(c.x, c.y);
    ctx.closePath();
    ctx.fillStyle = `rgba(95, 199, 205, ${alpha})`;
    ctx.fill();
  }

  function animate(time) {
    ctx.clearRect(0, 0, width, height);
    ctx.lineCap = "round";

    for (const node of nodes) {
      const pulse = Math.sin(time * 0.0012 + node.phase) * 0.18;
      node.x += node.vx + pulse * 0.1;
      node.y += node.vy + Math.cos(time * 0.001 + node.phase) * 0.06;

      if (node.x < -20) node.x = width + 20;
      if (node.x > width + 20) node.x = -20;
      if (node.y < -20) node.y = height + 20;
      if (node.y > height + 20) node.y = -20;
    }

    for (let i = 0; i < nodes.length; i += 1) {
      const a = nodes[i];
      for (let j = i + 1; j < nodes.length; j += 1) {
        const b = nodes[j];
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const distance = Math.hypot(dx, dy);
        const maxDistance = width < 680 ? 108 : 142;

        if (distance < maxDistance) {
          const alpha = (1 - distance / maxDistance) * 0.52;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = pointer.active && Math.hypot(pointer.x - a.x, pointer.y - a.y) < 170 ? colors.lineHot : colors.line;
          ctx.globalAlpha = alpha;
          ctx.lineWidth = 1.2;
          ctx.stroke();
          ctx.globalAlpha = 1;
        }
      }
    }

    for (let i = 0; i < nodes.length - 2; i += 9) {
      const a = nodes[i];
      const b = nodes[i + 1];
      const c = nodes[i + 2];
      if (Math.hypot(a.x - b.x, a.y - b.y) < 170 && Math.hypot(b.x - c.x, b.y - c.y) < 170) {
        drawFacet(a, b, c, 0.025);
      }
    }

    for (const node of nodes) {
      const pointerDistance = pointer.active ? Math.hypot(pointer.x - node.x, pointer.y - node.y) : Infinity;
      const lift = Math.max(0, 1 - pointerDistance / 180);
      ctx.beginPath();
      ctx.arc(node.x, node.y, node.radius + lift * 2.6, 0, Math.PI * 2);
      ctx.fillStyle = lift > 0 ? colors.teal : node.color;
      ctx.fill();
    }

    rafId = window.requestAnimationFrame(animate);
  }

  canvas.addEventListener("pointermove", (event) => {
    const rect = canvas.getBoundingClientRect();
    pointer.x = event.clientX - rect.left;
    pointer.y = event.clientY - rect.top;
    pointer.active = true;
  });

  canvas.addEventListener("pointerleave", () => {
    pointer.active = false;
  });

  window.addEventListener("resize", resize);
  resize();
  rafId = window.requestAnimationFrame(animate);

  window.addEventListener("pagehide", () => {
    window.cancelAnimationFrame(rafId);
  });
})();
