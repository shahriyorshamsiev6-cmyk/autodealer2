document.addEventListener("DOMContentLoaded", () => {
    const priceForm = document.querySelector(".header__filters");
    const minimumPrice = document.querySelector("#price-min");
    const maximumPrice = document.querySelector("#price-max");
    const tabs = document.querySelectorAll(".header__button-links a");
    const brandsGrid = document.getElementById("brandsGrid");
    const showMoreBtn = document.getElementById("showMoreBrands");
    const requestForm = document.getElementById("requestForm");
    const requestBrand = document.getElementById("requestBrand");
    const requestModel = document.getElementById("requestModel");
    const requestName = document.getElementById("requestName");
    const requestPhone = document.getElementById("requestPhone");

    function createStatusNode() {
        const status = document.createElement("div");
        status.className = "form-status";
        status.setAttribute("aria-live", "polite");
        return status;
    }

    function showStatus(form, message, type = "success") {
        const existing = form.querySelector(".form-status");
        const status = existing || createStatusNode();
        status.textContent = message;
        status.classList.remove("is-error", "is-success");
        status.classList.add(type === "error" ? "is-error" : "is-success");
        if (!existing) {
            form.appendChild(status);
        }
    }

    function validatePriceRange() {
        if (!minimumPrice || !maximumPrice) return true;

        const minimum = minimumPrice.value === "" ? null : Number(minimumPrice.value);
        const maximum = maximumPrice.value === "" ? null : Number(maximumPrice.value);
        const invalidRange = minimum !== null && maximum !== null && minimum > maximum;

        minimumPrice.max = maximum ?? "";
        maximumPrice.min = minimum ?? 0;
        minimumPrice.setCustomValidity(
            invalidRange ? "Цена «от» не может быть выше цены «до»." : ""
        );
        maximumPrice.setCustomValidity(
            invalidRange ? "Цена «до» не может быть ниже цены «от»." : ""
        );

        return !invalidRange;
    }

    if (minimumPrice && maximumPrice) {
        minimumPrice.addEventListener("input", validatePriceRange);
        maximumPrice.addEventListener("input", validatePriceRange);
    }

    if (priceForm) {
        priceForm.addEventListener("submit", event => {
            if (!validatePriceRange()) {
                event.preventDefault();
                maximumPrice.reportValidity();
                showStatus(priceForm, "Проверьте диапазон цены: значение 'от' не может быть больше 'до'.", "error");
                return;
            }

            event.preventDefault();
            showStatus(priceForm, "Подбор автомобиля запущен. Мы подготовим подходящие варианты.", "success");
        });
    }

    tabs.forEach(tab => {
        tab.addEventListener("click", event => {
            event.preventDefault();
            tabs.forEach(item => {
                const active = item === tab;
                item.classList.toggle("is-active", active);
                item.setAttribute("aria-pressed", String(active));
            });
        });
    });

    if (brandsGrid && showMoreBtn) {
        showMoreBtn.addEventListener("click", () => {
            brandsGrid.classList.toggle("is-expanded");
            const expanded = brandsGrid.classList.contains("is-expanded");
            showMoreBtn.textContent = expanded ? "Свернуть" : "Показать ещё";
        });
    }

    if (requestForm) {
        const requiredFields = [requestBrand, requestModel, requestName, requestPhone];

        requestForm.addEventListener("submit", event => {
            event.preventDefault();

            const emptyField = requiredFields.find(field => !field || !field.value.trim());

            if (emptyField) {
                showStatus(requestForm, "Заполните все поля формы, чтобы оставить заявку.", "error");
                emptyField.focus();
                return;
            }

            showStatus(requestForm, "Заявка успешно отправлена. Менеджер свяжется с вами в ближайшее время.", "success");
            requestForm.reset();
        });
    }
});


