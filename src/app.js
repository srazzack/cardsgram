angular.module('cardgram', [])
	.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
		$routeProvider
			.when('/city/:city', 
				{
					controller: 'cardcontroller'
				})
			.otherwise({ redirectTo: '/city/sf' });
	}]
  	).controller(
		'cardcontroller', function ( $scope, $http, $timeout, $route, $location ) {
			$scope.cities = [
				{name: 'San Francisco', city: 'sf', lattitude: '37.7750', longitude: '122.4183'},
				{name: 'Los Angeles', city: 'la', lattitude: '34.0522', longitude: '118.2428'},
				{name: 'New York', city: 'ny', lattitude: '40.7142', longitude: '74.0064'},
				{name: 'Las Vegas', city: 'lv', lattitude: '36.0800', longitude: '115.1522'}
			];

		
        //referencing so Angularjs initializes the select box correctly
        $scope.location = $scope.cities[0];

        	$scope.handleImgLoaded = function (data, status){
        		$scope.images = data.data;
			    for (var i = 0; i < $scope.images.length; i++) {
			    	console.log($scope.images[i].images.thumbnail.url);
			    };
        	}

			$scope.fetchImages = function(city) {

				if (!$route.current) {
					$location.path('/city/' + $scope.location.city);
				} 

				console.log($route.current);

				var source_url = 'https://api.instagram.com/v1/media/search?lat=' + city.lattitude +'&lng=' + city.longitude + '&client_id=04749b851e434b999944fca756d8f3a5&callback=JSON_CALLBACK';
				console.log(source_url);
				
				$http({method: 'jsonp', url: source_url}).
				  success($scope.handleImgLoaded).
				  error(function(data, status, headers, config) {
				    throw Error("http request failed");
					$timeout( $scope.fetchImages, 2000 );
				  });

				  console.log($scope.images);
			}

			$timeout($scope.fetchImages($scope.location));

			$scope.cityChange = function() {
				console.log($scope.location.city);
				$location.path('/city/' + $scope.location.city);
				$scope.fetchImages($scope.location);
			}
		})
