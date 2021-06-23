let prix = JSON.parse(localStorage.getItem("prixTotalCommande"));
let orderId = JSON.parse(localStorage.getItem("responseOrderId"));
let userInfo = JSON.parse(localStorage.getItem("contact"));

function showRecapCommand() {
    let showCommand = document.getElementById("commandID");
    showCommand.innerHTML = `
    <p>
        Votre commande numéro:<br>
            <strong>${orderId}</strong><br> et d'un montant de <strong>${prix}</strong>€ sera envoyé à l'adresse suivante : <strong>${userInfo.address} ${userInfo.city}</strong>.
    </p>
    <p>Merci <strong>${userInfo.lastName} ${userInfo.firstName}</strong> pour votre achat.</p><br>
    <p>A trés bientôt pour un nouvel achat.</p>
    `;
}
showRecapCommand();
localStorage.clear();