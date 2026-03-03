document.addEventListener('DOMContentLoaded', () => {
    const hoursInput = document.getElementById('hours-input');
    const totalInput = document.getElementById('total-input');
    const feeOutput = document.getElementById('fee-output');
    const netOutput = document.getElementById('net-output');
    const hourlyOutput = document.getElementById('hourly-output');

    function toBRL(value) {
        return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    }

    function recalc() {
        const hours = Math.max(1, Number(hoursInput?.value || 0));
        const total = Math.max(0, Number(totalInput?.value || 0));
        const fee = total * 0.08;
        const net = total - fee;
        const hourly = hours > 0 ? total / hours : 0;

        if (feeOutput) feeOutput.textContent = toBRL(fee);
        if (netOutput) netOutput.textContent = toBRL(net);
        if (hourlyOutput) hourlyOutput.textContent = `${toBRL(hourly)}/h`;
    }

    if (hoursInput) {
        hoursInput.addEventListener('input', recalc);
    }
    if (totalInput) {
        totalInput.addEventListener('input', recalc);
    }

    recalc();
});
