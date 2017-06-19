var fs = require('fs');

describe('Log detail', function() {
    it('should have a title', function() {
        browser.waitForAngularEnabled(false);
        browser.get('/file/log/v?name=', 10000);

        expect(browser.getTitle()).toBe('日志');
    });
});