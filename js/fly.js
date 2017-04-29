
var nOfFlies = 20;
var flies = [];

var innerWidth = window.innerWidth;
var innerHeight = window.innerHeight;
var defaultFlyWidth = 40;
var defaultFlyHeight = 20;
var flyChildDifference = 10;

var svgContainer = d3.select('body')
					.append('svg')
					.attr('width','100%')
					.attr('height','100%')


function generateRandomPositionedFly(){
    
    var scale = Math.ceil(Math.random()*2)
    var width = defaultFlyWidth * scale;
    var height = defaultFlyHeight * scale;
    var maxXPosition = (innerWidth - width);
    var maxYPosition = (innerHeight - width);// width because considering rotation
    var posX = Math.round(Math.random() * maxXPosition);
    var posY = Math.round(Math.random() * maxYPosition)
    var rotation = Math.round(Math.random()*360);
	
    return {
		x: posX,
		y: posY,
        w: width,
        h: height,
        r: rotation
	}
}

function populateFlies(nOfFlies){
    
    for(var i=0;i<nOfFlies;i++){
	
        var flyOptions = generateRandomPositionedFly();

        flies.push({
            x: flyOptions.x,
            y: flyOptions.y,
            w: flyOptions.w,
            h: flyOptions.h,
            r: flyOptions.r
        })
    }
    
    svgContainer
	.selectAll('image')
	.data(flies)
	.enter()
	.append("svg:image")
	.attr('xlink:href',"img/fly.svg")
	.attr('width',function(fly){
		return fly.w;
	})
	.attr('height',function(fly){
		return fly.h;
	})
	.attr('posX',function(fly){
		return fly.x;
	})
	.attr('posY',function(fly){
		return fly.y;
	})
	.attr('rotation',function(fly){
		return fly.r;
	})
	.attr('transform',function(fly){
		return 'translate('+fly.x+','+fly.y+') rotate('+fly.r+','+(fly.w/2)+','+(fly.h/2)+')';
	})
	.on('click',function(){
		
		var clickedFly = d3.select(this);
		splitFly(clickedFly);
	})
}

populateFlies(nOfFlies);

/*flies = [{x:10,y:200,r:90,w:defaultFlyWidth * 2,h:defaultFlyHeight*2},
        {x:300,y:10,r:90,w:defaultFlyWidth * 2,h:defaultFlyHeight*2},
        {x:650,y:200,r:90,w:defaultFlyWidth * 2,h:defaultFlyHeight*2},
        {x:300,y:930,r:90,w:defaultFlyWidth * 2,h:defaultFlyHeight*2}]
*/

function onClickFly(clickedFly){

	splitFly(clickedFly);
}

function splitFly(clickedFly){
    
	var newRandomLayoutForFlyChilds = generateNearbyFlies(clickedFly);
    
    //check if clickedFly is too small to generate childs
    if(newRandomLayoutForFlyChilds){
        
        var firstFlyChildOptions = newRandomLayoutForFlyChilds.firstFlyChild;
        var secondFlyChildOptions = newRandomLayoutForFlyChilds.secondFlyChild;
        
        clickedFly.remove();

        newChild(firstFlyChildOptions);
        newChild(secondFlyChildOptions);
    }
}

function newChild(flyChildOptions){
    
    svgContainer
		.append("svg:image")
		.attr('xlink:href',"img/fly.svg")
		.attr('width',flyChildOptions.w)
		.attr('height',flyChildOptions.h)
		.attr('posX',flyChildOptions.x)
		.attr('posY',flyChildOptions.y)
		.attr('rotation',flyChildOptions.r)
		.attr('transform','translate('+flyChildOptions.x+','+flyChildOptions.y+') rotate('+flyChildOptions.r+','+(flyChildOptions.w/2)+','+(flyChildOptions.h/2)+')')
		.on('click',function(){

			var clickedFly = d3.select(this)

			onClickFly(clickedFly)
		})
}

