// Generated by CoffeeScript 1.6.3
var JadeCompiler, jade, progeny, sysPath, wrappers,
  __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

jade = require('jade');

sysPath = require('path');

progeny = require('progeny');

wrappers = {
  umd: require('umd-wrapper'),
  cmd: function(data) {
    return "module.exports = " + data + ";";
  }
};

module.exports = JadeCompiler = (function() {
  JadeCompiler.prototype.brunchPlugin = true;

  JadeCompiler.prototype.type = 'template';

  JadeCompiler.prototype.extension = 'jade';

  function JadeCompiler(config) {
    var _ref, _ref1, _ref2, _ref3, _ref4, _ref5, _ref6;
    this.config = config;
    this.basedir = ((_ref = this.config.plugins) != null ? (_ref1 = _ref.jade) != null ? _ref1.basedir : void 0 : void 0) || sysPath.join(this.config.paths.root, 'app');
    this.getDependencies = progeny({
      rootPath: this.basedir
    });
    this.wrapper = (_ref2 = this.config.plugins) != null ? (_ref3 = _ref2.jade) != null ? _ref3.wrapper : void 0 : void 0;
    if (_ref4 = this.wrapper, __indexOf.call(Object.keys(wrappers), _ref4) < 0) {
      this.wrapper = 'umd';
    }
    this.jadePath = ((_ref5 = this.config.plugins) != null ? (_ref6 = _ref5.jade) != null ? _ref6.path : void 0 : void 0) || [];
    if (!Array.isArray(this.jadePath)) {
      this.jadePath = [this.jadePath];
    }
  }

  JadeCompiler.prototype.isVaildFile = function(filepath) {
    return this.jadePath.every(function(checker) {
      if (typeof checker === 'function') {
        return checker(filepath);
      }
      if (typeof checker.test === 'function') {
        return checker.test(filepath);
      }
      return true;
    });
  };

  JadeCompiler.prototype.compile = function(data, path, callback) {
    var compiled, err, error, result, _ref, _ref1;
    if (!this.isVaildFile(path)) {
      return callback(null, '');
    }
    try {
      compiled = jade.compile(data, {
        compileDebug: false,
        client: true,
        filename: path,
        basedir: this.basedir,
        pretty: !!((_ref = this.config.plugins) != null ? (_ref1 = _ref.jade) != null ? _ref1.pretty : void 0 : void 0)
      });
      return result = wrappers[this.wrapper](compiled);
    } catch (_error) {
      err = _error;
      return error = err;
    } finally {
      callback(error, result);
    }
  };

  JadeCompiler.prototype.include = [sysPath.join(__dirname, '..', 'vendor', 'runtime.js')];

  return JadeCompiler;

})();
