const jsOutput = `function __RANGE__(t,f){if(t===f)return[t];const r=[];if(typeof t==="number"&&typeof f==="number"){if(t<f)for(let e=t;e<=f;e++)r.push(e);else for(let e=t;e>=f;e--)r.push(e)}else if(typeof t==="string"&&typeof f==="string"&&t.length&&f.length){const n=String.fromCharCode;const o=t.charCodeAt(),i=f.charCodeAt();if(o<i)for(let e=o;e<=i;e++)r.push(n(e));else for(let e=o;e>=i;e--)r.push(n(e))}return r};const a=1;true;"String";1500000.50;let name="Sammy";name="Jimbo";name=name.toUpperCase();[1,2,3*4,5];const my_range=(__RANGE__(1,10));const reverse_alphabet=(__RANGE__("z","a"));({foo:"bar",baz:a});function multiply(b,c){return b*c};const square=($1)=>{return $1*$1};const subtract=($1,$2)=>{return $1-$2};subtract(square(multiply(2,3)),5);const is_even=(x)=>{return x%2===0};is_even(3);foo.bar()*baz.quux(foo,my_range);const divide=($1,$2)=>{return $1/$2};[1,2,3,4,5,6,7,8,9,10].filter(($1)=>{return  -$1%2!==0}).map(($1)=>{return $1*100});let mood=(()=>{let tmp;if(Math.random()>0.5){tmp="good"}else{tmp="bad"}return tmp})();mood=(()=>{let tmp;if(Math.random()>0.9&&Math.random()<0.1){tmp="excellent"}else{tmp=mood}return tmp})()`

module.exports = jsOutput
