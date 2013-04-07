define([
	'services/jenkins/buildService',
	'services/request',
	'rx'
], function (BuildService, request, Rx) {

	'use strict';

	describe('services/jenkins/buildService', function () {

		var settings;

		beforeEach(function () {
			settings = {
				typeName: 'Jenkins',
				baseUrl: 'jenkins',
				icon: 'jenkins/icon.png',
				url: 'http://example.com/',
				name: 'Jenkins instance'
			};
		});

		it('should provide default settings', function () {
			var defaultSettings = BuildService.settings();

			expect(defaultSettings.typeName).toBe('Jenkins');
			expect(defaultSettings.baseUrl).toBe('jenkins');
			expect(defaultSettings.icon).toBe('jenkins/icon.png');
			expect(defaultSettings.logo).toBe('jenkins/logo.png');
			expect(defaultSettings.url).toBeDefined();
			expect(defaultSettings.urlHint).toBe('http://ci.jenkins-ci.org/');
			expect(defaultSettings.username).toBeDefined();
			expect(defaultSettings.password).toBeDefined();
			expect(defaultSettings.updateInterval).toBe(60);
		});

		describe('availableBuilds', function () {

			var apiJson;
			var completed;
			var service;

			beforeEach(function () {
				apiJson = JSON.parse(readFixtures('jenkins/views.json'));
				service = new BuildService(settings);
			});

			it('should return available builds', function () {
				var builds = Rx.Observable.returnValue(apiJson);
				spyOn(request, 'json').andReturn(builds);

				expect(service.availableBuilds()).toBe(builds);
			});

			it('should use credentials', function () {
				settings.username = 'USERNAME';
				settings.password = 'PASSWORD';
				spyOn(request, 'json').andCallFake(function (options) {
					expect(options.username).toBe(settings.username);
					expect(options.password).toBe(settings.password);
				});

				service.availableBuilds();

				expect(request.json).toHaveBeenCalled();
			});

			it('should get available builds from correct URL', function () {
				spyOn(request, 'json').andCallFake(function (options) {
					expect(options.url).toBe('http://example.com/api/json?depth=1');
				});

				service.availableBuilds();

				expect(request.json).toHaveBeenCalled();
			});

			it('should return projects', function () {
				spyOn(request, 'json').andCallFake(function (options) {
					var response = options.parseHandler(apiJson);
					expect(response.items).toBeDefined();
					expect(response.items.length).toBe(63);
					expect(response.items[0].id).toBeDefined();
					expect(response.items[0].name).toBeDefined();
					expect(response.items[0].group).toBeDefined();
					expect(response.items[0].enabled).toBeDefined();
				});

				service.availableBuilds();

				expect(request.json).toHaveBeenCalled();
			});

			it('should return views', function () {
				spyOn(request, 'json').andCallFake(function (options) {
					var response = options.parseHandler(apiJson);
					expect(response.views).toBeDefined();
					expect(response.views[0].name).toBeDefined();
					expect(response.views[0].items).toBeDefined();
					expect(response.views[0].items[0]).toBeDefined();
					expect(response.primaryView).toBeDefined();
				});

				service.availableBuilds();

				expect(request.json).toHaveBeenCalled();
			});

		});
	});

});