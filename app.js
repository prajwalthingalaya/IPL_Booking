
function showToast(message) {

    let toast = document.getElementById("toast");

    if (!toast) {
        toast = document.createElement("div");
        toast.id = "toast";
        document.body.appendChild(toast);
    }

    toast.textContent = message;
    toast.classList.add("show");

    clearTimeout(window.toastTimer);

    window.toastTimer = setTimeout(function() {
        toast.classList.remove("show");
    }, 3000);

}

document.addEventListener("DOMContentLoaded", function() {

    const bookingForm = document.getElementById("bookingForm");
    const successMessage = document.getElementById("successMessage");
    const matchSelect = document.getElementById("match");

    const urlParams = new URLSearchParams(window.location.search);
    const selectedMatch = urlParams.get("match");

    if (selectedMatch && matchSelect) {

        matchSelect.value = selectedMatch;

        const bookingSection = document.getElementById("booking");

        if (bookingSection) {

            setTimeout(function() {

                bookingSection.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });

                showToast("Match selected! Please complete your booking.");

            }, 300);

        }

    }

    if (bookingForm) {

        bookingForm.addEventListener("submit", function(event) {

            event.preventDefault();

            if (bookingForm.checkValidity()) {

                successMessage.style.display = "block";

                showToast("Booking form submitted successfully!");

            } else {

                bookingForm.reportValidity();

            }

        });

        bookingForm.addEventListener("reset", function() {
            successMessage.style.display = "none";
        });

    }

});
