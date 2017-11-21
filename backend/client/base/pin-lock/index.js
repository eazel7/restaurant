require('angular')
    .module(
    (module.exports = 'pin-lock'),
    [
        require('angular-material'),
        require('angular-material-icons')
    ]
    )
    .service(
    'PinLockService',
    function ($mdDialog, $document, $q) {
        return {
            askPin: function (checkFunction, canCancel) {
                return $mdDialog.show({
                    parent: 'body',
                    template: require('./pin-dialog.html'),
                    controllerAs: 'dialog',
                    fullscreen: true,
                    controller: function ($mdDialog, $mdToast) {
                        var ctrl = this;
                        var numbers = this.numbers = ['*', '*', '*', '*'];

                        this.enter = function (digit) {
                            var index = this.numbers.indexOf('*')
                            
                            numbers[index] = digit;
                        };

                        this.canCAncel = function () {
                            return !!canCancel;
                        }

                        this.cancel = function () {
                            $mdDialog.cancel();
                        }

                        this.clear = function () {
                            ctrl.numbers.splice(0, ctrl.numbers.length, '*', '*', '*', '*');
                        };

                        this.confirm = function () {
                            ctrl.working = true;
                            
                            checkFunction(this.numbers.join(''))
                            .then(function (result) {
                                $mdDialog.hide(result);
                            }, function (err) {
                                ctrl.working = false;
                                
                                $mdToast.show($mdToast.simple().textContent(err || 'Error'));

                                ctrl.numbers.splice(0, ctrl.numbers.length, '*', '*', '*', '*');                                
                            });
                        }
                    }
                })
            }
        };
    }
    )