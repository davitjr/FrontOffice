app.controller('ModalCtrl', ['$scope', '$uibModal', function ($scope, $uibModal) {

    /// Օրինակ երե պետք է փոխանցել որևէ տվյալ
    // $scope.name = 'theNameHasBeenPassed';
    $scope.showModal = function (template, controller) {
        $scope.error = "";
        $scope.opts = {
            backdrop: true,
            backdropClick: true,
            dialogFade: false,
            keyboard: false,
            backdrop: 'static',
            templateUrl: template, //Օրինակ` '../DepositOrder/PersonalDepositOrder',
            controller: controller,//Օրինակ`  'DepositOrderCtrl',
            scope: $scope,
            resolve: {} // empty storage
        };

        /// Օրինակ երե պետք է փոխանցել որևէ տվյալ
        //$scope.opts.resolve.item = function () {
        //    return angular.copy({ name: $scope.name }); // pass name to Dialog
        //}

        var modalInstance = $uibModal.open($scope.opts);

        $scope.closemodal = function () {
            modalInstance.close();
        };


        //modalInstance.result.then(function () {
        //    //on ok button press 
        //}, function () {
        //    //on cancel button press
        //    console.log("Modal Closed");
        //});
    };





}]);