
var nOfFlies = 30;
var flies = [];

var innerWidth = window.innerWidth;
var innerHeight = window.innerHeight;
var defaultFlyWidth = 50;
var defaultFlyHeight = 30;
var flyChildDifference = 10;
var maxXPosition = (innerWidth - defaultFlyWidth);
var maxYPosition = (innerHeight - defaultFlyWidth);// width because considering rotation

var svgContainer = d3.select('body')
					.append('svg')
					.attr('width','100%')
					.attr('height','100%')


function generateRandomXYPosition(){
    
	return {
		x: Math.round(Math.random() * maxXPosition),
		y: Math.round(Math.random() * maxYPosition)
	}
}

function populateFlies(nOfFlies){
    
    for(var i=0;i<nOfFlies;i++){
	
        var randomPosition = generateRandomXYPosition();
        var width = defaultFlyWidth;
        var height = defaultFlyHeight;
        var rotation = Math.ceil(Math.random()*360);

        flies.push({
            x:randomPosition.x,
            y:randomPosition.y,
            rotation:rotation,
            width:width,
            height:height
        })
    }
    
    svgContainer
	.selectAll('image')
	.data(flies)
	.enter()
	.append("svg:image")
	.attr('xlink:href',"fly.svg")
	.attr('width',function(fly){
		return fly.width;
	})
	.attr('height',function(fly){
		return fly.height;
	})
	.attr('posX',function(fly){
		return fly.x;
	})
	.attr('posY',function(fly){
		return fly.y;
	})
	.attr('rotation',function(fly){
		return fly.rotation;
	})
	.attr('transform',function(fly){
		return 'translate('+fly.x+','+fly.y+') rotate('+fly.rotation+','+(fly.width/2)+','+(fly.height/2)+')';
	})
	.on('click',function(){
		
		var clickedFly = d3.select(this);
		splitFly(clickedFly);
	})
}

populateFlies(nOfFlies);

//flies = [{x:350,y:460,rotation:90,width:defaultFlyWidth,height:defaultFlyHeight}]


function onClickFly(clickedFly){

	splitFly(clickedFly);
}

function splitFly(clickedFly){
    
	var newRandomLayoutForFlyChilds = generateRandomNearbyLayout(clickedFly);
    
    //check if clickedFly is too small to generate childs
    if(newRandomLayoutForFlyChilds){
        
        var firstFlyChildSpecs = newRandomLayoutForFlyChilds.firstFlyChild;
        var secondFlyChildSpecs = newRandomLayoutForFlyChilds.secondFlyChild;
        
        clickedFly.remove();

        newChild(firstFlyChildSpecs);
        newChild(secondFlyChildSpecs);
    }
}

function newChild(flyChildOptions){
    
    svgContainer
		.append("svg:image")
		.attr('xlink:href',"fly.svg")
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

function generateRandomNearbyLayout(clickedFly){
	
    if(!clickedFly){
        return null
    }
    
    var clickedFlyX,clickedFlyY,clickedFlyW,clickedFlyH;
	clickedFlyX = parseInt(clickedFly.attr('posX'))
	clickedFlyY = parseInt(clickedFly.attr('posY'))
	clickedFlyW = parseInt(clickedFly.attr('width'))
	clickedFlyH = parseInt(clickedFly.attr('height'))
	clickedFlyR = parseInt(clickedFly.attr('rotation'))
	console.log('clickedFly x y',clickedFlyX,clickedFlyY)
	console.log('clickedFly w h r',clickedFlyW,clickedFlyH,clickedFlyR)
    
    var flyChildW,flyChildH,flyChildR;
    var randomRotationDifference = Math.round(Math.random()*360)
    console.log('randomRotationDifference',randomRotationDifference);
    
    flyChildW = clickedFlyW - flyChildDifference;
	flyChildH = clickedFlyH - flyChildDifference;
	flyChildR = clickedFlyR + randomRotationDifference;
    
    //check if clickedFly is too small to generate childs
    if(clickedFlyW - flyChildDifference <=0 || clickedFlyH - flyChildDifference<=0){
		return null
    }

    var layoutMode = Math.ceil(Math.random()*4); //4 modes
    var firstFlyChildX,firstFlyChildY;
    var secondFlyChildX,secondFlyChildY;
    var posDifference;
    
    console.log("layoutMode",layoutMode)
    
    switch(layoutMode){
        
        case 1: {
            posDifference = (flyChildW/2)
            firstFlyChildX = clickedFlyX;
            firstFlyChildY = clickedFlyY - posDifference;
            secondFlyChildX = clickedFlyX;
            secondFlyChildY = clickedFlyY + posDifference;
            
            break;
        }
        
        case 2: {
            posDifference = (flyChildW/2)
            firstFlyChildX = clickedFlyX + posDifference;
            firstFlyChildY = clickedFlyY;
            secondFlyChildX = clickedFlyX - posDifference;
            secondFlyChildY = clickedFlyY;
            break;
        }
            
        case 3: {
            posDifference = (flyChildH/2)
            firstFlyChildX = clickedFlyX + posDifference;
            firstFlyChildY = clickedFlyY - posDifference;
            secondFlyChildX = clickedFlyX - posDifference;
            secondFlyChildY = clickedFlyY + posDifference;
            break;
        }
        
        case 4: {
            posDifference = (flyChildH/2)
            firstFlyChildX = clickedFlyX - posDifference;
            firstFlyChildY = clickedFlyY - posDifference;
            secondFlyChildX = clickedFlyX + posDifference;
            secondFlyChildY = clickedFlyY + posDifference;
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