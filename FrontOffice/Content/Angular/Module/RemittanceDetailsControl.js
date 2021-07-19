angular.module('RemittanceDetailsControl', [])
    .directive('remittancewholedetails', [function () {
        return {
            restrict: 'E',
            scope: {
                remittancedetails: '=',
                close: '&'
            },
            templateUrl: '../Content/Controls/RemittanceDetails.html',
            link: function (scope, element, attr) {
                $(".modal-dialog").draggable();
               
                scope.closeRemittanceWholeDetailsModal = function () {
                    scope.close();
                };
            },

              
            controller: ['$scope', '$element', 'dateFilter',  function ($scope, $element, dateFilter) {


                }
                ]
            };
        }]);


