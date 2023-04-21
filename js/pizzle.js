let pizzlGame = function (param) {
   // 图片
   this.img = param.img || '';
   console.log(this.img)
   // 开始
   this.gameStart = $('#contain #rule #start');
   console.log(this.gameStart.text())
   // 游戏难度
   this.gameLever = $('#contain #rule #level');
   console.log(this.gameLever.text())
   // 图片显示区域
   this.imgArea = $('#contain #pintu #imgArea');
   console.log(this.imgArea.css('height'),this.imgArea.css('width'))
   // 难度数组
   this.gameLeverArr = [[3,3],[4,4],[5,5],[6,6]];
   // 当前显示的难度
   this.nowLevel = 0;
   // 图片的高度
   this.imgHeight = parseInt(this.imgArea.css('height'));
   console.log(this.imgHeight,111)
   // 图片的宽度
   this.imgWidth = parseInt(this.imgArea.css('width'));
   console.log(this.imgWidth,222)
   // 记录碎片节点的变量
   this.imgcells = '';
   console.log(this.imgcells,"记录碎片节点的变量")
   // 正确的排列顺序数组
   this.tureArr = [];
   console.log(this.tureArr,"ture")
   // 错误的排列顺序数组
   this.wrongArr = [];
   console.log(this.wrongArr,"wrong")
   // 默认显示游戏不开始
   this.hasStart =0;
   // 移动碎片的动画时长
   this.cellsTime = 400;
   // 碎片的宽度
   this.cellsWidth =  this.imgWidth/this.gameLeverArr[this.nowLevel][1];
   console.log(this.cellsWidth,"碎片宽度")
   // 碎片的高度
   this.cellsHeight = this.imgHeight/this.gameLeverArr[this.nowLevel][0];
   console.log(this.cellsHeight,"碎片高度")
   // 初始化变量
   this.init();
}


