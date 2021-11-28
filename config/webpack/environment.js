const { environment } = require('@rails/webpacker')

const aliasConfig = require("./alias");
environment.config.merge(aliasConfig);

module.exports = environment

const nodeModulesLoader = environment.loaders.get('nodeModules');
if (!Array.isArray(nodeModulesLoader.exclude)) {
  nodeModulesLoader.exclude = nodeModulesLoader.exclude == null ? [] : [nodeModulesLoader.exclude];
}

nodeModulesLoader.exclude.push(/react-table/);
