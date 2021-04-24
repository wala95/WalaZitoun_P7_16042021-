"use strict";
let email =  document.getElementById("email");
let pw = document.getElementById("pw");


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
  .then(response => {
      if (response.ok == true) {
        return response;
      }else {
        console.log(response);
        throw new Error("la reponse du serveur n'est pas 200");
      }
    })
  .then(res => res.json())
  .then(data => {
      localStorage.setItem('user', JSON.stringify({
          id : data.userId,
          token : data.token, 
        }));
       //aller vers la page profil
      window.location.href = 'profil.html'
    })
    .catch(error => {
        console.log(error);
    });
};

// appeller la fonction sendToServer quand on clique sur le boutton send à condition que les champs des formulaires sont tous bien remplis
let form = document.getElementById('formulaire');
let btnSend = document.getElementById('btnSend');

btnSend.addEventListener('click', ()=> {
    sendToServer();
});

