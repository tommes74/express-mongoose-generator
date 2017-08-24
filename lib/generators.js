/**
 * Module dependencies
 */
var ft = require('./fileTools');
var formatTools = require('./formatTools');
var os = require('os');
var program  = require('commander');
var snakeCase = require('snake-case');

/**
 * Generate a Mongoose model
 * @param {string} path
 * @param {string} modelName
 * @param {array} modelFields
 * @param {string} generateMethod
 * @param {function} cb
 */
function generateModel(path, modelName, modelFields, generateMethod, cb) {
    var fields = formatTools.getFieldsForModelTemplate(modelFields);
    
    var schemaName = modelName + 'Schema';

    var model = ft.loadTemplateSync('model.js');
    model = '// mongoose-gen -m ' + program.model + ' -f ' + program.fields + ' -r -t ' + program.tree + os.EOL + os.EOL + model;

    model = model.replace(/{modelName}/, modelName);
    model = model.replace(/{schemaName}/g, schemaName);
    model = model.replace(/{fields}/, fields);

    if (generateMethod === 't') {
        ft.createDirIfIsNotDefined(path, 'models', function () {
            ft.writeFile(path + '/models/' + modelName + 'Model.js', model, null, cb);
        });
    } else {
        ft.createDirIfIsNotDefined(path, modelName, function () {
            ft.writeFile(path + '/' + modelName + '/' + modelName + 'Model.js', model, null, cb);
        });
    }
}

/**
 * Generate a Express router
 * @param {string} path
 * @param {string} modelName
 * @param {string} generateMethod
 * @param {function} cb
 */
function generateRouter(path, modelName, generateMethod, cb) {
    var router = ft.loadTemplateSync('router.js');
    router = router.replace(/{controllerName}/g, modelName + 'Controller');

    if (generateMethod === 't') {
        ft.createDirIfIsNotDefined(path, 'routes', function () {
            router = router.replace(/{controllerPath}/g, '\'../controllers/' + modelName + 'Controller.js\'');
            ft.writeFile(path + '/routes/' + modelName + 'Routes.js', router, null, cb);
        });
    } else {
        ft.createDirIfIsNotDefined(path, modelName, function () {
            router = router.replace(/{controllerPath}/g, '\'./' + modelName + 'Controller.js\'');
            ft.writeFile(path + '/' + modelName + '/' + modelName + 'Routes.js', router, null, cb);
        });
    }
}

/**
 * Generate Controller
 * @param {string} path
 * @param {string} modelName
 * @param {array} modelFields
 * @param {string} generateMethod
 * @param {function} cb
 */
function generateController(path, modelName, modelFields, generateMethod, cb) {
    var controller = ft.loadTemplateSync('controller.js');

    var updateFields = '';
    var createFields = os.EOL;

    modelFields.forEach(function (f, index, fields) {
        var field = f.name;

        updateFields += modelName + '.' + field + ' = req.body.' + field + ' ? req.body.' + field + ' : ' +
            modelName + '.' + field + ';';
        updateFields += os.EOL + '\t\t\t';

        createFields += '\t\t\t' + field + ' : req.body.' + field;
        createFields += ((fields.length - 1) > index) ? ',' + os.EOL : '';
    });

    controller = controller.replace(/{modelName}/g, modelName + 'Model');
    controller = controller.replace(/{name}/g, modelName);
    controller = controller.replace(/{pluralName}/g, formatTools.pluralize(modelName));
    controller = controller.replace(/{controllerName}/g, modelName + 'Controller');
    controller = controller.replace(/{createFields}/g, createFields);
    controller = controller.replace(/{updateFields}/g, updateFields);

    if (generateMethod === 't') {
        ft.createDirIfIsNotDefined(path, 'controllers', function () {
            controller = controller.replace(/{modelPath}/g, '\'../models/' + modelName + 'Model.js\'');
            ft.writeFile(path + '/controllers/' + modelName + 'Controller.js', controller, null, cb);
        });
    } else {
        ft.createDirIfIsNotDefined(path, modelName, function () {
            controller = controller.replace(/{modelPath}/g, '\'./' + modelName + 'Model.js\'');
            ft.writeFile(path + '/' + modelName + '/' + modelName + 'Controller.js', controller, null, cb);
        });
    }
}

