Package.describe({
  name: 'blockrazor:subscache-c4',
  summary: 'Most useful subscription caching, ever.',
  version: '2.0.1',
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
    'blockrazor:subscache-c4',
    'practicalmeteor:chai',
    'coffeescript',
    'practicalmeteor:mocha'
	], ['client', 'server']);
  api.mainModule('src/SubsCache.tests.js');
});
