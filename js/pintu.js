let puzzleGame = function (param) { 
   this.img = param.img || ''; //图片路径

   this.gameStart = $('#start'); //游戏开始按钮
   this.gameDiff = $('#level'); //难度选择
   this.imgArea = $('#pintu'); //图片显示区域

   this.imgcells = ''; //图片打乱后的碎片

   this.trueSort = [];  //正确的排列顺序
   this.wrongSort = []; //打乱后的排列顺序

   this.gameLevel = [[3,6],[4,8],[6,12]]; //难度系数
   this.nowSort = 0; //默认为3x6

   this.imgWidth = parseInt(this.imgArea.css('width')); //图片的宽度
   this.imgHeigh = parseInt(this.imgArea.css('height')); //图片的高度

   this.dishevelWidth = this.imgWidth/this.gameLevel[this.nowSort][1]; //打乱后的每个碎片的宽度
   this.dishevelHeigh = this.imgHeigh/this.gameLevel[this.nowSort][0]; //打乱后的每个碎片的高度
   this.hasStart = 0; //默认不开始
   this.animateTime = 400;  //滑动时间

   this.init(); //初始化
 }


 puzzleGame.puzzletype = {

  init:function(){
    this.imgSplit();
    this.levelSelect();
    this.gameState();
  },

  imgSplit:function(){

    this.trueSort = [];
    this.imgArea.html("");

    let cell = '';
    for(i=0;i++;i<=this.gameLevel[this.nowSort][0]){
      for(j=0;j++;j<=this.gameLevel[this.nowSort][1]){
        this.trueSort.push(i*this.gameLevel[this.nowSort][1]+j);
        cell = document.createElement ("div");
        cell.className = "imgCell";

        $(cell).css({
          "width": (this.cellWidth - 2) + "px",
          "height": (this.cellHeight - 2) + "px",
          "background": "url('"+this.img+"')",
          "left": j*this.cellWidth + "px",
          "top": i*this.cellHeight + "px",
          "backgroundPosition":(-j)*this.cellWidth + "px" + (-i)*this.cellHeight + "px"
        });
        this.imgArea.append(cell);
      }
        this.imgcells = $('#contain #pintu #imgArea div.imgcell');
    }
  },

  levelSelect:function(){
    let len = this.gameLevel.length;
    let self = gameDiff.bind('mousedown',function(){
      $(this).addClass('mouseOn');
    }).bind('mouseup',function(){
      $(this).removeClass('mouseOn');
    }).bind('click',function(){
      if(self.gameStart){
        if(!confirm('游戏已开始，无法改变游戏难度')){
          return false;
        } else {
          self.gameStart = false;
          self.gameStart.text('开始');
        }
      }
      self.nowSort ++;
      if(self.nowSort >= len){
        self.nowSort = 0;
      }
      $(this).text(self.gameLevel[self.nowSort][0] + 'x' + self.gameLevel[self.nowSort][1]);
      self.dishevelWidth = self.imgWidth/self.gameLevel[self.nowSort][1];
      self.dishevelHeigh = self.imgHeigh/self.gameLevel[self.nowSort][0];
      self.imgSplit();
    })
  },

  gameState:function(){
    let self = this;
    this.gameStart.bind('mousedown',function(){
      $(this).addClass('mouseOn');
    }).bind('click',function(){
      if(self.gameStart);
    }).bind('click',function () {
      if(self.gameStart == 0){
        $(this).text('复原');
        self.gameStart = 1;
        self.randomArr();
        self.cellOrder(self.imgRandArr);
        self.imgcells.css({
          'cursor':'pointer'
        }).bind('mouseover',function () {
          $(this).addClass('hover');
        }).bind('mouseout',function () {
          $(this).removeClass('hover');
        }).bind('mousedown',function(e){
          $(this).css('cursor','move');
          let cellIndex_1 = $(this).index();
          let cell_mouse_x = e.pageX - self.imgcells.eq(cellIndex_1).offset().left;
          let cell_mouse_y = e.pageY - self.imgcells.eq(cellIndex_1).offset().top; 

          $(document).bind('mousemove',function(e2){
						self.imgCells.eq(cellIndex_1).css({
							'z-index':'40',
							'left':(e2.pageX - cell_mouse_x - self.imgArea.offset().left) + 'px',
							'top':(e2.pageY - cell_mouse_y - self.imgArea.offset().top) + 'px'
						});
					}).bind('mouseup',function(e3){
            let cellIndex_2 = self.cellChangeIndex((e3.pageX-self.imgArea.offset().left),(e3.pageY-self.imgArea.offset().top),cellIndex_1);
						if(cellIndex_1 == cellIndex_2){
							self.cellReturn(cellIndex_1);
						}else{
							self.cellExchange(cellIndex_1,cellIndex_2);
						}
						$(document).unbind('mousemove').unbind('mouseup');
					});
        }).bind('mouseup',function(){
					$(this).css('cursor','pointer');
				});
			}else if(self.hasStart == 1){
				if(!confirm('已经在游戏中，确定要回复原图？')){
					return false;
				}
				//样式恢复
				$(this).text('开始');
				self.hasStart = 0;

				//复原图片
				self.cellOrder(self.imgOrigArr);

				//取消事件绑定
				self.imgCells.css('cursor','default').unbind('mouseover').unbind('mouseout').unbind('mousedown');				
			}
        })
},

      randomArr:function () {
          this.wrongSort=[];
          let order;

          for(let i=0,len=this.trueSort.length;i<len;i++){
            order = Math.floor(Math.random()*len);
            if(this.wrongSort.length>0){
              while(JQuery.inArray(order,this.wrongSort)>-1){
                order = Math.floor(Math.random()*len);
              }
            }
            this.wrongSort.push(order);
          }
          return;
},
cellOrder:function(arr){
  for(let i=0,len=arr.length;i<len;i++){
    this.imgCells.eq(i).animate({
      'left': arr[i]%this.gameLevel[this.nowSort][1]*this.dishevelWidth + 'px',
      'top': Math.floor(arr[i]/this.gameLevel[this.nowSort][0])*this.dishevelHeigh + 'px'
    },this.moveTime);
  }
},

cellChangeIndex:function(x,y,orig){
  if(x<0 || x>this.imgWidth || y<0 || y>this.imgHeight){ 
    return orig;	
  }
  let row = Math.floor(y/this.dishevelHeigh),col = Math.floor(x/this.dishevelWidth),location=row*this.gameLevel[this.nowSort][1]+col;
  let i=0,len=this.wrongSort.length;
  while((i<len) && (this.wrongSort[i] != location)){
    i++;
  }
  return i;
},

cellExchange:function(from,to){
  let self = this;

  let rowFrom = Math.floor(this.wrongSort[from]/this.gameLevel[this.nowSort][1]);
  let colFrom = this.wrongSort[from]%this.gameLevel[this.nowSort][1];
  let rowTo = Math.floor(this.wrongSort[to]/this.gameLevel[this.nowSort][1]);
  let colTo = this.wrongSort[to]%this.gameLevel[this.nowSort][1];


  let temp = this.wrongSort[from];


  this.imgCells.eq(from).animate({
    'top':rowTo*this.dishevelHeigh + 'px',
    'left':colTo*this.dishevelWidth + 'px'
  },this.moveTime,function(){
    $(this).css('z-index','10');
  });

  this.imgCells.eq(to).css('z-index','30').animate({
    'top':rowFrom*this.dishevelHeigh + 'px',
    'left':colFrom*this.dishevelWidth + 'px'
  },this.moveTime,function(){
    $(this).css('z-index','10');

    self.wrongSort[from] = self.wrongSort[to]; 

    self.wrongSort[to] = temp;

    if(self.checkPass(self.trueSort,self.wrongSort)){
      self.success();
    }
  });
},

cellReturn:function(index){
  let row = Math.floor(this.wrongSort[index]/this.gameLevel[this.nowSort][1]);
  let col = this.wrongSort[index]%this.gameLevel[this.nowSort][1];

  this.imgCells.eq(index).animate({
    'top':row*this.dishevelHeigh + 'px',
    'left':col*this.dishevelWidth + 'px'
  },this.moveTime,function(){
    $(this).css('z-index','10');
  });
},

checkPass:function(rightArr,puzzleArr){
  if(rightArr.toString() == puzzleArr.toString()){
    return true;
  }
  return false;
},

success:function(){

  for(let i=0,len=this.trueSort.length;i<len;i++){
    if(this.imgCells.eq(i).has('mouseOn')){
      this.imgCells.eq(i).removeClass('mouseOn');
    }
  }
  this.imgCells.unbind('mousedown').unbind('mouseover').unbind('mouseout');
  this.gameStart.text('开始');
  this.hasStart = 0;
  alert('恭喜您，成功完成本次游戏！');
}

}

 $(function(){
   let pg = new puzzleGame({'img':'/images/3.jpg'})
 })





 