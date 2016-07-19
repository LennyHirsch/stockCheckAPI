// App
var app = angular.module('checkoutApp', ['lbServices']);
// Main Controller
app.controller('mainCtrl', function($scope, $http, Product, Person, Ownership){
	// Startup stuff
	var ENDPOINT = 'http://localhost:3000/api/'

	$scope.admin = false;
	$scope.activeUser = {};
	$scope.activeProduct = {};

	angular.element(document).ready(function(){
		getPeople();
		getProduct();
	});

	$scope.initPeople = function() {
		$scope.activeUser = $scope.peopleList[0];
		getOwnerships($scope.activeUser.id, function(){
			// $scope.goThroughOwnerships();
			setInitialOwnership();
		});
	};

	$scope.initProducts = function() {
		$scope.activeProduct = $scope.productList[0];
	}

	$scope.peopleList = [];
	var getPeople = function() {
		Person.find()
		.$promise
		.then(function(response){
			$scope.peopleList = response;
		});
	};

	$scope.productList = [];
	var getProduct = function() {
		Product.find()
		.$promise
		.then(function(response){
			$scope.productList = response;
		});
	};

	var ownerships = [];
	var getOwnerships = function(personId, cb) {
		$http.get(ENDPOINT + 'Ownerships?filter={"include": "product", "where":{"personId":' + '"' + personId + '"' + '}}')
		.then(function(response){
			ownerships = response.data;
			cb();
		})
	};

	var setInitialOwnership = function() {
		$scope.personalQuantity = ownerships[0].quantity;
		$scope.ownershipId = ownerships[0].id;
	}

	// Find amount of activeProduct owned by activeUser.
	// $scope.activeProductQuantity = 0;
	$scope.goThroughOwnerships = function() {
		for (i = 0; i < ownerships.length; i++) {
			if ($scope.activeProduct.id === ownerships[i].product.id) {
				$scope.personalQuantity = ownerships[i].quantity;
			}
		}
	}

	$scope.findOwnerships = function(person, product) {
		getOwnershipBetweenPersonAndProduct(person.id, product.id, function(data){
			$scope.personalQuantity = data.quantity;
		});
	}


	$scope.updateActiveUserAndGetOwnerships = function(person) {
		updateActiveUser(person);

		getOwnershipBetweenPersonAndProduct(person.id, $scope.activeProduct.id, function(data) {
			if(data.length == 0) createOwnership(person.id, $scope.activeProduct.id);
			else {
				$scope.ownershipId = data[0].id;
				$scope.personalQuantity = data[0].quantity;
			}
		})
	};

	$scope.updateActiveProductAndGetOwnerships = function(product) {
		updateActiveProduct(product);
		getOwnershipBetweenPersonAndProduct($scope.activeUser.id, product.id, function(data) {
			if(data.length == 0) createOwnership($scope.activeUser.id, product.id);
			else {
				$scope.ownershipId = data[0].id;
				$scope.personalQuantity = data[0].quantity;
			}
		})	
	};

	var getOwnershipBetweenPersonAndProduct = function(personId, productId, cb) {
		$http.get(ENDPOINT + 'Ownerships?filter={"where":{"personId":"' + personId + '", "productId":"' + productId + '"}}')
		.then(function(response){
			cb(response.data);
		})
	}

	var createOwnership = function(personId, productId) {
		var postData = {
			"quantity": 0,
			"personId": personId,
			"productId": productId
			};
			
		$scope.personalQuantity = 0;

		$http.post(ENDPOINT + 'Ownerships', postData)
		.then(function(response){
			alert("Ownership created!");
			console.log(response.data);
			$scope.ownershipId = response.data.id;
		});
	}

	$scope.changeQuantity = function(change, product) {
		var productData = {
			"name": $scope.activeProduct.name,
			"quantity": $scope.activeProduct.quantity + change,
			"id": $scope.activeProduct.id
		};
		var personalData = {
			"quantity": $scope.personalQuantity - change,
			"id": $scope.ownershipId
		};
		$scope.activeProduct.quantity += change;
		$scope.personalQuantity -= change;
		$http.put(ENDPOINT + 'Products', productData);
		$http.put(ENDPOINT + 'Ownerships', personalData);
	}

	$scope.newPerson = {};
	$scope.createPerson = function() {
		if ($scope.newPerson) {
			$http.post(ENDPOINT + 'People', $scope.newPerson)
			.then(function(response) {
				console.log(response);
				getPeople();
				$scope.newPerson = {};
			});
		} else {
			alert('Please enter a person to create!');
		}
	}

	$scope.newProduct = {};
	$scope.createProduct = function() {
		if ($scope.newProduct.name && $scope.newProduct.quantity) {
			$http.post(ENDPOINT + 'Products', $scope.newProduct)
			.then(function(response) {
				console.log(response);
				getProduct();
			});
		} else {
			alert("Please specify both a product name and quantity!");
		}
		
	}

	var updateActiveUser = function(user) {
		$scope.activeUser = user;
	};

	var updateActiveProduct = function(product) {
		$scope.activeProduct = product;
	}

});

// Disable right click
function disableclick(event) {
	if(event.button==2) {
		return false;    
	} else if(event.button==3) {
		return false;
	}
};
document.onmousedown=disableclick;
