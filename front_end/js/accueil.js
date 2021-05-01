"use strict";
///Récuperer le token avec l'id qui correspondent au user connecté
const userString = localStorage.getItem('user');
if(!userString){
    window.location="connexion.html";
};
const userJson = JSON.parse(userString);


moment.locale('fr');

const img = document.getElementById('img');




const image = document.getElementById('newImg');
const content = document.getElementById('content');


const imgPost = document.getElementById('imgPost');
const contentPost = document.getElementById('contentPost');
const createdAt = document.getElementById('createdAt');

const newComment = document.getElementById('newComment');


const btnDeconnexion=document.getElementById("btnDeconnexion");
// const imgComment= document.getElementById('imgComment');
// const userComment = document.getElementById('userComment');
// const contentComment= document.getElementById('contentComment');
// const createdAtComment= document.getElementById('createdAtComment');

// const imgUserPost = document.getElementById('imgUserPost');
// const nameUserPost = document.getElementById('nameUserPost');



const userUrl = `http://127.0.0.1:3000/api/profil/${userJson.id}`;
const publicationUrl = `http://127.0.0.1:3000/api/publication`;
const commentaireUrl = `http://127.0.0.1:3000/api/commentaire`;




//********************** demarrage de la page

showUserPostZone();
showAllPublications();

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
           

        })
        .catch(erreurCatche => console.log(`il y a une erreur ${erreurCatche.message}`));
    let btnPartager = document.getElementById('btnPartager');
    btnPartager.addEventListener('click', () => {
        sendToServerPublication()
    });
}

