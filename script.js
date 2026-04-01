/* ═══════════════════════════════════════════════════════
   NodeOps Network Command Center — Full Application Logic
   ═══════════════════════════════════════════════════════ */
(function () {
  "use strict";

  /* ────────────────────────────────────────────────
     1. Network Canvas Background (Particle System)
     ──────────────────────────────────────────────── */
  var canvas = document.getElementById("networkCanvas");
  var ctx = canvas.getContext("2d");
  var particles = [];

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);

  function Particle() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.vx = (Math.random() - 0.5) * 0.4;
    this.vy = (Math.random() - 0.5) * 0.4;
    this.r = Math.random() * 2 + 1;
    this.color = ["#00E5A0", "#6C5CE7", "#00B4D8", "#FFB84D"][
      Math.floor(Math.random() * 4)
    ];
    this.alpha = Math.random() * 0.5 + 0.2;
  }
  Particle.prototype.update = function () {
    this.x += this.vx;
    this.y += this.vy;
    if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
    if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
  };
  Particle.prototype.draw = function () {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.globalAlpha = this.alpha;
    ctx.fill();
    ctx.globalAlpha = 1;
  };

  function initParticles() {
    var count = Math.min(
      Math.floor((canvas.width * canvas.height) / 18000),
      80
    );
    particles = [];
    for (var i = 0; i < count; i++) particles.push(new Particle());
  }
  initParticles();
  window.addEventListener("resize", initParticles);

  function animateNetwork() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (var i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();
      for (var j = i + 1; j < particles.length; j++) {
        var dx = particles[i].x - particles[j].x;
        var dy = particles[i].y - particles[j].y;
        var dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 160) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = particles[i].color;
          ctx.globalAlpha = (1 - dist / 160) * 0.12;
          ctx.lineWidth = 0.5;
          ctx.stroke();
          ctx.globalAlpha = 1;
        }
      }
    }
    requestAnimationFrame(animateNetwork);
  }
  animateNetwork();

  /* ────────────────────────────────────────────────
     2. Navigation
     ──────────────────────────────────────────────── */
  var nav = document.getElementById("topNav");
  window.addEventListener("scroll", function () {
    nav.classList.toggle("scrolled", window.scrollY > 20);
  });

  document.querySelectorAll(".nav-link[data-section]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      document
        .querySelectorAll(".nav-link[data-section]")
        .forEach(function (b) {
          b.classList.remove("active");
        });
      btn.classList.add("active");
      var target = document.getElementById(btn.dataset.section);
      if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });

  /* ────────────────────────────────────────────────
     3. Scroll Animations
     ──────────────────────────────────────────────── */
  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) e.target.classList.add("visible");
      });
    },
    { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
  );
  document.querySelectorAll(".fade-up").forEach(function (el) {
    observer.observe(el);
  });

  /* ────────────────────────────────────────────────
     4. Connect Wallet
     ──────────────────────────────────────────────── */
  document.getElementById("connectBtn").addEventListener("click", function () {
    var btn = this;
    btn.textContent = "Connecting...";
    btn.style.opacity = ".7";
    setTimeout(function () {
      btn.textContent = "0x7a3F...e9B2";
      btn.style.opacity = "1";
      btn.style.background = "var(--acc-bg)";
      btn.style.color = "var(--acc)";
      btn.style.border = "1px solid var(--acc-dim)";
    }, 1500);
  });

  /* ────────────────────────────────────────────────
     5. Deploy Cost Calculator
     ──────────────────────────────────────────────── */
  var cpuSlider = document.getElementById("cpuSlider");
  var ramSlider = document.getElementById("ramSlider");
  var storageSlider = document.getElementById("storageSlider");
  var cpuVal = document.getElementById("cpuVal");
  var ramVal = document.getElementById("ramVal");
  var storageVal = document.getElementById("storageVal");
  var deployCost = document.getElementById("deployCost");

  function updateCost() {
    var cpu = parseInt(cpuSlider.value);
    var ram = parseInt(ramSlider.value);
    var storage = parseInt(storageSlider.value);
    cpuVal.textContent = cpu + " cores";
    ramVal.textContent = ram + " GB";
    storageVal.textContent =
      storage >= 1000 ? (storage / 1000).toFixed(1) + " TB" : storage + " GB";
    var cost = cpu * 6.5 + ram * 2.2 + storage * 0.04;
    deployCost.textContent = "$" + cost.toFixed(2);
  }
  cpuSlider.addEventListener("input", updateCost);
  ramSlider.addEventListener("input", updateCost);
  storageSlider.addEventListener("input", updateCost);

  /* ────────────────────────────────────────────────
     6. Deploy Button
     ──────────────────────────────────────────────── */
  document.getElementById("deployBtn").addEventListener("click", function () {
    var btn = this;
    var original = btn.textContent;
    btn.textContent = "Deploying...";
    btn.style.opacity = ".7";
    setTimeout(function () {
      btn.textContent = "Node Deployed Successfully!";
      btn.style.background = "var(--acc2)";
      setTimeout(function () {
        btn.textContent = original;
        btn.style.background = "";
        btn.style.opacity = "1";
      }, 2000);
    }, 2000);
  });

  /* ────────────────────────────────────────────────
     7. Network Health Monitor
     ──────────────────────────────────────────────── */
  var healthData = [
    { name: "CPU Utilization", value: 72, color: "#00E5A0", sub: "847 cores active" },
    { name: "Memory Usage", value: 64, color: "#6C5CE7", sub: "2.4 TB / 3.8 TB" },
    { name: "Disk I/O", value: 45, color: "#00B4D8", sub: "12.4 GB/s throughput" },
    { name: "Network I/O", value: 81, color: "#FFB84D", sub: "94.2 Gbps aggregate" },
    { name: "GPU Load", value: 88, color: "#FF4D6A", sub: "312 GPUs active" },
    { name: "API Latency", value: 23, color: "#00E5A0", sub: "Avg 12ms response" },
  ];

  function renderHealthGrid() {
    var grid = document.getElementById("healthGrid");
    var circ = 2 * Math.PI * 38;
    grid.innerHTML = healthData
      .map(function (h) {
        var offset = circ - (h.value / 100) * circ;
        var valColor =
          h.value > 85
            ? "var(--red)"
            : h.value > 70
            ? "var(--warn)"
            : "var(--acc)";
        return (
          '<div class="health-card">' +
          '<div class="health-gauge">' +
          '<svg viewBox="0 0 80 80"><circle class="bg" cx="40" cy="40" r="38"/>' +
          '<circle class="fill" cx="40" cy="40" r="38" stroke="' +
          h.color +
          '" stroke-dasharray="' +
          circ +
          '" stroke-dashoffset="' +
          offset +
          '"/></svg>' +
          '<div class="health-val" style="color:' +
          valColor +
          '">' +
          h.value +
          "%</div></div>" +
          '<div class="health-name">' +
          h.name +
          "</div>" +
          '<div class="health-sub">' +
          h.sub +
          "</div></div>"
        );
      })
      .join("");
  }
  renderHealthGrid();

  /* Animate health values */
  setInterval(function () {
    healthData.forEach(function (h) {
      h.value = Math.max(
        5,
        Math.min(98, h.value + Math.floor((Math.random() - 0.48) * 6))
      );
    });
    renderHealthGrid();
  }, 4000);

  /* ────────────────────────────────────────────────
     8. AI Agents Orchestration
     ──────────────────────────────────────────────── */
  var agentsData = [
    {
      name: "DeployBot",
      type: "Infrastructure Agent",
      icon: "\u{1F916}",
      bg: "rgba(0,229,160,.1)",
      status: "running",
      tasks: 1247,
      uptime: "99.98%",
      latency: "8ms",
      model: "GPT-4o",
      desc: "Automates node deployment, scaling, and infrastructure provisioning across 42 global regions.",
    },
    {
      name: "Sentinel",
      type: "Security Agent",
      icon: "\u{1F6E1}\uFE0F",
      bg: "rgba(108,92,231,.1)",
      status: "running",
      tasks: 892,
      uptime: "99.99%",
      latency: "3ms",
      model: "Claude 3.5",
      desc: "Monitors network threats, validates transactions, and enforces security policies in real-time.",
    },
    {
      name: "Optimizer",
      type: "Performance Agent",
      icon: "\u26A1",
      bg: "rgba(0,180,216,.1)",
      status: "running",
      tasks: 3456,
      uptime: "99.95%",
      latency: "12ms",
      model: "Gemini Pro",
      desc: "Optimizes resource allocation, load balancing, and cost efficiency across compute clusters.",
    },
    {
      name: "PriceOracle",
      type: "DeFi Agent",
      icon: "\u{1F4C8}",
      bg: "rgba(255,184,77,.1)",
      status: "running",
      tasks: 5621,
      uptime: "99.97%",
      latency: "5ms",
      model: "GPT-4o",
      desc: "Feeds real-time price data, manages staking yields, and automates token burn mechanics.",
    },
    {
      name: "DataWeaver",
      type: "Analytics Agent",
      icon: "\u{1F9E0}",
      bg: "rgba(0,229,160,.1)",
      status: "idle",
      tasks: 412,
      uptime: "98.42%",
      latency: "45ms",
      model: "Llama 3.1",
      desc: "Aggregates network telemetry, generates analytics dashboards, and predicts capacity needs.",
    },
    {
      name: "Concierge",
      type: "CreateOS Agent",
      icon: "\u{1F3AF}",
      bg: "rgba(108,92,231,.1)",
      status: "running",
      tasks: 2187,
      uptime: "99.91%",
      latency: "15ms",
      model: "Claude 3.5",
      desc: "Assists workspace creation, template selection, and automated deployment workflows on CreateOS.",
    },
  ];

  function renderAgents() {
    var grid = document.getElementById("agentGrid");
    grid.innerHTML = agentsData
      .map(function (a) {
        return (
          '<div class="agent-card">' +
          '<div class="agent-header">' +
          '<div class="agent-avatar" style="background:' +
          a.bg +
          '">' +
          a.icon +
          "</div>" +
          "<div>" +
          '<div class="agent-name">' +
          a.name +
          "</div>" +
          '<div class="agent-type">' +
          a.type +
          "</div></div></div>" +
          '<div class="agent-status ' +
          a.status +
          '"><span class="dot"></span> ' +
          (a.status === "running" ? "Running" : "Idle") +
          " &middot; " +
          a.model +
          "</div>" +
          '<div style="font-size:.8rem;color:var(--t2);margin-bottom:.75rem;line-height:1.5">' +
          a.desc +
          "</div>" +
          '<div class="agent-metric"><span class="agent-ml">Tasks Completed</span><span class="agent-mv">' +
          a.tasks.toLocaleString() +
          "</span></div>" +
          '<div class="agent-metric"><span class="agent-ml">Uptime</span><span class="agent-mv">' +
          a.uptime +
          "</span></div>" +
          '<div class="agent-metric"><span class="agent-ml">Avg Latency</span><span class="agent-mv">' +
          a.latency +
          "</span></div>" +
          '<button class="btn-agent">' +
          (a.status === "running" ? "View Logs" : "Activate") +
          "</button></div>"
        );
      })
      .join("");
  }
  renderAgents();

  /* Animate agent task counts */
  setInterval(function () {
    agentsData.forEach(function (a) {
      if (a.status === "running") {
        a.tasks += Math.floor(Math.random() * 5) + 1;
      }
    });
    renderAgents();
  }, 6000);

  /* ────────────────────────────────────────────────
     9. CreateOS Workspace Manager
     ──────────────────────────────────────────────── */
  var workspaces = [
    {
      name: "DeFi Dashboard Pro",
      desc: "Real-time portfolio tracker with cross-chain analytics and yield optimization.",
      icon: "\u{1F4CA}",
      status: "live",
      framework: "React + Vite",
      deploys: 47,
      visitors: "12.4K",
      updated: "2m ago",
    },
    {
      name: "NFT Marketplace",
      desc: "Decentralized NFT marketplace with multi-chain support and instant settlements.",
      icon: "\u{1F3A8}",
      status: "live",
      framework: "Next.js",
      deploys: 32,
      visitors: "8.7K",
      updated: "15m ago",
    },
    {
      name: "DAO Governance",
      desc: "On-chain governance platform with proposal creation, voting, and treasury management.",
      icon: "\u{1F3DB}\uFE0F",
      status: "building",
      framework: "SvelteKit",
      deploys: 12,
      visitors: "2.1K",
      updated: "1h ago",
    },
    {
      name: "AI Agent Hub",
      desc: "Orchestration dashboard for deploying and managing autonomous AI agents across the network.",
      icon: "\u{1F916}",
      status: "live",
      framework: "Static HTML",
      deploys: 89,
      visitors: "24.8K",
      updated: "5m ago",
    },
    {
      name: "Validator Monitor",
      desc: "Real-time validator performance tracking with alerts and automated failover.",
      icon: "\u{1F6E1}\uFE0F",
      status: "live",
      framework: "Vue 3",
      deploys: 56,
      visitors: "6.3K",
      updated: "8m ago",
    },
    {
      name: "Token Launch Pad",
      desc: "Fair launch platform with bonding curves, liquidity bootstrapping, and vesting schedules.",
      icon: "\u{1F680}",
      status: "building",
      framework: "React + Vite",
      deploys: 8,
      visitors: "1.2K",
      updated: "3h ago",
    },
  ];

  function renderWorkspaces() {
    var grid = document.getElementById("wsGrid");
    grid.innerHTML = workspaces
      .map(function (w) {
        var statusClass = w.status === "live" ? "g" : "o";
        var statusText = w.status === "live" ? "Live" : "Building";
        return (
          '<div class="ws-card">' +
          '<div class="ws-preview">' +
          '<span class="ws-preview-icon">' +
          w.icon +
          "</span>" +
          '<div class="ws-preview-tag"><span class="tag ' +
          statusClass +
          '">' +
          statusText +
          "</span></div></div>" +
          '<div class="ws-info">' +
          '<div class="ws-title">' +
          w.name +
          "</div>" +
          '<div class="ws-desc">' +
          w.desc +
          "</div>" +
          '<div class="ws-meta"><span>' +
          w.framework +
          "</span><span>" +
          w.deploys +
          " deploys</span><span>" +
          w.visitors +
          " views</span><span>" +
          w.updated +
          "</span></div></div>" +
          '<div class="ws-actions">' +
          '<button class="btn-ws primary">Open</button>' +
          '<button class="btn-ws secondary">Settings</button></div></div>'
        );
      })
      .join("");
  }
  renderWorkspaces();

  /* ────────────────────────────────────────────────
     10. Active Nodes Table
     ──────────────────────────────────────────────── */
  var nodesData = [
    { name: "ETH-Validator-01", type: "Validator", network: "Ethereum", region: "US East", uptime: 99.99, latency: "12ms", earnings: "$842.50", status: "online" },
    { name: "SOL-RPC-Primary", type: "RPC", network: "Solana", region: "EU West", uptime: 99.97, latency: "8ms", earnings: "$1,247.80", status: "online" },
    { name: "MATIC-Full-03", type: "Full Node", network: "Polygon", region: "Asia Pacific", uptime: 99.94, latency: "24ms", earnings: "$423.15", status: "online" },
    { name: "ARB-Archive-01", type: "Archive", network: "Arbitrum", region: "US West", uptime: 99.88, latency: "18ms", earnings: "$687.40", status: "online" },
    { name: "AVAX-Validator-02", type: "Validator", network: "Avalanche", region: "EU North", uptime: 98.21, latency: "32ms", earnings: "$512.90", status: "syncing" },
    { name: "NEAR-RPC-02", type: "RPC", network: "Near", region: "US East", uptime: 99.96, latency: "15ms", earnings: "$356.20", status: "online" },
    { name: "COSMOS-Val-01", type: "Validator", network: "Cosmos", region: "Asia Pacific", uptime: 99.91, latency: "28ms", earnings: "$924.60", status: "online" },
    { name: "APT-Full-01", type: "Full Node", network: "Aptos", region: "EU West", uptime: 0, latency: "\u2014", earnings: "$0.00", status: "offline" },
    { name: "ETH-RPC-Backup", type: "RPC", network: "Ethereum", region: "US West", uptime: 99.95, latency: "11ms", earnings: "$1,102.30", status: "online" },
    { name: "SOL-Validator-03", type: "Validator", network: "Solana", region: "EU North", uptime: 97.84, latency: "42ms", earnings: "$278.50", status: "syncing" },
  ];

  var typeColors = {
    Validator: "g",
    RPC: "p",
    "Full Node": "bl",
    Archive: "o",
    "Light Node": "bl",
  };

  function renderNodes(filter) {
    var body = document.getElementById("nodesBody");
    var f = (filter || "").toLowerCase();
    var filtered = nodesData.filter(function (n) {
      return (
        !f ||
        n.name.toLowerCase().includes(f) ||
        n.network.toLowerCase().includes(f) ||
        n.type.toLowerCase().includes(f)
      );
    });
    body.innerHTML = filtered
      .map(function (n) {
        var uptimeColor =
          n.uptime > 99.9
            ? "var(--acc)"
            : n.uptime > 99
            ? "var(--warn)"
            : n.uptime > 0
            ? "var(--red)"
            : "var(--t3)";
        var uptimeWidth = Math.min(n.uptime, 100);
        var indClass =
          n.status === "online"
            ? "on"
            : n.status === "syncing"
            ? "sync"
            : "off";
        var tagClass =
          n.status === "online" ? "g" : n.status === "syncing" ? "o" : "r";
        return (
          "<tr>" +
          '<td><div class="nd-name"><span class="ind ' +
          indClass +
          '"></span>' +
          n.name +
          "</div></td>" +
          '<td><span class="tag ' +
          typeColors[n.type] +
          '">' +
          n.type +
          "</span></td>" +
          "<td>" +
          n.network +
          "</td>" +
          "<td>" +
          n.region +
          "</td>" +
          '<td><div class="ubar"><div class="ubar-fill" style="width:' +
          uptimeWidth +
          "%;background:" +
          uptimeColor +
          '"></div></div><span class="mono">' +
          n.uptime +
          "%</span></td>" +
          '<td class="mono">' +
          n.latency +
          "</td>" +
          '<td class="mono" style="color:var(--acc)">' +
          n.earnings +
          "</td>" +
          '<td><span class="tag ' +
          tagClass +
          '">' +
          n.status +
          "</span></td></tr>"
        );
      })
      .join("");
  }
  renderNodes();
  document.getElementById("nodeSearch").addEventListener("input", function () {
    renderNodes(this.value);
  });

  /* ────────────────────────────────────────────────
     11. Compute Marketplace
     ──────────────────────────────────────────────── */
  var mpData = [
    { provider: "AlphaNode", rating: 4.9, cores: 96, gpu: "A100 80GB", ram: "512 GB", storage: "4 TB NVMe", region: "US East", price: 2.84, avatar: "#00E5A0" },
    { provider: "CryptoForge", rating: 4.8, cores: 56, gpu: "H100 80GB", ram: "256 GB", storage: "2 TB NVMe", region: "EU West", price: 3.12, avatar: "#6C5CE7" },
    { provider: "NodeVault", rating: 4.7, cores: 32, gpu: "RTX 4090", ram: "128 GB", storage: "1 TB NVMe", region: "Asia Pacific", price: 1.56, avatar: "#00B4D8" },
    { provider: "SkyCompute", rating: 4.9, cores: 64, gpu: "L40S 48GB", ram: "384 GB", storage: "2 TB NVMe", region: "US West", price: 2.28, avatar: "#FFB84D" },
    { provider: "TerraNodes", rating: 4.6, cores: 60, gpu: "A100 40GB", ram: "256 GB", storage: "2 TB NVMe", region: "EU North", price: 1.92, avatar: "#FF4D6A" },
    { provider: "QuantumMesh", rating: 4.8, cores: 128, gpu: "H100 SXM", ram: "1 TB", storage: "8 TB NVMe", region: "US East", price: 5.48, avatar: "#00E5A0" },
  ];

  function renderMarketplace() {
    var grid = document.getElementById("mpGrid");
    grid.innerHTML = mpData
      .map(function (m) {
        return (
          '<div class="mp-card"><div class="mp-top"><div class="mp-prov">' +
          '<div class="mp-ava" style="background:' +
          m.avatar +
          "22;color:" +
          m.avatar +
          '">' +
          m.provider[0] +
          "</div>" +
          '<div><div class="mp-pn">' +
          m.provider +
          '</div><div class="mp-pr">\u2605 ' +
          m.rating +
          " \xb7 " +
          m.region +
          "</div></div></div>" +
          '<div class="mp-specs">' +
          '<div class="mp-spec"><div class="mp-sl">CPU</div><div class="mp-sv">' +
          m.cores +
          " cores</div></div>" +
          '<div class="mp-spec"><div class="mp-sl">GPU</div><div class="mp-sv">' +
          m.gpu +
          "</div></div>" +
          '<div class="mp-spec"><div class="mp-sl">RAM</div><div class="mp-sv">' +
          m.ram +
          "</div></div>" +
          '<div class="mp-spec"><div class="mp-sl">Storage</div><div class="mp-sv">' +
          m.storage +
          "</div></div></div></div>" +
          '<div class="mp-bot"><div class="mp-price">$' +
          m.price.toFixed(2) +
          '<span class="mp-pu"> /hr</span></div>' +
          '<button class="btn-rent">Rent Now</button></div></div>'
        );
      })
      .join("");
  }
  renderMarketplace();

  /* ────────────────────────────────────────────────
     12. Activity Feed
     ──────────────────────────────────────────────── */
  var feedTemplates = [
    { icon: "\u{1F7E2}", iconBg: "rgba(0,229,160,.1)", text: "<strong>ETH-Validator-01</strong> proposed block #19,847,231" },
    { icon: "\u{1F680}", iconBg: "rgba(0,180,216,.1)", text: "<strong>CryptoForge</strong> deployed a new Solana RPC node in EU West" },
    { icon: "\u{1F4B0}", iconBg: "rgba(255,184,77,.1)", text: "<strong>284.5K $NODE</strong> staked in Silver tier by 0x7a3F...e9B2" },
    { icon: "\u{1F525}", iconBg: "rgba(255,77,106,.1)", text: "<strong>12,450 $NODE</strong> burned from deployment fees" },
    { icon: "\u26A1", iconBg: "rgba(108,92,231,.1)", text: "<strong>AlphaNode</strong> GPU cluster reached 99.99% uptime milestone" },
    { icon: "\u{1F310}", iconBg: "rgba(0,229,160,.1)", text: "New compute provider <strong>QuantumMesh</strong> joined from Singapore" },
    { icon: "\u{1F4E6}", iconBg: "rgba(0,180,216,.1)", text: "<strong>3 new nodes</strong> deployed on Polygon network" },
    { icon: "\u{1F48E}", iconBg: "rgba(108,92,231,.1)", text: "<strong>$42,800</strong> in rewards distributed to Gold stakers" },
    { icon: "\u{1F6E1}\uFE0F", iconBg: "rgba(0,229,160,.1)", text: "Security audit completed for <strong>NodeVault</strong> provider" },
    { icon: "\u{1F504}", iconBg: "rgba(255,184,77,.1)", text: "<strong>AVAX-Validator-02</strong> finished sync \u2014 now producing blocks" },
    { icon: "\u{1F4C8}", iconBg: "rgba(0,229,160,.1)", text: "Network throughput reached <strong>1.2M transactions</strong> in 24h" },
    { icon: "\u{1F91D}", iconBg: "rgba(108,92,231,.1)", text: "<strong>TerraNodes</strong> upgraded to verified provider status" },
    { icon: "\u{1F916}", iconBg: "rgba(0,180,216,.1)", text: "AI Agent <strong>DeployBot</strong> auto-scaled 14 nodes during traffic spike" },
    { icon: "\u{1F3AF}", iconBg: "rgba(108,92,231,.1)", text: "<strong>Concierge</strong> agent deployed 3 CreateOS workspaces in under 60s" },
  ];

  function timeAgo(seconds) {
    if (seconds < 60) return seconds + "s ago";
    if (seconds < 3600) return Math.floor(seconds / 60) + "m ago";
    return Math.floor(seconds / 3600) + "h ago";
  }

  function renderFeed() {
    var feed = document.getElementById("activityFeed");
    var items = [];
    for (var i = 0; i < 12; i++) {
      var tpl = feedTemplates[i % feedTemplates.length];
      var ago = i * 47 + Math.floor(Math.random() * 30) + 5;
      items.push(
        '<div class="feed-item"><div class="feed-icon" style="background:' +
          tpl.iconBg +
          '">' +
          tpl.icon +
          '</div><div class="feed-text">' +
          tpl.text +
          '</div><div class="feed-time">' +
          timeAgo(ago) +
          "</div></div>"
      );
    }
    feed.innerHTML = items.join("");
  }
  renderFeed();

  setInterval(function () {
    var feed = document.getElementById("activityFeed");
    var tpl = feedTemplates[Math.floor(Math.random() * feedTemplates.length)];
    var item = document.createElement("div");
    item.className = "feed-item";
    item.style.opacity = "0";
    item.style.transform = "translateY(-10px)";
    item.innerHTML =
      '<div class="feed-icon" style="background:' +
      tpl.iconBg +
      '">' +
      tpl.icon +
      '</div><div class="feed-text">' +
      tpl.text +
      '</div><div class="feed-time">just now</div>';
    feed.insertBefore(item, feed.firstChild);
    requestAnimationFrame(function () {
      item.style.transition = "all .4s ease";
      item.style.opacity = "1";
      item.style.transform = "translateY(0)";
    });
    if (feed.children.length > 15) feed.removeChild(feed.lastChild);
  }, 5000);

  /* ────────────────────────────────────────────────
     13. Interactive Terminal
     ──────────────────────────────────────────────── */
  var termBody = document.getElementById("termBody");
  var termInput = document.getElementById("termInput");

  function termPrint(html) {
    var line = document.createElement("div");
    line.className = "term-line";
    line.innerHTML = html;
    termBody.appendChild(line);
    termBody.scrollTop = termBody.scrollHeight;
  }

  function termPrintDelayed(lines, delay) {
    var i = 0;
    function next() {
      if (i < lines.length) {
        termPrint(lines[i]);
        i++;
        setTimeout(next, delay);
      }
    }
    next();
  }

  /* Boot sequence */
  var bootLines = [
    '<span class="info">NodeOps CLI v3.2.1 — Mainnet</span>',
    '<span class="out">Connecting to decentralized compute layer...</span>',
    '<span class="success">Connected to 847 nodes across 42 regions</span>',
    '<span class="out">Authenticating wallet: 0x7a3F...e9B2</span>',
    '<span class="success">Session authenticated. Network status: HEALTHY</span>',
    '<span class="out">Loading AI agent orchestration layer...</span>',
    '<span class="success">6 AI agents online and operational</span>',
    "",
    '<span class="info">Type "help" for available commands</span>',
    "",
  ];
  termPrintDelayed(bootLines, 180);

  var termCommands = {
    help: function () {
      return [
        '<span class="info">Available commands:</span>',
        '<span class="out">  status     — Network status overview</span>',
        '<span class="out">  nodes      — List active nodes</span>',
        '<span class="out">  deploy     — Deploy a new node</span>',
        '<span class="out">  agents     — List AI agents</span>',
        '<span class="out">  stake      — View staking info</span>',
        '<span class="out">  price      — Current $NODE price</span>',
        '<span class="out">  workspaces — List CreateOS workspaces</span>',
        '<span class="out">  health     — System health check</span>',
        '<span class="out">  burn       — Token burn stats</span>',
        '<span class="out">  clear      — Clear terminal</span>',
        "",
      ];
    },
    status: function () {
      return [
        '<span class="info">\u2501\u2501\u2501 Network Status \u2501\u2501\u2501</span>',
        '<span class="success"> \u25CF  All Systems Operational</span>',
        '<span class="out"> Active Nodes:    12,847</span>',
        '<span class="out"> Compute Power:   48.6 PetaFLOPS</span>',
        '<span class="out"> $NODE Staked:    284.5M</span>',
        '<span class="out"> Monthly Revenue: $3.24M</span>',
        '<span class="out"> Providers:       1,892</span>',
        '<span class="out"> Avg Uptime:      99.97%</span>',
        '<span class="out"> AI Agents:       6 active</span>',
        "",
      ];
    },
    nodes: function () {
      var lines = ['<span class="info">\u2501\u2501\u2501 Active Nodes (top 5) \u2501\u2501\u2501</span>'];
      nodesData.slice(0, 5).forEach(function (n) {
        var color =
          n.status === "online"
            ? "success"
            : n.status === "syncing"
            ? "warn"
            : "err";
        lines.push(
          '<span class="' +
            color +
            '"> \u25CF ' +
            n.name.padEnd(20) +
            "</span>" +
            '<span class="out">  ' +
            n.network.padEnd(12) +
            n.region.padEnd(16) +
            n.uptime +
            "%</span>"
        );
      });
      lines.push("");
      lines.push(
        '<span class="out"> Showing 5 of ' +
          nodesData.length +
          " nodes</span>"
      );
      lines.push("");
      return lines;
    },
    deploy: function () {
      return [
        '<span class="info">Initiating deployment sequence...</span>',
        '<span class="out">\u25B6 Selecting optimal provider: AlphaNode (US East)</span>',
        '<span class="out">\u25B6 Provisioning resources: 8 CPU, 16GB RAM, 500GB SSD</span>',
        '<span class="out">\u25B6 Installing Ethereum Validator client...</span>',
        '<span class="out">\u25B6 Configuring network parameters...</span>',
        '<span class="out">\u25B6 Running security checks...</span>',
        '<span class="success">\u2714 Node ETH-Validator-12 deployed successfully!</span>',
        '<span class="out">  Endpoint: https://eth-val-12.nodeops.network</span>',
        '<span class="out">  Est. monthly cost: $124.50</span>',
        '<span class="out">  Est. monthly earnings: $842.50</span>',
        "",
      ];
    },
    agents: function () {
      var lines = ['<span class="info">\u2501\u2501\u2501 AI Agents \u2501\u2501\u2501</span>'];
      agentsData.forEach(function (a) {
        var color = a.status === "running" ? "success" : "warn";
        lines.push(
          '<span class="' +
            color +
            '"> \u25CF ' +
            a.name.padEnd(16) +
            "</span>" +
            '<span class="out">  ' +
            a.type.padEnd(22) +
            a.model.padEnd(14) +
            a.tasks +
            " tasks</span>"
        );
      });
      lines.push("");
      return lines;
    },
    stake: function () {
      return [
        '<span class="info">\u2501\u2501\u2501 Staking Overview \u2501\u2501\u2501</span>',
        '<span class="out"> Bronze:  8.2% APY   | 1,000 NODE min  | 30-day lock</span>',
        '<span class="out"> Silver: 14.5% APY   | 10,000 NODE min | 90-day lock</span>',
        '<span class="out"> Gold:   22.8% APY   | 100,000 NODE min| 180-day lock</span>',
        "",
        '<span class="out"> Total Staked: 284.5M NODE (28.4% of supply)</span>',
        '<span class="out"> Active Stakers: 13,559</span>',
        "",
      ];
    },
    price: function () {
      var p = (0.4872 + (Math.random() - 0.48) * 0.015).toFixed(4);
      return [
        '<span class="info">\u2501\u2501\u2501 $NODE Token \u2501\u2501\u2501</span>',
        '<span class="success"> Price:      $' + p + "</span>",
        '<span class="out"> 24h Change: +8.42%</span>',
        '<span class="out"> Market Cap: $487.2M</span>',
        '<span class="out"> FDV:        $1.24B</span>',
        '<span class="out"> 24h Volume: $12.4M</span>',
        "",
      ];
    },
    workspaces: function () {
      var lines = ['<span class="info">\u2501\u2501\u2501 CreateOS Workspaces \u2501\u2501\u2501</span>'];
      workspaces.forEach(function (w) {
        var color = w.status === "live" ? "success" : "warn";
        lines.push(
          '<span class="' +
            color +
            '"> \u25CF ' +
            w.name.padEnd(24) +
            "</span>" +
            '<span class="out">  ' +
            w.framework.padEnd(16) +
            w.visitors +
            " views</span>"
        );
      });
      lines.push("");
      return lines;
    },
    health: function () {
      var lines = ['<span class="info">\u2501\u2501\u2501 System Health \u2501\u2501\u2501</span>'];
      healthData.forEach(function (h) {
        var bar = "";
        var filled = Math.round(h.value / 5);
        for (var i = 0; i < 20; i++) {
          bar += i < filled ? "\u2588" : "\u2591";
        }
        var color =
          h.value > 85 ? "err" : h.value > 70 ? "warn" : "success";
        lines.push(
          '<span class="out"> ' +
            h.name.padEnd(18) +
            "</span>" +
            '<span class="' +
            color +
            '">' +
            bar +
            " " +
            h.value +
            "%</span>"
        );
      });
      lines.push("");
      return lines;
    },
    burn: function () {
      return [
        '<span class="info">\u2501\u2501\u2501 Token Burn Stats \u2501\u2501\u2501</span>',
        '<span class="out"> Total Burned:    847,000 NODE</span>',
        '<span class="out"> Deploy Burn:     2.1% per deployment</span>',
        '<span class="out"> Transaction Burn:1.5% per transaction</span>',
        '<span class="out"> Stake Burn:      0.8% on unstake</span>',
        '<span class="out"> 24h Burned:      12,450 NODE</span>',
        '<span class="out"> Deflationary:    Yes (decreasing supply)</span>',
        "",
      ];
    },
    clear: function () {
      termBody.innerHTML = "";
      return [];
    },
  };

  termInput.addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
      var cmd = termInput.value.trim().toLowerCase();
      termInput.value = "";
      if (!cmd) return;

      termPrint(
        '<span class="prompt">nodeops@mainnet:~$ </span><span class="cmd">' +
          cmd +
          "</span>"
      );

      if (termCommands[cmd]) {
        var lines = termCommands[cmd]();
        if (cmd === "deploy") {
          termPrintDelayed(lines, 350);
        } else {
          lines.forEach(function (l) {
            termPrint(l);
          });
        }
      } else {
        termPrint(
          '<span class="err">Command not found: ' +
            cmd +
            '. Type "help" for available commands.</span>'
        );
        termPrint("");
      }
    }
  });

  /* ────────────────────────────────────────────────
     14. Animated Counters
     ──────────────────────────────────────────────── */
  function animateCounter(el, target, prefix, suffix, duration) {
    var startTime = performance.now();
    function step(now) {
      var progress = Math.min((now - startTime) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      var current = target * eased;
      if (target >= 1000000) {
        el.textContent = prefix + (current / 1000000).toFixed(1) + "M" + suffix;
      } else if (target >= 1000) {
        el.textContent =
          prefix +
          (current / 1000).toFixed(target >= 10000 ? 0 : 1) +
          "K" +
          suffix;
      } else {
        el.textContent = prefix + current.toFixed(target < 100 ? 2 : 0) + suffix;
      }
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  var counterObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting && !e.target.dataset.counted) {
          e.target.dataset.counted = "true";
          animateCounter(
            document.getElementById("totalNodes"),
            12847,
            "",
            "",
            2000
          );
          animateCounter(
            document.getElementById("totalStaked"),
            284500000,
            "",
            "",
            2000
          );
          animateCounter(
            document.getElementById("totalProviders"),
            1892,
            "",
            "",
            2000
          );
        }
      });
    },
    { threshold: 0.3 }
  );
  var statsBar = document.querySelector(".stats-bar");
  if (statsBar) counterObserver.observe(statsBar);

  /* ────────────────────────────────────────────────
     15. Token Price Ticker
     ──────────────────────────────────────────────── */
  setInterval(function () {
    var price = document.getElementById("tokenPrice");
    var base = 0.4872;
    var variation = (Math.random() - 0.48) * 0.015;
    var newPrice = base + variation;
    price.textContent = "$" + newPrice.toFixed(4);
    price.style.color = variation >= 0 ? "var(--acc)" : "var(--red)";
  }, 3000);

  /* ────────────────────────────────────────────────
     16. Charts (Canvas-based)
     ──────────────────────────────────────────────── */
  function drawSparkline(canvasId, data, color, fill) {
    var c = document.getElementById(canvasId);
    if (!c) return;
    var parent = c.parentElement;
    var w = parent.offsetWidth;
    var h = parent.offsetHeight;
    if (w === 0 || h === 0) return;
    c.width = w * 2;
    c.height = h * 2;
    c.style.width = w + "px";
    c.style.height = h + "px";
    var cx = c.getContext("2d");
    cx.scale(2, 2);

    var max = Math.max.apply(null, data);
    var min = Math.min.apply(null, data);
    var range = max - min || 1;
    var stepX = w / (data.length - 1);
    var padding = 4;

    cx.beginPath();
    data.forEach(function (val, i) {
      var x = i * stepX;
      var y = padding + ((max - val) / range) * (h - padding * 2);
      if (i === 0) cx.moveTo(x, y);
      else {
        var prevX = (i - 1) * stepX;
        var prevY = padding + ((max - data[i - 1]) / range) * (h - padding * 2);
        var cpX = (prevX + x) / 2;
        cx.bezierCurveTo(cpX, prevY, cpX, y, x, y);
      }
    });
    cx.strokeStyle = color;
    cx.lineWidth = 2;
    cx.stroke();

    if (fill) {
      cx.lineTo(w, h);
      cx.lineTo(0, h);
      cx.closePath();
      var grad = cx.createLinearGradient(0, 0, 0, h);
      grad.addColorStop(0, color + "33");
      grad.addColorStop(1, color + "00");
      cx.fillStyle = grad;
      cx.fill();
    }
  }

  function generateData(points, base, variance) {
    var data = [];
    var val = base;
    for (var i = 0; i < points; i++) {
      val += (Math.random() - 0.45) * variance;
      val = Math.max(base - variance * 3, Math.min(base + variance * 3, val));
      data.push(val);
    }
    return data;
  }

  function drawRevenueChart() {
    var c = document.getElementById("chartRevenue");
    if (!c) return;
    var parent = c.parentElement;
    var w = parent.offsetWidth;
    var h = parent.offsetHeight;
    if (w === 0 || h === 0) return;
    c.width = w * 2;
    c.height = h * 2;
    c.style.width = w + "px";
    c.style.height = h + "px";
    var cx = c.getContext("2d");
    cx.scale(2, 2);

    var months = ["Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar", "Apr", "May", "Jun"];
    var compute = [1.2, 1.4, 1.5, 1.8, 2.1, 2.3, 2.5, 2.7, 2.8, 3.0, 3.1, 3.24];
    var nodes = [0.8, 0.9, 1.0, 1.1, 1.2, 1.4, 1.5, 1.6, 1.7, 1.8, 1.9, 2.1];
    var staking = [0.3, 0.4, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 0.9, 1.0, 1.1, 1.2];

    var maxVal = 4;
    var chartL = 50;
    var chartR = w - 20;
    var chartT = 20;
    var chartB = h - 40;
    var chartW = chartR - chartL;
    var chartH = chartB - chartT;

    cx.strokeStyle = "#1C1C28";
    cx.lineWidth = 1;
    for (var i = 0; i <= 4; i++) {
      var y = chartT + (i / 4) * chartH;
      cx.beginPath();
      cx.moveTo(chartL, y);
      cx.lineTo(chartR, y);
      cx.stroke();
      cx.fillStyle = "#55556A";
      cx.font = "11px 'JetBrains Mono'";
      cx.textAlign = "right";
      cx.fillText("$" + (maxVal - (i / 4) * maxVal).toFixed(1) + "M", chartL - 8, y + 4);
    }

    cx.textAlign = "center";
    months.forEach(function (m, i) {
      var x = chartL + (i / (months.length - 1)) * chartW;
      cx.fillStyle = "#55556A";
      cx.font = "10px 'JetBrains Mono'";
      cx.fillText(m, x, chartB + 20);
    });

    function drawArea(data, color) {
      cx.beginPath();
      data.forEach(function (val, i) {
        var x = chartL + (i / (data.length - 1)) * chartW;
        var y2 = chartB - (val / maxVal) * chartH;
        if (i === 0) cx.moveTo(x, y2);
        else {
          var prevX = chartL + ((i - 1) / (data.length - 1)) * chartW;
          var prevY = chartB - (data[i - 1] / maxVal) * chartH;
          var cpX = (prevX + x) / 2;
          cx.bezierCurveTo(cpX, prevY, cpX, y2, x, y2);
        }
      });
      cx.strokeStyle = color;
      cx.lineWidth = 2.5;
      cx.stroke();
      cx.lineTo(chartR, chartB);
      cx.lineTo(chartL, chartB);
      cx.closePath();
      var grad = cx.createLinearGradient(0, chartT, 0, chartB);
      grad.addColorStop(0, color + "22");
      grad.addColorStop(1, color + "00");
      cx.fillStyle = grad;
      cx.fill();
    }

    drawArea(compute, "#00E5A0");
    drawArea(nodes, "#6C5CE7");
    drawArea(staking, "#00B4D8");

    var legends = [
      { label: "Compute", color: "#00E5A0" },
      { label: "Nodes", color: "#6C5CE7" },
      { label: "Staking", color: "#00B4D8" },
    ];
    var lx = chartR - 200;
    legends.forEach(function (l) {
      cx.fillStyle = l.color;
      cx.fillRect(lx, 4, 10, 10);
      cx.fillStyle = "#8888A0";
      cx.font = "11px 'Space Grotesk'";
      cx.textAlign = "left";
      cx.fillText(l.label, lx + 14, 13);
      lx += 70;
    });
  }

  function drawDistributionChart() {
    var c = document.getElementById("chartDistribution");
    if (!c) return;
    var parent = c.parentElement;
    var w = parent.offsetWidth;
    var h = parent.offsetHeight;
    if (w === 0 || h === 0) return;
    c.width = w * 2;
    c.height = h * 2;
    c.style.width = w + "px";
    c.style.height = h + "px";
    var cx = c.getContext("2d");
    cx.scale(2, 2);

    var segments = [
      { label: "Staked", pct: 28.4, color: "#00E5A0" },
      { label: "Circulating", pct: 35.2, color: "#6C5CE7" },
      { label: "Treasury", pct: 15.0, color: "#00B4D8" },
      { label: "Team", pct: 12.0, color: "#FFB84D" },
      { label: "Burned", pct: 9.4, color: "#FF4D6A" },
    ];

    var centerX = w * 0.35;
    var centerY = h * 0.5;
    var outerR = Math.min(w * 0.3, h * 0.42);
    var innerR = outerR * 0.62;

    var startAngle = -Math.PI / 2;
    segments.forEach(function (seg) {
      var sweepAngle = (seg.pct / 100) * Math.PI * 2;
      cx.beginPath();
      cx.arc(centerX, centerY, outerR, startAngle, startAngle + sweepAngle);
      cx.arc(centerX, centerY, innerR, startAngle + sweepAngle, startAngle, true);
      cx.closePath();
      cx.fillStyle = seg.color;
      cx.fill();
      startAngle += sweepAngle;
    });

    cx.fillStyle = "#E8E8ED";
    cx.font = "bold 16px 'JetBrains Mono'";
    cx.textAlign = "center";
    cx.fillText("1B", centerX, centerY - 2);
    cx.fillStyle = "#55556A";
    cx.font = "10px 'Space Grotesk'";
    cx.fillText("Total Supply", centerX, centerY + 14);

    var ly = 20;
    segments.forEach(function (seg) {
      var lx2 = w * 0.72;
      cx.fillStyle = seg.color;
      cx.fillRect(lx2, ly, 10, 10);
      cx.fillStyle = "#E8E8ED";
      cx.font = "12px 'Space Grotesk'";
      cx.textAlign = "left";
      cx.fillText(seg.label, lx2 + 16, ly + 9);
      cx.fillStyle = "#8888A0";
      cx.font = "11px 'JetBrains Mono'";
      cx.fillText(seg.pct + "%", lx2 + 100, ly + 9);
      ly += 26;
    });
  }

  function drawAllCharts() {
    drawSparkline("chartTx", generateData(30, 50000, 3000), "#00E5A0", true);
    drawSparkline("chartBurn", generateData(30, 28000, 2000), "#6C5CE7", true);
    drawSparkline("chartDeploy", generateData(30, 120, 15), "#00B4D8", true);
    drawSparkline("chartRewards", generateData(30, 89400, 5000), "#FFB84D", true);
    drawSparkline("chartPrice", generateData(60, 0.48, 0.02), "#00E5A0", true);
    drawRevenueChart();
    drawDistributionChart();
  }

  /* ────────────────────────────────────────────────
     17. World Map (Animated)
     ──────────────────────────────────────────────── */
  function drawWorldMap() {
    var c = document.getElementById("worldMap");
    if (!c) return;
    var parent = c.parentElement;
    var w = parent.offsetWidth;
    var h = parent.offsetHeight;
    if (w === 0 || h === 0) return;
    c.width = w * 2;
    c.height = h * 2;
    c.style.width = w + "px";
    c.style.height = h + "px";
    var cx = c.getContext("2d");
    cx.scale(2, 2);

    var dotSize = 1.5;
    var gap = 8;
    var continents = [
      { x: 0.1, y: 0.15, w: 0.2, h: 0.25, density: 0.6 },
      { x: 0.18, y: 0.45, w: 0.12, h: 0.3, density: 0.55 },
      { x: 0.42, y: 0.12, w: 0.15, h: 0.18, density: 0.7 },
      { x: 0.42, y: 0.32, w: 0.15, h: 0.32, density: 0.5 },
      { x: 0.55, y: 0.1, w: 0.3, h: 0.3, density: 0.6 },
      { x: 0.75, y: 0.55, w: 0.12, h: 0.12, density: 0.45 },
    ];

    var nodeLocations = [
      { x: 0.2, y: 0.28, color: "#00E5A0", count: 3200, type: "Validator" },
      { x: 0.1, y: 0.26, color: "#6C5CE7", count: 1800, type: "RPC" },
      { x: 0.25, y: 0.55, color: "#00B4D8", count: 420, type: "Compute" },
      { x: 0.43, y: 0.17, color: "#00E5A0", count: 1200, type: "Validator" },
      { x: 0.47, y: 0.18, color: "#6C5CE7", count: 2100, type: "RPC" },
      { x: 0.5, y: 0.13, color: "#FFB84D", count: 680, type: "Storage" },
      { x: 0.56, y: 0.3, color: "#00E5A0", count: 540, type: "Validator" },
      { x: 0.63, y: 0.32, color: "#00B4D8", count: 890, type: "Compute" },
      { x: 0.72, y: 0.42, color: "#6C5CE7", count: 1100, type: "RPC" },
      { x: 0.82, y: 0.24, color: "#00E5A0", count: 950, type: "Validator" },
      { x: 0.82, y: 0.6, color: "#FFB84D", count: 320, type: "Storage" },
      { x: 0.78, y: 0.22, color: "#00B4D8", count: 720, type: "Compute" },
    ];

    var time = 0;
    function animateMap() {
      cx.clearRect(0, 0, w, h);

      cx.fillStyle = "#1C1C2833";
      continents.forEach(function (cont) {
        var startX = cont.x * w;
        var startY = cont.y * h;
        var endX = startX + cont.w * w;
        var endY = startY + cont.h * h;
        for (var x = startX; x < endX; x += gap) {
          for (var y = startY; y < endY; y += gap) {
            if (Math.sin(x * 123.456 + y * 789.012) > 1 - cont.density * 2) {
              cx.beginPath();
              cx.arc(x, y, dotSize, 0, Math.PI * 2);
              cx.fill();
            }
          }
        }
      });

      for (var i = 0; i < nodeLocations.length; i++) {
        for (var j = i + 1; j < nodeLocations.length; j++) {
          var a = nodeLocations[i];
          var b = nodeLocations[j];
          var dx = a.x * w - b.x * w;
          var dy = a.y * h - b.y * h;
          var dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < w * 0.25) {
            cx.beginPath();
            cx.moveTo(a.x * w, a.y * h);
            cx.lineTo(b.x * w, b.y * h);
            cx.strokeStyle = a.color;
            cx.globalAlpha = 0.06 + Math.sin(time * 0.5 + i) * 0.03;
            cx.lineWidth = 0.5;
            cx.stroke();
            cx.globalAlpha = 1;
          }
        }
      }

      nodeLocations.forEach(function (node, idx) {
        var nx = node.x * w;
        var ny = node.y * h;
        var pulseR = 12 + Math.sin(time + idx * 1.5) * 4;

        cx.beginPath();
        cx.arc(nx, ny, pulseR, 0, Math.PI * 2);
        cx.fillStyle = node.color + "11";
        cx.fill();
        cx.strokeStyle = node.color + "33";
        cx.lineWidth = 0.5;
        cx.stroke();

        cx.beginPath();
        cx.arc(nx, ny, 3.5, 0, Math.PI * 2);
        cx.fillStyle = node.color;
        cx.fill();
        cx.shadowColor = node.color;
        cx.shadowBlur = 8;
        cx.fill();
        cx.shadowBlur = 0;
      });

      time += 0.02;
      requestAnimationFrame(animateMap);
    }
    animateMap();
  }

  /* ────────────────────────────────────────────────
     18. Initialize Everything
     ──────────────────────────────────────────────── */
  function initCharts() {
    drawAllCharts();
    drawWorldMap();
  }

  var resizeTimer;
  window.addEventListener("resize", function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(initCharts, 200);
  });

  requestAnimationFrame(function () {
    setTimeout(initCharts, 100);
  });
})();