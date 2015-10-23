// Start the main app logic.
requirejs(['Account', 'Transactions', 'Transaction'], function (Account, Transactions, Transaction) {

  console.log("hell");
  var transactions = new Transactions();
  var account = new Account("david", transactions);
  console.log(account.accountName);
  
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
    
    $(document).on('click', '#AccountSummaryLI', function(event){
      initBankingApp();
   });
  
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
    
    $(document).on('click', "#confirmTransaction", function(event) {
      var userFromEmail = currentUser.email;
      var userFromPassword = currentUser.password;
      var _type = $('#addTransactionType').val();
      var _recipient = $('#addTransactionRecipient').val();
      var _description = $('#addTransactionDescription').val();
      var _amount = $('#addTransactionAmount').val();
      var newTransaction = new Transaction(new Date(), _description, _amount, _recipient, _type);
      
      $.ajax("postTransaction?userFromEmail=" + userFromEmail + "&userFromPassword=" + userFromPassword + "&transaction=" + JSON.stringify(newTransaction), {
          success: function(data, textStatus, jqXHR){
            if (data==="Error: User Not Found") {
              shakeForm("#transactionTable");
            } else if (data==="Error: Incorrect Credentials") {
              shakeForm("#transactionTable");
            } else if (data === "Error persisting changes to recipient, transaction canceled") {
              console.log(data);
            } else if (data === "Error persisting changes to your account, transaction canceled") {
              console.log(data);
            } else {
              currentUser = JSON.parse(data);
              initBankingApp();
            }
          },
    
          error: function(jqXHR, textStatus, errorThrown){
            alert("Server Error Occured");
            console.log(errorThrown);
            console.log(textStatus);
          }
        }); // end AJAX call to postTransaction
    });  // end onclick Confirm Transaction
  
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
  
  function initBankingApp() {
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
    var emailRegex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    //var userRegex = /\w\w{2,16}[^+,:;=|\' <>^()\[\]\\/\{\}-]/;
    //var passwordRegex = /\w\w{8,16}[^+,:;=|' <>^()\[\]\\/\{\}-]/;

    if (!emailRegex.exec(email)) {
      console.log("email failed the test")
      regexResult = false;
    }
    // else if (!userRegex.exec(user)) {
    //   console.log("user failed the test")
    //   regexResult = false;
    // }
    // else if (!passwordRegex.exec(password)) {
    //   console.log("user failed the test")
    //   regexResult = false;
    // }

    return regexResult;
  }

}); //end requirejs function