//  Envoyer les valeurs de la publication a l'api
function sendToServerPublication() {
    let promiseFetch = null;
    if (!image.files || image.files[0] == null) {
        let data = {
            content: content.value,
            utilisateur_id: userJson.id
        };
        promiseFetch = fetch(publicationUrl, {
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

        promiseFetch = fetch(publicationUrl, {
            method: 'post',
            headers: {
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
            document.location.reload();
        })
        .catch(error => {
            console.log(error);
        });
}


// creer les post avec les comentaires
function creatPost(imgUserPost, nameUserPost, createdAt, imgPost, contentPost, postId, postUserId) {


    let imageUserPostDiv = document.createElement('div');
    imageUserPostDiv.classList.add("col-2");
    let newImageUserPost = document.createElement('img');
    newImageUserPost.src = imgUserPost;
    newImageUserPost.classList.add("profile-photo-md", "pull-left", "rounded-circle");
    newImageUserPost.setAttribute("width", "100%");

    imageUserPostDiv.appendChild(newImageUserPost);

    let userInfoPostDiv = document.createElement('div');
    userInfoPostDiv.classList.add("user-info", "row");

    let postDetailDiv = document.createElement('div');
    postDetailDiv.classList.add("post-detail", "col-10");

    let newNameUserPost = document.createElement('h6');
    newNameUserPost.textContent = nameUserPost;
    newNameUserPost.classList.add("profile-link", "text-primary", "col-7", "m-0")



    let deletePost = document.createElement('button');
    deletePost.textContent = "Supprimer";
    deletePost.setAttribute('type', 'button');
    deletePost.setAttribute('id', 'deletePost');
    deletePost.classList.add("btn", "btn-white", "text-secondary", "btn-sm", "col-3", "p-0");
    deletePost.setAttribute('onclick', `deletePublication(${postId})`);




    let updatePost = document.createElement('button');
    updatePost.textContent = "Modifier";
    updatePost.setAttribute('type', 'button');
    updatePost.setAttribute('id', 'updatePost');
    updatePost.classList.add("btn", "btn-white", "text-secondary", "btn-sm", "col-2", "p-0");
    // updateComment.setAttribute('onclick', `sendToServerCommentaire(${postId}, 'commentPost_${postId}')`);


    let newCreatedAt = document.createElement('p');
    newCreatedAt.textContent = moment(createdAt).fromNow();
    newCreatedAt.classList.add("text-muted", "col-12");



    userInfoPostDiv.appendChild(newNameUserPost);
    if(userJson.id == postUserId || userJson.isAdmin){
    userInfoPostDiv.appendChild(deletePost);
    userInfoPostDiv.appendChild(updatePost);
    }
    userInfoPostDiv.appendChild(newCreatedAt);

    let publicationDiv = document.createElement('div');
    publicationDiv.classList.add("publication", "mt-2");





    let newContentPost = document.createElement('p');
    newContentPost.textContent = contentPost;
    newContentPost.classList.add("comment-text");

    publicationDiv.appendChild(newContentPost);

    if (imgPost) {
        let newImgPost = document.createElement('img');
        newImgPost.src = imgPost;
        newImgPost.setAttribute("width", "70%");
        publicationDiv.appendChild(newImgPost);
    }





    let commentDiv = document.createElement('div');
    commentDiv.classList.add("comment", "mt-5");



    let addCommentDiv = document.createElement('div');
    addCommentDiv.classList.add("add-comment", "p-2", "text-right");
    let textarea = document.createElement('textarea');
    textarea.classList.add("form-control", "ml-1", "shadow-none", "textarea", "col-10");
    textarea.setAttribute("placeholder", `Ecrivez un commentaire`);
    textarea.setAttribute("id", `commentPost_${postId}`);

    let btnCommenter = document.createElement('button');
    btnCommenter.textContent = "Commenter";
    btnCommenter.setAttribute('type', 'button');
    btnCommenter.setAttribute('id', 'btnCommenter');
    btnCommenter.classList.add("btn", "btn-primary", "btn-sm", "shadow-none", "mt-2");
    btnCommenter.setAttribute('onclick', `sendToServerCommentaire(${postId}, 'commentPost_${postId}')`);



    let btnAnnuler = document.createElement('button');
    btnAnnuler.textContent = "Annuler";
    btnCommenter.setAttribute('id', 'btnAnnulerPost');
    btnAnnuler.setAttribute('type', 'button');
    btnAnnuler.classList.add("btn", "btn-outline-primary", "btn-sm", "ml-1", "shadow-none", "mt-2");


    addCommentDiv.appendChild(textarea);
    addCommentDiv.appendChild(btnCommenter);
    addCommentDiv.appendChild(btnAnnuler);



    postDetailDiv.appendChild(userInfoPostDiv);
    postDetailDiv.appendChild(publicationDiv);
    postDetailDiv.appendChild(commentDiv);
    postDetailDiv.appendChild(addCommentDiv);


    let postcontainerDiv = document.createElement('div');
    postcontainerDiv.classList.add("post-container", "row", "mb-5");
    postcontainerDiv.appendChild(imageUserPostDiv);
    postcontainerDiv.appendChild(postDetailDiv);

    return { postDiv: postcontainerDiv, commentDiv: commentDiv };
}


// envoyer une requette GET à l'API(web service) pour récupérer les données des publication 
function showAllPublications() {
    fetch(publicationUrl, {
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
                let { postDiv, commentDiv } = creatPost(post.User.img, post.User.firstname + ' ' + post.User.lastname, post.createdAt, post.image, post.content, post.id, post.User.id);
                showAllCommentaires(commentDiv, post.Commentaires)
                publication.appendChild(postDiv);
            }


        })
        .catch(erreurCatche => console.log(`il y a une erreur ${erreurCatche.message}`));
}





//  Envoyer les valeurs du commentaire a l'api
function sendToServerCommentaire(id, idTextArea) {

    let content = document.getElementById(idTextArea).value;

    let data = {
        content: content,
        utilisateur_id: userJson.id, // vient de localstorage 
        publication_id: id
    };
    fetch(commentaireUrl, {
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
            document.location.reload();
            //aller vers la page confirmation.fr
            //   window.location.href = 'connexion.html'
        })
        .catch(error => {
            console.log(error);
        });
}




// creer la liste des comentaires
function createComment(img, user, createdAt, content, commentId, commentUserId) {

    let imgComment = document.createElement('img');
    imgComment.src = img;
    imgComment.classList.add("profile-photo-sm", "col-2", "mr-3");


    let textDiv = document.createElement('div');
    textDiv.classList.add("col-10", "row", "textDiv", "rounded", "mb-2", "p-2");
    let userComment = document.createElement('h6');
    userComment.textContent = user;
    userComment.classList.add("text-primary", "col-4", "p-0")
    let createdAtComment = document.createElement('p');
    createdAtComment.textContent = moment(createdAt).fromNow();
    createdAtComment.classList.add("text-muted", "col-5", "p-0");
    let deleteComment = document.createElement('button');
    deleteComment.textContent = "Supprimer";
    deleteComment.setAttribute('type', 'button');
    deleteComment.setAttribute('id', 'deleteComment');
    deleteComment.classList.add("btn", "btn-sm", "mb-2", "col-3");
    deleteComment.setAttribute('onclick', `deleteCommentaire(${commentId})`);
    let ContentComment = document.createElement('p');
    ContentComment.textContent = content;
    ContentComment.classList.add("xxcc");
    textDiv.appendChild(userComment);
    textDiv.appendChild(createdAtComment);
    if(userJson.id == commentUserId || userJson.isAdmin){
    textDiv.appendChild(deleteComment);
    }
    textDiv.appendChild(ContentComment);


    let commentDiv = document.createElement('div');
    commentDiv.classList.add("row");
    commentDiv.appendChild(imgComment);
    commentDiv.appendChild(textDiv);

    return commentDiv;
}
// envoyer une requette GET à l'API(web service) pour récupérer les données des commentaires
function showAllCommentaires(commentDiv, comments) {
    for (let comment of comments) {
        let wala = createComment(comment.User.img, comment.User.firstname + ' ' + comment.User.lastname, comment.createdAt, comment.content, comment.id, comment.User.id);
        commentDiv.appendChild(wala);
    }
}





//  supprimer une publication
function deletePublication(id) {

    fetch(publicationUrl + `/${id}`, {
        method: 'delete',
        headers: {
            'Authorization': `bearer ${userJson.token}`,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
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


function deleteCommentaire(id) {

    fetch(commentaireUrl + `/${id}`, {
        method: 'delete',
        headers: {
            'Authorization': `bearer ${userJson.token}`,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
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

var loadFile = function(event) {
	var image = document.getElementById('imgPreview');
	image.src = URL.createObjectURL(event.target.files[0]);
    image.setAttribute("width", "200");
    image.setAttribute("height", "200");
};


//déconnexion 
btnDeconnexion.addEventListener('click', () => {
   localStorage.removeItem('user')
   window.location='connexion.html';
});