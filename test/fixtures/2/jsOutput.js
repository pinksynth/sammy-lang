const jsOutput = `const get_tax=($1)=>{return $1*0.08};function print_receipt$2(subtotal,customer_name){return \`
		Receipt
		Subtotal: \${(()=>{return subtotal})()}
		Tax:      \${(()=>{return get_tax(subtotal)})()}
		--------------------
		Total:    \${(()=>{return get_tax(subtotal)+subtotal})()}

		\${(()=>{return (()=>{let tmp;if(customer_name){tmp=\`Have a great day, \${(()=>{return customer_name})()}\`}else{tmp=\`Have a great day!\`}return tmp})()})()}
	\`};function print_receipt$1(subtotal){return print_receipt$2(subtotal,false)};print_receipt$2(50,\`Jimbo\`);print_receipt$1(75)`

module.exports = jsOutput
