
"use strict";

const img = document.getElementById('img');
const firstname = document.getElementById('firstname');
const lastname = document.getElementById('lastname');


const image = document.getElementById('image');
const content = document.getElementById('content');


const imgPost= document.getElementById('imgPost');
const contentPost= document.getElementById('contentPost');
const createdAt= document.getElementById('createdAt');

const imgComment= document.getElementById('imgComment');
const userComment = document.getElementById('userComment');
const contentComment= document.getElementById('contentComment');
const createdAtComment= document.getElementById('createdAtComment');

const imgUserPost = document.getElementById('imgUserPost');
const nameUserPost = document.getElementById('nameUserPost');
// const lastnameUserPost = document.getElementById('lastnameUserPost');
const commentaireUrl = `http://127.0.0.1:3000/api/commentaire`;

///Récuperer le token avec l'id qui correspondent au user connecté
const userString = localStorage.getItem('user');
const userJson = JSON.parse(userString);

const userUrl = `http://127.0.0.1:3000/api/profil/${userJson.id}`;
let publicationUrl = `http://127.0.0.1:3000/api/publication`;

//********************** demarrage de la page

showUserPostZone();
showAllPublications();
showAllCommentaires();

// envoyer une requette GET à l'API(web service) pour récupérer les données de l'utlisateur
function showUserPostZone() {
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
}

//  Envoyer les valeurs de la publication a l'api
function sendToServerPublication() {
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
let btnPartager = document.getElementById('btnPartager');
btnPartager.addEventListener('click', () => {
    sendToServer();
});


// envoyer une requette GET à l'API(web service) pour récupérer les données des publication 
function showAllPublications() {
    let btnCommenter = document.getElementById('btnCommenter');
fetch( publicationUrl, {
      headers: {
        'Authorization': `bearer ${userJson.token}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    })
   .then(response => {
    if (response.ok == true) {
      return response;
    } else {
      console.log(response);
      throw new Error("la reponse du serveur n'est pas 200");
    }
  })
    //  consommer la promesse et retourner uniquement son body sous format json
    .then(response => response.json())
  
      // récuperer les informations de la publication selectionné
    .then(data => {
      console.log(data);
      imgPost.src = data[0].image;
      contentPost.textContent = data[0].content;
      createdAt.textContent = data[0].createdAt;
      imgUserPost.src = data[0].User.img;
      nameUserPost.textContent = data[0].User.firstname +' '+ data[0].User.lastname;
          //   lastnameUserPost.textContent = data[0].User.lastname;
  
      btnCommenter.setAttribute('onclick', `sendToServerCommentaire(${data[0].id})`);
    })
    .catch(erreurCatche => console.log(`il y a une erreur ${erreurCatche.message}`));
}




  //  Envoyer les valeurs du commentaire a l'api
  function sendToServerCommentaire(id) {
      let data = {
        content: content.value,
        utilisateur_id : userJson.id, // vient de localstorage 
        publication_id : id
      };
    fetch( commentaireUrl, {
        method: 'post',
        headers: {
          'Authorization': `bearer ${userJson.token}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })
    
    .then(response => {
      if (response.ok == true) {
        return response;
      } else {
        console.log(response);
        throw new Error("la reponse du serveur n'est pas 200");
      }
    })
      .then(() => {
          alert('commentaire créée avec succès!');
        //aller vers la page confirmation.fr
      //   window.location.href = 'connexion.html'
      })
      .catch(error => {
        console.log(error);
      });
  }


 // envoyer une requette GET à l'API(web service) pour récupérer les données des commentaire
  function showAllCommentaires() {
   
fetch( publicationUrl, {
      headers: {
        'Authorization': `bearer ${userJson.token}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    })
   .then(response => {
    if (response.ok == true) {
      return response;
    } else {
      console.log(response);
      throw new Error("la reponse du serveur n'est pas 200");
    }
  })
    //  consommer la promesse et retourner uniquement son body sous format json
    .then(response => response.json())
  
      // récuperer les informations de la publication selectionné
    .then(data => {
      userComment.textContent = data[0].User.firstname + data[0].User.lastname;
      imgComment.src = data[0].image;
      contentComment.textContent = data[0].content;
      createdAtComment.textContent = data[0].createdAt;

      alert( data[0].User.firstname , data[0].User.lastname)

    })
    .catch(erreurCatche => console.log(`il y a une erreur ${erreurCatche.message}`));
}