require('angular')
.module(
    (module.exports = 'restaurant.file-button'),
    [
        require('angular-material')
    ]
)
.directive(
    'fileButton',
    function ($timeout) {
        return {
            transclude: true,
            restrict: 'E',
            scope: {
                fileRead: '&'
            },
            template: require('./template.html'),
            link: function ($scope, $element, $attrs) {
                var fileElement = require('jquery')($element).find('input[type=file]');
                
                fileElement.on("change",function(event){
                    var file = fileElement[0].files[0];
                    var fr = new FileReader();

                    fr.onload = function () {
                        var url = fr.result;
                        var data = url.slice(url.lastIndexOf(','));
                        
                        $scope.fileRead({
                            $url: url,
                            $data: data
                        });

                        $timeout(function () {
                            $scope.$apply();
                        })
                    }
                    fr.readAsDataURL(file);
                })
                $scope.click = function () {
                    fileElement.trigger('click');
                };
            }
        }
    }
)