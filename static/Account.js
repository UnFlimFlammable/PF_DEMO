if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define(function (require) {

    var subscribable = require("./subscribers.js");
    var Transactions = require("./Transactions.js");
    var Transaction = require("./Transaction.js")
    /** @constructor */
    var Account = function(
      /** !string */ accountName,
      /** !Transactions */ transactions) {

        var id = Account.idCounter++;
        var accountType = "Basic Checking";
        var accountName = accountName;
        var transactions = transactions;
        var balance = 50;

        transactions.add(new Transaction(new Date(), "Initial Deposit", 50, "Me", "Deposit"));
        Object.defineProperty(this, "id", {
            get: function () { return id; }
        });

        Object.defineProperty(this, "accountName", {
            get: function () { return accountName; },
            set: function(value) {
                if(typeof value === 'string'){
                    accountName = value;
                } else {console.log('Account.accountName argument was not typeof string');}
                this.notify("changed", this);
            }
        });

        Object.defineProperty(this, "accountType", {
            get: function () { return accountType; },
            set: function(value) {
                if(typeof value === 'string'){
                    accountType = value;
                } else {console.log('Account.accounType argument was not typeof string');}
                this.notify("changed", this);
            }
        });

        Object.defineProperty(this, "transactions", {
            get: function () { return transactions; },
            set: function(
                /** !Transactions */ value) {
                if(value instanceof Transactions){
                    transactions = value;
                } else {console.log('Account.transactions argument was not typeof Transactions');}
                this.notify("changed", this);
            }
        });

        Object.defineProperty(this, "balance", {
            get: function () { return balance; }
        });

        this.toJSON = function () {
            return {
                id: this.id,
                accountType: this.accountType,
                accountName: this.accountName,
                transactions: this.transactions,
                balance: this.balance
            };
        };

      subscribable(this);

  	} //end Account() {} class

  	Account.idCounter = 0;
  	Account.prototype.minBalance = 0;
  	Account.prototype.maxBalance = 50000;

  	Account.prototype.toString = function () {
  		var string;
  		for (var i in this) {
  			if(this.hasOwnProperty(i)){
  				string = i + ":" + this[i] + "; ";
  			}
  		}
  		return string;
  	}


    // Account.prototype.addTransaction = function (
    // 	/** !Transaction */ transaction) {
    //     if(transaction instanceof Transcation) {
    //         this.transactions.push(transaction);
    //     } else {
    //         console.log("Account.addTransaction argument must be instanceof Transaction.")
    //     }
    //     this.notify("added", this);
    // }

    // Account.prototype.getIndexOfTransaction = function (
    //     /** !string */ transaction) {
    //     return this.transactions.indexOf(transaction);
    // }

    //THIS METHOD IS NOT CURRENTLY WORKING
    // Account.prototype.removeTransaction = function (
    // 	/** !Transaction */ transaction) {
    // 	this.transactions.splice(transactions.getIndexOfTransaction(transaction), 1);
    // }

    // Account.prototype.applyTransaction = function (
    // 	/** !Transaction */ transaction) {
    // 	this.balance += transaction.amount;
    // }

    // Account.prototype.rollbackTransaction = function (
    // 	/** !Transaction */ transaction) {
    // 	this.balance -= transaction.amount;
    // }

    //module.exports = Account;

    return Account;

});
