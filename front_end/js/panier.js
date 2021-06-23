//Récupération des produit dans le local storage
let saveProductLocalStorage = JSON.parse(localStorage.getItem("produit"));

const displayPanierVide = document.getElementById("show_panier");
const displayPanier = document.getElementById("show_panier");

//Afficher le PANIER
function showCommand() {
    //Si panier vide alors afficher PANIER VIDE
    if (saveProductLocalStorage === null) {
        let panierVide = `
            <table id="panier_vide">
                <thead>
                    <tr>
                        <th>Le panier est vide</th>
                    </tr>
                </thead>
            </table>
        `;
        displayPanierVide.innerHTML = panierVide;
    } else { // Sinon afficher les produit present dans le LOCAL STORAGE
        let panier = [];
        for (i = 0; i < saveProductLocalStorage.length; i++) {
            panier += `
                <tr class="panier">
                    <td class="panier_produit">${saveProductLocalStorage[i].name}</td>
                    <td class="panier_image"><img src="${saveProductLocalStorage[i].imageUrl}" alt="${saveProductLocalStorage[i].name}"></td>
                    <td class="panier_option">${saveProductLocalStorage[i].option}</td>
                    <td class="panier_prix">${saveProductLocalStorage[i].prix} €</td>
                    <td class="panier_supprimer"><input id="btn_supprArticle" type="button" value="X"></td>
                <tr>
            `;
        }
        if (i === saveProductLocalStorage.length) {
            displayPanier.innerHTML = panier;
        }
    }
}
showCommand();

//Suppression d'un article
function supprimerArticle(){
    const suppArticle = getElementById("btn_supprArticle");
    
}

//Suppression du PANIER
function supprimerPanier() {
    let supprPanier = `   
        <tr class="supprimer">
            <td>
                <input id="btn_suppr" type="button" value="Supprimer le panier">
            </td>
        </tr>
    `;
  
    displayPanier.insertAdjacentHTML("beforeend", supprPanier);
  
    let supprimer = document.getElementById("btn_suppr");
    if (supprimer) {
        supprimer.addEventListener("click", (e) => {
            e.preventDefault;
            e.stopPropagation;
            localStorage.removeItem("produit");
            localStorage.removeItem("prixTotalCommande");
            window.location.href = "index.html";
        });
    }
}
supprimerPanier();

function summarize(acc, cur) {
    return Number(acc) + Number(cur);
}

function prixTotalCommande() {
    let prixPanier = [];

    if (saveProductLocalStorage) {
        for (i = 0; i < saveProductLocalStorage.length; i++) {
            let prixTotal = saveProductLocalStorage[i].prix;
            prixPanier.push(prixTotal);
        }
    }

    const prixTotalPanier = Number(prixPanier.reduce(summarize, 0));

    localStorage.setItem("prixTotalCommande", JSON.stringify(prixTotalPanier));
    let showPrixPanier = `   
        <tr class="prix_total">
            <td>
                <p>Le prix total de votre panier est de ${prixTotalPanier} €</p>
            </td>
        </tr>
        `;

        displayPanier.insertAdjacentHTML("beforeend", showPrixPanier);
}
prixTotalCommande();


//FORMULAIRE

//Variable pour le formulaire
const btnValider = document.getElementById("btn_valider");
const form = document.getElementById("form");

let products = [];

let contact = {};

//Récupération données saisies par l'utilisateur pour les controlés

//Déclaration des Regexp pour controler le formulaire
// Nom , Prénom , Ville
const regexFormValues = (value) => {
    return /^[A-Za-z0-9\s-,'ÀÂÄÇÈÉÊËÎÏÔÖÙÛÜàâäçéèêëîïôöùûü]{0,50}$/.test(value);
};
//Adresse
const regexAddressValue = (value) => {
    return /^[0-9]{1,4}[ ,-][ A-Za-zÀ-ÿ0-9-]+$/.test(value);
};
//Email
const regexEmailValue = (value) => {
    return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(value);
};

//Condition si les données sont correctes
function firstNameControl() {
    const firstNameUser = contact.firstName;
    if (regexFormValues(firstNameUser)) {
        return true;
    } else {
        alert(textAlert("PRENOM"));
        return false;
    }
} 

function lastNameControl() {
    const lastNameUser = contact.lastName;
    if (regexFormValues(lastNameUser)) {
        return true;
    } else {
        alert(textAlert("NOM"));
        return false;
    }
}

function addressControl() {
    const addressUser = contact.address;
    if (regexAddressValue(addressUser)) {
        return true;
    } else {
        alert("Veuillez entrer une adresse valide");
        return false;
    }
}

function cityControl() {
    const cityUser = contact.city;
    if (regexFormValues(cityUser)) {
        return true;
    } else {
        alert(textAlert("VILLE"));
        return false;
    }
}

function emailControl() {
    const emailUser = contact.email;
    if (regexEmailValue(emailUser)) {
        return true;
    } else {
        alert("EMAIL : Non valide");
        return false;
    }
}

//Affichage alerte si prénom, nom ville sont incorrectes
const textAlert = (value) => {
    return `${value} : Chiffres et symboles non valide\n Caractères 2 < 20`;
};

//Récuperation des données du formulaire
form.addEventListener("submit", (e) => {
    e.preventDefault();
    e.stopPropagation();

    contact = {
        lastName : document.getElementById("last_name").value,
        firstName : document.getElementById("first_name").value,
        address: document.getElementById("address").value,
        city : document.getElementById("city").value,
        email : document.getElementById("email").value
    }

    // Envoyer formulaire au local storage SI les données sont valides
    if (firstNameControl() && lastNameControl() && addressControl() && cityControl() && emailControl()) {
        localStorage.setItem("contact", JSON.stringify(contact));
        //Récupération des Id nounours pour l'envoi au serveur
        saveProductLocalStorage.forEach((dataId) => {
            products.push(dataId.id);
        });
        const sendAll = {
            products,
            contact,
        };
        postfetch(sendAll);
        
    }
});
    
// Envoyer la commande et le formulaire au serveur
function postfetch(sendAll) {
    fetch("http://localhost:3000/api/teddies/order", {
    method: "POST",
    body: JSON.stringify(sendAll),
    headers: { "Content-Type": "application/json" },
    })
    .then((data) => data.json())
    .catch((error) => console.log(error))
    .then((dataResponse) => {
        localStorage.setItem(
        "responseOrderId",
        JSON.stringify(dataResponse.orderId)
        );
        window.location.replace("confirmation.html");
    });
}


