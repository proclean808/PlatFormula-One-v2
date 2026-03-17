// Phase 2: Kinetic Graph System (animated flow + pulse transport)

window.AIOSX_GRAPH = (function () {
  const canvas = document.getElementById("workflow-graph");
  if (!canvas) return {};

  const ctx = canvas.getContext("2d");
  let width, height;

  const nodes = [
    { id: "input",        label: "Input",   x: 0, y: 0, state: "idle" },
    { id: "voices",       label: "Voice",   x: 0, y: 0, state: "idle" },
    { id: "debate",       label: "Debate",  x: 0, y: 0, state: "idle" },
    { id: "orchestrator", label: "Route",   x: 0, y: 0, state: "idle" },
    { id: "execution",    label: "Execute", x: 0, y: 0, state: "idle" },
    { id: "memory",       label: "Memory",  x: 0, y: 0, state: "idle" },
    { id: "output",       label: "Output",  x: 0, y: 0, state: "idle" },
  ];

  const edges = [
    ["input", "voices"],
    ["voices", "debate"],
    ["debate", "orchestrator"],
    ["orchestrator", "execution"],
    ["execution", "memory"],
    ["memory", "output"],
  ];

  let flowProgress = 0;
  let lastTime = performance.now();

  function layout() {
    const rect = canvas.getBoundingClientRect();
    width  = canvas.width  = rect.width  * devicePixelRatio;
    height = canvas.height = rect.height * devicePixelRatio;

    ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);

    const spacingX = rect.width / 6;
    const centerY  = rect.height / 2;

    nodes.forEach((node, i) => {
      node.x = spacingX * (i + 0.5);
      node.y = centerY + Math.sin(i * 0.8) * 30;
    });
  }

  window.addEventListener("resize", layout);
  layout();

  function getColor(state) {
    if (state === "running") return "#38bdf8";
    if (state === "success") return "#4ade80";
    if (state === "error")   return "#f97316";
    return "#64748b";
  }

  function drawEdge(from, to) {
    const dx = to.x - from.x;
    const dy = to.y - from.y;

    // base dashed line
    ctx.strokeStyle = "rgba(148,163,184,0.25)";
    ctx.lineWidth = 1;
    ctx.setLineDash([6, 6]);
    ctx.beginPath();
    ctx.moveTo(from.x, from.y);
    ctx.lineTo(to.x, to.y);
    ctx.stroke();

    // animated flow pulse
    ctx.setLineDash([]);
    const t  = flowProgress % 1;
    const px = from.x + dx * t;
    const py = from.y + dy * t;

    const grad = ctx.createRadialGradient(px, py, 0, px, py, 20);
    grad.addColorStop(0, "rgba(56,189,248,0.9)");
    grad.addColorStop(1, "rgba(56,189,248,0)");

    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(px, py, 16, 0, Math.PI * 2);
    ctx.fill();
  }

  function drawNode(node) {
    const r = 28;

    // glow halo
    const grad = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, r + 25);
    grad.addColorStop(0, getColor(node.state));
    grad.addColorStop(1, "rgba(0,0,0,0)");

    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(node.x, node.y, r + 10, 0, Math.PI * 2);
    ctx.fill();

    // core circle
    ctx.fillStyle = "rgba(15,23,42,0.95)";
    ctx.beginPath();
    ctx.arc(node.x, node.y, r, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = getColor(node.state);
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.fillStyle = "#e5e7eb";
    ctx.font = "11px system-ui";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(node.label, node.x, node.y + 1);
  }

  function draw(now) {
    const dt = now - lastTime;
    lastTime = now;

    flowProgress += dt * 0.0005;

    const rect = canvas.getBoundingClientRect();
    ctx.clearRect(0, 0, rect.width, rect.height);

    edges.forEach(([a, b]) => {
      const from = nodes.find((n) => n.id === a);
      const to   = nodes.find((n) => n.id === b);
      if (from && to) drawEdge(from, to);
    });

    nodes.forEach(drawNode);
    requestAnimationFrame(draw);
  }

  requestAnimationFrame(draw);

  function setNodeState(id, state) {
    const node = nodes.find((n) => n.id === id);
    if (node) node.state = state;
  }

  function resetAll() {
    nodes.forEach((n) => (n.state = "idle"));
    flowProgress = 0;
  }

  return { setNodeState, resetAll };
})();
