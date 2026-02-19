// ========================================================
//  Recursive vs Iterative – Full Script with Animations
// ========================================================

// ========== Recursive Implementations ==========

function factorialRecursive(n, log) {
    log.push({ type: "push", text: `PUSH  fact(${n})` });
    let result;
    if (n === 0 || n === 1) {
        result = 1;
    } else {
        result = n * factorialRecursive(n - 1, log);
    }
    log.push({ type: "pop", text: `POP   fact(${n}) → ${result}` });
    return result;
}

function fibonacciRecursive(n, log) {
    log.push({ type: "push", text: `PUSH  fib(${n})` });
    let result;
    if (n <= 1) {
        result = n;
    } else {
        result = fibonacciRecursive(n - 1, log) + fibonacciRecursive(n - 2, log);
    }
    log.push({ type: "pop", text: `POP   fib(${n}) → ${result}` });
    return result;
}

// ========== Iterative Implementations ==========

function factorialIterative(n, trace) {
    let result = 1;
    if (n === 0 || n === 1) {
        trace.push(`Step 1: fact(${n}) = 1`);
        return 1;
    }
    for (let i = 1; i <= n; i++) {
        result *= i;
        trace.push(`Step ${i}: i=${i}  →  result = ${result}`);
    }
    return result;
}

function fibonacciIterative(n, trace) {
    if (n <= 1) {
        trace.push(`Step 1: fib(${n}) = ${n}`);
        return n;
    }
    let a = 0, b = 1, c;
    trace.push(`Init: a=0, b=1`);
    for (let i = 2; i <= n; i++) {
        c = a + b;
        trace.push(`Step ${i - 1}: a=${a} + b=${b} → ${c}`);
        a = b;
        b = c;
    }
    return b;
}

// ========== Animated Counter ==========

function animateCounter(el, target, suffix = "") {
    const duration = 600;
    const start = performance.now();
    const from = 0;

    el.classList.add("counting");

    function tick(now) {
        const progress = Math.min((now - start) / duration, 1);
        // ease-out cubic
        const ease = 1 - Math.pow(1 - progress, 3);
        const current = Math.round(from + (target - from) * ease);
        el.textContent = current + suffix;
        if (progress < 1) {
            requestAnimationFrame(tick);
        } else {
            el.textContent = target + suffix;
            el.classList.remove("counting");
        }
    }
    requestAnimationFrame(tick);
}

// ========== Rendering Helpers ==========

function renderStackFrames(containerId, log) {
    const el = document.getElementById(containerId);
    el.innerHTML = "";
    log.forEach((entry, i) => {
        const div = document.createElement("div");
        div.classList.add("frame", entry.type === "push" ? "frame-push" : "frame-pop");
        div.textContent = entry.text;
        el.appendChild(div);
        setTimeout(() => {
            div.classList.add("frame-visible");
        }, i * 50);
    });
}

function renderIterTrace(containerId, lines) {
    const el = document.getElementById(containerId);
    el.innerHTML = "";
    lines.forEach((line, i) => {
        const div = document.createElement("div");
        div.classList.add("frame", "frame-iter");
        div.textContent = line;
        el.appendChild(div);
        setTimeout(() => {
            div.classList.add("frame-visible");
        }, i * 60);
    });
}

function renderChart(recMs, itMs) {
    const area = document.getElementById("chartArea");
    const maxMs = Math.max(recMs, itMs, 0.001);
    const maxBarHeight = 140;

    const recHeight = Math.max((recMs / maxMs) * maxBarHeight, 6);
    const itHeight = Math.max((itMs / maxMs) * maxBarHeight, 6);

    // Create bars at height 0 first, then animate
    area.innerHTML = `
        <div class="chart-bar-group">
            <div class="chart-bar rec-bar" id="recBar" style="height:0px;">
                <span class="chart-bar-value">${recMs.toFixed(3)} ms</span>
            </div>
            <span class="chart-bar-label">Recursive</span>
        </div>
        <div class="chart-bar-group">
            <div class="chart-bar it-bar" id="itBar" style="height:0px;">
                <span class="chart-bar-value">${itMs.toFixed(3)} ms</span>
            </div>
            <span class="chart-bar-label">Iterative</span>
        </div>
    `;

    // Animate to target height on next frame
    requestAnimationFrame(() => {
        document.getElementById("recBar").style.height = recHeight + "px";
        document.getElementById("itBar").style.height = itHeight + "px";
    });
}

