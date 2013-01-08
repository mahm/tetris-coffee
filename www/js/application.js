var Block, Map, Rect, block, intervalId, map, paper, positionX, positionY;

paper = Raphael(0, 0, 500, 500);

Rect = (function() {

  function Rect(x, y) {
    this.impl = paper.rect(0, 0, 20, 20).attr({
      fill: 'pink',
      stroke: '#ff8888'
    });
    this.move(x, y);
  }

  Rect.prototype.move = function(x, y) {
    this.x = x;
    this.y = y;
    return this.impl.attr({
      x: this.x * 20,
      y: this.y * 20
    });
  };

  Rect.prototype.die = function() {
    return this.impl.attr({
      fill: '#888888',
      stroke: '#444444'
    });
  };

  Rect.prototype.remove = function() {
    return this.impl.remove();
  };

  return Rect;

})();

Block = (function() {

  Block.prototype.blocks = [[[1, 1], [0, 1], [0, 1]], [[1, 1], [1, 0], [1, 0]], [[1, 1], [1, 1]], [[1, 0], [1, 1], [1, 0]], [[1, 0], [1, 1], [0, 1]], [[0, 1], [1, 1], [1, 0]], [[1], [1], [1], [1]]];

  function Block() {
    var array, choosedBlock, elem, x, y, _i, _j, _len, _len1;
    choosedBlock = this.blocks[Math.floor(Math.random() * this.blocks.length)];
    this.block = [];
    this.block.length = choosedBlock.length;
    for (y = _i = 0, _len = choosedBlock.length; _i < _len; y = ++_i) {
      array = choosedBlock[y];
      this.block[y] = [];
      for (x = _j = 0, _len1 = array.length; _j < _len1; x = ++_j) {
        elem = array[x];
        this.block[y][x] = elem ? new Rect(x, y) : null;
      }
    }
  }

  Block.prototype.move = function(offsetX, offsetY) {
    this.x = offsetX;
    this.y = offsetY;
    return this.eachRect(function(rect, x, y) {
      if (rect) {
        return rect.move(x + offsetX, y + offsetY);
      }
    });
  };

  Block.prototype.die = function() {
    return this.eachRect(function(rect) {
      if (rect) {
        return rect.die();
      }
    });
  };

  Block.prototype.eachRect = function(fn) {
    var array, rect, x, y, _i, _len, _ref, _results;
    _ref = this.block;
    _results = [];
    for (y = _i = 0, _len = _ref.length; _i < _len; y = ++_i) {
      array = _ref[y];
      _results.push((function() {
        var _j, _len1, _results1;
        _results1 = [];
        for (x = _j = 0, _len1 = array.length; _j < _len1; x = ++_j) {
          rect = array[x];
          _results1.push(fn(rect, x, y));
        }
        return _results1;
      })());
    }
    return _results;
  };

  Block.prototype.calcRotate = function() {
    var rotated, rotatedX, rotatedY, x, y, _i, _j, _ref, _ref1;
    rotated = [];
    for (x = _i = 0, _ref = this.block[0].length - 1; 0 <= _ref ? _i <= _ref : _i >= _ref; x = 0 <= _ref ? ++_i : --_i) {
      rotatedX = x;
      rotated[rotatedX] = [];
      for (y = _j = 0, _ref1 = this.block.length - 1; 0 <= _ref1 ? _j <= _ref1 : _j >= _ref1; y = 0 <= _ref1 ? ++_j : --_j) {
        rotatedY = this.block.length - y - 1;
        rotated[rotatedX][rotatedY] = this.block[y][x];
      }
    }
    return rotated;
  };

  Block.prototype.rotate = function() {
    this.block = this.calcRotate();
    return this.eachRect(function(rect, x, y) {
      if (rect) {
        return rect.move(x, y);
      }
    });
  };

  return Block;

})();

