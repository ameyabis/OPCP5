//Fonction qui execute certaine fonction au chargement de la page
(async function() {
    const nounourses = await getNounourses();

    //On boucle jusqu'a afficher tout les produits dans l'API
    for (nounours of nounourses){
        displayNounours(nounours);
    }
})()

//Fonction qui permet la connection entre l'API et la page JS
function getNounourses() {
    return fetch("http://localhost:3000/api/teddies/")
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

//Affichage des differents produits
function displayNounours(nounours) {
    const templateElt = document.getElementById("templateNounours");
    const cloneElt = document.importNode(templateElt.content, true);

    cloneElt.getElementById("nounours_pdt").href += nounours._id;
    cloneElt.getElementById("nounours_titre").textContent = nounours.name;
    cloneElt.getElementById("nounours_image").src = nounours.imageUrl;
    cloneElt.getElementById("nounours_prix").textContent = nounours.price/100 + " €";

    document.getElementById("main").appendChild(cloneElt);
}
