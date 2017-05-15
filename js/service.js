angular.module('livestreamBitmovin')
    .service('TokenService', ['$http', '$q', 'AppConfig', function ($http, $q, appConfig) {
        this.getToken = function () {
            var deferred = $q.defer();
            var config = {
                method: 'GET',
                url: appConfig.clientServerBaseUrl
            };

            $http(config).then(
                function (result) {
                    deferred.resolve(result);
                },
                function (error) {
                    deferred.reject(error);
                });

            return deferred.promise;
        };


    }])
    .service('LivestreamService', ['$http', 'TokenService', '$q', 'AppConfig', function ($http, $tokenService, $q, appConfig) {
        this.lsBaseUrl = appConfig.livestreamApiBaseUrl;
        this.accountId = 0;

        this.errorResponseHandler = function () {
            var errMsg = "Error requesting token! Please check if the backend application of this example is running and your Livestream API credentials are correct!";
            console.error(errMsg);
        };

        this.initAccount = function () {
            var deferred = $q.defer();
            var self = this;

            if (this.accountId === 0) {
                this.getAccounts({
                    success: function (accountDetails) {
                        self.accountId = accountDetails.data[0].id;
                        deferred.resolve(accountDetails);
                    },
                    error: function (e) {
                        console.error("Unable to fetch Livestream account details!", e.data.code, e.data.message);
                        deferred.reject(e);
                    }
                });
            } else {
                deferred.resolve();
            }

            return deferred.promise;
        };

        this.getAccounts = function (options) {
            var self = this;
            $tokenService.getToken().then(function (tokenDetails) {
                var config = {
                    method: 'GET',
                    url: self.lsBaseUrl + '/accounts',
                    params: tokenDetails.data
                };

                $http(config).then(options.success, options.error);
            }, this.errorResponseHandler);
        };

        this.getUpcomingEvents = function (options) {
            var self = this;
            this.initAccount().then(function () {
                $tokenService.getToken().then(function (tokenDetails) {
                    var config = {
                        method: 'GET',
                        url: self.lsBaseUrl + '/accounts/' + self.accountId + '/upcoming_events',
                        params: tokenDetails.data
                    };
                    $http(config).then(options.success, options.error);
                });
            });
        };

        this.getDraftEvents = function (options) {
            var self = this;
            this.initAccount().then(function () {
                $tokenService.getToken().then(function (tokenDetails) {
                    var config = {
                        method: 'GET',
                        url: self.lsBaseUrl + '/accounts/' + self.accountId + '/draft_events',
                        params: tokenDetails.data
                    };
                    $http(config).then(options.success, options.error);
                });
            });
        };

        this.getVideosFromEvent = function (eventId, options) {
            var self = this;
            this.initAccount().then(function () {
                $tokenService.getToken().then(function (tokenDetails) {
                    var config = {
                        method: 'GET',
                        url: self.lsBaseUrl + '/accounts/' + self.accountId + '/events/' + eventId + '/videos',
                        params: tokenDetails.data
                    };
                    $http(config).then(options.success, options.error);
                });
            });
        }
    }])
    .service('PlayerService', ['AppConfig', function (appConfig) {
        this.playerInstance = {};

        this.setup = function (playerConfig) {
            this.playerInstance = bitmovin.player(appConfig.playerElementId);
            return this.playerInstance.setup(playerConfig || appConfig.defaultPlayerConfig);
        };

        this.getApi = function () {
            return this.playerInstance;
        };

        this.load = function (sourceObject) {
            return playerInstance.load(sourceObject);
        }
    }]);