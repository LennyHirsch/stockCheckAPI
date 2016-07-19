var app = angular.module('userListGetCreate', ['lbServices']);
// URL constant
app.constant('ENDPOINT_URL', 'http://localhost:3000/api/');
// Controller
app.controller('MainCtrl', function($scope, $http, Product, Person){

	angular.element(document).ready(function(){
		$scope.getPeople();
		$scope.getProduct();
	});
	// Get people. This should be used at document load to retrieve all people.
	$scope.peopleList = [];
	$scope.getPeople = function() {
		Person.find()
		.$promise
		.then(function(response){
			$scope.peopleList = response;
		})
	};
	// Define new person and submit to API
	$scope.newperson = {};
	$scope.createPerson = function() {
		Person.create($scope.newperson)
		.$promise
		.then(function(response) {
			$scope.peopleList.push(response);
		});
	};

	// Get product.
	$scope.getProduct = function() {
		Product.find()
		.$promise
		.then(function(response){
			$scope.productList = response;
			console.log($scope.productList[0].quantity);
		})
	};
	// Change the quantity by changeInQuantity
	$scope.changeQuantity = function(changeInQuantity) {
		Product.prototype$updateAttributes({id: $scope.productList[0].id}, {"quantity":$scope.productList[0].quantity - changeInQuantity})
		.$promise
		.then(function(response){
			console.log(response);
		})
	};
 
});
