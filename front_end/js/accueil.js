
"use strict";

const img = document.getElementById('img');
const firstname = document.getElementById('firstname');
const lastname = document.getElementById('lastname');


const image = document.getElementById('image');
const content = document.getElementById('content');


const imgCreated= document.getElementById('imgCreated');
const contentCreated= document.getElementById('contentCreated');
const createdAt= document.getElementById('createdAt');

///Récuperer le token avec l'id qui correspondent au user connecté
const userString = localStorage.getItem('user');
const userJson = JSON.parse(userString);

const userUrl = `http://127.0.0.1:3000/api/profil/${userJson.id}`;
const accueilUrl = `http://127.0.0.1:3000/api/accueil`;

// envoyer une requette GET à l'API(web service) pour récupérer les données 
fetch(userUrl, {
  headers: {
    'Authorization': `bearer ${userJson.token}`,
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }
})
  .then(response => {
    if (response.ok == true) {
      return response;
    }
    else {
      throw new Error("la reponse du serveur n'est pas 200");
    }
  })
  //  consommer la promesse et retourner uniquement son body sous format json
  .then(response => response.json())

  // consommer la promesse précédente pour: 
    // récuperer les informations du user selectionné
  .then(data => {
    img.src = data.img;
    firstname.textContent = data.firstname;
    lastname.textContent = data.lastname;
  })
  .catch(erreurCatche => console.log(`il y a une erreur ${erreurCatche.message}`));


  //  Envoyer les valeurs de la publication a l'api
let publicationUrl = `http://127.0.0.1:3000/api/publication`;

function sendToServer() {
  let promiseFetch = null;
  if (!image.files || image.files[0] == null) {
    let data = {
      content: content.value,
      utilisateur_id : userJson.id
    };
    promiseFetch = fetch( publicationUrl, {
      method: 'post',
      headers: {
        'Authorization': `bearer ${userJson.token}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
  } else {
    let formData = new FormData();
    formData.append("image", image.files[0]);
    formData.append("content", content.value);
    formData.append("utilisateur_id", userJson.id);

    promiseFetch = fetch( publicationUrl, {
      method: 'post',
      headers : {
        'Authorization': `bearer ${userJson.token}`
      },
      body: formData
    });
  }
  promiseFetch.then(response => {
    if (response.ok == true) {
      return response;
    } else {
      console.log(response);
      throw new Error("la reponse du serveur n'est pas 200");
    }
  })
    .then(() => {
        alert('publication créée avec succès!');
      //aller vers la page confirmation.fr
    //   window.location.href = 'connexion.html'
    })
    .catch(error => {
      console.log(error);
    });
}
let btnPublication = document.getElementById('btnPublication');
btnPublication.addEventListener('click', () => {
    sendToServer();
    getServer(); 
  });




  // envoyer une requette GET à l'API(web service) pour récupérer les données des publication 
function getServer() {
let promiseFetch = null;
  if (!image.files || image.files[0] == null) {
    let data = {
      content: content.value,
      utilisateur_id : userJson.id
    };
    promiseFetch = fetch( publicationUrl, {
      headers: {
        'Authorization': `bearer ${userJson.token}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
  } else {
    let formData = new FormData();
    formData.append("image", image.files[0]);
    formData.append("content", content.value);
    formData.append("utilisateur_id", userJson.id);

    promiseFetch = fetch( publicationUrl, {
      headers : {
        'Authorization': `bearer ${userJson.token}`
      },
      body: formData
    });
  }
  promiseFetch.then(response => {
    if (response.ok == true) {
      return response;
    } else {
      console.log(response);
      throw new Error("la reponse du serveur n'est pas 200");
    }
  })

    .then(response => {
      if (response.ok == true) {
        return response;
      }
      else {
        throw new Error("la reponse du serveur n'est pas 200");
      }
    })
    //  consommer la promesse et retourner uniquement son body sous format json
    .then(response => response.json())
  
    // consommer la promesse précédente pour: 
      // récuperer les informations du user selectionné
    .then(data => {
      imgCreated.src = data.img;
      contentCreated.textContent = data.content;
      createdAt.textContent = data.createdAT;
    })
    .catch(erreurCatche => console.log(`il y a une erreur ${erreurCatche.message}`));
}