/**
 * Generate a Angular model
 * @param {string} path
 * @param {string} modelName
 * @param {array} modelFields
 * @param {string} generateMethod
 * @param {function} cb
 */
function generateNgModel(path, modelName, modelFields, generateMethod, cb) {
    var module = snakeCase(modelName).split('_')[0];
    var component = snakeCase(modelName).split('_')[1];
    
    var fields = formatTools.getFieldsForNgModelTemplate(modelFields);
    var model = ft.loadTemplateSync('ng/model.js');

    model = model.replace(/{modelName}/, modelName);
    model = model.replace(/{fields}/, fields);


    ft.createDirIfIsNotDefined('../angular/src/app/modules', module, function() {
        ft.createDirIfIsNotDefined('../angular/src/app/modules/' + module, component, function() {
            ft.writeFile('../angular/src/app/modules/' + module + '/' + component + '/' + component + '.model.ts', model, null, cb);
        });
    });

    // ft.createDirIfIsNotDefined(path, modelName, function () {
    //     ft.createDirIfIsNotDefined(path + '/' + modelName, component, function () {
    //         ft.writeFile(path + '/' + modelName + '/' + component + '/' + component + '.model.ts', model, null, cb);
    //     });
    // });


}

function genNgMainComponent(path, modelName, cb) {
    var module = snakeCase(modelName).split('_')[0];
    var component = snakeCase(modelName).split('_')[1];

    var template = ft.loadTemplateSync('ng/main.component.js');
    template = template.replace(/{ComponentNameLC}/g, component.toLowerCase());
    template = template.replace(/{ComponentNameCC}/g, formatTools.jsUcfirst(component));
    
    ft.createDirIfIsNotDefined('../angular/src/app/modules', module, function() {
        ft.createDirIfIsNotDefined('../angular/src/app/modules/' + module, component, function() {
            ft.writeFile('../angular/src/app/modules/' + module + '/' + component + '/' + component + '.component.ts', template, null, cb);
        });
    });
}

function genNgMainComponentTemplate(path, modelName, cb) {
    var module = snakeCase(modelName).split('_')[0];
    var component = snakeCase(modelName).split('_')[1];

    var template = ft.loadTemplateSync('ng/main.component.html.js');
    template = template.replace(/{ComponentName}/, snakeCase(modelName).replace(/_/, '-').toUpperCase());
    
    ft.createDirIfIsNotDefined('../angular/src/app/modules', module, function() {
        ft.createDirIfIsNotDefined('../angular/src/app/modules/' + module, component, function() {
            ft.writeFile('../angular/src/app/modules/' + module + '/' + component + '/' + component + '.component.html', template, null, cb);
        });
    });
}

function generateNgData(path, modelName, modelFields, generateMethod, cb) {
    // return true;
}

function generateNgService(path, modelName, modelFields, generateMethod, cb) {
    // return true;
}

function generateNgComponents(path, modelName, modelFields, generateMethod, cb) {
    // return true;
}

function generateNgTemplates(path, modelName, modelFields, generateMethod, cb) {
    // return true;
}

module.exports = {
    generateModel: generateModel,
    generateRouter: generateRouter,
    generateController: generateController,
    generateNgModel: generateNgModel,
    genNgMainComponentTemplate: genNgMainComponentTemplate,
    genNgMainComponent: genNgMainComponent
};

/**
,
    generateNgData: generateNgData,
    generateNgService: generateNgService,
    generateNgComponents: generateNgComponents,
    generateNgTemplates: generateNgTemplates
    */