var restify = require('restify');
var mongomodels = require('dvp-mongomodels');
var config = require('config');
var nodeUuid = require('node-uuid');
var logger = require('dvp-common/LogHandler/CommonLogHandler.js').logger;
var jwt = require('restify-jwt');
var secret = require('dvp-common/Authentication/Secret.js');
var authorization = require('dvp-common/Authentication/Authorization.js');
var messageFormatter = require('dvp-common/CommonMessageGenerator/ClientMessageJsonFormatter.js');

var Promise = require('bluebird');
var ExternalUserFacility = require('dvp-mongomodels/model/ExternalUserFacility');

var healthcheck = require('dvp-healthcheck/DBHealthChecker');

var hostIp = config.Host.Ip;
var hostPort = config.Host.Port;

var server = restify.createServer({
    name: 'DVP-ExtUserFacility'
});


server.use(restify.CORS());
server.use(restify.fullResponse());
server.pre(restify.pre.userAgentConnection());


restify.CORS.ALLOW_HEADERS.push('authorization');

server.use(restify.acceptParser(server.acceptable));
server.use(restify.queryParser());
server.use(restify.bodyParser());

var hc = new healthcheck(server, {mongo: mongomodels.connection});
hc.Initiate();

var getExtUserFacilitiesBySSN = function(ssn){
    return new Promise(function(fulfill, reject){
        try {
            if(ssn) {
                ExternalUserFacility.findOne({ssn: ssn})
                    .exec( function(err, user) {
                        if (err)
                            reject(err);
                        else
                            fulfill(user);
                    });
            } else {
                fulfill(null);
            }
        } catch(ex) {
            reject(ex);
        }
    });
};


server.get('/DVP/API/:version/ExternalUser/facilities/:referenceID/all', jwt({secret: secret.Secret}), authorization({}), function(req, res, next){
    var emptyArr = [];
    var reqId = nodeUuid.v1();
    try
    {
        var companyId = req.user.company;
        var tenantId = req.user.tenant;

        var ssn = req.params.referenceID;

        if (!companyId || !tenantId)
        {
            throw new Error("Invalid company or tenant");
        }

        logger.debug('[DVP-ExtUserFacility.GetExternalUserFacility] - [%s] - HTTP Request Received', reqId);

        getExtUserFacilitiesBySSN(ssn)
        .then(function(response) {

                if(response.facitlity_type){
                    var jsonString = JSON.stringify(response.facitlity_type)
                }else{
                    var jsonString = JSON.stringify({});
                }
                logger.debug('[DVP-CDRProcessor.GetExternalUserFacility] - [%s] - API RESPONSE : %s', reqId, jsonString);
                res.end(jsonString);

        })
        .catch(function(err) {
            var jsonString = messageFormatter.FormatMessage(err, "ERROR", false, emptyArr);
            logger.debug('[DVP-CDRProcessor.GetExternalUserFacility] - [%s] - API RESPONSE : %s', reqId, jsonString);
            res.end(jsonString);
        });

    } catch(ex) {
        var jsonString = messageFormatter.FormatMessage(ex, "ERROR", false, emptyArr);
        logger.debug('[DVP-CDRProcessor.GetExternalUserFacility] - [%s] - API RESPONSE : %s', reqId, jsonString);
        res.end(jsonString);
    }

    return next();
});

server.get('/DVP/API/:version/ExternalUser/facilities/:referenceID', jwt({secret: secret.Secret}), authorization({}), function(req, res, next){
    var emptyArr = [];
    var reqId = nodeUuid.v1();
    try
    {
        var companyId = req.user.company;
        var tenantId = req.user.tenant;

        var ssn = req.params.referenceID;

        if (!companyId || !tenantId)
        {
            throw new Error("Invalid company or tenant");
        }

        logger.debug('[DVP-ExtUserFacility.GetExternalUserFacility] - [%s] - HTTP Request Received', reqId);

        getExtUserFacilitiesBySSN(ssn)
        .then(function(response) {
            var responseObj = {};
        
            if(response.facitlity_type){
        
                for (let [fac, values] of Object.entries(response.facitlity_type)) {
                    responseObj[fac] = responseObj[fac] || '';
                    values.forEach(val => {
                        responseObj[fac] += val.facility_id + " | ";
                    });
                  }
                
            }
        
            var jsonString = JSON.stringify(responseObj);
            
            logger.debug('[DVP-CDRProcessor.GetExternalUserFacility] - [%s] - API RESPONSE : %s', reqId, jsonString);
            res.end(jsonString);
        })
        .catch(function(err) {
            var jsonString = messageFormatter.FormatMessage(err, "ERROR", false, emptyArr);
            logger.debug('[DVP-CDRProcessor.GetExternalUserFacility] - [%s] - API RESPONSE : %s', reqId, jsonString);
            res.end(jsonString);
        });

    } catch(ex) {
        var jsonString = messageFormatter.FormatMessage(ex, "ERROR", false, emptyArr);
        logger.debug('[DVP-CDRProcessor.GetExternalUserFacility] - [%s] - API RESPONSE : %s', reqId, jsonString);
        res.end(jsonString);
    }

    return next();
});

////////////////////////////////////////////////////////////////////////////////

function Crossdomain(req,res,next){


    var xml='<?xml version=""1.0""?><!DOCTYPE cross-domain-policy SYSTEM ""http://www.macromedia.com/xml/dtds/cross-domain-policy.dtd""> <cross-domain-policy>    <allow-access-from domain=""*"" />        </cross-domain-policy>';

    var xml='<?xml version="1.0"?>\n';

    xml+= '<!DOCTYPE cross-domain-policy SYSTEM "/xml/dtds/cross-domain-policy.dtd">\n';
    xml+='';
    xml+=' \n';
    xml+='\n';
    xml+='';
    req.setEncoding('utf8');
    res.end(xml);

}

function Clientaccesspolicy(req,res,next){


    var xml='<?xml version="1.0" encoding="utf-8" ?>       <access-policy>        <cross-domain-access>        <policy>        <allow-from http-request-headers="*">        <domain uri="*"/>        </allow-from>        <grant-to>        <resource include-subpaths="true" path="/"/>        </grant-to>        </policy>        </cross-domain-access>        </access-policy>';
    req.setEncoding('utf8');
    res.end(xml);

}

server.get("/crossdomain.xml",Crossdomain);
server.get("/clientaccesspolicy.xml",Clientaccesspolicy);

server.listen(hostPort, hostIp, function () {
    console.log('%s listening at %s', server.name, server.url);
});


