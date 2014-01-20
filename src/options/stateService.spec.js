define([
	'rx',
	'common/core',
	'options/optionsController',
	'options/stateService'
], function (Rx, core, optionsController) {

	'use strict';
	
	describe('stateService', function () {

		var service;

		beforeEach(module('options'));

		beforeEach(function () {
			spyOn(core, 'enableService');
			spyOn(core, 'disableService');
			spyOn(core, 'removeService');
		});

		beforeEach(inject(function (StateService) {
			service = StateService;
		}));

		it('should disable service', function () {
			var settings = { name: 'service', disabled: false };
			core.configurations.onNext([settings]);
			optionsController.currentServices.onNext(settings);
			
			service.disableService();

			expect(core.disableService).toHaveBeenCalledWith('service');
		});

		it('should not disable service if already disabled', function () {
			var settings = { name: 'service', disabled: true };
			core.configurations.onNext([settings]);
			optionsController.currentServices.onNext(settings);

			service.disableService();

			expect(core.disableService).not.toHaveBeenCalled();
		});

		it('should enable service', function () {
			var settings = { name: 'service', disabled: true };
			core.configurations.onNext([settings]);
			optionsController.currentServices.onNext(settings);
			
			service.enableService();

			expect(core.enableService).toHaveBeenCalledWith('service');
		});

		it('should not enable service if already enabled', function () {
			var settings = { name: 'service', disabled: false };
			core.configurations.onNext([settings]);
			optionsController.currentServices.onNext(settings);
			
			service.enableService();

			expect(core.enableService).not.toHaveBeenCalled();
		});

		it('should ignore enable service if no service selected yet', function () {
			service.enableService();

			expect(core.enableService).not.toHaveBeenCalled();
		});

		it('should remove service', function () {
			core.configurations.onNext([{ name: 'service' }]);
			
			service.removeService('service');

			expect(core.removeService).toHaveBeenCalledWith('service');
		});

		it('should ignore disable service if no service selected yet', function () {
			optionsController.currentServices.onNext(null);

			service.disableService();

			expect(core.disableService).not.toHaveBeenCalled();
		});

	});
});