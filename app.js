
function showToast(message) {
    let toast = document.getElementById("toast");

    if (!toast) {
        toast = document.createElement("div");
        toast.id = "toast";
        document.body.appendChild(toast);
    }

    toast.textContent = message;
    toast.classList.add("show");

    setTimeout(function () {
        toast.classList.remove("show");
    }, 2000);
}

document.addEventListener("DOMContentLoaded", function () {
    const match = document.getElementById("match");
    const stand = document.getElementById("stand");
    const tickets = document.getElementById("tickets");

    const summaryMatch = document.getElementById("summaryMatch");
    const summaryStand = document.getElementById("summaryStand");
    const summaryTickets = document.getElementById("summaryTickets");
    const summaryPrice = document.getElementById("summaryPrice");
    const totalPrice = document.getElementById("totalPrice");

    const bookingForm = document.querySelector("#bookingForm");
    const successMessage = document.getElementById("successMessage");

    const prices = {
        General: 500,
        Premium: 1000,
        VIP: 2000
    };

    function updateSummary() {
        const selectedMatch = match.value;
        const selectedStand = stand.value;
        let quantity = Number(tickets.value);

        if (!Number.isFinite(quantity) || quantity < 1) {
            quantity = 1;
        }

        if (quantity > 5) {
            quantity = 5;
        }

        const price = prices[selectedStand] || 0;
        const total = price * quantity;

        summaryMatch.textContent = selectedMatch || "Not selected";
        summaryStand.textContent = selectedStand || "Not selected";
        summaryTickets.textContent = quantity;
        summaryPrice.textContent = price;
        totalPrice.textContent = total;

        showToast("Booking summary updated");
    }

    match.addEventListener("change", updateSummary);
    stand.addEventListener("change", updateSummary);
    tickets.addEventListener("input", updateSummary);

    bookingForm.addEventListener("submit", function (event) {
        event.preventDefault();

        if (!bookingForm.checkValidity()) {
            bookingForm.reportValidity();
            return;
        }

        successMessage.textContent = "Your booking details have been submitted successfully!";
        successMessage.style.display = "block";

        showToast("Booking submitted successfully!");
    });

    bookingForm.addEventListener("reset", function () {
        setTimeout(function () {
            successMessage.style.display = "none";
            updateSummary();
        }, 0);
    });

    updateSummary();
});