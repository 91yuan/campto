/**
 * Created by vt on 15/9/29.
 */

'use strict'

const _ = require('lodash')

const chinese = require('./fragments')

const CAPTCHA_LEN = 7
const MathTopic = module.exports = function () {}

MathTopic.rand = function () {
  const topic = new MathTopic()
  topic._randOperator()
  return topic._rand()
}

MathTopic.prototype._randOperator = function () {
  this._operator = Math.random() > .5 && '+' || '-'
}

MathTopic.prototype._rand = function () {
  if (this._operator == '+') {
    this._leNum = _.random(0, 30)
    this._rtNum = _.random(0, 30)
    this.result = this._leNum + this._rtNum
  } else {
    this._leNum = _.random(10, 50)
    this._rtNum = _.random(0, this._leNum)
    this.result = this._leNum - this._rtNum
  }
  this._le = MathTopic._randStringify(this._leNum)
  this._rt = MathTopic._randStringify(this._rtNum)
  this._optLen = _.random(1, 2)
  this.subject = this._prepareSubject().join(' ')
  return this
}

MathTopic._numToChinese = function (num) {
  if (num < 11) {
    return [1, chinese['num'][num]]
  }
  const units = num % 10,
    tens = Math.floor(num / 10)
  if (tens === 1) {
    return [2, [chinese['num'][10], chinese['num'][units]].join(' ')]
  }
  if (units === 0) {
    return [2, [chinese['num'][tens], chinese['num'][10]].join(' ')]
  }
  return [3, [chinese['num'][tens], chinese['num'][10], chinese['num'][units]].join(' ')]
}

MathTopic._randStringify = function (num) {
  if (Math.random() > 0.5) {
    return MathTopic._numToChinese(num)
  }
  return [1, num + '']
}

MathTopic.prototype._prepareSubject = function () {
  const currentLen = this._le[0] + this._rt[0]
  const optArr = chinese['operator'][this._operator]
  if (currentLen === 6) {
    return [this._le[1], optArr[0], this._rt[1]]
  }
  if (currentLen === 5 && this._optLen === 2) {
    return [this._le[1], optArr[1], this._rt[1]]
  }
  const eqlLen = CAPTCHA_LEN - this._optLen - currentLen
  return [this._le[1], optArr[this._optLen - 1], this._rt[1], chinese['equal'][eqlLen - 1]]
}

require('../').register('math', _ => MathTopic.rand())