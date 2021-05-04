"use strict";


///Récuperer le token avec l'id qui correspondent au user connecté
const userString = localStorage.getItem('user');
if (!userString) {
    window.location = "connexion.html";
};
moment.locale('fr');
const img = document.getElementById('imgUserPost');

const image = document.getElementById('newImg');
const content = document.getElementById('content');

const imgPost = document.getElementById('imgPost');
const contentPost = document.getElementById('contentPost');
const createdAt = document.getElementById('createdAt');

const newComment = document.getElementById('newComment');


const userJson = JSON.parse(userString);
const userUrl = `http://127.0.0.1:3000/api/profil`;
const publicationUrl = `http://127.0.0.1:3000/api/publication`;
const commentaireUrl = `http://127.0.0.1:3000/api/commentaire`;


// démarrage de la page
showUserPostZone();


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
        // consommer la promesse précédente pour récuperer les informations du user selectionné
        .then(data => {
            img.src = data.img;
            showAllPublications(data.id, data.isAdmin);
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
    if (!content.value && !image.files[0]) {
        return
    }
    //vérifier que le tableau des fichiers il n'est null et qe sont premier element n'est pas null 
    if (!image.files || !image.files[0]) {
        let data = {
            content: content.value
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

function sendToServerUpdate(postId, newContent) {
    let data = {

        content: newContent
    }
    fetch(publicationUrl + `/${postId}`, {
        method: 'put',
        headers: {
            'Authorization': `bearer ${userJson.token}`,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
        //  consommer la promesse et retourner uniquement son body sous format json
        .then(response => response.json())

        // récuperer les informations de la publication selectionné
        .then(posts => {
            document.location.reload();

        })
        .catch(erreurCatche => console.log(`il y a une erreur ${erreurCatche.message}`));
}


function onPostContentChange(event, postId) {
    //le keycode de entrer est 13
    if (event.keyCode === 13 && event.target.value) {
        sendToServerUpdate(postId, event.target.value);
    }

}

function updatePublication(iconeUpdate, postId, idHtmlPostContent) {

    let p = document.getElementById(idHtmlPostContent);
    let parentDiv = p.parentNode;

    let editContent = document.createElement('input');
    editContent.setAttribute("type", "text");
    editContent.classList.add("form-control", "ml-1", "shadow-none");
    editContent.setAttribute('value', p.textContent);//contenu brute avant detection du lien (a)
    editContent.setAttribute('onKeyUp', `onPostContentChange(event, ${postId})`);//ajouter un listenner à la saisie pour detecter le moment de cliquer sur entrer


    parentDiv.replaceChild(editContent, p);


    editContent.focus();// mettre le cursor sur le input pour faciliter le demarrage de la modification
    iconeUpdate.remove();//supprimer le icone edition
}


// creer les post avec les comentaires
function creatPost(imgUserPost, nameUserPost, createdAt, imgPost, contentPost, postId, postUserId, userId, isAdmin) {


    let imageUserPostDiv = document.createElement('div');
    imageUserPostDiv.classList.add("col-2", "p-0");

    let newImageUserPost = document.createElement('img');
    newImageUserPost.src = imgUserPost;
    newImageUserPost.classList.add("profile-photo-md", "pull-left", "rounded-circle", "mx-auto");
    newImageUserPost.setAttribute("alt", "photo de profil");
    newImageUserPost.setAttribute("width", "50");
    newImageUserPost.setAttribute("height", "50");

    imageUserPostDiv.appendChild(newImageUserPost);

    let userInfoPostDiv = document.createElement('div');
    userInfoPostDiv.classList.add("user-info", "row");

    let postDetailDiv = document.createElement('div');
    postDetailDiv.classList.add("post-detail", "col-10");

    let newNameUserPost = document.createElement('a');
    newNameUserPost.textContent = nameUserPost;
    newNameUserPost.classList.add("profile-link", "textBleu", "col-8", "m-0")
    if (userId== postUserId) {
        newNameUserPost.setAttribute('href', "profil.html");
    }

    let deletePost = document.createElement('i');
    deletePost.classList.add("fas", "fa-trash-alt", "mr-4", "text-danger", "cursorPointer");
    deletePost.setAttribute('onclick', `deletePublication(${postId})`);



    let newContentPost = document.createElement('p');
    newContentPost.setAttribute('id', `postContent_${postId}`)
    newContentPost.innerHTML = urlify(contentPost);
    newContentPost.classList.add("comment-text");

    let updatePost = document.createElement('i');
    updatePost.classList.add("fas", "fa-edit", "cursorPointer");
    updatePost.setAttribute('onclick', `updatePublication(this, ${postId}, 'postContent_${postId}')`);


    let newCreatedAt = document.createElement('p');
    newCreatedAt.textContent = moment(createdAt).fromNow();
    newCreatedAt.classList.add("text-muted", "col-12");



    userInfoPostDiv.appendChild(newNameUserPost);
    // soit l'utilsateur lui meme soit l'admin peuvent supprimer
    if (userId == postUserId || isAdmin) {
        userInfoPostDiv.appendChild(deletePost);
    }
    // uniquement l'utilisateur lui meme peut modifier
    if (userId == postUserId) {
        userInfoPostDiv.appendChild(updatePost);
    }
    userInfoPostDiv.appendChild(newCreatedAt);

    let publicationDiv = document.createElement('div');
    publicationDiv.classList.add("publication", "mt-2");

    publicationDiv.appendChild(newContentPost);

    if (imgPost) {
        let newImgPost = document.createElement('img');
        newImgPost.src = imgPost;
        newImgPost.setAttribute("width", "100%");
        newImgPost.setAttribute("height", "250px");
        newImgPost.setAttribute("alt", "image de la publication");
        publicationDiv.appendChild(newImgPost);
    }





    let commentDiv = document.createElement('div');
    commentDiv.classList.add("comment", "mt-5");



    let addCommentDiv = document.createElement('div');
    addCommentDiv.classList.add("add-comment", "p-2", "text-right");
    let textarea = document.createElement('textarea');
    textarea.classList.add("form-control", "shadow-none", "textarea", "col-12",);
    textarea.setAttribute("placeholder", `Ecrivez un commentaire`);
    textarea.setAttribute("id", `commentPost_${postId}`);
    textarea.setAttribute("aria-label", "commentaire");

    let btnCommenter = document.createElement('button');
    btnCommenter.textContent = "Commenter";
    btnCommenter.setAttribute('type', 'button');
    btnCommenter.setAttribute('id', 'btnCommenter');
    btnCommenter.classList.add("btn", "btn-sm", "shadow-none", "mt-2");
    btnCommenter.setAttribute('onclick', `sendToServerCommentaire(${postId}, 'commentPost_${postId}')`);



    addCommentDiv.appendChild(textarea);
    addCommentDiv.appendChild(btnCommenter);




    postDetailDiv.appendChild(userInfoPostDiv);
    postDetailDiv.appendChild(publicationDiv);
    postDetailDiv.appendChild(commentDiv);
    postDetailDiv.appendChild(addCommentDiv);


    let postcontainerDiv = document.createElement('div');
    postcontainerDiv.classList.add("post-container", "shadow", "row", "m-1", "mb-5");
    postcontainerDiv.appendChild(imageUserPostDiv);
    postcontainerDiv.appendChild(postDetailDiv);

    return { postDiv: postcontainerDiv, commentDiv: commentDiv };
}


// envoyer une requette GET à l'API(web service) pour récupérer les données des publication 
function showAllPublications(userId, isAdmin) {
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
                let { postDiv, commentDiv } = creatPost(post.User.img, post.User.firstname + ' ' + post.User.lastname, post.createdAt, post.image, post.content, post.id, post.User.id, userId, isAdmin);
                showAllCommentaires(commentDiv, post.Commentaires, userId, isAdmin);
                publication.appendChild(postDiv);
            }


        })
        .catch(erreurCatche => console.log(`il y a une erreur ${erreurCatche.message}`));
}





//  Envoyer les valeurs du commentaire a l'api
function sendToServerCommentaire(id, idTextArea) {

    let content = document.getElementById(idTextArea).value;

    if (!content) {
        return
    }

    let data = {
        content: content,
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
function createComment(img, user, createdAt, content, commentId, commentUserId, userId, isAdmin) {

    let imgComment = document.createElement('img');
    imgComment.src = img;
    imgComment.classList.add("profile-photo-sm", "col-1", "p-0", "mr-3");
    imgComment.setAttribute("alt", "photo de profil");


    let textDiv = document.createElement('div');
    textDiv.classList.add("col-11", "row", "textDiv", "rounded", "mb-2", "p-2", "d-flex", "flex-column");

    let infoDiv = document.createElement('div');
    infoDiv.classList.add("d-flex", "flex-row");

    let userComment = document.createElement('a');
    userComment.textContent = user;
    userComment.classList.add("textBleu", "p-0", "col-5")
    if (userId == commentUserId) {
        userComment.setAttribute('href', "profil.html");
    }


    let createdAtComment = document.createElement('p');
    createdAtComment.textContent = moment(createdAt).fromNow();
    createdAtComment.classList.add("date", "p-0", "m-0", "col-5");


    let deleteComment = document.createElement('i');
    deleteComment.classList.add("fas", "fa-trash-alt", "text-danger", "cursorPointer", "trash", "col-1");
    deleteComment.setAttribute('onclick', `deleteCommentaire(${commentId})`);



    infoDiv.appendChild(userComment);
    infoDiv.appendChild(createdAtComment);
    if (userId == commentUserId || isAdmin) {
        infoDiv.appendChild(deleteComment);
    }

    let ContentComment = document.createElement('p');
    ContentComment.classList.add("m-0");
    ContentComment.textContent = content;
    textDiv.appendChild(infoDiv);
    textDiv.appendChild(ContentComment);

    let commentDiv = document.createElement('div');
    commentDiv.classList.add("row");
    commentDiv.appendChild(imgComment);
    commentDiv.appendChild(textDiv);

    return commentDiv;
}
// envoyer une requette GET à l'API(web service) pour récupérer les données des commentaires
function showAllCommentaires(commentDiv, comments, userId, isAdmin) {
    for (let comment of comments) {
        let commentaire = createComment(comment.User.img, comment.User.firstname + ' ' + comment.User.lastname, comment.createdAt, comment.content, comment.id, comment.User.id, userId, isAdmin);
        commentDiv.appendChild(commentaire);
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

// visiualiser l'image avant de l'envoyer au serveur
function loadFile(event) {
    let image = document.getElementById('imgPreview');
    image.src = URL.createObjectURL(event.target.files[0]);
    image.setAttribute("alt", "image de la publication ");
    image.setAttribute("width", "100%");
    image.setAttribute("height", "500px");
};

// chercher les liens dans le text et le remplacer par une balise a link pour pouvor l'ouvrir dans une nouvelle onglet
function urlify(text) {
    var urlRegex = /(https?:\/\/[^\s]+)/g;
    return text.replace(urlRegex, function (url) {
        return "<a target=_blank href='" + url + "'>" + url + "</a>";
    });
}


//déconnexion 
const btnDeconnexion = document.getElementById("btnDeconnexion");
btnDeconnexion.addEventListener('click', () => {
    localStorage.removeItem('user')
    window.location = 'connexion.html';
});

