app.service("cashierTransactionsService", ['$http', function ($http) {

    this.getTransactions = (searchOrders) => {
        const response = $http({
            method: 'post',
            url: '/CashierTransactions/GetOrdersForCashRegister',
            data: JSON.stringify(searchOrders),
            dataType: 'json'
        })
        return response;
    } 



    this.getTransactionsType = () => {
        const transactions = [
            {name:'Կատարված գործարքներ', type: 30}, 
            {name: 'Ընթացիկ գործարքներ', type: 3}, 
            {name: 'Բոլորը', type: ''}
        ]
        return transactions
    }
    this.filtered = (arraY, Currency) => {
        return arraY.filter(arr => arr.Order.Currency === Currency)
        .reduce((acc, inc) => acc + inc.Order.Amount, 0)
    }


    this.getCustomerAllProducts = function (customerNumber) {
        var response = $http({
            method: "post",
            url: "/Login/CashierTransactionsToAllProducts",
            params: {
                customerNumber: customerNumber
            },

        });
        return response;
    }


    this.confirmOrder = function (orderID, customerNumber) { 
        var response = $http({
            method: "post",
            url: "/CashierTransactions/ConfirmOrder",
            params: {
                orderID: orderID,
                customerNumber: customerNumber
            }
        });
        return response;
    }
   
}])

