/* eslint-env jasmine */
var bfstep = require('../index')

describe('must end with an error when', function () {
  var interpreter

  beforeEach(function () {
    interpreter = bfstep.create(10)
    interpreter.delay = 1
  })

  it('moves below the first cell', function (done) {
    interpreter.source = '<'
    interpreter.on('end', function (err) {
      expect(typeof err).toBe('object')
      expect(err.message).toBe("Out of range! You wanted to '<' below the first cell.")
      done()
    })
    interpreter.run()
  })

  it('moves beyond the last cell', function (done) {
    interpreter.source = '+[>+]'
    interpreter.on('end', function (err) {
      expect(typeof err).toBe('object')
      expect(err.message).toBe("Out of range! You wanted to '>' beyond the last cell.")
      done()
    })
    interpreter.run()
  })

  it('has unbalanced brackets', function (done) {
    interpreter.source = '++[-]]'
    interpreter.on('end', function (err) {
      expect(typeof err).toBe('object')
      expect(err.message).toBe('Unbalanced brackets.')
      done()
    })
    interpreter.run()
  })

  it('has unclosed brackets', function (done) {
    interpreter.source = '++['
    interpreter.on('end', function (err) {
      expect(typeof err).toBe('object')
      expect(err.message).toBe('Unbalanced brackets.')
      done()
    })
    interpreter.run()
  })
})
