var {modelName} = require({modelPath});

/**
 * {controllerName}.js
 *
 * @description :: Server-side logic for managing {pluralName}.
 */
 module.exports = {

    search: function(req, res) {
        var terms = req.params.terms;
        
        var rawQuery = {
            from: 0,
            size: 25,
            query: { query_string: { "query":terms } } 
        };

        {modelName}.esSearch(rawQuery, { hydrate:false }, function(err,results) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when searching {name}.',
                    error: err
                });
            } 
            return res.json({ terms:terms, total:results.hits.total, max_score: results.hits.max_score, authUsers:results.hits.hits });
        });

    },

    bootstrap: function(req, res) {
        {modelName}.createMapping(function(err, mapping){  
          if(err){
            console.log('error creating mapping (you can safely ignore this)');
            console.log(err);
          }else{
            console.log('mapping created for {modelName}!');
            console.log(mapping);
            {modelName}.synchronize(function(err, result) {

            });
          }
          return res.status(200);
        });
    },

    /**
     * {controllerName}.list()
     */
     list: function (req, res) {
        var order = '';
        if(req.query.order == 'desc') order = '-';

        var query = {};
        var options = {
            // select: '-password -__v -email', 
            offset: +req.query.offset, 
            limit: +req.query.max,
            // populate: 'roles',
            lean: false,
            sort: order + req.query.sort
        };

        {modelName}.paginate(query, options, function (err, {pluralName}) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting {name}.',
                    error: err
                });
            }
            return res.json({pluralName});
        });


    },

    /**
     * {controllerName}.show()
     */
     show: function (req, res) {
        var id = req.params.id;
        {modelName}.findOne({_id: id}, function (err, {name}) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting {name}.',
                    error: err
                });
            }
            if (!{name}) {
                return res.status(404).json({
                    message: 'No such {name}'
                });
            }
            return res.json({name});
        });
    },

    /**
     * {controllerName}.create()
     */
     create: function (req, res) {
        var {name} = new {modelName}({{createFields}
    });

        {name}.save(function (err, {name}) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when creating {name}',
                    error: err
                });
            }
            return res.status(201).json({name});
        });
    },

    /**
    * {controllerName}.update()
    */
    update: function (req, res) {
        var id = req.params.id;
        {modelName}.findOne({_id: id}, function (err, {name}) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting {name}',
                    error: err
                });
            }
            if (!{name}) {
                return res.status(404).json({
                    message: 'No such {name}'
                });
            }

            {updateFields}
            {name}.save(function (err, {name}) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when updating {name}.',
                        error: err
                    });
                }

                return res.json({name});
            });
        });
    },

    /**
    * {controllerName}.remove()
    */
    remove: function (req, res) {
        var id = req.params.id;
        {modelName}.findByIdAndRemove(id, function (err, {name}) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when deleting the {name}.',
                    error: err
                });
            }
            return res.status(204).json();
        });
    }
};
