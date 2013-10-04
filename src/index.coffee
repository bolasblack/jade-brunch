jade = require 'jade'
sysPath = require 'path'
progeny = require 'progeny'

wrappers =
  umd: require 'umd-wrapper'
  cmd: (data) ->
    "module.exports = #{data};"

module.exports = class JadeCompiler
  brunchPlugin: yes
  type: 'template'
  extension: 'jade'

  constructor: (@config) ->
    @basedir = @config.plugins?.jade?.basedir or sysPath.join @config.paths.root, 'app'
    @getDependencies = progeny rootPath: @basedir

    @wrapper = @config.plugins?.jade?.wrapper
    @wrapper = 'umd' unless @wrapper in Object.keys wrappers

    @jadePath = @config.plugins?.jade?.path or []
    @jadePath = [@jadePath] unless Array.isArray @jadePath

  isVaildFile: (filepath) ->
    @jadePath.every (checker) ->
      return checker(filepath) if typeof checker is 'function'
      return checker.test(filepath) if typeof checker.test is 'function'
      true

  compile: (data, path, callback) ->
    return callback null, '' unless @isVaildFile path
    try
      compiled = jade.compile data,
        compileDebug: no,
        client: yes,
        filename: path,
        basedir: @basedir,
        pretty: !!@config.plugins?.jade?.pretty
      result = wrappers[@wrapper] compiled
    catch err
      error = err
    finally
      callback error, result

  # Add '../node_modules/jade/jade.js' to vendor files.
  include: [
    (sysPath.join __dirname, '..', 'vendor', 'runtime.js')
  ]
