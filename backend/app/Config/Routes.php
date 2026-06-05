<?php

use CodeIgniter\Router\RouteCollection;

/** @var RouteCollection $routes */
$routes->options('(:any)', static function () {
    return service('response')->setStatusCode(204);
});

$routes->get('/', 'Home::index');
$routes->post('register-hospital', 'Auth::registerHospital');
$routes->post('register-receiver', 'Auth::registerReceiver');
$routes->post('login', 'Auth::login');

$routes->get('blood-samples', 'BloodSamples::index');
$routes->post('blood-samples', 'BloodSamples::create');
$routes->post('blood-samples/(:num)/request', 'BloodRequests::create/$1');
$routes->get('hospital/requests', 'BloodRequests::hospitalRequests');
