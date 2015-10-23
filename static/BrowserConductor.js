var currentUser = {};
$(document).ready(function(){
  $("#loginForm").submit(function(event){
    event.preventDefault();

    $.ajax("login?email="+$("#email").val()+"&password="+$("#password").val(),{
      success: function(data, textStatus, jqXHR){
        if(data==="Error: User Not Found"){
          shakeForm();
        }else if(data==="Error: Incorrect Credentials"){
          shakeForm();
        }else{
          currentUser = JSON.parse(data);
          initBankingApp();
        }
      },

      error: function(jqXHR, textStatus, errorThrown){
        alert("Server Error Occured");
      }
    });
  });

  $("#registerLink").click(function(event){
    $.ajax("htmlFragment?file=registration.html", {
      success: function(data, textStatus, jqXHR){
        $("#loginSidebar").empty();
        $("#loginSidebar").append(data);
      }
    });

  });

  $(document).on('submit', '#registrationForm', function(event){
    event.preventDefault();
    var user = $("#registerName").val();
    var email = $("#registerEmail").val();
    var password = $("#registerPassword").val();

    $.ajax("/persistNewUser?user="+user+"&email="+email+"&password="+password, {
      success: function(data, textStatus, jqXHR){
        if(data === "Success"){
          location.reload();
        }else{
          alert("User already exists, try a different email");
          $("#registerEmail").val("");
        }
      }
    });
  });

  $(document).on('click', "#registrationBackButton", function(event){
    location.reload();
  });
});

function shakeForm() {
   var l = 20;
   for( var i = 0; i < 10; i++ )
     $( "#loginForm" ).animate( {
         'margin-left': "+=" + ( l = -l ) + 'px',
         'margin-right': "-=" + l + 'px'
      }, 50);
}

function initBankingApp(){
  //Clear the login screen
}
