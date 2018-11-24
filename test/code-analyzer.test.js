/* eslint-disable max-lines-per-function,no-unused-vars */
import assert from 'assert';
import {
    parseCode,
    parseScript,
    readCode,
    modelWhileStatement,
    modelVariableDec,
    modelUpdateExpression,
    modelReturnStatement,
    modelIfStatement,
    modelFunctionDec,
    modelForStatement,
    modelExpressionStatement,
    modelAssignmentExpression
} from '../src/js/code-analyzer';


describe('The javascript parser', () => {
    it('is modeling an empty function correctly', () => {
        assert.equal(
            JSON.stringify(parseCode('')),
            '[]'
        );
    });

    it('it is modeling WhileStatement', () => {
        var model = [];
        var code = 'while(3 > 4){\n' +
            '}';
        modelWhileStatement(parseScript(code).body[0], model, code);
        assert.equal(
            JSON.stringify(model),
            '[{"Line":1,"Type":"while statement","Name":"","Condition":"3 > 4","Value":""}]'
        );
    });

    it('it is modeling VariableDec', () => {
        var model = [];
        modelVariableDec(parseScript('var a = 1;').body[0], model, 'var a = 1;');
        assert.equal(
            JSON.stringify(model),
            '[{"Line":1,"Type":"variable declaration","Name":"a","Condition":"","Value":"1"}]'
        );
    });

    it('it is modeling UpdateExpression', () => {
        var model = [];
        var code = 'i--;';
        modelUpdateExpression(parseScript(code).body[0].expression, model, code);
        assert.equal(
            JSON.stringify(model),
            '[{"Line":1,"Type":"update expression","Name":"i","Condition":"","Value":"--"}]'
        );
    });

    it('it is modeling IfStatement', () => {
        var model = [];
        var code = 'if(x > 2){\n' +
            '}';
        modelIfStatement(parseScript(code).body[0], model, code);
        assert.equal(
            JSON.stringify(model),
            '[{"Line":1,"Type":"if statement","Name":"","Condition":"x > 2","Value":""}]'
        );
    });

    it('it is modeling FunctionDec', () => {
        var model = [];
        var code = 'function foo(x,y){\n' +
            ';\n' +
            '}';
        modelFunctionDec(parseScript(code).body[0], model, code);
        assert.equal(
            JSON.stringify(model[0]),
            '{"Line":1,"Type":"function declaration","Name":"foo","Condition":"","Value":""}'
        );
    });

    it('it is modeling ReturnStatement', () => {
        var model = [];
        var code = 'function foo(){\n' +
            '   return x + 1;\n' +
            '}';
        modelReturnStatement(parseScript(code).body[0].body.body[0], model, code);
        assert.equal(
            JSON.stringify(model),
            '[{"Line":2,"Type":"return statement","Name":"","Condition":"","Value":"x + 1"}]'
        );
    });


    it('it is modeling AssignmentExpression', () => {
        var model = [];
        var code = 'x = y + 1;';
        modelAssignmentExpression(parseScript(code).body[0].expression, model, code);
        assert.equal(
            JSON.stringify(model),
            '[{"Line":1,"Type":"assignment expression","Name":"x","Condition":"","Value":"y + 1"}]'
        );
    });

    it('testing readCode1', () => {
        var model = [];
        var code = 'let x = 1;\n' +
            'let y = 2;\n' +
            'x = x + y;';
        readCode(parseScript(code), model, code);
        assert.equal(
            JSON.stringify(model),
            '[{"Line":1,"Type":"variable declaration","Name":"x","Condition":"","Value":"1"}' +
            ',{"Line":2,"Type":"variable declaration","Name":"y","Condition":"","Value":"2"}' +
            ',{"Line":3,"Type":"assignment expression","Name":"x","Condition":"","Value":"x + y"}]'
        );
    });

    it('testing readCode2', () => {
        var model = [];
        var code = 'function fibonacci(num){\n' +
            '  var a = 1, b = 0, temp;\n' +
            '\n' +
            '  while (num >= 0){\n' +
            '    temp = a;\n' +
            '    a = a + b;\n' +
            '    b = temp;\n' +
            '    num--;\n' +
            '  }\n' +
            '\n' +
            '  return b;\n' +
            '}';
        readCode(parseScript(code), model, code);
        assert.equal(
            JSON.stringify(model),
            '[{"Line":1,"Type":"function declaration","Name":"fibonacci","Condition":"","Value":""}' +
            ',{"Line":1,"Type":"variable declaration","Name":"num","Condition":"","Value":""}' +
            ',{"Line":2,"Type":"variable declaration","Name":"a","Condition":"","Value":"1"},' +
            '{"Line":2,"Type":"variable declaration","Name":"b","Condition":"","Value":"0"},' +
            '{"Line":2,"Type":"variable declaration","Name":"temp","Condition":"","Value":"null"},' +
            '{"Line":4,"Type":"while statement","Name":"","Condition":"num >= 0","Value":""}' +
            ',{"Line":5,"Type":"assignment expression","Name":"temp","Condition":"","Value":"a"}' +
            ',{"Line":6,"Type":"assignment expression","Name":"a","Condition":"","Value":"a + b"}' +
            ',{"Line":7,"Type":"assignment expression","Name":"b","Condition":"","Value":"temp"}' +
            ',{"Line":8,"Type":"update expression","Name":"num","Condition":"","Value":"--"}' +
            ',{"Line":11,"Type":"return statement","Name":"","Condition":"","Value":"b"}]'
        );
    });

    it('testing readCode3', () => {
        var model = [];
        var code = 'for(let i = 0; i < 100; i++){\n' +
            '\tif(i == 1){\n' +
            '\t\ti++;\n' +
            '\t}\n' +
            '\telse if(i == 2){\n' +
            '\t\ti++;\n' +
            '\t}\n' +
            '\telse if(i == 3){\n' +
            '\t\ti++;\n' +
            '\t}\n' +
            '}';
        readCode(parseScript(code), model, code);
        assert.equal(
            JSON.stringify(model),
            '[{"Line":1,"Type":"for statement","Name":"","Condition":"i < 100","Value":""}' +
            ',{"Line":2,"Type":"if statement","Name":"","Condition":"i == 1","Value":""}' +
            ',{"Line":3,"Type":"update expression","Name":"i","Condition":"","Value":"++"},' +
            '{"Line":5,"Type":"else if statement","Name":"","Condition":"i == 2","Value":""},' +
            '{"Line":6,"Type":"update expression","Name":"i","Condition":"","Value":"++"},' +
            '{"Line":8,"Type":"else if statement","Name":"","Condition":"i == 3","Value":""}' +
            ',{"Line":9,"Type":"update expression","Name":"i","Condition":"","Value":"++"}]'
        );
    });

    it('testing readCode4', () => {
        var model = [];
        var code = 'for(let i = 0; i < 100; i++){\n' +
            '\tif(i == 1){\n' +
            '\t\ti++;\n' +
            '\t}\n' +
            '\telse{\n' +
            '\t\ti++;\n' +
            '\t}\n' +
            '}';
        readCode(parseScript(code), model, code);
        assert.equal(
            JSON.stringify(model),
            '[{"Line":1,"Type":"for statement","Name":"","Condition":"i < 100","Value":""}' +
            ',{"Line":2,"Type":"if statement","Name":"","Condition":"i == 1","Value":""}' +
            ',{"Line":3,"Type":"update expression","Name":"i","Condition":"","Value":"++"},' +
            '{"Line":6,"Type":"update expression","Name":"i","Condition":"","Value":"++"}]'
        );
    });


    it('testing example', () => {
        var model = [];
        var code = 'function binarySearch(X, V, n){\n' +
            '    let low, high, mid;\n' +
            '    low = 0;\n' +
            '    high = n - 1;\n' +
            '    while (low <= high) {\n' +
            '        mid = (low + high)/2;\n' +
            '        if (X < V[mid])\n' +
            '            high = mid - 1;\n' +
            '        else if (X > V[mid])\n' +
            '            low = mid + 1;\n' +
            '        else\n' +
            '            return mid;\n' +
            '    }\n' +
            '    return -1;\n' +
            '}';
        readCode(parseScript(code), model, code);
        assert.equal(
            JSON.stringify(model),
            '[{"Line":1,"Type":"function declaration","Name":"binarySearch","Condition":"","Value":""}' +
            ',{"Line":1,"Type":"variable declaration","Name":"X","Condition":"","Value":""}' +
            ',{"Line":1,"Type":"variable declaration","Name":"V","Condition":"","Value":""},' +
            '{"Line":1,"Type":"variable declaration","Name":"n","Condition":"","Value":""},' +
            '{"Line":2,"Type":"variable declaration","Name":"low","Condition":"","Value":"null"},' +
            '{"Line":2,"Type":"variable declaration","Name":"high","Condition":"","Value":"null"}' +
            ',{"Line":2,"Type":"variable declaration","Name":"mid","Condition":"","Value":"null"}' +
            ',{"Line":3,"Type":"assignment expression","Name":"low","Condition":"","Value":"0"}' +
            ',{"Line":4,"Type":"assignment expression","Name":"high","Condition":"","Value":"n - 1"}' +
            ',{"Line":5,"Type":"while statement","Name":"","Condition":"low <= high","Value":""}' +
            ',{"Line":6,"Type":"assignment expression","Name":"mid","Condition":"","Value":"(low + high)/2"},' +
            '{"Line":7,"Type":"if statement","Name":"","Condition":"X < V[mid]","Value":""},' +
            '{"Line":8,"Type":"assignment expression","Name":"high","Condition":"","Value":"mid - 1"},' +
            '{"Line":9,"Type":"else if statement","Name":"","Condition":"X > V[mid]","Value":""},' +
            '{"Line":10,"Type":"assignment expression","Name":"low","Condition":"","Value":"mid + 1"},' +
            '{"Line":12,"Type":"return statement","Name":"","Condition":"","Value":"mid"},' +
            '{"Line":14,"Type":"return statement","Name":"","Condition":"","Value":"-1"}]'
        );
    });
});
