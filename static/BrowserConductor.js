// define(['require', 'Account.js'], function (require) {
//     var Account = require('Account.js');
// });
// require(["Account.js", "Address.js", "Transaction.js", "Transactions.js", "User.js"], 
// function (Account, Address, Transaction, Transactions, User) {

//   console.log("hell");
  // var account = new Account();
  // console.log(account.accountType);
  
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
    console.log($(row).attr("AccountJSON"));
    var account = JSON.parse($(row).attr("AccountJSON"));
    $.ajax("htmlFragment?file=accountSummary.html",{
      success: function(data, textStatus, jqXHR){
        $("#accountSummary").empty();
        $("#accountSummary").append(data);


        $("#accountSummaryBalance").text();
        var table = $("#transactionTable");
          account.transactions.reverse();
          for(var c = 0; c < account.transactions.length; c++){
            $("#transactionTable").append("<tr></tr>");
            var row = $("#transactionTable tr:last");
            var transaction = account.transactions[c];

            row.append("<td>" + transaction.kind + "</td>");
            row.append("<td>" + transaction.recipient + "</td>");
            row.append("<td>" + transaction.description + "</td>");
            row.append("<td>" + transaction.amount + "</td>");
            row.append("<td>" + transaction.date + "</td>");
          }

          //Append new Column Row to the
          table.append("<tr id='addTransactionControls'></tr>");
          var row = $("#transactionTable tr:last");
          //Way append new Transaction
          row.append("<td class='tableControl' colspan='5'>New Transaction</td>");

      }
    });
  });

  $(document).on('submit', '#registrationForm', function(event){
    event.preventDefault();
    var user = $("#registerName").val();
    var email = $("#registerEmail").val();
    var password = $("#registerPassword").val();

    if(validateRegistrationForm(user, email, password)) {
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

  $(document).on('click', '.tableControl', function(event){
    var controlTD = $(this);
    controlTD.remove();
    //Get the input fragment
    $.ajax("htmlFragment?file=addTransactionFormFragment.html", {
      success: function(data, textStatus, jqXHR){
        $("#addTransactionControls").append(data);
      }
    });

    //David, use this ajax call to post to the transaction

  });

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

//validates the Registration Form with Regex
function validateRegistrationForm(user, email, password) {
  var regexResult = true;

  var emailRegex = new RegExp("^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$");
  var userRegex = new RegExp("\w\w{2,16}[^+,:;=|' <>^()\[\]\\/\{\}-]");
  var passwordRegex = new RegExp("\w\w{8,16}[^+,:;=|' <>^()\[\]\\/\{\}-]");

  if (!emailRegex.exec(email)) {
    console.log("email failed the test");
    regexResult = false;
  } else if (!userRegex.exec(user)) {
    console.log("user failed the test");
    regexResult = false;
  } else if (!passwordRegex.exec(password)) {
    console.log("user failed the test");
    regexResult = false;
  } else if (!regexResult) {
    shakeForm();
  }

  return regexResult;
}

// });

