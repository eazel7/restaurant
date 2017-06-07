require('angular')
.module(
    (module.exports = 'restaurant.notiications'),
    [
    ]
)
.run(
    function ($window) {
        $window.Notification.requestPermission();        
    }
)
.service(
    'NotificationsService',
    function ($window) {
        return {
            showNotification: function (message) {
                var notification = new Notification(message);

                notification.onclick = function () {
                    notification.close();
                }
            }
        };
    }
)