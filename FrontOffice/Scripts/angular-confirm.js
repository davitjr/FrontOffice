/*
 * angular-confirm
 * http://schlogen.github.io/angular-confirm/
 * Version: 1.1.0 - 2015-14-07
 * License: Apache
 */
angular.module('angular-confirm', ['ui.bootstrap'])
  .controller('ConfirmModalController', ['$scope', '$uibModalInstance', 'data', function ($scope, $uibModalInstance, data) {
    $scope.data = angular.copy(data);

    $scope.ok = function () {
      $uibModalInstance.close();
    };

	  $scope.cancel = function () {
      $uibModalInstance.dismiss('cancel');
    };

  }])
  .value('$confirmModalDefaults', {
        backdrop: 'static',
        template: '<style>  .modal-content { width: 500px; height: auto;margin-top: 300px; } </style>' +
            '<div class="bp-window">' +
            '<div class="bp-dialog-title bp-green" >' +
            '<div class="bp-dialog-name">{{data.title}}</div><div class="bp-dialog-buttonset">' +
            '<div class="close-dialog" ng-click="cancel()"></div></div> </div>' +
            '<div class="bp-dialog-content custom-scroll" > <table style="width:auto"><tbody><tr><td><div style="text-align:center; display:inline-block;"><img src="/Content/newTheme/Images/Menu/invisible.png" class="bp-dg-type-icon bp-warning"' + '></div></td><td><div id="dialog-content-container" class="dialog-message-text"> {{data.text}}</div></td></tr></tbody></table></div>' +
            '<div >' +
            '<div class="popup_buttons" style="padding-bottom:10px">' +
            '<button ng-if="$root.SessionProperties.IsCalledFromHB == true && $root.SessionProperties.IsCalledForHBConfirm == true" type="submit" class="btn btn-sm btn-success" ng-click="ok()" style="margin-right:20px;"><span class="glyphicon glyphicon-ok" ></span>&nbsp;OK</button>' +
            '<button ng-if="$root.SessionProperties.IsCalledFromHB != true || ($root.SessionProperties.IsCalledFromHB == true && $root.SessionProperties.IsCalledForHBConfirm == false)" type="submit" class="btn btn-sm btn-success" ng-click="ok()" style="margin-right:20px;"><span class="glyphicon glyphicon-ok" ></span>&nbsp;Այո</button>' +
            '<button ng-if="$root.SessionProperties.IsCalledFromHB != true || ($root.SessionProperties.IsCalledFromHB == true && $root.SessionProperties.IsCalledForHBConfirm == false)" type="submit" class="btn btn-sm btn-danger" ng-click="cancel()"><span class="glyphicon glyphicon-remove" ></span>&nbsp;Ոչ</button>' + '</div>' +
            '</div>' +
            '</div>',
        controller: 'ConfirmModalController',
        defaultLabels: {
            title: 'Confirm',
            ok: 'OK',
            cancel: 'Cancel'
        }
    })
  .factory('$confirm', ['$uibModal', '$confirmModalDefaults', function ($uibModal, $confirmModalDefaults) {
    return function (data, settings) {
      settings = angular.extend($confirmModalDefaults, (settings || {}));

      data = angular.extend({}, settings.defaultLabels, data || {});

      if ('templateUrl' in settings && 'template' in settings) {
        delete settings.template;
      }

      settings.resolve = {
        data: function () {
          return data;
        }
      };
      return $uibModal.open(settings).result;
    };
  }])
  .directive('confirm', ['$confirm', function ($confirm) {
    return {
      priority: 1,
      restrict: 'A',
      scope: {
        confirmIf: "=",
        ngClick: '&',
        confirm: '@',
        confirmSettings: "=",
        confirmTitle: '@',
        confirmOk: '@',
        confirmCancel: '@'
      },
      link: function (scope, element, attrs) {


        element.unbind("click").bind("click", function ($event) {

          $event.preventDefault();

          if (angular.isUndefined(scope.confirmIf) || scope.confirmIf) {

            var data = {text: scope.confirm};
            if (scope.confirmTitle) {
              data.title = scope.confirmTitle;
            }
            if (scope.confirmOk) {
              data.ok = scope.confirmOk;
            }
            if (scope.confirmCancel) {
              data.cancel = scope.confirmCancel;
            }
            $confirm(data, scope.confirmSettings || {}).then(scope.ngClick);
          } else {

            scope.$apply(scope.ngClick);
          }
        });

      }
    }
  }]);
