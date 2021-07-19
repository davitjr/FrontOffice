app.controller("PopUpCtrl", ['$scope', 'dialogService', function ($scope, dialogService) {


    $scope.msgOkDialog = function () {
        CloseBPDialog('ok');
        if ($scope.path != undefined) {
            var url = location.origin.toString();
            window.location.href = url + '/' + $scope.path;
        }
    }



    $scope.openWindow = function (url, title, id, callbackFunction) {
        $scope.disabelButton = true;
        if ($scope.$root.openedView.includes(id + '_isOpen') != true) {
            $scope.$root.openedView.push(id + '_isOpen');
            var dialogOptions = {
                callback: function () {
                    if (dialogOptions.result !== undefined) {
                        cust.mncId = dialogOptions.result.whateverYouWant;
                    }
                },
                result: {}
            };

            dialogService.open(id, $scope, title, url, dialogOptions, undefined, undefined, callbackFunction);
        }
        else {
            $scope.disabelButton = true;
        }

    };

    $scope.openWindowWithTemplate = function (template, title, id, callbackFunction) {

        if ($scope.$root.openedView.includes(id + '_isOpen') != true) {
            $scope.$root.openedView.push(id + '_isOpen');
            template = '<' + template + ' appendscrolltodialog  dialogid=' + id + ' >' + '</' + template + '>';

            if (!document.getElementById(id)) {
                var dialogOptions = {
                    callback: function () {
                        if (dialogOptions.result !== undefined) {
                            cust.mncId = dialogOptions.result.whateverYouWant;
                        }
                    },
                    result: {}
                };

                dialogService.openWithTemplate(id,
                    $scope,
                    title,
                    template,
                    dialogOptions,
                    undefined,
                    undefined,
                    callbackFunction);
            }
        }
    };



}]);
