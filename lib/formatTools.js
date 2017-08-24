var os = require('os');

var referenceType = require('../templates/fieldReferenceType');
var fieldTypes = require('../templates/fieldTypes');
var allowedFieldsTypes = {
    'rString'  : fieldTypes.rString,
    'rNumber'  : fieldTypes.rNumber,
    'rDate'    : fieldTypes.rDate,
    'rBoolean' : fieldTypes.rBoolean,
    'string'   : fieldTypes.string,
    'number'   : fieldTypes.number,
    'date'     : fieldTypes.date,
    'boolean'  : fieldTypes.boolean,
    'array'    : Array,
    'objectId' : referenceType
};

/**
 * Format the fields for the model template
 * @param {array} fields fields input
 * @returns {string} formatted fields
 */
function getFieldsForModelTemplate(fields) {
    var lg = fields.length - 1;

    var modelFields = '{' + os.EOL;
    fields.forEach(function(field, index, array) {
        modelFields += '\t\'' + field.name + '\' : '+ (field.isArray ? '[' : '') + (allowedFieldsTypes[field.type]).name + (field.isArray ? ']' : '');
        modelFields += (lg > index) ? ',' + os.EOL : os.EOL;

        if (field.reference) {
            modelFields = modelFields.replace(/{ref}/, field.reference);
        }
    });
    modelFields += '}';

    return modelFields;
}

/**
 * Format the fields for the model template
 * @param {array} fields fields input
 * @returns {string} formatted fields
 */
function getFieldsForNgModelTemplate(fields) {
    var lg = fields.length - 1;

    var modelFields = os.EOL;
    fields.forEach(function(field, index, array) {
        if(field.type.charAt(0) === 'r') {
            modelFields += '\t\tpublic ' + field.name + ': ' + field.type.substring(1).toLowerCase();
        } else {
            modelFields += '\t\tpublic ' + field.name + '?: ' + field.type;
        }
        modelFields += (lg > index) ? ',' + os.EOL : os.EOL;

    });
    modelFields += '\t\t';

    return modelFields;
}

/**
 * Puts a word in the plural
 * @param {string} word
 * @returns {string}
 */
function pluralize(word) {
    return word + 's';
}

/**
 * Capitalize The First Letter Of A String
 * @param {string} string
 * @returns {string}
 */
function jsUcfirst(string) 
{
    return string.charAt(0).toUpperCase() + string.slice(1);
}

module.exports = {
    getFieldsForModelTemplate: getFieldsForModelTemplate,
    getFieldsForNgModelTemplate: getFieldsForNgModelTemplate,
    pluralize: pluralize,
    jsUcfirst: jsUcfirst
};