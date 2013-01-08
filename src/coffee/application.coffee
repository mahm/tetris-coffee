class Rect
  constructor: (x, y) ->
    @impl = paper.rect(0, 0, 20, 20).attr(fill: 'pink', stroke: '#ff8888')
    @move(x, y)

  move: (x, y) ->
    @impl.attr(x: x * 20, y: y * 20)

  die: ->
    @impl.attr(fill: '#888888', stroke: '#444444')

  remove: ->
    @impl.remove()

class Block
  blocks: [
    [
      [1,1],
      [0,1],
      [0,1]
    ],
    [
      [1,1],
      [1,0],
      [1,0]
    ],
    [
      [1,1],
      [1,1]
    ],
    [
      [1,0],
      [1,1],
      [1,0]
    ],
    [
      [1,0],
      [1,1],
      [0,1]
    ],
    [
      [0,1],
      [1,1],
      [1,0]
    ],
    [
      [1],
      [1],
      [1],
      [1]
    ]
  ]
  constructor: ->
    choosedBlock = @blocks[Math.floor(Math.random() * @blocks.length)]
    @block = []
    @block.length = choosedBlock.length
    for array, y in choosedBlock
      @block[y] = []
      for elem, x in array
        @block[y][x] = if elem then new Rect(x, y) else null

  move: (offsetX, offsetY) ->
    @x = offsetX
    @y = offsetY
    @eachRect (rect, x, y) ->
      rect.move(x + offsetX, y + offsetY) if rect

  die: ->
    @eachRect (rect) ->
      rect.die() if rect

  eachRect: (fn) ->
    for array, y in @block
      for rect, x in array
        fn(rect, x, y)

  calcRotate: ->
    rotated = []
    for x in [0..@block[0].length - 1]
      rotatedX = x
      rotated[rotatedX] = []
      for y in [0..@block.length - 1]
        rotatedY = @block.length - y - 1
        rotated[rotatedX][rotatedY] = @block[y][x]
    rotated

  rotate: ->
    @block = @calcRotate()
    @eachRect (rect, x, y) ->
      rect.move(x, y) if rect

class Map
  constructor: ->
    @map = []
    for y in [0..19]
      @map[y] = (0 for x in [0..9])
    @impl = paper.rect(0, 0, 10 * 20, 20 * 20).attr(stroke: '#cccccc', fill: '#cccccc')

  check: (block, offsetX, offsetY) ->
    return false if offsetX < 0 or offsetY < 0
    for y in [0..block.length - 1]
      return false if (y + offsetY >= @map.length)
      for x in [0..block[y].length - 1]
        return false if (x + offsetX >= @map[y].length)
        return false if (block[y][x] and @map[y + offsetY][x + offsetX])
    return true

  margeBlock: (block) ->
    for y in [0..block.block.length - 1]
      for x in [0..block.block[y].length - 1]
        @map[y + block.y][x + block.x] = block.block[y][x] if block.block[y][x]

  clearRow: ->
    for y in [0..@map.length - 1]
      # その列が消える行かを判定
      continue if (x for x in [0..@map[y].length - 1] when !@map[y][x]).length > 0
      # 消す処理
      for x in [0..@map[y].length - 1]
        @map[y][x].remove(); @map[y][x] = null
      # 一段下げる処理
      for cy in [(y - 1)..0]
        for x in [0..@map[cy].length - 1]
          rect = @map[cy][x]
          if rect
            @map[cy + 1][x] = rect
            @map[cy][x] = null
            rect.move(x, cy + 1)

positionX = 0; positionY = 0
paper = Raphael(0, 0, 500, 500)
map = new Map
block = new Block
intervalId = setInterval ->
  positionY += 1
  if map.check(block.block, positionX, positionY)
    block.move(positionX, positionY)
  else
    block.die()
    map.margeBlock(block)
    map.clearRow()
    block = new Block()
    positionX = 0; positionY = 0
    unless map.check(block.block, positionX, positionY)
      clearInterval(intervalId)
  true
, 800

@key = (keyCode) ->
  switch keyCode
    when 38
      return unless map.check(block.calcRotate(), positionX, positionY)
      block.rotate()
    when 39
      return unless map.check(block.block, positionX + 1, positionY)
      positionX += 1
    when 37
      return unless map.check(block.block, positionX - 1, positionY)
      positionX -= 1
    when 40
      return unless map.check(block.block, positionX, positionY + 1)
      positionY += 1

  block.move(positionX, positionY)