function showSummary(algo, n, recCallCount, itStepCount, recMs, itMs) {
    const card = document.getElementById("summaryCard");
    const text = document.getElementById("summaryText");
    card.style.display = "block";

    const algoName = algo === "factorial" ? "Factorial" : "Fibonacci";
    const faster = recMs <= itMs ? "Recursive" : "Iterative";
    const ratio =
        recMs > itMs
            ? (recMs / Math.max(itMs, 0.001)).toFixed(1)
            : (itMs / Math.max(recMs, 0.001)).toFixed(1);

    text.innerHTML =
        `For <strong>${algoName}(${n})</strong>, the recursive approach made ` +
        `<strong>${recCallCount}</strong> function calls while the iterative approach used ` +
        `<strong>${itStepCount}</strong> loop steps. ` +
        `<strong>${faster}</strong> was faster (≈${ratio}× difference). ` +
        (algo === "fibonacci" && n > 6
            ? "Fibonacci's exponential recursion tree causes a dramatic increase in function calls compared to the O(n) iterative loop."
            : "For small inputs, the difference is minimal, but it grows significantly as n increases.");
}

// ========== Main ==========

function runComparison() {
    const algo = document.getElementById("algo").value;
    const n = parseInt(document.getElementById("nVal").value);

    if (isNaN(n) || n < 0 || n > 20) {
        alert("Please enter a value of n between 0 and 20.");
        return;
    }

    // Recursive run
    const recLog = [];
    const t1 = performance.now();
    let recResult;
    if (algo === "factorial") recResult = factorialRecursive(n, recLog);
    else recResult = fibonacciRecursive(n, recLog);
    const t2 = performance.now();

    // Iterative run
    const itTrace = [];
    const t3 = performance.now();
    let itResult;
    if (algo === "factorial") itResult = factorialIterative(n, itTrace);
    else itResult = fibonacciIterative(n, itTrace);
    const t4 = performance.now();

    const recMs = t2 - t1;
    const itMs = t4 - t3;
    const recCallCount = recLog.filter((e) => e.type === "push").length;
    const itStepCount = itTrace.length;

    // Render animated stack frames
    renderStackFrames("recStack", recLog);
    renderIterTrace("itStack", itTrace);

    // Animated counters
    animateCounter(document.getElementById("recCalls"), recCallCount);
    animateCounter(document.getElementById("itCalls"), itStepCount);

    // Time & result (direct set)
    document.getElementById("recTime").textContent = recMs.toFixed(3) + " ms";
    document.getElementById("itTime").textContent = itMs.toFixed(3) + " ms";
    document.getElementById("recResult").textContent = recResult;
    document.getElementById("itResult").textContent = itResult;

    // Badges with pop animation
    const recBadge = document.getElementById("recBadge");
    const itBadge = document.getElementById("itBadge");
    recBadge.textContent = recCallCount + " calls";
    itBadge.textContent = itStepCount + " steps";
    recBadge.classList.remove("pop");
    itBadge.classList.remove("pop");
    void recBadge.offsetWidth; // force reflow
    recBadge.classList.add("pop");
    itBadge.classList.add("pop");

    // Chart
    renderChart(recMs, itMs);

    // Summary
    showSummary(algo, n, recCallCount, itStepCount, recMs, itMs);
}

document.getElementById("runBtn").addEventListener("click", runComparison);

// Press Enter inside the input to run
document.getElementById("nVal").addEventListener("keydown", function (e) {
    if (e.key === "Enter") runComparison();
});

// ========== Button Ripple Effect ==========

document.getElementById("runBtn").addEventListener("click", function (e) {
    const btn = this;
    const circle = document.createElement("span");
    circle.classList.add("ripple");
    const d = Math.max(btn.clientWidth, btn.clientHeight);
    circle.style.width = circle.style.height = d + "px";
    const rect = btn.getBoundingClientRect();
    circle.style.left = e.clientX - rect.left - d / 2 + "px";
    circle.style.top = e.clientY - rect.top - d / 2 + "px";
    btn.appendChild(circle);
    setTimeout(() => circle.remove(), 600);
});

// ========== Scroll Reveal (Intersection Observer) ==========

const revealObserver = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
            }
        });
    },
    { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
);

document.querySelectorAll(".reveal").forEach((el) => revealObserver.observe(el));

// ========== 3D Card Tilt on Hover ==========

document.querySelectorAll(".tilt-card").forEach((card) => {
    card.addEventListener("mousemove", (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -6;
        const rotateY = ((x - centerX) / centerX) * 6;
        card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
    });

    card.addEventListener("mouseleave", () => {
        card.style.transform = "perspective(800px) rotateX(0) rotateY(0) scale(1)";
        card.style.transition = "transform 0.5s ease";
        setTimeout(() => (card.style.transition = ""), 500);
    });
});

