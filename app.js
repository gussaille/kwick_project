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
        
        const LOGIN_API = `${URL_API}/login/${loginUser}/${loginPw}`;
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
        })
        .fail(function(error){
            console.log(error);
        });
    }

    // Récupérer la liste des utilisateurs
    function usersList(evt){
        evt.preventDefault();
        
        const USERS_LIST = `${URL_API}/user/logged/${userToken}`;
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

    $('.form-signup').on('submit', signUp);
    $('.form-login').on('submit', logIn);

    $('.users-list_icon').on('click', usersList);

});