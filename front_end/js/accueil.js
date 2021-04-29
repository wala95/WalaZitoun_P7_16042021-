
"use strict";

const img = document.getElementById('img');
const name = document.getElementById('name');



const image = document.getElementById('image');
const content = document.getElementById('content');


const imgPost= document.getElementById('imgPost');
const contentPost= document.getElementById('contentPost');
const createdAt= document.getElementById('createdAt');

const newComment= document.getElementById('newComment');

// const imgComment= document.getElementById('imgComment');
// const userComment = document.getElementById('userComment');
// const contentComment= document.getElementById('contentComment');
// const createdAtComment= document.getElementById('createdAtComment');

// const imgUserPost = document.getElementById('imgUserPost');
// const nameUserPost = document.getElementById('nameUserPost');

///Récuperer le token avec l'id qui correspondent au user connecté
const userString = localStorage.getItem('user');
const userJson = JSON.parse(userString);

const userUrl = `http://127.0.0.1:3000/api/profil/${userJson.id}`;
const publicationUrl = `http://127.0.0.1:3000/api/publication`;
const commentaireUrl = `http://127.0.0.1:3000/api/commentaire`;




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
          name.textContent = data.firstname +' '+ data.lastname;
      
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
    sendToServerPublication()
});

// creer les post avec les comentaires
function creatPost(imgUserPost, nameUserPost, createdAt, imgPost, contentPost, ) {


    let imageUserPostDiv = document.createElement('div');
    imageUserPostDiv.classList.add("col-2");
    let newImageUserPost = document.createElement('img');
    newImageUserPost.src = imgUserPost;
    newImageUserPost.classList.add("profile-photo-md", "pull-left", "rounded-circle");
    newImageUserPost.setAttribute("width", "100%");

    imageUserPostDiv.appendChild(newImageUserPost);




    let postDetailDiv = document.createElement('div');
    postDetailDiv.classList.add("post-detail", "col-10");


    let userInfoPostDiv = document.createElement('div');
    userInfoPostDiv.classList.add("user-info");
    let newNameUserPost = document.createElement('h6');
    newNameUserPost.textContent = nameUserPost;
    newNameUserPost.classList.add("profile-link", "text-primary")
    let newCreatedAt = document.createElement('p');
    newCreatedAt.textContent = createdAt;
    newCreatedAt.classList.add("text-muted");
    userInfoPostDiv.appendChild(newNameUserPost);
    userInfoPostDiv.appendChild(newCreatedAt);

    let publicationDiv = document.createElement('div');
    publicationDiv.classList.add("publication", "mt-2", "d-flex", "flex-row", "align-items-start");
    let newImgPost = document.createElement('img');
    newImgPost.src = imgPost;
    newImgPost.setAttribute( "width", "200");
    newImgPost.classList.add();
   let newContentPost = document.createElement('p');
   newContentPost.textContent = createdAt;
   newContentPost.classList.add("comment-text", "ml-5");
    publicationDiv.appendChild(newImgPost);
    publicationDiv.appendChild(newContentPost);





    let commentDiv = document.createElement('div');
    commentDiv.classList.add("comment", "mt-5");
    commentDiv.setAttribute("id", "commentaire")



    let addCommentDiv = document.createElement('div');
    addCommentDiv.classList.add("add-comment", "bg-light", "p-2");
    let textarea= document.createElement('textarea');
    textarea.classList.add("form-control" ,"ml-1", "shadow-none", "textarea");
   let btnCommenter = document.createElement('button');
   btnCommenter.textContent = "Commenter";
   btnCommenter.setAttribute('type', 'button');
   btnCommenter.classList.add("btn", "btn-primary", "btn-sm", "shadow-none",  "mt-2");
    let btnSupprimer = document.createElement('button');
    btnSupprimer.textContent = "Supprimer";
    btnSupprimer.setAttribute('type', 'button');
    btnSupprimer.classList.add("btn", "btn-outline-primary", "btn-sm", "ml-1", "shadow-none", "mt-2"); 
    addCommentDiv.appendChild(textarea);
    addCommentDiv.appendChild(btnCommenter);
    addCommentDiv.appendChild(btnSupprimer);


    
    postDetailDiv.appendChild(userInfoPostDiv);
    postDetailDiv.appendChild(publicationDiv);
    postDetailDiv.appendChild(commentDiv);
    postDetailDiv.appendChild(addCommentDiv);


    let postcontainerDiv = document.createElement('div');
    postcontainerDiv.classList.add("post-container", "row", "mb-5");
    postcontainerDiv.appendChild(imageUserPostDiv);
    postcontainerDiv.appendChild(postDetailDiv);

    return postcontainerDiv;
  }


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
      .then(posts => {
        let publication = document.getElementById("publication")
        for (let post of posts) {
            let dhia = creatPost(post.User.img, post.User.firstname +' '+ post.User.lastname, post.createdAt, post.image, post.content);
            console.log(dhia)
            publication.appendChild(dhia);
          }



    //   .then(data => {
    //   console.log(data);
    //   imgPost.src = data[0].image;
    //   contentPost.textContent = data[0].content;
    //   createdAt.textContent = data[0].createdAt;
  
    //   nameUserPost.textContent = data[0].User.firstname +' '+ data[0].User.lastname;
          //   lastnameUserPost.textContent = data[0].User.lastname;
  
      btnCommenter.setAttribute('onclick', `sendToServerCommentaire(${data[0].id})`);
    })
    .catch(erreurCatche => console.log(`il y a une erreur ${erreurCatche.message}`));
}







  //  Envoyer les valeurs du commentaire a l'api
  function sendToServerCommentaire(id) {
      let data = {
        content: newComment.value,
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

// creer la liste des comentaires
function creatComment(img, user,createdAt, content) {

    let imgComment = document.createElement('img');
    imgComment.src = img;
    imgComment.classList.add("profile-photo-sm", "col-2");


    let textDiv = document.createElement('div');
    textDiv.classList.add("col-10");
    let userComment = document.createElement('h6');
    userComment.textContent = user;
    userComment.classList.add("text-primary")
    let createdAtComment = document.createElement('p');
    createdAtComment.textContent = createdAt;
    createdAtComment.classList.add("text-muted");
    let Contentcomment = document.createElement('p');
    Contentcomment.textContent = content;
    Contentcomment.classList.add("xxcc");
    textDiv.appendChild(userComment);
    textDiv.appendChild(createdAtComment);
    textDiv.appendChild(Contentcomment);


    let commentDiv = document.createElement('div');
    commentDiv.classList.add("row");
    commentDiv.appendChild(imgComment);
    commentDiv.appendChild(textDiv);

    return commentDiv;
  }
 // envoyer une requette GET à l'API(web service) pour récupérer les données des commentaires
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
    .then(comments => {
        let commentaire = document.getElementById("commentaire")
        for (let comment of comments) {
            let wala = creatComment(comment.User.img, comment.User.firstname +' '+ comment.User.lastname, comment.createdAt, comment.content);
            console.log(wala)
            commentaire.appendChild(wala);
          }

    //   userComment.textContent = data[0].User.firstname + data[0].User.lastname;
    //   imgComment.src = data[0].image;
    //   contentComment.textContent = data[0].content;
    //   createdAtComment.textContent = data[0].createdAt;


    })
    .catch(erreurCatche => console.log(`il y a une erreur ${erreurCatche}`));
}









