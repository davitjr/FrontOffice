app.controller("TokensDistributionCtrl", ['$scope', '$filter', '$http', 'infoService', 'TokensDistributionService', function ($scope, $filter, $http, infoService, TokensDistributionService) {


    $scope.selectedFilialTokens = [];
    $scope.selectedCenterTokens = [];
    $scope.fff = function () { console.log("HI") };

    $scope.checkCenterTokensTitle = "Նշել բոլորը";
    $scope.checkFilialTokensTitle = "Նշել բոլորը";

    $scope.getFilialList = function () {
        var Data = infoService.GetFilialList();
        Data.then(function (ref) {
            $scope.filialList = ref.data;
        }, function () {
            alert('Error getFilialList');
        });
    };


    $scope.getUnusedTokensForCenter = function (isSearch) {
        if (!isSearch) {
            $scope.centerFrom = "";
            $scope.centerTo = "";
        }
        var Data = TokensDistributionService.getUnusedTokensByFilialAndRange($scope.centerFrom, $scope.centerTo,22000);
        Data.then(function (tok) {
            $scope.centerTokens = tok.data;
            if ($scope.centerTokens.length > 1)
            {
                $scope.centerFrom = $scope.centerTokens[$scope.centerTokens.length - 1];
                $scope.centerTo = $scope.centerTokens[0];
            }
        }, function () {
            alert('Error getUnusedTokensForCenter');
        });
    };

    $scope.getUnusedTokensForFilial = function (isSearch) {
        if (!isSearch)
        {
            $scope.filialFrom = ""; 
            $scope.filialTo = "";
        }

        if ($scope.filialCode == null || $scope.filialCode == undefined ) {
            $scope.filialCode = 22000;
        }
        var Data = TokensDistributionService.getUnusedTokensByFilialAndRange($scope.filialFrom, $scope.filialTo, $scope.filialCode);
        Data.then(function (tok) {
            $scope.filialTokens = tok.data;
            if ($scope.filialTokens.length > 1) {
                $scope.filialFrom = $scope.filialTokens[$scope.filialTokens.length - 1];
                $scope.filialTo = $scope.filialTokens[0];
            }
        }, function () {
            alert('Error getUnusedTokensForFilial');
        });
    };

    $scope.checkAllCentrlTokens = function () {

        if ($scope.isCheckcenterTokens == undefined || $scope.isCheckcenterTokens == false) {
            $scope.isCheckcenterTokens = true;
            $scope.selectedCenterTokens = $scope.centerTokens;
            $scope.checkCenterTokensTitle = "Հրաժարվել նշումներից";

        }
        else {

            $scope.isCheckcenterTokens = false;
            $scope.selectedCenterTokens = "";
            $scope.checkCenterTokensTitle = "Նշել բոլորը";
        }

        
    }

    $scope.checkAllFilialTokens = function () {
        if ($scope.isCheckfilialTokens == undefined || $scope.isCheckfilialTokens == false) {
            $scope.isCheckfilialTokens = true;
            $scope.selectedFilialTokens = $scope.filialTokens;
            $scope.checkFilialTokensTitle = "Հրաժարվել նշումներից";
        }
        else
        {
            $scope.isCheckfilialTokens = false;
            $scope.selectedFilialTokens = "";
            $scope.checkFilialTokensTitle = "Նշել բոլորը";
        }
    }

    $scope.moveUnusedTokens = function (isFromtCenter) {
       
        if (isFromtCenter && $scope.filialCode == undefined) {
            showMesageBoxDialog('Տեղափոխման մասնաճյուղը ընտրված չէ', 'errorDialog');
            return;
        }
        if ($scope.selectedCenterTokens.length == 0 && $scope.selectedFilialTokens.length == 0 ) {
            showMesageBoxDialog('Տեղափոխման համար ընրված չեն տոկեներ', 'errorDialog');
            return;
        }
        if (isFromtCenter) {
            var Data = TokensDistributionService.moveUnusedTokens($scope.filialCode, $scope.selectedCenterTokens);
        }
        else
        {
            var Data = TokensDistributionService.moveUnusedTokens(22000, $scope.selectedFilialTokens);
        }
        showloading();
        Data.then(function () {
            $scope.getUnusedTokensForCenter();
            $scope.getUnusedTokensForFilial();

            $scope.isCheckfilialTokens = false;
            $scope.isCheckcenterTokens = false;
            $scope.selectedFilialTokens = "";
            $scope.selectedCenterTokens = "";
            hideloading();
        }, function () {
            alert('Error moveUnusedTokens');
        });
        


    }
}]);