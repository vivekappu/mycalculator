const input=document.querySelector('.calc-screen input');
const calcbody=document.querySelector('.calc-body');
const topscreen=document.querySelector('.top-screen');
let Ans=0;
let prevButton;
/*------------------event listeners---------------------------*/
calcbody.addEventListener('click',(e)=>{
let value=e.target.value;
switch(value){
    case 'AC':clearscreen();
             prevButton='AC';
             break;
    case 'CE':clearEntry();
             prevButton='CE';
             break;
    case '=':value=evaluatePostFix(infixToPostfix(convertToNormalExpr(input.value)));
             display(value);
             Ans=value;
             topscreen.innerText=`Ans:${Ans}`;
             prevButton='=';
             break;
    default:if(prevButton=='='){input.value=value}else{input.value+=value;}
            prevButton='';
}
});
/*---------------------calculatorfunctions------------------------*/
function clearscreen(){
    input.value="";
}
function clearEntry(){
    input.value=input.value.substr(0,input.value.length-1);;
}
function convertToNormalExpr(expr){
   let exprArray=expr.split('');
   let newExprArray;
   newExprArray=exprArray.map(function (char){
       if(char=='÷'){
          return '/';
       }
       else if(char=='×'){
           return '*';
       }
       else{
           return char;
       }
   })
   let newExpr=newExprArray.join('');
   return newExpr;
}
function display(value){
    input.value=value;
}


/*-----------------conversions goes here--------------------------*/
//infixToPostfix(expression);
function infixToPostfix(expr){
///create a stack
let stack=[];
//return postfix
//rules
//1. scan the infix expr from left to right
// 2. If the scanned character is an operand, output it.
// 3. Else,
//..3.1 If the precedence of the scanned operator is greater than the precedence of the operator in the stack(or the stack is empty or the stack contains a ‘(‘ ), push it.
// ..3.2 Else, Pop all the operators from the stack which are greater than or equal to in precedence than that of the scanned operator. After doing that Push the scanned operator to the stack.
//.. (If you encounter parenthesis while popping then stop there and push the scanned operator in the stack.)
// 4. If the scanned character is an ‘(‘, push it to the stack.
// 5. If the scanned character is an ‘)’, pop the stack and and output it until a ‘(‘ is encountered, and discard both the parenthesis.
// 6. Repeat steps 2-6 until infix expression is scanned.
// 7. Print the output
// 8. Pop and output from the stack until it is not empty.
console.log(expr);
var exprArray = [];
exprArray = expr.split(" ");
console.log(exprArray);
let postFixExpr='';

exprArray.forEach(char=>scanAndConvert(char));
while(!isStackEmpty(stack)){
    postFixExpr+=(stack.pop()+'#');
   
}

function scanAndConvert(char){
    console.log(stack);
    if(isOperand(char)){
        postFixExpr+=(char+'#');
        console.log("here1");
    }
    else{
      if(char=='('){
          stack.push(char);
          console.log("here2");
      }
      else if(char==')'){
          do{ 
              postFixExpr+=(stack.pop()+'#')
              console.log("here3");
            }
          while(topOf(stack)!='(');
          stack.pop();//to pop '('
      }
      else if(precendance(char)>precendance(topOf(stack))||isStackEmpty(stack)||topOf(stack)=='('){
           stack.push(char);
           console.log("here4");
      }
      else{
         do{ 
             if(topOf(stack)=='('){
                console.log("here");
                 break;
             }
             else{
                 postFixExpr+=(stack.pop()+'#');
                }
          
         }
         while(precendance(topOf(stack))>=char);
         stack.push(char);
      }
    }
 }
console.log(postFixExpr.substr(0,postFixExpr.length-1));
return postFixExpr.substr(0,postFixExpr.length-1);// remove one extra #
}

function evaluatePostFix(expr){
    // 1) Create a stack to store operands (or values).
    let exprstack=[];
    // 2) Scan the given expression and do following for every scanned element.
    let exprArray=expr.split("#");
    exprArray.forEach(
      function(el){
          if(isOperand(el)){
              exprstack.push(el);
          }
          else if(el=='+'||el=='-'||el=='*'||el=="/"){
              let operand2=exprstack.pop();
              let operand1=exprstack.pop();
              let result=performOperation(Number(operand1),Number(operand2),el);
              exprstack.push(result);
          }
      }
    );
    return exprstack.pop();
    // …..a) If the element is a number, push it into the stack
    // …..b) If the element is a operator, pop operands for the operator from stack. Evaluate the operator and push the result back to the stack
    // 3) When the expression is ended, the number in the stack is the final answer

}




/*--------------------------------- stack functions goes here------------------------------------------*/
function cleanEmptyCharacterFrom(array){
    newarray=[];
   array.forEach(
       el=>{
           if(el===""){
                 
           }
           else{
            newarray.push(el);
           }
       }
   )
   return newarray;
}
function pop(stack){
    if(stack.length<=0){
        return '';
    }
    return stack.pop().split("")[0];
}
/*is stack empty function */
function isStackEmpty(stack){
    return !(stack.length>0);
    }
/* is operand function */
function isOperand(char){
    return !isNaN(char);
}
/* returns precedance of operator */
function precendance(operand){
 if(operand=='/'||operand=='*'){
    return 2;
 }
 else if(operand=='+'||operand=='-'){
     return 1;
 }
 else {
     return -1;
 }
}
/* returns top element */
function topOf(stack){
      if(stack.length<=0){
          return '#';
      }
    return stack[stack.length-1];
}

/* operation */
function performOperation(operand1,operand2,operator){
   if(operator=='+'){
       return operand1+operand2;
   }
   else if (operator=='-'){
    return operand1-operand2;
   }
   else if (operator=='*'){
    return operand1*operand2;
   }
   else if(operator=='/'){
    return operand1/operand2;
   }
}