function generateNearbyFlies(clickedFly){
	
    if(!clickedFly){
        return null
    }
    
    var clickedFlyX,clickedFlyY,clickedFlyW,clickedFlyH;
    clickedFlyW = parseInt(clickedFly.attr('width'))
	clickedFlyH = parseInt(clickedFly.attr('height'))
    
    var flyChildW,flyChildH,flyChildR;
    flyChildW = clickedFlyW - flyChildDifference;
	flyChildH = clickedFlyH - flyChildDifference;
    
    //check if clickedFly is too small to generate childs
    if(flyChildW <=0 || flyChildH <=0){
		return null
    }
    
	clickedFlyX = parseInt(clickedFly.attr('posX'))
	clickedFlyY = parseInt(clickedFly.attr('posY'))
	clickedFlyR = parseInt(clickedFly.attr('rotation'))
    
	console.log('clickedFly x y',clickedFlyX,clickedFlyY)
	console.log('clickedFly w h r',clickedFlyW,clickedFlyH,clickedFlyR)
    
    var randomDistanceDifference = Math.ceil(Math.random()*10);
    var randomRotationDifference = Math.round(Math.random()*360);
    console.log('randomDistanceDifference',randomDistanceDifference);
    console.log('randomRotationDifference',randomRotationDifference);
    
	flyChildR = clickedFlyR - randomRotationDifference;
    
    var layoutMode = Math.ceil(Math.random()*4); //4 modes
    var firstFlyChildX,firstFlyChildY;
    var secondFlyChildX,secondFlyChildY;
    var posDifference,offset;
    var maxXPosition = (innerWidth - flyChildW);
    var maxYPosition = (innerHeight - flyChildW);
    
    console.log("layoutMode",layoutMode);
    
    //choose between 4 layout mode
    switch(layoutMode){
        
        case 1: {
            /*
                    | 
                firstChild
                secondChild
                    | 
                
            */
            posDifference = (flyChildW/2);
            firstFlyChildX = clickedFlyX;
            firstFlyChildY = clickedFlyY - posDifference;
            secondFlyChildX = clickedFlyX;
            secondFlyChildY = clickedFlyY + posDifference;
            
            //case upward fly is out of screen
            if(firstFlyChildY <0){
                offset = (-firstFlyChildY) // is negative value
                firstFlyChildY = 0;
                secondFlyChildY = secondFlyChildY + offset;//move down
            }
            
            //case downward fly is out of screen
            else if(secondFlyChildY >= maxYPosition){
                offset = (secondFlyChildY - maxYPosition);
                secondFlyChildY = maxYPosition;
                firstFlyChildY = firstFlyChildY - offset; 
                
            }
            
            break;
        }
        
        case 2: {
            /*  --  secondChild          firstFlyChild   -- 
            */
            posDifference = (flyChildW/2);
            firstFlyChildX = clickedFlyX + posDifference;
            firstFlyChildY = clickedFlyY;
            secondFlyChildX = clickedFlyX - posDifference;
            secondFlyChildY = clickedFlyY;
            
            //case right fly is out of screen
            if(firstFlyChildX >= maxXPosition){
                offset = firstFlyChildX - maxXPosition;
                firstFlyChildX = maxXPosition;
                secondFlyChildX = secondFlyChildX - offset;
            }
            
            else if(secondFlyChildX <0){
                offset = (-secondFlyChildX)
                secondFlyChildX = 0;
                firstFlyChildX = firstFlyChildX + offset;
            }
            
            break;
        }
            
        case 3: {
            /*           | firstFlyChild
                |  secondFlyChild  
            */
            posDifference = (flyChildH/2) + randomDistanceDifference
            firstFlyChildX = clickedFlyX + posDifference;
            firstFlyChildY = clickedFlyY - posDifference;
            secondFlyChildX = clickedFlyX - posDifference;
            secondFlyChildY = clickedFlyY + posDifference;
            
            //check if position is out of screen
            if(firstFlyChildX >= maxXPosition){
                offset = firstFlyChildX - maxXPosition;
                firstFlyChildX = maxXPosition;
                secondFlyChildX = secondFlyChildX - offset;
            }
            
            if(secondFlyChildX <0){
                offset = (-secondFlyChildX)
                secondFlyChildX = 0;
                firstFlyChildX = firstFlyChildX + offset;
            }
            
            if(firstFlyChildY <0){
                offset = (-firstFlyChildY) // is negative value
                firstFlyChildY = 0;
                secondFlyChildY = secondFlyChildY + offset;//move down
            }
            
            if(secondFlyChildY >= maxYPosition){
                offset = (secondFlyChildY - maxYPosition);
                secondFlyChildY = maxYPosition;
                firstFlyChildY = firstFlyChildY - offset; //move up
                
            }
            
            break;
        }
        
        case 4: {
            /*  | firstFlyChild
                            |  secondFlyChild
            */
            posDifference = (flyChildH/2) + randomDistanceDifference
            firstFlyChildX = clickedFlyX - posDifference;
            firstFlyChildY = clickedFlyY - posDifference;
            secondFlyChildX = clickedFlyX + posDifference;
            secondFlyChildY = clickedFlyY + posDifference;
            
            //check if position is out of screen
            if(firstFlyChildX >= maxXPosition){
                offset = firstFlyChildX - maxXPosition;
                firstFlyChildX = maxXPosition;
                secondFlyChildX = secondFlyChildX - offset;
            }
            
            if(secondFlyChildX <0){
                offset = (-secondFlyChildX)
                secondFlyChildX = 0;
                firstFlyChildX = firstFlyChildX + offset;
            }
            
            if(firstFlyChildY <0){
                offset = (-firstFlyChildY) // is negative value
                firstFlyChildY = 0;
                secondFlyChildY = secondFlyChildY + offset;//move down
            }
            
            if(secondFlyChildY >= maxYPosition){
                offset = (secondFlyChildY - maxYPosition);
                secondFlyChildY = maxYPosition;
                firstFlyChildY = firstFlyChildY - offset; //move up
                
            }
            
            break;
        }
    }
    
    
    console.log('firstFlyChild x y',firstFlyChildX,firstFlyChildY)
	console.log('secondFlyChild x y',secondFlyChildX,secondFlyChildY)
	console.log('flyChild w h r',flyChildW,flyChildH,flyChildR)

	return {
		firstFlyChild : {
            x: firstFlyChildX,
            y: firstFlyChildY,
            w: flyChildW,
            h: flyChildH,
            r: flyChildR
        },
		secondFlyChild : {
            x: secondFlyChildX,
            y: secondFlyChildY,
            w: flyChildW,
            h: flyChildH,
            r: flyChildR
        }
	}
}