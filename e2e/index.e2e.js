var fs = require('fs');

describe('App index page', function() {
    it('should have a title', function() {
        browser.get('/');

        expect(browser.getTitle()).toBe('日志列表');
    });

    it('should have several logs', function() {
        browser.get('/');
        var lis = element.all(by.repeater('model in models'));
        expect(lis.count()).toBeGreaterThan(0);
    });

    it('should have file when click download button', function() {
        browser.get('/');
        element(by.binding('model.filename')).getText().then(txt => {
            element(by.linkText('下载')).click();

            browser.wait(() => {
                return fs.existsSync('C:/Users/zl/Downloads/' + txt);
            }, 10000, 'download file failed ' + txt).then(function() {
                expect(fs.existsSync('C:/Users/zl/Downloads/' + txt)).toEqual(true);
            }).catch(err => {
                expect(err.message).toEqual('');
            })
        }).catch(err => {
            expect(err.message).toBe('');
        });
    });

    it('should navigate to log detail', function() {
        browser.get('/');
        element(by.binding('model.filename')).getText().then(txt => {
            element(by.linkText('查看')).click().then(function() {
                browser.waitForAngularEnabled(false); //跳转到非angular页面
                expect(browser.getCurrentUrl()).toContain(`/file/log/v?name=${txt}`);
            });
        }).catch(err => {
            expect(err.message).toBe('');
        });
    });
});