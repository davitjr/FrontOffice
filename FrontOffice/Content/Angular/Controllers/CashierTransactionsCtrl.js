app.controller('CashierTransactionsCntr', ['$scope', 'cashierTransactionsService', 'infoService', 'loginService', 'orderService', '$confirm', 'casherService',
    function ($scope, cashierTransactionsService, infoService, loginService, orderService , $confirm, casherService){
        $scope.searchOrders = {
            OperationFilialCode :'',
            CustomerNumber: '',
            LastName: '',
            FirstName: '',
            MiddleName: '',
            OrgName:'',
            DocumentNumber: '',
            AccountNumber: '',
            CardNumber: '',
            LoanNumber: '',
            Id:'',
            CurrentState: '',
            DateFrom: new Date(),
            DateTo: new Date(),
        };
        // Գործարքներ
        $scope.transactions = [];
        // Մասնաճյուղեր
        $scope.branches = {};
        $scope.fillialCode = '';
        $scope.isLoading = false;

        //ստանալ մասնաճյուղերի անվանումները և կոդերը
        $scope.getFilialList = function () {
            const data = infoService.GetFilialList()
                .then( res => {
                    $scope.branches = res.data;
                }, 
                function () {
                    alert('Error getFilialList');
                })
        };

        //փնտրել օգտագործողի մասնաճյուղի կոդը
        $scope.getUserFilialCode = function () {
            const data = casherService.getUserFilialCode()
                .then( ref => {
                    $scope.searchOrders.OperationFilialCode = ref.data;
                    $scope.fillialCode = ref.data;
                    $scope.getFilialList();
                }, function () {
                    alert('Error Accounts');
                })
                
        };
      

        $scope.transactionsType = cashierTransactionsService.getTransactionsType()
        
        // փնտրել գործարքները
        $scope.search = function(){
            if($scope.message !== ''){
                $scope.message = '';
            }
            $scope.isLoading = true;
            const test = cashierTransactionsService.getTransactions($scope.searchOrders)
                .then(res => {
                    $scope.transactions = res.data;

                    // paging data
                    $scope.transactionsForPaging = res.data;
                    $scope.paging.total = $scope.transactionsForPaging.length;


                    var a = ($scope.criteria.page - 1) * $scope.criteria.pagesize;
                    var b = $scope.criteria.page  * $scope.criteria.pagesize;
    
                    $scope.transactionsForPaging = $scope.transactionsForPaging.slice( a, b );   
                    $scope.paging.showing = $scope.transactionsForPaging.length;

                    paging($scope.criteria.page, $scope.criteria.pagesize, $scope.paging.total);
                    console.log($scope.transactions,   $scope.transactionsForPaging);
                    $scope.isLoading = false;
                    if($scope.transactions.length <= 0) {
                        $scope.message = 'Գործարքներ չկան'
                    }else{
                        $scope.message = '';
                    }
                },
                function(){
                    // ShowToaster($scope.error[0].Description, 'error');
                    console.log('Error in loading transactions')
                })
                .then($scope.reduce)
                .then($scope.pageItemReduce)
                .catch(err => console.log(err));
        }

        $scope.searchInit = function(){
            return new Promise((res, rej) => {
                setTimeout(() => {
                    res($scope.search())
                },500)
            })
        }

        $scope.enter = (event) => {
            if(event.keyCode === 13){
                $scope.search();
            }
        }

        // հաշվարկել ցուցակում գտնվող գումարների հանրագումարը ըստ տեսակի
        $scope.reduce = function() {
            $scope.reducearm = cashierTransactionsService.filtered($scope.transactions, 'AMD');
            $scope.reduceusd = cashierTransactionsService.filtered($scope.transactions, 'USD' );  
            $scope.reduceeur = cashierTransactionsService.filtered($scope.transactions, 'EUR' );  
            $scope.reducerur = cashierTransactionsService.filtered($scope.transactions, 'RUR' );            
        }
        $scope.pageItemReduce = function(){
            $scope.reducearmForPage = cashierTransactionsService.filtered($scope.transactionsForPaging, 'AMD');
            $scope.reduceusdForPage = cashierTransactionsService.filtered($scope.transactionsForPaging, 'USD' );  
            $scope.reduceeurForPage = cashierTransactionsService.filtered($scope.transactionsForPaging, 'EUR' );  
            $scope.reducerurForPage = cashierTransactionsService.filtered($scope.transactionsForPaging, 'RUR' );  
        }

        // սիլկա դեպի հաճախորդների պրոդուկտներ
        $scope.serveCustomer = function (customerNumber) {
            const data = cashierTransactionsService.getCustomerAllProducts(customerNumber)
                .then(function (result) {
                    if (result.data && customerNumber !== 0) {
                        let i = window.open();
                        var url =  location.origin.toString();
                        i.location.href = url + '#!/allProducts';                    
                    }
                }, function () {
                    alert('Error in routing')
                })
                .catch(err => console.log(err));
        }
 
        // հաստատել գործարքը
        $scope.confirmOrder = function (orderID, customerNumber) {
            if (orderID != null && orderID != undefined && customerNumber != null && customerNumber != undefined) {
                $confirm({ title: 'Շարունակե՞լ', text: 'Կատարել գործարքը' })
                    .then(function () {
                        showloading();
                        let data = cashierTransactionsService.confirmOrder(orderID, customerNumber);
                        data.then(function (res) {                         
                            hideloading();
                            if (validate($scope, res.data) && res.data.ResultCode != 5) {
                                // $scope.orders[$scope.selectedRow].Quality = 30;
                                // $scope.orders[$scope.selectedRow].QualityDescription = 'Կատարված է';
                                console.log($scope.transactions, $scope.searchOrders);
                                ShowToaster('Գործարքը կատարված է', 'success') ;
                                $scope.search()
                            }
                            else {
                                $scope.showError = true;
                                ShowToaster($scope.error[0].Description, 'error');
                            }
                        }, function () {
                            hideloading();
                            ShowToaster('Տեղի ունեցավ սխալ', 'error');
                            alert('Error confirmOrder');
                        })
                        .catch(err => console.log(err))
                    });
                      
            };
        };

        $scope.criteria = {
            page: 1,
            pagesize: 10,
            // desc : false
        };
    
        $scope.paging = {
            total : 0,
            totalpages: 0,
            showing: 0,
            pagearray: [],
            // pagingOptions: [10,20,30,40,50]
        };

        function paging(current , pagesize , total){
            

            var totalpages = Math.ceil(total/pagesize);
            $scope.paging.totalpages = totalpages;
            // clear it before playing
            $scope.paging.pagearray = [];
            if(totalpages <=1) return;
            
            if(totalpages <= 5){
                for(var i =1; i<= totalpages; i++)
                    $scope.paging.pagearray.push(i);
            }
            
            if(totalpages > 5){
                if(current <=3){        
                    for(var i =1; i<= 5; i++)
                        $scope.paging.pagearray.push(i);
                
                        $scope.paging.pagearray.push('...');
                        $scope.paging.pagearray.push(totalpages);
                        $scope.paging.pagearray.push('Next');
                }
                else if(totalpages - current <=3){
                    $scope.paging.pagearray.push('Prev');
                    $scope.paging.pagearray.push(1);
                    $scope.paging.pagearray.push('..');
                        for(var i =totalpages - 4; i<= totalpages; i++)
                        $scope.paging.pagearray.push(i);
                }
                else {
                    $scope.paging.pagearray.push('Prev');
                    $scope.paging.pagearray.push(1);
                    $scope.paging.pagearray.push('..');  
                    
                    for(var i = current - 2; i<= current + 2; i++)
                        $scope.paging.pagearray.push(i);
                        
                        $scope.paging.pagearray.push('...');
                        $scope.paging.pagearray.push(totalpages);
                        $scope.paging.pagearray.push('Next');
                }        
            }
        }  
          

        $scope.$watch('criteria', function(newValue, oldValue){
            if(!angular.equals(newValue, oldValue)){
                $scope.search();
            }
        }, true);

        $scope.$watch('searchOrders', function(newValue, oldValue ){
            if(!angular.equals(newValue, oldValue)){
                 $scope.criteria.page = 1;
            }
        }, true);

        $scope.Prev = function(){
            if($scope.criteria.page >= 1)      
                $scope.criteria.page--;
        }
        
        $scope.Next = function(){
            if($scope.criteria.page < $scope.paging.totalpages)      
                $scope.criteria.page++;
        }
    }
])

