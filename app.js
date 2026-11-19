
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

    window.toastTimer = setTimeout(function () {
        toast.classList.remove("show");
    }, 2000);
}

document.addEventListener("DOMContentLoaded", function () {

    const menuToggle = document.getElementById("menuToggle");
    const navLinks = document.getElementById("navLinks");

    if (menuToggle && navLinks) {
        menuToggle.addEventListener("click", function () {
            navLinks.classList.toggle("open");

            const isOpen = navLinks.classList.contains("open");
            menuToggle.setAttribute("aria-expanded", isOpen);
            menuToggle.textContent = isOpen ? "✕" : "☰";
        });

        navLinks.querySelectorAll("a").forEach(function (link) {
            link.addEventListener("click", function () {
                navLinks.classList.remove("open");
                menuToggle.setAttribute("aria-expanded", "false");
                menuToggle.textContent = "☰";
            });
        });
    }

    const teamFilter = document.getElementById("teamFilter");
    const matchContainer = document.getElementById("matchContainer");
    const gridView = document.getElementById("gridView");
    const listView = document.getElementById("listView");
    const noMatches = document.getElementById("noMatches");

    if (teamFilter && matchContainer) {
        const matchCards = matchContainer.querySelectorAll(".match-card");

        teamFilter.addEventListener("change", function () {
            const selectedTeam = teamFilter.value;
            let visibleCount = 0;

            matchCards.forEach(function (card) {
                const teams = card.dataset.teams.split(" ");
                const shouldShow = selectedTeam === "all" || teams.includes(selectedTeam);

                card.style.display = shouldShow ? "" : "none";

                if (shouldShow) {
                    visibleCount++;
                }
            });

            if (noMatches) {
                noMatches.style.display = visibleCount === 0 ? "block" : "none";
            }

            showToast("Match filter updated");
        });

        if (gridView && listView) {
            gridView.addEventListener("click", function () {
                matchContainer.classList.remove("list-view");
                gridView.classList.add("active");
                listView.classList.remove("active");
                showToast("Grid view selected");
            });

            listView.addEventListener("click", function () {
                matchContainer.classList.add("list-view");
                listView.classList.add("active");
                gridView.classList.remove("active");
                showToast("List view selected");
            });
        }
    }

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

    if (match && stand && tickets && bookingForm) {

        const selectedMatch = new URLSearchParams(window.location.search).get("match");

        if (selectedMatch) {
            const matchOption = Array.from(match.options).find(function (option) {
                return option.value === selectedMatch;
            });

            if (matchOption) {
                match.value = selectedMatch;
            }
        }

        function updateSummary(showNotification) {
            const selectedMatch = match.value;
            const selectedStand = stand.value;

            let quantity = Number(tickets.value);

            if (!Number.isFinite(quantity) || quantity < 1) {
                quantity = 1;
            }

            if (quantity > 5) {
                quantity = 5;
            }

            tickets.value = quantity;

            const price = prices[selectedStand] || 0;
            const total = price * quantity;

            summaryMatch.textContent = selectedMatch || "Not selected";
            summaryStand.textContent = selectedStand || "Not selected";
            summaryTickets.textContent = quantity;
            summaryPrice.textContent = price;
            totalPrice.textContent = total;

            if (showNotification) {
                showToast("Booking summary updated");
            }
        }

        match.addEventListener("change", function () {
            updateSummary(true);
        });

        stand.addEventListener("change", function () {
            updateSummary(true);
        });

        tickets.addEventListener("input", function () {
            updateSummary(true);
        });

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
                updateSummary(false);
            }, 0);
        });

        updateSummary(false);
    }
});
