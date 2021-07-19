app.controller("HBTokenCtrl", ['$scope', 'hbTokenService', '$filter', '$http', 'infoService', function ($scope, hbTokenService, $filter, $http, infoService) {
    $scope.filter = 1;
    $scope.order = {};
    $scope.order.HBToken = {};
    $scope.order.HBToken.TokenSubType = "1";
    $scope.order.HBToken.TokenType = "3";
    $scope.order.HBToken.TokenNumber = "";
    $scope.error = [];
    $scope.order.HBToken.HBUser = {};
    $scope.disableLimit = false;
    
    $scope.tokenTypes = { 1: 'Տոկեն', 2: 'Մոբայլ տոկեն', 3: 'Մոբայլ բանկինգ' };
    $scope.checkSelectedUserInSchema = function () {
        var schema = JSON.parse(sessionStorage.getItem("hbApprovementSchema"));
        $scope.selectedUsersInSchema = false;
        for (var i = 0; i < schema.SchemaDetails.length; i++) {
            if (schema.SchemaDetails[i].Group.HBUsers != undefined)
            {
                for (var j = 0; j < schema.SchemaDetails[i].Group.HBUsers.length; j++) {
                    if (schema.SchemaDetails[i].Group.HBUsers[j].ID == $scope.selectedUser.ID) {
                        $scope.selectedUsersInSchema = true;
                        break;
                    }
                }
            }
            if ($scope.selectedUsersInSchema)
                break;
        }

    }
    if ($scope.selectedUser)
    {
        $scope.order.HBToken.HBUser.UserName = $scope.selectedUser.UserName;
        $scope.order.HBToken.HBUser.UserFullNameEng = $scope.selectedUser.UserFullNameEng;
        $scope.order.HBToken.HBUser.ID = $scope.selectedUser.ID;
        $scope.order.HBToken.HBUser.AllowDataEntry = $scope.selectedUser.AllowDataEntry;
        $scope.order.HBToken.HBUser.CustomerNumber = $scope.selectedUser.CustomerNumber;
        if (!$scope.order.HBToken.HBUser.AllowDataEntry) {
            $scope.order.HBToken.TransLimit = 0;
            $scope.order.HBToken.DayLimit = 0;
        }
        $scope.checkSelectedUserInSchema();

    }

    //Vorpeszi bacvox xmbagrman formayum ereva xmbagrvox token@ 
    if ($scope.editToken != undefined)
    {
        //$scope.order.HBToken = $scope.editToken;
        $scope.order.HBToken = angular.copy($scope.editToken);
        $scope.order.HBToken.TokenSubType = $scope.order.HBToken.TokenSubType.toString();
        $scope.order.HBToken.tokenNumberBeforeEdit = $scope.order.HBToken.TokenNumber; 

    }
    $scope.getHBToken = function () {
        var Data = hbTokenService.getHBToken($scope.hbtokenid);
        Data.then(function (tok) {
            $scope.hbToken = tok.data;
            $scope.loading = false;
        }, function () {
            $scope.loading = false;
            alert('Error getHBToken');
        });
    }
    //To Get All Records 
    $scope.getHBTokens = function () {
        $scope.loading = true;
        var Data = hbTokenService.getHBTokens($scope.hbuserid, $scope.filter);
        Data.then(function (tok) {
            $scope.hbtokens = tok.data;


            $scope.loading = false;
        }, function () {
            $scope.loading = false;
            alert('Error getHBUsers');
        });
    };

    $scope.validate = function () {

        $scope.error = [];

        if ($scope.$root.SessionProperties.CustomerType == 6 &&  !$scope.$parent.selectedUser.AllowDataEntry && ($scope.order.HBToken.TransLimit != 0 || $scope.order.HBToken.DayLimit != 0)) {
            $scope.error.push({
                Code: 1043, Description: 'Ֆիզիկական հաճախորդի դեպքում գործարքների իրականացում չունեցող ՀԲ օգտագործողի համար գործարքի և օրական սահմանաչափերը պետք է լինեն զրո:'
            });
        }
        if ($scope.$root.SessionProperties.CustomerType == 6 && $scope.$parent.selectedUser.AllowDataEntry && ($scope.order.HBToken.TransLimit == 0 || $scope.order.HBToken.DayLimit == 0)) {
            $scope.error.push({
                Code: 1044, Description: 'Ֆիզիկական հաճախորդի դեպքում գործարքների իրականացում ունեցող ՀԲ օգտագործողի համար գործարքի և օրական սահմանաչափերը պետք է լինեն զրոյից մեծ:'
            });
        }
        if ($scope.$root.SessionProperties.CustomerType != 6 && !$scope.selectedUsersInSchema && !$scope.$parent.selectedUser.AllowDataEntry && ($scope.order.HBToken.TransLimit != 0 || $scope.order.HBToken.DayLimit != 0)) {
            $scope.error.push({
                Code: 0, Description: 'Ոչ ֆիզիկական հաճախորդի դեպքում գործարքների իրականացում չունեցող ՀԲ օգտագործողների համար, որոնք ընդգրկված չեն որևէ հաստատման խմբում, գործարքի և օրական սահմանաչափերը պետք է լինեն 0:'
            });
        }
        if ($scope.$root.SessionProperties.CustomerType != 6 && ($scope.selectedUsersInSchema || $scope.$parent.selectedUser.AllowDataEntry) && ($scope.order.HBToken.TransLimit == 0 || $scope.order.HBToken.DayLimit == 0)) {
            $scope.error.push({
                Code: 0, Description: 'Ոչ ֆիզիկական հաճախորդի դեպքում գործարքների իրականացում ունեցող կամ որևէ հաստատման խմբում ընդգրկված ՀԲ օգտագործողների համար գործարքի և օրական սահմանաչափերը պետք է լինեն զրոյից մեծ:'
            });
        }
        if (Number($scope.order.HBToken.TransLimit) > Number($scope.order.HBToken.DayLimit)) {
            $scope.error.push({
                Code: 1036, Description: 'Գործարքի սահմանաչափը չի կարող մեծ լինել օրական սահմանաչափից:'
            });
        }
        if ($scope.$root.SessionProperties.UserId != 918 && $scope.$root.SessionProperties.CustomerType == 6 && Number($scope.order.HBToken.DayLimit) > 100000000) {
            $scope.error.push({
                Code: 0, Description: 'Ուշադրություն! Օրական սահմա­նաչափի առավելագույն արժեքը չի կարող գերազանցել 100.000.000 ՀՀ դրամը։'
            });
        }
        if ($scope.$root.SessionProperties.UserId != 918 && $scope.$root.SessionProperties.CustomerType != 6 && Number($scope.order.HBToken.DayLimit) > 1000000000) {
            $scope.error.push({
                Code: 0, Description: 'Ուշադրություն! Օրական սահմա­նաչափի առավելագույն արժեքը չի կարող գերազանցել 1.000.000.000 ՀՀ դրամը։'
            });
        }

        //Commented 4/20/2020 not actual code, validation is server side with procedure with new gemalto part
        //if ($scope.editToken == undefined)
        //{
        //    var gid1 = 0; var gid2 = 0; var gid3 = 0;

        //    for (var i = 0; i < $scope.$parent.selectedUser.tokens.length; i++) {
        //        if ($scope.$parent.selectedUser.tokens[i].Quality != 2) {
        //            switch ($scope.$parent.selectedUser.tokens[i].GID){
        //                case  '01':
        //                    gid1++;
        //                    break;
        //                case '02':
        //                    gid2++;
        //                    break;
        //                case "03":
        //                    gid3++;
        //                    break;
        //            }
        //        }
        //    }
        //    if($scope.order.HBToken.TokenType == 1){
        //        $scope.order.HBToken.GID = "01";
        //        if(gid1 > 0)
        //            $scope.error.push({
        //                Code: 0, Description: 'Նշված տեսակի տոկենների թույլատրելի քանակը արդեն լրացել է:'
        //            });
        //    }
        //    if($scope.order.HBToken.TokenType == 2 ||  $scope.order.HBToken.TokenType == 3){
        //        if(gid2 == 0)
        //            $scope.order.HBToken.GID = "02";
        //        else
        //            $scope.order.HBToken.GID = "03";
        //        if(gid2 + gid3 > 1 )
        //            $scope.error.push({
        //                Code: 0, Description: 'Նշված տեսակի տոկենների թույլատրելի քանակը արդեն լրացել է:'
        //            });
        //    }
        //}
        if ($scope.order.HBToken.TokenType == 1){
                $scope.order.HBToken.GID = "01";
         }
        else if ($scope.order.HBToken.TokenType == 2){
                    $scope.order.HBToken.GID = "02";
         }
        else if ($scope.order.HBToken.TokenType == 3) {
            $scope.order.HBToken.GID = "03";
        }
        if ($scope.error.length == 0)
            return true;
        else
            return false;
    }

    $scope.saveHBTokenOrder = function () {
        if (!$scope.validate())
            return false;
        switch ($scope.order.HBToken.TokenType) {
            case 1: case "1": { $scope.order.HBToken.TokenTypeDescription = 'Տոկեն'; break; }
            case 2: case "2": { $scope.order.HBToken.TokenTypeDescription = 'Մոբայլ տոկեն'; break; }
            case 3: case "3": { $scope.order.HBToken.TokenTypeDescription = 'Մոբայլ բանկինգ'; break; }
        }
        $scope.order.HBToken.Action = 1;
        $scope.order.HBToken.Quality = 3;
        if ($scope.order.HBToken.newInserted || $scope.order.HBToken.newInserted==undefined) {
            $scope.order.HBToken.ID = $scope.lastHBTokenId;
        }
        //$scope.order.HBToken.HBUserID = $scope.selectedUser.ID;
        //$scope.setLastHBTokenId();
        var data = { token: $scope.order.HBToken };

        if ($http.pendingRequests.length == 0) {
            $scope.$parent.callback(data);
            CloseBPDialog('newhbtoken');
        }
        else {
            return ShowMessage('Կատարվել է տվյալների թարմացում: Խնդրում ենք կրկին սեղմել <<Պահպանել>> կոճակը:', 'error');
        }

    }

    $scope.editHBToken = function () {
        if (!$scope.validate())
            return;
        $scope.order.HBToken.Action = 2;

        if ($scope.order.HBToken.TokenType == 1) {
            $scope.order.HBToken.TokenTypeDescription = 'Տոկեն';
        }
        else if ($scope.order.HBToken.TokenType == 2) {
            $scope.order.HBToken.TokenTypeDescription = 'Մոբայլ տոկեն';
        }
        else {
            $scope.order.HBToken.TokenTypeDescription = 'Մոբայլ բանկինգ';
        }
        var data = { token: $scope.order.HBToken };
        if ($http.pendingRequests.length == 0) {
            $scope.$parent.callback(data);
        }
        CloseBPDialog('edithbtoken');
    }

    $scope.getTokenNumbers = function (isChangeTokenType) {
        if ($scope.editToken && !$scope.editToken.newInserted) {
            $scope.hbTokenNumbers = [];
            $scope.hbTokenNumbers[0] = $scope.editToken.TokenNumber;
            $scope.order.HBToken.TokenNumber = Object.values($scope.hbTokenNumbers)[0];
        }
        else
        {
            Data = hbTokenService.getHBTokenNumbers($scope.order.HBToken.TokenType);
            Data.then(function (tokNumber) {
                $scope.hbTokenNumbers = tokNumber.data;                    
                $scope.removeUsedTokenNumbers(isChangeTokenType);            
                if ($scope.editToken && $scope.editToken.newInserted && !isChangeTokenType)
                    $scope.order.HBToken.TokenNumber = $scope.editToken.TokenNumber;
                else
                    $scope.order.HBToken.TokenNumber = Object.values($scope.hbTokenNumbers)[0];
            }, function () {
                alert('Error getTokenNumbers');
            });
        }
    }

    $scope.changeTokenType = function (olduser) {
        var copy = angular.copy($scope.deepCopySubTypesOfTokens);
        $scope.hbTokenNumbers = undefined;
        if (olduser) {
            $scope.getTokenNumbers(true);
        }
        if ($scope.order.HBToken.TokenType == 1)
        {
            $scope.subTypesOfTokens = $scope.deepCopySubTypesOfTokens;
        }
        else
        {
            $scope.subTypesOfTokens = copy;
            //Այն դեպքում երբ ընտրված չե ՛մոբայլ բանկինգ՛ հեռացվում են վերջին 2 տոկենի ենթատեսակները
            delete $scope.subTypesOfTokens["4"];
            delete $scope.subTypesOfTokens["5"];
            $scope.order.HBToken.TokenNumber = "";   //Սոֆտ տոկենի համար մենք չենք ընտրում, ավտոմատ գեներացվում է gemalto - ում
        }
        //defult @ntrum e arajin element@
        $scope.order.HBToken.TokenSubType = Object.keys($scope.subTypesOfTokens)[0];
    }

    $scope.getHBTokenOrder = function (orderId) {
        var Data = hbTokenService.getHBTokenOrder(orderId);

        Data.then(function (tok) {
            $scope.order = tok.data;
            $scope.order.RegistrationDate = $filter('mydate')($scope.order.RegistrationDate, "dd/MM/yyyy");
            $scope.order.OperationDate = $filter('mydate')($scope.order.OperationDate, "dd/MM/yyyy");
        }, function () {
            alert('Error getHBTokenOrder');
        });
    };

    $scope.getSubTypesOfTokens = function () {
        var Data = infoService.getSubTypesOfTokens();
        Data.then(function (rep) {
            $scope.subTypesOfTokens = rep.data;
        }, function () {
            alert('Error getSubTypesOfTokens');
        });

    }


    $scope.sortSubTypesOfTokens = function () {

        var props = Object.keys($scope.subTypesOfTokens);
        var customerTokensCount = $scope.getCustomerTokensCount();
        var deepCopySubTypesOfTokens = angular.copy($scope.subTypesOfTokens);
        if ($scope.$root.SessionProperties.CustomerType == 6)
        {
            if (customerTokensCount == 0)
            {
                for (var i = 1; i < props.length; i++)
                {
                    if ($scope.subTypesOfTokens.hasOwnProperty(props[i]))
                        if (i != 2 ) {
                            delete $scope.subTypesOfTokens[props[i]];
                        }
                }

                if ($scope.order.HBToken.TokenType == 1) {
                    $scope.subTypesOfTokens["4"] = deepCopySubTypesOfTokens["4"];
                    $scope.subTypesOfTokens["5"] = deepCopySubTypesOfTokens["5"];
                }



            }
            else if (customerTokensCount > 0)
            {
                if ($scope.subTypesOfTokens.hasOwnProperty(props[0]))
                {
                    if ($scope.editToken == undefined)
                    {
                        delete $scope.subTypesOfTokens[props[0]];
                    }
                    if ($scope.editToken == undefined)
                    {
                        //Ayn depqum erb bacvum nor token avelacnelu forman,default @ntrvum e arajin entatesak@
                        $scope.order.HBToken.TokenSubType = Object.keys($scope.subTypesOfTokens)[0];
                    }

                }
            }
        }
        if ($scope.$root.SessionProperties.CustomerType != 6)
        {
            if (customerTokensCount == 0) {
                for (var i = 1; i < props.length; i++) {
                    if ($scope.subTypesOfTokens.hasOwnProperty(props[i]))
                        if (i != 2) {
                            delete $scope.subTypesOfTokens[props[i]];
                        }
                }
                if ($scope.order.HBToken.TokenType == 1) {
                    $scope.subTypesOfTokens["4"] = deepCopySubTypesOfTokens["4"];
                    $scope.subTypesOfTokens["5"] = deepCopySubTypesOfTokens["5"];
                }

            }
            else if (customerTokensCount == 1)
            {
                if($scope.subTypesOfTokens.hasOwnProperty(props[1]))
                {
                    delete $scope.subTypesOfTokens[props[1]];
                }
                if ($scope.subTypesOfTokens.hasOwnProperty(props[1])) {
                    delete $scope.subTypesOfTokens[props[3]];
                }
                if ($scope.subTypesOfTokens.hasOwnProperty(props[1])) {
                    delete $scope.subTypesOfTokens[props[4]];
                }
            }
            else if (customerTokensCount > 1)
            {
                if ($scope.editToken == undefined) {
                    delete $scope.subTypesOfTokens[props[0]];
                    //Ayn depqum erb bacvum nor token avelacnelu forman,default @ntrvum e arajin entatesak@
                    $scope.order.HBToken.TokenSubType = Object.keys($scope.subTypesOfTokens)[0];

                }
            }
        }

        if ($scope.deepCopySubTypesOfTokens == undefined) {
            $scope.deepCopySubTypesOfTokens = angular.copy($scope.subTypesOfTokens);
        }

        if ($scope.editToken != undefined)
        {
            if ($scope.editToken.TokenType != 1)
            {
                //Այն դեպքում երբ ընտրված չե մոբայլ բանկինգ հեռացվում են վերջին 2 տոկենի ենթատեսակները
                delete $scope.subTypesOfTokens["4"];
                delete $scope.subTypesOfTokens["5"];
            }
        }
        $scope.getTokenServiceFee();

    }

    $scope.setLastHBTokenId = function () {
        if ($scope.editToken != undefined && $scope.editToken.newInserted == false) {
            $scope.lastHBTokenId = -1;
        }
        var Data = infoService.getGlobalLastKeyNumber(74);
        Data.then(function(key) {

                $scope.lastHBTokenId = key.data;
            },
            function() {
                alert('error keynumber');
            });
    }



    $scope.getCustomerTokensCount = function () {
        var count = 0;
        for (var i = 0; i < $scope.hbusers.length; i++)
        {
            for (var j = 0; j < $scope.hbusers[i].tokens.length; j++)
            {
                if ($scope.hbusers[i].tokens[j].Quality!=2)
                    count++;
            }
        }
        return count;
    }

    $scope.getTokenServiceFee = function () {
        var Data = hbTokenService.getTokenServiceFee($scope.$root.SessionProperties.OperationDate,$scope.order.HBToken.TokenType, $scope.order.HBToken.TokenSubType);
        Data.then(function (result) {
            $scope.FeeAmount = result.data;
        }, function () {
            alert('Error getEntryDataPermissionServiceFee');
        });
    }

    $scope.removeUsedTokenNumbers = function (isChangeTokenType) {
        for (var i = 0; i < $scope.hbTokenNumbers.length; i++) {
            for (var j = 0; j < $scope.usedHBTokenNumbers.length; j++) {
                if ($scope.hbTokenNumbers[i] == $scope.usedHBTokenNumbers[j])
                    $scope.hbTokenNumbers.splice(i, 1);
            }
        }
        if ($scope.editToken != undefined && !isChangeTokenType)
        {
            $scope.hbTokenNumbers.unshift($scope.editToken.TokenNumber);
        }
    }
    $scope.initDefaultValues = function ()
    {
        if ($scope.$root.SessionProperties.CustomerType == 6 && $scope.$parent.selectedUser.AllowDataEntry && ($scope.hbApplication.isNewInsertedHBApplication || $scope.hbApplication.Quality == 1))
        {
            $scope.order.HBToken.TransLimit = 400000;
            $scope.order.HBToken.DayLimit = 400000;
            $scope.disableLimit = true;
        }
        
    }
}]);