var express = require('express');
var router = express.Router();
var {controllerName} = require({controllerPath});
var jwt                 = require('jsonwebtoken');
const key               = 'IVN1UGVSc0VjUmVUIQ==';

router.use('/', function(req, res, next) {
	var token = req.body.token || req.query.token || req.headers['x-access-token'];
	jwt.verify(token, key, function(err, decoded) {
		if (err) {
			console.error(err);
			return res.status(401).json({
				title: 'An error occurred',
				error: err
			});
		}
		next();
	});
});

/**
 * GET Serch
 */
 router.get('/search/:terms', function(req, res) {
	{controllerName}.search(req, res);
 });

/**
 * GET Serch
 */
 router.get('/bootstrap', function(req, res) {
	{controllerName}.bootstrap(req, res);
 });

/*
 * GET
 */
 router.get('/', function(req, res) {
 	{controllerName}.list(req, res);
 });

/*
 * GET
 */
 router.get('/:id', function(req, res) {
 	{controllerName}.show(req, res);
 });

/*
 * POST
 */
 router.post('/', function(req, res) {
 	{controllerName}.create(req, res);
 });

/*
 * PUT
 */
 router.put('/:id', function(req, res) {
 	{controllerName}.update(req, res);
 });

/*
 * DELETE
 */
 router.delete('/:id', function(req, res) {
 	{controllerName}.remove(req, res);
 });

 module.exports = router;