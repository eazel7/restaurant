require('angular')
    .module(
    (module.exports = 'restaurant.kitchen.settings'),
    [
        require('angular-material'),
        require('angular-material-icons'),
        require('angular-ui-router'),
        require('../../base/speech')
    ]
    )
    .config(
    function ($stateProvider) {
        $stateProvider.state({
            'name': 'settings',
            'url': '/settings',
            'resolve': {
                'ipAddresses': function (SettingsService) {
                    return SettingsService.getIpAddresses();
                }
            },
            'views': {
                '@': {
                    'template': require('./default.html'),
                    'controllerAs': 'settings',
                    'controller': function (SpeechService, SettingsService, $scope, ipAddresses) {
                        var ctrl = this;

                        this.ipAddresses = ipAddresses;

                        this.volume = SettingsService.get('volume', 100);
                        this.readOrderOutLoud = SettingsService.get('readOrderOutLoud', false);
                        this.playBell = SettingsService.get('playBell', true);

                        this.voices = SpeechService.getVoices();

                        $scope.$on('voiceschanged', () => {
                            this.voices = SpeechService.getVoices();
                        });

                        this.voice = SettingsService.get('voice', this.voices.filter(function (voice) {
                            return voice.lang.indexOf('es') === 0;
                        })[0]);
                        
                        $scope.$watch(function () { return ctrl.readOrderOutLoud; }, function (readOrderOutLoud) {
                            SettingsService.set('readOrderOutLoud', readOrderOutLoud);
                        });
                        
                        $scope.$watch(function () { return ctrl.playBell; }, function (playBell) {
                            SettingsService.set('playBell', playBell);
                        });
                        
                        $scope.$watch(function () { return ctrl.volume; }, function (volume) {
                            SettingsService.set('volume', volume);
                        });

                        $scope.$watch(function () { return ctrl.voice; }, function (voice) {
                            SettingsService.set('voice', voice);
                        });
                    }
                }
            }
        })
    }
    )