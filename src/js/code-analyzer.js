import * as esprima from 'esprima';

function modelParamDec(code, model) {
    if (code.type === 'Identifier') {
        model.push(
            {
                'Line': code.loc.start.line,
                'Type': 'variable declaration',
                'Name': code.name,
                'Condition': '',
                'Value': ''
            });
    }
}

function modelFunctionDec(code, model) {
    model.push(
        {
            'Line': code.loc.start.line,
            'Type': 'function declaration',
            'Name': code.id.name,
            'Condition': '',
            'Value': ''
        });
    Array.prototype.forEach.call(code.params, param => {
        modelParamDec(param, model);
    });
}

function modelVariableDec(code, model, codeToParse) {
    Array.prototype.forEach.call(code.declarations, (declar) => {
        model.push(
            {
                'Line': declar.loc.start.line,
                'Type': 'variable declaration',
                'Name': declar.id.name,
                'Condition': '',
                'Value': declar.init == null ? 'null (or nothing)' : codeToParse.substring(declar.init.range[0], declar.init.range[1])
            });
    });
}

function modelExpressionStatement(code, model, codeToParse) {
    readCode(code.expression, model, codeToParse);
}

function modelWhileStatement(code, model, codeToParse) {
    model.push(
        {
            'Line': code.loc.start.line,
            'Type': 'while statement',
            'Name': '',
            'Condition': codeToParse.substring(code.test.range[0], code.test.range[1]),
            'Value': ''
        });
}

function modelReturnStatement(code, model, codeToParse) {
    model.push(
        {
            'Line': code.loc.start.line,
            'Type': 'return statement',
            'Name': '',
            'Condition': '',
            'Value': codeToParse.substring(code.argument.range[0], code.argument.range[1])
        });
}

function modelAssignmentExpression(code, model, codeToParse) {
    model.push(
        {
            'Line': code.loc.start.line,
            'Type': 'assignment expression',
            'Name': code.left.name,
            'Condition': '',
            'Value': codeToParse.substring(code.right.range[0], code.right.range[1])
        });
}

function modelIfElseStatement(code, model, codeToParse) {
    model.push(
        {
            'Line': code.loc.start.line,
            'Type': 'else if statement',
            'Name': '',
            'Condition': codeToParse.substring(code.test.range[0], code.test.range[1]),
            'Value': ''
        });
    readCode(code.consequent, model, codeToParse);
    if (code.alternate != null) {
        if (code.alternate.type === 'IfStatement') {
            modelIfElseStatement(code.alternate, model, codeToParse);
        }
        else{
            readCode(code.alternate, model, codeToParse);
        }
    }
}

function modelIfStatement(code, model, codeToParse) {
    model.push(
        {
            'Line': code.loc.start.line,
            'Type': 'if statement',
            'Name': '',
            'Condition': codeToParse.substring(code.test.range[0], code.test.range[1]),
            'Value': ''
        });
    readCode(code.consequent, model, codeToParse);
    if (code.alternate != null) {
        if (code.alternate.type === 'IfStatement') {
            modelIfElseStatement(code.alternate, model, codeToParse);
        }
        else {
            readCode(code.alternate, model, codeToParse);
        }
    }
}

function modelForStatement(code, model, codeToParse) {
    model.push(
        {
            'Line': code.loc.start.line,
            'Type': 'for statement',
            'Name': '',
            'Condition': codeToParse.substring(code.test.range[0],code.test.range[1]),
            'Value': ''
        });
}

function modelUpdateExpression(code, model) {
    model.push(
        {
            'Line': code.loc.start.line,
            'Type': 'update expression',
            'Name': code.argument.name,
            'Condition': '',
            'Value': code.operator,
        });
}

const possibleStatements = {
    'FunctionDeclaration': modelFunctionDec,
    'VariableDeclaration': modelVariableDec,
    'ExpressionStatement': modelExpressionStatement,
    'WhileStatement': modelWhileStatement,
    'ReturnStatement': modelReturnStatement,
    'AssignmentExpression': modelAssignmentExpression,
    'IfStatement': modelIfStatement,
    'ForStatement': modelForStatement,
    'UpdateExpression': modelUpdateExpression
};

function readCode(code, model, codeToParse) {
    var handler = possibleStatements[code.type];
    var body = code.body;

    if (handler !== undefined) {
        handler(code, model, codeToParse);
    }
    if (body !== undefined) {
        if (body instanceof Array) {
            Array.prototype.forEach.call(body, (statement) => {
                readCode(statement, model, codeToParse);
            });
        }
        else if (body.body !== undefined) {
            Array.prototype.forEach.call(body.body, (statement) => {
                readCode(statement, model, codeToParse);
            });
        }
    }
}

const parseCode = (codeToParse) => {
    var parsedCode = esprima.parseScript(codeToParse, {loc: true, range: true});
    var model = [];
    readCode(parsedCode, model, codeToParse);

    return model;
};


export {parseCode};