
"use strict";

const img = document.getElementById('img');
const firstame = document.getElementById('firstname');
const lastname = document.getElementById('lastname');
const email = document.getElementById('email');
const bio = document.getElementById('bio');



const imgModify = document.getElementById('imgModify');
const firstnameModify = document.getElementById('firstnameModify');
const lastnameModify = document.getElementById('lastnameModify');
const bioModify = document.getElementById('bioModify');
const pwDelete = document.getElementById('pwDelete');

///Récuperer l'url avec l'id qui correspond au user selectionné
const userString = localStorage.getItem('user');
const userJson = JSON.parse(userString);

const userUrl = `http://127.0.0.1:3000/api/profil/${userJson.id}`;

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
    bio.textContent = data.bio;
  })
  .catch(erreurCatche => console.log(`il y a une erreur ${erreurCatche.message}`));




  //  Envoyer les valeurs modifiées du formulaire a l'api
function modifyProfil(){
  let listInfo = [{"value":firstnameModify.value, "name":"firstname"}, 
  {"value":lastnameModify.value, "name":"lastname"}, 
  {"value":bioModify.value, "name":"bio"},
  {"value":imgModify.files[0], "name":"image"},]
  let formData = new FormData();
  for (let info of listInfo){
    if(info.value){
    formData.append(info.name, info.value);
  }}
  fetch(userUrl,{
    method : 'put',
    headers: {
      'Authorization': `bearer ${userJson.token}`,
    },
    body : formData
  })
  .then(response => {
      if (response.ok == true) {
        return response;
      }
      else {
        console.log(response);
        throw new Error("la reponse du serveur n'est pas 200");
      }
    })
  .then(() => {
    document.location.reload();
    })
    .catch(error => {
        console.log(error);
    });
};
  
// appeller la fonction modify quand on clique sur le boutton btnModify
let btnModify = document.getElementById('btnModify');

btnModify.addEventListener('click', ()=> {
  modifyProfil();
});

//  supprimer un utilisateur
function deleteProfil(){
  fetch(userUrl,{
    method : 'delete',
    headers: {
      'Authorization': `bearer ${userJson.token}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }, 
    body : JSON.stringify({
      pw : pwDelete.value
    })
  })
  .then(response => {
      if (response.ok == true) {
        return response;
      }
      else {
        console.log(response);
        throw new Error("la reponse du serveur n'est pas 200");
      }
    })
  .then(() => {
    window.location.href = 'inscription.html'
    localStorage.removeItem('user');
    })
    .catch(error => {
        console.log(error);
    });
};
// appeller la fonction deleteProfil quand on clique sur le boutton
let btnDelete = document.getElementById('btnDelete');
btnDelete.addEventListener('click', ()=> {
  deleteProfil();
});


// Deconnexion
let btnDeconnexion = document.getElementById('btnDeconnexion');
btnDeconnexion.addEventListener('click', ()=> {
  window.location.href = 'inscription.html'
  localStorage.removeItem('user');
});
