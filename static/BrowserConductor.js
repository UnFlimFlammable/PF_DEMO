var currentUser = {};
var selectedAccount = {};
$(document).ready(function(){
  $("#loginForm").submit(function(event){
    event.preventDefault();

    $.ajax("login?email="+$("#email").val()+"&password="+$("#password").val(),{
      success: function(data, textStatus, jqXHR){
        if(data==="Error: User Not Found"){
          shakeForm("#loginForm");
        }else if(data==="Error: Incorrect Credentials"){
          shakeForm("#loginForm");
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
        $(document).prop('title', 'Register | Epiphany');

      }
    });

  });

  $(document).on('click', '.account', function(event){
    var row = this;
    console.log(this)
    $.ajax("htmlFragment?file=accountSummary.html",{
      success: function(data, textStatus, jqXHR){
        $("#accountSummary").empty();
        $("#accountSummary").append(data);
        var balance = 0;


        $("#accountSummaryBalance").text();
        var table = $("#transactionTable");
        for(var i = 0; i < currentUser.accounts.length; i++){
          for(var c = 0; c < currentUser.accounts[i].transactions.length; c++){
            $("#transactionTable").append("<tr></tr>");
            var row = $("#transactionTable tr:last");
            var transaction = currentUser.accounts[i].transactions[c];

            row.append("<td>" + transaction.kind + "</td>");
            row.append("<td>" + transaction.recipient + "</td>");
            row.append("<td>" + transaction.description + "</td>");
            row.append("<td>" + transaction.amount + "</td>");
            row.append("<td>" + transaction.date + "</td>");

            //TODO Find some way to pass an account into this, look into sending it back in the header
          }
        }
      }
    });
  });

  $(document).on('submit', '#registrationForm', function(event){
    event.preventDefault();
    var user = $("#registerName").val();
    var email = $("#registerEmail").val();
    var password = $("#registerPassword").val();
    
    var validationResult = validateRegistrationForm(user, email, password);
    
    if(validationResult) {
      $.ajax("/persistNewUser?user="+user+"&email="+email+"&password="+password, {
        success: function(data, textStatus, jqXHR){
          if(data === "Success"){
            location.reload();
          }else{
            alert("User already exists, try a different email");
            $("#registerEmail").val("");
          }
        }
      });//end persistNewUser Ajax call
    }
  }); //end .on('submit'), '#registrationForm'
  


  $(document).on('click', "#registrationBackButton", function(event){
    location.reload();
  });
}); //end document.ready()

function shakeForm(selector) {
   var l = 20;
   for( var i = 0; i < 10; i++ )
     $( selector ).animate( {
         'margin-left': "+=" + ( l = -l ) + 'px',
         'margin-right': "-=" + l + 'px'
      }, 50);
}

function initBankingApp(){
  //Clear the login screen
  $("#loginSidebar").remove();
  $.ajax("htmlFragment?file=bankingApp.html", {
    success: function(data, textStatus, jqXHR){
      $("body").append(data);
      $(document).prop('title', 'Accounts | Epiphany');
      
      //Populate the thing
      $(".welcomeUser").html("Welcome, <br>" + currentUser.userName);

      var summary = $("#accountSummary");
      
      //Lay Out Table Header
      summary.append("<table class = 'mainTable' id='accountTable'><thead> "+
      "<tr> <td> Account Name </td> <td>Account Type </td> <td> Account Balance </td> </tr>"+
      "</thead></table>");

      var accountTable = $("#accountTable");
      for(var i = 0; i < currentUser.accounts.length; i++){
        var account = currentUser.accounts[i];
        accountTable.append("<tr class='account'>");
        var row = $("#accountTable tr:last");
        row.append("<td>" + account.accountName + "</td>");
        row.append("<td>" + account.accountType + "</td>");
        row.append("<td>" + account.balance + "</td>");
        row.attr("accountJSON", JSON.stringify(account));
      }
      
      //Event bindings etc. here

    }
  });
} //end initBankingApp

function validateRegistrationForm(user, email, password) {
  
}
