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
    targetPiece: null,
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
    // 计算棋子应该所在位置
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
    // 条件符合，棋子跳动
    runPiece: function(_position) {
      var _selectedPiece = chess.selectedPiece;
      $(_selectedPiece).css('left', chess.startLeft + (_position.transverse - 1) * chess.chessSpan);
      $(_selectedPiece).css('top', chess.startTop + (_position.portrait - 1) * chess.chessSpan);
      if (chess.targetPiece) {
        var _target = chess.targetPiece;
        var target = $(_target);
        var _color = target.data('color');
        var _name = '.' + _color + '-box';
        $(_name).append(chess.targetPiece);
      }
      $(_selectedPiece).data('transverse', _position.transverse);
      $(_selectedPiece).data('portrait', _position.portrait);
      chess.selectedPiece = null;
      chess.targetPiece = null;
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
      var _num = 0;
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
            console.log('你只能走日字形！')
            break;
          }
        case 'xiang':
          {
            console.log('你只能走田字形，不能过河，不能别别着！')
            break;
          }
        case 'shi':
          {
            console.log('你只能走在田子格里边，只能斜着走不能直着走！')
            break;
          }
        case 'jiang':
          {
            console.log('你只能一步步直着走，不能出米字格！')
            break;
          }
        case 'shuai':
          {
            console.log('你只能一步步直着走，不能出米字格！')
            break;
          }
        case 'pao':
          {
            console.log('你不吃子时只能直着走，吃子必须隔层山！')
            break;
          }
        case 'bing':
          {
            console.log('你只能往前，不能往后，不过河只能前进不能左右移，过河之后可以左右移！')
            break;
          }
        case 'zu':
          {
            console.log('你只能往前，不能往后，不过河只能前进不能左右移，过河之后可以左右移！')
            break;
          }
      }
      chess.runPiece(_position);
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
    }
  };

  $('#start').on('click', function() {
    $('.chess-board').html('');
    chess.initPiece();
  });

  chess.initPiece();

  $('.chess-board').delegate('.piece', 'click', function(e) {
    var that = this;
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
      chess.targetPiece = that;
      chess.checkRunRules(_position);
      e.stopPropagation();
    }

  });

  $('.chess-board').on('click', function(e) {
    var that = this;
    var _target = e.target;
    if (chess.selectedPiece) {
      var _offsetX = e.offsetX;
      var _offsetY = e.offsetY;
      var _position = chess.CalculationPosition(_offsetX, _offsetY);

      chess.checkRunRules(_position);
    }
  });
});
