require('angular')
.module(
    (module.exports = 'restaurant.pictures-carouse'),
    [
        require('angular-material'),
        require('angular-material-icons')
    ]
)
.directive(
    'picturesCarousel',
    function () {
        return {
            transclude: {
                'buttons': '?buttons'
            },
            restrict: 'E',
            scope: {
                current: '=',
                pictures: '=',
                mapPictureUrl: '&'
            },
            template: require('./template.html'),
            controller: function ($scope) {
                $scope.$watch(function () {
                    return $scope.pictures;
                }, function (pictures) {
                    if (!$scope.current || pictures.indexOf($scope.current) === -1) {
                        $scope.current = pictures[0];
                    }
                }, true);

                $scope.prev = function () {
                    var pictures = $scope.pictures;

                    var index = pictures.indexOf($scope.current);
                    
                    if (index === 0) $scope.current = pictures[pictures.length - 1];
                    else $scope.current = pictures[index - 1];
                }

                $scope.next = function () {
                    var pictures = $scope.pictures;
                    var index = pictures.indexOf($scope.current);

                    if (index < (pictures.length - 1)) $scope.current = pictures[index + 1];
                    else $scope.current = pictures[0];
                };

                $scope.$watch(function () {
                    return $scope.current;
                }, function (current) {
                    if (!current) return;

                    $scope.currentUrl = $scope.mapPictureUrl({$picture: current});
                });
            }
        }
    }
)