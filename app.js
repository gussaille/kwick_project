$(function(){
    const URL_API = "http://greenvelvet.alwaysdata.net/kwick/api/";
    let userId,
        userToken;

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
            console.log("Echec" + JSON.stringify(error));
        })
    }
    // getApiPing();

    // INSCRIPTION
    function signUp(evt){
        evt.preventDefault();

        let signUpUser = $('#username-signUp').val(),
            signUpPw = $('#password-signUp').val();
        
        const SIGNUP_API = `${URL_API}/signup/${signUpUser}/${signUpPw}`;
        console.log(SIGNUP_API);

        $.ajax({
            url: SIGNUP_API,
            method: "GET",
            dataType : "jsonp",
        })
        .done(function(response){
            console.log("Inscription réussie")
            let data = JSON.stringify(response);
            console.log(data);
        })
        .fail(function(error){
            console.log("Echec" + JSON.stringify(error));
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
            console.log(response.result);
            userToken = response.result.token;
            userId = response.result.id;

            $(".logInContainer" ).hide( "slow", function() {
            //toasted connexion réussie à rajouter re       sponse.result.message
            });
            $('.messaging').css('display', 'flex'); 
            getMessages();
        })
        .fail(function(error){
            console.log(error);
        });
    }

    // Récupérer la liste des utilisateurs
    function usersList(evt){
        evt.preventDefault();
        
        const USERS_LIST = `${URL_API}user/logged/${userToken}`;
        console.log(USERS_LIST);
    
        $.ajax({
            url: USERS_LIST,
            method: "GET",
            dataType : "jsonp",
        })
        .done(function(response){
            if(response.result.status === "done"){
                let users = response.result.user;
                for (let i = 0; i < users.length; i++) {
                    $("#users").append('<p>' + users[i] + '</p>'); // REVOIR PROBLEME DE DOUBLON AU CLIC
                }
            }
            console.log(response.result);
        })
        .fail(function(error){
            console.log(error);
        });
    }

    function getMessages(){
        
        const MESSAGES_API = `${URL_API}talk/list/${userToken}/0`;
        console.log(MESSAGES_API);
    
        $.ajax({
            url: MESSAGES_API,
            method: "GET",
            dataType : "jsonp",
        })
        .done(function(response){
            console.log(response);
            let messages = response.result.talk;
            for( let i = 0; i < messages.length; i++){
                let time = messages[i].timestamp;
                date = new Date(time * 1000);

                $('.chat').append('<div class="received"><p>' + messages[i].user_name + '</p><p>' + messages[i].content + '</p><p>' + date.toLocaleDateString([], { year: "2-digit", month: "2-digit", day: "numeric", hour: '2-digit', minute: '2-digit' }) + '</p</div>');
            }
        })
        .fail(function(error){
            console.log(error);
        });
    }

    function sendMessage(evt){
        evt.preventDefault();
        let sendMessage = $('.textField input').val();
        const encodedMessage = encodeURIComponent(sendMessage);

        
        const MESSAGES_TO_API = `${URL_API}say/${userToken}/${userId}/${encodedMessage}`;
        console.log(MESSAGES_TO_API);
    
        $.ajax({
            url: MESSAGES_TO_API,
            method: "GET",
            dataType : "jsonp",
        })
        .done(function(response){;
            console.log(response);
            getMessages();
            //toasted message envoyé
        })
        .fail(function(error){
            console.log(error);
            //toasted "Le message doit comporter au moins un caractère"
        });
    }

    $('.form-signup').on('submit', signUp);
    $('.form-login').on('submit', logIn);
    $('.sendMessage').on('click', sendMessage);

    $('.users-list_icon').on('click', usersList);
});