import $ from 'jquery';
import {parseCode} from './code-analyzer';

$(document).ready(function () {
    $('#codeSubmissionButton').click(() => {
        let codeToParse = $('#codePlaceholder').val();
        let table = parseCode(codeToParse);
        //JSON.stringify(table, null, 2);
        var table_html = '';
        Array.prototype.forEach.call(table, (row => {
            table_html += '<tr><td>' + row.Line +
                '</td><td>' + row.Type +
                '</td><td>' + row.Name +
                '</td><td>' + row.Condition +
                '</td><td>' + row.Value +
                '</td></tr>';
        }));
        document.getElementById('table-body').innerHTML = table_html;
    });
});