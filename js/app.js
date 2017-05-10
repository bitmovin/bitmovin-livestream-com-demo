angular.module('livestreamBitmovin', [])
    .constant('AppConfig', {
        defaultPlayerConfig: {
            key: 'YOUR-BITMOVIN-PLAYER-LICENSE-KEY',
            source: {
                title: "Bitmovin Player v7",
                description: "Much livestream.com support, so many player API features, fully customizable UI, WOW ;)",
                poster: 'img/poster.jpg'
            },
            cast: {
                enable: true
            }
        },
        playerElementId: "player",
        livestreamApiBaseUrl: 'https://livestreamapis.com/v2',
        clientServerBaseUrl: 'http://localhost:9696/token'
    })
    .run(['PlayerService', 'LivestreamService', 'TokenService', 'AppConfig', function ($playerService, $livestreamService, $tokenService, appConfig) {
        $playerService.setup(appConfig.defaultPlayerConfig).then(function (playerInstance) {
            console.debug("Bitmovin Player successfully initialized!");
        }, function (error) {
            console.debug("An error occurred during the initialization!", error);
        });
    }
    ])
    .directive('upcomingEvents', ['LivestreamService',
        function (livestreamService) {
            return {
                restrict: 'E',
                templateUrl: 'templates/upcoming-events.html',
                controller: function ($scope) {
                    $scope.upcomingEvents = {};
                    $scope.total = 0;

                    livestreamService.getUpcomingEvents({
                        success: function (data) {
                            $scope.total = data.data.total || 0;
                            $scope.upcomingEvents = data.data.data || {};
                        },
                        error: function (data, status) {
                            console.log(status)
                        }
                    });
                }
            };
        }])
    .directive('draftEvents', ['LivestreamService',
        function (livestreamService) {
            return {
                restrict: 'E',
                templateUrl: 'templates/draft-events.html',
                controller: function ($scope) {
                    $scope.draftEvents = {};
                    $scope.total = 0;

                    livestreamService.getDraftEvents({
                        success: function (dataResponse) {
                            $scope.total = dataResponse.data.total || 0;
                            $scope.draftEvents = dataResponse.data.data || {};
                        },
                        error: function (dataResponse, status) {
                            console.log("Error while loading draft events!", dataResponse, status);
                        }
                    });

                }
            };
        }])
    .directive('event', ['LivestreamService', 'TokenService', 'PlayerService', 'AppConfig',
        function (livestreamService, tokenService, playerService, appConfig) {
            return {
                restrict: 'E',
                scope: {
                    event: '=event'
                },
                templateUrl: 'templates/event.html',
                controller: function ($scope) {
                    $scope.livestreamDetails = {};

                    livestreamService.getVideosFromEvent($scope.event.id, {
                        success: function (data) {
                            $scope.livestreamDetails = data.data;
                        },
                        error: function (data, status) {
                            console.log(data, status)
                        }
                    });

                    $scope.loadLivestream = function ($event, livestreamURL, title, description) {
                        title = title || appConfig.defaultPlayerConfig.source.title;
                        description = description || appConfig.defaultPlayerConfig.source.description;

                        tokenService.getToken().then(
                            function (tokenDetails) {
                                liveSourceConfig = {
                                    hls: livestreamURL + '?timestamp=' + tokenDetails.data.timestamp + '&client_id=' + tokenDetails.data.client_id + '&token=' + tokenDetails.data.token,
                                    title: title,
                                    description: description
                                };

                                playerService.getApi().load(liveSourceConfig).then(
                                    function (playerInstance) {
                                        console.log("load source", playerInstance);
                                        playerInstance.play();
                                    }, function (error) {
                                        console.log("load error!", error);
                                    });
                            },
                            function (data, status) {
                                console.log(data, status)
                            }
                        );
                    }
                }
            };
        }]);
