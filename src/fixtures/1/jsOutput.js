const jsOutput = `const a=1;true;"String";1500000.50;[1,2,3*4,5];({foo:"bar",baz:a});function multiply(a,b){return a*b};const is_even=(x)=>{return x%2===0};is_even(3);const divide=($1,$2,$4,$5,$6,$7,$8,$9,$10)=>{return $1/$2};[1,2,3,4,5,6,7,8,9,10].filter(($1,$2,$4,$5,$6,$7,$8,$9,$10)=>{return  -$1%2!==0}).map(($1,$2,$4,$5,$6,$7,$8,$9,$10)=>{return $1*100});const mood=(()=>{let tmp;if(Math.random()>0.5){tmp="good"}else{tmp="bad"}return tmp})()`

module.exports = jsOutput
