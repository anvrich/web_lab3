let calculator, elt;

const BOUNDS = {left: -5, right: 5, bottom: -5, top: 5};
const POINT_PREFIX = "pt_";
const ALLOWED_R = [1, 1.5, 2, 2.5, 3];

function isInsideArea(x, y, r) {
    if (x <= 0 && y >= 0) return x >= -r && y <= r / 2;
    if (x >= 0 && y >= 0) return y <= (-0.5 * x + r / 2) && x <= r && y <= r / 2;
    if (x >= 0 && y <= 0) return (x * x + y * y) <= (r * r) / 4;
    return false;
}

function getR() {
    const hidden = document.getElementById("formCoords:rValue");
    const r = hidden ? parseFloat(hidden.value) : 2;
    return Number.isFinite(r) ? r : 2;
}

function getFormData() {
    const xEl = document.getElementById("formCoords:x_input");
    const yEl = document.getElementById("formCoords:y");
    return { x: xEl ? parseFloat(xEl.value) : NaN,
        y: yEl ? parseFloat(yEl.value) : NaN,
        r: getR() };
}

function validateFormData(x, y, r) {
    const errors = [];
    if (!Number.isFinite(x)) errors.push("X должен быть числом");
    else if (x < -3 || x > 3) errors.push("X должен быть в диапазоне [-3; 3]");
    if (!Number.isFinite(y)) errors.push("Y должен быть числом");
    else if (y < -5 || y > 5) errors.push("Y должен быть в диапазоне [-5; 5]");
    if (!ALLOWED_R.includes(r)) errors.push(`R должен быть одним из: ${ALLOWED_R.join(", ")}`);
    return errors;
}

function showErrors(errors) {
    const panel = document.getElementById("errorPanelContent");
    if (!panel) return;
    panel.innerHTML = "";
    if (errors.length === 0) { panel.style.display = "none"; return; }
    panel.style.display = "block";
    const ul = document.createElement("ul");
    errors.forEach(e => { const li = document.createElement("li"); li.textContent = e; li.className="error-item"; ul.appendChild(li); });
    panel.appendChild(ul);
}

function updateSubmitButton() {
    const btn = document.getElementById("formCoords:submitBtn");
    const {x, y, r} = getFormData();
    const errors = validateFormData(x, y, r);
    const ok = errors.length === 0;
    if (btn) { btn.disabled = !ok; btn.style.opacity = ok ? "1" : "0.6"; btn.style.cursor = ok ? "pointer" : "not-allowed"; }
    showErrors(errors);
}

function setBounds(){ calculator.setMathBounds(BOUNDS); }

function clearPoints() {
    const ids = (calculator.getState().expressions?.list || [])
        .filter(e => e.id && e.id.startsWith(POINT_PREFIX)).map(e => e.id);
    if (ids.length) calculator.removeExpressions(ids.map(id => ({id})));
}

function drawArea(R) {
    calculator.setExpressions([
        { id: "rect",   latex: `-${R} \\le x \\le 0 \\{0 \\le y \\le ${R}/2\\}`, color: Desmos.Colors.BLUE, fillOpacity: 0.2 },
        { id: "tri",    latex: `y \\le -0.5x+${R}/2 \\{0 \\le x \\le ${R}\\} \\{0 \\le y \\le ${R}/2\\}`, color: Desmos.Colors.BLUE, fillOpacity: 0.2 },
        { id: "circle", latex: `x^2+y^2 \\le (${R}/2)^2 \\{x \\ge 0\\} \\{y \\le 0\\}`, color: Desmos.Colors.BLUE, fillOpacity: 0.2 }
    ]);
}

function addPoint(x, y, inside) {
    calculator.setExpression({
        id: `${POINT_PREFIX}${Date.now()}_${Math.random().toString(16).slice(2)}`,
        latex: `(${x},${y})`,
        color: inside ? Desmos.Colors.GREEN : Desmos.Colors.RED
    });
}

function drawAllPoints() {
    const rows = document.querySelectorAll("#results-table tr");
    if (!rows || rows.length < 2) return;
    clearPoints();
    rows.forEach((row, i) => {
        if (i === 0) return;
        const tds = row.querySelectorAll("td");
        if (tds.length >= 4) {
            const x = parseFloat(tds[0].textContent);
            const y = parseFloat(tds[1].textContent);
            const inside = tds[3].textContent.includes("✅");
            if (Number.isFinite(x) && Number.isFinite(y)) addPoint(x, y, inside);
        }
    });
}

function handleGraphClick(ev) {
    const rect = elt.getBoundingClientRect();
    let math;
    if (calculator?.pixelsToMathCoordinates) {
        math = calculator.pixelsToMathCoordinates({x: ev.clientX - rect.left, y: ev.clientY - rect.top});
    } else {
        const nx = (ev.clientX - rect.left) / rect.width;
        const ny = (ev.clientY - rect.top) / rect.height;
        math = { x: BOUNDS.left + nx * (BOUNDS.right - BOUNDS.left),
            y: BOUNDS.top - ny * (BOUNDS.top - BOUNDS.bottom) };
    }
    const x = +math.x.toFixed(2);
    const y = +math.y.toFixed(2);
    const r = getR();

    const errors = validateFormData(x, y, r);
    if (errors.length) { showErrors(["Координаты с графика вне диапазона"]); updateSubmitButton(); return; }

    // Пишем в форму и сразу сохраняем
    const xEl = document.getElementById("formCoords:x_input");
    const yEl = document.getElementById("formCoords:y");
    if (xEl) xEl.value = x;
    if (yEl) yEl.value = y;

    addPoint(x, y, isInsideArea(x, y, r));
    updateSubmitButton();
    if (typeof savePoint === "function") savePoint(); // p:remoteCommand
}

function handleSubmit(data) {
    if (data.status === "success") {
        setBounds(); drawArea(getR()); drawAllPoints(); showErrors([]); updateSubmitButton();
    }
}

function updateGraph(data) {
    if (data.status === "success") {
        setBounds(); drawArea(getR()); drawAllPoints(); updateSubmitButton();
    }
}

window.addEventListener("DOMContentLoaded", () => {
    elt = document.getElementById("calculator");
    if (!elt || typeof Desmos === "undefined") return;

    calculator = Desmos.GraphingCalculator(elt, {
        expressions:false, keypad:false, xAxisStep:1, yAxisStep:1,
        xAxisLabel:"x", yAxisLabel:"y", showGrid:true, xAxisNumbers:true, yAxisNumbers:true
    });

    setBounds(); drawArea(getR()); drawAllPoints(); updateSubmitButton();
    elt.addEventListener("click", handleGraphClick);

    const xInput = document.getElementById("formCoords:x_input");
    const yInput = document.getElementById("formCoords:y");
    if (xInput) { xInput.addEventListener("input", updateSubmitButton); xInput.addEventListener("change", updateSubmitButton); }
    if (yInput) { yInput.addEventListener("input", updateSubmitButton); yInput.addEventListener("change", updateSubmitButton); }
    showErrors([]);
});
