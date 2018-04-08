Package.describe({
  name: 'blockrazor:subscache-c4',
  summary: 'Most useful subscription caching, ever.',
  version: '0.1.0',
  git: 'https://github.com/blockrazor/subscache-C4'
});

Package.onUse(function(api) {
  api.versionsFrom('METEOR@1');

  api.use([
    'ecmascript@0.8.3',
    'underscore',
    'ejson',
    'tracker',
    'reactive-var'
  ], ['client', 'server']);

  api.addFiles([
    'src/SubsCache.js',
  ], ['client','server']);

  api.export("SubsCache", ['client','server']);
});

Package.onTest(function(api) {
  api.use([
    'underscore',
    'ecmascript',
    'ejson',
    'tracker',
    'reactive-var',
    'ccorcos:subs-cache',
    'practicalmeteor:chai',
    'coffeescript@1.12.7_3',
    'practicalmeteor:mocha@2.4.5_6'
	], ['client', 'server']);
  api.mainModule('src/SubsCache.tests.js');
});
