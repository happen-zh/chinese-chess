$(document).ready(function() {
  // 棋盘位置规则
  var chess = {
    startTop: 32,
    startLeft: 32,
    pieceWidth: 55,
    pieceHeight: 55,
    chessSpan: 61,
    selectedPiece: null,
    maxTransverse: 9, //横向
    maxPortrait: 10, //纵向
    currentRole: 'red',
    isOver: false,
    isStartChessPlan: false,
    pieceInitPositionRules: {
      black: {
        ju: {
          top: 0,
          left: [0, 8]
        },
        ma: {
          top: 0,
          left: [1, 7]
        },
        xiang: {
          top: 0,
          left: [2, 6]
        },
        shi: {
          top: 0,
          left: [3, 5]
        },
        jiang: {
          top: 0,
          left: [4]
        },
        pao: {
          top: 2,
          left: [1, 7]
        },
        zu: {
          top: 3,
          left: [0, 2, 4, 6, 8]
        }
      },
      red: {
        ju: {
          top: 9,
          left: [0, 8]
        },
        ma: {
          top: 9,
          left: [1, 7]
        },
        xiang: {
          top: 9,
          left: [2, 6]
        },
        shi: {
          top: 9,
          left: [3, 5]
        },
        shuai: {
          top: 9,
          left: [4]
        },
        pao: {
          top: 7,
          left: [1, 7]
        },
        bing: {
          top: 6,
          left: [0, 2, 4, 6, 8]
        }
      }
    },
    piecePOsition: {},
    initPiece: function() {
      var that = this;
      for (color in that.pieceInitPositionRules) {
        var diffPiece = that.pieceInitPositionRules[color];
        for (kind in diffPiece) {
          for (var i = 0; i < diffPiece[kind]['left'].length; i++) {
            var _left = that.startLeft + diffPiece[kind]['left'][i] * that.chessSpan;
            var _top = that.startTop + diffPiece[kind]['top'] * that.chessSpan;
            var _src = 'image/' + color + '/normal/' + kind + '.png';
            var _html = '<div class="piece"><img src="' + _src + '" /></div>';
            var html = $(_html);
            html.css('top', _top + 'px');
            html.css('left', _left + 'px');
            html.data('role', kind);
            html.data('color', color);
            html.data('transverse', diffPiece[kind]['left'][i] + 1);
            html.data('portrait', diffPiece[kind]['top'] + 1);
            $('.chess-board').append(html);
          }
        }
      }
    },
    CalculationPosition: function(left, top) {
      var that = this;
      var _left = left - that.startLeft;
      var _top = top - that.startTop;
      var _transverseNum = Math.ceil(_left / that.chessSpan); //横向间隔个数
      var _portraitNum = Math.ceil(_top / that.chessSpan);
      var _position = {
        transverse: _transverseNum,
        portrait: _portraitNum
      }
      return _position;
    },
    runPiece: function(_position) {
      var that = this;
      var _selectedPiece = chess.selectedPiece;
      $(_selectedPiece).css('left', chess.startLeft + (_position.transverse - 1) * chess.chessSpan);
      $(_selectedPiece).css('top', chess.startTop + (_position.portrait - 1) * chess.chessSpan);
      var _targetTemp = that.getSpecicalPoitPiece(_position);
      if (_targetTemp) {
        var _target = $(_targetTemp);
        var _color = _target.data('color');
        var _name = '.' + _color + '-box';
        $(_name).append(_targetTemp);
        if (_target.data('role') === 'jiang' || _target.data('role') === 'shuai') {
          alert('棋局结束,');
          chess.isOver = true;
        }
      }
      $(_selectedPiece).data('transverse', _position.transverse);
      $(_selectedPiece).data('portrait', _position.portrait);
      var _selected = chess.selectedPiece;
      if (_selected) {
        $(_selected).find('img').eq(0).attr('src', 'image/' + $(_selected).data('color') + '/normal/' + $(_selected).data('role') + '.png');
        chess.selectedPiece = null;
      }
      chess.selectedPiece = null;
      if (chess.currentRole === 'red') {
        chess.currentRole = 'black';
      } else {
        chess.currentRole = 'red';
      }
    },
    checkRunRules: function(_position) {
      var that = this;
      var _role = $(chess.selectedPiece).data('role');
      var _selectedPiece = $(that.selectedPiece);
      var _transverseDvalue = _position.transverse - _selectedPiece.data('transverse');
      var _portraitDvalue = _position.portrait - _selectedPiece.data('portrait');
      var _num = 0;
      if (that.isOver) {
        console.log('棋局已经结束，请点击开始再次开始！');
        return;
      }

      switch (_role) {
        case 'ju':
          {
            // 不能拐弯
            if (_selectedPiece.data('portrait') !== _position.portrait && _selectedPiece.data('transverse') !== _position.transverse) {
              console.log('车只能直着走，不能拐弯！');
              return;
            }

            // 不能跨子
            _num = that.checkMiddlePiece(_position, _selectedPiece);

            if (_num > 0) {
              console.log('车不能隔子走！');
              return;
            }

            break;
          }
        case 'ma':
          {
            // 横纵坐标差值为1和2
            var _specailPoint = null;
            if (Math.abs(_transverseDvalue) === 2 && Math.abs(_portraitDvalue) === 1) {
              // 横向跳
              if (_transverseDvalue < 0) {
                // 向右
                _specailPoint = {
                  transverse: _selectedPiece.data('transverse') - 1,
                  portrait: _selectedPiece.data('portrait')
                };
              } else {
                // 向左
                _specailPoint = {
                  transverse: _selectedPiece.data('transverse') + 1,
                  portrait: _selectedPiece.data('portrait')
                };
              }
            } else if (Math.abs(_transverseDvalue) === 1 && Math.abs(_portraitDvalue) === 2) {
              // 纵向跳
              if (_portraitDvalue < 0) {
                // 向上跳
                _specailPoint = {
                  transverse: _selectedPiece.data('transverse'),
                  portrait: _selectedPiece.data('portrait') - 1
                };
              } else {
                // 向下跳
                _specailPoint = {
                  transverse: _selectedPiece.data('transverse'),
                  portrait: _selectedPiece.data('portrait') + 1
                };
              }
            } else {
              console.log('你只能走日字形！');
              return;
            }
            var _obstacle = that.getSpecicalPoitPiece(_specailPoint);
            if (_obstacle) {
              console.log('马被别，不能走！');
              return;
            }
            break;
          }
        case 'xiang':
          {
            var _specailPoint = null;
            if (Math.abs(_transverseDvalue) === 2 && Math.abs(_portraitDvalue) === 2) {
              if (_transverseDvalue < 0 && _portraitDvalue < 0) {
                // 向右下
                _specailPoint = {
                  transverse: _selectedPiece.data('transverse') - 1,
                  portrait: _selectedPiece.data('portrait') - 1
                };
              } else if (_transverseDvalue > 0 && _portraitDvalue > 0) {
                // 向左上
                _specailPoint = {
                  transverse: _selectedPiece.data('transverse') + 1,
                  portrait: _selectedPiece.data('portrait') + 1
                };
              } else if (_transverseDvalue > 0 && _portraitDvalue < 0) {
                // 向左下
                _specailPoint = {
                  transverse: _selectedPiece.data('transverse') + 1,
                  portrait: _selectedPiece.data('portrait') - 1
                };
              } else if (_transverseDvalue < 0 && _portraitDvalue > 0) {
                // 向右上
                _specailPoint = {
                  transverse: _selectedPiece.data('transverse') - 1,
                  portrait: _selectedPiece.data('portrait') + 1
                };
              }
            } else {
              console.log('你只能走田字形，不能过河，不能被别着！');
              return;
            }

            var _obstacle = that.getSpecicalPoitPiece(_specailPoint);
            if (_obstacle) {
              console.log('象被别，不能走！');
              return;
            }

            if (_selectedPiece.data('color') === 'black' && _position.portrait > 5) {
              console.log('象不能过河！');
              return;
            }

            if (_selectedPiece.data('color') === 'red' && _position.portrait < 5) {
              console.log('象不能过河！');
              return;
            }

            break;
          }
        case 'shi':
          {
            if (_selectedPiece.data('color') === 'black') {
              if (_position.transverse < 4 || _position.transverse > 6 || _position.portrait > 3 || _position.portrait < 1) {
                console.log('士只能在米子格内走！');
                return;
              }
            } else {
              if (_position.transverse < 4 || _position.transverse > 6 || _position.portrait > 10 || _position.portrait < 8) {
                console.log('士只能在米子格内走！');
                return;
              }
            }
            if (Math.abs(_transverseDvalue) !== 1 || Math.abs(_portraitDvalue) !== 1) {
              console.log('士只能斜着走！');
              return;
            }
            break;
          }
        case 'jiang':
          {
            if (_position.transverse < 4 || _position.transverse > 6 || _position.portrait > 3 || _position.portrait < 1) {
              console.log('将只能在米子格内走！');
              return;
            }
            if (!((Math.abs(_transverseDvalue) === 1 && Math.abs(_portraitDvalue) === 0) || (Math.abs(_transverseDvalue) === 0 && Math.abs(_portraitDvalue) === 1))) {
              console.log('将不能跨步走！');
              return;
            }
            break;
          }
        case 'shuai':
          {
            if (_position.transverse < 4 || _position.transverse > 6 || _position.portrait > 10 || _position.portrait < 8) {
              console.log('帅只能在米子格内走！');
              return;
            }
            if (!((Math.abs(_transverseDvalue) === 1 && Math.abs(_portraitDvalue) === 0) || (Math.abs(_transverseDvalue) === 0 && Math.abs(_portraitDvalue) === 1))) {
              console.log('帅不能跨步走！');
              return;
            }
            break;
          }
        case 'pao':
          {
            // 不能拐弯
            if (_selectedPiece.data('portrait') !== _position.portrait && _selectedPiece.data('transverse') !== _position.transverse) {
              console.log('炮只能直着走，不能拐弯！');
              return;
            }

            // 不能跨子
            _num = that.checkMiddlePiece(_position, _selectedPiece);
            var _target = that.getSpecicalPoitPiece(_position);

            if (_target) {
              if (_num !== 1) {
                console.log('炮吃子时，中间必须只有一个子！');
                return;
              }
            } else {
              if (_num > 0) {
                console.log('炮不吃子时，中间不能有子！');
                return;
              }
            }
            break;
          }
        case 'zu':
          {
            if (Math.abs(_portraitDvalue) > 1) {
              console.log('卒只能往前走一步！');
              return;
            }

            if (_position.portrait < 6) {
              if (_transverseDvalue !== 0 || _portraitDvalue !== 1) {
                // 只能往前一步
                console.log('卒过河前，只能往前走！');
                return;
              }
            } else {
              if ((Math.abs(_transverseDvalue) === 1 && Math.abs(_portraitDvalue) === 0) || (Math.abs(_transverseDvalue) === 0 && Math.abs(_portraitDvalue) === 1)) {
                if (_portraitDvalue === -1) {
                  console.log('卒过河后，但不能后退！');
                  return;
                }
              } else {
                console.log('卒一次只能走一步！');
                return;
              }
            }
            break;
          }
        case 'bing':
          {
            if (Math.abs(_portraitDvalue) > 1) {
              console.log('兵只能往前走一步！');
              return;
            }

            if (_position.portrait > 5) {
              if (_transverseDvalue !== 0 || _portraitDvalue !== -1) {
                // 只能往前一步
                console.log('兵过河前，只能往前走！');
                return;
              }
            } else {
              if ((Math.abs(_transverseDvalue) === 1 && Math.abs(_portraitDvalue) === 0) || (Math.abs(_transverseDvalue) === 0 && Math.abs(_portraitDvalue) === 1)) {
                if (_portraitDvalue === 1) {
                  console.log('兵过河后，但不能后退！');
                  return;
                }
              } else {
                console.log('兵一次只能走一步！');
                return;
              }
            }
            break;
          }
      }
      chess.runPiece(_position);
    },
    checkChessPlan: function(_position) {
      if ((_position.transverse < 1 || _position.transverse > 9) || (_position.portrait < 1 || _position.portrait > 10)) {
        console.log('不能选择棋盘外的位置！');
        return;
      }
      var that = this;
      var _role = $(chess.selectedPiece).data('role');
      var _color = $(chess.selectedPiece).data('color');
      var _selectedPiece = $(that.selectedPiece);
      switch (_role) {
        case 'xiang':
          {
            if (_color === 'red') {
              var _redPortraitRules = [6, 8, 10];
              var _redTransverseRules = [
                [3, 7],
                [1, 5, 9],
                [3, 7]
              ];
              var _isAllow = that.positionRangeCheck(_position, _redPortraitRules, _redTransverseRules);
              if (!_isAllow) {
                console.log('相只能放置在固定的位置！');
                return;
              }
            } else {
              var _blackPortraitRules = [1, 3, 5];
              var _blackTransverseRules = [
                [3, 7],
                [1, 5, 9],
                [3, 7]
              ];
              var _isAllow = that.positionRangeCheck(_position, _blackPortraitRules, _blackTransverseRules);
              if (!_isAllow) {
                console.log('象只能放置在固定的位置！');
                return;
              }
            }
            break;
          }
        case 'shi':
          {
            if (_color === 'red') {
              var _redPortraitRules = [8, 9, 10];
              var _redTransverseRules = [
                [4, 6],
                [5],
                [4, 6]
              ];

              var _isAllow = that.positionRangeCheck(_position, _redPortraitRules, _redTransverseRules);
              if (!_isAllow) {
                console.log('仕只能放置在固定的位置！');
                return;
              }
            } else {
              var _blackPortraitRules = [1, 2, 3];
              var _blackTransverseRules = [
                [4, 6],
                [5],
                [4, 6]
              ];
              var _isAllow = that.positionRangeCheck(_position, _blackPortraitRules, _blackTransverseRules);
              if (!_isAllow) {
                console.log('士只能放置在固定的位置！');
                return;
              }
            }
            break;
          }
        case 'jiang':
          {
            var _portraitRules = [1, 2, 3];
            var _transverseRules = [
              [4, 5, 6],
              [4, 5, 6],
              [4, 5, 6]
            ];
            var _isAllow = that.positionRangeCheck(_position, _portraitRules, _transverseRules);
            if (!_isAllow) {
              console.log('将只能放置在固定的位置！');
              return;
            }
            break;
          }
        case 'shuai':
          {
            var _portraitRules = [8, 9, 10];
            var _transverseRules = [
              [4, 5, 6],
              [4, 5, 6],
              [4, 5, 6]
            ];
            var _isAllow = that.positionRangeCheck(_position, _portraitRules, _transverseRules);
            if (!_isAllow) {
              console.log('帅只能放置在固定的位置！');
              return;
            }
            break;
          }
        case 'zu':
          {
            var _transverseRules = [1, 3, 5, 7, 9];
            if (_position.portrait < 4) {
              console.log('卒未过河，只能在特定的位置！');
              return;
            }
            if ($.inArray(_position.transverse, _transverseRules) < 0 && 　_position.portrait < 6) {
              console.log('卒未过河，只能在特定的位置！');
              return;
            }
            var _isHas = false;
            if (_position.portrait < 6) {
              $('.chess-board>.piece').each(function() {
                var _this = $(this);
                if (_this.data('role') === 'zu' && _this.data('transverse') === _position.transverse) {
                  if (_this.find('img').eq(0).attr('src').indexOf('normal') > -1) {
                    _isHas = true;
                    console.log('该列已存在卒，不允许设置多个!');
                    return;
                  }
                }
              });
            }
            if (_isHas) {
              return;
            }
            break;
          }
        case 'bing':
          {
            var _transverseRules = [1, 3, 5, 7, 9];
            if (_position.portrait > 7) {
              console.log('兵未过河，只能在特定的位置！');
              return;
            }
            if ($.inArray(_position.transverse, _transverseRules) < 0 && 　_position.portrait > 5) {
              console.log('兵未过河，只能在特定的位置！');
              return;
            }
            var _isHas = false;
            if (_position.portrait > 5) {
              $('.chess-board>.piece').each(function() {
                var _this = $(this);
                if (_this.data('role') === 'zu' && _this.data('transverse') === _position.transverse) {
                  if (_this.find('img').eq(0).attr('src').indexOf('normal') > -1) {
                    _isHas = true;
                    console.log('该列已存在兵，不允许设置多个!');
                    return;
                  }
                }
              });
            }
            if (_isHas) {
              return;
            }
            break;
          }
      }
      that.putPiece(_position);
    },
    positionRangeCheck: function(_position, _portraitRules, _transverseRules) {
      var _portraitIndex = $.inArray(_position.portrait, _portraitRules);
      if (_portraitIndex < 0) {
        return false;
      }
      var _transverseIndex = $.inArray(_position.transverse, _transverseRules[_portraitIndex]);
      if (_transverseIndex < 0) {
        return false;
      }
      return true;
    },
    putPiece: function(_position) {
      var that = this;
      var _selectedPiece = chess.selectedPiece;
      var _targetTemp = that.getSpecicalPoitPiece(_position);
      $(_selectedPiece).css('left', chess.startLeft + (_position.transverse - 1) * chess.chessSpan);
      $(_selectedPiece).css('top', chess.startTop + (_position.portrait - 1) * chess.chessSpan);
      $(_selectedPiece).data('transverse', _position.transverse);
      $(_selectedPiece).data('portrait', _position.portrait);
      if (!$(_selectedPiece).parent().hasClass('chess-board')) {
        $('.chess-board').append(_selectedPiece);
      } else {
        $(_selectedPiece).find('img').eq(0).attr('src', 'image/' + $(_selectedPiece).data('color') + '/normal/' + $(_selectedPiece).data('role') + '.png');
      }
      chess.selectedPiece = null;
    },
    checkMiddlePiece: function(_position, _selectedPiece) {
      var _num = 0;
      var _same = '';
      var _diff = '';
      if (_selectedPiece.data('portrait') === _position.portrait) {
        // 纵向一样检查横向
        _same = 'portrait';
        _diff = 'transverse';

      } else if (_selectedPiece.data('transverse') === _position.transverse) {
        // 横向一样检查纵向
        _same = 'transverse';
        _diff = 'portrait';
      }

      $('.chess-board .piece').each(function() {
        var _this = $(this);
        if (_this.data(_same) === _position[_same]) {
          if (_selectedPiece.data(_diff) > _position[_diff]) {
            if (_this.data(_diff) > _position[_diff] && _this.data(_diff) < _selectedPiece.data(_diff)) {
              _num++;
            }
          } else {
            if (_this.data(_diff) > _selectedPiece.data(_diff) && _this.data(_diff) < _position[_diff]) {
              _num++;
            }
          }
        }
      });

      return _num;
    },
    getSpecicalPoitPiece: function(_position) {
      var _result = null;
      $('.chess-board .piece').each(function() {
        var _this = $(this);
        if (_this.data('transverse') === _position.transverse && _this.data('portrait') === _position.portrait) {
          _result = _this;
          return _this;
        }
      });
      return _result;
    }
  };

  $('#start').on('click', function() {
    $('.chess-board').html('');
    $('.red-box').html('');
    $('.black-box').html('');
    chess.isOver = false;
    chess.initPiece();
  });

  chess.initPiece();

  $('.chess-board').delegate('.piece', 'click', function(e) {
    var that = this;
    if (chess.isStartChessPlan) {
      $(chess.selectedPiece).find('img').eq(0).attr('src', 'image/' + $(chess.selectedPiece).data('color') + '/normal/' + $(chess.selectedPiece).data('role') + '.png');
      chess.selectedPiece = that;
      $(that).find('img').eq(0).attr('src', 'image/' + $(that).data('color') + '/active/' + $(that).data('role') + '.png');
      e.stopPropagation();
    } else {
      var _color = $(that).data('color');
      var _role = $(that).data('role');
      var _transverse = $(that).data('transverse');
      var _portrait = $(that).data('portrait');

      //目标是本身不进行下一步
      if (chess.selectedPiece === that) {
        e.stopPropagation();
        return;
      }

      if (!chess.selectedPiece) {
        if (chess.currentRole != _color) {
          console.log('现在你还不能走棋哦！');
          e.stopPropagation();
          return;
        }
        chess.selectedPiece = that;
        $(that).find('img').eq(0).attr('src', 'image/' + $(that).data('color') + '/active/' + $(that).data('role') + '.png');
        e.stopPropagation();
      } else {
        // 是否吃子是自己的
        if (_color === chess.currentRole) {
          console.log('不能吃自己的棋子！');
          e.stopPropagation();
          return;
        }
        var _position = {
          transverse: _transverse,
          portrait: _portrait
        }

        if ((_position.transverse < 0 || _position.transverse > 9) || (_position.portrait < 1 || _position.portrait > 10)) {
          console.log('不能选择棋盘外的位置！');
        } else {
          chess.checkRunRules(_position);
        }
        e.stopPropagation();
      }
    }
  });

  $('.chess-board').on('click', function(e) {
    var _offsetX = e.offsetX;
    var _offsetY = e.offsetY;
    var _position = chess.CalculationPosition(_offsetX, _offsetY);
    if (!chess.isStartChessPlan) {
      var that = this;
      var _target = e.target;
      if (chess.selectedPiece) {
        if ((_position.transverse < 1 || _position.transverse > 9) || (_position.portrait < 1 || _position.portrait > 10)) {
          console.log('不能选择棋盘外的位置！');
        } else {
          chess.checkRunRules(_position);
        }
      }
    } else {
      // 摆谱
      var _offsetX = e.offsetX;
      var _offsetY = e.offsetY;
      var _position = chess.CalculationPosition(_offsetX, _offsetY);
      chess.checkChessPlan(_position);
    }
  });

  $(document).delegate('[class$="-box"]>.piece', 'click', function() {
    var _this = this;
    if (chess.isStartChessPlan) {
      chess.selectedPiece = _this;
    }
  });

  $('#startChessPlan').on('click', function() {
    $('[name="firstSet"]').removeAttr('disabled');
    $('.chess-board').html('');
    $('.red-box').html('');
    $('.black-box').html('');
    chess.isStartChessPlan = true;
    for (color in chess.pieceInitPositionRules) {
      var diffPiece = chess.pieceInitPositionRules[color];
      for (kind in diffPiece) {
        for (var i = 0; i < diffPiece[kind]['left'].length; i++) {
          var _src = 'image/' + color + '/normal/' + kind + '.png';
          var _html = '<div class="piece"><img src="' + _src + '" /></div>';
          var html = $(_html);
          html.data('role', kind);
          html.data('color', color);
          html.data('transverse', diffPiece[kind]['left'][i] + 1);
          html.data('portrait', diffPiece[kind]['top'] + 1);
          var _target = '.' + color + '-box';
          $(_target).append(html);
        }
      }
    }
  });

  $('#endChessPlan').on('click', function() {
    $('[name="firstSet"]').attr('disabled', 'disabled');
    chess.currentRole = $('[name="firstSet"]:checked').val();
    chess.isStartChessPlan = false;
  });

  // 右键事件
  $("body").on("contextmenu", function() {
    var that = chess.selectedPiece;
    if (chess.isStartChessPlan) {
      if (that) {
        $(that).find('img').eq(0).attr('src', 'image/' + $(that).data('color') + '/normal/' + $(that).data('role') + '.png');
        var _color = $(that).data('color');
        var _boxName = '.' + _color + '-box';
        $(_boxName).append(that);
        chess.selectedPiece = null;
      }
    } else {
      if (that) {
        $(that).find('img').eq(0).attr('src', 'image/' + $(that).data('color') + '/normal/' + $(that).data('role') + '.png');
        chess.selectedPiece = null;
      }
    }
    return false;
  });
});
