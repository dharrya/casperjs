/*jshint strict:false, maxstatements:99*/
/*global casper, require*/
var utils = require('utils');
var x = require('casper').selectXPath;

casper.test.begin('within tests', 13, function(test) {
    casper.start('tests/site/within.html');

    casper.within(x('//form[@action="result.html"]'), function (){
        test.assertEquals(this.getSelfAttr('action'), 'result.html');
        test.assertField('language', 'language value');
        test.assertNotExists('#no-type-test-form');
        casper.within(x('//select//option[@value="bar"]'), function () {
            test.assertSelfTextExist('baz');
            test.assertSelfNotVisible();
        });
        test.assertTextExists('baz');
        test.assertSelfVisible();
    });

    casper.within(x('//form[@action="result.html"]'), function() {
        this.selfFill({
            email: 'some email',
            content: 'some content',
            language: 'changed language'
        });
        test.assertField('email', 'some email');
        test.assertField('content', 'some content');
        test.assertField('language', 'changed language');
    });

    casper.within('#no-type-test-form', function() {
        this.selfFill({
            notype: 'notype'
        });
        test.assertEquals(this.getSelfFormValues(), {
            email:"original value",
            notype: 'notype'
        });
    });

    casper.within('#no-type-test-form a', function() {
        this.selfClick();
        this.then(function() {
          test.assertTextExists('clicked!');
        });
        test.assertEquals(this.getSelfAttr('href'), 'javascript:void(0)');
    });

    casper.run(function() {
        test.done();
    });
});
