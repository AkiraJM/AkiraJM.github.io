


function GenerateDunes(height_field,iter,width1,height1,q,rl0,bb,L0){

    function blur(input,width,height){
        var out = new Array(width);
        for(var a=0;a<width;a++)
        {    out[a] = new Array(height);
          for(var b=0;b<height;b++){
              out[a][b] = input[a][b];
        }
      }
        for(var i=0; i<width;i++){
          for(var j =0;j<height;j++){
              if(i==0){
                if(j==0){
                    out[i][j] = 0.25 * (out[i][j]+out[i+1][j]+out[i][j+1]+out[i+1][j+1])
                }else if(j==height-1){
                    out[i][j] = 0.25 * (out[i][j]+out[i+1][j]+out[i][j-1]+out[i+1][j-1])
                }else{
                    out[i][j] = 1.0/6.0 * (out[i][j]+out[i+1][j]+out[i][j-1]+out[i+1][j-1]+out[i][j+1]+out[i+1][j+1])
                }
              }else if(i==width-1){
                if(j==0){
                    out[i][j] = 0.25 * (out[i][j]+out[i-1][j]+out[i][j+1]+out[i-1][j+1])
                }else if(j==height-1){
                    out[i][j] = 0.25 * (out[i][j]+out[i-1][j]+out[i][j-1]+out[i-1][j-1])
                }else{
                    out[i][j] = 1.0/6.0  * (out[i][j]+out[i-1][j]+out[i][j-1]+out[i-1][j-1]+out[i][j+1]+out[i-1][j+1])
                }
              }else if((i!=0&&i!=(width-1))&&j==0){
                out[i][j] = 1.0/6.0  * (out[i][j]+out[i-1][j]+out[i+1][j]+out[i][j+1]+out[i-1][j+1]+out[i+1][j+1])
              }else if((i!=0&&i!=(width-1))&&j==(height-1)){
                out[i][j] = 1.0/6.0  * (out[i][j]+out[i-1][j]+out[i+1][j]+out[i][j-1]+out[i-1][j-1]+out[i+1][j-1])
              }else{
                out[i][j] = 1.0/9.0*(out[i][j]+out[i-1][j]+out[i][j-1]+out[i-1][j-1]+out[i][j+1]+
                out[i-1][j+1]+out[i+1][j]+out[i+1][j-1]+out[i+1][j+1])
              }
          }
        }
        return out;
      }

    var newx = 0;
    var newy = 0;    
    
    for(var i=0;i<iter;i++)
    {
        height_field = height_field.map(function(value){return value.map(function(value2){return value2 - q;});}) 
        var Lx = height_field.map(function(value){return value.map(function(value2){return Math.floor(value2 * bb + L0[0]);});}) 
        var Ly =  height_field.map(function(value){return value.map(function(value2){return Math.floor(value2 * bb + L0[1]);});}) 
        for(var dx=0;dx<width1;dx++){
            for (var dy = 0; dy < height1; dy++){
                var offsetx = Lx[dx][dy] + dx
                var offsety = Ly[dx][dy] + dy
                if (offsetx >= 0)
                    offsetx = offsetx % width1
                else
                    offsetx = width1 - ((-offsetx) % width1) - 1
                if (offsety >= 0)
                    offsety = offsety % height1
                else
                    offsety = height1 - ((-offsety) % height1) - 1
                newx = Math.floor(offsetx)
                newy = Math.floor(offsety)
                height_field[newx][newy] += q
            }
        }
        height_field = blur(height_field,width1,height1)

        var dl0 = new Array([0,0])
        dl0[0] = rl0 * (Math.random()-0.5)
        dl0[1] = rl0 * (Math.random()-0.5)
        L0 = L0.map(function(index,item){
          return index + dl0[item];
        });
    }
    return [height_field,L0];
}

export {GenerateDunes};