Map = (function() {

  function Map() {
    var x, y, _i;
    this.map = [];
    for (y = _i = 0; _i <= 19; y = ++_i) {
      this.map[y] = (function() {
        var _j, _results;
        _results = [];
        for (x = _j = 0; _j <= 9; x = ++_j) {
          _results.push(0);
        }
        return _results;
      })();
    }
    this.impl = paper.rect(0, 0, 10 * 20, 20 * 20).attr({
      stroke: '#cccccc',
      fill: '#cccccc'
    });
  }

  Map.prototype.check = function(block, offsetX, offsetY) {
    var x, y, _i, _j, _ref, _ref1;
    if (offsetX < 0 || offsetY < 0) {
      return false;
    }
    for (y = _i = 0, _ref = block.length - 1; 0 <= _ref ? _i <= _ref : _i >= _ref; y = 0 <= _ref ? ++_i : --_i) {
      if (y + offsetY >= this.map.length) {
        return false;
      }
      for (x = _j = 0, _ref1 = block[y].length - 1; 0 <= _ref1 ? _j <= _ref1 : _j >= _ref1; x = 0 <= _ref1 ? ++_j : --_j) {
        if (x + offsetX >= this.map[y].length) {
          return false;
        }
        if (block[y][x] && this.map[y + offsetY][x + offsetX]) {
          return false;
        }
      }
    }
    return true;
  };

  Map.prototype.margeBlock = function(block) {
    var x, y, _i, _ref, _results;
    _results = [];
    for (y = _i = 0, _ref = block.block.length - 1; 0 <= _ref ? _i <= _ref : _i >= _ref; y = 0 <= _ref ? ++_i : --_i) {
      _results.push((function() {
        var _j, _ref1, _results1;
        _results1 = [];
        for (x = _j = 0, _ref1 = block.block[y].length - 1; 0 <= _ref1 ? _j <= _ref1 : _j >= _ref1; x = 0 <= _ref1 ? ++_j : --_j) {
          if (block.block[y][x]) {
            _results1.push(this.map[y + block.y][x + block.x] = block.block[y][x]);
          } else {
            _results1.push(void 0);
          }
        }
        return _results1;
      }).call(this));
    }
    return _results;
  };

  Map.prototype.clearRow = function() {
    var cy, rect, x, y, _i, _j, _ref, _ref1, _results;
    _results = [];
    for (y = _i = 0, _ref = this.map.length - 1; 0 <= _ref ? _i <= _ref : _i >= _ref; y = 0 <= _ref ? ++_i : --_i) {
      if (((function() {
        var _j, _ref1, _results1;
        _results1 = [];
        for (x = _j = 0, _ref1 = this.map[y].length - 1; 0 <= _ref1 ? _j <= _ref1 : _j >= _ref1; x = 0 <= _ref1 ? ++_j : --_j) {
          if (!this.map[y][x]) {
            _results1.push(x);
          }
        }
        return _results1;
      }).call(this)).length > 0) {
        continue;
      }
      for (x = _j = 0, _ref1 = this.map[y].length - 1; 0 <= _ref1 ? _j <= _ref1 : _j >= _ref1; x = 0 <= _ref1 ? ++_j : --_j) {
        this.map[y][x].remove();
        this.map[y][x] = null;
      }
      _results.push((function() {
        var _k, _ref2, _results1;
        _results1 = [];
        for (cy = _k = _ref2 = y - 1; _ref2 <= 0 ? _k <= 0 : _k >= 0; cy = _ref2 <= 0 ? ++_k : --_k) {
          _results1.push((function() {
            var _l, _ref3, _results2;
            _results2 = [];
            for (x = _l = 0, _ref3 = this.map[cy].length - 1; 0 <= _ref3 ? _l <= _ref3 : _l >= _ref3; x = 0 <= _ref3 ? ++_l : --_l) {
              rect = this.map[cy][x];
              if (rect) {
                this.map[cy + 1][x] = rect;
                this.map[cy][x] = null;
                _results2.push(rect.move(x, cy + 1));
              } else {
                _results2.push(void 0);
              }
            }
            return _results2;
          }).call(this));
        }
        return _results1;
      }).call(this));
    }
    return _results;
  };

  return Map;

})();

positionX = 0;

positionY = 0;

map = new Map;

block = new Block;

intervalId = setInterval(function() {
  positionY += 1;
  if (map.check(block.block, positionX, positionY)) {
    block.move(positionX, positionY);
  } else {
    block.die();
    map.margeBlock(block);
    map.clearRow();
    block = new Block();
    positionX = 0;
    positionY = 0;
    if (!map.check(block.block, positionX, positionY)) {
      clearInterval(intervalId);
    }
  }
  return true;
}, 1000);

this.key = function(keyCode) {
  switch (keyCode) {
    case 38:
      if (!map.check(block.calcRotate(), positionX, positionY)) {
        return;
      }
      block.rotate();
      break;
    case 39:
      if (!map.check(block.block, positionX + 1, positionY)) {
        return;
      }
      positionX += 1;
      break;
    case 37:
      if (!map.check(block.block, positionX - 1, positionY)) {
        return;
      }
      positionX -= 1;
      break;
    case 40:
      if (!map.check(block.block, positionX, positionY + 1)) {
        return;
      }
      positionY += 1;
  }
  return block.move(positionX, positionY);
};