// ========== Swirl Particle Background ==========

(function initSwirl() {
    const canvas = document.getElementById("particleCanvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    let w, h;
    const particles = [];
    const PARTICLE_COUNT = 300;
    let time = 0;

    function resize() {
        w = canvas.width = window.innerWidth;
        h = canvas.height = document.body.scrollHeight;
    }
    resize();
    window.addEventListener("resize", resize);

    // Simple noise function (value noise with smoothing)
    function noise(x, y) {
        const ix = Math.floor(x);
        const iy = Math.floor(y);
        const fx = x - ix;
        const fy = y - iy;
        // Smooth step
        const sx = fx * fx * (3 - 2 * fx);
        const sy = fy * fy * (3 - 2 * fy);
        // Hash corners
        function hash(a, b) {
            let h = a * 127.1 + b * 311.7;
            return Math.sin(h) * 43758.5453 % 1;
        }
        const n00 = hash(ix, iy);
        const n10 = hash(ix + 1, iy);
        const n01 = hash(ix, iy + 1);
        const n11 = hash(ix + 1, iy + 1);
        const nx0 = n00 + sx * (n10 - n00);
        const nx1 = n01 + sx * (n11 - n01);
        return nx0 + sy * (nx1 - nx0);
    }

    // Color palette: purple, magenta, cyan
    const colors = [
        { h: 270, s: 80, l: 65 }, // purple
        { h: 300, s: 75, l: 60 }, // magenta
        { h: 200, s: 85, l: 65 }, // cyan
        { h: 250, s: 70, l: 70 }, // indigo
        { h: 320, s: 80, l: 55 }, // pink
    ];

    // Create particles
    for (let i = 0; i < PARTICLE_COUNT; i++) {
        const color = colors[Math.floor(Math.random() * colors.length)];
        particles.push({
            x: Math.random() * w,
            y: Math.random() * h,
            originX: Math.random() * w,
            originY: Math.random() * h,
            r: Math.random() * 2.5 + 0.8,
            speed: Math.random() * 0.8 + 0.3,
            opacity: Math.random() * 0.7 + 0.3,
            h: color.h,
            s: color.s,
            l: color.l,
            angle: Math.random() * Math.PI * 2,
            noiseOffsetX: Math.random() * 1000,
            noiseOffsetY: Math.random() * 1000,
        });
    }

    function draw() {
        // Fade trail effect — don't fully clear
        ctx.fillStyle = "rgba(5, 10, 24, 0.12)";
        ctx.fillRect(0, 0, w, h);

        time += 0.003;

        particles.forEach((p) => {
            // Get flow angle from noise field
            const noiseVal = noise(
                p.x * 0.003 + p.noiseOffsetX + time,
                p.y * 0.003 + p.noiseOffsetY + time
            );
            const angle = noiseVal * Math.PI * 4;

            // Swirl motion
            p.x += Math.cos(angle) * p.speed;
            p.y += Math.sin(angle) * p.speed;

            // Gentle pull back toward origin to keep particles on screen
            const dxOrigin = p.originX - p.x;
            const dyOrigin = p.originY - p.y;
            p.x += dxOrigin * 0.001;
            p.y += dyOrigin * 0.001;

            // Wrap around edges
            if (p.x < -20) p.x = w + 20;
            if (p.x > w + 20) p.x = -20;
            if (p.y < -20) p.y = h + 20;
            if (p.y > h + 20) p.y = -20;

            // Draw glow
            const glowR = p.r * 5;
            const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, glowR);
            gradient.addColorStop(0, `hsla(${p.h}, ${p.s}%, ${p.l}%, ${p.opacity * 0.5})`);
            gradient.addColorStop(0.4, `hsla(${p.h}, ${p.s}%, ${p.l}%, ${p.opacity * 0.15})`);
            gradient.addColorStop(1, `hsla(${p.h}, ${p.s}%, ${p.l}%, 0)`);
            ctx.beginPath();
            ctx.arc(p.x, p.y, glowR, 0, Math.PI * 2);
            ctx.fillStyle = gradient;
            ctx.fill();

            // Draw core
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fillStyle = `hsla(${p.h}, ${p.s}%, ${p.l + 15}%, ${p.opacity})`;
            ctx.fill();
        });

        requestAnimationFrame(draw);
    }

    // Initial clear
    ctx.fillStyle = "rgba(5, 10, 24, 1)";
    ctx.fillRect(0, 0, w, h);
    draw();
})();
