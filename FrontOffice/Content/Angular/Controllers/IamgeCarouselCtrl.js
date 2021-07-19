app.controller("IamgeCarouselCtrl", ['$scope', function ($scope) {

    $scope.cropper = {};
    $scope.cropper.sourceImage = null;
    $scope.cropper.croppedImage = null;
    $scope.bounds = {};
    $scope.bounds.left = 50;
    $scope.bounds.right = 50;
    $scope.bounds.top = 50;
    $scope.bounds.bottom = 50;

    $scope.croppMode = false;

    $scope.DownloadIamge = function () {

        var currentIndex = $('#ImageCarousel li.active').index();

        if ($scope.slides[currentIndex].extension == 1) {
            window.saveAs($scope.slides[currentIndex].blob, "Attachment_" + $scope.customerNumber + ".jpeg");
        } else if ($scope.slides[currentIndex].extension == 2) {
            window.saveAs($scope.slides[currentIndex].blob, "Attachment_" + $scope.customerNumber + ".pdf");
        }
    };


    $scope.CropIamge = function () {
        var currentIndex = $('#ImageCarousel li.active').index();
        if ($scope.slides[currentIndex].extension == 1) {
            $scope.croppMode = true;
            $scope.cropper.sourceImage = $scope.slides[currentIndex].image;
        }

    };

    $scope.CancelCropIamge = function () {
        $scope.croppMode = false;
    };

    $scope.DownloadCroppedIamge = function () {

        $scope.arraybuffer = $scope.cropper.croppedImage;
        $scope.arraybuffer = $scope.arraybuffer.replace('data:image/jpeg;base64,', '');
        $scope.arraybuffer = $scope.arraybuffer.replace('data:image/png;base64,', '');
        $scope.arraybuffer = $scope.arraybuffer.replace('data:image/jpg;base64,', '');

        var binary = fixBinary(atob($scope.arraybuffer));
        var blob = new Blob([binary], { type: 'image/png' });
        var url = URL.createObjectURL(blob);

        window.saveAs(blob, "Attachment_" + $scope.customerNumber + ".png");
    }


    function fixBinary(bin) {
        var length = bin.length;
        var buf = new ArrayBuffer(length);
        var arr = new Uint8Array(buf);
        for (var i = 0; i < length; i++) {
            arr[i] = bin.charCodeAt(i);
        }
        return buf;
    };

    $scope.setNextImage = function (count) {

        var currentIndex = $('#ImageCarousel li.active').index();
        $('#' + currentIndex + '_slide').removeClass("active");
        $('#' + currentIndex + '_div_slide').removeClass("active");
        if (currentIndex == (count - 1)) {
            currentIndex = -1;
        }
        $('#' + (currentIndex + 1) + '_slide').addClass("active");
        $('#' + (currentIndex + 1) + '_div_slide').addClass("active");

    }

    $scope.setPrevImage = function (count) {
        var currentIndex = $('#ImageCarousel li.active').index();
        $('#' + currentIndex + '_slide').removeClass("active");
        $('#' + currentIndex + '_div_slide').removeClass("active");

        if (currentIndex == 0) {
            $('#' + (count - 1) + '_slide').addClass("active");
            $('#' + (count - 1) + '_div_slide').addClass("active");
        }
        else {
            $('#' + (currentIndex - 1) + '_slide').addClass("active");
            $('#' + (currentIndex - 1) + '_div_slide').addClass("active");
        }
    }

    $scope.setZoom = function (index) {
        $('#' + index + '_div_slide').zoom({ on: 'click' });
    }



}]);

