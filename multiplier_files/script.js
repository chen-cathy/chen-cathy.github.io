document.addEventListener('DOMContentLoaded', function () {
    // Elements
    const inputC = document.getElementById('input-c');
    const inputT = document.getElementById('input-t');
    const inputM = document.getElementById('input-m');
    const inputTransfer = document.getElementById('input-transfer');

    // Display elements for values
    const displayC = document.getElementById('val-c');
    const displayT = document.getElementById('val-t');
    const displayM = document.getElementById('val-m');
    const displayTransfer = document.getElementById('val-transfer');

    // Result elements
    const resKtr = document.getElementById('res-k-tr');
    const resYtr = document.getElementById('res-y-tr');
    const resKa = document.getElementById('res-k-a');
    const resYa = document.getElementById('res-y-a');

    // Calculate function
    function calculate() {
        const c = parseFloat(inputC.value);
        const t = parseFloat(inputT.value);
        const m = parseFloat(inputM.value);
        const dTransfer = parseFloat(inputTransfer.value);

        // Update value displays
        displayC.textContent = c.toFixed(2);
        displayT.textContent = t.toFixed(2);
        displayM.textContent = m.toFixed(2);
        displayTransfer.textContent = dTransfer;

        // Formula: k_TR = c / (1 - c(1 - t) + m)
        const denominator = 1 - c * (1 - t) + m;

        // Avoid division by zero
        if (denominator === 0) {
            resKtr.textContent = "∞";
            return;
        }

        const kTr = c / denominator;
        const dYTr = kTr * dTransfer;

        // Formula comparison: k_A = 1 / (1 - c(1 - t) + m)
        const kA = 1 / denominator;
        const dYA = kA * dTransfer; // Assuming same injection amount for comparison

        // Update result displays
        resKtr.textContent = kTr.toFixed(3);
        resYtr.textContent = dYTr.toFixed(2);

        resKa.textContent = kA.toFixed(3);
        resYa.textContent = dYA.toFixed(2);
    }

    // Event listeners
    inputC.addEventListener('input', calculate);
    inputT.addEventListener('input', calculate);
    inputM.addEventListener('input', calculate);
    inputTransfer.addEventListener('input', calculate);

    // Initial calculation
    calculate();
});
