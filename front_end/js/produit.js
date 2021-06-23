//Fonction qui execute certaine fonction au chargement de la page
(async function() {
    const nounours = await getNounours();
    displayNounours(nounours)
    const btnAddBasket = document.getElementById("ajout_panier");
        btnAddBasket.addEventListener("click", (e) => {
            e.preventDefault();
            ajoutPanier(nounours);
        });
})()

//Fonction qui permet la connection entre l'API et la page JS
function getNounours() {
    const queryString = new URLSearchParams(window.location.search);

    const nounoursId = queryString.get("id");
    //Appel de l'API en fonction de l'ID du produit
    return fetch(`http://localhost:3000/api/teddies/${nounoursId}`)
        .then(function(httpBodyResponse) {
            return httpBodyResponse.json();
        })
        .then(function(nounourses) {
            return nounourses;
        })
        .catch(function(error) {
            alert(error);
        })
}

//Affichage du produit selectionné
function displayNounours(nounours){
    //On récupere le template créée en HTML pour le cloner
    const templateElt = document.getElementById("templateNounours");
    const cloneElt = document.importNode(templateElt.content, true);

    //Remplace les données vide par les informations du produit
    cloneElt.getElementById("nounours_titre").textContent = nounours.name;
    cloneElt.getElementById("nounours_image").src = nounours.imageUrl;
    cloneElt.getElementById("nounours_prix").textContent = nounours.price/100 + " €";
    cloneElt.getElementById("nounours_desc").textContent = nounours.description;

    document.getElementById("main").appendChild(cloneElt);

    //Ajout des couleurs du produit dans le SELECT
    for(color of nounours.colors){
        const newOption = document.createElement("option",);
        const newContent = document.createTextNode(color);

        newOption.setAttribute("value", color);
        newOption.appendChild(newContent);

        document.getElementById("select_colors").appendChild(newOption);
    }
}

//Récuperation du choix produit
function getSelectedColor() {
    const colorValue = document.getElementById("select_colors");
    //Récuperation choix de l'utilisateur dans une variable
    if (colorValue) {
      console.log(colorValue.value)
      return colorValue.value;
    }
}

//Fonction pour ajouter le produit au panier
function ajoutPanier(produitSelect) {
    const selectColor = getSelectedColor();
    //Récupération des valeurs du formulaire
    let produitComplet = {
      name: produitSelect.name,
      id: produitSelect._id,
      option: selectColor,
      prix: produitSelect.price / 100,
      imageUrl: produitSelect.imageUrl
    };
    ajoutProduitStorage(produitComplet);
}

  
//Fonction permettant d'ajouter un produit sélectionné dans le local storage
function ajoutProduitStorage(produitComplet) {
    //Stocker les valeurs du formulaire dans le local storage:
    //Création de la condition SI il y a un produit dans le locale storage OU non
    let saveProductLocalStorage =
      JSON.parse(localStorage.getItem("produit")) || []; //=>convertir au format JSON avec la clé product
    saveProductLocalStorage.push(produitComplet);
    localStorage.setItem("produit", JSON.stringify(saveProductLocalStorage));
    /*let item = localStorage.getItem("produit");
    console.log(item);*/
    //Confirmation selection produit + option sélectionné
    if (produitComplet) {
      try {
        /*alert(
          `Le produit ${produitComplet.name} avec la couleur ${produitComplet.option} a été ajouter au panier`
        );*/
        window.location.href = "panier.html";
      }catch (error) {
        console.log(error.message);
      }
    }
}
