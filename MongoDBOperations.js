/**
 * Created by dinusha on 12/6/2016.
 */
var Promise = require('bluebird');
var IntegrationData = require('dvp-mongomodels/model/IntegrationData').IntegrationData;
var ReportEmail = require('dvp-mongomodels/model/ReportEmailConfig').ReportEmailConfig;
var RawCdr = require('dvp-mongomodels/model/Cdr').Cdr;
var User = require('dvp-mongomodels/model/User');

var config = require('config');


var getUserById = function(id, companyId, tenantId)
{
    return new Promise(function(fulfill, reject)
    {
        try
        {
            if(id)
            {
                User.findOne({company: companyId, tenant: tenantId, _id: id})
                    .exec( function(err, user)
                    {
                        if (err)
                        {
                            reject(err);
                        }
                        else
                        {
                            fulfill(user);
                        }
                    });
            }
            else
            {
                fulfill(null);
            }

        }
        catch(ex)
        {
            reject(ex);
        }
    });


};

module.exports.getUserById = getUserById;