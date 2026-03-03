document.addEventListener('DOMContentLoaded', () => {
    const steps = Array.from(document.querySelectorAll('.auth-step'));
    const progressFill = document.getElementById('auth-progress-fill');
    const form = document.getElementById('auth-form');
    const skipBtn = document.getElementById('auth-skip-btn');
    const modeInput = document.getElementById('account-mode');
    const serviceInput = document.getElementById('service-input');
    const serviceChips = document.getElementById('service-chips');

    let currentStep = 0;

    function updateStep(index) {
        currentStep = Math.max(0, Math.min(index, steps.length - 1));

        steps.forEach((step, i) => {
            step.classList.toggle('auth-step--active', i === currentStep);
        });

        const progress = steps[currentStep].dataset.progress || '0';
        progressFill.style.width = `${progress}%`;

        const isLast = currentStep === steps.length - 1;
        skipBtn.hidden = isLast;
    }

    function showToast(message) {
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.textContent = message;
        document.body.appendChild(toast);

        setTimeout(() => {
            toast.remove();
        }, 2600);
    }

    function validateCurrentStep() {
        const step = steps[currentStep];
        const requiredFields = step.querySelectorAll('[required]');

        for (const field of requiredFields) {
            if (field.type === 'radio') {
                const radioGroup = step.querySelectorAll(`input[name="${field.name}"]`);
                const checked = Array.from(radioGroup).some((radio) => radio.checked);

                if (!checked) {
                    showToast('Selecione uma opção para continuar.');
                    return false;
                }
            } else if (!field.checkValidity()) {
                field.reportValidity();
                return false;
            }
        }

        return true;
    }

    form.addEventListener('click', (event) => {
        const target = event.target.closest('[data-next], [data-prev], .option-card');
        if (!target) return;

        if (target.matches('[data-next]')) {
            if (!validateCurrentStep()) return;
            updateStep(currentStep + 1);
        }

        if (target.matches('[data-prev]')) {
            updateStep(currentStep - 1);
        }

        if (target.matches('.option-card')) {
            const mode = target.dataset.mode;
            if (!modeInput || !mode) return;

            modeInput.value = mode;

            document.querySelectorAll('.option-card').forEach((card) => {
                const active = card === target;
                card.classList.toggle('option-card--active', active);
                card.setAttribute('aria-pressed', String(active));
            });
        }
    });

    if (skipBtn) {
        skipBtn.addEventListener('click', () => {
            updateStep(steps.length - 1);
        });
    }

    if (serviceInput && serviceChips) {
        serviceInput.addEventListener('keydown', (event) => {
            if (event.key !== 'Enter') return;
            event.preventDefault();

            const value = serviceInput.value.trim();
            if (!value) return;

            const chip = document.createElement('span');
            chip.className = 'chip';
            chip.textContent = value;
            serviceChips.appendChild(chip);
            serviceInput.value = '';
        });
    }

    form.addEventListener('submit', (event) => {
        event.preventDefault();

        if (!validateCurrentStep()) return;

        showToast('Conta simulada criada. Redirecionamento será integrado em breve.');
    });

    updateStep(0);
});