pizzlGame.prototype = {
   // 初始化
   init:function(){
      this.imgSplit();
      this.levelSelect();
      this.gameState();
   },

   // 小碎片
   imgSplit:function(){
      this.tureArr = [];
      this.imgArea.html("");

      let cell = '';
      for(i=0;i++;i<=this.gameLeverArr[this.nowLevel][0]){
         for(j=0;j++;j<=this.gameLeverArr[this.nowLevel][1]){
            this.tureArr.push(i*this.gameLeverArr[this.nowLevel][1]+j);
            cell = document.createElement('div');
            cell.className = 'imgcell';

            $(cell).css({
               'width': (this.cellsWidth -2) + 'px',
               'height': (this.cellsHeight -2) + 'px',
               'background': 'url("'+this.img+'")',
               'left': j*this.cellsWidth + 'px',
               'top': i*this.cellsHeight + 'px',
               'backgroundPosition': (-j)*this.cellsWidth + 'px',
               'border': '1px solid #000000'
            });
            this.imgArea.append(cell);
         }
         this.imgcells = $('#contain #pintu #imgArea div.imgcell');
      }
   },

   // 游戏难度选择
   levelSelect:function () { 
      let len = this.gameLeverArr.length;
      console.log(len)
      let self = this;
      console.log(self)
      this.gameLever.bind('mousedown',function(){
         $(this).addClass('mouseOn');
      }).bind('mouseup',function(){
         $(this).removeClass('mouseOn');
      }).bind('click',function () { 
         if(self.hasStart){
            if(!confirm('游戏进行中无法改变游戏难度')){
               return false;
            } else {
               self.hasStart = false;
               self.gameStart.text('开始');
            }
         }
         self.nowLevel++;
         if(self.nowLevel >= len){
            self.nowLevel = 0;
         }
         $(this).text(self.gameLeverArr[self.nowLevel][0] + 'x' + self.gameLeverArr[self.nowLevel][1]);
         console.log(self.gameLeverArr[self.nowLevel][0])
         self.cellsWidth = self.imgWidth/self.gameLeverArr[self.nowLevel][1];
         self.cellsHeight = self.imgHeight/self.gameLeverArr[self.nowLevel][0];
         self.imgSplit();
       })
    },

   //  游戏开始或结束状态
    gameState:function(){
      let self = this;
      this.gameStart.bind('mousedown',function(){
         $(this).addClass('mouseOn');
      }).bind('click',function(){
         $(this).removeClass('mouseOn');
      }).bind('click',function(){
         if(self.hasStart == 0){
            $(this).text('复原');
            self.hasStart = 1;
            self.randomArr();
            self.cellOrder(self.wrongArr);
            self.imgcells.css({
               'cursor': 'pointer' 
            }).bind('mouseover',function(){
               $(this).addClass('hover');
            }).bind('mouseout',function(){
               $(this).removeClass('hover');
            }).bind('mousedown',function(e){
               $(this).css('cursor','move');
               let cellIndex_1 = $(this).index();
               console.log(cellIndex_1,"小碎片下标")
               let cell_mouse_x = e.pageX - self.imgcells.eq(cellIndex_1).offset().left;
               let cell_mouse_y = e.pageY - self.imgcells.eq(cellIndex_1).offset().top; 

               $(document).bind('mousemove',function(e2){
                  self.imgcells.eq(cellIndex_1).css({
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
            })
         } else if(self.hasStart == 1){
            if(!confirm('游戏已开始，确定要恢复原图吗')){
               return false;
            }
            //样式恢复
				$(this).text('开始');
				self.hasStart = 0;

				//复原图片
				self.cellOrder(self.tureArr);

				//取消事件绑定
				self.imgCells.css('cursor','default').unbind('mouseover').unbind('mouseout').unbind('mousedown');				
         }
      })
    },

    randomArr:function(){
      this.wrongArr=[];
          let order;
          console.log(this.tureArr.length,111)
          for(let i=0,len=this.tureArr.length;i<len;i++){
            order = Math.floor(Math.random()*len);
            if(this.wrongArr.length>0){
              while(jQuery.inArray(order,this.wrongArr)>-1){
                order = Math.floor(Math.random()*len);
              }
            }
            this.wrongArr.push(order);
          }
          return;
    },

    cellOrder:function(arr){
      for(let i=0,len=arr.length;i<len;i++){
        this.imgCells.eq(i).animate({
          'left': arr[i]%this.gameLeverArr[this.nowLevel][1]*this.cellsWidth + 'px',
          'top': Math.floor(arr[i]/this.gameLeverArr[this.nowLevel][0])*this.cellsHeight + 'px'
        },this.moveTime);
      }
    },

    cellChangeIndex:function(x,y,orig){
      if(x<0 || x>this.imgWidth || y<0 || y>this.imgHeight){ 
        return orig;	
      }
      let row = Math.floor(y/this.cellsHeight),col = Math.floor(x/this.cellsWidth),location=row*this.gameLeverArr[this.nowSort][1]+col;
      let i=0,len=this.wrongArr.length;
      while((i<len) && (this.wrongArr[i] != location)){
        i++;
      }
      return i;
    },

    cellExchange:function(from,to){
      let self = this;
    
      let rowFrom = Math.floor(this.wrongArr[from]/this.gameLeverArr[this.nowLevel][1]);
      let colFrom = this.wrongArr[from]%this.gameLeverArr[this.nowLevel][1];
      let rowTo = Math.floor(this.wrongArr[to]/this.gameLeverArr[this.nowLevel][1]);
      let colTo = this.wrongArr[to]%this.gameLeverArr[this.nowLevel][1];
    
    
      let temp = this.wrongArr[from];
    
    
      this.imgCells.eq(from).animate({
        'top':rowTo*this.cellsHeight + 'px',
        'left':colTo*this.cellsWidth + 'px'
      },this.moveTime,function(){
        $(this).css('z-index','10');
      });
    
      this.imgCells.eq(to).css('z-index','30').animate({
        'top':rowFrom*this.cellsHeight + 'px',
        'left':colFrom*this.cellsWidth + 'px'
      },this.moveTime,function(){
        $(this).css('z-index','10');
    
        self.wrongArr[from] = self.wrongArr[to]; 
    
        self.wrongArr[to] = temp;
    
        if(self.checkPass(self.tureArr,self.wrongArr)){
          self.success();
        }
      });
    },

    cellReturn:function(index){
		let row = Math.floor(this.wrongArr[index]/this.gameLeverArr[this.nowLevel][1]);
		let col = this.wrongArr[index]%this.gameLeverArr[this.nowLevel][1];

		this.imgCells.eq(index).animate({
			'top':row*this.cellsHeight + 'px',
			'left':col*this.cellsWidth + 'px'
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
    
      for(let i=0,len=this.tureArr.length;i<len;i++){
        if(this.imgCells.eq(i).hasClass('mouseOn')){
          this.imgCells.eq(i).removeClass('mouseOn');
        }
      }
      this.imgCells.unbind('mousedown').unbind('mouseover').unbind('mouseout');
      this.gameStart.text('开始');
      this.hasStart = 0;
      alert('恭喜您，成功完成本次游戏！');
    }

}

// 图片初始化
$(function(){
   let pg = new pizzlGame({
      'img':'/pizzle-/images/1.jpg'
   })
   // console.log(pg)
})