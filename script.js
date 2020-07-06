/*global variables */
const input = document.querySelector(".calc-screen input");
const calcbody = document.querySelector(".calc-body");
const topscreen = document.querySelector(".top-screen");
let Ans = 0;
/*------------------event listeners---------------------------*/
calcbody.addEventListener("click", (e) => {
  if (e.target.tagName == "BUTTON") {
    // so that it won't print undefined when something other than button is pressed
    let value = e.target.value;
    switch (value) {
      case "AC":
        clearscreen();
        Ans = 0;
        topscreen.innerText = `Ans:${Ans}`;
        break;
      case "CE":
        clearEntry();
        break;
      case "=":
        if (Ans == 0 && input.value=="") {
          value="";
          Ans=0;
        } else {
          value = evaluatePostFix(
            infixToPostfix(convertToNormalExpr(input.value))
          );
          Ans = value;
        }
        display(value);
        
        topscreen.innerText = `Ans:${Ans}`;
        break;
      default:
        input.value += value;
    }
  }
});
/*---------------------calculatorfunctions------------------------*/
function clearscreen() {
  input.value = "";
}
function clearEntry() {
  let lastchar = Number(input.value[input.value.length - 1]);

  if (lastchar == " ") {
    input.value = input.value.substr(0, input.value.length - 3);
  } else {
    input.value = input.value.substr(0, input.value.length - 1);
  }
}
function convertToNormalExpr(expr) {
  let exprArray = expr.split("");
  let newExprArray;
  newExprArray = exprArray.map(function (char) {
    if (char == "÷") {
      return "/";
    } else if (char == "×") {
      return "*";
    } else {
      return char;
    }
  });
  let newExpr = newExprArray.join("");
  return newExpr;
}
function display(value) {
  input.value = value;
}

/*-----------------conversions goes here--------------------------*/
//infixToPostfix(expression);
function infixToPostfix(expr) {
  ///create a stack
  let stack = [];
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
  exprArray = cleanEmptyCharacterFrom(exprArray);
  let postFixExpr = "";

  exprArray.forEach((char) => scanAndConvert(char));
  while (!isStackEmpty(stack)) {
    postFixExpr += stack.pop() + "#";//# seperates operands and operators 
  }

  function scanAndConvert(char) {
    console.log(stack);
    if (isOperand(char)) {
      postFixExpr += char + "#";
    } else {
      if (char == "(") {
        stack.push(char);
      } else if (char == ")") {
        do {
          postFixExpr += stack.pop() + "#";
        } while (topOf(stack) != "(");
        stack.pop(); //to pop '('
      } else if (
        precendance(char) > precendance(topOf(stack)) ||
        isStackEmpty(stack) ||
        topOf(stack) == "("
      ) {
        stack.push(char);
        console.log("here4");
      } else {
        do {
          if (topOf(stack) == "(") {
            console.log("here");
            break;
          } else {
            postFixExpr += stack.pop() + "#";
          }
        } while (precendance(topOf(stack)) >= char);
        stack.push(char);
      }
    }
  }
  return postFixExpr.substr(0, postFixExpr.length - 1); // remove one extra # at the end 
}

function evaluatePostFix(expr) {
  // 1) Create a stack to store operands (or values).
  let exprstack = [];
  // 2) Scan the given expression and do following for every scanned element.
  let exprArray = expr.split("#");
  exprArray.forEach(function (el) {
    if (isOperand(el)) {
      exprstack.push(el);
    } else if (el == "+" || el == "-" || el == "*" || el == "/") {
      let operand2 = exprstack.pop();
      let operand1 = exprstack.pop();
      let result = performOperation(Number(operand1), Number(operand2), el);
      exprstack.push(result);
    }
  });
  return exprstack.pop();
  // …..a) If the element is a number, push it into the stack
  // …..b) If the element is a operator, pop operands for the operator from stack. Evaluate the operator and push the result back to the stack
  // 3) When the expression is ended, the number in the stack is the final answer
}

/*--------------------------------- stack functions goes here------------------------------------------*/
function cleanEmptyCharacterFrom(array) {
  newarray = [];
  array.forEach((el) => {
    if (el === "") {
      //do nothing
    } else {
      newarray.push(el);
    }
  });
  return newarray;
}
/*is stack empty function */
function isStackEmpty(stack) {
  return !(stack.length > 0);
}
/* is operand function */
function isOperand(char) {
  return !isNaN(char);
}
/* returns precedance of operator */
function precendance(operator) {
  if (operator == "/" || operator == "*") {
    return 2;
  } else if (operator == "+" || operator == "-") {
    return 1;
  } else {
    return -1;
  }
}
/* returns top element */
function topOf(stack) {
  if (stack.length <= 0) {
    return "#";
  }
  return stack[stack.length - 1];
}

/* operation */
function performOperation(operand1, operand2, operator) {
  if (operator == "+") {
    return operand1 + operand2;
  } else if (operator == "-") {
    return operand1 - operand2;
  } else if (operator == "*") {
    return operand1 * operand2;
  } else if (operator == "/") {
    return operand1 / operand2;
  }
}
