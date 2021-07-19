angular.module('dialogService', []).service('dialogService',
    ['$compile', '$http', '$rootScope', '$q',
        function ($compile, $http, $rootScope, $q) {

            var ms = this;

            this.open = function (newDialogId, scope, strTile, templateUrl, dialogOptions, isModal, isResizable, callback) {

                $http({
                    method: 'GET',
                    url: templateUrl
                }).then(function (success) {
                    ms.openWithTemplate(newDialogId, scope, strTile, success.data, dialogOptions, isModal, isResizable, callback);
                    scope.disabelButton = false;
                }, function (error) {
                    console.log(error);
                });
            }



            this.openWithTemplate = function (newDialogId, scope, strTile, template, dialogOptions, isModal, isResizable, callback) {

                scope.dialogOptions = dialogOptions;

                if (scope.dialogOptions != undefined) {
                    scope.dialogOptions.callback = callback;
                }


                var defaultOptions = { name: strTile, width: "600px", height: "400px", top: "40px" };

                var dialogHTML = document.createElement('div');
                dialogHTML.className = "bp-window";
                dialogHTML.id = newDialogId;

                var height = (document.body.scrollHeight / 2) + 250;

                if (isModal == undefined) {
                    isModal = false;
                }

                var titleContainer = document.createElement('div');
                titleContainer.className = "bp-dialog-title";
                var innerHTML = '<div class="bp-dialog-name">' + defaultOptions.name + '</div><div class="bp-dialog-buttonset">' +
                    '<div class="close-dialog" onclick="CloseBPDialog(\'' + newDialogId + '\')"></div>';

                if (isModal == false) {
                    innerHTML = innerHTML +
                        '<div class="maximize-dialog" onclick="MaximizeBPDialog(\'' +
                        newDialogId +
                        '\')"></div>' +
                        '<div class="minimize-dialog" onclick="MinimizeBPDialog(\'' +
                        newDialogId +
                        '\')"></div>';
                }

                titleContainer.innerHTML = innerHTML + '</div>';

                dialogHTML.appendChild(titleContainer);

                var dialogContent = document.createElement('div');
                // dialogContent.className = "bp-dialog-content custom-scroll";

                dialogHTML.appendChild(dialogContent);

                var dialogHeight = height - 55;

                var n = template.search("appendscrolltodialog");

                var isDirective = false;
                if (n > 0) // if template is a directive
                {
                    isDirective = true;
                    template = template.slice(0, n) + " maxheight=" + dialogHeight + " " + template.slice(n);

                }

                dialogContent.innerHTML = template;
                dialogContent.style.maxHeight = height + "px";
                dialogContent.id = newDialogId + "_content";

                //Սահմանում ենք dialog click ֆունկցիան
                dialogHTML.onmousedown = function () {
                    BPWindowClick(this);
                };

                dialogHTML.setAttribute('data-dialog-name', defaultOptions.name);

                dialogHTML.style.top = defaultOptions.top;
                dialogHTML.style.left = "calc(50% - " + defaultOptions.width + "/2)";

                if (isModal == true) {
                    dialogHTML.setAttribute('data-modal', "true");
                    dialogHTML.style.zIndex = "5001";
                    if (document.querySelectorAll('.bp-dialog-overlay').length == 0) {
                        var modalOverlay = document.createElement('div');
                        modalOverlay.className = "bp-dialog-overlay";
                        modalOverlay.style.display = "block";
                        document.body.appendChild(modalOverlay);
                    }
                    else {
                        $('.bp-dialog-overlay').css("display", "block");
                    }
                }
                else {
                    dialogHTML.setAttribute('data-modal', "false");
                }

                //Ավելացնում ենք DOM-ում
                document.body.appendChild(dialogHTML);

                if (!isDirective) {
                    if ($("#" + newDialogId + " .menu-bar").next()[0] != undefined) {
                        $("#" + newDialogId + " .menu-bar").next()[0].className = "bp-dialog-content custom-scroll";
                        $("#" + newDialogId + " .menu-bar").next()[0].style.maxHeight = dialogHeight + "px";
                    }
                    else {
                        dialogContent.className = "bp-dialog-content custom-scroll";
                    }


                }

                $(".bp-dialog-content").mCustomScrollbar({
                    theme: "rounded-dark",
                    scrollButtons: {
                        scrollAmount: 200,
                        enable: true
                    },
                    mouseWheel: {
                        scrollAmount: 200
                    }
                });


                var containmentTopY = 10;
                var containmentBottomY = document.body.scrollHeight - (dialogHTML.offsetHeight - 20);
                var containmentBottomX = document.body.scrollWidth - (dialogHTML.offsetWidth + 10);
                $('#' + newDialogId).draggable({ handle: ".bp-dialog-title", containment: [0, containmentTopY, containmentBottomX, containmentBottomY] });


                // $('#' + newDialogId).draggable({ handle: ".bp-dialog-title",containment: 'body' });

                var modalEl = angular.element(dialogHTML);

                // Initialize our dialog structure
                var dialog = { scope: null, ref: null };

                // Create a new scope, inherited from the parent.
                dialog.scope = $rootScope.$new();
                dialog.scope.callback = callback;
                for (prop in scope.params) {
                    dialog.scope[prop] = scope.params[prop];
                }


                var dialogLinker = $compile(modalEl);
                dialog.ref = $(dialogLinker(dialog.scope));

                dialogHTML.onmousedown();

            }
        }
    ]);



