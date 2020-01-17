$(function(){

    const URL_API = "http://greenvelvet.alwaysdata.net/kwick/api/";

    let userId,
        token,
        toasted = new Toasted({ 
        position : 'top-center',
        theme : 'alive',
        fullWidth : true,
        duration: 2000,
    });

    // Check API State
    function getApiPing(){
        $.ajax({
            url: `${URL_API}ping`,
            method: "GET",
            dataType : "jsonp",
        })
        .done(function(response){
            let data = JSON.stringify(response);
            console.log(data);
        })
        .fail(function(error){
            console.log(error);
        });
    }
    getApiPing();


    // INSCRIPTION
    function signUp(evt){
        evt.preventDefault();
       
        let signUpUser = $('#username-signup').val(),
            signUpPw = $('#password-signup').val();
        
        const SIGNUP_API = `${URL_API}signup/${signUpUser}/${signUpPw}`;

        $.ajax({
            url: SIGNUP_API,
            method: "GET",
            dataType : "jsonp",
        })
        .done(function(response){
            if(response.result.status === "done"){
                // console.log("Inscription réussie");
                // console.log(response);
                let data = response.result;
                token = data.token;
                userId = data.id;
                
                const idStorage = window.localStorage.setItem("id", userId);

                toasted.show(data.message);
                $('.logInContainer').show("slow");
                $('.signUpContainer').hide("slow");
            }
        })
        .fail(function(error){
            toasted.show("Veuillez remplir les deux champs");
        });
    }


    // CONNEXION  
    function logIn(evt){
        evt.preventDefault();

        let loginUser = $('#username-login').val(),
            loginPw = $('#password-login').val();
        
        const LOGIN_API = `${URL_API}login/${loginUser}/${loginPw}`;
        console.log(LOGIN_API);

        $.ajax({
            url: LOGIN_API,
            method: "GET",
            dataType : "jsonp",
        })
        .done(function(response){
            if(response.result.status === "done"){
                let data = response.result;
                token = data.token;  
                userId = data.id;  
                // console.log(data);

                const tokenStorage = window.localStorage.setItem("token", token);
                const idStorage = window.localStorage.setItem("id", userId);
                const usernameStorage = window.localStorage.setItem("username", loginUser);
                const userStorage = window.localStorage.getItem("username");

                $(".logInContainer" ).hide( "slow", function() {
                    toasted.show(data.message);
                });

                $('.messaging').css('display', 'flex'); 
                $('.log-out').show();
                $('.home').hide();
                $('.users-list p').empty();
                $('.users-list').append('<p>' + userStorage + '</p>');
                getMessages();
                usersList();
            }
            if(response.result.status === "failure"){
                toasted.show(response.result.message); 
            }
        })
        .fail(function(error){
            // console.log(error);
            toasted.show("Identifiant et/ou mot de passe incorrect"); 
        });
    }


    // DECONNEXION
    function logOut(){
           
        const LOGOUT_API = `${URL_API}logout/${token}/${userId}`;
        console.log(LOGOUT_API);
        
        token = window.localStorage.getItem("token");
        userId = window.localStorage.getItem('id');
        userName = window.localStorage.getItem('username');
    
        $.ajax({
            url: LOGOUT_API,
            method: "GET",
            dataType : "jsonp",
        })
        .done(function(response){
            if(response.result.status === "done"){
                // console.log(response);
                // console.log("déconnexion réussie");
                window.localStorage.removeItem('token');
                window.localStorage.removeItem('id');
                window.localStorage.removeItem('username');

                $('.registration').show("slow");
                $('.signUpContainer').hide("slow");
                $('.logInContainer').hide("slow");
                $('.messaging').hide("slow");
                $('.log-out').hide('slow');
                toasted.show("Déconnexion réussie");

            }
        })
        .fail(function(error){
            toasted.show("Une erreur est survenue");
            // console.log(error);
        });
    }

    // GET USERS LIST
    function usersList(){
        
        const USERS_LIST = `${URL_API}user/logged/${token}`;
        // console.log(USERS_LIST);
        let users;

        $.ajax({
            url: USERS_LIST,
            method: "GET",
            dataType : "jsonp",
        })
        .done(function(response){
            if(response.result.status === "done"){
                users = response.result.user;
                $('#users').empty(); //Empty userList to update
                for (let i = 0; i < users.length; i++) {
                    $("#users").append('<div class="user"><img class="circle" src="assets/img/green-circle.png" alt="Utilisateur connecté"><p>' + users[i] + '</p></div>');
                    // console.log(users[i]);
                }
            }
        })
        .fail(function(error){
            // console.log(error);
            toasted.show("Une erreur est survenue");
        });
    }

    // GET MESSAGES function
    function getMessages(){
        let timestamp = 0;

        const MESSAGES_API = `${URL_API}talk/list/${token}/${timestamp}`;
        // console.log(MESSAGES_API);
        
        const userStored = window.localStorage.getItem('username');

        $.ajax({
            url: MESSAGES_API,
            method: "GET",
            dataType : "jsonp",
        })
        .done(function(response){
            if(response.result.status === "done"){
                console.log(response);

                let messages = response.result.talk;

                for( let i = 0; i < messages.length; i++){

                    let time = messages[i].timestamp;
                    date = new Date(time * 1000);
                    
                    if(userStored == messages[i].user_name){
                        
                    $('.chat').append('<div class="sent received"><p>' + messages[i].user_name + '</p><p>' + messages[i].content + '</p><p>' + date.toLocaleDateString([], { year: "2-digit", month: "2-digit", day: "numeric", hour: '2-digit', minute: '2-digit' }) + '</p</div>');
                    } else {
                    $('.chat').append('<div class="received"><p>' + messages[i].user_name + '</p><p>' + messages[i].content + '</p><p>' + date.toLocaleDateString([], { year: "2-digit", month: "2-digit", day: "numeric", hour: '2-digit', minute: '2-digit' }) + '</p</div>');
                    }
                }
                $(".chat").scrollTop($(".chat")[0].scrollHeight);
            }
        })
        .fail(function(error){
            console.log(error);
            toasted.show("Une erreur est survenue");
        });
    }

    function sendMessage(evt){
        evt.preventDefault();

        let sendMessage = $('.textField input').val();
        const encodedMessage = encodeURIComponent(sendMessage);
        const MESSAGES_TO_API = `${URL_API}say/${token}/${userId}/${encodedMessage}`;
        // console.log(MESSAGES_TO_API);
    
        $.ajax({
            url: MESSAGES_TO_API,
            method: "GET",
            dataType : "jsonp",
        })
        .done(function(response){
            if(response.result.status === "done"){
                // console.log(response);
                getMessages();
            }
            toasted.show("Message envoyé"); 
        })
        .fail(function(error){
            // console.log(error);
            toasted.show("Veuillez saisir au moins 1 caractère."); 
        })
        .always(function(){
            $('.textField input').val("");
        });
    }
    
    $('.form-signup').on('submit', signUp);
    $('.form-login').on('submit', logIn);
    $('.textField').on('submit', sendMessage);
    $('.log-out').on('click', logOut);
    
    // Refresh Messages onclick prefered as setInterval every 5s to prevent multiple unwanted call to API
    $('.refresh-btn').on('click',  function() {
        getMessages();
        $(".refresh-btn svg").toggleClass("refresh-rotation");
        toasted.show("Mise à jour du chat !");
    });

    // Display UsersList
    $('.users-list_icon').on('click', () => {
        $("#users").toggle("slow", usersList);
    });
    
    // Home Connexion
    $('.btn-login').on('click', () => {
        $('.home').show();
        $('.logInContainer').show("slow");
        $('.registration').hide("slow");
    });
    // Home Inscription
    $('.btn-signup').on('click', () => {
        $('.home').show();
        $('.signUpContainer').show("slow");
        $('.registration').hide("slow");
    });

    $('.home').on('click', () => {
        $('.logInContainer').hide("slow");
        $('.signUpContainer').hide("slow");
        $('.registration').show("slow");
        $('.home').hide();
    });
});
