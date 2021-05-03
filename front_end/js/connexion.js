"use strict";

const userString = localStorage.getItem('user');
if (userString) {
    window.location = "accueil.html";
};

let email =  document.getElementById("email");
let pw = document.getElementById("pw");

const errorDiv = document.getElementById('error')


//  Envoyer les valeurs du formulaire a l'api

let loginUrl = `http://127.0.0.1:3000/api/auth/login`;


function sendToServer(){

let data = {
  email : email.value,
  pw: pw.value
}

  fetch(loginUrl,{
    method : 'post',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body : JSON.stringify(data)
  })
  .then(response => response.json()
        .then((json) => {
            if (!response.ok) {
              return Promise.reject(json.message);
            }
            return json;
    }))
  .then(data => {//envoyer le token et l'user id dans le local.storage
      localStorage.setItem('user', JSON.stringify({
          id : data.userId,
          token : data.token, 
          isAdmin : data.isAdmin
        }));
       //aller vers la page profil
      window.location.href = 'accueil.html'
    })
    .catch(error => {
      errorDiv.textContent = error
    });
};

// appeller la fonction sendToServer quand on clique sur le boutton send à condition que les champs des formulaires sont tous bien remplis
let form = document.getElementById('formulaire');
let btnSend = document.getElementById('btnSend');

btnSend.addEventListener('click', ()=> {
    sendToServer();
});

