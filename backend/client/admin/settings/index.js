require('angular')
    .module(
    (module.exports = 'restaurant.settings'),
    [
        require('./service'),
        require('../printer/service'),
        require('angular-material'),
        require('angular-ui-router')
    ]
    )
    .config(function ($stateProvider) {
        $stateProvider.state({
            name: 'settings',
            url: '/settings',
            resolve: {
                shopName: function (SettingsService) {
                    return SettingsService.get('shop-name');
                },
                location: function (SettingsService) {
                    return SettingsService.get('location');
                },
                ticketHeader: function (SettingsService) {
                    return SettingsService.get('ticket-header');
                },
                printerDevice: function (SettingsService) {
                    return SettingsService.get('printer-device');
                },
                printers: function (PrinterService) {
                    return PrinterService.listDevices();
                },
                refreshPrinters: function (PrinterService, printers) {
                    return () => {
                        PrinterService
                        .listDevices()
                        .then(
                            (devices) => {
                                printers.splice(0, printers.length);

                                devices.forEach((newDevice) => printers.push(newDevice));
                            }
                        );
                    };
                },
                scanPrinters: function (PrinterService) {
                    return () => PrinterService.startScan();
                },
                settings: function (shopName, location, printerDevice, ticketHeader) {
                    return {
                        shopName: shopName || '',
                        location: location || {},
                        printerDevice: printerDevice || '',
                        ticketHeader: ticketHeader || ''
                    }
                }
            },
            views: {
                'top-toolbar@': {
                    template: require('./top-toolbar.html'),
                    controllerAs: 'toolbar',
                    controller: function ($q, settings, SettingsService, $state, scanPrinters) {
                        this.scanPrinters = scanPrinters;
                        
                        this.save = function () {
                            $q.all([
                                SettingsService.set('shop-name', settings.shopName),
                                SettingsService.set('location', settings.location),
                                SettingsService.set('printer-device', settings.printerDevice),
                                SettingsService.set('ticket-header', settings.ticketHeader)
                            ])
                            .then(function () {
                                $state.reload();
                            });
                        }
                    }
                },
                '@': {
                    template: require('./default.html'),
                    controllerAs: 'ctrl',
                    controller: function (settings, printers, $interval, refreshPrinters) {
                        this.settings = settings;
                        this.printers = printers;

                        $interval(() => {
                            refreshPrinters();
                        }, 5000);
                    }
                }
            }
        })  
    });